import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AppBar from "./AppBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateMember = () => {
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateMember = async () => {
    // Handle the logic to create a member with the entered details
    console.log("Member Name:", memberName);
    console.log("Member Email:", memberEmail);
    console.log("Hourly Rate:", hourlyRate);
    console.log("Password:", password);

    try {
      // Save the member details to local storage
      await AsyncStorage.setItem("memberName", memberName);
      await AsyncStorage.setItem("memberEmail", memberEmail);
      await AsyncStorage.setItem("hourlyRate", hourlyRate);
      await AsyncStorage.setItem("password", password);

      console.log("Member details saved successfully");
    } catch (error) {
      console.log("Error saving member details:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Member Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setMemberName(text)}
            value={memberName}
            placeholder="Enter member name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Member Email</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setMemberEmail(text)}
            value={memberEmail}
            placeholder="Enter member email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hourly Rate</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setHourlyRate(text)}
            value={hourlyRate}
            placeholder="Enter hourly rate"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            value={password}
            placeholder="Enter password"
          />
        </View>

        <Button title="Create Member" onPress={handleCreateMember} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    color: "#333",
  },
});

export default CreateMember;
