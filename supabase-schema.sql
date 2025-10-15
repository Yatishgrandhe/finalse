-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    auth_id TEXT NOT NULL UNIQUE,
    auth_provider TEXT NOT NULL DEFAULT 'email',
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT,
    profile_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferences JSONB DEFAULT '{"currency": "USD", "theme": "dark", "notifications": true}'::jsonb,
    robinhood_connected BOOLEAN DEFAULT FALSE,
    robinhood_access_token TEXT,
    robinhood_refresh_token TEXT,
    robinhood_token_expires_at BIGINT,
    robinhood_account_id TEXT,
    robinhood_profile JSONB,
    robinhood_connected_at BIGINT,
    robinhood_last_sync_at BIGINT
);

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    total_value DECIMAL(15,2) DEFAULT 0,
    total_cost DECIMAL(15,2) DEFAULT 0,
    total_gain_loss DECIMAL(15,2) DEFAULT 0,
    total_gain_loss_percent DECIMAL(10,4) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create holdings table
CREATE TABLE IF NOT EXISTS holdings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    stock_symbol TEXT NOT NULL,
    shares DECIMAL(15,6) NOT NULL,
    average_cost DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(15,2) NOT NULL,
    total_cost DECIMAL(15,2),
    gain_loss DECIMAL(15,2) NOT NULL,
    gain_loss_percent DECIMAL(10,4) NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stocks table
CREATE TABLE IF NOT EXISTS stocks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    symbol TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    current_price DECIMAL(10,2) NOT NULL,
    previous_close DECIMAL(10,2) NOT NULL,
    change DECIMAL(10,2) NOT NULL,
    change_percent DECIMAL(10,4) NOT NULL,
    volume BIGINT NOT NULL,
    market_cap BIGINT,
    sector TEXT,
    industry TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    stock_symbol TEXT NOT NULL,
    prediction_type TEXT NOT NULL,
    confidence DECIMAL(5,2) NOT NULL,
    prediction TEXT NOT NULL,
    target_price DECIMAL(10,2),
    timeframe TEXT NOT NULL,
    reasoning TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT NOT NULL,
    url TEXT NOT NULL,
    source TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    stock_symbols TEXT[] NOT NULL,
    sentiment TEXT NOT NULL,
    relevance_score DECIMAL(5,2) NOT NULL,
    tags TEXT[] NOT NULL
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    stock_symbol TEXT NOT NULL,
    type TEXT NOT NULL,
    shares DECIMAL(15,6) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    fees DECIMAL(10,2) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- Create watchlists table
CREATE TABLE IF NOT EXISTS watchlists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    stock_symbols TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookmarked_stocks table
CREATE TABLE IF NOT EXISTS bookmarked_stocks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stock_symbol TEXT NOT NULL,
    stock_name TEXT NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    target_price DECIMAL(10,2),
    alert_price DECIMAL(10,2),
    is_alert_active BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_holdings_portfolio_id ON holdings(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_holdings_stock_symbol ON holdings(stock_symbol);
CREATE INDEX IF NOT EXISTS idx_stocks_symbol ON stocks(symbol);
CREATE INDEX IF NOT EXISTS idx_predictions_stock_symbol ON predictions(stock_symbol);
CREATE INDEX IF NOT EXISTS idx_predictions_type ON predictions(prediction_type);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_news_stock_symbols ON news USING GIN(stock_symbols);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_portfolio_id ON transactions(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_transactions_stock_symbol ON transactions(stock_symbol);
CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarked_stocks_user_id ON bookmarked_stocks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarked_stocks_symbol ON bookmarked_stocks(stock_symbol);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarked_stocks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = auth_id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = auth_id);

-- Portfolios policies
CREATE POLICY "Users can view own portfolios" ON portfolios FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
);
CREATE POLICY "Users can insert own portfolios" ON portfolios FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
);
CREATE POLICY "Users can update own portfolios" ON portfolios FOR UPDATE USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
);
CREATE POLICY "Users can delete own portfolios" ON portfolios FOR DELETE USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
);

-- Holdings policies
CREATE POLICY "Users can view own holdings" ON holdings FOR SELECT USING (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text))
);
CREATE POLICY "Users can insert own holdings" ON holdings FOR INSERT WITH CHECK (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text))
);
CREATE POLICY "Users can update own holdings" ON holdings FOR UPDATE USING (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text))
);
CREATE POLICY "Users can delete own holdings" ON holdings FOR DELETE USING (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text))
);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
);
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
);
CREATE POLICY "Users can delete own transactions" ON transactions FOR DELETE USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
);

-- Watchlists policies
CREATE POLICY "Users can view own watchlists" ON watchlists FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
);
CREATE POLICY "Users can insert own watchlists" ON watchlists FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
);
CREATE POLICY "Users can update own watchlists" ON watchlists FOR UPDATE USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
);
CREATE POLICY "Users can delete own watchlists" ON watchlists FOR DELETE USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
);

-- Bookmarked stocks policies
CREATE POLICY "Users can view own bookmarked stocks" ON bookmarked_stocks FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
);
CREATE POLICY "Users can insert own bookmarked stocks" ON bookmarked_stocks FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
);
CREATE POLICY "Users can update own bookmarked stocks" ON bookmarked_stocks FOR UPDATE USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
);
CREATE POLICY "Users can delete own bookmarked stocks" ON bookmarked_stocks FOR DELETE USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
);

-- Public read access for stocks, predictions, and news
CREATE POLICY "Anyone can view stocks" ON stocks FOR SELECT USING (true);
CREATE POLICY "Anyone can view predictions" ON predictions FOR SELECT USING (true);
CREATE POLICY "Anyone can view news" ON news FOR SELECT USING (true);
