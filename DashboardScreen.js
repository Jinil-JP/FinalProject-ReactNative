import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AppBar from "./AppBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

const DashboardScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    retrieveCurrentUser();
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

    const dateInFormat = new Date(date);

    return dateInFormat.toLocaleString("en-US", options);
  };

  const retrieveCurrentUser = async () => {
    try {
      const currentUserData = await AsyncStorage.getItem("currentUser");

      if (currentUserData) {
        setCurrentUser(JSON.parse(currentUserData));
      }
    } catch (error) {
      console.log("Error retrieving current user:", error);
    }
  };

  const retrieveTasks = async () => {
    try {
      let tasksData = await AsyncStorage.getItem("tasks");

      if (tasksData !== null) {
        let tasks = JSON.parse(tasksData);

        if (currentUser && !currentUser.isAdmin) {
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
    const isAdmin = currentUser && currentUser.isAdmin;

    const handleDelete = async (taskId) => {
      try {
        // Remove the task from AsyncStorage
        let tasksData = await AsyncStorage.getItem("tasks");
        if (tasksData !== null) {
          let tasks = JSON.parse(tasksData);
          tasks = tasks.filter((task) => task.id !== taskId);
          await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
        }

        // Update the tasks state to reflect the changes
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      } catch (error) {
        console.log("Error deleting task:", error);
      }
    };

    const handleStartTask = async (taskId) => {
      try {
        // Update the isStarted property of the task in AsyncStorage
        let tasksData = await AsyncStorage.getItem("tasks");
        if (tasksData !== null) {
          let tasks = JSON.parse(tasksData);
          tasks = tasks.map((task) => {
            if (task.id === taskId) {
              task.isStarted = true;
            }
            return task;
          });
          await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
        }

        // Update the tasks state to reflect the changes
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, isStarted: true };
            }
            return task;
          })
        );
      } catch (error) {
        console.log("Error starting task:", error);
      }
    };

    const handleCompleteTask = async (taskId) => {
      try {
        // Update the isCompleted property of the task in AsyncStorage
        let tasksData = await AsyncStorage.getItem("tasks");
        if (tasksData !== null) {
          let tasks = JSON.parse(tasksData);
          tasks = tasks.map((task) => {
            if (task.id === taskId) {
              task.isCompleted = true;
            }
            return task;
          });
          await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
        }

        // Update the tasks state to reflect the changes
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, isCompleted: true };
            }
            return task;
          })
        );
      } catch (error) {
        console.log("Error completing task:", error);
      }
    };

    return (
      <View style={styles.taskItem}>
        <View style={styles.detailsContainer}>
          <Text style={styles.taskTitle}>Task ID:</Text>
          <Text style={styles.taskName}>{item.id}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.taskTitle}>Task Name:</Text>
          <Text style={styles.taskName}>{item.name}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.taskTitle}>Task Description:</Text>
          <Text style={styles.taskDescription}>{item.description}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.taskTitle}>Start Date:</Text>
          <Text style={styles.taskDates}>
            {formatDate(item.startDate) ? formatDate(item.startDate) : "N/A"}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.taskTitle}>End Date:</Text>
          <Text style={styles.taskDates}>
            {formatDate(item.endDate) ? formatDate(item.endDate) : "N/A"}
          </Text>
        </View>

        {item.isPrerequisite && (
          <View style={styles.prerequisiteIconContainer}>
            <MaterialIcons name="label" size={24} color="#3498db" />
          </View>
        )}

        {isAdmin ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleCompleteTask(item.id)}
            >
              <Text style={styles.buttonText}>Complete Task</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleStartTask(item.id)}
            >
              <Text style={styles.buttonText}>Start Task</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleCompleteTask(item.id)}
            >
              <Text style={styles.buttonText}>Complete Task</Text>
            </TouchableOpacity>
          </View>
        )}
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  button: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: "#3498db",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  prerequisiteIconContainer: {
    position: "absolute",
    top: 5,
    right: 5,
  },
});

export default DashboardScreen;
