-- Quan Ly Tai San - Initial Database Schema
-- This SQL file creates all tables for the Personal Finance Management App
-- Compatible with Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- INVESTMENT PORTFOLIO TABLES
-- ============================================

-- Crypto Assets Table
CREATE TABLE "CryptoAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "apiKeyId" TEXT,
    "balance" DOUBLE PRECISION NOT NULL,
    "averagePrice" DOUBLE PRECISION NOT NULL,
    "currentPrice" DOUBLE PRECISION,
    "usdtVndRate" DOUBLE PRECISION NOT NULL,
    "alertThreshold" DOUBLE PRECISION,
    "stopLoss" DOUBLE PRECISION,
    "takeProfit" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Crypto Transactions Table
CREATE TABLE "CryptoTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "usdtVndRate" DOUBLE PRECISION NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CryptoTransaction_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "CryptoAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Gold and Silver Assets Table
CREATE TABLE "GoldSilverAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "purchasePrice" DOUBLE PRECISION NOT NULL,
    "currentPrice" DOUBLE PRECISION,
    "vendor" TEXT,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Fund Assets Table
CREATE TABLE "FundAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "fundCode" TEXT NOT NULL,
    "fundCompany" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "units" DOUBLE PRECISION NOT NULL,
    "avgNavPrice" DOUBLE PRECISION NOT NULL,
    "currentNav" DOUBLE PRECISION,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Fund Transactions Table
CREATE TABLE "FundTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "units" DOUBLE PRECISION NOT NULL,
    "navPrice" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FundTransaction_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "FundAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- CREDIT CARD ARBITRAGE TABLES
-- ============================================

-- Credit Cards Table
CREATE TABLE "CreditCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bankName" TEXT NOT NULL,
    "cardName" TEXT NOT NULL,
    "lastFourDigits" TEXT NOT NULL,
    "statementDay" INTEGER NOT NULL,
    "interestFreeDays" INTEGER NOT NULL,
    "paymentDueDays" INTEGER NOT NULL,
    "creditLimit" DOUBLE PRECISION,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Card Transactions Table
CREATE TABLE "CardTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "statementDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "savingsRecommended" BOOLEAN NOT NULL DEFAULT false,
    "savingsAmount" DOUBLE PRECISION,
    "savingsInterest" DOUBLE PRECISION,
    "actualInterest" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CardTransaction_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Payment Reminders Table
CREATE TABLE "PaymentReminder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardId" TEXT NOT NULL,
    "transactionId" TEXT,
    "reminderDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "message" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PaymentReminder_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Savings Recommendations Table
CREATE TABLE "SavingsRecommendation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardTransactionId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "recommendationType" TEXT NOT NULL,
    "estimatedInterest" DOUBLE PRECISION NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "bankName" TEXT,
    "productName" TEXT,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- ============================================
-- EXCHANGE INTEGRATION & TRACKING TABLES
-- ============================================

-- Exchange API Keys Table (for encrypted storage)
CREATE TABLE "ExchangeApiKey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exchange" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "isReadOnly" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Price History Table
CREATE TABLE "PriceHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetType" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SETTINGS TABLE
-- ============================================

-- Application Settings Table
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "defaultUsdtVndRate" DOUBLE PRECISION NOT NULL DEFAULT 24000,
    "enablePriceAlerts" BOOLEAN NOT NULL DEFAULT true,
    "enablePaymentReminders" BOOLEAN NOT NULL DEFAULT true,
    "reminderDaysBefore" INTEGER NOT NULL DEFAULT 2,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Crypto Assets Indexes
CREATE INDEX "CryptoAsset_exchange_idx" ON "CryptoAsset"("exchange");
CREATE INDEX "CryptoAsset_symbol_idx" ON "CryptoAsset"("symbol");

-- Crypto Transactions Indexes
CREATE INDEX "CryptoTransaction_assetId_idx" ON "CryptoTransaction"("assetId");
CREATE INDEX "CryptoTransaction_date_idx" ON "CryptoTransaction"("date");
CREATE INDEX "CryptoTransaction_type_idx" ON "CryptoTransaction"("type");

-- Gold/Silver Assets Indexes
CREATE INDEX "GoldSilverAsset_type_idx" ON "GoldSilverAsset"("type");
CREATE INDEX "GoldSilverAsset_purchaseDate_idx" ON "GoldSilverAsset"("purchaseDate");

-- Fund Assets Indexes
CREATE INDEX "FundAsset_fundCode_idx" ON "FundAsset"("fundCode");
CREATE INDEX "FundAsset_fundCompany_idx" ON "FundAsset"("fundCompany");

-- Fund Transactions Indexes
CREATE INDEX "FundTransaction_assetId_idx" ON "FundTransaction"("assetId");
CREATE INDEX "FundTransaction_date_idx" ON "FundTransaction"("date");

-- Credit Cards Indexes
CREATE INDEX "CreditCard_bankName_idx" ON "CreditCard"("bankName");
CREATE INDEX "CreditCard_isActive_idx" ON "CreditCard"("isActive");

-- Card Transactions Indexes
CREATE INDEX "CardTransaction_cardId_idx" ON "CardTransaction"("cardId");
CREATE INDEX "CardTransaction_transactionDate_idx" ON "CardTransaction"("transactionDate");
CREATE INDEX "CardTransaction_dueDate_idx" ON "CardTransaction"("dueDate");
CREATE INDEX "CardTransaction_isPaid_idx" ON "CardTransaction"("isPaid");

