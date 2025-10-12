// Simplified Convex API for build compatibility
export const api = {
  functions: {
    getGreeting: () => Promise.resolve("Hello from Convex!"),
    getStocks: () => Promise.resolve([]),
    getNews: () => Promise.resolve([]),
    getPredictions: () => Promise.resolve([]),
    getDashboardData: () => Promise.resolve({
      portfolio: { totalValue: 0, totalGainLoss: 0 },
      stocks: [],
      predictions: [],
      news: []
    })
  }
};

export const internal = api;
