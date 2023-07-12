import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Task from "./models/TaskModel";

const CreateTask = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStartDate, setTaskStartDate] = useState(new Date());
  const [taskEndDate, setTaskEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedMember, setSelectedMember] = useState({});
  const [members, setMembers] = useState([]);

  useEffect(() => {
    retrieveMember();
  }, []);

  const retrieveMember = async () => {
    try {
      const memberData = await AsyncStorage.getItem("members");
      if (memberData !== null) {
        const members = JSON.parse(memberData);
        setMembers(members);
      }
    } catch (error) {
      console.log("Error retrieving member names:", error);
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || taskStartDate;
    setShowStartDatePicker(false);
    setTaskStartDate(currentDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || taskEndDate;
    setShowEndDatePicker(false);
    setTaskEndDate(currentDate);
  };

  const showStartDatePickerModal = () => {
    setShowStartDatePicker(true);
  };

  const showEndDatePickerModal = () => {
    setShowEndDatePicker(true);
  };

  const handleCreateTask = async () => {
    // Generate a unique ID for the task (you can use a library like uuid to generate IDs)
    const tasksData = await AsyncStorage.getItem("tasks");
    const tasks = JSON.parse(tasksData);

    const taskId = tasks.length + 1;

    // Create a new task object
    const newTask = new Task(
      taskId,
      taskName,
      taskDescription,
      taskStartDate,
      taskEndDate,
      false, // isCompleted
      0, // hoursWorked
      selectedMember
    );

    tasks.push(newTask);

    // Store the updated tasks array in AsyncStorage
    await AsyncStorage.setItem("tasks", JSON.stringify(tasks));

    // Reset the state values to clear the input fields
    setTaskName("");
    setTaskDescription("");
    setTaskStartDate(new Date());
    setTaskEndDate(new Date());
    setSelectedMember({});
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
          <Text style={styles.label}>Task Start Date</Text>
          <Button
            title="Select Start Date"
            onPress={showStartDatePickerModal}
          />
          {showStartDatePicker && (
            <DateTimePicker
              value={taskStartDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}
        </View>

        <View style={styles.datePickerContainer}>
          <Text style={styles.label}>Task End Date</Text>
          <Button title="Select End Date" onPress={showEndDatePickerModal} />
          {showEndDatePicker && (
            <DateTimePicker
              value={taskEndDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
        </View>

        <Text style={styles.label}>Assigned Member</Text>
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={selectedMember}
            style={styles.dropdown}
            onValueChange={(value) => setSelectedMember(value)}
          >
            {members.map((member, index) => (
              <Picker.Item
                key={index}
                label={`${member.name} (${member.email})`}
                value={member}
              />
            ))}
          </Picker>
        </View>

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
    marginBottom: 20,
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
});

export default CreateTask;
