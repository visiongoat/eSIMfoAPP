import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, Globe, MapPin, Navigation, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import CheckoutModal from "@/components/checkout-modal";
import europaIcon from "@assets/europamap.png";
import asiaIcon from "@assets/asiamap.png";
import americasIcon from "@assets/americasmaps.png";
import africaIcon from "@assets/africacontinentmap.png";
import middleEastIcon from "@assets/middleeastcontinentmap.png";
import oceaniaIcon from "@assets/oceaniacontinentmap.png";
import europeCoverageIcon from "@assets/europamap.png";
import type { Country } from "@shared/schema";

export default function DestinationsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<'countries' | 'regions' | 'global'>('countries');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  // Regional tab states from home page
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [selectedEuropaPlan, setSelectedEuropaPlan] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showCountriesModal, setShowCountriesModal] = useState(false);
  const [showEuropePlanInfoModal, setShowEuropePlanInfoModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  
  // Currency states
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  
  // Checkout states for regions
  const [esimCount, setEsimCount] = useState(1);
  
  // Currency definitions with symbols and conversion rates
  const currencies = [
    { code: 'EUR', symbol: '€', name: 'Euro', rate: 1.0 },
    { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.05 },
    { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.85 },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 155.0 },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.45 },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.65 },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', rate: 0.95 },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira', rate: 36.5 }
  ];
  
  // Modal refs and touch handlers for swipe-down dismissal
  const coverageModalRef = useRef<HTMLDivElement>(null);
  const europePlanInfoModalRef = useRef<HTMLDivElement>(null);
  const scrollableContentRef = useRef<HTMLDivElement>(null);
  
  // Touch/swipe states for modal dismissal
  const [modalStartY, setModalStartY] = useState<number>(0);
  const [modalCurrentY, setModalCurrentY] = useState<number>(0);
  const [isModalDragging, setIsModalDragging] = useState<boolean>(false);
  const [europePlanModalStartY, setEuropePlanModalStartY] = useState<number>(0);
  const [europePlanModalCurrentY, setEuropePlanModalCurrentY] = useState<number>(0);
  const [isEuropePlanModalDragging, setIsEuropePlanModalDragging] = useState<boolean>(false);
  
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

  // Europa plans data from home page (11 plans)
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
  
  // URL parametresini kontrol et ve tab'ı ayarla
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['countries', 'regions', 'global'].includes(tabParam)) {
      setSelectedTab(tabParam as 'countries' | 'regions' | 'global');
    }
  }, []);

  // Modal kapatıldığında body scroll'unu geri aktive et
  useEffect(() => {
    if (!showCountriesModal && !showEuropePlanInfoModal) {
      document.body.style.overflow = '';
    }
  }, [showCountriesModal, showEuropePlanInfoModal]);



  // Scroll listener for sticky search bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100); // Adjust threshold as needed
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [, setLocation] = useLocation();
  const [placeholderText, setPlaceholderText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Filter European coverage based on search query
  const filteredEuropeanCoverage = europeanCoverage.filter(coverage =>
    coverage.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coverage.operators.some(operator => 
      operator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      operator.networks.some(network => 
        network.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  );

  // Touch event handlers for coverage modal swipe-down dismissal - COPIED FROM HOME PAGE
  const handleCoverageModalTouchStart = (e: React.TouchEvent) => {
    // Only allow swipe if modal is not scrolled - KEY DIFFERENCE FROM BEFORE
    if (scrollableContentRef.current && scrollableContentRef.current.scrollTop > 0) {
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

  // Touch event handlers for Europe plan info modal swipe-down dismissal
  const handleEuropePlanInfoModalTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setEuropePlanModalStartY(touch.clientY);
    setEuropePlanModalCurrentY(touch.clientY);
    setIsEuropePlanModalDragging(true);
    // Disable body scroll during modal drag
    document.body.style.overflow = 'hidden';
  };

  const handleEuropePlanInfoModalTouchMove = (e: React.TouchEvent) => {
    if (!isEuropePlanModalDragging) return;
    
    // Prevent default behavior and stop propagation to avoid background scroll
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    setEuropePlanModalCurrentY(touch.clientY);
    
    const deltaY = touch.clientY - europePlanModalStartY;
    
    if (deltaY > 0 && europePlanInfoModalRef.current) {
      const opacity = Math.max(1 - deltaY / 300, 0.3);
      europePlanInfoModalRef.current.style.transform = `translateY(${deltaY}px)`;
      europePlanInfoModalRef.current.style.opacity = `${opacity}`;
    }
  };

  const handleEuropePlanInfoModalTouchEnd = (e: React.TouchEvent) => {
    if (!isEuropePlanModalDragging) return;
    
    const deltaY = europePlanModalCurrentY - europePlanModalStartY;
    
    // Re-enable body scroll
    document.body.style.overflow = '';
    
    if (deltaY > 80 && europePlanInfoModalRef.current) {
      europePlanInfoModalRef.current.style.transform = 'translateY(100%)';
      europePlanInfoModalRef.current.style.opacity = '0';
      setTimeout(() => {
        setShowEuropePlanInfoModal(false);
      }, 200);
    } else if (europePlanInfoModalRef.current) {
      europePlanInfoModalRef.current.style.transform = 'translateY(0)';
      europePlanInfoModalRef.current.style.opacity = '1';
    }
    
    setIsEuropePlanModalDragging(false);
    setEuropePlanModalStartY(0);
    setEuropePlanModalCurrentY(0);
  };

  // Smart search states (from home page)
  const [smartSearchResults, setSmartSearchResults] = useState<{
    countriesCountry: Country | null;
    regionsPackages: any[] | null;
    globalPackages: any[] | null;
    coverageType: 'europa' | 'global' | 'none';
  }>({
    countriesCountry: null,
    regionsPackages: null,
    globalPackages: null,
    coverageType: 'none'
  });
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Swipe navigation for tab switching
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX.current || !touchStartY.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;

      // Check if it's a horizontal swipe (more horizontal than vertical)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe right: move to previous tab
          if (selectedTab === 'global') {
            setSelectedTab('regions');
          } else if (selectedTab === 'regions') {
            setSelectedTab('countries');
          }
        } else if (deltaX < 0) {
          // Swipe left: move to next tab
          if (selectedTab === 'countries') {
            setSelectedTab('regions');
          } else if (selectedTab === 'regions') {
            setSelectedTab('global');
          }
        }
      }

      // Reset
      touchStartX.current = 0;
      touchStartY.current = 0;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [selectedTab]);

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

  // Scroll to top when component mounts
  useEffect(() => {
    // Force immediate scroll reset
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Additional reset for mobile devices
    const mobileContainer = document.querySelector('.mobile-container');
    if (mobileContainer) {
      mobileContainer.scrollTop = 0;
    }
  }, []);

  const { data: countries = [], isLoading } = useQuery<Country[]>({
    queryKey: ["/api/countries"],
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
  });

  // Smart search data (copied from home page)
  const europaCoverageCountries = [
    'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 
    'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 
    'Hungary', 'Iceland', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 
    'Luxembourg', 'Malta', 'Netherlands', 'Norway', 'Poland', 'Portugal', 
    'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland'
  ];

  const globalDataPlans = [
    { id: 1, data: '1 GB', duration: 7, price: '€12.99' },
    { id: 2, data: '3 GB', duration: 15, price: '€29.99' },
    { id: 3, data: '5 GB', duration: 30, price: '€49.99' },
    { id: 4, data: '10 GB', duration: 30, price: '€89.99' }
  ];

  const handleCountrySelect = (country: Country) => {
    setLocation(`/packages/${country.id}?from=destinations`);
  };

  // Smart search function (from home page)
  const performSmartSearch = (query: string) => {
    if (!query.trim()) {
      setSmartSearchResults({
        countriesCountry: null,
        regionsPackages: null,
        globalPackages: null,
        coverageType: 'none'
      });
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    
    // Find matching countries country
    const matchingCountry = countries.find(country => 
      country.name.toLowerCase().includes(searchTerm)
    );

    // Check if country is in Europa coverage
    const isInEuropa = europaCoverageCountries.some(europaCountry => 
      europaCountry.toLowerCase().includes(searchTerm) || 
      searchTerm.includes(europaCountry.toLowerCase())
    );

    // For global, assume any country not specifically in Europa is global
    const isInGlobal = !isInEuropa && matchingCountry;

    let coverageType: 'europa' | 'global' | 'none' = 'none';
    let regionsPackages = null;
    let globalPackages = null;

    if (isInEuropa) {
      coverageType = 'europa';
      regionsPackages = europaPlans;
    } else if (isInGlobal) {
      coverageType = 'global';
      globalPackages = globalDataPlans;
    }

    setSmartSearchResults({
      countriesCountry: matchingCountry || null,
      regionsPackages,
      globalPackages,
      coverageType
    });
  };

  // Handle search input changes with smart search
  const handleSmartSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
    
    // Debounce smart search
    setTimeout(() => {
      performSmartSearch(query);
    }, 300);
  };

  // Clear search and reset states
  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // Handle country selection with cleanup
  const selectCountry = (country: Country) => {
    handleCountrySelect(country);
    clearSearch();
  };

  // Get minimum price for a country from real packages
  const getMinPrice = (countryId: number) => {
    // Static price mapping based on our seeded packages
    const priceMap: { [key: number]: string } = {
      6: "11.90",  // France
      7: "8.90",   // Germany  
      8: "6.90",   // Japan
      9: "5.90",   // Turkey
      11: "4.50"   // United States
    };
    
    // Return mapped price or default price based on country characteristics
    if (priceMap[countryId]) {
      return priceMap[countryId];
    }
    
    // Generate consistent price based on country ID (not random)
    const basePrice = ((countryId * 7) % 40) / 10 + 0.99;
    return basePrice.toFixed(2);
  };

  // Enhanced search results with plan info
  const getEnhancedSearchResults = () => {
    if (!searchQuery.trim()) return [];
    
    const results = countries.filter(country => 
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5); // Show max 5 results
    
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



  // Enhanced search and filter functionality
  const getFilteredData = () => {
    let filteredData = [...countries];

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tab-based categorization
    if (selectedTab === 'countries') {
      // Show individual countries
      filteredData = filteredData;
    } else if (selectedTab === 'regions') {
      // Return empty array for regions - UI will handle the display directly
      return [];
    } else if (selectedTab === 'global') {
      // Global packages
      const globalPackages = [
        {
          id: 'global-world',
          name: 'Global Package',
          countryCount: 147,
          price: '€24.99',
          icon: '🌐',
          description: 'No limits - pay only for the data you use. Global coverage'
        },
        {
          id: 'business-global',
          name: 'Business Travel Points',
          countryCount: 43,
          price: '€18.50',
          icon: '💼',
          description: 'USA Global'
        },
        {
          id: 'usa-global',
          name: 'USA Global',
          countryCount: 40,
          price: '€15.99',
          icon: '🇺🇸',
          description: 'America and allied countries'
        },
        {
          id: 'africa-europe',
          name: 'Africa & Europe',
          countryCount: 57,
          price: '€12.80',
          icon: '🌍',
          description: 'Cross-continental coverage'
        }
      ];
      return globalPackages.filter(pkg =>
        searchQuery ? pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
      );
    }

    return filteredData;
  };

  const filteredData = getFilteredData();

  // Alphabet filter groups for countries
  const alphabetFilterGroups = [
    { label: 'All', value: 'all' },
    { label: 'A-D', value: 'A-D' },
    { label: 'E-K', value: 'E-K' },
    { label: 'L-Q', value: 'L-Q' },
    { label: 'R-Z', value: 'R-Z' }
  ];

  const getAlphabetFilteredCountries = () => {
    if (selectedFilter === 'all') return filteredData;
    
    const firstLetter = (country: any) => country.name?.charAt(0).toUpperCase();
    
    switch (selectedFilter) {
      case 'A-D':
        return filteredData.filter((country: any) => {
          const letter = firstLetter(country);
          return letter >= 'A' && letter <= 'D';
        });
      case 'E-K':
        return filteredData.filter((country: any) => {
          const letter = firstLetter(country);
          return letter >= 'E' && letter <= 'K';
        });
      case 'L-Q':
        return filteredData.filter((country: any) => {
          const letter = firstLetter(country);
          return letter >= 'L' && letter <= 'Q';
        });
      case 'R-Z':
        return filteredData.filter((country: any) => {
          const letter = firstLetter(country);
          return letter >= 'R' && letter <= 'Z';
        });
      default:
        return filteredData;
    }
  };

  const finalFilteredData = selectedTab === 'countries' ? getAlphabetFilteredCountries() : filteredData;

  return (
    <div ref={containerRef} className="mobile-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" style={{ scrollBehavior: 'auto' }}>
      <NavigationBar 
        title="Buy eSIM fo"
        showBack={true}
        onBack={() => setLocation('/home')}
        showCurrency={true}
        selectedCurrency={selectedCurrency}
        onCurrencyClick={() => setShowCurrencyModal(true)}
      />

      <div className="px-4 pt-0.5">
        {/* Search Bar - Becomes fixed when scrolled */}
        <div 
          ref={searchBarRef}
          className={`${
            isScrolled 
              ? 'fixed top-0 left-0 right-0 z-50 shadow-lg' 
              : 'relative z-10 mb-6'
          } bg-gradient-to-br from-gray-50/95 via-white/95 to-gray-100/95 dark:bg-gradient-to-br dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 backdrop-blur-md transition-all duration-300 ${isScrolled ? '' : '-mx-4'} px-4`}
        >
        <div className="max-w-md mx-auto py-2">
          <div className="bg-gradient-to-r from-white via-gray-50 to-white dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 rounded-2xl p-4 flex items-center space-x-3 hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-50 hover:via-white hover:to-blue-50 dark:hover:from-gray-750 dark:hover:via-gray-700 dark:hover:to-gray-750 focus-within:shadow-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 focus-within:scale-[1.02] transition-all duration-300 border border-gray-200 dark:border-gray-700 group backdrop-blur-sm">
            {/* Enhanced Animated Search Icon */}
            <div className="relative flex-shrink-0">
              <Search className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 group-focus-within:scale-110 transition-all duration-300" />
              {/* Search pulse effect */}
              <div className="absolute inset-0 w-5 h-5 rounded-full bg-blue-500/20 scale-0 group-focus-within:scale-150 group-focus-within:opacity-0 transition-all duration-500"></div>
            </div>

            {/* Enhanced Search Input */}
            <input
              type="text"
              placeholder={placeholderText || "Search destinations..."}
              value={searchQuery}
              onChange={handleSmartSearchChange}
              onFocus={() => {
                setShowSearchResults(searchQuery.length > 0);
              }}
              onBlur={(e) => {
                // Don't hide results if X button is being clicked
                const relatedTarget = e.relatedTarget as HTMLButtonElement;
                if (relatedTarget && relatedTarget.closest('.clear-button')) {
                  return;
                }
                setTimeout(() => setShowSearchResults(false), 150);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  clearSearch();
                  (e.target as HTMLInputElement).blur();
                }
                if (e.key === 'Enter' && searchResults.length > 0) {
                  e.preventDefault();
                  selectCountry(searchResults[0]);
                }
              }}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-base font-medium group-focus-within:placeholder-blue-400 transition-all duration-300 touch-manipulation"
            />

            {/* Search Actions */}
            <div className="flex items-center space-x-2">
              {searchQuery && (
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    clearSearch();
                  }}
                  className="clear-button flex-shrink-0 w-6 h-6 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              
              {/* Keyboard shortcut hint - ESC Badge */}
              <div className="hidden group-focus-within:flex items-center space-x-1 animate-fadeIn">
                <kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded border font-mono">ESC</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Search Results Container - Position relative for absolute positioning */}
        <div className={`relative ${isScrolled ? 'pt-20' : ''}`}>
          {/* Mobile Search Results with swipe-friendly touch targets */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-[9999] overflow-hidden">
              {searchResults.map((country: any, index: number) => {
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
                    onClick={() => selectCountry(country)}
                    className="w-full px-4 py-3.5 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 text-left transition-all duration-200 active:bg-blue-50 dark:active:bg-blue-900/20 active:scale-[0.98] group touch-manipulation"
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

        {/* Modern Pill-Style Tabs - Full Width */}
        <div className="-mb-2">
          <div className="flex gap-1 p-1.5 bg-gradient-to-r from-gray-100/80 via-white to-gray-100/80 dark:from-gray-800/80 dark:via-gray-700 dark:to-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-700/40">
            {[
              { 
                id: 'countries', 
                label: 'Countries', 
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                color: 'bg-blue-500'
              },
              { 
                id: 'regions', 
                label: 'Regions', 
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
                onClick={() => setSelectedTab(tab.id as any)}
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



        {/* Enhanced Alphabet Filter (only for countries) */}
        {selectedTab === 'countries' && (
          <div className="mb-4 mt-8">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {alphabetFilterGroups.map((group, index) => (
                <button
                  key={group.value}
                  onClick={() => setSelectedFilter(group.value)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 animate-fadeInUp ${
                    selectedFilter === group.value
                      ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                      : 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-300 hover:via-gray-200 hover:to-gray-300 dark:hover:bg-gradient-to-r dark:hover:from-gray-600 dark:hover:via-gray-500 dark:hover:to-gray-600 hover:scale-105 hover:shadow-md'
                  }`}
                >
                  {group.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Content Area */}
        <div className="mt-7">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div 
                key={index} 
                className="mobile-card bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 p-4 animate-pulse"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-4">
                  {/* Flag skeleton with enhanced shimmer */}
                  <div className="relative w-10 h-7 rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    {/* Country name skeleton */}
                    <div className="relative h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-md w-32 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" style={{ animationDelay: `${index * 150}ms` }}></div>
                    </div>
                    
                    {/* Price skeleton */}
                    <div className="relative h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-20 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" style={{ animationDelay: `${index * 200}ms` }}></div>
                    </div>
                  </div>
                  
                  {/* Chevron skeleton */}
                  <div className="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 mb-2">
            {selectedTab === 'countries' ? (
              // Premium Countries List with Stagger Animation
              finalFilteredData.map((country: any, index: number) => (
                <button
                  key={country.id}
                  onClick={() => handleCountrySelect(country)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="mobile-card bg-gradient-to-br from-white via-blue-50/20 to-gray-50/40 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-750/30 dark:to-gray-800 py-2 px-4 w-full text-left hover:bg-gradient-to-br hover:from-blue-50/60 hover:via-white hover:to-purple-50/30 dark:hover:bg-gradient-to-r dark:hover:from-gray-700/70 dark:hover:via-gray-600/70 dark:hover:to-gray-700/70 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] group animate-fadeInUp border border-transparent hover:border-blue-500/20 dark:hover:border-blue-400/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Enhanced Flag Container */}
                      <div className="relative">
                        <img 
                          src={country.flagUrl} 
                          alt={`${country.name} flag`} 
                          className="w-10 h-7 rounded-md object-cover shadow-sm ring-1 ring-gray-200 dark:ring-gray-600" 
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-transparent to-white/10"></div>
                      </div>
                      
                      {/* Country Info */}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-base tracking-wide group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {country.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            From €{getMinPrice(country.id)}
                          </p>
                          {/* Premium Badge for Popular Countries */}
                          {(['United States', 'France', 'China', 'Spain', 'Italy', 'Turkey', 'United Kingdom', 'Germany', 'Mexico', 'Thailand', 'Hong Kong', 'Malaysia', 'Greece', 'Canada', 'South Korea', 'Japan', 'Singapore', 'Aruba', 'Afghanistan', 'Anguilla'].includes(country.name)) && (
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Chevron */}
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))
            ) : selectedTab === 'regions' ? (
              // Regional content from home page
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
                            setSelectedPlan(null);
                          } else {
                            setSelectedEuropaPlan(plan.id);
                            setSelectedPlan(plan);
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
                                  setSelectedPlan(null);
                                } else {
                                  setSelectedEuropaPlan(plan.id);
                                  setSelectedPlan(plan);
                                }
                                // Haptic feedback
                                if (navigator.vibrate) {
                                  navigator.vibrate(30);
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
                    
                    {/* Bottom spacing for sticky checkout */}
                    <div className="pb-30"></div>
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
              // Empty global content
              <div></div>
            )}
          </div>
        )}
        </div>
      </div>



      {/* Quick Actions Modal - Same as Home */}
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
                  setSelectedTab('countries');
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
                  setSelectedTab('regions');
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
              document.body.style.overflow = '';
            }
          }}
          onTouchMove={(e) => {
            // Prevent background scroll when modal is open
            e.preventDefault();
          }}
          style={{ touchAction: 'none' }}
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
                  European Coverage
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
            <div 
              ref={scrollableContentRef} 
              className="flex-1 overflow-y-auto"
            >
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
                                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                                      : network === 'LTE' 
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
                  ))}
                </div>
              )}
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
              document.body.style.overflow = '';
            }
          }}
          onTouchMove={(e) => {
            // Prevent background scroll when modal is open
            e.preventDefault();
          }}
          style={{ touchAction: 'none' }}
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

      {/* Currency Selection Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl w-full p-6 space-y-4 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Currency</h3>
              <button
                onClick={() => setShowCurrencyModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    setSelectedCurrency(currency.code);
                    setShowCurrencyModal(false);
                    // Haptic feedback
                    if (navigator.vibrate) {
                      navigator.vibrate(30);
                    }
                  }}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedCurrency === currency.code
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currency.symbol}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {currency.code}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {currency.name}
                      </div>
                    </div>
                  </div>
                  {selectedCurrency === currency.code && (
                    <div className="mt-2 flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">Selected</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Exchange rates are approximate and may vary during checkout
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Section for Europe Plans */}
      {selectedTab === 'regions' && selectedContinent === 'europa' && selectedPlan && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-800/50 p-4 mx-auto max-w-md">
          {/* Selected Plan Details */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedPlan.data} • {selectedPlan.duration}
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
                    Europe Regional Plan
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedPlan.price}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedPlan.dailyPrice}
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

      {/* Checkout Modal for Regions */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        selectedPackage={selectedPlan}
        country={{ name: "Europe Regional Plan", code: "EU", flagUrl: "" }}
        esimCount={esimCount}
        setEsimCount={setEsimCount}
      />
    </div>
  );
}