# FinAIse Web Application

AI-powered financial advisor platform built with Next.js, TypeScript, and Convex.

## 🚀 Features

- **AI Stock Predictions**: Machine learning-powered investment recommendations
- **Portfolio Management**: Track and analyze your investment portfolio
- **Real-time Market Data**: Live stock prices and market insights
- **News Integration**: Financial news with sentiment analysis
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Powered by Convex for instant data synchronization

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Custom CSS
- **Backend**: Convex (Real-time database)
- **Charts**: Recharts, Chart.js
- **Authentication**: Custom auth with OAuth2 support
- **Deployment**: Vercel

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Convex account

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FinAIse/FinAIseWeb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your values:
   ```env
   NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
   NEXT_PUBLIC_YAHOO_FINANCE_API_KEY=your_api_key
   NEXT_PUBLIC_HUGGING_FACE_API_KEY=your_api_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
FinAIseWeb/
├── app/                    # Next.js app directory
│   ├── dashboard.tsx      # Main dashboard page
│   ├── portfolio.tsx     # Portfolio management
│   ├── news.tsx          # News feed
│   ├── ai.tsx            # AI predictions
│   ├── auth.tsx          # Authentication
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/            # Reusable components
│   ├── Navbar.tsx        # Navigation bar
│   ├── Sidebar.tsx       # Sidebar navigation
│   ├── StockCard.tsx     # Stock display card
│   ├── AISuggestionCard.tsx # AI recommendation card
│   ├── PredictionChart.tsx # Chart components
│   └── NewsCard.tsx      # News article card
├── lib/                   # Utility libraries
│   ├── convex.ts         # Convex client configuration
│   ├── api.ts            # API utilities
│   └── utils.ts          # Helper functions
├── styles/               # Global styles
│   └── globals.css       # Tailwind CSS and custom styles
└── public/               # Static assets
```

## 🔧 Configuration

### Tailwind CSS

The project uses Tailwind CSS with custom configuration:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { /* Custom blue palette */ },
        secondary: { /* Secondary colors */ },
        accent: { /* Orange accent colors */ }
      }
    }
  }
}
```

### Next.js Configuration

Optimized for Vercel deployment:

```javascript
// next.config.js
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    remotePatterns: [{ protocol: 'https', hostname: '**' }]
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true
}
```

## 📊 Database Schema

The application uses Convex with the following main collections:

- **Users**: User profiles and authentication
- **Stocks**: Stock data and metadata
- **Portfolios**: User portfolio management
- **Predictions**: AI-generated recommendations
- **News**: Financial news articles
- **Watchlists**: User watchlists
- **Transactions**: Trading history

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   - Push code to GitHub
   - Connect repository to Vercel
   - Set `FinAIseWeb` as root directory

2. **Configure Environment Variables**
   ```env
   NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
   ```

3. **Deploy**
   - Vercel automatically detects Next.js
   - Build and deployment happen automatically
   - App available at `https://your-project.vercel.app`

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile-first approach**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Flexible layouts**: Grid and flexbox for adaptive design
- **Touch-friendly**: Large touch targets and gestures

## 🔐 Security

- **Environment Variables**: Sensitive data stored securely
- **HTTPS**: Automatic SSL certificates via Vercel
- **Security Headers**: XSS protection, content type options
- **Input Validation**: TypeScript and runtime validation
- **CORS**: Properly configured for API access

## 📈 Performance

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Static generation and ISR
- **Compression**: Gzip compression enabled
- **CDN**: Global content delivery via Vercel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the development team

## 🔄 Changelog

### v1.0.0 (Current)
- Initial release
- AI predictions integration
- Portfolio management
- Real-time data updates
- Responsive design
- Vercel deployment ready

## 🎯 Roadmap

- [ ] Advanced charting features
- [ ] Options trading support
- [ ] Social trading features
- [ ] Mobile app integration
- [ ] Advanced AI models
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Offline support

## 📞 Contact

- **Website**: [FinAIse.com](https://finaise.com)
- **Email**: support@finaise.com
- **Twitter**: [@FinAIse](https://twitter.com/finaise)
- **LinkedIn**: [FinAIse](https://linkedin.com/company/finaise)
# finalse
