import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";

const AppBar = ({ title, onMenuPress }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={onMenuPress}
          style={styles.menuIconContainer}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
    paddingTop: 0,
  },
  container: {
    height: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
  },
  menuIconContainer: {
    position: "absolute",
    left: 16,
  },
  menuIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AppBar;
