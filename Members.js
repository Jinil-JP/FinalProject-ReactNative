import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AppBar from "./AppBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Members = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    retrieveMemberDetails();
  }, []);

  const retrieveMemberDetails = async () => {
    try {
      const memberData = await AsyncStorage.getItem("members");
      if (memberData !== null) {
        const parsedMembers = JSON.parse(memberData);
        setMembers(parsedMembers);
      }
    } catch (error) {
      console.log("Error retrieving member details:", error);
    }
  };

  const handleDeleteMember = async (email) => {
    try {
      const updatedMembers = members.filter((member) => member.email !== email);
      setMembers(updatedMembers);
      await AsyncStorage.setItem("members", JSON.stringify(updatedMembers));
    } catch (error) {
      console.log("Error deleting member:", error);
    }
  };

  const renderMemberItem = ({ item }) => {
    const handleDeleteMember = async () => {
      try {
        const updatedMembers = members.filter(
          (member) => member.email !== item.email
        );
        setMembers(updatedMembers);
        await AsyncStorage.setItem("members", JSON.stringify(updatedMembers));
      } catch (error) {
        console.log("Error deleting member:", error);
      }
    };

    return (
      <View style={styles.memberItem}>
        <View style={styles.memberDetailsContainer}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberEmail}>{item.email}</Text>
          <Text style={styles.memberRate}>Hourly Rate: {item.hourlyRate}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteMember}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {members.length > 0 ? (
        <FlatList
          data={members}
          renderItem={renderMemberItem}
          keyExtractor={(item) => item.email}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyText}>No members found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  listContainer: {
    padding: 20,
  },
  memberItem: {
    backgroundColor: "#fff",
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  memberDetailsContainer: {
    flex: 1,
    flexDirection: "column",
  },
  memberName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  memberEmail: {
    fontSize: 14,
    marginBottom: 5,
  },
  memberRate: {
    fontSize: 14,
    color: "#888",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default Members;
