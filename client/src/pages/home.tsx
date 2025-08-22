import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
// import profileImage from "@assets/IMG_5282_1753389516466.jpeg";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useTabSwipe } from "@/hooks/use-tab-swipe";
import europaIcon from "@assets/europamap.png";
import asiaIcon from "@assets/asiamap.png";
import americasIcon from "@assets/americasmaps.png";
import africaIcon from "@assets/africacontinentmap.png";
import middleEastIcon from "@assets/middleeastcontinentmap.png";
import oceaniaIcon from "@assets/oceaniacontinentmap.png";
import locationPinIcon from "@assets/locationpin.png";
import qrScanIcon from "@assets/qrscan.png";
import signalEsimIcon from "@assets/signalesim.png";
import europeCoverageIcon from "@assets/europamap.png";
import globalCoverageIcon from "@assets/globalcoverage.png";

import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import CountryCard from "@/components/country-card";
import SkeletonCard from "@/components/skeleton-card";
import ErrorBoundary from "@/components/error-boundary";
import OfflinePage from "@/components/offline-page";
import CheckoutModal from "@/components/checkout-modal";

import type { Country, Package } from "@shared/schema";

export default function HomeScreen() {
  const [location, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState('local');

  // Check URL parameters for tab selection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['local', 'regional', 'global'].includes(tabParam)) {
      setSelectedTab(tabParam);
    }
  }, [location]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [showCountriesModal, setShowCountriesModal] = useState(false);
  const [showGlobalCoverageModal, setShowGlobalCoverageModal] = useState(false);

  // Touch/swipe states for global coverage modal dismissal
  const [globalCoverageModalStartY, setGlobalCoverageModalStartY] = useState<number>(0);
  const [globalCoverageModalCurrentY, setGlobalCoverageModalCurrentY] = useState<number>(0);
  const [isGlobalCoverageModalDragging, setIsGlobalCoverageModalDragging] = useState<boolean>(false);
  const globalCoverageModalRef = useRef<HTMLDivElement>(null);
  
  // Touch/swipe states for Quick Actions modal dismissal
  const [quickActionsStartY, setQuickActionsStartY] = useState<number>(0);
  const [quickActionsCurrentY, setQuickActionsCurrentY] = useState<number>(0);
  const [isQuickActionsDragging, setIsQuickActionsDragging] = useState<boolean>(false);
  const quickActionsModalRef = useRef<HTMLDivElement>(null);
  const [selectedEuropaPlan, setSelectedEuropaPlan] = useState<number | null>(null); // No default selection
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [esimCount, setEsimCount] = useState(1);
  
  // Global tab states
  const [globalPlanType, setGlobalPlanType] = useState<'data' | 'data-voice-sms'>('data');
  const [selectedGlobalPlan, setSelectedGlobalPlan] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollableContentRef = useRef<HTMLDivElement>(null);
  const [showPlanInfoModal, setShowPlanInfoModal] = useState(false);
  const [showEuropePlanInfoModal, setShowEuropePlanInfoModal] = useState(false);
  const planInfoModalRef = useRef<HTMLDivElement>(null);
  const europePlanInfoModalRef = useRef<HTMLDivElement>(null);

  // Europa plan data
  const europaPlans = [
    { id: 1, duration: '3 Days', data: '500 MB', price: '€4.99', dailyPrice: '€1.66 /day' },
    { id: 2, duration: '7 Days', data: '1 GB', price: '€7.99', dailyPrice: '€1.14 /day' },
    { id: 3, duration: '15 Days', data: '2 GB', price: '€12.99', dailyPrice: '€0.87 /day' },
    { id: 4, duration: '30 Days', data: '3 GB', price: '€19.99', dailyPrice: '€0.67 /day' },
    { id: 5, duration: '30 Days', data: '5 GB', price: '€24.99', dailyPrice: '€0.83 /day' },
    { id: 6, duration: '30 Days', data: '10 GB', price: '€34.99', dailyPrice: '€1.17 /day' },
    { id: 7, duration: '30 Days', data: '20 GB', price: '€49.99', dailyPrice: '€1.67 /day' },
    { id: 8, duration: '30 Days', data: '50 GB', price: '€69.99', dailyPrice: '€2.33 /day' },
    { id: 9, duration: '90 Days', data: '50 GB', price: '€89.99', dailyPrice: '€1.00 /day' },
    { id: 10, duration: '180 Days', data: '100 GB', price: '€129.99', dailyPrice: '€0.72 /day' },
    { id: 11, duration: '10 Days', data: 'Unlimited', price: '€39.99', dailyPrice: '€4.00 /day' }
  ];

  // Global plan data - Data only
  const globalDataPlans = [
    { id: 1, duration: '7 Days', data: '1 GB', price: '€9.99', dailyPrice: '€1.43 /day' },
    { id: 2, duration: '15 Days', data: '3 GB', price: '€19.99', dailyPrice: '€1.33 /day' },
    { id: 3, duration: '20 Days', data: '5 GB', price: '€29.99', dailyPrice: '€1.50 /day' },
    { id: 4, duration: '30 Days', data: '10 GB', price: '€49.99', dailyPrice: '€1.67 /day' }
  ];

  // Global plan data - Data + Voice + SMS
  const globalVoiceSmsPlans = [
    { id: 1, duration: '7 Days', data: '1 GB', voice: '100 min', sms: '50 SMS', price: '€14.99', dailyPrice: '€2.14 /day' },
    { id: 2, duration: '15 Days', data: '3 GB', voice: '200 min', sms: '100 SMS', price: '€28.99', dailyPrice: '€1.93 /day' },
    { id: 3, duration: '20 Days', data: '5 GB', voice: '300 min', sms: '150 SMS', price: '€42.99', dailyPrice: '€2.15 /day' },
    { id: 4, duration: '30 Days', data: '10 GB', voice: '500 min', sms: '250 SMS', price: '€69.99', dailyPrice: '€2.33 /day' }
  ];

  // Mock Europa country for checkout modal
  const europaCountry = {
    name: 'Europe',
    code: 'EU',
    flagUrl: 'https://flagcdn.com/w40/eu.png'
  };

  // Europa coverage countries - these are in regional packages
  const europaCoverageCountries = [
    'france', 'germany', 'spain', 'italy', 'netherlands', 'belgium', 'austria', 
    'portugal', 'greece', 'poland', 'czech republic', 'hungary', 'romania', 
    'bulgaria', 'croatia', 'slovakia', 'slovenia', 'estonia', 'latvia', 
    'lithuania', 'luxembourg', 'malta', 'cyprus', 'ireland', 'denmark', 
    'sweden', 'finland', 'norway', 'iceland', 'switzerland', 'united kingdom',
    'turkey', 'albania', 'bosnia and herzegovina', 'montenegro', 'serbia'
  ];

  // Global coverage data for modal
  const globalCoverage = [
    {
      name: "United States",
      code: "US",
      operators: [
        { name: "Verizon", networks: ["5G", "LTE"] },
        { name: "AT&T", networks: ["5G", "LTE"] },
        { name: "T-Mobile", networks: ["5G", "LTE"] }
      ]
    },
    {
      name: "Canada",
      code: "CA",
      operators: [
        { name: "Bell", networks: ["5G", "LTE"] },
        { name: "Rogers", networks: ["5G", "LTE"] },
        { name: "Telus", networks: ["5G", "LTE"] }
      ]
    },
    {
      name: "United Kingdom",
      code: "GB",
      operators: [
        { name: "EE", networks: ["5G", "LTE"] },
        { name: "O2", networks: ["5G", "LTE"] },
        { name: "Vodafone", networks: ["5G", "LTE"] }
      ]
    },
    {
      name: "Germany",
      code: "DE",
      operators: [
        { name: "Deutsche Telekom", networks: ["5G", "LTE"] },
        { name: "Vodafone", networks: ["5G", "LTE"] },
        { name: "O2", networks: ["5G", "LTE"] }
      ]
    },
    {
      name: "France",
      code: "FR",
      operators: [
        { name: "Orange", networks: ["5G", "LTE"] },
        { name: "SFR", networks: ["5G", "LTE"] },
        { name: "Bouygues", networks: ["5G", "LTE"] }
      ]
    },
    {
      name: "Japan",
      code: "JP",
      operators: [
        { name: "NTT Docomo", networks: ["5G", "LTE"] },
        { name: "SoftBank", networks: ["5G", "LTE"] },
        { name: "KDDI", networks: ["5G", "LTE"] }
      ]
    },
    {
      name: "Singapore",
      code: "SG",
      operators: [
        { name: "Singtel", networks: ["5G", "LTE"] },
        { name: "StarHub", networks: ["5G", "LTE"] },
        { name: "M1", networks: ["5G", "LTE"] }
      ]
    },
    {
      name: "Australia",
      code: "AU",
      operators: [
        { name: "Telstra", networks: ["5G", "LTE"] },
        { name: "Optus", networks: ["5G", "LTE"] },
        { name: "Vodafone", networks: ["5G", "LTE"] }
      ]
    },
    {
      name: "Turkey",
      code: "TR",
      operators: [
        { name: "Turkcell", networks: ["5G", "LTE"] },
        { name: "Vodafone", networks: ["5G", "LTE"] },
        { name: "Türk Telekom", networks: ["5G", "LTE"] }
      ]
    },
    {
      name: "Thailand",
      code: "TH",
      operators: [
        { name: "AIS", networks: ["5G", "LTE"] },
        { name: "TrueMove", networks: ["5G", "LTE"] },
        { name: "dtac", networks: ["5G", "LTE"] }
      ]
    }
  ];

  // European countries with operators and network types
  const europeanCoverage = [
    {
      country: 'Austria',
      flag: 'https://flagcdn.com/w40/at.png',
      operators: [
        { name: 'A1', networks: ['LTE', '5G'] },
        { name: 'T-Mobile', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Belgium',
      flag: 'https://flagcdn.com/w40/be.png',
      operators: [
        { name: 'Base', networks: ['LTE', '5G'] },
        { name: 'Orange', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Bulgaria',
      flag: 'https://flagcdn.com/w40/bg.png',
      operators: [
        { name: 'Vivacom', networks: ['LTE', '5G'] },
        { name: 'Telenor', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Croatia',
      flag: 'https://flagcdn.com/w40/hr.png',
      operators: [
        { name: 'Tele2', networks: ['LTE', '5G'] },
        { name: 'T-Mobile', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Cyprus',
      flag: 'https://flagcdn.com/w40/cy.png',
      operators: [
        { name: 'Epic', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Czech Republic',
      flag: 'https://flagcdn.com/w40/cz.png',
      operators: [
        { name: 'TMobile', networks: ['LTE', '5G'] },
        { name: 'O2', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Denmark',
      flag: 'https://flagcdn.com/w40/dk.png',
      operators: [
        { name: 'TDC/nuuday', networks: ['LTE', '5G'] },
        { name: 'Telenor', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Estonia',
      flag: 'https://flagcdn.com/w40/ee.png',
      operators: [
        { name: 'Elisa', networks: ['LTE', '5G'] },
        { name: 'Tele2', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Finland',
      flag: 'https://flagcdn.com/w40/fi.png',
      operators: [
        { name: 'Alcom', networks: ['LTE', '5G'] },
        { name: 'Elisa', networks: ['LTE', '5G'] },
        { name: 'DNA', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'France',
      flag: 'https://flagcdn.com/w40/fr.png',
      operators: [
        { name: 'Bouygues/DigiCel', networks: ['3G', 'LTE'] },
        { name: 'Bouygues', networks: ['LTE', '5G'] },
        { name: 'Orange', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Germany',
      flag: 'https://flagcdn.com/w40/de.png',
      operators: [
        { name: 'O2', networks: ['LTE', '5G'] },
        { name: 'TMobile', networks: ['LTE', '5G'] },
        { name: 'Vodafone', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Greece',
      flag: 'https://flagcdn.com/w40/gr.png',
      operators: [
        { name: 'Wind', networks: ['LTE', '5G'] },
        { name: 'Cosmote', networks: ['LTE', '5G'] },
        { name: 'Vodafone', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Hungary',
      flag: 'https://flagcdn.com/w40/hu.png',
      operators: [
        { name: 'Telenor', networks: ['LTE', '5G'] },
        { name: 'T-Mobile', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Iceland',
      flag: 'https://flagcdn.com/w40/is.png',
      operators: [
        { name: 'Fjarskipti(VF)', networks: ['LTE', '5G'] },
        { name: 'Nova', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Ireland',
      flag: 'https://flagcdn.com/w40/ie.png',
      operators: [
        { name: 'Meteor', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Italy',
      flag: 'https://flagcdn.com/w40/it.png',
      operators: [
        { name: 'Wind Italy', networks: ['LTE', '5G'] },
        { name: 'Vodafone', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Latvia',
      flag: 'https://flagcdn.com/w40/lv.png',
      operators: [
        { name: 'Bite', networks: ['LTE', '5G'] },
        { name: 'Tele2', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Lithuania',
      flag: 'https://flagcdn.com/w40/lt.png',
      operators: [
        { name: 'Bite', networks: ['LTE', '5G'] },
        { name: 'Tele2', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Luxembourg',
      flag: 'https://flagcdn.com/w40/lu.png',
      operators: [
        { name: 'Orange', networks: ['LTE', '5G'] },
        { name: 'Tango', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Malta',
      flag: 'https://flagcdn.com/w40/mt.png',
      operators: [
        { name: 'Vodafone', networks: ['LTE', '5G'] },
        { name: 'Melita', networks: ['LTE', '5G'] },
        { name: 'GO', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Netherlands',
      flag: 'https://flagcdn.com/w40/nl.png',
      operators: [
        { name: 'KPN', networks: ['LTE', '5G'] },
        { name: 'Vodafone', networks: ['LTE', '5G'] },
        { name: 'Odido', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Norway',
      flag: 'https://flagcdn.com/w40/no.png',
      operators: [
        { name: 'Telenor', networks: ['LTE', '5G'] },
        { name: 'Telia', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Poland',
      flag: 'https://flagcdn.com/w40/pl.png',
      operators: [
        { name: 'Plus', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Portugal',
      flag: 'https://flagcdn.com/w40/pt.png',
      operators: [
        { name: 'Optimus', networks: ['LTE', '5G'] },
        { name: 'Vodafone', networks: ['LTE', '5G'] },
        { name: 'TMN', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Romania',
      flag: 'https://flagcdn.com/w40/ro.png',
      operators: [
        { name: 'Orange', networks: ['LTE', '5G'] },
        { name: 'DIGI', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Slovakia',
      flag: 'https://flagcdn.com/w40/sk.png',
      operators: [
        { name: 'O2', networks: ['LTE', '5G'] },
        { name: 'SlovakTelekom (DT)', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Slovenia',
      flag: 'https://flagcdn.com/w40/si.png',
      operators: [
        { name: 'Telemach', networks: ['LTE', '5G'] },
        { name: 'A1', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Spain',
      flag: 'https://flagcdn.com/w40/es.png',
      operators: [
        { name: 'Movistar', networks: ['LTE', '5G'] },
        { name: 'Orange', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Sweden',
      flag: 'https://flagcdn.com/w40/se.png',
      operators: [
        { name: 'Telenor(Vodafone)', networks: ['LTE', '5G'] },
        { name: '3', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'Switzerland',
      flag: 'https://flagcdn.com/w40/ch.png',
      operators: [
        { name: 'Salt', networks: ['LTE', '5G'] },
        { name: 'Sunrise', networks: ['LTE', '5G'] }
      ]
    },
    {
      country: 'United Kingdom',
      flag: 'https://flagcdn.com/w40/gb.png',
      operators: [
        { name: 'Sure Guernsey', networks: ['3G', 'LTE'] },
        { name: 'Manx Telecom', networks: ['3G', 'LTE'] },
        { name: 'O2', networks: ['LTE', '5G'] },
        { name: 'EE', networks: ['LTE', '5G'] },
        { name: 'Vodafone', networks: ['LTE', '5G'] },
        { name: 'H3G', networks: ['LTE', '5G'] }
      ]
    }
  ];



  // Tab order for swipe navigation
  const tabOrder = ['local', 'regional', 'global'];

  // Handle tab change with smooth animation
  const handleTabChange = (newTab: string) => {
    if (newTab === selectedTab || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Reset plan selections when changing tabs
    setSelectedEuropaPlan(null);
    setSelectedGlobalPlan(null);
    
    // Fade out current content, then switch tab
    setTimeout(() => {
      setSelectedTab(newTab);
      // Fade in new content
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 150);
  };

  // Swipe navigation handlers
  const handleSwipeLeft = () => {
    const currentIndex = tabOrder.indexOf(selectedTab);
    const nextIndex = (currentIndex + 1) % tabOrder.length;
    handleTabChange(tabOrder[nextIndex]);
  };

  const handleSwipeRight = () => {
    const currentIndex = tabOrder.indexOf(selectedTab);
    const prevIndex = currentIndex === 0 ? tabOrder.length - 1 : currentIndex - 1;
    handleTabChange(tabOrder[prevIndex]);
  };


  const [placeholderText, setPlaceholderText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showCompatibilityCheck, setShowCompatibilityCheck] = useState(false);
  const [compatibilityResult, setCompatibilityResult] = useState<{
    isCompatible: boolean;
    deviceName: string;
    details: string;
  } | null>(null);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  // Smart search states
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showFullScreenSearch, setShowFullScreenSearch] = useState(false);
  const [isSearchTransitioning, setIsSearchTransitioning] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    localCountry: Country | null;
    regionalPackages: any[] | null;
    globalPackages: any[] | null;
    coverageType: 'europa' | 'global' | 'none';
  }>({
    localCountry: null,
    regionalPackages: null,
    globalPackages: null,
    coverageType: 'none'
  });
  
  // Recent searches state
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const isOnline = useOnlineStatus();

  // Touch/swipe states for coverage modal dismissal
  const [modalStartY, setModalStartY] = useState<number>(0);
  const [modalCurrentY, setModalCurrentY] = useState<number>(0);
  const [isModalDragging, setIsModalDragging] = useState<boolean>(false);
  const coverageModalRef = useRef<HTMLDivElement>(null);

  // Touch/swipe states for plan info modal dismissal
  const [planModalStartY, setPlanModalStartY] = useState<number>(0);
  const [planModalCurrentY, setPlanModalCurrentY] = useState<number>(0);
  const [isPlanModalDragging, setIsPlanModalDragging] = useState<boolean>(false);

  // Touch/swipe states for "How it Works" modal dismissal
  const [howItWorksStartY, setHowItWorksStartY] = useState<number>(0);
  const [howItWorksCurrentY, setHowItWorksCurrentY] = useState<number>(0);
  const [isHowItWorksDragging, setIsHowItWorksDragging] = useState<boolean>(false);
  const howItWorksModalRef = useRef<HTMLDivElement>(null);

  // Touch/swipe states for compatibility check modal dismissal
  const [compatibilityStartY, setCompatibilityStartY] = useState<number>(0);
  const [compatibilityCurrentY, setCompatibilityCurrentY] = useState<number>(0);
  const [isCompatibilityDragging, setIsCompatibilityDragging] = useState<boolean>(false);
  const compatibilityModalRef = useRef<HTMLDivElement>(null);

  // Touch/swipe states for Europe plan info modal dismissal
  const [europePlanModalStartY, setEuropePlanModalStartY] = useState<number>(0);
  const [europePlanModalCurrentY, setEuropePlanModalCurrentY] = useState<number>(0);
  const [isEuropePlanModalDragging, setIsEuropePlanModalDragging] = useState<boolean>(false);

  // Filter European coverage based on search
  const filteredEuropeanCoverage = europeanCoverage.filter(item => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const countryMatch = item.country.toLowerCase().includes(query);
    const operatorMatch = item.operators.some(op => 
      op.name.toLowerCase().includes(query)
    );
    
    return countryMatch || operatorMatch;
  });

  // Filter Global coverage based on search
  const filteredGlobalCoverage = globalCoverage.filter(item => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const countryMatch = item.name.toLowerCase().includes(query);
    const operatorMatch = item.operators.some(op => 
      op.name.toLowerCase().includes(query)
    );
    
    return countryMatch || operatorMatch;
  });

  // Prevent body scroll when coverage modal is open
  useEffect(() => {
    if (showCountriesModal) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      
      // Cleanup function to restore scroll position
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
      };
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }
  }, [showCountriesModal]);



  // Prevent body scroll when global coverage modal is open
  useEffect(() => {
    if (showGlobalCoverageModal) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      
      // Cleanup function to restore scroll position
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
      };
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }
  }, [showGlobalCoverageModal]);

  // Prevent body scroll when plan info modal is open
  useEffect(() => {
    if (showPlanInfoModal) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      
      // Cleanup function to restore scroll position
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
      };
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }
  }, [showPlanInfoModal]);

  // Store scroll position for How It Works modal
  const [howItWorksScrollY, setHowItWorksScrollY] = useState(0);

  // Complete scroll lock system for How It Works modal
  useEffect(() => {
    if (showHowItWorks) {
      // Block all scroll events
      const preventScroll = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      
      // Add event listeners to prevent scroll
      window.addEventListener('scroll', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
      window.addEventListener('wheel', preventScroll, { passive: false });
      document.addEventListener('scroll', preventScroll, { passive: false });
      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('wheel', preventScroll, { passive: false });
      
      return () => {
        // Remove event listeners
        window.removeEventListener('scroll', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
        window.removeEventListener('wheel', preventScroll);
        document.removeEventListener('scroll', preventScroll);
        document.removeEventListener('touchmove', preventScroll);
        document.removeEventListener('wheel', preventScroll);
        
        // Restore body styles
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.documentElement.style.overflow = '';
        
        // Restore scroll position
        if (howItWorksScrollY > 0) {
          window.scrollTo(0, howItWorksScrollY);
        }
      };
    }
  }, [showHowItWorks, howItWorksScrollY]);

  // Prevent body scroll when compatibility check modal is open
  useEffect(() => {
    if (showCompatibilityCheck) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      
      // Cleanup function to restore scroll position
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
      };
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }
  }, [showCompatibilityCheck]);

  // Prevent body scroll when Europe plan info modal is open
  useEffect(() => {
    if (showEuropePlanInfoModal) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      
      // Cleanup function to restore scroll position
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
      };
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }
  }, [showEuropePlanInfoModal]);

  // Prevent body scroll when Quick Actions modal is open
  useEffect(() => {
    if (showQuickActions) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      
      // Cleanup function to restore scroll position
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showQuickActions]);

  // Touch event handlers for plan info modal swipe-down dismissal
  const handlePlanInfoModalTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setPlanModalStartY(touch.clientY);
    setPlanModalCurrentY(touch.clientY);
    setIsPlanModalDragging(true);
  };

  const handlePlanInfoModalTouchMove = (e: React.TouchEvent) => {
    if (!isPlanModalDragging) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - planModalStartY;
    
    setPlanModalCurrentY(touch.clientY);
    
    // Only allow downward swipes (positive deltaY)
    if (deltaY > 0) {
      e.preventDefault();
      
      if (planInfoModalRef.current) {
        planInfoModalRef.current.style.transform = `translateY(${Math.min(deltaY, 300)}px)`;
        planInfoModalRef.current.style.opacity = `${Math.max(1 - deltaY / 300, 0.3)}`;
      }
    }
  };

  const handlePlanInfoModalTouchEnd = (e: React.TouchEvent) => {
    if (!isPlanModalDragging) return;
    
    const deltaY = planModalCurrentY - planModalStartY;
    
    // If swiped down more than 80px, close modal
    if (deltaY > 80 && planInfoModalRef.current) {
      // Animate out
      planInfoModalRef.current.style.transform = 'translateY(100%)';
      planInfoModalRef.current.style.opacity = '0';
      setTimeout(() => {
        setShowPlanInfoModal(false);
      }, 200);
    } else if (planInfoModalRef.current) {
      // Snap back to original position
      planInfoModalRef.current.style.transform = 'translateY(0)';
      planInfoModalRef.current.style.opacity = '1';
    }
    
    setIsPlanModalDragging(false);
    setPlanModalStartY(0);
    setPlanModalCurrentY(0);
  };

  // Touch event handlers for "How it Works" modal swipe-down dismissal
  const handleHowItWorksModalTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setHowItWorksStartY(touch.clientY);
    setHowItWorksCurrentY(touch.clientY);
    setIsHowItWorksDragging(true);
  };

  const handleHowItWorksModalTouchMove = (e: React.TouchEvent) => {
    if (!isHowItWorksDragging) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - howItWorksStartY;
    
    setHowItWorksCurrentY(touch.clientY);
    
    // Only allow downward swipes (positive deltaY)
    if (deltaY > 0) {
      e.preventDefault();
      
      if (howItWorksModalRef.current) {
        howItWorksModalRef.current.style.transform = `translateY(${Math.min(deltaY, 300)}px)`;
        howItWorksModalRef.current.style.opacity = `${Math.max(1 - deltaY / 300, 0.3)}`;
      }
    }
  };

  const handleHowItWorksModalTouchEnd = (e: React.TouchEvent) => {
    if (!isHowItWorksDragging) return;
    
    const deltaY = howItWorksCurrentY - howItWorksStartY;
    
    // If swiped down more than 80px, close modal
    if (deltaY > 80 && howItWorksModalRef.current) {
      // Animate out
      howItWorksModalRef.current.style.transform = 'translateY(100%)';
      howItWorksModalRef.current.style.opacity = '0';
      setTimeout(() => {
        setShowHowItWorks(false);
      }, 200);
    } else if (howItWorksModalRef.current) {
      // Snap back to original position
      howItWorksModalRef.current.style.transform = 'translateY(0)';
      howItWorksModalRef.current.style.opacity = '1';
    }
    
    setIsHowItWorksDragging(false);
    setHowItWorksStartY(0);
    setHowItWorksCurrentY(0);
  };

  // Touch event handlers for compatibility check modal swipe-down dismissal
  const handleCompatibilityModalTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setCompatibilityStartY(touch.clientY);
    setCompatibilityCurrentY(touch.clientY);
    setIsCompatibilityDragging(true);
  };

  const handleCompatibilityModalTouchMove = (e: React.TouchEvent) => {
    if (!isCompatibilityDragging) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - compatibilityStartY;
    
    setCompatibilityCurrentY(touch.clientY);
    
    // Only allow downward swipes (positive deltaY)
    if (deltaY > 0) {
      e.preventDefault();
      
      if (compatibilityModalRef.current) {
        compatibilityModalRef.current.style.transform = `translateY(${Math.min(deltaY, 300)}px)`;
        compatibilityModalRef.current.style.opacity = `${Math.max(1 - deltaY / 300, 0.3)}`;
      }
    }
  };

  const handleCompatibilityModalTouchEnd = (e: React.TouchEvent) => {
    if (!isCompatibilityDragging) return;
    
    const deltaY = compatibilityCurrentY - compatibilityStartY;
    
    // If swiped down more than 80px, close modal
    if (deltaY > 80 && compatibilityModalRef.current) {
      // Animate out
      compatibilityModalRef.current.style.transform = 'translateY(100%)';
      compatibilityModalRef.current.style.opacity = '0';
      setTimeout(() => {
        setShowCompatibilityCheck(false);
      }, 200);
    } else if (compatibilityModalRef.current) {
      // Snap back to original position
      compatibilityModalRef.current.style.transform = 'translateY(0)';
      compatibilityModalRef.current.style.opacity = '1';
    }
    
    setIsCompatibilityDragging(false);
    setCompatibilityStartY(0);
    setCompatibilityCurrentY(0);
  };

  // Touch event handlers for global coverage modal swipe-down dismissal
  const handleGlobalCoverageModalTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setGlobalCoverageModalStartY(touch.clientY);
    setGlobalCoverageModalCurrentY(touch.clientY);
    setIsGlobalCoverageModalDragging(true);
  };

  const handleGlobalCoverageModalTouchMove = (e: React.TouchEvent) => {
    if (!isGlobalCoverageModalDragging) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - globalCoverageModalStartY;
    
    setGlobalCoverageModalCurrentY(touch.clientY);
    
    // Only allow downward swipes (positive deltaY)
    if (deltaY > 0) {
      e.preventDefault();
      
      if (globalCoverageModalRef.current) {
        globalCoverageModalRef.current.style.transform = `translateY(${Math.min(deltaY, 300)}px)`;
        globalCoverageModalRef.current.style.opacity = `${Math.max(1 - deltaY / 300, 0.3)}`;
      }
    }
  };

  const handleGlobalCoverageModalTouchEnd = (e: React.TouchEvent) => {
    if (!isGlobalCoverageModalDragging) return;
    
    const deltaY = globalCoverageModalCurrentY - globalCoverageModalStartY;
    
    // If swiped down more than 80px, close modal
    if (deltaY > 80 && globalCoverageModalRef.current) {
      // Animate out
      globalCoverageModalRef.current.style.transform = 'translateY(100%)';
      globalCoverageModalRef.current.style.opacity = '0';
      setTimeout(() => {
        setShowGlobalCoverageModal(false);
        setSearchQuery('');
      }, 200);
    } else if (globalCoverageModalRef.current) {
      // Snap back to original position
      globalCoverageModalRef.current.style.transform = 'translateY(0)';
      globalCoverageModalRef.current.style.opacity = '1';
    }
    
    setIsGlobalCoverageModalDragging(false);
    setGlobalCoverageModalStartY(0);
    setGlobalCoverageModalCurrentY(0);
  };

  // Touch event handlers for Europe plan info modal swipe-down dismissal
  const handleEuropePlanInfoModalTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setEuropePlanModalStartY(touch.clientY);
    setEuropePlanModalCurrentY(touch.clientY);
    setIsEuropePlanModalDragging(true);
  };

  const handleEuropePlanInfoModalTouchMove = (e: React.TouchEvent) => {
    if (!isEuropePlanModalDragging) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - europePlanModalStartY;
    
    setEuropePlanModalCurrentY(touch.clientY);
    
    // Only allow downward swipes (positive deltaY)
    if (deltaY > 0) {
      e.preventDefault();
      
      if (europePlanInfoModalRef.current) {
        europePlanInfoModalRef.current.style.transform = `translateY(${Math.min(deltaY, 300)}px)`;
        europePlanInfoModalRef.current.style.opacity = `${Math.max(1 - deltaY / 300, 0.3)}`;
      }
    }
  };

  const handleEuropePlanInfoModalTouchEnd = (e: React.TouchEvent) => {
    if (!isEuropePlanModalDragging) return;
    
    const deltaY = europePlanModalCurrentY - europePlanModalStartY;
    
    // If swiped down more than 80px, close modal
    if (deltaY > 80 && europePlanInfoModalRef.current) {
      // Animate out
      europePlanInfoModalRef.current.style.transform = 'translateY(100%)';
      europePlanInfoModalRef.current.style.opacity = '0';
      setTimeout(() => {
        setShowEuropePlanInfoModal(false);
      }, 200);
    } else if (europePlanInfoModalRef.current) {
      // Snap back to original position
      europePlanInfoModalRef.current.style.transform = 'translateY(0)';
      europePlanInfoModalRef.current.style.opacity = '1';
    }
    
    setIsEuropePlanModalDragging(false);
    setEuropePlanModalStartY(0);
    setEuropePlanModalCurrentY(0);
  };

  // Touch event handlers for Quick Actions modal swipe-down dismissal
  const handleQuickActionsModalTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setQuickActionsStartY(touch.clientY);
    setQuickActionsCurrentY(touch.clientY);
    setIsQuickActionsDragging(true);
  };

  const handleQuickActionsModalTouchMove = (e: React.TouchEvent) => {
    if (!isQuickActionsDragging) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - quickActionsStartY;
    
    setQuickActionsCurrentY(touch.clientY);
    
    // Only allow downward swipes (positive deltaY)
    if (deltaY > 0) {
      e.preventDefault(); // Prevent body scroll during drag
      
      if (quickActionsModalRef.current) {
        quickActionsModalRef.current.style.transform = `translateY(${Math.min(deltaY, 300)}px)`;
        quickActionsModalRef.current.style.opacity = `${Math.max(1 - deltaY / 300, 0.3)}`;
      }
    }
  };

  const handleQuickActionsModalTouchEnd = (e: React.TouchEvent) => {
    if (!isQuickActionsDragging) return;
    
    const deltaY = quickActionsCurrentY - quickActionsStartY;
    
    // If swiped down more than 80px, close modal
    if (deltaY > 80 && quickActionsModalRef.current) {
      // Animate out
      quickActionsModalRef.current.style.transform = 'translateY(100%)';
      quickActionsModalRef.current.style.opacity = '0';
      setTimeout(() => {
        setShowQuickActions(false);
      }, 200);
    } else if (quickActionsModalRef.current) {
      // Snap back to original position
      quickActionsModalRef.current.style.transform = 'translateY(0)';
      quickActionsModalRef.current.style.opacity = '1';
    }
    
    setIsQuickActionsDragging(false);
    setQuickActionsStartY(0);
    setQuickActionsCurrentY(0);
  };

  // Touch event handlers for coverage modal swipe-down dismissal
  const handleCoverageModalTouchStart = (e: React.TouchEvent) => {
    // Only allow swipe if modal is not scrolled
    if (coverageModalRef.current && coverageModalRef.current.scrollTop > 0) {
      return;
    }
    
    const touch = e.touches[0];
    setModalStartY(touch.clientY);
    setModalCurrentY(touch.clientY);
    setIsModalDragging(true);
  };

  const handleCoverageModalTouchMove = (e: React.TouchEvent) => {
    if (!isModalDragging) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - modalStartY;
    
    setModalCurrentY(touch.clientY);
    
    // Only allow downward swipes (positive deltaY) and prevent default scrolling
    if (deltaY > 0) {
      e.preventDefault(); // Prevent body scroll only during downward drag
      
      if (coverageModalRef.current) {
        coverageModalRef.current.style.transform = `translateY(${Math.min(deltaY, 300)}px)`;
        coverageModalRef.current.style.opacity = `${Math.max(1 - deltaY / 300, 0.3)}`;
      }
    }
  };

  const handleCoverageModalTouchEnd = (e: React.TouchEvent) => {
    if (!isModalDragging) return;
    
    const deltaY = modalCurrentY - modalStartY;
    
    // If swiped down more than 100px, close modal
    if (deltaY > 100 && coverageModalRef.current) {
      // Animate out
      coverageModalRef.current.style.transform = 'translateY(100%)';
      coverageModalRef.current.style.opacity = '0';
      setTimeout(() => {
        setShowCountriesModal(false);
        setSearchQuery('');
      }, 200); // Wait for animation to complete
    } else if (coverageModalRef.current) {
      // Snap back to original position
      coverageModalRef.current.style.transform = 'translateY(0)';
      coverageModalRef.current.style.opacity = '1';
    }
    
    setIsModalDragging(false);
    setModalStartY(0);
    setModalCurrentY(0);
  };

  // Enable tab swipe navigation
  useTabSwipe({
    enabled: true,
    threshold: 50,
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight
  });

  // Real device detection using all available web APIs
  const checkDeviceCompatibility = async () => {
    let deviceBrand = '';
    let deviceModel = '';
    let supportsESIM = false;
    
    console.log('Starting device detection...');
    
    try {
      // Get comprehensive device information
      const deviceInfo = await getDeviceInformation();
      console.log('Device info detected:', deviceInfo);
      
      deviceBrand = deviceInfo.brand;
      deviceModel = deviceInfo.model;
      supportsESIM = deviceInfo.supportsESIM;
      
    } catch (error) {
      console.error('Device detection failed:', error);
      deviceBrand = 'Unknown';
      deviceModel = 'Device';
      supportsESIM = false;
    }
    
    const fullDeviceName = `${deviceBrand} ${deviceModel}`;
    
    setCompatibilityResult({
      isCompatible: supportsESIM,
      deviceName: fullDeviceName,
      details: supportsESIM 
        ? `Your ${fullDeviceName} supports eSIM technology. You can install and use eSIMs for international travel.`
        : `Your ${fullDeviceName} may not support eSIM technology. eSIM is available on iPhone XS/XR+, Google Pixel 3+, and Samsung Galaxy S20+ devices.`
    });
    
    setShowCompatibilityCheck(true);
  };

  // Comprehensive device information extraction
  const getDeviceInformation = async () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    console.log('User Agent:', userAgent);
    console.log('Platform:', platform);
    
    // Try multiple detection methods
    const methods = [
      detectFromUserAgentData,
      detectFromUserAgent,
      detectFromWebGL,
      detectFromCSS,
      detectFromTouchEvents
    ];
    
    for (const method of methods) {
      try {
        const result = await method();
        if (result.brand !== 'Unknown' && result.model !== 'Device') {
          console.log(`Detection successful with method: ${method.name}`, result);
          return result;
        }
      } catch (error) {
        console.log(`Method ${method.name} failed:`, error);
        continue;
      }
    }
    
    return { brand: 'Unknown', model: 'Device', supportsESIM: false };
  };

  // Method 1: User-Agent Client Hints API (most reliable)
  const detectFromUserAgentData = async () => {
    if (!('userAgentData' in navigator)) {
      throw new Error('UserAgentData not available');
    }
    
    const uaData = (navigator as any).userAgentData;
    
    const highEntropyValues = await uaData.getHighEntropyValues([
      'model', 'platform', 'platformVersion', 'architecture', 'mobile', 'brands', 'fullVersionList'
    ]);
    
    console.log('High entropy values:', highEntropyValues);
    
    let brand = 'Unknown';
    let model = 'Device';
    
    // Extract brand from brands array
    if (uaData.brands && uaData.brands.length > 0) {
      const filteredBrands = uaData.brands.filter((b: any) => 
        !b.brand.includes('Not') && 
        !b.brand.includes('Chromium') && 
        !b.brand.includes('Google Chrome')
      );
      
      if (filteredBrands.length > 0) {
        brand = filteredBrands[0].brand;
      } else {
        brand = uaData.brands[uaData.brands.length - 1].brand; // Use last brand as fallback
      }
    }
    
    // Extract model
    if (highEntropyValues.model && highEntropyValues.model !== '') {
      model = highEntropyValues.model;
    } else if (highEntropyValues.platform) {
      model = `${highEntropyValues.platform} Device`;
    }
    
    const supportsESIM = uaData.mobile && brand !== 'Unknown';
    
    return { brand, model, supportsESIM };
  };

  // Method 2: Enhanced User-Agent parsing
  const detectFromUserAgent = async () => {
    const userAgent = navigator.userAgent;
    
    // iPhone detection with extensive pattern matching
    if (/iPhone/.test(userAgent)) {
      let model = 'iPhone';
      
      // Hardware identifier patterns
      const hardwarePatterns = {
        'iPhone16,1': 'iPhone 15 Pro',
        'iPhone16,2': 'iPhone 15 Pro Max',
        'iPhone15,4': 'iPhone 15',
        'iPhone15,5': 'iPhone 15 Plus',
        'iPhone15,2': 'iPhone 14 Pro', 
        'iPhone15,3': 'iPhone 14 Pro Max',
        'iPhone14,7': 'iPhone 14',
        'iPhone14,8': 'iPhone 14 Plus',
        'iPhone14,2': 'iPhone 13 Pro',
        'iPhone14,3': 'iPhone 13 Pro Max',
        'iPhone14,4': 'iPhone 13 mini',
        'iPhone14,5': 'iPhone 13',
        'iPhone13,1': 'iPhone 12 mini',
        'iPhone13,2': 'iPhone 12',
        'iPhone13,3': 'iPhone 12 Pro',
        'iPhone13,4': 'iPhone 12 Pro Max',
        'iPhone12,1': 'iPhone 11',
        'iPhone12,3': 'iPhone 11 Pro',
        'iPhone12,5': 'iPhone 11 Pro Max',
        'iPhone11,2': 'iPhone XS',
        'iPhone11,4': 'iPhone XS Max',
        'iPhone11,6': 'iPhone XS Max',
        'iPhone11,8': 'iPhone XR'
      };
      
      // Try hardware identifier first
      for (const [pattern, modelName] of Object.entries(hardwarePatterns)) {
        if (userAgent.includes(pattern)) {
          model = modelName;
          break;
        }
      }
      
      // If no hardware identifier, try webkit version method
      if (model === 'iPhone') {
        const webkitMatch = userAgent.match(/Version\/(\d+\.\d+)/);
        const iosMatch = userAgent.match(/OS (\d+)_(\d+)/);
        
        if (iosMatch) {
          const majorVersion = parseInt(iosMatch[1]);
          const minorVersion = parseInt(iosMatch[2]);
          
          // Estimate based on iOS version and release dates
          if (majorVersion >= 17) {
            model = 'iPhone 15 series';
          } else if (majorVersion >= 16) {
            model = 'iPhone 14 series';
          } else if (majorVersion >= 15) {
            model = 'iPhone 13 series';
          } else if (majorVersion >= 14) {
            model = 'iPhone 12 series';
          } else if (majorVersion >= 13) {
            model = 'iPhone 11 series';
          } else {
            model = 'iPhone (Legacy)';
          }
        }
      }
      
      const iosMatch = userAgent.match(/OS (\d+)/);
      const supportsESIM = iosMatch ? parseInt(iosMatch[1]) >= 12 : false;
      
      return { brand: 'Apple', model, supportsESIM };
    }
    
    // Android detection
    if (/Android/.test(userAgent)) {
      let brand = 'Android';
      let model = 'Device';
      
      // Samsung detection
      if (/Samsung|SM-/i.test(userAgent)) {
        brand = 'Samsung';
        const modelMatch = userAgent.match(/SM-([A-Z0-9]+)/i);
        if (modelMatch) {
          // Map Samsung model codes to readable names
          const samsungModels: { [key: string]: string } = {
            'S928': 'Galaxy S24 Ultra',
            'S926': 'Galaxy S24+',
            'S921': 'Galaxy S24',
            'S918': 'Galaxy S23 Ultra',
            'S916': 'Galaxy S23+',
            'S911': 'Galaxy S23',
            'S908': 'Galaxy S22 Ultra',
            'S906': 'Galaxy S22+',
            'S901': 'Galaxy S22'
          };
          
          const modelCode = modelMatch[1].substring(0, 4);
          model = samsungModels[modelCode] || `Galaxy ${modelMatch[1]}`;
        } else {
          model = 'Galaxy Series';
        }
      }
      
      // Google Pixel detection
      else if (/Pixel/i.test(userAgent)) {
        brand = 'Google';
        const pixelMatch = userAgent.match(/Pixel ([^;)]+)/i);
        model = pixelMatch ? `Pixel ${pixelMatch[1].trim()}` : 'Pixel';
      }
      
      const androidMatch = userAgent.match(/Android (\d+)/);
      const supportsESIM = androidMatch ? parseInt(androidMatch[1]) >= 9 : false;
      
      return { brand, model, supportsESIM };
    }
    
    throw new Error('Not a mobile device');
  };

  // Method 3: WebGL Renderer detection
  const detectFromWebGL = async () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) throw new Error('WebGL not available');
    
    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) throw new Error('Debug renderer info not available');
    
    const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    const vendor = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    
    console.log('WebGL Renderer:', renderer);
    console.log('WebGL Vendor:', vendor);
    
    // Apple GPU detection
    if (renderer.includes('Apple') || vendor.includes('Apple')) {
      return { brand: 'Apple', model: 'iPhone/iPad', supportsESIM: true };
    }
    
    // Adreno GPU (Qualcomm - Android devices)
    if (renderer.includes('Adreno')) {
      return { brand: 'Android', model: 'Qualcomm Device', supportsESIM: true };
    }
    
    throw new Error('Could not determine device from WebGL');
  };

  // Method 4: CSS Media Query detection
  const detectFromCSS = async () => {
    // Check for device-specific CSS capabilities
    const supportsTouch = 'ontouchstart' in window;
    const maxTouchPoints = navigator.maxTouchPoints || 0;
    
    if (supportsTouch && maxTouchPoints > 0) {
      return { brand: 'Mobile', model: 'Touch Device', supportsESIM: true };
    }
    
    throw new Error('Not a touch device');
  };

  // Method 5: Touch event detection
  const detectFromTouchEvents = async () => {
    if ('ontouchstart' in window) {
      const maxTouchPoints = navigator.maxTouchPoints || 0;
      
      if (maxTouchPoints > 5) {
        return { brand: 'Multi-touch', model: 'Advanced Touch Device', supportsESIM: true };
      } else if (maxTouchPoints > 0) {
        return { brand: 'Touch', model: 'Touch Device', supportsESIM: true };
      }
    }
    
    throw new Error('Touch not supported');
  };
  
  const placeholderTexts = [
    'Find your destination',
    'Search a country or city',
    'Type Germany, Spain, or Japan',
    'Looking for Europe plans?',
    'Explore eSIMs for USA, UAE…',
    'Where are you traveling to?',
    'Start typing a country name…',
    'eSIM for 200+ countries'
  ];

  // Typewriter effect for search placeholder
  useEffect(() => {
    let isMounted = true;
    let currentText = '';
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;
    
    const typeWriter = () => {
      if (!isMounted) return;
      
      const fullText = placeholderTexts[placeholderIndex];
      
      if (isDeleting) {
        currentText = currentText.slice(0, -1);
      } else {
        currentText = fullText.slice(0, currentText.length + 1);
      }
      
      setPlaceholderText(currentText);
      
      let typeSpeed = 80;
      
      if (isDeleting) {
        typeSpeed = 40;
      }
      
      if (!isDeleting && currentText === fullText) {
        typeSpeed = 2000; // Pause when complete
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
        typeSpeed = 500;
      }
      
      timeoutId = setTimeout(typeWriter, typeSpeed);
    };
    
    timeoutId = setTimeout(typeWriter, 500);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [placeholderIndex]);

  // Prevent body scroll when modal is open + Safari viewport fix
  useEffect(() => {
    if (showLiveChat || showHowItWorks || showCompatibilityCheck) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      // Safari-specific viewport fix
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (isSafari) {
        const modalContent = document.querySelector('.modal-content') as HTMLElement;
        const modalInput = document.querySelector('.modal-input-area') as HTMLElement;
        
        if (modalContent) {
          modalContent.style.height = '70vh';
          modalContent.style.maxHeight = '70vh';
        }
        if (modalInput) {
          modalInput.style.paddingBottom = '3rem';
        }
      }
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showLiveChat, showHowItWorks]);

  // Touch handlers for swipe to close
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    const deltaY = currentY - startY;
    const threshold = 150; // Minimum swipe distance to close
    const velocity = Math.abs(deltaY) / 100; // Simple velocity calculation
    
    // Close if dragged far enough OR if velocity is high enough
    if (deltaY > threshold || (deltaY > 50 && velocity > 0.5)) {
      // Add a smooth closing animation
      setTimeout(() => {
        setShowLiveChat(false);
      }, 100);
    }
    
    setIsDragging(false);
    setStartY(0);
    setCurrentY(0);
  };
  
  // Real geolocation detection with dual API fallback
  const [userCountry, setUserCountry] = useState<{
    name: string;
    code: string;
    flag: string;
    price: string;
  }>({
    name: 'Turkey',
    code: 'TR', 
    flag: '🇹🇷',
    price: '€2.99'
  });

  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'error'>('loading');

  // Currency & Language Settings
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [showCurrencyLanguageModal, setShowCurrencyLanguageModal] = useState(false);

  const currencies = [
    { code: 'EUR', symbol: '€', name: 'Euro', region: 'Europe' },
    { code: 'USD', symbol: '$', name: 'US Dollar', region: 'Americas' },
    { code: 'GBP', symbol: '£', name: 'British Pound', region: 'Europe' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira', region: 'Europe' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', region: 'Asia' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', region: 'Europe' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', region: 'Americas' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', region: 'Oceania' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', region: 'Europe' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', region: 'Europe' },
    { code: 'DKK', symbol: 'kr', name: 'Danish Krone', region: 'Europe' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Złoty', region: 'Europe' },
    { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', region: 'Europe' },
    { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', region: 'Europe' },
    { code: 'RON', symbol: 'lei', name: 'Romanian Leu', region: 'Europe' },
    { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev', region: 'Europe' },
    { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna', region: 'Europe' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble', region: 'Europe' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', region: 'Asia' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won', region: 'Asia' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', region: 'Asia' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', region: 'Asia' },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', region: 'Asia' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht', region: 'Asia' },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', region: 'Asia' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', region: 'Middle East' },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', region: 'Middle East' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand', region: 'Africa' },
    { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', region: 'Africa' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', region: 'Americas' },
    { code: 'MXN', symbol: '$', name: 'Mexican Peso', region: 'Americas' },
  ];

  const languages = [
    { code: 'EN', name: 'English', flag: '🇺🇸', nativeName: 'English' },
    { code: 'TR', name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
    { code: 'DE', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
    { code: 'FR', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
    { code: 'ES', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
    { code: 'IT', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
    { code: 'PT', name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
    { code: 'RU', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
    { code: 'ZH', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
    { code: 'JA', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
    { code: 'KO', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
    { code: 'AR', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  ];

  // Country data mapping with hardcoded flag emojis (no Unicode generation)
  const countryMapping: Record<string, { name: string; code: string; flag: string; price: string }> = {
    'Turkey': { name: 'Turkey', code: 'TR', flag: '🇹🇷', price: '€2.99' },
    'Germany': { name: 'Germany', code: 'DE', flag: '🇩🇪', price: '€3.49' },
    'United Kingdom': { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', price: '€3.99' },
    'France': { name: 'France', code: 'FR', flag: '🇫🇷', price: '€4.49' },
    'Spain': { name: 'Spain', code: 'ES', flag: '🇪🇸', price: '€3.49' },
    'Italy': { name: 'Italy', code: 'IT', flag: '🇮🇹', price: '€3.99' },
    'Netherlands': { name: 'Netherlands', code: 'NL', flag: '🇳🇱', price: '€3.99' },
    'Austria': { name: 'Austria', code: 'AT', flag: '🇦🇹', price: '€4.49' },
    'Switzerland': { name: 'Switzerland', code: 'CH', flag: '🇨🇭', price: '€5.99' },
    'United States': { name: 'United States', code: 'US', flag: '🇺🇸', price: '€8.99' },
    'Canada': { name: 'Canada', code: 'CA', flag: '🇨🇦', price: '€7.99' },
    'Japan': { name: 'Japan', code: 'JP', flag: '🇯🇵', price: '€6.99' },
    'Australia': { name: 'Australia', code: 'AU', flag: '🇦🇺', price: '€9.99' },
    'Brazil': { name: 'Brazil', code: 'BR', flag: '🇧🇷', price: '€5.49' },
    'Belgium': { name: 'Belgium', code: 'BE', flag: '🇧🇪', price: '€3.99' },
    'Poland': { name: 'Poland', code: 'PL', flag: '🇵🇱', price: '€3.49' },
    'Portugal': { name: 'Portugal', code: 'PT', flag: '🇵🇹', price: '€3.49' },
    'Czech Republic': { name: 'Czech Republic', code: 'CZ', flag: '🇨🇿', price: '€3.99' },
    'Greece': { name: 'Greece', code: 'GR', flag: '🇬🇷', price: '€4.49' },
    'Norway': { name: 'Norway', code: 'NO', flag: '🇳🇴', price: '€6.99' },
    'Sweden': { name: 'Sweden', code: 'SE', flag: '🇸🇪', price: '€4.99' },
    'Denmark': { name: 'Denmark', code: 'DK', flag: '🇩🇰', price: '€4.99' },
    'Finland': { name: 'Finland', code: 'FI', flag: '🇫🇮', price: '€4.99' },
    'Ireland': { name: 'Ireland', code: 'IE', flag: '🇮🇪', price: '€3.99' },
    'South Korea': { name: 'South Korea', code: 'KR', flag: '🇰🇷', price: '€6.99' },
    'Singapore': { name: 'Singapore', code: 'SG', flag: '🇸🇬', price: '€5.99' },
    'Thailand': { name: 'Thailand', code: 'TH', flag: '🇹🇭', price: '€3.99' },
    'Malaysia': { name: 'Malaysia', code: 'MY', flag: '🇲🇾', price: '€4.49' },
    'India': { name: 'India', code: 'IN', flag: '🇮🇳', price: '€3.99' },
    'China': { name: 'China', code: 'CN', flag: '🇨🇳', price: '€7.99' },
    'Mexico': { name: 'Mexico', code: 'MX', flag: '🇲🇽', price: '€4.49' },
    'Argentina': { name: 'Argentina', code: 'AR', flag: '🇦🇷', price: '€5.49' },
    'Chile': { name: 'Chile', code: 'CL', flag: '🇨🇱', price: '€5.99' },
    'South Africa': { name: 'South Africa', code: 'ZA', flag: '🇿🇦', price: '€6.99' },
    'Egypt': { name: 'Egypt', code: 'EG', flag: '🇪🇬', price: '€4.99' },
    'United Arab Emirates': { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', price: '€5.99' },
    'Saudi Arabia': { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', price: '€6.99' },
    'Israel': { name: 'Israel', code: 'IL', flag: '🇮🇱', price: '€5.49' },
    'New Zealand': { name: 'New Zealand', code: 'NZ', flag: '🇳🇿', price: '€8.99' }
  };

  // Dual API geolocation detection
  const detectUserLocation = async () => {
    setLocationStatus('loading');
    
    try {
      // First try: ipapi.co
      console.log('🌍 Trying ipapi.co...');
      const ipapiResponse = await fetch('https://ipapi.co/json/');
      
      if (ipapiResponse.ok) {
        const ipapiData = await ipapiResponse.json();
        console.log('ipapi.co response:', ipapiData);
        
        if (!ipapiData.error && ipapiData.country_name) {
          // First try exact match, then try common variations
          let country = countryMapping[ipapiData.country_name];
          if (!country && ipapiData.country_code) {
            // Try to find by country code if name doesn't match
            country = Object.values(countryMapping).find(c => c.code === ipapiData.country_code.toUpperCase()) || null;
          }
          
          // If still no match, use default fallback
          if (!country) {
            country = {
              name: ipapiData.country_name,
              code: ipapiData.country_code || 'XX',
              flag: '🌍',
              price: '€4.99'
            };
          }
          
          setUserCountry(country);
          setLocationStatus('success');
          console.log('✅ Location detected via ipapi.co:', country.name);
          return;
        }
      }
    } catch (error) {
      console.log('⚠️ ipapi.co failed:', error);
    }

    try {
      // Second try: ip-api.com
      console.log('🌍 Trying ip-api.com...');
      const ipApiResponse = await fetch('http://ip-api.com/json/');
      
      if (ipApiResponse.ok) {
        const ipApiData = await ipApiResponse.json();
        console.log('ip-api.com response:', ipApiData);
        
        if (ipApiData.status === 'success' && ipApiData.country) {
          // First try exact match, then try common variations
          let country = countryMapping[ipApiData.country];
          if (!country && ipApiData.countryCode) {
            // Try to find by country code if name doesn't match
            country = Object.values(countryMapping).find(c => c.code === ipApiData.countryCode.toUpperCase()) || null;
          }
          
          // If still no match, use default fallback
          if (!country) {
            country = {
              name: ipApiData.country,
              code: ipApiData.countryCode || 'XX',
              flag: '🌍',
              price: '€4.99'
            };
          }
          
          setUserCountry(country);
          setLocationStatus('success');
          console.log('✅ Location detected via ip-api.com:', country.name);
          return;
        }
      }
    } catch (error) {
      console.log('⚠️ ip-api.com failed:', error);
    }

    // Both APIs failed - keep default Turkey
    console.log('❌ Both geolocation APIs failed, using default Turkey');
    setLocationStatus('error');
  };



  // Run geolocation detection on component mount
  useEffect(() => {
    detectUserLocation();
  }, []);

  const { 
    data: countries = [], 
    isLoading: countriesLoading, 
    isError: countriesError, 
    error: countriesErrorDetails,
    refetch: refetchCountries 
  } = useQuery<Country[]>({
    queryKey: ["/api/countries"],
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { 
    data: popularPackages = [], 
    isError: packagesError, 
    error: packagesErrorDetails,
    refetch: refetchPackages 
  } = useQuery<(Package & { country?: Country })[]>({
    queryKey: ["/api/packages/popular"],
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { 
    data: profile, 
    isError: profileError, 
    error: profileErrorDetails,
    refetch: refetchProfile 
  } = useQuery<{ name?: string }>({
    queryKey: ['/api/profile'],
    retry: 2,
    retryDelay: 1000,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch user's eSIMs to get active count
  const { 
    data: userEsims = [], 
    isError: esimsError, 
    error: esimsErrorDetails,
    refetch: refetchEsims 
  } = useQuery<any[]>({
    queryKey: ['/api/esims'],
    enabled: !!profile, // Only fetch if user is logged in
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Time-based greeting function
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return { text: 'Good Morning', icon: '🌅' };
    } else if (hour >= 12 && hour < 17) {
      return { text: 'Good Afternoon', icon: '☀️' };
    } else if (hour >= 17 && hour < 21) {
      return { text: 'Good Evening', icon: '🌆' };
    } else {
      return { text: 'Good Night', icon: '🌙' };
    }
  };

  const greeting = getTimeBasedGreeting();

  // Recent searches localStorage helpers
  const loadRecentSearches = (): string[] => {
    try {
      const saved = localStorage.getItem('recentSearches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const saveRecentSearches = (searches: string[]) => {
    try {
      localStorage.setItem('recentSearches', JSON.stringify(searches));
    } catch {
      // Ignore localStorage errors
    }
  };

  const addToRecentSearches = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const current = loadRecentSearches();
    const filtered = current.filter(item => item.toLowerCase() !== searchTerm.toLowerCase());
    const updated = [searchTerm, ...filtered].slice(0, 5); // Keep only last 5
    
    saveRecentSearches(updated);
    setRecentSearches(updated);
  };

  // Load recent searches on mount
  useEffect(() => {
    const recent = loadRecentSearches();
    setRecentSearches(recent);
  }, []);

  const handleCountrySelect = (country: Country) => {
    setLocation(`/packages/${country.id}?from=home`);
  };

  // Smart search function
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setShowSearchResults(false);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    
    // Find matching local country
    const matchingCountry = countries.find(country => 
      country.name.toLowerCase().includes(searchTerm)
    );

    // Check if country is in Europa coverage
    const isInEuropa = europaCoverageCountries.some(europaCountry => 
      europaCountry.toLowerCase().includes(searchTerm) || 
      searchTerm.includes(europaCountry.toLowerCase())
    );

    // Check if country is in Global coverage (independent of Europa)
    const isInGlobal = matchingCountry || globalCoverage.some(globalCountry => 
      globalCountry.name.toLowerCase().includes(searchTerm)
    );

    let coverageType: 'europa' | 'global' | 'none' = 'none';
    let regionalPackages = null;
    let globalPackages = null;

    // Show regional packages if country is in Europa
    if (isInEuropa) {
      coverageType = 'europa';
      regionalPackages = europaPlans;
    }
    
    // Always show global packages if country is in global coverage
    if (isInGlobal) {
      globalPackages = globalDataPlans;
      if (coverageType === 'none') {
        coverageType = 'global';
      }
    }

    setSearchResults({
      localCountry: matchingCountry || null,
      regionalPackages,
      globalPackages,
      coverageType
    });

    // Only add to recent searches if we found a matching country (exact match)
    if (matchingCountry) {
      addToRecentSearches(matchingCountry.name); // Save proper country name, not user input
    }

    setShowSearchResults(true);
  };

  // Handle search input changes with proper debouncing
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 500); // Increased to 500ms for better UX
  };

  // Helper function to detect error type
  const getErrorType = (error: any): 'network' | 'server' | 'timeout' | 'generic' => {
    if (!navigator.onLine) return 'network';
    if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('fetch')) return 'network';
    if (error?.status >= 500) return 'server';
    if (error?.code === 'TIMEOUT' || error?.message?.includes('timeout')) return 'timeout';
    return 'generic';
  };

  const getErrorMessage = (error: any): string => {
    const errorType = getErrorType(error);
    switch (errorType) {
      case 'network':
        return 'Please check your internet connection and try again.';
      case 'server':
        return 'Our servers are experiencing issues. Please try again in a moment.';
      case 'timeout':
        return 'The request took too long. Please try again.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  // Global retry function
  const handleGlobalRetry = () => {
    refetchCountries();
    refetchPackages();
    refetchProfile();
    refetchEsims();
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'browse':
        setLocation('/search');
        break;
      case 'my-esims':
        setLocation('/my-esims');
        break;
      case 'qr':
        setLocation('/my-esims');
        break;
    }
  };



  // Filter countries based on selected tab
  const getFilteredCountries = () => {
    switch (selectedTab) {
      case 'local':
        return countries.filter(country => 
          ['United States', 'United Kingdom', 'Germany', 'France', 'Japan'].includes(country.name)
        ).slice(0, 8);
      case 'regional':
        return countries.filter(country => 
          ['Spain', 'Italy', 'Netherlands', 'Poland', 'Turkey'].includes(country.name)
        ).slice(0, 8);
      case 'global':
        return countries.slice(0, 8);
      default:
        return countries.slice(0, 8);
    }
  };

  const popularDestinations = getFilteredCountries();

  // Filter countries based on search query
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    
    return countries.filter(country => 
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5); // Show max 5 results
  };

  // Enhanced search results with plan info
  const getEnhancedSearchResults = () => {
    const results = getSearchResults();
    return results.map(country => {
      // Add plan information based on country
      let planCount = 3; // Default
      let hasFullPlan = false;
      
      switch(country.name) {
        case 'United States':
          planCount = 13;
          hasFullPlan = true;
          break;
        case 'United Kingdom':
          planCount = 12;
          hasFullPlan = true;
          break;
        case 'Germany':
          planCount = 8;
          break;
        case 'France':
          planCount = 6;
          break;
        case 'Turkey':
          planCount = 5;
          break;
        case 'Spain':
          planCount = 7;
          break;
        case 'Italy':
          planCount = 6;
          break;
        case 'Japan':
          planCount = 9;
          break;
        default:
          planCount = Math.floor(Math.random() * 10) + 3; // 3-12 random
      }
      
      return {
        ...country,
        planCount,
        hasFullPlan
      };
    });
  };



  // Show offline page when user is offline
  if (!isOnline) {
    return <OfflinePage onRetry={() => window.location.reload()} />;
  }

  // Handle critical errors (countries are essential for the app)
  const hasCriticalError = countriesError;
  
  // Show critical error page if essential data fails to load
  if (hasCriticalError && !countriesLoading) {
    return (
      <div className="mobile-screen">
        <NavigationBar title="eSIMfo" />
        <div className="p-4">
          <ErrorBoundary
            title="Unable to Load Data"
            message={getErrorMessage(countriesErrorDetails)}
            type={getErrorType(countriesErrorDetails)}
            onRetry={handleGlobalRetry}
            onGoOffline={() => setLocation('/my-esims')}
          />
        </div>

      </div>
    );
  }
  
  // If full screen search is active, show search page instead of home content
  if (showFullScreenSearch) {
    return (
      <div className="mobile-screen bg-white dark:bg-gray-900 min-h-screen animate-in slide-in-from-bottom duration-400 ease-out">
        {/* Search Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 pt-4 pb-4 px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-screen-md mx-auto">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setShowFullScreenSearch(false);
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="relative flex-1 group">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200 z-10 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={(el) => {
                    if (el && showFullScreenSearch) {
                      window.fullScreenSearchInputRef = el;
                    }
                  }}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search destinations..."
                  className="w-full pl-10 pr-10 py-3 text-base border-0 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 focus:scale-[1.02] focus:shadow-lg"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      performSearch('');
                      setSearchResults({
                        localCountry: null,
                        regionalPackages: null,
                        globalPackages: null,
                        coverageType: 'none'
                      });
                      // Keep focus on input to maintain keyboard
                      setTimeout(() => {
                        if (window.fullScreenSearchInputRef) {
                          window.fullScreenSearchInputRef.focus();
                        }
                      }, 10);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 active:scale-95"
                  >
                    <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="px-4 pt-6 pb-20">
          <div className="max-w-screen-md mx-auto">
            {searchQuery ? (
              <div className="space-y-8">
                {/* Local Results */}
                {searchResults.localCountry && (
                  <div>
                    <h3 className="text-gray-900 dark:text-white text-lg font-semibold mb-4">Local</h3>
                    <button
                      onClick={() => {
                        handleCountrySelect(searchResults.localCountry!);
                        setSearchQuery('');
                        setShowSearchResults(false);
                        setShowFullScreenSearch(false);
                      }}
                      className="w-full p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-left transition-all duration-200 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-sm overflow-hidden flex items-center justify-center bg-gray-700">
                          {searchResults.localCountry.flagUrl ? (
                            <img 
                              src={searchResults.localCountry.flagUrl} 
                              alt={searchResults.localCountry.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <span 
                            className="text-white text-sm font-bold w-full h-full flex items-center justify-center bg-red-600"
                            style={{ display: searchResults.localCountry.flagUrl ? 'none' : 'flex' }}
                          >
                            {searchResults.localCountry.code}
                          </span>
                        </div>
                        <div>
                          <div className="text-gray-900 dark:text-white font-medium">{searchResults.localCountry.name}</div>
                          <div className="text-gray-600 dark:text-gray-400 text-sm">Local eSIM plans available</div>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Regional Results */}
                {searchResults.regionalPackages && searchResults.regionalPackages.length > 0 && (
                  <div>
                    <h3 className="text-gray-900 dark:text-white text-lg font-semibold mb-4">Regional</h3>
                    <div className="space-y-3">
                      {searchResults.regionalPackages.slice(0, 3).map((pkg, index) => (
                        <div key={index} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-gray-900 dark:text-white font-medium">{pkg.data}</div>
                              <div className="text-gray-600 dark:text-gray-400 text-sm">{pkg.duration} days • Europa</div>
                            </div>
                            <div className="text-green-400 font-bold text-lg">{pkg.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* More Regional Plans Button */}
                    {searchResults.regionalPackages.length > 3 && (
                      <button
                        onClick={() => {
                          // Navigate to Regional tab and scroll to Europa section
                          setShowFullScreenSearch(false);
                          setSearchQuery('');
                          setShowSearchResults(false);
                          setSelectedTab('regional');
                          setTimeout(() => {
                            const regionElement = document.getElementById('regional-content');
                            if (regionElement) {
                              regionElement.scrollIntoView({ behavior: 'smooth' });
                            }
                          }, 100);
                        }}
                        className="w-full mt-4 p-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl text-left transition-all duration-200 flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-gray-900 dark:text-white font-medium">Tüm Avrupa planları</div>
                            <div className="text-gray-600 dark:text-gray-400 text-sm">+{searchResults.regionalPackages.length - 3} daha fazla plan</div>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}

                {/* Global Results */}
                {searchResults.globalPackages && searchResults.globalPackages.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-900 dark:text-white text-lg font-semibold">Global</h3>
                      <div className="text-xs text-gray-400 bg-orange-500/20 px-2 py-1 rounded-full">
                        172 ülke
                      </div>
                    </div>
                    <div className="space-y-3">
                      {searchResults.globalPackages.slice(0, 3).map((pkg, index) => (
                        <div key={index} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-gray-900 dark:text-white font-medium">{pkg.data}</div>
                              <div className="text-gray-600 dark:text-gray-400 text-sm">{pkg.duration} days • Global kapsam</div>
                            </div>
                            <div className="text-green-400 font-bold text-lg">{pkg.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* More Global Plans Button */}
                    {searchResults.globalPackages.length > 3 && (
                      <button
                        onClick={() => {
                          // Navigate to Global tab
                          setShowFullScreenSearch(false);
                          setSearchQuery('');
                          setShowSearchResults(false);
                          setSelectedTab('global');
                          setTimeout(() => {
                            const globalElement = document.getElementById('global-content');
                            if (globalElement) {
                              globalElement.scrollIntoView({ behavior: 'smooth' });
                            }
                          }, 100);
                        }}
                        className="w-full mt-4 p-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl text-left transition-all duration-200 flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-600/20 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-gray-900 dark:text-white font-medium">Tüm Global planları</div>
                            <div className="text-gray-600 dark:text-gray-400 text-sm">+{searchResults.globalPackages.length - 3} daha fazla plan</div>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}

                {/* No Results */}
                {!searchResults.localCountry && !searchResults.regionalPackages && !searchResults.globalPackages && (
                  <div className="text-center py-12">
                    <div className="text-gray-600 dark:text-gray-400 text-lg">No results found for "{searchQuery}"</div>
                    <div className="text-gray-500 dark:text-gray-500 text-sm mt-2">Try searching for a country name</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Recently Visited Section */}
                {recentSearches.length > 0 && (
                  <div className="px-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-900 dark:text-white text-lg font-semibold">Recently Visited</h3>
                      <button 
                        onClick={() => {
                          saveRecentSearches([]);
                          setRecentSearches([]);
                        }}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
                      >
                        CLEAR
                      </button>
                    </div>
                    <div className="space-y-3">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            const matchingCountry = countries.find(c => c.name.toLowerCase() === search.toLowerCase());
                            if (matchingCountry) {
                              // Direct navigation to country packages page
                              setLocation(`/packages/${matchingCountry.id}?from=recently-visited`);
                            } else {
                              // Fallback to search if somehow country not found
                              setSearchQuery(search);
                              setTimeout(() => {
                                performSearch(search);
                              }, 100);
                            }
                          }}
                          className="w-full p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-left transition-all duration-200 flex items-center justify-between group"
                        >
                          <div className="flex items-center space-x-4">
                            {(() => {
                              const matchingCountry = countries.find(c => c.name.toLowerCase() === search.toLowerCase());
                              return (
                                <div className="w-8 h-8 rounded-sm overflow-hidden flex items-center justify-center bg-gray-700">
                                  {matchingCountry?.flagUrl ? (
                                    <img 
                                      src={matchingCountry.flagUrl} 
                                      alt={matchingCountry.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const fallback = target.nextElementSibling as HTMLElement;
                                        if (fallback) fallback.style.display = 'flex';
                                      }}
                                    />
                                  ) : null}
                                  <span 
                                    className="text-blue-400 text-sm font-bold w-full h-full flex items-center justify-center"
                                    style={{ display: matchingCountry?.flagUrl ? 'none' : 'flex' }}
                                  >
                                    {matchingCountry?.code || search.slice(0, 2).toUpperCase()}
                                  </span>
                                </div>
                              );
                            })()}
                            <div>
                              <div className="text-gray-900 dark:text-white font-medium">{search}</div>
                              <div className="text-gray-400 text-sm">
                                {countries.find(c => c.name.toLowerCase() === search.toLowerCase()) ? 'Local eSIM plans available' : 'Regional & Global plans'}
                              </div>
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Empty State */}
                {recentSearches.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-600 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Search Destinations</h3>
                    <p className="text-gray-600 dark:text-gray-400">Type a country name to find eSIM plans</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen pb-20 swipe-container">
      {/* Compact Header with Search */}
      <div className="relative sticky top-0 z-10 py-4">
        <div className="max-w-screen-md mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* User Profile Photo */}
            <div className="w-12 h-12 rounded-full overflow-hidden relative" 
                 style={{
                   border: '2px solid rgba(59, 130, 246, 0.8)',
                   boxShadow: `
                     0 0 0 1px rgba(59, 130, 246, 0.2),
                     0 0 20px rgba(59, 130, 246, 0.4),
                     0 0 40px rgba(59, 130, 246, 0.2),
                     0 4px 20px rgba(0, 0, 0, 0.3),
                     inset 0 1px 0 rgba(255, 255, 255, 0.3),
                     inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                   `
                 }}>
              <img 
                src="/attached_assets/profilfoto.jpg" 
                alt="Profile Photo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm" style={{display: 'none'}}>
                {profile?.name ? profile.name.split(' ').map(n => n[0]).join('') : 'JD'}
              </div>
              {/* Enhanced light reflection effect - matching balance page */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-transparent to-white opacity-25 pointer-events-none"></div>
              <div className="absolute top-0 left-1/4 w-1/2 h-1/3 rounded-full bg-white opacity-30 blur-sm pointer-events-none"></div>
            </div>
            {/* Hello, Guest/User Text */}
            <div>
              <div className="flex items-center">
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Hello, </span>
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {profile?.name || 'Guest user'}
                </span>
              </div>
              {/* Time-based greeting */}
              <div className="flex items-center space-x-1 mt-0.5">
                <span className="text-xs">{greeting.icon}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{greeting.text}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Combined Currency & Language Selector */}
            <button 
              onClick={() => setShowCurrencyLanguageModal(true)}
              className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
            >
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {currencies.find(c => c.code === selectedCurrency)?.symbol}
              </span>
              <span className="mx-1 text-gray-500 dark:text-gray-400 text-xs">•</span>
              <span className="text-lg">{languages.find(l => l.code === selectedLanguage)?.flag}</span>
              <svg className="w-3 h-3 ml-1 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Offline Indicator */}
            {!isOnline && (
              <div className="flex items-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-2 py-1 rounded-md">
                <span className="text-xs font-semibold text-red-700 dark:text-red-400">Offline</span>
              </div>
            )}
            
            {/* Compact Live Chat Button */}
            <div>
              <button 
                onClick={() => setShowLiveChat(true)}
                className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center shadow-md active:shadow-sm transition-all duration-200 active:scale-95 relative"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                {/* Active status indicator */}
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Search Bar - Triggers Full Screen */}
      <div className="max-w-screen-md mx-auto px-4 mb-4">
        <button 
          onClick={() => {
            setIsSearchTransitioning(true);
            // Smooth transition delay
            setTimeout(() => {
              setShowFullScreenSearch(true);
              setIsSearchTransitioning(false);
            }, 200);
          }}
          className={`w-full bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center space-x-3 hover:shadow-lg border border-gray-200 dark:border-gray-700 group text-left transform transition-all duration-300 ${
            isSearchTransitioning 
              ? 'scale-[0.98] -translate-y-2 opacity-80 shadow-xl' 
              : 'scale-100 translate-y-0 opacity-100'
          }`}
        >
          {/* Search Icon */}
          <div className="relative">
            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <span className="text-gray-500 dark:text-gray-400 text-base font-medium flex-1">
            {placeholderText || "Search destinations..."}
          </span>
          
          <div className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            Tap to search
          </div>
        </button>
      </div>


      {/* Modern Pill-Style Tabs - Matched spacing */}
      <div className="max-w-screen-md mx-auto px-4 -mb-2">
          <div className="flex gap-1 p-1.5 bg-gradient-to-r from-gray-100/80 via-white to-gray-100/80 dark:from-gray-800/80 dark:via-gray-700 dark:to-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-700/40">
            {[
              { 
                id: 'local', 
                label: 'Local', 
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                color: 'bg-blue-500'
              },
              { 
                id: 'regional', 
                label: 'Regional', 
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                ),
                color: 'bg-green-500'
              },
              { 
                id: 'global', 
                label: 'Global', 
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                color: 'bg-orange-500'
              }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform relative group ${
                  selectedTab === tab.id
                    ? `${tab.color} text-white shadow-lg shadow-${tab.color.split('-')[1]}-500/30 scale-105`
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/80 hover:shadow-md hover:scale-102 active:scale-95'
                }`}
                style={{willChange: 'transform'}}
              >
                <div className="flex items-center justify-center space-x-2 relative z-10">
                  <div className={`transition-transform duration-300 ${selectedTab === tab.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {tab.icon}
                  </div>
                  <span className="tracking-wide">{tab.label}</span>
                </div>
                
                {/* Enhanced effects for active tab */}
                {selectedTab === tab.id && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-xl opacity-80"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 rounded-xl"></div>
                  </>
                )}
                
                {/* Ripple effect on click */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-30 transition-opacity duration-200 bg-white/20"></div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Main Content Grid */}
      <div className="max-w-screen-md mx-auto px-4 pb-2 relative overflow-hidden mt-4">
        <div 
          key={selectedTab}
          className={`transition-all duration-300 ${
            isTransitioning 
              ? 'opacity-40 scale-[0.98]' 
              : 'opacity-100 scale-100'
          }`}
        >
        {selectedTab === 'local' ? (
          <div className="space-y-4">
            {/* User's Local Country - Enhanced with subtle animations */}
            <div className="relative overflow-hidden group">
              <button 
                onClick={() => handleCountrySelect(countries[0])}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 border-none outline-none group relative"
              >
                <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Country Flag - just the emoji, no background circle */}
                  {locationStatus === 'loading' ? (
                    <div className="w-12 h-12 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <span className="text-3xl">
                      🇦🇹
                    </span>
                  )}
                  <div className="text-left">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-base">
                        {locationStatus === 'loading' ? 'Detecting location...' : userCountry.name}
                      </h3>
                      {locationStatus === 'success' && (
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <p className="text-white/70 text-xs">
                      {locationStatus === 'loading' ? 'Using real geolocation APIs' : 'Your current location'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {locationStatus === 'loading' ? '...' : `From ${userCountry.price}`}
                    </div>
                  </div>
                  {/* Enhanced LOCAL badge */}
                  <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold transform transition-transform duration-200 group-hover:scale-105">
                    {locationStatus === 'loading' ? '...' : 'LOCAL'}
                  </div>
                </div>
                </div>
                
                {/* Subtle overlay effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-white rounded-xl"></div>
              </button>
            </div>

            {/* Popular Local Countries - 20 countries grid */}
            <div className="grid grid-cols-2 gap-2">
              {countriesLoading ? (
                // Skeleton loading for country cards
                Array.from({ length: 20 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))
              ) : countriesError ? (
                // Error handling for network/API failures
                <div className="col-span-2">
                  <ErrorBoundary
                    title="Connection Problem"
                    message="Unable to load destinations. Please check your internet connection and try again."
                    type="network"
                    onRetry={refetchCountries}
                  />
                </div>
              ) : (
[
                  { id: 73, name: 'United States', flagColors: ['#B22234', '#FFFFFF', '#3C3B6E'], price: '€4.99' },
                  { id: 6, name: 'France', flagColors: ['#0055A4', '#FFFFFF', '#EF4135'], price: '€3.49' },
                  { id: 7, name: 'Germany', flagColors: ['#000000', '#DD0000', '#FFCE00'], price: '€3.49' },
                  { id: 9, name: 'Turkey', flagColors: ['#E30A17'], price: '€2.99' },
                  { id: 8, name: 'Japan', flagColors: ['#FFFFFF', '#BC002D'], price: '€5.99' },
                  { id: 40, name: 'Italy', flagColors: ['#009246', '#FFFFFF', '#CE2B37'], price: '€3.99' },
                  { id: 41, name: 'Spain', flagColors: ['#C60B1E', '#FFC400'], price: '€3.49' },
                  { id: 42, name: 'United Kingdom', flagColors: ['#012169', '#FFFFFF', '#C8102E'], price: '€3.99' },
                  { id: 43, name: 'Mexico', flagColors: ['#006847', '#FFFFFF', '#CE1126'], price: '€4.49' },
                  { id: 44, name: 'Thailand', flagColors: ['#ED1C24', '#FFFFFF', '#241D4F'], price: '€3.99' },
                  { id: 45, name: 'China', flagColors: ['#DE2910'], price: '€5.99' },
                  { id: 46, name: 'Canada', flagColors: ['#FF0000', '#FFFFFF'], price: '€4.99' },
                  { id: 47, name: 'South Korea', flagColors: ['#FFFFFF', '#C60C30', '#003478'], price: '€5.99' },
                  { id: 48, name: 'Hong Kong', flagColors: ['#DE2910'], price: '€5.49' },
                  { id: 49, name: 'Malaysia', flagColors: ['#CC0001', '#FFFFFF', '#010066'], price: '€4.99' },
                  { id: 50, name: 'Greece', flagColors: ['#0D5EAF', '#FFFFFF'], price: '€3.99' },
                  { id: 51, name: 'Singapore', flagColors: ['#ED2939', '#FFFFFF'], price: '€5.49' },
                  { id: 52, name: 'Netherlands', flagColors: ['#AE1C28', '#FFFFFF', '#21468B'], price: '€3.99' },
                  { id: 53, name: 'Portugal', flagColors: ['#046A38', '#DA020E'], price: '€3.49' },
                  { id: 54, name: 'Austria', flagColors: ['#ED2939', '#FFFFFF'], price: '€3.99' }
                ].map((country, index) => {
                  // Calculate row-based stagger delay for 2-column grid
                  const row = Math.floor(index / 2);
                  const col = index % 2;
                  const staggerDelay = row * 2 + col; // Row priority, then column
                  
                  return (
                    <button
                      key={country.id}
                      onClick={() => handleCountrySelect({ id: country.id, name: country.name } as Country)}
                      className={`bg-white dark:bg-gray-800 rounded-xl p-3 text-left shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-900/50 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-all hover:scale-[1.02] active:scale-[0.98] duration-200 animate-stagger-fade stagger-delay-${staggerDelay}`}
                    >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-6 rounded-sm overflow-hidden shadow-sm border border-gray-200 flex">
                        {country.flagColors.length === 1 ? (
                          <div className="w-full h-full" style={{ backgroundColor: country.flagColors[0] }}></div>
                        ) : country.flagColors.length === 2 ? (
                          <>
                            <div className="w-1/2 h-full" style={{ backgroundColor: country.flagColors[0] }}></div>
                            <div className="w-1/2 h-full" style={{ backgroundColor: country.flagColors[1] }}></div>
                          </>
                        ) : (
                          <>
                            <div className="w-1/3 h-full" style={{ backgroundColor: country.flagColors[0] }}></div>
                            <div className="w-1/3 h-full" style={{ backgroundColor: country.flagColors[1] }}></div>
                            <div className="w-1/3 h-full" style={{ backgroundColor: country.flagColors[2] }}></div>
                          </>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{country.name}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">From {country.price}</div>
                      </div>
                    </div>
                  </button>
                  );
                })
              )}
            </div>
            
            {/* More Destinations Button */}
            <button 
              onClick={() => setLocation('/destinations')}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl p-4 text-center transition-colors duration-200 shadow-lg hover:shadow-xl mb-8 relative overflow-hidden group"
            >
              {/* Background shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              
              <div className="relative z-10 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white">More destinations</span>
                  <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>


          </div>
        ) : selectedTab === 'regional' ? (
          <div className="space-y-3">
            {/* Elegant breadcrumb navigation */}
            {selectedContinent && (
              <div className="mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <button
                    onClick={() => {
                      setSelectedContinent(null);
                      setSelectedEuropaPlan(null); // Reset plan selection when going back
                    }}
                    className="inline-flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 group"
                  >
                    <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-medium">Regional</span>
                  </button>
                  <svg className="w-4 h-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Europe</span>
                </div>
              </div>
            )}
            
            {/* Show continent plans if selected, otherwise show continent list */}
            {selectedContinent === 'europa' ? (
              // Europa eSIM Plans with smooth fade-in animation
              <div id="regional-content" key="europa-plans" className="space-y-2 animate-slide-in-right">
                <div className="text-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Europe eSIM Plans</h2>
                  
                  {/* Pill-Style Button Strip - Same as Global */}
                  <div className="flex items-center justify-center mt-2">
                    <div className="flex bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-full p-1 shadow-sm border border-gray-200 dark:border-gray-600">
                      <button 
                        onClick={() => setShowCountriesModal(true)}
                        className="flex items-center space-x-1.5 px-4 py-2 bg-white dark:bg-gray-900 rounded-full shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 border border-gray-200 dark:border-gray-600"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">36 Countries</span>
                      </button>
                      
                      <div className="flex items-center justify-center mx-1">
                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                      </div>
                      
                      <button 
                        onClick={() => setShowEuropePlanInfoModal(true)}
                        className="flex items-center space-x-1.5 px-4 py-2 bg-white dark:bg-gray-900 rounded-full shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 border border-gray-200 dark:border-gray-600"
                      >
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Plan Details</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dynamic Europa Plans */}
                {europaPlans.map((plan) => (
                  <button 
                    key={plan.id}
                    onClick={() => {
                      if (selectedEuropaPlan === plan.id) {
                        setSelectedEuropaPlan(null);
                      } else {
                        setSelectedEuropaPlan(plan.id);
                      }
                    }}
                    className={`w-full p-2.5 rounded-xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl relative ${
                      selectedEuropaPlan === plan.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 scale-[1.02] shadow-xl transform translate-y-[-2px]'
                        : plan.id === 4 
                          ? 'popular-moving-border bg-gray-100 dark:bg-gray-800/50 hover:scale-[1.01] hover:transform hover:translate-y-[-3px]'
                          : 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-500 hover:scale-[1.01] hover:transform hover:translate-y-[-3px]'
                    }`}>
                    <div className="flex items-center">
                      <div className="text-left flex-1">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{plan.data}</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">{plan.duration}</div>
                      </div>
                      <div className="flex-1 flex flex-col items-start justify-center pl-16">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{plan.price}</div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">{plan.dailyPrice}</div>
                      </div>
                      <div className="flex-1 flex justify-end items-center">
                        {/* Popular indicator for 3GB plan */}
                        {plan.id === 4 && (
                          <div className="flex justify-center mr-6">
                            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 animate-pulse">Popular</span>
                          </div>
                        )}
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedEuropaPlan === plan.id) {
                              setSelectedEuropaPlan(null);
                            } else {
                              setSelectedEuropaPlan(plan.id);
                            }
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 ml-2 cursor-pointer"
                        >
                          Buy
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // Continent List with smooth fade-in animation
              <div key="continent-list" className="space-y-3 animate-slide-in-left">
                {/* Europa */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Europa clicked, setting continent to europa');
                    setSelectedContinent('europa');
                    setSelectedEuropaPlan(null); // Reset plan selection
                  }}
                  className="continent-card continent-europa rounded-xl p-4 shadow-sm animate-stagger-fade stagger-delay-0 touch-feedback cursor-pointer hover:shadow-md transition-shadow duration-200 w-full text-left"
                >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="continent-icon w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                    <img 
                      src={europaIcon} 
                      alt="Europa"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Europa</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">30+ countries • From €9.99</p>
                  </div>
                </div>
                <span className="text-blue-500 dark:text-blue-400 text-sm font-medium">View</span>
              </div>
            </button>
            
            {/* Asia */}
            <div className="continent-card continent-asia rounded-xl p-4 shadow-sm animate-stagger-fade stagger-delay-1 touch-feedback cursor-pointer">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="continent-icon w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                    <img 
                      src={asiaIcon} 
                      alt="Asia"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Asia</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">25+ countries • From €12.99</p>
                  </div>
                </div>
                <button className="text-blue-500 dark:text-blue-400 text-sm font-medium">View</button>
              </div>
            </div>
            
            {/* Americas */}
            <div className="continent-card continent-americas rounded-xl p-4 shadow-sm animate-stagger-fade stagger-delay-2 touch-feedback cursor-pointer">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="continent-icon w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                    <img 
                      src={americasIcon} 
                      alt="Americas"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Americas</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">20+ countries • From €11.99</p>
                  </div>
                </div>
                <button className="text-blue-500 dark:text-blue-400 text-sm font-medium">View</button>
              </div>
            </div>

            {/* Africa */}
            <div className="continent-card continent-africa rounded-xl p-4 shadow-sm animate-stagger-fade stagger-delay-3 touch-feedback cursor-pointer">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="continent-icon w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-xl flex items-center justify-center">
                    <img 
                      src={africaIcon} 
                      alt="Africa"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Africa</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">15+ countries • From €14.99</p>
                  </div>
                </div>
                <button className="text-blue-500 dark:text-blue-400 text-sm font-medium">View</button>
              </div>
            </div>

            {/* Middle East */}
            <div className="continent-card continent-middle-east rounded-xl p-4 shadow-sm animate-stagger-fade stagger-delay-4 touch-feedback cursor-pointer">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="continent-icon w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                    <img 
                      src={middleEastIcon} 
                      alt="Middle East"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Middle East</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">12+ countries • From €16.99</p>
                  </div>
                </div>
                <button className="text-blue-500 dark:text-blue-400 text-sm font-medium">View</button>
              </div>
            </div>

            {/* Oceania */}
            <div className="continent-card continent-oceania rounded-xl p-4 shadow-sm animate-stagger-fade stagger-delay-5 touch-feedback cursor-pointer">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="continent-icon w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-xl flex items-center justify-center">
                    <img 
                      src={oceaniaIcon} 
                      alt="Oceania"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Oceania</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">8+ countries • From €18.99</p>
                  </div>
                </div>
                <button className="text-blue-500 dark:text-blue-400 text-sm font-medium">View</button>
              </div>
            </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 animate-slide-in-left" key="global-plans">
            {/* Global Plan Cards Header */}
            <div className="text-center mb-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Global eSIM Plans</h2>
              
              {/* Pill-Style Button Strip */}
              <div className="flex items-center justify-center mt-2">
                <div className="flex bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-full p-1 shadow-sm border border-gray-200 dark:border-gray-600">
                  <button 
                    onClick={() => setShowGlobalCoverageModal(true)}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-white dark:bg-gray-900 rounded-full shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">137 Countries</span>
                  </button>
                  
                  <div className="flex items-center justify-center mx-1">
                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                  
                  <button 
                    onClick={() => setShowPlanInfoModal(true)}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-white dark:bg-gray-900 rounded-full shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Plan Details</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Premium Tab system for Data vs Data+Voice+SMS - Enhanced gradients */}
            <div className="flex mb-4 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 p-1 rounded-2xl shadow-sm">
              <button
                onClick={() => setGlobalPlanType('data')}
                className={`w-1/2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 text-center ${
                  globalPlanType === 'data'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                Data
              </button>
              <button
                onClick={() => setGlobalPlanType('data-voice-sms')}
                className={`w-1/2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 text-center ${
                  globalPlanType === 'data-voice-sms'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-600 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                }`}
              >
                Data / Calls / SMS
              </button>
            </div>

            {/* Global plan cards - Premium style with subtle indicators */}
            {globalPlanType === 'data' ? (
              // Data Only Plans
              <div id="global-content" className="space-y-2">
                {globalDataPlans.map((plan) => (
                  <button 
                    key={plan.id}
                    onClick={() => {
                      if (selectedGlobalPlan === plan.id) {
                        setSelectedGlobalPlan(null);
                      } else {
                        setSelectedGlobalPlan(plan.id);
                      }
                    }}
                    className={`relative w-full p-2.5 rounded-xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                      selectedGlobalPlan === plan.id
                        ? 'border-blue-500 bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 dark:border-blue-400 scale-[1.02] shadow-xl transform translate-y-[-2px]'
                        : 'border-gray-200 dark:border-gray-600 bg-gradient-to-r from-gray-100 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/10 hover:border-blue-400 dark:hover:border-blue-400 hover:scale-[1.01] hover:transform hover:translate-y-[-3px]'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-left flex-1">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{plan.data}</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">{plan.duration}</div>
                      </div>
                      <div className="flex-1 flex flex-col items-start justify-center pl-16">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{plan.price}</div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">{plan.dailyPrice}</div>
                      </div>
                      <div className="flex-1 flex justify-end items-center">
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedGlobalPlan(plan.id);
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 ml-2 cursor-pointer"
                        >
                          Buy
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // Data + Voice + SMS Plans
              <div className="space-y-2">
                {globalVoiceSmsPlans.map((plan) => (
                  <button 
                    key={plan.id}
                    onClick={() => {
                      if (selectedGlobalPlan === plan.id) {
                        setSelectedGlobalPlan(null);
                      } else {
                        setSelectedGlobalPlan(plan.id);
                      }
                    }}
                    className={`relative w-full p-2.5 rounded-xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                      selectedGlobalPlan === plan.id
                        ? 'border-orange-500 bg-gradient-to-r from-amber-100 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20 dark:border-orange-400 scale-[1.02] shadow-xl transform translate-y-[-2px]'
                        : 'border-gray-200 dark:border-gray-600 bg-gradient-to-r from-gray-100 to-amber-50/30 dark:from-gray-800/50 dark:to-amber-900/10 hover:border-amber-400 dark:hover:border-amber-400 hover:scale-[1.01] hover:transform hover:translate-y-[-3px]'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-left flex-1">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{plan.data}</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">{plan.duration}</div>
                      </div>
                      <div className="flex-1 flex flex-col items-start justify-center pl-8">
                        <div className="text-sm text-gray-600 dark:text-gray-400">{plan.voice}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{plan.sms}</div>
                      </div>
                      <div className="flex-1 flex flex-col items-start justify-center pl-8">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{plan.price}</div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">{plan.dailyPrice}</div>
                      </div>
                      <div className="flex-1 flex justify-end items-center">
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedGlobalPlan(plan.id);
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-500/40 active:scale-95 ml-2 cursor-pointer hover:transform hover:scale-105"
                        >
                          Buy
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button 
            onClick={() => setLocation('/destinations')}
            className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 hover:from-green-100 hover:to-green-150 dark:hover:from-green-800/40 dark:hover:to-green-700/40 border border-green-200 dark:border-green-700 rounded-xl p-4 text-left transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">🔍</div>
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                202+
              </div>
            </div>
            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">Browse All</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">All destinations</div>
          </button>
          
          <button 
            onClick={() => profile ? setLocation('/my-esims') : setLocation('/profile')}
            className={`rounded-xl p-4 text-left transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
              profile 
                ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 hover:from-blue-100 hover:to-blue-150 dark:hover:from-blue-800/40 dark:hover:to-blue-700/40 border border-blue-200 dark:border-blue-700' 
                : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-700/30 hover:from-gray-100 hover:to-gray-150 dark:hover:from-gray-700/40 dark:hover:to-gray-600/40 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">📱</div>
              {profile && (
                <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {userEsims.length}
                </div>
              )}
            </div>
            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
              {profile ? 'My eSIMs' : 'Sign In'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {profile 
                ? `${userEsims.length} ${userEsims.length === 1 ? 'active plan' : 'active plans'}` 
                : 'Access your eSIMs'
              }
            </div>
          </button>
        </div>
        </div>

        {/* Live Chat Modal - Bottom slide-up design */}
        {showLiveChat && (
          <div className="modal-overlay flex items-end" style={{ touchAction: 'none' }}>
            {/* Backdrop */}
            <div 
              className="modal-overlay bg-black/50 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setShowLiveChat(false)}
              style={{ backdropFilter: 'blur(4px)' }}
            />
            
            {/* Modal Content */}
            <div 
              className="modal-content relative w-full bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col"
              onClick={(e) => e.stopPropagation()}
              style={{ 
                zIndex: 10000,
                position: 'relative',
                height: '85vh',
                maxHeight: '85vh',
                minHeight: '75vh'
              }}
            >
              {/* Header - Native app style */}
              <div className="px-4 py-4 text-white rounded-t-3xl relative" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)' }}>
                {/* Drag Handle */}
                <div className="flex justify-center absolute top-2 left-0 right-0">
                  <div className="w-12 h-1 bg-white/30 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between mb-4 mt-2">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-bold">eSIMfo</h1>
                  </div>
                  <button 
                    onClick={() => setShowLiveChat(false)}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center active:bg-white/30 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Support Team Avatars */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2" style={{ borderColor: '#3B82F6' }}>
                      <span className="text-xs">👩‍💼</span>
                    </div>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2" style={{ borderColor: '#3B82F6' }}>
                      <span className="text-xs">👨‍💼</span>
                    </div>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2" style={{ borderColor: '#3B82F6' }}>
                      <span className="text-xs">👩‍💻</span>
                    </div>
                  </div>
                </div>

                <h2 className="text-lg font-medium mb-1">Hi, Welcome to eSIMfo 👋</h2>
                <p className="text-blue-100 text-sm">Our support team is here to help you 24/7</p>
              </div>

              {/* Chat Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {/* Welcome Message from Bot */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 shadow-sm max-w-[85%]">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#3B82F6' }}>
                      <span className="text-sm text-white">🎧</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">eSIMfo Support</div>
                      <div className="text-gray-700 dark:text-gray-300 text-sm">
                        Hello, adventurer! 🌍✨ At eSIMfo, we're here to make your travel experience epic. How can we assist you today?
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full bg-white dark:bg-gray-600 rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-left border border-gray-100 dark:border-gray-600 active:scale-[0.98]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">📱</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">I want an eSIM</span>
                      </div>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#3B82F6' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  <button className="w-full bg-white dark:bg-gray-600 rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-left border border-gray-100 dark:border-gray-600 active:scale-[0.98]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">🛠️</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">I already purchased an eSIM</span>
                      </div>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#3B82F6' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>

              {/* Message Input - Fixed at bottom */}
              <div 
                className="modal-input-area px-4 pt-4 border-t border-gray-100 dark:border-gray-600 flex-shrink-0"
                style={{ paddingBottom: '2.5rem' }}
              >
                <div className="bg-gray-50 dark:bg-gray-700 rounded-full shadow-sm border border-gray-200 dark:border-gray-600 flex items-center px-4 py-3">
                  <input
                    type="text"
                    placeholder="Send us a message"
                    className="flex-1 outline-none bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  <button className="ml-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors active:scale-95" style={{ backgroundColor: '#3B82F6' }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How It Works Modal */}
        {showHowItWorks && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-[9999] animate-in fade-in duration-300" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowHowItWorks(false);
            }}
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0,
              zIndex: 9999
            }}
          >
            <div 
              ref={howItWorksModalRef}
              className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-lg transform animate-in slide-in-from-bottom duration-300 shadow-2xl relative select-none"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleHowItWorksModalTouchStart}
              onTouchMove={handleHowItWorksModalTouchMove}
              onTouchEnd={handleHowItWorksModalTouchEnd}
              style={{ 
                zIndex: 10000,
                touchAction: 'manipulation',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none'
              }}
            >
              {/* Drag Handle */}
              <div className="flex justify-center py-2">
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              </div>

              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">How Does eSIMfo Work?</h2>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowHowItWorks(false);
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Get global data connectivity in just a few simple steps</p>
              </div>

              {/* Content */}
              <div className="px-5 py-4">
                {/* Step 1 */}
                <div className="flex items-start space-x-3 animate-in slide-in-from-left duration-500 delay-100">
                  <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform duration-200 cursor-pointer">
                    <img 
                      src={locationPinIcon} 
                      alt="Choose destination"
                      className="w-12 h-12 object-contain"
                    />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-0.5">Choose Your Destination and Plan</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Select your country and data plan</p>
                  </div>
                </div>

                {/* Connection Line 1 */}
                <div className="flex justify-start ml-6 my-2">
                  <div className="w-0.5 h-6 border-l-2 border-dashed border-gray-300 dark:border-gray-600 animate-in fade-in duration-300 delay-150"></div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start space-x-3 animate-in slide-in-from-left duration-500 delay-200">
                  <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform duration-200 cursor-pointer">
                    <img 
                      src={qrScanIcon} 
                      alt="QR scan setup"
                      className="w-12 h-12 object-contain"
                    />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-0.5">Set Up Your eSIM</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Scan QR code to install eSIM</p>
                  </div>
                </div>

                {/* Connection Line 2 */}
                <div className="flex justify-start ml-6 my-2">
                  <div className="w-0.5 h-6 border-l-2 border-dashed border-gray-300 dark:border-gray-600 animate-in fade-in duration-300 delay-250"></div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start space-x-3 animate-in slide-in-from-left duration-500 delay-300">
                  <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform duration-200 cursor-pointer">
                    <img 
                      src={signalEsimIcon} 
                      alt="Activate eSIM"
                      className="w-12 h-12 object-contain"
                    />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-0.5">Activate Your eSIM</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Enable and connect instantly</p>
                  </div>
                </div>

                {/* Get Started Button */}
                <div className="pt-3 animate-in slide-in-from-bottom duration-500 delay-400">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowHowItWorks(false);
                      setLocation('/search');
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 hover:shadow-lg"
                  >
                    <span>Get Started Now</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* eSIM Compatibility Check Modal */}
        {showCompatibilityCheck && compatibilityResult && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-[9999]" 
            onClick={() => setShowCompatibilityCheck(false)}
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0,
              zIndex: 9999
            }}
          >
            <div 
              ref={compatibilityModalRef}
              className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-md transform animate-in slide-in-from-bottom duration-300 shadow-2xl relative select-none"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleCompatibilityModalTouchStart}
              onTouchMove={handleCompatibilityModalTouchMove}
              onTouchEnd={handleCompatibilityModalTouchEnd}
              style={{ 
                zIndex: 10000,
                touchAction: 'manipulation',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none'
              }}
            >
              {/* Drag Handle */}
              <div className="flex justify-center py-2">
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              </div>

              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">eSIM Compatibility Check</h2>
                  <button 
                    onClick={() => setShowCompatibilityCheck(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Device compatibility results</p>
              </div>

              {/* Content */}
              <div className="px-4 py-6">
                {/* Result Icon and Status */}
                <div className="text-center mb-6">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    compatibilityResult.isCompatible 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {compatibilityResult.isCompatible ? (
                      <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${
                    compatibilityResult.isCompatible 
                      ? 'text-green-700 dark:text-green-300' 
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    {compatibilityResult.isCompatible ? 'Compatible!' : 'Not Compatible'}
                  </h3>
                  
                  <p className="text-gray-900 dark:text-gray-100 font-medium text-lg mb-1">
                    {compatibilityResult.deviceName}
                  </p>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {compatibilityResult.details}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {compatibilityResult.isCompatible ? (
                    <>
                      <button 
                        onClick={() => {
                          setShowCompatibilityCheck(false);
                          setLocation('/destinations');
                        }}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-5 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <span>Browse eSIM Plans</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => setShowCompatibilityCheck(false)}
                        className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-5 rounded-xl transition-colors duration-200"
                      >
                        Got it, thanks!
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setShowCompatibilityCheck(false)}
                      className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-5 rounded-xl transition-colors duration-200"
                    >
                      Understand
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* How Does eSIMfo Work - Compact Button */}
      <div className="max-w-screen-md mx-auto px-4 pb-2 pt-1">
        <div 
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              const currentScrollY = window.scrollY;
              setHowItWorksScrollY(currentScrollY);
              setShowHowItWorks(true);
            }
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const currentScrollY = window.scrollY;
            setHowItWorksScrollY(currentScrollY);
            setShowHowItWorks(true);
          }}
          className="w-full bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">How Does eSIMfo Work?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Get global data connectivity in just a few simple steps</p>
            </div>
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* eSIM Compatibility Check - Compact Button */}
      <div className="max-w-screen-md mx-auto px-4 pb-4">
        <button 
          onClick={checkDeviceCompatibility}
          className="w-full bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Check eSIM Compatibility</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Verify if your device supports eSIM technology</p>
            </div>
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </button>
      </div>

      {/* Sticky Checkout Bar - Exact copy from destinations */}
      {((selectedTab === 'regional' && selectedEuropaPlan) || (selectedTab === 'global' && selectedGlobalPlan)) && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-800/50 p-4 mx-auto max-w-md">
          {/* Selected Plan Details */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedTab === 'regional' && selectedEuropaPlan
                        ? `${europaPlans.find(p => p.id === selectedEuropaPlan)?.data} • ${europaPlans.find(p => p.id === selectedEuropaPlan)?.duration}`
                        : selectedTab === 'global' && selectedGlobalPlan
                        ? (globalPlanType === 'data' 
                            ? `${globalDataPlans.find(p => p.id === selectedGlobalPlan)?.data} • ${globalDataPlans.find(p => p.id === selectedGlobalPlan)?.duration}`
                            : `${globalVoiceSmsPlans.find(p => p.id === selectedGlobalPlan)?.data} • ${globalVoiceSmsPlans.find(p => p.id === selectedGlobalPlan)?.duration}`
                          )
                        : ''
                      }
                    </span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <div
                          key={bar}
                          className="w-1 rounded-sm bg-green-500"
                          style={{ height: `${4 + bar * 2}px` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedTab === 'global' && selectedGlobalPlan && globalPlanType === 'data-voice-sms' && (
                      <div className="text-xs opacity-75 mb-0.5">
                        {globalVoiceSmsPlans.find(p => p.id === selectedGlobalPlan)?.voice} • {globalVoiceSmsPlans.find(p => p.id === selectedGlobalPlan)?.sms}
                      </div>
                    )}
                    {selectedTab === 'regional' ? 'Europe Regional Plan' : 'Global Plan'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedTab === 'regional' && selectedEuropaPlan
                    ? europaPlans.find(p => p.id === selectedEuropaPlan)?.price
                    : selectedTab === 'global' && selectedGlobalPlan
                    ? (globalPlanType === 'data' 
                        ? globalDataPlans.find(p => p.id === selectedGlobalPlan)?.price
                        : globalVoiceSmsPlans.find(p => p.id === selectedGlobalPlan)?.price
                      )
                    : ''
                  }
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedTab === 'regional' && selectedEuropaPlan
                    ? europaPlans.find(p => p.id === selectedEuropaPlan)?.dailyPrice
                    : selectedTab === 'global' && selectedGlobalPlan
                    ? (globalPlanType === 'data' 
                        ? globalDataPlans.find(p => p.id === selectedGlobalPlan)?.dailyPrice
                        : globalVoiceSmsPlans.find(p => p.id === selectedGlobalPlan)?.dailyPrice
                      )
                    : ''
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          <Button
            onClick={() => setShowCheckoutModal(true)}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex-1 text-center">
                <span>Checkout</span>
              </div>
              <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </Button>
        </div>
      )}

      {/* Conditional TabBar - only show when no plan is selected */}
      {!((selectedTab === 'regional' && selectedEuropaPlan) || (selectedTab === 'global' && selectedGlobalPlan)) && (
        <TabBar 
          onPlusClick={() => setShowQuickActions(true)}
          onShopClick={() => {
            // If we're in global or regional tab, switch to local tab
            if (selectedTab === 'global' || selectedTab === 'regional') {
              setSelectedTab('local');
            }
          }}
        />
      )}

      {/* Checkout Modal for Regions */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        selectedPackage={
          selectedTab === 'regional' && selectedEuropaPlan
            ? europaPlans.find(plan => plan.id === selectedEuropaPlan)
            : selectedTab === 'global' && selectedGlobalPlan
            ? (globalPlanType === 'data' 
                ? globalDataPlans.find(plan => plan.id === selectedGlobalPlan)
                : globalVoiceSmsPlans.find(plan => plan.id === selectedGlobalPlan)
              )
            : null
        }
        country={{ name: "Europe Regional Plan", code: "EU", flagUrl: "" }}
        esimCount={esimCount}
        setEsimCount={setEsimCount}
      />

      {/* Quick Actions Modal - Premium Machine Feel */}
      {showQuickActions && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-[9999]" 
          onClick={() => setShowQuickActions(false)}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            zIndex: 9999
          }}
        >
          <div 
            ref={quickActionsModalRef}
            className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md transform animate-in slide-in-from-bottom duration-300 shadow-2xl relative border-t border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleQuickActionsModalTouchStart}
            onTouchMove={handleQuickActionsModalTouchMove}
            onTouchEnd={handleQuickActionsModalTouchEnd}
            style={{ zIndex: 10000 }}
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="px-6 pb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Quick Actions</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Choose your eSIM category to get started</p>
            </div>

            {/* Action Items */}
            <div className="px-6 pb-8 space-y-3">
              {/* Local eSIMs */}
              <button 
                onClick={() => {
                  setShowQuickActions(false);
                  setSelectedTab('local');
                }}
                className="w-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 rounded-2xl p-4 border border-blue-200 dark:border-blue-700 transition-all duration-200 group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Local eSIMs</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Perfect for single country travel</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Regional eSIMs */}
              <button 
                onClick={() => {
                  setShowQuickActions(false);
                  setSelectedTab('regional');
                }}
                className="w-full bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 rounded-2xl p-4 border border-green-200 dark:border-green-700 transition-all duration-200 group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Regional eSIMs</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Great for multi-country trips</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-green-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Global eSIMs */}
              <button 
                onClick={() => {
                  setShowQuickActions(false);
                  setSelectedTab('global');
                }}
                className="w-full bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 rounded-2xl p-4 border border-purple-200 dark:border-purple-700 transition-all duration-200 group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Global eSIMs</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Worldwide coverage plans</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* European Coverage Modal - Operators & Networks - New Compact Design */}
      {showCountriesModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-[9999]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCountriesModal(false);
              setSearchQuery('');
            }
          }}
        >
          <div 
            ref={coverageModalRef}
            className="bg-white dark:bg-gray-900 rounded-t-3xl w-full px-4 py-5 animate-slide-up transition-all duration-200 select-none modal-fixed-height flex flex-col"
            onTouchStart={handleCoverageModalTouchStart}
            onTouchMove={handleCoverageModalTouchMove}
            onTouchEnd={handleCoverageModalTouchEnd}
            style={{ 
              touchAction: 'manipulation',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
          >
            {/* Swipe Handle */}
            <div className="flex justify-center pb-4 flex-shrink-0">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>

            {/* Compact Header */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedTab === 'global' ? 'Global Coverage' : 'European Coverage'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Operators & Network Technologies</p>
              </div>
              <button
                onClick={() => {
                  setShowCountriesModal(false);
                  setSearchQuery('');
                }}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Compact Search Bar */}
            <div className="relative mb-3 flex-shrink-0">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search countries or operators..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (scrollableContentRef.current) {
                    scrollableContentRef.current.scrollTop = 0;
                  }
                }}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Compact Countries Grid */}
            <div ref={scrollableContentRef} className="flex-1 overflow-y-auto">
              {filteredEuropeanCoverage.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No countries or operators found</p>
                </div>
              ) : (
                <div className="space-y-2 pb-4">
                  {filteredEuropeanCoverage.map((coverage, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-3 border border-gray-100 dark:border-gray-700/50">
                      {/* Country Header - Compact */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <img 
                            src={coverage.flag} 
                            alt={coverage.country}
                            className="w-6 h-4 rounded shadow-sm"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{coverage.country}</h4>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                          {coverage.operators.length} operators
                        </span>
                      </div>

                      {/* Operators Grid - Ultra Compact */}
                      <div className="space-y-1">
                        {coverage.operators.map((operator, opIndex) => (
                          <div key={opIndex} className="flex items-center justify-between px-2 py-1.5 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{operator.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {operator.networks.map((network, netIndex) => (
                                <span 
                                  key={netIndex}
                                  className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                    network === '5G' 
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                  }`}
                                >
                                  {network}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Compact Summary Stats */}
              <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Coverage Summary</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {searchQuery 
                          ? `${filteredEuropeanCoverage.length} matching countries`
                          : `${europeanCoverage.length} countries • Premium 5G/LTE networks`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{filteredEuropeanCoverage.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Countries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Coverage Modal - Separate from European Coverage */}
      {showGlobalCoverageModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-[9999]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowGlobalCoverageModal(false);
              setSearchQuery('');
            }
          }}
        >
          <div 
            ref={globalCoverageModalRef}
            className="bg-white dark:bg-gray-900 rounded-t-3xl w-full px-4 py-5 animate-slide-up transition-all duration-200 select-none modal-fixed-height flex flex-col"
            onTouchStart={handleGlobalCoverageModalTouchStart}
            onTouchMove={handleGlobalCoverageModalTouchMove}
            onTouchEnd={handleGlobalCoverageModalTouchEnd}
            style={{ 
              touchAction: 'manipulation',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
          >
            {/* Swipe Handle */}
            <div className="flex justify-center pb-4 flex-shrink-0">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>

            {/* Global Header */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Global Coverage</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Operators & Network Technologies</p>
              </div>
              <button
                onClick={() => {
                  setShowGlobalCoverageModal(false);
                  setSearchQuery('');
                }}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Global Search Bar */}
            <div className="relative mb-3 flex-shrink-0">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search countries or operators..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (scrollableContentRef.current) {
                    scrollableContentRef.current.scrollTop = 0;
                  }
                }}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Global Content - Exactly same as European modal */}
            <div 
              ref={scrollableContentRef}
              className="flex-1 overflow-y-auto"
              style={{ 
                maxHeight: 'calc(100vh - 300px)',
                touchAction: 'pan-y',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {filteredEuropeanCoverage.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">No countries found</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try searching with different terms</p>
                </div>
              ) : (
                <div className="space-y-2 pb-4">
                  {filteredEuropeanCoverage.map((countryData, index) => (
                    <div 
                      key={`${countryData.country}-${index}`} 
                      className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl p-3 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <img 
                            src={countryData.flag}
                            alt={countryData.country}
                            className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                          />
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{countryData.country}</h4>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                          {countryData.operators.length} operators
                        </span>
                      </div>
                      <div className="space-y-1">
                        {countryData.operators.map((operator, opIndex) => (
                          <div key={`${countryData.country}-${operator.name}-${opIndex}`} className="flex items-center justify-between px-2 py-1.5 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{operator.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {operator.networks.map((network, netIndex) => (
                                <span 
                                  key={`${countryData.country}-${operator.name}-${network}-${netIndex}`}
                                  className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                    network === '5G' 
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                      : network === 'LTE' || network === '4G'
                                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                                  }`}
                                >
                                  {network}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Global Summary Stats */}
              <div className="mt-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Coverage Summary</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {searchQuery 
                          ? `${filteredEuropeanCoverage.length} matching countries`
                          : `${europeanCoverage.length} countries • Premium 5G/LTE networks`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-600 dark:text-gray-400">{filteredEuropeanCoverage.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Countries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plan Information Modal */}
      {showPlanInfoModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPlanInfoModal(false);
            }
          }}
        >
          <div 
            ref={planInfoModalRef}
            className="bg-white dark:bg-gray-800 rounded-t-2xl w-full p-4 sm:p-6 space-y-4 sm:space-y-6 animate-slide-up transition-all duration-200 select-none"
            onTouchStart={handlePlanInfoModalTouchStart}
            onTouchMove={handlePlanInfoModalTouchMove}
            onTouchEnd={handlePlanInfoModalTouchEnd}
            style={{ 
              touchAction: 'manipulation',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
          >
            {/* Swipe Handle */}
            <div className="flex justify-center pt-0 pb-2">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Technical Specifications</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Network & Compatibility Details</p>
              </div>
              <button
                onClick={() => setShowPlanInfoModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Network Configuration Section */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  Network Configuration
                </h4>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Network Technology</span>
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-green-600 dark:text-green-400">5G Ready, LTE/4G</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Activation Method</span>
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-green-600 dark:text-green-400">QR Code Scan</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">eKYC Verification</span>
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-red-600 dark:text-red-400">Not Required</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Roaming Support</span>
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-blue-600 dark:text-blue-400">Yes</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Protocol Support</span>
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">IPv4/IPv6</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">TOP-UP Option</span>
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-blue-600 dark:text-blue-400">Available</span>
                  </div>
                </div>
              </div>

              {/* Other Information Section */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Other Information
                </h4>
                
                <div className="p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-800/30">
                  <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    +1 global number, 91-day Turkey limit. 75% local / 25% intl. calls.
                  </p>
                </div>
              </div>

              {/* Countries Coverage Info */}
              <div className="mt-4 sm:mt-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <img src={globalCoverageIcon} alt="Global Coverage" className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Global Coverage</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Available worldwide</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900 dark:text-gray-100">137</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Countries</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Europe Plan Information Modal */}
      {showEuropePlanInfoModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEuropePlanInfoModal(false);
            }
          }}
        >
          <div 
            ref={europePlanInfoModalRef}
            className="bg-white dark:bg-gray-800 rounded-t-2xl w-full p-4 sm:p-6 space-y-4 sm:space-y-6 animate-slide-up transition-all duration-200 select-none"
            onTouchStart={handleEuropePlanInfoModalTouchStart}
            onTouchMove={handleEuropePlanInfoModalTouchMove}
            onTouchEnd={handleEuropePlanInfoModalTouchEnd}
            style={{ 
              touchAction: 'manipulation',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
          >
            {/* Swipe Handle */}
            <div className="flex justify-center pt-0 pb-2">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Technical Specifications</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Europe eSIM Plan Details</p>
              </div>
              <button
                onClick={() => setShowEuropePlanInfoModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Technical Specifications Section */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  Network & Plan Information
                </h4>
                
                <div className="grid gap-2 sm:gap-3">
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 717.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Network Technology</span>
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-green-600 dark:text-green-400">5G/LTE/3G</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Activation Method</span>
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-green-600 dark:text-green-400">QR Code Scan</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">eKYC Verification</span>
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-red-600 dark:text-red-400">Not Required</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Roaming Support</span>
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-blue-600 dark:text-blue-400">Yes</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Protocol Support</span>
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">IPv4/IPv6</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Plan Category</span>
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">Data Only</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">TOP-UP Option</span>
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-green-600 dark:text-green-400">Available</span>
                  </div>
                </div>
              </div>



              {/* Countries Coverage Info - Europe Specific */}
              <div className="mt-4 sm:mt-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <img src={europeCoverageIcon} alt="Europe Coverage" className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Europe Coverage</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Available across Europe</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900 dark:text-gray-100">36</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Countries</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Currency & Language Modal */}
      {showCurrencyLanguageModal && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCurrencyLanguageModal(false);
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose your preferences</p>
              </div>
              <button 
                onClick={() => setShowCurrencyLanguageModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Currency Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Currency
                </label>
                <select 
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {['Europe', 'Americas', 'Asia', 'Middle East', 'Africa', 'Oceania'].map(region => {
                    const regionCurrencies = currencies.filter(c => c.region === region);
                    if (regionCurrencies.length === 0) return null;
                    
                    return (
                      <optgroup key={region} label={region}>
                        {regionCurrencies.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.code} - {currency.name}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </div>

              {/* Language Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
                  </svg>
                  Language
                </label>
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {languages.map((language) => (
                    <option key={language.code} value={language.code}>
                      {language.flag} {language.nativeName} ({language.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Preview:</div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {currencies.find(c => c.code === selectedCurrency)?.symbol} {selectedCurrency}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{languages.find(l => l.code === selectedLanguage)?.flag}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {languages.find(l => l.code === selectedLanguage)?.nativeName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-2xl">
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCurrencyLanguageModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCurrencyLanguageModal(false)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

