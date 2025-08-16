import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import cors from "cors";

const app = express();

// Force explicit binding and routing
app.set('trust proxy', true);
app.set('x-powered-by', false);

// CORS ve security headers - preview fix için
app.use(cors({
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use((req, res, next) => {
  // Allow Replit workspace iframe
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CSP completely permissive for workspace iframe
  res.setHeader('Content-Security-Policy', 
    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
    "frame-ancestors *; " +
    "img-src * data: blob:; " +
    "connect-src * wss: ws:; " +
    "script-src * 'unsafe-inline' 'unsafe-eval';"
  );
  
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // CORS for mobile access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, User-Agent');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  
  // Network routing headers for mobile connectivity
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=5, max=1000');
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve attached assets statically
app.use('/attached_assets', express.static(path.join(process.cwd(), 'attached_assets')));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error('Server error:', err);
    res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
    log(`External URL: https://${process.env.REPLIT_DOMAINS || 'localhost:' + port}`);
    log(`Local access: http://localhost:${port}`);
  });
})();
