/**
 * Market Hours Utility
 * Determines if the US stock market is currently open or closed
 */

export interface MarketStatus {
  isOpen: boolean
  isPreMarket: boolean
  isAfterHours: boolean
  nextOpenTime?: Date
  nextCloseTime?: Date
  currentTime: Date
  timezone: string
}

export interface MarketHours {
  open: string // "09:30" in ET
  close: string // "16:00" in ET
  preMarketOpen: string // "04:00" in ET
  afterHoursClose: string // "20:00" in ET
}

// Standard US market hours (Eastern Time)
const MARKET_HOURS: MarketHours = {
  open: "09:30",
  close: "16:00",
  preMarketOpen: "04:00",
  afterHoursClose: "20:00"
}

// US market holidays (simplified list - in production, use a comprehensive holiday calendar)
const MARKET_HOLIDAYS = [
  "2024-01-01", // New Year's Day
  "2024-01-15", // Martin Luther King Jr. Day
  "2024-02-19", // Presidents' Day
  "2024-03-29", // Good Friday
  "2024-05-27", // Memorial Day
  "2024-06-19", // Juneteenth
  "2024-07-04", // Independence Day
  "2024-09-02", // Labor Day
  "2024-11-28", // Thanksgiving
  "2024-12-25", // Christmas Day
  "2025-01-01", // New Year's Day
  "2025-01-20", // Martin Luther King Jr. Day
  "2025-02-17", // Presidents' Day
  "2025-04-18", // Good Friday
  "2025-05-26", // Memorial Day
  "2025-06-19", // Juneteenth
  "2025-07-04", // Independence Day
  "2025-09-01", // Labor Day
  "2025-11-27", // Thanksgiving
  "2025-12-25", // Christmas Day
]

/**
 * Convert a time string (HH:MM) to minutes since midnight
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Convert minutes since midnight to time string (HH:MM)
 */
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

/**
 * Check if a given date is a weekend (Saturday or Sunday)
 */
function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday = 0, Saturday = 6
}

/**
 * Check if a given date is a market holiday
 */
function isMarketHoliday(date: Date): boolean {
  const dateString = date.toISOString().split('T')[0]
  return MARKET_HOLIDAYS.includes(dateString)
}

/**
 * Check if the market is closed for the day (weekend or holiday)
 */
function isMarketClosedForDay(date: Date): boolean {
  return isWeekend(date) || isMarketHoliday(date)
}

/**
 * Get the next market open time
 */
function getNextMarketOpen(currentTime: Date): Date {
  const nextOpen = new Date(currentTime)
  
  // If it's currently a weekday and before market open, open today
  if (!isWeekend(currentTime) && !isMarketHoliday(currentTime)) {
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()
    const openMinutes = timeToMinutes(MARKET_HOURS.open)
    
    if (currentMinutes < openMinutes) {
      nextOpen.setHours(9, 30, 0, 0)
      return nextOpen
    }
  }
  
  // Otherwise, find the next business day
  let daysToAdd = 1
  while (true) {
    const nextDay = new Date(currentTime)
    nextDay.setDate(currentTime.getDate() + daysToAdd)
    
    if (!isMarketClosedForDay(nextDay)) {
      nextDay.setHours(9, 30, 0, 0)
      return nextDay
    }
    
    daysToAdd++
  }
}

/**
 * Get the next market close time
 */
function getNextMarketClose(currentTime: Date): Date {
  const nextClose = new Date(currentTime)
  
  // If it's currently a weekday and before market close, close today
  if (!isWeekend(currentTime) && !isMarketHoliday(currentTime)) {
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()
    const closeMinutes = timeToMinutes(MARKET_HOURS.close)
    
    if (currentMinutes < closeMinutes) {
      nextClose.setHours(16, 0, 0, 0)
      return nextClose
    }
  }
  
  // Otherwise, find the next business day
  let daysToAdd = 1
  while (true) {
    const nextDay = new Date(currentTime)
    nextDay.setDate(currentTime.getDate() + daysToAdd)
    
    if (!isMarketClosedForDay(nextDay)) {
      nextDay.setHours(16, 0, 0, 0)
      return nextDay
    }
    
    daysToAdd++
  }
}

