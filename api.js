import Member from "./models/MemberModel";

const BASE_URL = "http://10.51.223.234:3000/";

const fetchMembers = async () => {
  console.log(`${BASE_URL}members`);
  try {
    const response = await fetch(`${BASE_URL}members`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response);
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
      body: JSON.stringify({ userId }),
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

export { fetchMembers, deleteMember };
