import { supabase } from './supabase'
import { Database } from './supabase'
import bcrypt from 'bcryptjs'

type Tables = Database['public']['Tables']

// User Management Functions
export const createUser = async (userData: {
  authId: string
  authProvider: string
  email: string
  name: string
  password?: string
  profileImage?: string
}) => {
  const { authId, authProvider, email, name, password, profileImage } = userData
  
  // Normalize email
  const normalizedEmail = email.toLowerCase().trim()
  
  // Validate email format
  if (!normalizedEmail.includes('@') || normalizedEmail.length < 5) {
    throw new Error("Invalid email format")
  }
  
  // Validate name
  if (!name || name.trim().length < 2) {
    throw new Error("Name must be at least 2 characters long")
  }
  
  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', normalizedEmail)
    .single()
  
  if (existingUser) {
    throw new Error("User with this email already exists")
  }
  
  // Hash password if provided
  let passwordHash = null
  if (password) {
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long")
    }
    passwordHash = await bcrypt.hash(password, 10)
  }
  
  // Create user
  const { data, error } = await supabase
    .from('users')
    .insert({
      auth_id: authId,
      auth_provider: authProvider,
      email: normalizedEmail,
      name: name.trim(),
      password_hash: passwordHash,
      profile_image: profileImage,
      robinhood_connected: false
    })
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return { _id: data.id }
}

export const getUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null // User not found
    }
    throw new Error(error.message)
  }
  
  return data
}

export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null // User not found
    }
    throw new Error(error.message)
  }
  
  return data
}

export const verifyUserCredentials = async (email: string, password: string) => {
  const normalizedEmail = email.toLowerCase().trim()
  
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', normalizedEmail)
    .single()
  
  if (error || !user) {
    throw new Error("Invalid email or password")
  }
  
  if (!user.password_hash) {
    throw new Error("No password set for this account. Please sign up again or contact support.")
  }
  
  const isValidPassword = await bcrypt.compare(password, user.password_hash)
  
  if (!isValidPassword) {
    throw new Error("Invalid email or password")
  }
  
  // Update last login time
  await supabase
    .from('users')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', user.id)
  
  // Return user data without password hash
  const { password_hash, ...userData } = user
  return userData
}

