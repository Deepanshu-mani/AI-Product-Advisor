# AI Product Advisor

A React Native app that uses Google's Gemini AI to provide intelligent product recommendations based on user queries.

## 🏗️ Architecture

### High-Level Component Structure
```
App.js (Root Component)
├── ThemeProvider (Context Provider)
│   ├── AppContent (Main App Logic)
│   │   ├── Header (Title + Theme Toggle)
│   │   ├── ScrollView (Main Content Container)
│   │   │   ├── InputBox (Query Input)
│   │   │   ├── Error Display (Error Messages)
│   │   │   ├── Loading State (Animated Dots)
│   │   │   ├── Recommendations (Product Cards)
│   │   │   └── TestRecommendation (Sample Queries)
│   │   └── RefreshControl (Pull-to-Refresh)
│   └── ThemeContext (Theme State Management)
└── AI Service Layer
    └── aiService.js (Gemini AI Integration)
```

### Data Flow Architecture
1. **User Input** → InputBox component captures query
2. **Query Processing** → aiService.js processes with Gemini AI
3. **Response Handling** → AI response parsed and validated
4. **State Management** → React state updates with results
5. **UI Rendering** → Components re-render with new data
6. **Theme Integration** → Context provides theme data to all components

### State Management Pattern
- **Local State**: Component-specific state (query, loading, error)
- **Context State**: Global theme state shared across components
- **Service State**: AI service manages API calls and responses
- **Unidirectional Flow**: Data flows down from parent to child components

## 🎯 Approach & Key Design Decisions

### 1. **Component-Based Architecture**
**Decision**: Modular, reusable components with single responsibility
**Why**: 
- Easier maintenance and testing
- Better code organization
- Reusable across different parts of the app
- Follows React best practices

### 2. **Theme Context Pattern**
**Decision**: Centralized theme management using React Context
**Why**:
- Single source of truth for theme data
- Easy theme switching without prop drilling
- Consistent theming across all components
- Better performance than prop-based theming

### 3. **AI Service Abstraction**
**Decision**: Separate service layer for AI integration
**Why**:
- Clean separation of concerns
- Easy to switch AI providers
- Centralized error handling
- Reusable across different components

### 4. **Smart Query Processing**
**Decision**: Intelligent parsing of user queries with fallback handling
**Why**:
- Better user experience for vague queries
- Robust handling of random/nonsensical input
- Budget and keyword extraction for better matching
- Graceful degradation when AI fails

### 5. **Pull-to-Refresh Implementation**
**Decision**: Native RefreshControl with smart refresh logic
**Why**:
- Familiar UX pattern for mobile users
- Only refreshes when there's an existing query
- Clears all data for fresh start
- Cross-platform compatibility

### 6. **Loading State Design**
**Decision**: Animated dots with professional styling
**Why**:
- Visual feedback during AI processing
- Theme-aware colors for consistency
- Smooth animations for better UX
- Clear indication of processing time

## 📁 File Structure

### Root Directory
```
advisorAI/
├── App.js                 # Main application component
├── index.js              # Entry point for React Native
├── package.json          # Dependencies and scripts
├── app.json             # Expo configuration
├── README.md            # Project documentation
├── ai_conversation_log.md # AI development history
└── .env                 # Environment variables (not in repo)
```

### Components Directory
```
components/
├── InputBox.js          # Smart input component with Enter key support
├── ProductCard.js       # Product recommendation display cards
└── TestRecommendation.js # Built-in testing interface
```

**Component Responsibilities:**
- **InputBox.js**: Handles user input, Enter key submission, loading states
- **ProductCard.js**: Displays product information with consistent theming
- **TestRecommendation.js**: Provides sample queries for testing the system

### Services Directory
```
services/
└── aiService.js         # Gemini AI integration service
```

**Service Responsibilities:**
- **aiService.js**: 
  - Manages Gemini API calls
  - Handles query processing and parsing
  - Implements fallback logic for failed requests
  - Validates AI responses

### Contexts Directory
```
contexts/
└── ThemeContext.js      # Theme state management
```

**Context Responsibilities:**
- **ThemeContext.js**: 
  - Manages light/dark theme state
  - Provides theme data to all components
  - Handles theme switching logic
  - Defines theme color schemes

### Data Directory
```
data/
└── products.json        # Product catalog data
```

**Data Responsibilities:**
- **products.json**: 
  - Contains product information
  - Structured for AI processing
  - Includes brand, price, category, description

### Assets Directory
```
assets/
├── icon.png            # App icon
├── splash-icon.png     # Splash screen icon
├── adaptive-icon.png   # Adaptive icon for Android
├── favicon.png         # Web favicon
└── snack-icon.png      # Snack icon
```

## ✨ Features

### 🎨 **Modern UI with Dark Theme**
- **Light Theme**: Clean, modern interface with blue accents
- **Dark Theme**: Easy on the eyes with dark backgrounds
- **Theme Toggle**: Beautiful animated toggle button in the header
- **Gradient Headers**: Subtle gradient effects for visual appeal

