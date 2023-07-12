import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  DrawerLayoutAndroid,
  TouchableOpacity,
} from "react-native";
import Members from "./Members";
import CreateTask from "./CreateTask";
import CreateMember from "./CreateMember";
import AppBar from "./AppBar";
import DashboardScreen from "./DashboardScreen";

const DrawerMenuScreen = ({ handleLogout, currentUser }) => {
  const [selectedOption, setSelectedOption] = React.useState("");
  const drawerRef = React.useRef(null);

  const openDrawer = () => {
    drawerRef.current.openDrawer();
  };

  const closeDrawer = () => {
    drawerRef.current.closeDrawer();
  };

  const onMenuPress = (menu) => {
    closeDrawer();

    switch (menu) {
      case "dashboard":
        setSelectedOption("dashboard");
        break;
      case "member":
        setSelectedOption("member");
        break;
      case "createTask":
        setSelectedOption("createTask");
        break;
      case "createMember":
        setSelectedOption("createMember");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  const navigationView = (
    <View style={styles.drawerContainer}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => onMenuPress("dashboard")}
      >
        <Text style={styles.menuItemText}>Dashboard</Text>
      </TouchableOpacity>

      {currentUser && currentUser.isAdmin && (
        <>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => onMenuPress("member")}
          >
            <Text style={styles.menuItemText}>Member</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => onMenuPress("createTask")}
          >
            <Text style={styles.menuItemText}>Create Task</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => onMenuPress("createMember")}
          >
            <Text style={styles.menuItemText}>Create Member</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => onMenuPress("logout")}
      >
        <Text style={styles.menuItemText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  const renderScreen = () => {
    switch (selectedOption) {
      case "dashboard":
        return <DashboardScreen />;
      case "member":
        return <Members />;
      case "createTask":
        return <CreateTask />;
      case "createMember":
        return <CreateMember />;
      case "logout":
        // Handle logout and navigate to login screen
        setSelectedOption("");
        // Perform any necessary logout actions and navigate to the login screen
        break;
      default:
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Dashboard!</Text>
          </View>
        );
    }
  };

  const getNavigationTitle = () => {
    switch (selectedOption) {
      case "dashboard":
        return "Dashboard";
      case "member":
        return "Members";
      case "createTask":
        return "Create Task";
      case "createMember":
        return "Create Member";
      case "logout":
        return "Logout";
      default:
        return "Dashboard";
    }
  };

  if (!currentUser) {
    return null; // or render a loading screen or error message
  }

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={250}
      drawerPosition="left"
      renderNavigationView={() => navigationView}
    >
      <AppBar title={getNavigationTitle()} onMenuPress={openDrawer} />
      {renderScreen()}
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  menuItem: {
    marginBottom: 20,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default DrawerMenuScreen;
