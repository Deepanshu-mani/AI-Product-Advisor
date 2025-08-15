// components/TestRecommendation.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function TestRecommendation({ onTest, theme }) {
  const testQueries = [
    "I need a device to help with back pain",
    "I want a smart home security system",
    "I'm looking for entertainment devices for kids",
    "I need kitchen appliances for cooking",
    "I want devices for hair care and styling"
  ];

  return (
    <View style={[styles.container, { 
      backgroundColor: theme.colors.surface,
      boxShadowColor: theme.colors.shadow,
      boxShadowOffset: { width: 0, height: 4 },
      boxShadowOpacity: 0.12,
      boxShadowRadius: 8,
      elevation: 6,
      borderColor: theme.colors.gray200,
    }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Test Recommendations</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Try these sample queries to test the AI:
      </Text>
      
      {testQueries.map((query, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.testButton, { 
            backgroundColor: theme.colors.gray200,
            borderLeftColor: theme.colors.primary,
          }]}
          onPress={() => onTest(query)}
          activeOpacity={0.7}
        >
          <Text style={[styles.testButtonText, { color: theme.colors.text }]}>{query}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  testButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  testButtonText: {
    fontSize: 14,
  },
});
