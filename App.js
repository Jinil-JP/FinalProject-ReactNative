import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DrawerMenuScreen from "./DrawerMenu";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const user = JSON.parse(await AsyncStorage.getItem("currentUser"));
        if (user) {
          setIsLoggedIn(true);
          setCurrentUser(user);
        }
      } catch (error) {
        console.log("Error checking current user:", error);
      }
    };

    checkCurrentUser();
  }, []);

  const handleLogin = async () => {
    try {
      const users = JSON.parse(await AsyncStorage.getItem("users"));

      const user = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);
        await AsyncStorage.setItem("currentUser", JSON.stringify(user));
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
        Alert.alert("Failure", "Please enter valid credentials");
      }
    } catch (error) {
      console.log("Error retrieving users:", error);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggedIn(false);
      setCurrentUser(null);
      await AsyncStorage.removeItem("currentUser");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  if (isLoggedIn) {
    return (
      <DrawerMenuScreen handleLogout={handleLogout} currentUser={currentUser} />
    );
  }

  return (
    <ImageBackground
      source={require("./images/background2.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Project Management System</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="black"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="black"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        <Button
          title="Login"
          onPress={handleLogin}
          style={styles.loginButton}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  loginButton: {
    marginTop: 20,
  },
});

export default LoginPage;
