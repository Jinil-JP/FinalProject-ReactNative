import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AppBar from "./AppBar";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateTask = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStartDate, setTaskStartDate] = useState(new Date());
  const [taskEndDate, setTaskEndDate] = useState(new Date());
  const [memberName, setMemberName] = useState("");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [memberNames, setMemberNames] = useState([]);

  useEffect(() => {
    retrieveMemberNames();
  }, []);

  const retrieveMemberNames = async () => {
    try {
      const memberData = await AsyncStorage.getItem("members");
      if (memberData !== null) {
        const members = JSON.parse(memberData);
        const memberNames = members.map((member) => member.name);
        setMemberNames(memberNames);
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

  const handleCreateTask = () => {
    // Handle the logic to create a task with the entered details
    console.log("Task Name:", taskName);
    console.log("Task Description:", taskDescription);
    console.log("Task Start Date:", taskStartDate);
    console.log("Task End Date:", taskEndDate);
    console.log("Member Name:", memberName);

    // Reset the state values to clear the input fields
    setTaskName("");
    setTaskDescription("");
    setTaskStartDate(new Date());
    setTaskEndDate(new Date());
    setMemberName("");
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

        <Text style={styles.label}>Member Name</Text>
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={memberName}
            style={styles.dropdown}
            onValueChange={(value) => setMemberName(value)}
          >
            {memberNames.map((member, index) => (
              <Picker.Item key={index} label={member} value={member} />
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
