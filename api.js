import Member from "./models/MemberModel";
import Task from "./models/TaskModel";

const BASE_URL = "http://10.51.223.234:3000/";

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
    return data; // The response from the server (user data without password)
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
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
    return data; // The response from the server (created task data)
  } catch (error) {
    console.error("Error creating task:", error.message);
    throw error;
  }
};

const fetchTasks = async (currentUserId) => {
  try {
    const TASKS_URL = `${BASE_URL}tasks`;
    console.log(TASKS_URL);
    const response = await fetch(TASKS_URL, {
      method: "POST", // Keep the method as POST
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentUserId }), // Pass currentUserId as the body parameter
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tasks from the API.");
    }

    const tasksWithSelectedMember = await response.json();

    const tasksArray = tasksWithSelectedMember.map(
      (taskData) =>
        new Task(
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
            taskData.selectedMember.password
          ),
          taskData.taskStartTime,
          taskData.taskEndTime
        )
    );

    console.log("tasksArray");
    console.log(tasksArray);
    console.log("tasksArray");
    return tasksArray;
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    throw error;
  }
};

export { createUser, fetchTasks, fetchMembers, deleteMember, createTask };
