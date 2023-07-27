import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Switch,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import { fetchMembers, createTask } from "./api";

const CreateTask = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStartDate, setTaskStartDate] = useState(null);
  const [taskEndDate, setTaskEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const [members, setMembers] = useState([]);
  const [validationError, setValidationError] = useState("");
  const [isPrerequisite, setIsPrerequisite] = useState(false);

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    return date.toLocaleString("en-US", options);
  };

  useEffect(() => {
    retrieveMembersData();
  }, []);

  const retrieveMembersData = async () => {
    const membersData = await fetchMembers();
    setMembers(membersData);
  };

  const handleStartDateChange = (selectedDate) => {
    if (selectedDate) {
      setTaskStartDate(selectedDate);
    }
    setShowStartDatePicker(false);
  };

  const handleEndDateChange = (selectedDate) => {
    if (selectedDate) {
      setTaskEndDate(selectedDate);
    }
    setShowEndDatePicker(false);
  };

  const showStartDatePickerModal = () => {
    setShowStartDatePicker(true);
  };

  const showEndDatePickerModal = () => {
    setShowEndDatePicker(true);
  };

  const validateForm = () => {
    if (
      !taskName ||
      !taskDescription ||
      !taskStartDate ||
      !taskEndDate ||
      !selectedMember
    ) {
      setValidationError("All fields are required");
      return false;
    }

    if (taskStartDate > taskEndDate) {
      setValidationError("Start date cannot be greater than end date");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleCreateTask = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const taskData = {
        name: taskName,
        description: taskDescription,
        startDate: taskStartDate,
        endDate: taskEndDate,
        isStarted: false,
        isCompleted: false,
        isPrerequisite: isPrerequisite,
        selectedMemberId: selectedMember.userId,
      };

      await createTask(taskData);

      Alert.alert("Success", "Task created successfully");

      setTaskName("");
      setTaskDescription("");
      setTaskStartDate(null);
      setTaskEndDate(null);
      setSelectedMember("");
      setIsPrerequisite(false);
      setValidationError("");
    } catch (error) {
      Alert.alert("Success", "Error creating task:");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Task Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setTaskName(text)}
          value={taskName}
          placeholder="Enter task name"
        />

        <Text style={styles.label}>Task Description</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setTaskDescription(text)}
          value={taskDescription}
          placeholder="Enter task description"
        />

        <View style={styles.datePickerContainer}>
          <Text style={styles.label}>Task Start Date and Time</Text>
          <TextInput
            style={styles.input}
            onFocus={showStartDatePickerModal}
            value={taskStartDate ? formatDate(taskStartDate) : ""}
            placeholder="Select start date and time"
          />
          <DateTimePickerModal
            isVisible={showStartDatePicker}
            mode="datetime"
            onConfirm={handleStartDateChange}
            onCancel={() => setShowStartDatePicker(false)}
          />
        </View>

        <View style={styles.datePickerContainer}>
          <Text style={styles.label}>Task End Date and Time</Text>
          <TextInput
            style={styles.input}
            onFocus={showEndDatePickerModal}
            value={taskEndDate ? formatDate(taskEndDate) : ""}
            placeholder="Select end date and time"
          />
          <DateTimePickerModal
            isVisible={showEndDatePicker}
            mode="datetime"
            onConfirm={handleEndDateChange}
            onCancel={() => setShowEndDatePicker(false)}
          />
        </View>

        <Text style={styles.label}>Assigned Member</Text>
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={selectedMember}
            style={styles.dropdown}
            onValueChange={(value) => setSelectedMember(value)}
          >
            <Picker.Item label="Select a member" value="" />
            {members.map((member, index) => (
              <Picker.Item
                key={index}
                label={`${member.name} (${member.email})`}
                value={member}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.rowContainer}>
          <Text style={[styles.label, styles.prerequisiteLabel]}>
            Prerequisite
          </Text>
          <Switch
            value={isPrerequisite}
            onValueChange={(value) => setIsPrerequisite(value)}
            trackColor={{ false: "#f1f1f1", true: "#3498db" }}
            thumbColor={isPrerequisite ? "#3498db" : "#f1f1f1"}
          />
        </View>

        {validationError ? (
          <Text style={styles.error}>{validationError}</Text>
        ) : null}

        <View style={styles.buttonContainer}>
          <Button title="Create Task" onPress={handleCreateTask} />
        </View>
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
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
  datePickerContainer: {
    marginBottom: 10,
  },
  dropdownContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: "center",
  },
  dropdown: {
    height: 40,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  prerequisiteLabel: {
    flex: 1,
    fontWeight: "bold",
  },
});

export default CreateTask;
