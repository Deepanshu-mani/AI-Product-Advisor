// components/InputBox.js
import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function InputBox({
  query,
  setQuery,
  onSubmit,
  loading,
  theme,
}) {
  const handleSubmit = () => {
    if (!loading && query.trim()) {
      onSubmit();
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === "Enter" && !nativeEvent.shiftKey) {
      handleSubmit();
    }
  };

  const handleSubmitEditing = () => {
    handleSubmit();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.gray200,
          boxShadowColor: theme.colors.shadow,
          boxShadowOffset: { width: 0, height: 4 },
          boxShadowOpacity: 0.1,
          boxShadowRadius: 8,
          elevation: 6,
        },
      ]}
    >
      <Text style={[styles.label, { color: theme.colors.text }]}>
        What are you looking for?
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: theme.colors.gray300,
            backgroundColor: theme.colors.input,
            color: theme.colors.text,
          },
        ]}
        placeholder="e.g., I need a device to help with back pain, or I want a smart home security system..."
        placeholderTextColor={theme.colors.textSecondary}
        value={query}
        onChangeText={setQuery}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        editable={!loading}
        onSubmitEditing={handleSubmitEditing}
        returnKeyType="search"
        onKeyPress={handleKeyPress}
        autoCapitalize="sentences"
        autoCorrect={true}
        spellCheck={true}
      />

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.primary,
            boxShadowColor: theme.colors.shadow,
            boxShadowOffset: { width: 0, height: 6 },
            boxShadowOpacity: 0.25,
            boxShadowRadius: 12,
            elevation: 12,
          },
          loading && styles.buttonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={theme.colors.primaryForeground}
            />
            <Text
              style={[
                styles.buttonText,
                { color: theme.colors.primaryForeground },
              ]}
            >
              Getting Recommendations...
            </Text>
          </View>
        ) : (
          <View style={styles.buttonContent}>
            <Ionicons
              name="search"
              size={18}
              color={theme.colors.primaryForeground}
              style={styles.buttonIcon}
            />
            <Text
              style={[
                styles.buttonText,
                { color: theme.colors.primaryForeground },
              ]}
            >
              Get AI Recommendations
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.hintsContainer}>
        <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>
          💡 Be specific about your needs, budget, or use case for better
          recommendations
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    minHeight: 80,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  hintsContainer: {
    alignItems: "center",
  },
  hint: {
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 6,
  },
  enterHint: {
    fontSize: 11,
    textAlign: "center",
    opacity: 0.8,
  },
});
