# 🎮 GameHub - Game Platform Frontend

A mobile-first React/Next.js gaming platform featuring mini-games, user authentication, and game history tracking.

## 🚀 Features

### Core Features
- **🔐 Local Authentication**: Login/Register system with localStorage
- **🎮 Game Library**: Collection of 3 mini-games
- **📱 Mobile-First Design**: Responsive layout for all devices
- **🔄 Orientation Support**: Portrait/landscape adaptation
- **📜 Game History**: Track gameplay sessions and scores
- **💾 Local Storage**: All data stored locally (no backend required)

### Games Included
1. **👆 Tap Counter**: Test your tapping speed in 10 seconds
2. **🧠 Memory Clicker**: Remember and repeat color sequences
3. **🎁 Lucky Box**: Pick mystery boxes for random prizes

## 📱 Mobile Responsiveness

This application is built with a **mobile-first approach**:

- ✅ Responsive grid layouts
- ✅ Touch-optimized game controls
- ✅ Orientation detection and adaptation
- ✅ Mobile navigation patterns
- ✅ Portrait/landscape mode support

### Orientation Features
- Automatic orientation detection
- Game-specific orientation preferences
- Rotation prompts for optimal gameplay
- Adaptive UI layouts for different screen sizes

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.6 (React 19.1.0)
- **Styling**: Tailwind CSS 4.0
- **State Management**: React Context API + Custom Hooks
- **Storage**: Browser localStorage
- **Deployment**: Vercel-ready

## 🎯 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── games/             # Game library and individual games
│   │   └── [slug]/        # Dynamic game routes
│   ├── history/           # Game history page
│   ├── login/             # Authentication pages
│   ├── register/
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── games/             # Game components
│   │   ├── TapCounter.jsx
│   │   ├── MemoryClicker.jsx
│   │   └── LuckyBox.jsx
│   ├── AuthProvider.jsx   # Authentication context
│   ├── Navigation.jsx     # Main navigation
│   └── OrientationHandler.jsx
└── hooks/
    └── useAuth.js         # Authentication hook
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd game-platform-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Play

### Getting Started
1. **Register**: Create a new account or use the demo account
2. **Login**: Sign in with your credentials
3. **Browse Games**: Explore the game library
4. **Play**: Click on any game to start playing
5. **Track Progress**: View your game history and scores

### Demo Account
For quick testing:
- **Email**: demo@gamehub.com
- **Password**: demo123

### Game Descriptions

#### 👆 Tap Counter
- **Objective**: Tap the button as many times as possible in 10 seconds
- **Scoring**: 1 point per tap
- **Strategy**: Find a comfortable tapping rhythm

#### 🧠 Memory Clicker
- **Objective**: Watch and repeat sequences of colored buttons
- **Scoring**: 10 points per correct sequence × sequence length
- **Levels**: 5 levels with increasing difficulty

#### 🎁 Lucky Box
- **Objective**: Choose mystery boxes to reveal prizes
- **Scoring**: Variable points based on prize rarity
- **Rounds**: 5 rounds per game session

## 📊 Scoring System

Each game tracks:
- **Current Score**: Points earned in the current session
- **Best Score**: Personal best for each game
- **Game History**: Complete log of all gameplay sessions
- **Statistics**: Total games played, games tried, cumulative scores

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Key Implementation Details

#### Authentication
- Uses React Context for global state management
- localStorage for session persistence
- Protected routes with automatic redirects
- Form validation and error handling

#### Mobile Responsiveness
- CSS Grid and Flexbox for layouts
- Tailwind CSS breakpoints (sm, md, lg, xl)
- Touch-optimized game controls
- Orientation detection with JavaScript

#### Game State Management
- Local state for game logic
- localStorage for persistent data
- Real-time score updates
- Game session tracking

## 🌟 Bonus Features Implemented

- **📊 Dashboard Statistics**: Total games, best scores, progress tracking
- **🎨 Smooth Animations**: CSS transitions and transforms
- **🔄 Auto-rotation Detection**: Orientation-aware layouts
- **💾 Data Persistence**: Complete local storage implementation
- **🎯 Game Variety**: Three different game types with unique mechanics

## 📱 Mobile Testing

To test mobile responsiveness:

1. **Browser DevTools**: Use Chrome/Firefox mobile simulation
2. **Physical Device**: Test on actual smartphones/tablets
3. **Orientation**: Rotate device to test both orientations
4. **Touch Interactions**: Verify all buttons and gestures work

### Recommended Test Scenarios
- Login/Register on mobile
- Game library browsing
- Individual game gameplay
- History page navigation
- Orientation changes during gameplay

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Manual Build
```bash
npm run build
npm run start
```

## 🎯 Evaluation Criteria Met

- ✅ **Fully functional core features**
- ✅ **Mobile-first & responsive design**
- ✅ **Portrait/landscape adaptation**
- ✅ **Clean component structure & UI polish**
- ✅ **localStorage for persistence**
- ✅ **Creative touches & animations**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the GameHub Frontend Assignment**
