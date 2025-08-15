

// components/ProductCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProductCard({ product, theme }) {
  if (!product) return null;

  const { brand, product_name, price, category, description, reason } = product;

  return (
    <View style={[styles.card, { 
      backgroundColor: theme.colors.surface,
      boxShadowColor: theme.colors.shadow,
      boxShadowOffset: { width: 0, height: 4 },
      boxShadowOpacity: 0.15,
      boxShadowRadius: 12,
      elevation: 8,
      borderColor: theme.colors.gray200,
    }]}>
      <View style={styles.header}>
        <Text style={[styles.brand, { color: theme.colors.primary }]}>{brand}</Text>
        <View style={[styles.categoryBadge, { 
          backgroundColor: theme.colors.gray100,
        }]}>
          <Text style={[styles.category, { color: theme.colors.gray600 }]}>{category}</Text>
        </View>
      </View>
      
      <Text style={[styles.title, { color: theme.colors.text }]}>{product_name}</Text>
      
      <Text style={[styles.price, { color: theme.colors.success }]}>₹{price.toLocaleString()}</Text>
      
      <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{description}</Text>
      
      <View style={[styles.reasonContainer, { 
        backgroundColor: theme.colors.gray50,
        borderLeftColor: theme.colors.warning,
      }]}>
        <Text style={[styles.reasonLabel, { color: theme.colors.warning }]}>Why this is recommended:</Text>
        <Text style={[styles.reason, { color: theme.colors.text }]}>{reason}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  brand: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  category: {
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  reasonContainer: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  reason: {
    fontSize: 14,
    lineHeight: 18,
  },
});