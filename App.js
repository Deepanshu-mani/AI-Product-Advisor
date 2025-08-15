import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, StatusBar, Animated, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import InputBox from "./components/InputBox";
import ProductCard from "./components/ProductCard";
import TestRecommendation from "./components/TestRecommendation";
import productsData from "./data/products.json";
import { getAIRecommendations } from "./services/aiService";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

const Dot = ({ delay, color }) => {
  const opacity = useState(new Animated.Value(0.3))[0];
  const translateY = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: 300, delay }),
          Animated.timing(translateY, { toValue: -4, duration: 300, delay })
        ]),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0.3, duration: 300 }),
          Animated.timing(translateY, { toValue: 0, duration: 300 })
        ])
      ])
    ).start();
  }, [opacity, translateY, delay]);

  return (
    <Animated.View
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: color,
        marginHorizontal: 3,
        opacity,
        transform: [{ translateY }],
      }}
    />
  );
};

function AppContent() {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [rotateAnim] = useState(new Animated.Value(0));
  const [spinnerAnim] = useState(new Animated.Value(0));

  const { isDarkTheme, currentTheme, toggleTheme } = useTheme();

  // Start spinner animation when loading starts
  useEffect(() => {
    if (loading) {
      const startSpinner = () => {
        spinnerAnim.setValue(0);
        Animated.loop(
          Animated.timing(spinnerAnim, {
            toValue: 1,
            duration: 1000,
          })
        ).start();
      };
      startSpinner();
    } else {
      spinnerAnim.stopAnimation();
    }
  }, [loading, spinnerAnim]);

  const handleToggleTheme = () => {
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 300,
      }),
    ]).start();

    toggleTheme();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleGetRecommendations = async (userQuery = null) => {
    const queryToUse = userQuery || query;
    
    if (!queryToUse.trim()) {
      setError("Please enter a description of what you need");
      return;
    }
    
    setLoading(true);
    setError("");
    setRecommendations([]);
    
    if (userQuery) {
      setQuery(userQuery);
    }
    
    try {
      const results = await getAIRecommendations(queryToUse, productsData);
      
      if (results && results.length > 0) {
        setRecommendations(results);
      } else {
        setError("No recommendations found. Try a different description.");
      }
    } catch (err) {
      setError("Failed to get recommendations. Please try again.");
      console.error("Recommendation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setError("");
    setRecommendations([]); // Clear existing recommendations
    setLoading(false); // Ensure loading state is reset
    
    // Store current query before clearing it
    const currentQuery = query;
    setQuery(""); // Clear the input field
    
    // If there was a current query, refresh the recommendations
    if (currentQuery.trim()) {
      try {
        const results = await getAIRecommendations(currentQuery, productsData);
        if (results && results.length > 0) {
          setRecommendations(results);
        }
      } catch (err) {
        setError("Failed to refresh recommendations. Please try again.");
        console.error("Refresh error:", err);
      }
    }
    
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <StatusBar 
        barStyle={isDarkTheme ? "light-content" : "dark-content"}
        backgroundColor={currentTheme.colors.background}
      />
      
      {/* Sophisticated Dark Header */}
      <View style={[styles.header, { 
        backgroundColor: currentTheme.colors.surface,
        borderBottomColor: isDarkTheme ? currentTheme.colors.gray400 : currentTheme.colors.gray200,
        boxShadowColor: currentTheme.colors.shadow,
        boxShadowOffset: { width: 0, height: 4 },
        boxShadowOpacity: 0.15,
        boxShadowRadius: 8,
        elevation: 8,
      }]}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: currentTheme.colors.text }]}>
            AI Product Advisor
          </Text>
          <Text style={[styles.subtitle, { color: currentTheme.colors.textSecondary }]}>
            Smart recommendations powered by AI
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.themeToggle, { 
            backgroundColor: currentTheme.colors.primary,
            boxShadowColor: currentTheme.colors.shadow,
            boxShadowOffset: { width: 0, height: 6 },
            boxShadowOpacity: 0.25,
            boxShadowRadius: 12,
            elevation: 12,
          }]} 
          onPress={handleToggleTheme}
          activeOpacity={0.8}
        >
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons 
              name={isDarkTheme ? "sunny" : "moon"} 
              size={20} 
              color={currentTheme.colors.primaryForeground} 
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[currentTheme.colors.primary]}
            tintColor={currentTheme.colors.primary}
            progressBackgroundColor={currentTheme.colors.background}
          />
        }
      >
        <InputBox 
          query={query} 
          setQuery={setQuery} 
          onSubmit={() => handleGetRecommendations()} 
          loading={loading}
          theme={currentTheme}
        />
        
        {error ? (
          <View style={[styles.errorContainer, { 
            backgroundColor: currentTheme.colors.destructive + "15",
            borderLeftColor: currentTheme.colors.destructive,
          }]}>
            <Ionicons name="alert-circle" size={20} color={currentTheme.colors.destructive} style={styles.errorIcon} />
            <Text style={[styles.errorText, { color: currentTheme.colors.destructive }]}>{error}</Text>
          </View>
        ) : null}
        
        {loading && (
          <View style={[styles.loadingContainer, { 
            backgroundColor: currentTheme.colors.surface,
            boxShadowColor: currentTheme.colors.shadow,
            boxShadowOffset: { width: 0, height: 2 },
            boxShadowOpacity: 0.1,
            boxShadowRadius: 8,
            elevation: 4,
          }]}>
            <View style={styles.loadingContent}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
                <Dot delay={0} color={currentTheme.colors.primary} />
                <Dot delay={150} color={currentTheme.colors.primary} />
                <Dot delay={300} color={currentTheme.colors.primary} />
              </View>
              <Text style={[styles.loadingText, { color: currentTheme.colors.textSecondary }]}>
                AI is analyzing your request...
              </Text>
              <Text style={[styles.loadingSubtext, { color: currentTheme.colors.textTertiary }]}>
                This usually takes 5-10 seconds
              </Text>
            </View>
          </View>
        )}
        
        {recommendations.length > 0 && (
          <View style={styles.recommendationsContainer}>
            <View style={styles.recommendationsHeader}>
              <Ionicons name="checkmark-circle" size={24} color={currentTheme.colors.success} />
              <Text style={[styles.recommendationsTitle, { color: currentTheme.colors.text }]}>
                {recommendations.length} Recommendation{recommendations.length !== 1 ? 's' : ''} Found
              </Text>
            </View>
            {recommendations.map((item, index) => (
              <ProductCard 
                key={index} 
                product={item}
                theme={currentTheme}
              />
            ))}
          </View>
        )}
        
        {recommendations.length === 0 && !loading && !error && (
          <TestRecommendation 
            onTest={handleGetRecommendations}
            theme={currentTheme}
          />
        )}
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  recommendationsContainer: {
    marginTop: 16,
  },
  recommendationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  loadingContainer: {
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
  },
  loadingContent: {
    alignItems: "center",
  },
  loadingSpinnerWrapper: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  loadingSubtext: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.7,
  },
});
