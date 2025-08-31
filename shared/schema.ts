import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isPartner: boolean("is_partner").default(false),
  referralCode: text("referral_code").unique(),
  referredBy: integer("referred_by"),
  availableCredit: decimal("available_credit", { precision: 10, scale: 2 }).default("0"),
  pendingCredit: decimal("pending_credit", { precision: 10, scale: 2 }).default("0"),
  usedCredit: decimal("used_credit", { precision: 10, scale: 2 }).default("0"),
  monthlyEarnedCredit: decimal("monthly_earned_credit", { precision: 10, scale: 2 }).default("0"),
  lastCreditReset: timestamp("last_credit_reset").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(), // ISO country code
  flagUrl: text("flag_url").notNull(),
  region: text("region").notNull(), // Europe, Asia, etc.
  coverage: text("coverage").notNull(), // Excellent, Good, Fair
  network: text("network").notNull(), // 4G, 5G, etc.
  operators: text("operators").array(), // Array of operator names
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  countryId: integer("country_id").notNull(),
  name: text("name").notNull(), // e.g., "1GB / 7 Days"
  data: text("data").notNull(), // e.g., "1GB"
  validity: text("validity").notNull(), // e.g., "7 Days"
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  description: text("description").notNull(),
  features: text("features").array(), // Array of feature strings
  isPopular: boolean("is_popular").default(false),
  networkType: text("network_type").notNull(), // 4G/5G
});

export const esims = pgTable("esims", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  packageId: integer("package_id").notNull(),
  qrCode: text("qr_code").notNull(),
  status: text("status").notNull(), // Active, Expired, Ready
  dataUsed: decimal("data_used", { precision: 10, scale: 2 }).default("0"),
  expiresAt: timestamp("expires_at").notNull(),
  activatedAt: timestamp("activated_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const partnerStats = pgTable("partner_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  monthlyRevenue: decimal("monthly_revenue", { precision: 10, scale: 2 }).default("0"),
  esimsSOld: integer("esims_sold").default(0),
  subDealers: integer("sub_dealers").default(0),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default("20"),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0"),
});

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id").notNull(),
  packageId: integer("package_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  commission: decimal("commission", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").notNull(),
  refereeId: integer("referee_id").notNull(),
  referralCode: text("referral_code").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
  creditAmount: decimal("credit_amount", { precision: 10, scale: 2 }).notNull().default("3.00"),
  orderId: integer("order_id"), // First order that triggered the reward
  creditAvailableAt: timestamp("credit_available_at"), // When credit becomes available (after 7 days)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // earned, used, expired
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  referralId: integer("referral_id"), // If earned from referral
  orderId: integer("order_id"), // If used in an order
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCountrySchema = createInsertSchema(countries).omit({
  id: true,
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
});

export const insertEsimSchema = createInsertSchema(esims).omit({
  id: true,
  createdAt: true,
});

export const insertPartnerStatsSchema = createInsertSchema(partnerStats).omit({
  id: true,
});

export const insertSaleSchema = createInsertSchema(sales).omit({
  id: true,
  createdAt: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Country = typeof countries.$inferSelect;
export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type Package = typeof packages.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Esim = typeof esims.$inferSelect;
export type InsertEsim = z.infer<typeof insertEsimSchema>;
export type PartnerStats = typeof partnerStats.$inferSelect;
export type InsertPartnerStats = z.infer<typeof insertPartnerStatsSchema>;
export type Sale = typeof sales.$inferSelect;
export type InsertSale = z.infer<typeof insertSaleSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;
