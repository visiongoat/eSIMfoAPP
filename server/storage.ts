import { 
  users, countries, packages, esims, partnerStats, sales,
  type User, type InsertUser, type Country, type InsertCountry,
  type Package, type InsertPackage, type Esim, type InsertEsim,
  type PartnerStats, type InsertPartnerStats, type Sale, type InsertSale
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
  private currentUserId: number;
  private currentCountryId: number;
  private currentPackageId: number;
  private currentEsimId: number;
  private currentPartnerStatsId: number;
  private currentSaleId: number;

  constructor() {
    this.users = new Map();
    this.countries = new Map();
    this.packages = new Map();
    this.esims = new Map();
    this.partnerStats = new Map();
    this.sales = new Map();
    this.currentUserId = 1;
    this.currentCountryId = 1;
    this.currentPackageId = 1;
    this.currentEsimId = 1;
    this.currentPartnerStatsId = 1;
    this.currentSaleId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed countries
    const seedCountries = [
      {
        name: "United States",
        code: "US",
        flagUrl: "https://flagcdn.com/w40/us.png",
        region: "North America",
        coverage: "Excellent",
        network: "5G",
        operators: ["T-Mobile", "Verizon", "AT&T"]
      },
      {
        name: "Germany",
        code: "DE", 
        flagUrl: "https://flagcdn.com/w40/de.png",
        region: "Europe",
        coverage: "Excellent",
        network: "5G",
        operators: ["Vodafone", "O2", "Telekom"]
      },
      {
        name: "Japan",
        code: "JP",
        flagUrl: "https://flagcdn.com/w40/jp.png", 
        region: "Asia",
        coverage: "Excellent",
        network: "5G",
        operators: ["NTT DoCoMo", "SoftBank", "KDDI"]
      },
      {
        name: "France",
        code: "FR",
        flagUrl: "https://flagcdn.com/w40/fr.png",
        region: "Europe", 
        coverage: "Excellent",
        network: "5G",
        operators: ["Orange", "SFR", "Bouygues"]
      },
      {
        name: "Turkey",
        code: "TR",
        flagUrl: "https://flagcdn.com/w40/tr.png",
        region: "Europe",
        coverage: "Good", 
        network: "4G/5G",
        operators: ["Türk Telekom", "Vodafone", "Turkcell"]
      }
    ];

    seedCountries.forEach((country, index) => {
      const id = this.currentCountryId++;
      this.countries.set(id, { ...country, id });
    });

    // Seed packages
    const seedPackages = [
      // US packages
      { countryId: 1, name: "1GB / 7 Days", data: "1GB", validity: "7 Days", price: "4.50", originalPrice: "6.00", description: "Perfect for short trips", features: ["4G/5G", "No expiry", "Instant"], isPopular: false, networkType: "4G/5G" },
      { countryId: 1, name: "3GB / 15 Days", data: "3GB", validity: "15 Days", price: "12.90", originalPrice: null, description: "Most popular choice", features: ["4G/5G", "No expiry", "Instant"], isPopular: true, networkType: "4G/5G" },
      { countryId: 1, name: "10GB / 30 Days", data: "10GB", validity: "30 Days", price: "28.50", originalPrice: null, description: "Extended stay package", features: ["4G/5G", "No expiry", "Instant"], isPopular: false, networkType: "4G/5G" },
      
      // Germany packages  
      { countryId: 2, name: "2GB / 10 Days", data: "2GB", validity: "10 Days", price: "8.90", originalPrice: null, description: "Great for business trips", features: ["4G/5G", "No expiry", "Instant"], isPopular: true, networkType: "4G/5G" },
      { countryId: 2, name: "5GB / 20 Days", data: "5GB", validity: "20 Days", price: "18.50", originalPrice: null, description: "Extended Europe stay", features: ["4G/5G", "No expiry", "Instant"], isPopular: false, networkType: "4G/5G" },
      
      // Japan packages
      { countryId: 3, name: "1GB / 5 Days", data: "1GB", validity: "5 Days", price: "6.90", originalPrice: null, description: "Short Tokyo visit", features: ["4G/5G", "No expiry", "Instant"], isPopular: false, networkType: "4G/5G" },
      { countryId: 3, name: "3GB / 14 Days", data: "3GB", validity: "14 Days", price: "16.50", originalPrice: null, description: "Explore Japan package", features: ["4G/5G", "No expiry", "Instant"], isPopular: true, networkType: "4G/5G" }
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
      createdAt: new Date()
    };
    this.users.set(demoUser.id, demoUser);

    // Seed demo eSIM
    const demoEsim: Esim = {
      id: this.currentEsimId++,
      userId: 1,
      packageId: 1,
      qrCode: "QR_CODE_DATA_HERE",
      status: "Active",
      dataUsed: "450",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      activatedAt: new Date(),
      createdAt: new Date()
    };
    this.esims.set(demoEsim.id, demoEsim);

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
      isPartner: insertUser.isPartner ?? false 
    };
    this.users.set(id, user);
    return user;
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
}

export const storage = new MemStorage();
