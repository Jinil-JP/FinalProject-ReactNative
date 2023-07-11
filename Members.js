import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppBar from "./AppBar";

const Members = () => {
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  useEffect(() => {
    retrieveMemberDetails();
  }, []);

  const retrieveMemberDetails = async () => {
    try {
      const name = await AsyncStorage.getItem("memberName");
      const email = await AsyncStorage.getItem("memberEmail");
      const rate = await AsyncStorage.getItem("hourlyRate");

      setMemberName(name);
      setMemberEmail(email);
      setHourlyRate(rate);
    } catch (error) {
      console.log("Error retrieving member details:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.memberContainer}>
        <Text style={styles.label}>Member Name:</Text>
        <Text style={styles.memberData}>{memberName}</Text>

        <Text style={styles.label}>Member Email:</Text>
        <Text style={styles.memberData}>{memberEmail}</Text>

        <Text style={styles.label}>Hourly Rate:</Text>
        <Text style={styles.memberData}>{hourlyRate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  memberContainer: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  memberData: {
    fontSize: 16,
    marginBottom: 20,
    color: "#555",
  },
});

export default Members;
