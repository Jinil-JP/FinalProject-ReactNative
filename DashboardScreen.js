import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import TaskDetailsModel from "./TaskDetailsModel";
import { fetchTasks } from "./api";

const DashboardScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  useEffect(() => {
    retrieveLoggedUser();
  }, []);

  useEffect(() => {
    if (loggedUser) {
      retrieveTasks();
    }
  }, [loggedUser]);

  const retrieveLoggedUser = async () => {
    try {
      const loggedUserData = await AsyncStorage.getItem("currentUser");
      if (loggedUserData) {
        setLoggedUser(JSON.parse(loggedUserData));
      }
    } catch (error) {
      console.log("Error retrieving current user:", error);
    }
  };

  const retrieveTasks = async () => {
    try {
      const currentUserId = 6;
      const tasksData = await fetchTasks(currentUserId);
      setTasks(tasksData);
    } catch (error) {
      console.log("Error retrieving tasks:", error);
    }
  };

  const handleTaskItemPress = (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const renderTaskItem = ({ item }) => {
    const isAdmin = loggedUser && loggedUser.isAdmin;

    const handleDelete = (taskId) => {
      Alert.alert(
        "Confirmation",
        "Are you sure you want to delete this task?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deleteTask(taskId),
          },
        ]
      );
    };

    const handleStartTask = (taskId) => {
      Alert.alert("Confirmation", "Are you sure you want to start this task?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start",
          onPress: () => {
            startTask(taskId);
          },
        },
      ]);
    };

    const handleCompleteTask = (taskId) => {
      Alert.alert(
        "Confirmation",
        "Are you sure you want to complete this task?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Complete",
            onPress: () => completeTask(taskId),
          },
        ]
      );
    };

    const handleTaskItemPress = (taskId) => {
      const task = tasks.find((task) => task.id === taskId);
      setSelectedTask(task);
      setIsModalVisible(true);
    };

    const deleteTask = async (taskId) => {
      try {
        let tasksData = await AsyncStorage.getItem("tasks");
        if (tasksData !== null) {
          let tasks = JSON.parse(tasksData);
          tasks = tasks.filter((task) => task.id !== taskId);
          await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
        }

        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      } catch (error) {
        console.log("Error deleting task:", error);
      }
    };

    const startTask = async (taskId) => {
      try {
        if (item.isPrerequisite) {
          const pendingTask = tasks.filter(
            (task) =>
              task.member.id === loggedUser.id &&
              task.isStarted &&
              !task.isCompleted
          );

          if (pendingTask.length > 0) {
            Alert.alert(
              "Tasks Pending",
              "You cannot start this prerequisite task as there are pending tasks."
            );
            return;
          }
        }

        const startTime = new Date();

        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                isStarted: true,
                taskStartTime: startTime,
              };
            }
            return task;
          })
        );

        let tasksData = await AsyncStorage.getItem("tasks");
        if (tasksData !== null) {
          let tasks = JSON.parse(tasksData);
          tasks = tasks.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                isStarted: true,
                taskStartTime: startTime,
              };
            }
            return task;
          });
          await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
        }
      } catch (error) {
        console.log("Error starting task:", error);
      }
    };

    const completeTask = async (taskId) => {
      try {
        const endTime = new Date();
        const startTime = item.taskStartTime
          ? new Date(item.taskStartTime)
          : new Date();

        const hoursWorked = Math.abs(endTime - startTime) / 36e5;

        const cost = hoursWorked * item.member.hourlyRate;

        let tasksData = await AsyncStorage.getItem("tasks");
        if (tasksData !== null) {
          let tasks = JSON.parse(tasksData);
          tasks = tasks.map((task) => {
            if (task.id === taskId) {
              task.isCompleted = true;
              task.taskStartTime = startTime;
              task.taskEndTime = endTime;
              task.hoursWorked = hoursWorked;
              task.cost = cost;
            }
            return task;
          });
          await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
        }

        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                isCompleted: true,
                taskStartTime: startTime,
                taskEndTime: endTime,
                hoursWorked,
                cost,
              };
            }
            return task;
          })
        );

        const completedTask = tasks.find((task) => task.id === taskId);
      } catch (error) {
        console.log("Error completing task:", error);
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => handleTaskItemPress(item.taskId)}
      >
        <View style={styles.taskItem}>
          {item.isPrerequisite && (
            <View style={styles.prerequisiteIconContainer}>
              <MaterialIcons name="label" size={24} color="#3498db" />
            </View>
          )}

          <View style={styles.detailsContainer}>
            <Text style={styles.taskTitle}>Task ID:</Text>
            <Text style={styles.taskName}>{item.taskId}</Text>
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

          {isAdmin && !item.isCompleted ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleDelete(item.taskId)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleCompleteTask(item.taskId)}
              >
                <Text style={styles.buttonText}>Complete Task</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              {!item.isCompleted && !item.isStarted && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleStartTask(item.taskId)}
                >
                  <Text style={styles.buttonText}>Start Task</Text>
                </TouchableOpacity>
              )}

              {!item.isCompleted && item.isStarted && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleCompleteTask(item.taskId)}
                >
                  <Text style={styles.buttonText}>Complete Task</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
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
            keyExtractor={(item) => item.taskId.toString()}
            contentContainerStyle={styles.taskList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <Modal visible={isModalVisible} animationType="slide">
        <TaskDetailsModel task={selectedTask} closeModal={closeModal} />
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#3498db",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default DashboardScreen;