-- Payment Reminders Indexes
CREATE INDEX "PaymentReminder_cardId_idx" ON "PaymentReminder"("cardId");
CREATE INDEX "PaymentReminder_reminderDate_idx" ON "PaymentReminder"("reminderDate");
CREATE INDEX "PaymentReminder_isCompleted_idx" ON "PaymentReminder"("isCompleted");

-- Price History Indexes
CREATE INDEX "PriceHistory_assetType_idx" ON "PriceHistory"("assetType");
CREATE INDEX "PriceHistory_assetId_idx" ON "PriceHistory"("assetId");
CREATE INDEX "PriceHistory_symbol_idx" ON "PriceHistory"("symbol");
CREATE INDEX "PriceHistory_timestamp_idx" ON "PriceHistory"("timestamp");

-- Exchange API Keys Indexes
CREATE INDEX "ExchangeApiKey_exchange_idx" ON "ExchangeApiKey"("exchange");
CREATE INDEX "ExchangeApiKey_isActive_idx" ON "ExchangeApiKey"("isActive");

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE "CryptoAsset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CryptoTransaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GoldSilverAsset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FundAsset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FundTransaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CreditCard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CardTransaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PaymentReminder" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SavingsRecommendation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ExchangeApiKey" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PriceHistory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Settings" ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for authenticated users
-- Note: Adjust these policies based on your specific security requirements

-- CryptoAsset policies
CREATE POLICY "Enable all access for authenticated users" ON "CryptoAsset"
    FOR ALL USING (auth.role() = 'authenticated');

-- CryptoTransaction policies
CREATE POLICY "Enable all access for authenticated users" ON "CryptoTransaction"
    FOR ALL USING (auth.role() = 'authenticated');

-- GoldSilverAsset policies
CREATE POLICY "Enable all access for authenticated users" ON "GoldSilverAsset"
    FOR ALL USING (auth.role() = 'authenticated');

-- FundAsset policies
CREATE POLICY "Enable all access for authenticated users" ON "FundAsset"
    FOR ALL USING (auth.role() = 'authenticated');

-- FundTransaction policies
CREATE POLICY "Enable all access for authenticated users" ON "FundTransaction"
    FOR ALL USING (auth.role() = 'authenticated');

-- CreditCard policies
CREATE POLICY "Enable all access for authenticated users" ON "CreditCard"
    FOR ALL USING (auth.role() = 'authenticated');

-- CardTransaction policies
CREATE POLICY "Enable all access for authenticated users" ON "CardTransaction"
    FOR ALL USING (auth.role() = 'authenticated');

-- PaymentReminder policies
CREATE POLICY "Enable all access for authenticated users" ON "PaymentReminder"
    FOR ALL USING (auth.role() = 'authenticated');

-- SavingsRecommendation policies
CREATE POLICY "Enable all access for authenticated users" ON "SavingsRecommendation"
    FOR ALL USING (auth.role() = 'authenticated');

-- ExchangeApiKey policies (extra security)
CREATE POLICY "Enable all access for authenticated users" ON "ExchangeApiKey"
    FOR ALL USING (auth.role() = 'authenticated');

-- PriceHistory policies
CREATE POLICY "Enable all access for authenticated users" ON "PriceHistory"
    FOR ALL USING (auth.role() = 'authenticated');

-- Settings policies
CREATE POLICY "Enable all access for authenticated users" ON "Settings"
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updatedAt column
CREATE TRIGGER update_crypto_asset_updated_at BEFORE UPDATE ON "CryptoAsset"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gold_silver_asset_updated_at BEFORE UPDATE ON "GoldSilverAsset"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fund_asset_updated_at BEFORE UPDATE ON "FundAsset"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_card_updated_at BEFORE UPDATE ON "CreditCard"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_card_transaction_updated_at BEFORE UPDATE ON "CardTransaction"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_reminder_updated_at BEFORE UPDATE ON "PaymentReminder"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_savings_recommendation_updated_at BEFORE UPDATE ON "SavingsRecommendation"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exchange_api_key_updated_at BEFORE UPDATE ON "ExchangeApiKey"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON "Settings"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default settings
INSERT INTO "Settings" ("id", "defaultUsdtVndRate", "enablePriceAlerts", "enablePaymentReminders", "reminderDaysBefore", "createdAt", "updatedAt")
VALUES ('default', 24000, true, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE "CryptoAsset" IS 'Cryptocurrency assets with exchange information and price alerts';
COMMENT ON TABLE "CryptoTransaction" IS 'Transaction history for cryptocurrency assets';
COMMENT ON TABLE "GoldSilverAsset" IS 'Gold and silver physical assets';
COMMENT ON TABLE "FundAsset" IS 'Investment fund assets (Open-ended funds and ETFs)';
COMMENT ON TABLE "FundTransaction" IS 'Transaction history for fund assets';
COMMENT ON TABLE "CreditCard" IS 'Credit card information with interest-free period details';
COMMENT ON TABLE "CardTransaction" IS 'Credit card transactions with savings recommendations';
COMMENT ON TABLE "PaymentReminder" IS 'Automated payment reminders for credit cards';
COMMENT ON TABLE "SavingsRecommendation" IS 'Savings recommendations based on payment schedules';
COMMENT ON TABLE "ExchangeApiKey" IS 'Encrypted API keys for exchange integrations';
COMMENT ON TABLE "PriceHistory" IS 'Historical price data for all asset types';
COMMENT ON TABLE "Settings" IS 'Application-wide settings and preferences';
