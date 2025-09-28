import { 
  users, countries, packages, esims, partnerStats, sales, referrals, creditTransactions,
  type User, type InsertUser, type Country, type InsertCountry,
  type Package, type InsertPackage, type Esim, type InsertEsim,
  type PartnerStats, type InsertPartnerStats, type Sale, type InsertSale,
  type Referral, type InsertReferral, type CreditTransaction, type InsertCreditTransaction
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByReferralCode(code: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Referrals
  getReferralHistory(userId: number): Promise<any[]>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  
  // Credit Transactions
  createCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction>;
  
  // Countries
  getAllCountries(): Promise<Country[]>;
  getCountry(id: number): Promise<Country | undefined>;
  getCountryByCode(code: string): Promise<Country | undefined>;
  searchCountries(query: string): Promise<Country[]>;
  createCountry(country: InsertCountry): Promise<Country>;
  
  // Packages
  getPackagesByCountry(countryId: number): Promise<Package[]>;
  getPackage(id: number): Promise<Package | undefined>;
  getPopularPackages(): Promise<Package[]>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  
  // eSIMs
  getEsimsByUser(userId: number): Promise<Esim[]>;
  getEsim(id: number): Promise<Esim | undefined>;
  createEsim(esim: InsertEsim): Promise<Esim>;
  updateEsimStatus(id: number, status: string): Promise<Esim | undefined>;
  updateEsimDataUsage(id: number, dataUsed: string): Promise<Esim | undefined>;
  
  // Partner Stats
  getPartnerStats(userId: number): Promise<PartnerStats | undefined>;
  createPartnerStats(stats: InsertPartnerStats): Promise<PartnerStats>;
  updatePartnerStats(userId: number, updates: Partial<PartnerStats>): Promise<PartnerStats | undefined>;
  
  // Sales
  getSalesByPartner(partnerId: number): Promise<Sale[]>;
  getRecentSales(partnerId: number, limit: number): Promise<Sale[]>;
  createSale(sale: InsertSale): Promise<Sale>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private countries: Map<number, Country>;
  private packages: Map<number, Package>;
  private esims: Map<number, Esim>;
  private partnerStats: Map<number, PartnerStats>;
  private sales: Map<number, Sale>;
  private referrals: Map<number, Referral>;
  private creditTransactions: Map<number, CreditTransaction>;
  private currentUserId: number;
  private currentCountryId: number;
  private currentPackageId: number;
  private currentEsimId: number;
  private currentPartnerStatsId: number;
  private currentSaleId: number;
  private currentReferralId: number;
  private currentCreditTransactionId: number;

  constructor() {
    this.users = new Map();
    this.countries = new Map();
    this.packages = new Map();
    this.esims = new Map();
    this.partnerStats = new Map();
    this.sales = new Map();
    this.referrals = new Map();
    this.creditTransactions = new Map();
    this.currentUserId = 1;
    this.currentCountryId = 1;
    this.currentPackageId = 1;
    this.currentEsimId = 1;
    this.currentPartnerStatsId = 1;
    this.currentSaleId = 1;
    this.currentReferralId = 1;
    this.currentCreditTransactionId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed all countries from images - alphabetically sorted
    const seedCountries = [
      { name: "Afghanistan", code: "AF", flagUrl: "https://flagcdn.com/w40/af.png", region: "Asia", coverage: "Good", network: "4G", operators: ["Afghan Telecom", "Roshan", "Etisalat"] },
      { name: "Albania", code: "AL", flagUrl: "https://flagcdn.com/w40/al.png", region: "Europe", coverage: "Good", network: "4G", operators: ["Vodafone", "ONE", "Plus"] },
      { name: "Algeria", code: "DZ", flagUrl: "https://flagcdn.com/w40/dz.png", region: "Africa", coverage: "Good", network: "4G", operators: ["Mobilis", "Djezzy", "Ooredoo"] },
      { name: "Andorra", code: "AD", flagUrl: "https://flagcdn.com/w40/ad.png", region: "Europe", coverage: "Excellent", network: "5G", operators: ["Andorra Telecom"] },
      { name: "Anguilla", code: "AI", flagUrl: "https://flagcdn.com/w40/ai.png", region: "Caribbean", coverage: "Good", network: "4G", operators: ["Flow"] },
      { name: "Antigua and Barbuda", code: "AG", flagUrl: "https://flagcdn.com/w40/ag.png", region: "Caribbean", coverage: "Good", network: "4G", operators: ["Flow", "Digicel"] },
      { name: "Argentina", code: "AR", flagUrl: "https://flagcdn.com/w40/ar.png", region: "South America", coverage: "Good", network: "4G", operators: ["Claro", "Movistar", "Personal"] },
      { name: "Armenia", code: "AM", flagUrl: "https://flagcdn.com/w40/am.png", region: "Asia", coverage: "Good", network: "4G", operators: ["Beeline", "Ucom", "Tele2"] },
      { name: "Aruba", code: "AW", flagUrl: "https://flagcdn.com/w40/aw.png", region: "Caribbean", coverage: "Good", network: "4G", operators: ["Digicel", "Setar"] },
      { name: "Australia", code: "AU", flagUrl: "https://flagcdn.com/w40/au.png", region: "Oceania", coverage: "Excellent", network: "5G", operators: ["Telstra", "Optus", "Vodafone"] },
      { name: "Austria", code: "AT", flagUrl: "https://flagcdn.com/w40/at.png", region: "Europe", coverage: "Excellent", network: "5G", operators: ["A1", "T-Mobile", "Drei"] },
      { name: "Azerbaijan", code: "AZ", flagUrl: "https://flagcdn.com/w40/az.png", region: "Asia", coverage: "Good", network: "4G", operators: ["Azercell", "Bakcell", "Nar"] },
      { name: "Bahamas", code: "BS", flagUrl: "https://flagcdn.com/w40/bs.png", region: "Caribbean", coverage: "Good", network: "4G", operators: ["BTC", "Aliv"] },
      { name: "Bahrain", code: "BH", flagUrl: "https://flagcdn.com/w40/bh.png", region: "Middle East", coverage: "Excellent", network: "5G", operators: ["Batelco", "Zain", "STC"] },
      { name: "Bangladesh", code: "BD", flagUrl: "https://flagcdn.com/w40/bd.png", region: "Asia", coverage: "Good", network: "4G", operators: ["Grameenphone", "Robi", "Banglalink"] },
      { name: "Barbados", code: "BB", flagUrl: "https://flagcdn.com/w40/bb.png", region: "Caribbean", coverage: "Good", network: "4G", operators: ["Flow", "Digicel"] },
      { name: "Belarus", code: "BY", flagUrl: "https://flagcdn.com/w40/by.png", region: "Europe", coverage: "Good", network: "4G", operators: ["A1", "MTS", "life"] },
      { name: "Belgium", code: "BE", flagUrl: "https://flagcdn.com/w40/be.png", region: "Europe", coverage: "Excellent", network: "5G", operators: ["Proximus", "Orange", "BASE"] },
      { name: "Belize", code: "BZ", flagUrl: "https://flagcdn.com/w40/bz.png", region: "Central America", coverage: "Good", network: "4G", operators: ["Belize Telemedia", "Smart"] },
      { name: "Benin", code: "BJ", flagUrl: "https://flagcdn.com/w40/bj.png", region: "Africa", coverage: "Good", network: "4G", operators: ["MTN", "Moov", "Glo"] },
      { name: "Bermuda", code: "BM", flagUrl: "https://flagcdn.com/w40/bm.png", region: "North America", coverage: "Good", network: "4G", operators: ["One", "CellularOne"] },
      { name: "Bhutan", code: "BT", flagUrl: "https://flagcdn.com/w40/bt.png", region: "Asia", coverage: "Good", network: "4G", operators: ["Bhutan Telecom", "TashiCell"] },
      { name: "Bolivia", code: "BO", flagUrl: "https://flagcdn.com/w40/bo.png", region: "South America", coverage: "Good", network: "4G", operators: ["Tigo", "Entel", "Viva"] },
      { name: "Bonaire", code: "BQ", flagUrl: "https://flagcdn.com/w40/bq.png", region: "Caribbean", coverage: "Good", network: "4G", operators: ["Telbo"] },
      { name: "Bosnia and Herzegovina", code: "BA", flagUrl: "https://flagcdn.com/w40/ba.png", region: "Europe", coverage: "Good", network: "4G", operators: ["BH Telecom", "HT Eronet", "m:tel"] },
      { name: "Botswana", code: "BW", flagUrl: "https://flagcdn.com/w40/bw.png", region: "Africa", coverage: "Good", network: "4G", operators: ["Mascom", "Orange", "BTC"] },
      { name: "Brazil", code: "BR", flagUrl: "https://flagcdn.com/w40/br.png", region: "South America", coverage: "Good", network: "4G/5G", operators: ["Vivo", "Claro", "TIM"] },
      { name: "Brunei", code: "BN", flagUrl: "https://flagcdn.com/w40/bn.png", region: "Asia", coverage: "Good", network: "4G", operators: ["DST", "imagine", "Progresif"] },
      { name: "Bulgaria", code: "BG", flagUrl: "https://flagcdn.com/w40/bg.png", region: "Europe", coverage: "Good", network: "4G/5G", operators: ["Vivacom", "A1", "Telenor"] },
      { name: "Burkina Faso", code: "BF", flagUrl: "https://flagcdn.com/w40/bf.png", region: "Africa", coverage: "Good", network: "4G", operators: ["Orange", "Telmob", "Telecel"] },
      { name: "Cambodia", code: "KH", flagUrl: "https://flagcdn.com/w40/kh.png", region: "Asia", coverage: "Good", network: "4G", operators: ["Cellcard", "Smart", "Metfone"] },
      { name: "Cameroon", code: "CM", flagUrl: "https://flagcdn.com/w40/cm.png", region: "Africa", coverage: "Good", network: "4G", operators: ["Orange", "MTN", "Nexttel"] },
      { name: "Canada", code: "CA", flagUrl: "https://flagcdn.com/w40/ca.png", region: "North America", coverage: "Excellent", network: "5G", operators: ["Rogers", "Bell", "Telus"] },
      { name: "Cape Verde", code: "CV", flagUrl: "https://flagcdn.com/w40/cv.png", region: "Africa", coverage: "Good", network: "4G", operators: ["Unitel T+", "CVMóvel"] },
      { name: "Cayman Islands", code: "KY", flagUrl: "https://flagcdn.com/w40/ky.png", region: "Caribbean", coverage: "Good", network: "4G", operators: ["Flow", "Digicel"] },
      { name: "Central African Republic", code: "CF", flagUrl: "https://flagcdn.com/w40/cf.png", region: "Africa", coverage: "Fair", network: "3G/4G", operators: ["Orange", "Telecel"] },
      { name: "Chad", code: "TD", flagUrl: "https://flagcdn.com/w40/td.png", region: "Africa", coverage: "Fair", network: "3G/4G", operators: ["Airtel", "Tigo"] },
      { name: "Chile", code: "CL", flagUrl: "https://flagcdn.com/w40/cl.png", region: "South America", coverage: "Good", network: "4G/5G", operators: ["Movistar", "Claro", "Entel"] },
      { name: "China", code: "CN", flagUrl: "https://flagcdn.com/w40/cn.png", region: "Asia", coverage: "Excellent", network: "5G", operators: ["China Mobile", "China Unicom", "China Telecom"] },
      { name: "Colombia", code: "CO", flagUrl: "https://flagcdn.com/w40/co.png", region: "South America", coverage: "Good", network: "4G", operators: ["Claro", "Movistar", "Tigo"] },
      { name: "Costa Rica", code: "CR", flagUrl: "https://flagcdn.com/w40/cr.png", region: "Central America", coverage: "Good", network: "4G", operators: ["Kolbi", "Claro", "Movistar"] },
      { name: "Croatia", code: "HR", flagUrl: "https://flagcdn.com/w40/hr.png", region: "Europe", coverage: "Good", network: "4G/5G", operators: ["Hrvatski Telekom", "A1", "Telemach"] },
      { name: "Curacao", code: "CW", flagUrl: "https://flagcdn.com/w40/cw.png", region: "Caribbean", coverage: "Good", network: "4G", operators: ["Flow", "Digicel"] },
      { name: "Cyprus", code: "CY", flagUrl: "https://flagcdn.com/w40/cy.png", region: "Europe", coverage: "Good", network: "4G/5G", operators: ["Cyta", "Epic", "PrimeTel"] },
      { name: "Czech Republic", code: "CZ", flagUrl: "https://flagcdn.com/w40/cz.png", region: "Europe", coverage: "Excellent", network: "5G", operators: ["O2", "T-Mobile", "Vodafone"] },
      { name: "Democratic Republic of the Congo", code: "CD", flagUrl: "https://flagcdn.com/w40/cd.png", region: "Africa", coverage: "Fair", network: "3G/4G", operators: ["Vodacom", "Orange", "Airtel"] },
      { name: "Denmark", code: "DK", flagUrl: "https://flagcdn.com/w40/dk.png", region: "Europe", coverage: "Excellent", network: "5G", operators: ["TDC", "Telenor", "Telia"] },
      { name: "Dominica", code: "DM", flagUrl: "https://flagcdn.com/w40/dm.png", region: "Caribbean", coverage: "Good", network: "4G", operators: ["Flow", "Digicel"] },
      { name: "Dominican Republic", code: "DO", flagUrl: "https://flagcdn.com/w40/do.png", region: "Caribbean", coverage: "Good", network: "4G", operators: ["Claro", "Orange", "Viva"] },
      { name: "Ecuador", code: "EC", flagUrl: "https://flagcdn.com/w40/ec.png", region: "South America", coverage: "Good", network: "4G", operators: ["Claro", "Movistar", "CNT"] },
      { name: "Egypt", code: "EG", flagUrl: "https://flagcdn.com/w40/eg.png", region: "Africa", coverage: "Good", network: "4G", operators: ["Orange", "Vodafone", "Etisalat"] },
      { name: "El Salvador", code: "SV", flagUrl: "https://flagcdn.com/w40/sv.png", region: "Central America", coverage: "Good", network: "4G", operators: ["Claro", "Movistar", "Tigo"] },
      { name: "Estonia", code: "EE", flagUrl: "https://flagcdn.com/w40/ee.png", region: "Europe", coverage: "Excellent", network: "5G", operators: ["Telia", "Elisa", "Tele2"] },
      { name: "Ethiopia", code: "ET", flagUrl: "https://flagcdn.com/w40/et.png", region: "Africa", coverage: "Fair", network: "3G/4G", operators: ["Ethio Telecom", "Safaricom"] },
      { name: "Faroe Islands", code: "FO", flagUrl: "https://flagcdn.com/w40/fo.png", region: "Europe", coverage: "Good", network: "4G", operators: ["Faroese Telecom", "Vodafone"] },
      { name: "Fiji", code: "FJ", flagUrl: "https://flagcdn.com/w40/fj.png", region: "Oceania", coverage: "Good", network: "4G", operators: ["Vodafone", "Digicel"] },
      { name: "Finland", code: "FI", flagUrl: "https://flagcdn.com/w40/fi.png", region: "Europe", coverage: "Excellent", network: "5G", operators: ["Elisa", "Telia", "DNA"] },
      { name: "France", code: "FR", flagUrl: "https://flagcdn.com/w40/fr.png", region: "Europe", coverage: "Excellent", network: "5G", operators: ["Orange", "SFR", "Bouygues"] },
      { name: "Germany", code: "DE", flagUrl: "https://flagcdn.com/w40/de.png", region: "Europe", coverage: "Excellent", network: "5G", operators: ["Vodafone", "O2", "Telekom"] },
      { name: "Greece", code: "GR", flagUrl: "https://flagcdn.com/w40/gr.png", region: "Europe", coverage: "Good", network: "4G/5G", operators: ["Cosmote", "Vodafone", "Wind"] },
      { name: "Hong Kong", code: "HK", flagUrl: "https://flagcdn.com/w40/hk.png", region: "Asia", coverage: "Excellent", network: "5G", operators: ["3HK", "CSL", "SmarTone"] },
      { name: "Italy", code: "IT", flagUrl: "https://flagcdn.com/w40/it.png", region: "Europe", coverage: "Excellent", network: "5G", operators: ["TIM", "Vodafone", "WindTre"] },
      { name: "Japan", code: "JP", flagUrl: "https://flagcdn.com/w40/jp.png", region: "Asia", coverage: "Excellent", network: "5G", operators: ["NTT DoCoMo", "SoftBank", "KDDI"] },
      { name: "Malaysia", code: "MY", flagUrl: "https://flagcdn.com/w40/my.png", region: "Asia", coverage: "Good", network: "4G/5G", operators: ["Maxis", "Celcom", "Digi"] },
      { name: "Mexico", code: "MX", flagUrl: "https://flagcdn.com/w40/mx.png", region: "North America", coverage: "Good", network: "4G/5G", operators: ["Telcel", "AT&T", "Movistar"] },
      { name: "Singapore", code: "SG", flagUrl: "https://flagcdn.com/w40/sg.png", region: "Asia", coverage: "Excellent", network: "5G", operators: ["Singtel", "StarHub", "M1"] },
      { name: "South Korea", code: "KR", flagUrl: "https://flagcdn.com/w40/kr.png", region: "Asia", coverage: "Excellent", network: "5G", operators: ["SK Telecom", "KT", "LG U+"] },
      { name: "Spain", code: "ES", flagUrl: "https://flagcdn.com/w40/es.png", region: "Europe", coverage: "Excellent", network: "5G", operators: ["Movistar", "Orange", "Vodafone"] },
      { name: "Thailand", code: "TH", flagUrl: "https://flagcdn.com/w40/th.png", region: "Asia", coverage: "Good", network: "4G/5G", operators: ["AIS", "dtac", "True"] },
      { name: "Turkey", code: "TR", flagUrl: "https://flagcdn.com/w40/tr.png", region: "Europe", coverage: "Good", network: "4G/5G", operators: ["Türk Telekom", "Vodafone", "Turkcell"] },
      { name: "United Kingdom", code: "GB", flagUrl: "https://flagcdn.com/w40/gb.png", region: "Europe", coverage: "Excellent", network: "5G", operators: ["EE", "Vodafone", "O2"] },
      { name: "United States", code: "US", flagUrl: "https://flagcdn.com/w40/us.png", region: "North America", coverage: "Excellent", network: "5G", operators: ["T-Mobile", "Verizon", "AT&T"] }
    ];

    seedCountries.forEach((country, index) => {
      const id = this.currentCountryId++;
      this.countries.set(id, { ...country, id });
    });

    // Seed packages
    const seedPackages = [
      // US packages (countryId 73 - United States)
      { countryId: 73, name: "1GB / 7 Days", data: "1GB", validity: "7 Days", price: "4.50", originalPrice: "6.00", description: "Perfect for short trips", features: ["5G", "No expiry", "Instant"], isPopular: false, networkType: "5G" },
      { countryId: 73, name: "3GB / 15 Days", data: "3GB", validity: "15 Days", price: "12.90", originalPrice: null, description: "Most popular choice", features: ["5G", "No expiry", "Instant"], isPopular: true, networkType: "5G" },
      { countryId: 73, name: "10GB / 30 Days", data: "10GB", validity: "30 Days", price: "28.50", originalPrice: null, description: "Extended stay package", features: ["5G", "No expiry", "Instant"], isPopular: false, networkType: "5G" },
      { countryId: 73, name: "20GB / 60 Days", data: "20GB", validity: "60 Days", price: "45.90", originalPrice: "65.00", description: "Long term package", features: ["5G", "No expiry", "Instant"], isPopular: false, networkType: "5G" },
      
      // Germany packages (countryId 6 - Germany)
      { countryId: 6, name: "2GB / 10 Days", data: "2GB", validity: "10 Days", price: "€8.90", originalPrice: null, description: "Great for business trips", features: ["5G", "No expiry", "Instant"], isPopular: true, networkType: "5G" },
      { countryId: 6, name: "5GB / 20 Days", data: "5GB", validity: "20 Days", price: "€18.50", originalPrice: null, description: "Extended Europe stay", features: ["5G", "No expiry", "Instant"], isPopular: false, networkType: "5G" },
      { countryId: 6, name: "12GB / 45 Days", data: "12GB", validity: "45 Days", price: "€35.90", originalPrice: "€48.00", description: "Germany explorer package", features: ["5G", "No expiry", "Instant"], isPopular: false, networkType: "5G" },
      
      // Japan packages (countryId 8)
      { countryId: 8, name: "1GB / 5 Days", data: "1GB", validity: "5 Days", price: "6.90", originalPrice: null, description: "Short Tokyo visit", features: ["4G/5G", "No expiry", "Instant"], isPopular: false, networkType: "4G/5G" },
      { countryId: 8, name: "3GB / 14 Days", data: "3GB", validity: "14 Days", price: "16.50", originalPrice: null, description: "Explore Japan package", features: ["4G/5G", "No expiry", "Instant"], isPopular: true, networkType: "4G/5G" },
      
      // Turkey packages (countryId 48)
      { countryId: 48, name: "2GB / 7 Days", data: "2GB", validity: "7 Days", price: "5.90", originalPrice: null, description: "Istanbul visit", features: ["4G/5G", "No expiry", "Instant"], isPopular: true, networkType: "4G/5G" },
      { countryId: 48, name: "5GB / 15 Days", data: "5GB", validity: "15 Days", price: "12.50", originalPrice: null, description: "Turkey explorer", features: ["4G/5G", "No expiry", "Instant"], isPopular: false, networkType: "4G/5G" },
      
      // France packages (countryId 6)
      { countryId: 6, name: "3GB / 14 Days", data: "3GB", validity: "14 Days", price: "11.90", originalPrice: null, description: "Paris vacation", features: ["4G/5G", "No expiry", "Instant"], isPopular: true, networkType: "4G/5G" },
      { countryId: 6, name: "8GB / 30 Days", data: "8GB", validity: "30 Days", price: "24.90", originalPrice: null, description: "Extended France stay", features: ["4G/5G", "No expiry", "Instant"], isPopular: false, networkType: "4G/5G" }
    ];

    seedPackages.forEach((pkg, index) => {
      const id = this.currentPackageId++;
      this.packages.set(id, { ...pkg, id });
    });

    // Seed demo user
    const demoUser: User = {
      id: this.currentUserId++,
      name: "John Doe",
      email: "john.doe@email.com", 
      password: "password123",
      isPartner: true,
      referralCode: null,
      referredBy: null,
      availableCredit: "12.00",
      pendingCredit: "6.00", 
      usedCredit: "18.00",
      monthlyEarnedCredit: "12.00",
      lastCreditReset: new Date(),
      totalSpent: "120.75", // Explorer level (50-199.99)
      currentLevel: "explorer",
      createdAt: new Date()
    };
    this.users.set(demoUser.id, demoUser);

    // Seed multiple demo eSIMs - ordered by purchase date (oldest to newest)
    const demoEsims: Esim[] = [
      {
        id: this.currentEsimId++, // ID 1 - First purchase (oldest - expired)
        userId: 1,
        packageId: 15, // UK package
        qrCode: "QR_CODE_UK_EXPIRED",
        status: "Expired",
        dataUsed: "4800", // 96% of 5GB (5000MB) - almost fully used
        expiresAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 - 14 * 60 * 60 * 1000), // 30 days ago at 14:00
        activatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago - first purchase
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
      },
      {
        id: this.currentEsimId++, // ID 2 - Second purchase (expired)
        userId: 1,
        packageId: 14, // Germany package
        qrCode: "QR_CODE_GERMANY_EXPIRED",
        status: "Expired",
        dataUsed: "3000", // 100% of 3GB (3000MB) - fully used
        expiresAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000 - 9 * 60 * 60 * 1000), // 15 days ago at 09:30
        activatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago - second purchase
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
      },
      {
        id: this.currentEsimId++, // ID 3 - Third purchase (active)
        userId: 1,
        packageId: 10, // Turkey package
        qrCode: "QR_CODE_TURKEY_DATA",
        status: "Active",
        dataUsed: "2500", // 83% of 3GB (3000MB) - triggers warning
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000 + 45 * 60 * 1000), // 7 days from now at 16:45
        activatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago - third purchase
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: this.currentEsimId++, // ID 4 - Fourth purchase (active)
        userId: 1,
        packageId: 11, // Spain package
        qrCode: "QR_CODE_SPAIN_DATA",
        status: "Active",
        dataUsed: "4200", // 84% of 5GB (5000MB) - triggers warning
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 + 21 * 60 * 60 * 1000 + 20 * 60 * 1000), // 15 days from now at 21:20
        activatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago - fourth purchase
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      },
      {
        id: this.currentEsimId++, // ID 5 - Fifth purchase (active)
        userId: 1,
        packageId: 12, // France package
        qrCode: "QR_CODE_FRANCE_DATA",
        status: "Active",
        dataUsed: "1200", // 40% of 3GB (3000MB) - normal usage
        expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000 + 15 * 60 * 1000), // 10 days from now at 12:15
        activatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago - fifth purchase
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        id: this.currentEsimId++, // ID 6 - Sixth purchase (active - newest)
        userId: 1,
        packageId: 13, // Italy package
        qrCode: "QR_CODE_ITALY_DATA",
        status: "Active",
        dataUsed: "500", // 25% of 2GB (2000MB) - low usage
        expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000 + 30 * 60 * 1000), // 20 days from now at 08:30
        activatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago - newest purchase
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: this.currentEsimId++, // ID 7 - Ready to activate
        userId: 1,
        packageId: 1, // US package - 1GB / 7 Days
        qrCode: "QR_CODE_US_READY",
        status: "Ready",
        dataUsed: "0", // Not activated yet
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        activatedAt: null, // Not activated yet
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        id: this.currentEsimId++, // ID 8 - Ready to activate
        userId: 1,
        packageId: 9, // Japan package - 3GB / 14 Days
        qrCode: "QR_CODE_JAPAN_READY",
        status: "Ready",
        dataUsed: "0", // Not activated yet
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        activatedAt: null, // Not activated yet
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        id: this.currentEsimId++, // ID 9 - Full Plan US (Active with voice & SMS)
        userId: 1,
        packageId: 16, // US Full Plan package
        qrCode: "QR_CODE_US_FULL_PLAN",
        status: "Active",
        dataUsed: "1200", // 1.2GB used of 2GB
        smsUsed: 15, // 15 SMS used of 100 SMS
        voiceUsed: 45, // 45 minutes used of 100 minutes
        expiresAt: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 22 * 60 * 1000), // 18 days from now at 14:22
        activatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
      },
      {
        id: this.currentEsimId++, // ID 10 - Full Plan Europe (Active with voice & SMS)
        userId: 1,
        packageId: 17, // Europe Full Plan package
        qrCode: "QR_CODE_EUROPE_FULL_PLAN",
        status: "Active",
        dataUsed: "850", // 850MB used of 3GB
        smsUsed: 8, // 8 SMS used of 50 SMS
        voiceUsed: 28, // 28 minutes used of 60 minutes
        expiresAt: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000 + 45 * 60 * 1000), // 9 days from now at 10:45
        activatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      }
    ];
    
    demoEsims.forEach(esim => {
      this.esims.set(esim.id, esim);
    });

    // Seed partner stats
    const demoPartnerStats: PartnerStats = {
      id: this.currentPartnerStatsId++,
      userId: 1,
      monthlyRevenue: "2468.00",
      esimsSOld: 247,
      subDealers: 18,
      commissionRate: "20.00",
      totalEarnings: "15620.00"
    };
    this.partnerStats.set(demoPartnerStats.id, demoPartnerStats);

    // Seed some sales
    const demoSales = [
      { partnerId: 1, packageId: 1, amount: "4.50", commission: "0.90" },
      { partnerId: 1, packageId: 4, amount: "8.90", commission: "1.78" }
    ];

    demoSales.forEach(sale => {
      const id = this.currentSaleId++;
      this.sales.set(id, { ...sale, id, createdAt: new Date() });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      isPartner: insertUser.isPartner ?? false,
      totalSpent: insertUser.totalSpent ?? "0",
      currentLevel: insertUser.currentLevel ?? "traveler"
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Country methods
  async getAllCountries(): Promise<Country[]> {
    return Array.from(this.countries.values());
  }

  async getCountry(id: number): Promise<Country | undefined> {
    return this.countries.get(id);
  }

  async getCountryByCode(code: string): Promise<Country | undefined> {
    return Array.from(this.countries.values()).find(country => country.code === code);
  }

  async searchCountries(query: string): Promise<Country[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.countries.values()).filter(country =>
      country.name.toLowerCase().includes(lowerQuery) ||
      country.region.toLowerCase().includes(lowerQuery)
    );
  }

  async createCountry(insertCountry: InsertCountry): Promise<Country> {
    const id = this.currentCountryId++;
    const country: Country = { 
      ...insertCountry, 
      id,
      operators: insertCountry.operators ?? []
    };
    this.countries.set(id, country);
    return country;
  }

  // Package methods
  async getPackagesByCountry(countryId: number): Promise<Package[]> {
    return Array.from(this.packages.values()).filter(pkg => pkg.countryId === countryId);
  }

  async getPackage(id: number): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async getPopularPackages(): Promise<Package[]> {
    return Array.from(this.packages.values()).filter(pkg => pkg.isPopular);
  }

  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    const id = this.currentPackageId++;
    const pkg: Package = { 
      ...insertPackage, 
      id,
      originalPrice: insertPackage.originalPrice ?? null,
      features: insertPackage.features ?? [],
      isPopular: insertPackage.isPopular ?? false
    };
    this.packages.set(id, pkg);
    return pkg;
  }

  // eSIM methods
  async getEsimsByUser(userId: number): Promise<Esim[]> {
    return Array.from(this.esims.values()).filter(esim => esim.userId === userId);
  }

  async getEsim(id: number): Promise<Esim | undefined> {
    return this.esims.get(id);
  }

  async createEsim(insertEsim: InsertEsim): Promise<Esim> {
    const id = this.currentEsimId++;
    const esim: Esim = { 
      ...insertEsim, 
      id, 
      createdAt: new Date(),
      dataUsed: insertEsim.dataUsed ?? "0",
      activatedAt: insertEsim.activatedAt ?? null
    };
    this.esims.set(id, esim);
    return esim;
  }

  async updateEsimStatus(id: number, status: string): Promise<Esim | undefined> {
    const esim = this.esims.get(id);
    if (esim) {
      esim.status = status;
      this.esims.set(id, esim);
      return esim;
    }
    return undefined;
  }

  async updateEsimDataUsage(id: number, dataUsed: string): Promise<Esim | undefined> {
    const esim = this.esims.get(id);
    if (esim) {
      esim.dataUsed = dataUsed;
      this.esims.set(id, esim);
      return esim;
    }
    return undefined;
  }

  // Partner stats methods
  async getPartnerStats(userId: number): Promise<PartnerStats | undefined> {
    return Array.from(this.partnerStats.values()).find(stats => stats.userId === userId);
  }

  async createPartnerStats(insertPartnerStats: InsertPartnerStats): Promise<PartnerStats> {
    const id = this.currentPartnerStatsId++;
    const stats: PartnerStats = { 
      ...insertPartnerStats, 
      id,
      monthlyRevenue: insertPartnerStats.monthlyRevenue ?? "0",
      esimsSOld: insertPartnerStats.esimsSOld ?? 0,
      subDealers: insertPartnerStats.subDealers ?? 0,
      commissionRate: insertPartnerStats.commissionRate ?? "20",
      totalEarnings: insertPartnerStats.totalEarnings ?? "0"
    };
    this.partnerStats.set(id, stats);
    return stats;
  }

  async updatePartnerStats(userId: number, updates: Partial<PartnerStats>): Promise<PartnerStats | undefined> {
    const stats = Array.from(this.partnerStats.values()).find(s => s.userId === userId);
    if (stats) {
      Object.assign(stats, updates);
      this.partnerStats.set(stats.id, stats);
      return stats;
    }
    return undefined;
  }

  // Sales methods
  async getSalesByPartner(partnerId: number): Promise<Sale[]> {
    return Array.from(this.sales.values()).filter(sale => sale.partnerId === partnerId);
  }

  async getRecentSales(partnerId: number, limit: number): Promise<Sale[]> {
    return Array.from(this.sales.values())
      .filter(sale => sale.partnerId === partnerId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, limit);
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    const id = this.currentSaleId++;
    const sale: Sale = { ...insertSale, id, createdAt: new Date() };
    this.sales.set(id, sale);
    return sale;
  }

  // Referral methods
  async getUserByReferralCode(code: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.referralCode === code);
  }

  async getReferralHistory(userId: number): Promise<any[]> {
    // Mock referral history data
    return [
      {
        id: 1,
        email: 'j***@gmail.com',
        amount: 3.00,
        status: 'available',
        date: '2025-08-28'
      },
      {
        id: 2,
        email: 'm***@outlook.com',
        amount: 3.00,
        status: 'pending',
        date: '2025-08-25'
      },
      {
        id: 3,
        email: 's***@yahoo.com',
        amount: 3.00,
        status: 'used',
        date: '2025-08-20'
      }
    ];
  }

  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const id = this.currentReferralId++;
    const referral: Referral = { 
      ...insertReferral, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.referrals.set(id, referral);
    return referral;
  }

  async createCreditTransaction(insertTransaction: InsertCreditTransaction): Promise<CreditTransaction> {
    const id = this.currentCreditTransactionId++;
    const transaction: CreditTransaction = {
      ...insertTransaction,
      id,
      createdAt: new Date(),
      orderId: insertTransaction.orderId ?? null,
      referralId: insertTransaction.referralId ?? null
    };
    this.creditTransactions.set(id, transaction);
    return transaction;
  }
}

export const storage = new MemStorage();
