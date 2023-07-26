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
          memberData._id,
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

export { fetchMembers };
