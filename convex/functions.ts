// Placeholder Convex functions file
// This will be replaced when Convex is properly initialized

export const getGreeting = async () => {
  return "Hello from Convex!";
};

export const getStocks = async () => {
  return [];
};

export const getNews = async () => {
  return [];
};

export const getPredictions = async () => {
  return [];
};

export const getDashboardData = async () => {
  return {
    portfolio: { totalValue: 0, totalGainLoss: 0 },
    stocks: [],
    predictions: [],
    news: []
  };
};
