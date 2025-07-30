import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { MessageCircle } from "lucide-react";
import profileImage from "@assets/IMG_5282_1753389516466.jpeg";
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

import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import CountryCard from "@/components/country-card";
import SkeletonCard from "@/components/skeleton-card";
import ErrorBoundary from "@/components/error-boundary";
import OfflinePage from "@/components/offline-page";
import CheckoutModal from "@/components/checkout-modal";

import type { Country, Package } from "@shared/schema";

export default function HomeScreen() {
  const [, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState('local');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [showCountriesModal, setShowCountriesModal] = useState(false);
  const [selectedEuropaPlan, setSelectedEuropaPlan] = useState<number>(1); // Default to first plan
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [esimCount, setEsimCount] = useState(1);
  
  // Global tab states
  const [globalPlanType, setGlobalPlanType] = useState<'data' | 'data-voice-sms'>('data');
  const [selectedGlobalPlan, setSelectedGlobalPlan] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollableContentRef = useRef<HTMLDivElement>(null);
  const [showPlanInfoModal, setShowPlanInfoModal] = useState(false);
  const planInfoModalRef = useRef<HTMLDivElement>(null);

  // Europa plan data
  const europaPlans = [
    { id: 1, duration: '10 Days', data: 'Unlimited', price: '€21.50', dailyPrice: '€2.15 /day' },
    { id: 2, duration: '180 Days', data: '100 GB', price: '€89.99', dailyPrice: '€0.50 /day' },
    { id: 3, duration: '30 Days', data: '50 GB', price: '€45.99', dailyPrice: '€1.53 /day' },
    { id: 4, duration: '15 Days', data: '20 GB', price: '€29.99', dailyPrice: '€2.00 /day' }
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

  // Filter European coverage based on search query
  const filteredEuropeanCoverage = europeanCoverage.filter(item =>
    item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.operators.some(operator => 
      operator.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Tab order for swipe navigation
  const tabOrder = ['local', 'regional', 'global'];

  // Handle tab change with smooth animation
  const handleTabChange = (newTab: string) => {
    if (newTab === selectedTab || isTransitioning) return;
    
    setIsTransitioning(true);
    
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
  const [showSearchResults, setShowSearchResults] = useState(false);
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

  // Prevent body scroll when "How it Works" modal is open
  useEffect(() => {
    if (showHowItWorks) {
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
  }, [showHowItWorks]);

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
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) throw new Error('Debug renderer info not available');
    
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_GL);
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_GL);
    
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
  
  // Detect user's country (in real app this would come from IP geolocation)
  const getUserCountry = () => {
    // Simulating different countries based on time for demo
    const countries = [
      { name: 'Turkey', code: 'TR', flag: '🇹🇷', price: '€2.99' },
      { name: 'Germany', code: 'DE', flag: '🇩🇪', price: '€3.49' },
      { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', price: '€3.99' },
      { name: 'France', code: 'FR', flag: '🇫🇷', price: '€4.49' },
      { name: 'Spain', code: 'ES', flag: '🇪🇸', price: '€3.49' }
    ];
    const index = Math.floor(Date.now() / 10000) % countries.length;
    return countries[index];
  };
  
  const userCountry = getUserCountry();

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

  const handleCountrySelect = (country: Country) => {
    setLocation(`/packages/${country.id}`);
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

  const searchResults = getEnhancedSearchResults();

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
  
  return (
    <div className="mobile-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen pb-20 swipe-container">
      {/* Compact Header with Search */}
      <div className="relative sticky top-0 z-10 py-4">
        <div className="max-w-screen-md mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* User Profile Photo */}
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border-2 border-blue-500">
              {profile?.name ? (
                <img 
                  src={profileImage} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
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
            {/* Currency Display */}
            <div className="flex items-center bg-green-50 border border-green-200 px-2 py-1 rounded-md">
              <span className="text-xs font-semibold text-green-700">€ EUR</span>
            </div>
            
            {/* Offline Indicator */}
            {!isOnline && (
              <div className="flex items-center bg-red-50 border border-red-200 px-2 py-1 rounded-md">
                <span className="text-xs font-semibold text-red-700">Offline</span>
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

      {/* Enhanced Search Bar with Smart Features - Fixed positioning */}
      <div className="max-w-screen-md mx-auto px-4 mb-4">
        <div className="relative z-[9999]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center space-x-3 hover:shadow-lg focus-within:shadow-xl focus-within:border-blue-500 focus-within:border-2 focus-within:scale-[1.02] transition-all duration-300 border border-gray-200 dark:border-gray-700 group">
            {/* Animated Search Icon */}
            <div className="relative">
              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 group-focus-within:scale-110 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {/* Pulse effect when focused */}
              <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-focus-within:opacity-20 group-focus-within:animate-ping"></div>
            </div>

            <input
              type="text"
              value={searchQuery}
              placeholder={searchQuery ? "Type country name..." : placeholderText}
              className="text-gray-700 dark:text-gray-300 text-base flex-1 outline-none bg-transparent placeholder-gray-500 dark:placeholder-gray-400 font-medium"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.length > 0);
              }}
              onFocus={() => {
                setShowSearchResults(searchQuery.length > 0);
              }}
              onBlur={() => {
                setTimeout(() => setShowSearchResults(false), 150);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (searchResults.length > 0) {
                    handleCountrySelect(searchResults[0]);
                    setSearchQuery('');
                    setShowSearchResults(false);
                  }
                }
                if (e.key === 'Escape') {
                  setSearchQuery('');
                  setShowSearchResults(false);
                  (e.target as HTMLInputElement).blur();
                }
              }}
            />

            {/* Search Actions */}
            <div className="flex items-center space-x-2">
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchResults(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors group/clear"
                >
                  <svg className="w-4 h-4 text-gray-400 group-hover/clear:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              
              {/* Keyboard shortcut hint */}
              <div className="hidden group-focus-within:flex items-center space-x-1 animate-fadeIn">
                <kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded border font-mono">ESC</kbd>
              </div>
            </div>
          </div>

          {/* Mobile Search Results */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 mt-1 z-[9999] overflow-hidden" style={{position: 'absolute', zIndex: 99999}}>
              {searchResults.map((country, index) => {
                // Create flag emoji from country code
                const getFlagEmoji = (code: string) => {
                  if (!code || code.length !== 2) return '🌍';
                  const codePoints = code.toUpperCase().split('').map(char => 
                    127397 + char.charCodeAt(0)
                  );
                  return String.fromCodePoint(...codePoints);
                };

                return (
                  <button
                    key={country.id}
                    onClick={() => {
                      handleCountrySelect(country);
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className="w-full px-4 py-3.5 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 text-left transition-all duration-200 active:bg-blue-50 dark:active:bg-blue-900/20 group"
                  >
                    {/* Premium Flag Container */}
                    <div className="relative">
                      <div className="w-11 h-11 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-600 group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                        <span className="text-xl filter drop-shadow-sm">{getFlagEmoji(country.code)}</span>
                      </div>
                      {/* Signal indicator */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {country.name}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{country.planCount} eSIMs</span>
                        {country.hasFullPlan && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                            📞 Full Plan
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
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
                color: 'bg-purple-500'
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
                  {/* Flag with subtle hover animation */}
                  <span className="text-2xl transform transition-transform duration-200 group-hover:scale-105">
                    {userCountry.flag}
                  </span>
                  <div className="text-left">
                    <h3 className="font-semibold text-base">{userCountry.name}</h3>
                    <p className="text-white/70 text-xs">Your current location</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm font-medium">From {userCountry.price}</div>
                  </div>
                  {/* Enhanced LOCAL badge */}
                  <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold transform transition-transform duration-200 group-hover:scale-105">
                    LOCAL
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
                  { name: 'United States', flagColors: ['#B22234', '#FFFFFF', '#3C3B6E'], price: '€4.99' },
                  { name: 'France', flagColors: ['#0055A4', '#FFFFFF', '#EF4135'], price: '€3.49' },
                  { name: 'China', flagColors: ['#DE2910'], price: '€5.99' },
                  { name: 'Spain', flagColors: ['#C60B1E', '#FFC400'], price: '€3.49' },
                  { name: 'Italy', flagColors: ['#009246', '#FFFFFF', '#CE2B37'], price: '€3.99' },
                  { name: 'Turkey', flagColors: ['#E30A17'], price: '€2.99' },
                  { name: 'United Kingdom', flagColors: ['#012169', '#FFFFFF', '#C8102E'], price: '€3.99' },
                  { name: 'Germany', flagColors: ['#000000', '#DD0000', '#FFCE00'], price: '€3.49' },
                  { name: 'Mexico', flagColors: ['#006847', '#FFFFFF', '#CE1126'], price: '€4.49' },
                  { name: 'Thailand', flagColors: ['#ED1C24', '#FFFFFF', '#241D4F'], price: '€3.99' },
                  { name: 'Hong Kong', flagColors: ['#DE2910'], price: '€5.49' },
                  { name: 'Malaysia', flagColors: ['#CC0001', '#FFFFFF', '#010066'], price: '€4.99' },
                  { name: 'Greece', flagColors: ['#0D5EAF', '#FFFFFF'], price: '€3.99' },
                  { name: 'Canada', flagColors: ['#FF0000', '#FFFFFF'], price: '€4.99' },
                  { name: 'South Korea', flagColors: ['#FFFFFF', '#C60C30', '#003478'], price: '€5.99' },
                  { name: 'Japan', flagColors: ['#FFFFFF', '#BC002D'], price: '€5.99' },
                  { name: 'Singapore', flagColors: ['#ED2939', '#FFFFFF'], price: '€5.49' },
                  { name: 'Aruba', flagColors: ['#318CE7', '#FFCE00'], price: '€6.99' },
                  { name: 'Afghanistan', flagColors: ['#000000', '#D32011', '#FFFFFF'], price: '€7.99' },
                  { name: 'Anguilla', flagColors: ['#012169', '#FFFFFF'], price: '€8.99' }
                ].map((country, index) => {
                  // Calculate row-based stagger delay for 2-column grid
                  const row = Math.floor(index / 2);
                  const col = index % 2;
                  const staggerDelay = row * 2 + col; // Row priority, then column
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleCountrySelect(countries[0])}
                      className={`bg-white dark:bg-gray-800 rounded-xl p-3 text-left shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] duration-200 animate-stagger-fade stagger-delay-${staggerDelay}`}
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
                    onClick={() => setSelectedContinent(null)}
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
              <div key="europa-plans" className="space-y-2 animate-slide-in-right">
                <div className="text-center mb-2">
                  <div className="flex items-center justify-center space-x-2 mb-0.5">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Europe eSIM Plans</h2>
                    <button
                      onClick={() => setShowPlanInfoModal(true)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors group"
                      title="Plan Information"
                    >
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowCountriesModal(true)}
                    className="inline-flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group"
                  >
                    <span>Coverage in 36 European Countries</span>
                    <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Europa Plan 1 - Unlimited */}
                <button 
                  onClick={() => setSelectedEuropaPlan(1)}
                  className={`w-full p-2.5 rounded-xl border-2 transition-all duration-200 ${
                    selectedEuropaPlan === 1
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 scale-[1.02] shadow-md'
                      : 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-500 hover:scale-[1.01]'
                  }`}>
                  <div className="flex items-center">
                    <div className="text-left flex-1">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">10 Days</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">Unlimited</div>
                    </div>
                    <div className="flex-1 flex flex-col items-start justify-center pl-16">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">21.50 €</div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">2.15 € /day</div>
                    </div>
                    <div className="flex-1 flex justify-end items-center">
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCheckoutModal(true);
                        }}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ml-2 cursor-pointer"
                      >
                        Buy
                      </div>
                    </div>
                  </div>
                </button>

                {/* Europa Plan 2 - 100GB */}
                <button 
                  onClick={() => setSelectedEuropaPlan(2)}
                  className={`w-full p-2.5 rounded-xl border-2 transition-all duration-200 ${
                    selectedEuropaPlan === 2
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 scale-[1.02] shadow-md'
                      : 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-500 hover:scale-[1.01]'
                  }`}>
                  <div className="flex items-center">
                    <div className="text-left flex-1">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">180 Days</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">100 GB</div>
                    </div>
                    <div className="flex-1 flex flex-col items-start justify-center pl-16">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">89.99 €</div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">0.50 € /day</div>
                    </div>
                    <div className="flex-1 flex justify-end items-center">
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCheckoutModal(true);
                        }}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ml-2 cursor-pointer"
                      >
                        Buy
                      </div>
                    </div>
                  </div>
                </button>

                {/* Europa Plan 3 - 50GB */}
                <button 
                  onClick={() => setSelectedEuropaPlan(3)}
                  className={`w-full p-2.5 rounded-xl border-2 transition-all duration-200 ${
                    selectedEuropaPlan === 3
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 scale-[1.02] shadow-md'
                      : 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-500 hover:scale-[1.01]'
                  }`}>
                  <div className="flex items-center">
                    <div className="text-left flex-1">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">30 Days</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">50 GB</div>
                    </div>
                    <div className="flex-1 flex flex-col items-start justify-center pl-16">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">45.99 €</div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">1.53 € /day</div>
                    </div>
                    <div className="flex-1 flex justify-end items-center">
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCheckoutModal(true);
                        }}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ml-2 cursor-pointer"
                      >
                        Buy
                      </div>
                    </div>
                  </div>
                </button>

                {/* Europa Plan 4 - 20GB */}
                <button 
                  onClick={() => setSelectedEuropaPlan(4)}
                  className={`w-full p-2.5 rounded-xl border-2 transition-all duration-200 ${
                    selectedEuropaPlan === 4
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 scale-[1.02] shadow-md'
                      : 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-500 hover:scale-[1.01]'
                  }`}>
                  <div className="flex items-center">
                    <div className="text-left flex-1">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">15 Days</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">20 GB</div>
                    </div>
                    <div className="flex-1 flex flex-col items-start justify-center pl-16">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">29.99 €</div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">2.00 € /day</div>
                    </div>
                    <div className="flex-1 flex justify-end items-center">
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCheckoutModal(true);
                        }}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ml-2 cursor-pointer"
                      >
                        Buy
                      </div>
                    </div>
                  </div>
                </button>
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
              <button 
                onClick={() => setShowCountriesModal(true)}
                className="text-xs text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200 hover:underline"
              >
                Coverage in 137 Countries Worldwide
              </button>
            </div>

            {/* Premium Tab system for Data vs Data+Voice+SMS - Enhanced gradients */}
            <div className="flex space-x-1 mb-4 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 p-1 rounded-2xl shadow-sm">
              <button
                onClick={() => setGlobalPlanType('data')}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  globalPlanType === 'data'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                Data
              </button>
              <button
                onClick={() => setGlobalPlanType('data-voice-sms')}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  globalPlanType === 'data-voice-sms'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-600 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                }`}
              >
                Data / Calls / Text
              </button>
            </div>

            {/* Global plan cards - Premium style with subtle indicators */}
            {globalPlanType === 'data' ? (
              // Data Only Plans
              <div className="space-y-2">
                {globalDataPlans.map((plan) => (
                  <button 
                    key={plan.id}
                    onClick={() => setSelectedGlobalPlan(plan.id)}
                    className={`relative w-full p-2.5 rounded-xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                      selectedGlobalPlan === plan.id
                        ? 'border-blue-500 bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 dark:border-blue-400 scale-[1.02] shadow-xl transform translate-y-[-2px]'
                        : 'border-gray-200 dark:border-gray-600 bg-gradient-to-r from-gray-100 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/10 hover:border-blue-400 dark:hover:border-blue-400 hover:scale-[1.01] hover:transform hover:translate-y-[-3px]'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-left flex-1">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{plan.duration}</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">{plan.data}</div>
                      </div>
                      <div className="flex-1 flex flex-col items-start justify-center pl-16">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{plan.price}</div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">{plan.dailyPrice}</div>
                      </div>
                      <div className="flex-1 flex justify-end items-center">
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCheckoutModal(true);
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
                    onClick={() => setSelectedGlobalPlan(plan.id)}
                    className={`relative w-full p-2.5 rounded-xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                      selectedGlobalPlan === plan.id
                        ? 'border-orange-500 bg-gradient-to-r from-amber-100 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20 dark:border-orange-400 scale-[1.02] shadow-xl transform translate-y-[-2px]'
                        : 'border-gray-200 dark:border-gray-600 bg-gradient-to-r from-gray-100 to-amber-50/30 dark:from-gray-800/50 dark:to-amber-900/10 hover:border-amber-400 dark:hover:border-amber-400 hover:scale-[1.01] hover:transform hover:translate-y-[-3px]'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-left flex-1">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{plan.duration}</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">{plan.data}</div>
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
                            setShowCheckoutModal(true);
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
            onClick={() => setShowHowItWorks(false)}
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
                    onClick={() => setShowHowItWorks(false)}
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
                    onClick={() => {
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
        <button 
          onClick={() => setShowHowItWorks(true)}
          className="w-full bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left"
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
        </button>
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

      <TabBar onPlusClick={() => setShowQuickActions(true)} />

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal
          isOpen={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          selectedPackage={europaPlans.find(plan => plan.id === selectedEuropaPlan)}
          country={europaCountry}
          esimCount={esimCount}
          setEsimCount={setEsimCount}
        />
      )}

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
            className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md transform animate-in slide-in-from-bottom duration-300 shadow-2xl relative border-t border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
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
                  setLocation('/destinations?tab=countries');
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
                  setLocation('/destinations?tab=regions');
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
                  setLocation('/destinations?tab=global');
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

      {/* European Coverage Modal - Operators & Networks */}
      {showCountriesModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCountriesModal(false);
              setSearchQuery('');
            }
          }}
        >
          <div 
            ref={coverageModalRef}
            className="bg-white dark:bg-gray-800 rounded-t-2xl w-full p-6 space-y-4 animate-slide-up transition-all duration-200 select-none modal-fixed-height flex flex-col"
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
            <div className="flex justify-center pt-0 pb-3 flex-shrink-0">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>

            {/* Header - Fixed */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedTab === 'global' ? 'Global Coverage' : 'European Coverage'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Operators & Network Technologies</p>
              </div>
              <button
                onClick={() => {
                  setShowCountriesModal(false);
                  setSearchQuery('');
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Bar - Fixed */}
            <div className="relative mb-4 flex-shrink-0">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search countries or operators..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  // Auto scroll to top when typing to show results
                  if (scrollableContentRef.current) {
                    scrollableContentRef.current.scrollTop = 0;
                  }
                }}
                onFocus={() => {
                  // Scroll to top when search is focused
                  if (scrollableContentRef.current) {
                    scrollableContentRef.current.scrollTop = 0;
                  }
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            {/* Scrollable Content Area */}
            <div ref={scrollableContentRef} className="flex-1 overflow-y-auto">
              {/* Countries with Operators */}
              <div className="space-y-3 pb-4">
              {filteredEuropeanCoverage.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No countries or operators found</p>
                </div>
              ) : (
                filteredEuropeanCoverage.map((coverage, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-600">
                    {/* Country Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src={coverage.flag} 
                        alt={coverage.country}
                        className="w-8 h-6 rounded shadow-sm"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{coverage.country}</h4>
                      <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                        {coverage.operators.length} operator{coverage.operators.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Operators List */}
                    <div className="grid grid-cols-1 gap-2">
                      {coverage.operators.map((operator, opIndex) => (
                        <div key={opIndex} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-600">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{operator.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {operator.networks.map((network, netIndex) => (
                              <span 
                                key={netIndex}
                                className={`text-xs px-2 py-1 rounded-md font-medium ${
                                  network === '5G' 
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                    : network === 'LTE'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                    : network === '4G'
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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
                ))
              )}
            </div>

              {/* Coverage Summary */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-blue-900 dark:text-blue-100">Coverage Summary</span>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {searchQuery 
                    ? `Showing ${filteredEuropeanCoverage.length} matching countries`
                    : `${europeanCoverage.length} European countries with premium network operators. All plans include 5G/LTE connectivity where available.`
                  }
                </p>
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
            className="bg-white dark:bg-gray-800 rounded-t-2xl w-full p-6 space-y-6 animate-slide-up transition-all duration-200 select-none"
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
            <div className="flex justify-center pt-0 pb-3">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Plan Information</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Europe eSIM Plans Details</p>
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

            {/* Plan Details */}
            <div className="space-y-4">
              {/* Plan Type */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">Plan Type</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Regional Data Plans for European Countries</p>
                </div>
              </div>

              {/* Roaming Support */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">Roaming Support</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Full roaming across 36 European countries without additional charges</p>
                </div>
              </div>

              {/* eKYC Verification */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">eKYC Verification</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">No identity verification required - instant activation</p>
                </div>
              </div>

              {/* Hotspot */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">Hotspot</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Personal hotspot enabled - share data with multiple devices</p>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                All Europe eSIM plans include premium network access with 5G/LTE connectivity where available
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