### ⌨️ **Enhanced User Experience**
- **Enter Key Support**: Press Enter to submit queries instantly
- **Shift+Enter**: Create new lines when needed
- **Smart Input**: Auto-capitalization and spell check
- **Loading States**: Visual feedback during AI processing
- **Error Handling**: Clear error messages with icons
- **Pull-to-Refresh**: Native refresh functionality for fresh data

### 🤖 **AI-Powered Recommendations**
- **Gemini AI Integration**: Uses Google's latest AI model
- **Smart Matching**: Analyzes user needs and matches products
- **Rich Product Cards**: Display brand, price, category, and AI reasoning
- **Test Queries**: Built-in sample queries to test the system
- **Query Intelligence**: Budget parsing, keyword extraction, random input detection

### 📱 **Responsive Design**
- **Mobile Optimized**: Perfect for mobile devices
- **Smooth Animations**: Subtle animations and transitions
- **Touch Friendly**: Large touch targets and intuitive gestures
- **Cross Platform**: Works on iOS, Android, and Web

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Expo CLI
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd advisorAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```bash
   EXPO_PUBLIC_GEMINI_KEY=your_gemini_api_key_here
   ```

4. **Get your Gemini API key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy it to your `.env` file

5. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

## 🎯 How to Use

### Getting Recommendations
1. **Describe your needs** in the input box
2. **Press Enter** or tap the button to submit
3. **View AI recommendations** with detailed explanations
4. **Try test queries** to see the system in action
5. **Pull down to refresh** for fresh recommendations

### Theme Switching
- **Tap the theme toggle** (sun/moon icon) in the header
- **Enjoy smooth animations** when switching themes
- **Automatic status bar** color adjustment

### Keyboard Shortcuts
- **Enter**: Submit query
- **Shift + Enter**: New line
- **Tab**: Navigate between elements

## 🛠️ Technical Details

### Architecture
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **Gemini AI**: Google's latest AI model
- **Component-based**: Modular, reusable components
- **Context API**: Global state management
- **Service Layer**: Clean separation of concerns

### Key Components
- `App.js`: Main application with theme management and refresh control
- `InputBox.js`: Smart input with Enter key support and loading states
- `ProductCard.js`: Rich product display cards with consistent theming
- `TestRecommendation.js`: Built-in testing interface for quick queries
- `aiService.js`: Gemini AI integration service with fallback logic
- `ThemeContext.js`: Theme state management using React Context

### Theme System
- **Dynamic colors**: Automatically adjusts all UI elements
- **Consistent styling**: Unified design language
- **Accessibility**: High contrast and readable text
- **Performance**: Optimized animations and transitions
- **Context-based**: Centralized theme management

## 🔧 Configuration

### Environment Variables
```bash
EXPO_PUBLIC_GEMINI_KEY=your_api_key_here
```

### Customization
- **Colors**: Modify theme colors in `contexts/ThemeContext.js`
- **Animations**: Adjust animation durations and effects in `App.js`
- **Styling**: Customize component styles in individual component files
- **AI Settings**: Modify AI behavior in `services/aiService.js`

## 📱 Platform Support

- ✅ **iOS**: Native iOS app
- ✅ **Android**: Native Android app
- ✅ **Web**: Responsive web application
- ✅ **Expo Go**: Test on physical devices

## 🎨 UI Components

### Header
- App title with subtitle
- Animated theme toggle button
- Professional styling with shadows

### Input Box
- Multi-line text input
- Smart placeholder text
- Loading states and animations
- Enter key support

### Product Cards
- Brand and category badges
- Price display
- Product descriptions
- AI reasoning explanations

### Test Interface
- Sample queries for testing
- Easy one-tap testing
- Visual feedback

### Loading States
- Animated dots during AI processing
- Professional styling with theme colors
- Clear user feedback

## 🚀 Performance Features

- **Lazy loading**: Components load as needed
- **Optimized animations**: 60fps smooth transitions
- **Efficient rendering**: Minimal re-renders
- **Memory management**: Proper cleanup and optimization
- **Native drivers**: Hardware-accelerated animations
- **Context optimization**: Efficient theme state updates

## 🔒 Security

- **API key protection**: Environment variable storage
- **Input validation**: Sanitized user inputs
- **Error handling**: Secure error messages
- **Content filtering**: AI safety settings enabled
- **Fallback handling**: Graceful degradation on failures

## 📈 Future Enhancements

- [ ] **User accounts**: Save preferences and history
- [ ] **Product filtering**: Advanced search options
- [ ] **Recommendation history**: Track past queries
- [ ] **Offline support**: Cache recommendations
- [ ] **Voice input**: Speech-to-text capabilities
- [ ] **AR preview**: Augmented reality product viewing
- [ ] **Personalization**: Learn user preferences over time
- [ ] **Smart notifications**: Alert users about new products

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your API key configuration
3. Ensure all dependencies are installed
4. Check the troubleshooting guide in `ai_conversation_log.md`

---

**Built with ❤️ using React Native, Expo, and Google Gemini AI**
