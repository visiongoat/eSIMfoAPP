import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCountrySchema, insertPackageSchema, insertEsimSchema, insertSaleSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Countries routes
  app.get("/api/countries", async (req, res) => {
    try {
      const countries = await storage.getAllCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch countries" });
    }
  });

  app.get("/api/countries/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      const countries = await storage.searchCountries(query);
      res.json(countries);
    } catch (error) {
      res.status(500).json({ message: "Failed to search countries" });
    }
  });

  app.get("/api/countries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const country = await storage.getCountry(id);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      res.json(country);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch country" });
    }
  });

  // Packages routes
  app.get("/api/countries/:countryId/packages", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const packages = await storage.getPackagesByCountry(countryId);
      res.json(packages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });

  app.get("/api/packages/popular", async (req, res) => {
    try {
      const packages = await storage.getPopularPackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular packages" });
    }
  });

  app.get("/api/packages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pkg = await storage.getPackage(id);
      if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
      }
      res.json(pkg);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch package" });
    }
  });

  // eSIMs routes
  app.get("/api/esims", async (req, res) => {
    try {
      // For demo purposes, use user ID 1
      const userId = 1;
      const esims = await storage.getEsimsByUser(userId);
      
      // Enrich with package and country data
      const enrichedEsims = esims.map((esim) => {
        // Create package details based on esim data
        const packageDetails = (() => {
          switch (esim.id) {
            case 1: return { name: "5GB / 30 Days", data: "5GB", duration: "30 days", price: "€29.99", discount: "-50%" }; // UK - first purchase
            case 2: return { name: "3GB / 30 Days", data: "3GB", duration: "30 days", price: "€22.99", discount: "-49%" }; // Germany - second purchase
            case 3: return { name: "3GB / 30 Days", data: "3GB", duration: "30 days", price: "€19.99", discount: "-50%" }; // Turkey - third purchase
            case 4: return { name: "5GB / 30 Days", data: "5GB", duration: "30 days", price: "€24.99", discount: "-50%" }; // Spain - fourth purchase
            case 5: return { name: "3GB / 15 Days", data: "3GB", duration: "15 days", price: "€16.99", discount: "-43%" }; // France - fifth purchase
            case 6: return { name: "2GB / 20 Days", data: "2GB", duration: "20 days", price: "€14.99", discount: "-40%" }; // Italy - sixth purchase (newest)
            default: return null;
          }
        })();

        const countryDetails = (() => {
          switch (esim.id) {
            case 1: return { name: "United Kingdom", code: "GB", flagUrl: "https://flagcdn.com/w40/gb.png" }; // First purchase
            case 2: return { name: "Germany", code: "DE", flagUrl: "https://flagcdn.com/w40/de.png" }; // Second purchase
            case 3: return { name: "Turkey", code: "TR", flagUrl: "https://flagcdn.com/w40/tr.png" }; // Third purchase
            case 4: return { name: "Spain", code: "ES", flagUrl: "https://flagcdn.com/w40/es.png" }; // Fourth purchase
            case 5: return { name: "France", code: "FR", flagUrl: "https://flagcdn.com/w40/fr.png" }; // Fifth purchase
            case 6: return { name: "Italy", code: "IT", flagUrl: "https://flagcdn.com/w40/it.png" }; // Sixth purchase (newest)
            default: return null;
          }
        })();
        
        return {
          ...esim,
          package: packageDetails,
          country: countryDetails
        };
      });
      
      res.json(enrichedEsims);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch eSIMs" });
    }
  });

  app.get("/api/esims/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const esim = await storage.getEsim(id);
      if (!esim) {
        return res.status(404).json({ message: "eSIM not found" });
      }
      
      // Enrich with package and country data
      const pkg = await storage.getPackage(esim.packageId);
      const country = pkg ? await storage.getCountry(pkg.countryId) : null;
      
      res.json({
        ...esim,
        package: pkg,
        country: country
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch eSIM" });
    }
  });

  app.post("/api/esims", async (req, res) => {
    try {
      const validatedData = insertEsimSchema.parse(req.body);
      
      // Generate a mock QR code
      validatedData.qrCode = `QR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const esim = await storage.createEsim(validatedData);
      res.status(201).json(esim);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create eSIM" });
    }
  });

  app.patch("/api/esims/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const esim = await storage.updateEsimStatus(id, status);
      if (!esim) {
        return res.status(404).json({ message: "eSIM not found" });
      }
      
      res.json(esim);
    } catch (error) {
      res.status(500).json({ message: "Failed to update eSIM status" });
    }
  });

  // Partner routes
  app.get("/api/partner/stats", async (req, res) => {
    try {
      // For demo purposes, use user ID 1
      const userId = 1;
      const stats = await storage.getPartnerStats(userId);
      if (!stats) {
        return res.status(404).json({ message: "Partner stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch partner stats" });
    }
  });

  app.get("/api/partner/sales", async (req, res) => {
    try {
      // For demo purposes, use user ID 1
      const partnerId = 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sales = await storage.getRecentSales(partnerId, limit);
      
      // Enrich with package and country data
      const enrichedSales = await Promise.all(
        sales.map(async (sale) => {
          const pkg = await storage.getPackage(sale.packageId);
          const country = pkg ? await storage.getCountry(pkg.countryId) : null;
          return {
            ...sale,
            package: pkg,
            country: country
          };
        })
      );
      
      res.json(enrichedSales);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sales" });
    }
  });

  // Purchase simulation route - always succeeds for design/demo purposes
  app.post("/api/purchase", async (req, res) => {
    try {
      const { packageId, paymentMethod } = req.body;
      
      if (!packageId || !paymentMethod) {
        return res.status(400).json({ message: "Package ID and payment method are required" });
      }
      
      // Always create eSIM successfully (design mode)
      const esim = await storage.createEsim({
        userId: 1,
        packageId: packageId,
        qrCode: `QR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: "Ready",
        dataUsed: "0",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        activatedAt: null
      });
      
      res.status(201).json({ 
        success: true, 
        esim: esim,
        message: "Purchase completed successfully" 
      });
    } catch (error) {
      console.error("Purchase error:", error);
      res.status(500).json({ message: "Failed to process purchase" });
    }
  });

  // User profile routes (demo)
  app.get("/api/profile", async (req, res) => {
    try {
      const user = await storage.getUser(1); // Demo user
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.patch("/api/profile", async (req, res) => {
    try {
      const updateData = req.body;
      
      // Basic validation - ensure we don't update password or id
      const { password, id, ...allowedUpdates } = updateData;
      
      // Update user profile
      const updatedUser = await storage.updateUser(1, allowedUpdates); // Demo user ID 1
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password: pwd, ...userProfile } = updatedUser;
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Debug endpoint for preview issues
  app.get("/preview-test", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Preview Test - eSIM App</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: Arial, sans-serif; margin: 20px;">
          <h1>✅ Preview Çalışıyor!</h1>
          <p><strong>Zaman:</strong> ${new Date().toLocaleString('tr-TR')}</p>
          <p><strong>Port:</strong> ${process.env.PORT || 5000}</p>
          <p><strong>Host:</strong> 0.0.0.0</p>
          <p><strong>URL:</strong> ${req.get('host')}</p>
          <hr>
          <h2>Test Linkler:</h2>
          <ul>
            <li><a href="/">Ana Uygulama</a></li>
            <li><a href="/api/countries">Ülkeler API</a></li>
            <li><a href="/api/packages/popular">Popüler Paketler</a></li>
          </ul>
          <script>
            console.log('Preview test page loaded successfully');
            setTimeout(() => window.location.href = '/', 5000);
          </script>
        </body>
      </html>
    `);
  });

  const httpServer = createServer(app);
  return httpServer;
}
