import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Member from "./models/MemberModel";
import User from "./models/UserModel";

const CreateMember = () => {
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [password, setPassword] = useState("");
  const [memberArray, setMemberArray] = useState([]);
  const [userArray, setUserArray] = useState([]);

  useEffect(() => {
    loadMemberArray();
  }, []);

  const loadMemberArray = async () => {
    try {
      const userArrayString = await AsyncStorage.getItem("users");
      const memberArrayString = await AsyncStorage.getItem("members");

      if (userArrayString) {
        setUserArray(JSON.parse(userArrayString));
      }

      if (memberArrayString) {
        setMemberArray(JSON.parse(memberArrayString));
      }
    } catch (error) {
      console.log("Error loading member array:", error);
    }
  };

  const handleCreateMember = async () => {
    const id = memberArray.length + 1;
    const userId = userArray.length + 1;

    const newMember = new Member(
      id,
      memberName,
      memberEmail,
      hourlyRate,
      password
    );

    const newUser = new User(userId, memberEmail, password, false);

    try {
      const updatedMemberArray = [...memberArray, newMember];
      setMemberArray(updatedMemberArray);

      const updatedUserArray = [...userArray, newUser];
      setUserArray(updatedUserArray);

      await AsyncStorage.setItem("members", JSON.stringify(updatedMemberArray));
      await AsyncStorage.setItem("users", JSON.stringify(updatedUserArray));

      console.log(updatedUserArray);

      Alert.alert("Success", "Member created successfully");

      setMemberName("");
      setMemberEmail("");
      setHourlyRate("");
      setPassword("");

      console.log("Member created and saved successfully");
    } catch (error) {
      console.log("Error creating member:", error);
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
            secureTextEntry
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
