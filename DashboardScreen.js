import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AppBar from "./AppBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DashboardScreen = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    retrieveTasks();
  }, []);

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const dateInFormate = new Date(date);

    return dateInFormate.toLocaleString("en-US", options);
  };

  const retrieveTasks = async () => {
    try {
      const currentUserData = await AsyncStorage.getItem("currentUser");
      const currentUser = JSON.parse(currentUserData);

      let tasksData = await AsyncStorage.getItem("tasks");

      if (tasksData !== null) {
        let tasks = JSON.parse(tasksData);

        if (!currentUser.isAdmin) {
          tasks = tasks.filter(
            (task) => task.member.email === currentUser.email
          );
        }

        setTasks(tasks);
      }
    } catch (error) {
      console.log("Error retrieving tasks:", error);
    }
  };

  const renderTaskItem = ({ item }) => {
    return (
      <View style={styles.taskItem}>
        <View style={styles.detailsContainer}>
          <Text style={styles.taskTitle}>Task ID: </Text>
          <Text style={styles.taskName}>{item.id}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.taskTitle}>Task Name: </Text>
          <Text style={styles.taskName}>{item.name}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.taskTitle}>Task Description: </Text>
          <Text style={styles.taskDescription}>{item.description}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.taskTitle}>Start Date: </Text>
          <Text style={styles.taskDates}>
            {formatDate(item.startDate) ? formatDate(item.startDate) : "N/A"}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.taskTitle}>End Date: </Text>
          <Text style={styles.taskDates}>
            {formatDate(item.endDate) ? formatDate(item.endDate) : "N/A"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>No tasks found</Text>
        ) : (
          <FlatList
            data={tasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.taskList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    padding: 20,
  },
  taskList: {
    marginLeft: 0,
    marginRight: 0,
  },
  taskItem: {
    backgroundColor: "#fff",
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    flexDirection: "column",
  },
  detailsContainer: {
    flex: 1,
    flexDirection: "row",
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: "normal",
    marginBottom: 5,
  },
  taskName: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  taskDescription: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  taskDates: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default DashboardScreen;
