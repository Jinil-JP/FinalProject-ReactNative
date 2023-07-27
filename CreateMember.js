import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { createUser } from "./api";

const CreateMember = () => {
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleCreateMember = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const userData = {
        name: memberName,
        email: memberEmail,
        password: password,
        isAdmin: false,
        hourlyRate: hourlyRate,
      };

      await createUser(userData);

      Alert.alert("Success", "Member created successfully");

      setMemberName("");
      setMemberEmail("");
      setHourlyRate("");
      setPassword("");
      setValidationError("");
    } catch (error) {
      Alert.alert("Success", "Error creating member:");
      console.log(error);
    }
  };

  const validateForm = () => {
    if (!memberName || !memberEmail || !password || !hourlyRate) {
      setValidationError("All fields are required");
      return false;
    }

    setValidationError("");
    return true;
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
            secureTextEntry
          />
        </View>

        {validationError ? (
          <Text style={styles.error}>{validationError}</Text>
        ) : null}

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
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  error: {
    color: "red",
    marginBottom: 10,
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
