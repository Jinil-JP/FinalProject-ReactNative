import React from "react";
import { View, Text } from "react-native";

const TaskDetailsScreen = ({ route }) => {
  // Extract the task data from the route params
  const { task } = route.params;

  // Render the task details
  return (
    <View>
      <Text>Task ID: {task.id}</Text>
      <Text>Task Name: {task.name}</Text>
      <Text>Task Description: {task.description}</Text>
      {/* Display other task details */}
    </View>
  );
};

export default TaskDetailsScreen;