/**
 * Get the current market status
 */
export function getMarketStatus(date: Date = new Date()): MarketStatus {
  // Convert to Eastern Time
  const etTime = new Date(date.toLocaleString("en-US", { timeZone: "America/New_York" }))
  
  const currentMinutes = etTime.getHours() * 60 + etTime.getMinutes()
  const openMinutes = timeToMinutes(MARKET_HOURS.open)
  const closeMinutes = timeToMinutes(MARKET_HOURS.close)
  const preMarketOpenMinutes = timeToMinutes(MARKET_HOURS.preMarketOpen)
  const afterHoursCloseMinutes = timeToMinutes(MARKET_HOURS.afterHoursClose)
  
  const isMarketClosedForToday = isMarketClosedForDay(etTime)
  const isPreMarket = !isMarketClosedForToday && 
    currentMinutes >= preMarketOpenMinutes && 
    currentMinutes < openMinutes
  const isRegularHours = !isMarketClosedForToday && 
    currentMinutes >= openMinutes && 
    currentMinutes < closeMinutes
  const isAfterHours = !isMarketClosedForToday && 
    currentMinutes >= closeMinutes && 
    currentMinutes < afterHoursCloseMinutes
  
  const isOpen = isRegularHours
  const nextOpenTime = !isOpen ? getNextMarketOpen(etTime) : undefined
  const nextCloseTime = isOpen ? getNextMarketClose(etTime) : undefined
  
  return {
    isOpen,
    isPreMarket,
    isAfterHours,
    nextOpenTime,
    nextCloseTime,
    currentTime: etTime,
    timezone: "America/New_York"
  }
}

/**
 * Format time until next market event
 */
export function formatTimeUntilNextEvent(status: MarketStatus): string {
  if (status.isOpen && status.nextCloseTime) {
    const timeUntilClose = status.nextCloseTime.getTime() - status.currentTime.getTime()
    const hours = Math.floor(timeUntilClose / (1000 * 60 * 60))
    const minutes = Math.floor((timeUntilClose % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `Closes in ${hours}h ${minutes}m`
    } else {
      return `Closes in ${minutes}m`
    }
  } else if (!status.isOpen && status.nextOpenTime) {
    const timeUntilOpen = status.nextOpenTime.getTime() - status.currentTime.getTime()
    const days = Math.floor(timeUntilOpen / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeUntilOpen % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeUntilOpen % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) {
      return `Opens in ${days}d ${hours}h`
    } else if (hours > 0) {
      return `Opens in ${hours}h ${minutes}m`
    } else {
      return `Opens in ${minutes}m`
    }
  }
  
  return "Market status unknown"
}

/**
 * Get market status with formatted message
 */
export function getMarketStatusMessage(status?: MarketStatus): string {
  const marketStatus = status || getMarketStatus()
  
  if (marketStatus.isOpen) {
    return "Market is OPEN"
  } else if (marketStatus.isPreMarket) {
    return "Pre-Market Trading"
  } else if (marketStatus.isAfterHours) {
    return "After-Hours Trading"
  } else {
    return "Market is CLOSED"
  }
}

/**
 * Get market status color for UI
 */
export function getMarketStatusColor(status?: MarketStatus): string {
  const marketStatus = status || getMarketStatus()
  
  if (marketStatus.isOpen) {
    return "text-green-400"
  } else if (marketStatus.isPreMarket || marketStatus.isAfterHours) {
    return "text-yellow-400"
  } else {
    return "text-red-400"
  }
}

/**
 * Get market status background color for UI
 */
export function getMarketStatusBgColor(status?: MarketStatus): string {
  const marketStatus = status || getMarketStatus()
  
  if (marketStatus.isOpen) {
    return "bg-green-500/20 border-green-500/50"
  } else if (marketStatus.isPreMarket || marketStatus.isAfterHours) {
    return "bg-yellow-500/20 border-yellow-500/50"
  } else {
    return "bg-red-500/20 border-red-500/50"
  }
}