export const updateUserPreferences = async (userId: string, preferences: {
  currency?: string
  theme?: string
  notifications?: boolean
}) => {
  const { data, error } = await supabase
    .from('users')
    .update({ preferences })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// Portfolio Management Functions
export const createPortfolio = async (portfolioData: {
  userId: string
  name: string
}) => {
  const { data, error } = await supabase
    .from('portfolios')
    .insert({
      user_id: portfolioData.userId,
      name: portfolioData.name
    })
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export const getUserPortfolios = async (userId: string) => {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export const getPortfolioHoldings = async (portfolioId: string) => {
  const { data, error } = await supabase
    .from('holdings')
    .select('*')
    .eq('portfolio_id', portfolioId)
    .order('last_updated', { ascending: false })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export const addHolding = async (holdingData: {
  portfolioId: string
  stockSymbol: string
  shares: number
  averageCost: number
}) => {
  const { portfolioId, stockSymbol, shares, averageCost } = holdingData
  
  const currentValue = shares * averageCost
  const totalCost = shares * averageCost
  const gainLoss = currentValue - totalCost
  const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0
  
  // Check if holding already exists
  const { data: existingHolding } = await supabase
    .from('holdings')
    .select('*')
    .eq('portfolio_id', portfolioId)
    .eq('stock_symbol', stockSymbol)
    .single()
  
  if (existingHolding) {
    // Update existing holding
    const newShares = existingHolding.shares + shares
    const newTotalCost = (existingHolding.total_cost || 0) + totalCost
    const newAverageCost = newTotalCost / newShares
    const newCurrentValue = newShares * averageCost
    const newGainLoss = newCurrentValue - newTotalCost
    const newGainLossPercent = newTotalCost > 0 ? (newGainLoss / newTotalCost) * 100 : 0
    
    const { data, error } = await supabase
      .from('holdings')
      .update({
        shares: newShares,
        average_cost: newAverageCost,
        current_value: newCurrentValue,
        total_cost: newTotalCost,
        gain_loss: newGainLoss,
        gain_loss_percent: newGainLossPercent,
        last_updated: new Date().toISOString()
      })
      .eq('id', existingHolding.id)
      .select()
      .single()
    
    if (error) {
      throw new Error(error.message)
    }
    
    return data
  } else {
    // Create new holding
    const { data, error } = await supabase
      .from('holdings')
      .insert({
        portfolio_id: portfolioId,
        stock_symbol: stockSymbol,
        shares,
        average_cost: averageCost,
        current_value: currentValue,
        total_cost: totalCost,
        gain_loss: gainLoss,
        gain_loss_percent: gainLossPercent
      })
      .select()
      .single()
    
    if (error) {
      throw new Error(error.message)
    }
    
    return data
  }
}

// Bookmarked Stocks Functions
export const addBookmarkedStock = async (bookmarkData: {
  userId: string
  stockSymbol: string
  stockName: string
  notes?: string
  targetPrice?: number
  alertPrice?: number
}) => {
  const { userId, stockSymbol, stockName, notes, targetPrice, alertPrice } = bookmarkData
  
  // Check if already bookmarked
  const { data: existingBookmark } = await supabase
    .from('bookmarked_stocks')
    .select('id')
    .eq('user_id', userId)
    .eq('stock_symbol', stockSymbol)
    .single()
  
  if (existingBookmark) {
    throw new Error("Stock is already bookmarked")
  }
  
  const { data, error } = await supabase
    .from('bookmarked_stocks')
    .insert({
      user_id: userId,
      stock_symbol: stockSymbol,
      stock_name: stockName,
      notes,
      target_price: targetPrice,
      alert_price: alertPrice,
      is_alert_active: alertPrice ? true : false
    })
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export const removeBookmarkedStock = async (userId: string, stockSymbol: string) => {
  const { error } = await supabase
    .from('bookmarked_stocks')
    .delete()
    .eq('user_id', userId)
    .eq('stock_symbol', stockSymbol)
  
  if (error) {
    throw new Error(error.message)
  }
  
  return { success: true }
}

export const getUserBookmarkedStocks = async (userId: string) => {
  const { data, error } = await supabase
    .from('bookmarked_stocks')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export const updateBookmarkedStock = async (bookmarkId: string, updates: {
  notes?: string
  targetPrice?: number
  alertPrice?: number
  isAlertActive?: boolean
}) => {
  const { data, error } = await supabase
    .from('bookmarked_stocks')
    .update(updates)
    .eq('id', bookmarkId)
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// Robinhood Integration Functions
export const connectRobinhood = async (userId: string, robinhoodData: {
  accessToken: string
  refreshToken: string
  expiresAt: number
  accountId: string
  profile: any
}) => {
  const { data, error } = await supabase
    .from('users')
    .update({
      robinhood_connected: true,
      robinhood_access_token: robinhoodData.accessToken,
      robinhood_refresh_token: robinhoodData.refreshToken,
      robinhood_token_expires_at: robinhoodData.expiresAt,
      robinhood_account_id: robinhoodData.accountId,
      robinhood_profile: robinhoodData.profile,
      robinhood_connected_at: Date.now(),
      robinhood_last_sync_at: Date.now()
    })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export const disconnectRobinhood = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .update({
      robinhood_connected: false,
      robinhood_access_token: null,
      robinhood_refresh_token: null,
      robinhood_token_expires_at: null,
      robinhood_account_id: null,
      robinhood_profile: null,
      robinhood_connected_at: null,
      robinhood_last_sync_at: null
    })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// Stock Management Functions
export const getStock = async (symbol: string) => {
  const { data, error } = await supabase
    .from('stocks')
    .select('*')
    .eq('symbol', symbol.toUpperCase())
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null // Stock not found
    }
    throw new Error(error.message)
  }
  
  return data
}

export const getStocks = async (symbols: string[]) => {
  const { data, error } = await supabase
    .from('stocks')
    .select('*')
    .in('symbol', symbols.map(s => s.toUpperCase()))
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export const updateStock = async (symbol: string, stockData: {
  name?: string
  currentPrice?: number
  previousClose?: number
  change?: number
  changePercent?: number
  volume?: number
  marketCap?: number
  sector?: string
  industry?: string
}) => {
  const { data, error } = await supabase
    .from('stocks')
    .update({
      ...stockData,
      last_updated: new Date().toISOString()
    })
    .eq('symbol', symbol.toUpperCase())
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// Predictions Functions
export const getPredictions = async (symbol: string) => {
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('stock_symbol', symbol.toUpperCase())
    .order('created_at', { ascending: false })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export const createPrediction = async (predictionData: {
  stockSymbol: string
  predictionType: string
  confidence: number
  prediction: string
  targetPrice?: number
  timeframe: string
  reasoning: string
  expiresAt: string
}) => {
  const { data, error } = await supabase
    .from('predictions')
    .insert(predictionData)
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// News Functions
export const getNews = async (symbols?: string[], limit: number = 50) => {
  let query = supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit)
  
  if (symbols && symbols.length > 0) {
    query = query.overlaps('stock_symbols', symbols.map(s => s.toUpperCase()))
  }
  
  const { data, error } = await query
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// SnapTrade Integration Functions
export const connectSnapTrade = async (userId: string, authorizationId: string) => {
  const { data, error } = await supabase
    .from('users')
    .update({
      snaptrade_auth_id: authorizationId,
      snaptrade_connected: true,
      snaptrade_connected_at: new Date().toISOString(),
      snaptrade_last_sync_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export const disconnectSnapTrade = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .update({
      snaptrade_auth_id: null,
      snaptrade_connected: false,
      snaptrade_connected_at: null,
      snaptrade_last_sync_at: null
    })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export const getSnapTradeAuth = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('snaptrade_auth_id, snaptrade_connected, snaptrade_connected_at, snaptrade_last_sync_at')
    .eq('id', userId)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null // User not found
    }
    throw new Error(error.message)
  }
  
  return data
}

export const updateSnapTradeSyncTime = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .update({
      snaptrade_last_sync_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}
