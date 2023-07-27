// Constant.js

import AsyncStorage from "@react-native-async-storage/async-storage";

export const getCurrentUser = async () => {
  try {
    const user = await AsyncStorage.getItem("currentUser");
    console.log(user);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error; // Rethrow the error to handle it in the caller function
  }
};
