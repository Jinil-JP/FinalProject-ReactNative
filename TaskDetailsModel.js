import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const TaskDetailsModal = ({ task, closeModal }) => {
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

  return (
    <View style={styles.modalContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
        <MaterialIcons name="close" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.modalContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Task Details</Text>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>ID:</Text>
            <Text style={styles.detailText}>{task?.id}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailText}>{task?.name}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Description:</Text>
            <Text style={styles.detailText}>{task?.description}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Start Date:</Text>
            <Text style={styles.detailText}>
              {task?.startDate ? formatDate(task.startDate) : "N/A"}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>End Date:</Text>
            <Text style={styles.detailText}>
              {task?.endDate ? formatDate(task.endDate) : "N/A"}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Prerequisite</Text>
            <Text style={styles.detailText}>
              {task?.isPrerequisite ? "Yes" : "No"}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Hours Worked:</Text>
            <Text style={styles.detailText}>{task?.hoursWorked}</Text>
          </View>
          {task?.isCompleted && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Cost of Project</Text>
              <Text style={styles.detailText}>
                {task?.hoursWorked * task?.member?.hourlyRate}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Task Member Details</Text>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Member ID:</Text>
            <Text style={styles.detailText}>{task?.member?.id}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Member Name:</Text>
            <Text style={styles.detailText}>{task?.member?.name}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Member Email:</Text>
            <Text style={styles.detailText}>{task?.member?.email}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Member Hourly Rate:</Text>
            <Text style={styles.detailText}>{task?.member?.hourlyRate}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#3498db",
  },
  modalContent: {
    flex: 1,
    marginTop: 40,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: "bold",
    width: 120,
  },
  detailText: {
    flex: 1,
  },
});

export default TaskDetailsModal;
