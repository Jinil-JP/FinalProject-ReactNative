import Member from "./models/MemberModel";
import Task from "./models/TaskModel";
import { Alert } from "react-native";

// const BASE_URL = "http://10.51.223.234:3000/";
const BASE_URL = "http://192.168.2.14:3000/";

const createUser = async (userData) => {
  try {
    const CREATE_USER_URL = `${BASE_URL}create_user`;
    const response = await fetch(CREATE_USER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to create user.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};

const login = async (email, password) => {
  try {
    const LOGIN_URL = `${BASE_URL}login`;
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    console.log(data);
    if (response.status === 200) {
      return new Member(
        data.userId,
        data.name,
        data.email,
        data.hourlyRate,
        data.password,
        data.isAdmin
      );
    } else {
      console.error("Error Failure user:", error.message);
    }
  } catch (error) {
    console.log("Error during login:", error);
  }
};

const fetchMembers = async () => {
  try {
    const response = await fetch(`${BASE_URL}members`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch members from the API.");
    }

    const data = await response.json();

    const membersArray = data.map(
      (memberData) =>
        new Member(
          memberData.userId,
          memberData.name,
          memberData.email,
          memberData.hourlyRate,
          memberData.password
        )
    );

    return membersArray;
  } catch (error) {
    console.log("Error fetching members:", error);
    return [];
  }
};

const deleteMember = async (userId) => {
  try {
    const DELETE_URL = `${BASE_URL}delete_member`;
    const response = await fetch(DELETE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete member from the API.");
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error deleting member:", error.message);
    throw error;
  }
};

const createTask = async (taskData) => {
  try {
    const CREATE_TASK_URL = `${BASE_URL}create_task`;
    const response = await fetch(CREATE_TASK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error("Failed to create task.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating task:", error.message);
    throw error;
  }
};

const fetchTasks = async (currentUserId) => {
  try {
    const TASKS_URL = `${BASE_URL}tasks`;
    const response = await fetch(TASKS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentUserId }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tasks from the API.");
    }

    const tasksWithSelectedMember = await response.json();

    const tasksArray = tasksWithSelectedMember.map((taskData) => {
      return new Task(
        taskData.taskId,
        taskData.name,
        taskData.description,
        taskData.startDate,
        taskData.endDate,
        taskData.isStarted,
        taskData.isCompleted,
        taskData.isPrerequisite,
        taskData.hoursWorked,
        new Member(
          taskData.selectedMember.userId,
          taskData.selectedMember.name,
          taskData.selectedMember.email,
          taskData.selectedMember.hourlyRate,
          taskData.selectedMember.password,
          taskData.selectedMember.isAdmin
        ),
        taskData.taskStartTime,
        taskData.taskEndTime
      );
    });

    return tasksArray;
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    throw error;
  }
};

const deleteTask = async (taskId) => {
  try {
    const DELETE_URL = `${BASE_URL}delete_task`;
    const response = await fetch(DELETE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: taskId }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete task from the API.");
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error deleting task:", error.message);
    throw error;
  }
};

const startTask = async (taskId) => {
  try {
    const START_URL = `${BASE_URL}start_task`;
    const response = await fetch(START_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId: taskId,
      }),
    });

    if (!response.ok) {
      console.log("error");
      const data = await response.json();
      Alert.alert("Error", data.error);
      return;
    }
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.log("error catch");
    throw error;
  }
};

const completeTask = async (taskId, currentUserId) => {
  try {
    const COMPLETE_URL = `${BASE_URL}complete_task`;
    const response = await fetch(COMPLETE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId: taskId,
        currentUserId: currentUserId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete task from the API.");
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    throw error;
  }
};

const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Something went wrong");
  }
  return response.json();
};

export {
  createUser,
  login,
  fetchTasks,
  fetchMembers,
  deleteMember,
  createTask,
  startTask,
  completeTask,
  deleteTask,
};
