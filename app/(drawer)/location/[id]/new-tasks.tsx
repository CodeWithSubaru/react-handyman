import { ITasks } from "@/types/interfaces.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView, Switch } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Page = () => {
  const { id: locationId, taskId } = useLocalSearchParams();

  const router = useRouter();
  const db = useSQLiteContext();

  const [task, setTask] = useState<
    Pick<ITasks, "title" | "description" | "isUrgent" | "imageUri">
  >({
    title: "",
    description: "",
    imageUri: null,
    isUrgent: false,
  });

  useEffect(() => {
    if (taskId) {
      loadTask();
    }

    Notifications.requestPermissionsAsync();
  }, [taskId]);

  // for updating data
  const loadTask = async () => {
    const task = await db.getFirstAsync<ITasks>(
      "SELECT * FROM tasks WHERE id = ?",
      +taskId
    );

    if (!task) return;

    setTask({ ...task });
  };

  // update and create data
  const handleSaveTask = async () => {
    let newTaskId = +taskId;

    // CREATE
    if (!taskId) {
      const response = await db.runAsync(
        "INSERT INTO tasks (title, description, isUrgent, imageUri, locationId) VALUES (?, ?, ?, ?, ?)",
        [
          task.title,
          task.description,
          task.isUrgent ? 1 : 0,
          task.imageUri,
          +locationId,
        ]
      );
      newTaskId = response.lastInsertRowId;
    } else {
      // UPDATE
      await db.runAsync(
        "UPDATE tasks SET title = ?, description = ?, isUrgent = ?, imageUri = ? WHERE id = ?",
        [
          task.title,
          task.description,
          task.isUrgent ? 1 : 0,
          task.imageUri,
          +taskId,
        ]
      );
    }

    if (task.isUrgent) {
      scheduleNotifications(newTaskId, task.title);
    }

    router.back();
  };

  // confirming the action by the user
  const handleFinishTask = async () => {
    Alert.alert(
      "Finish Task",
      "Are you sure you want to finish this task, it will delete to the database?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Finish",
          onPress: async () => {
            await db.runAsync("DELETE FROM tasks WHERE id = ? ", +taskId);
            router.back();
          },
        },
      ]
    );
  };

  // can be use as a hook
  const handleChangeText = (name: string) => (text: string | boolean) =>
    setTask({ ...task, [name]: text });

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setTask((prev) => ({ ...prev, imageUri: result.assets[0].uri }));
    }
  };

  const scheduleNotifications = async (taskId: number, title: string) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Urgent Task",
        body: `Urgent Task: ${title}`,
        data: { url: `/location/${locationId}/new-tasks?taskId=${taskId}` },
      },
      trigger: {
        seconds: 10,
      },
    });
  };

  return (
    <ScrollView>
      <TextInput
        style={styles.textInput}
        value={task.title}
        placeholder="Title"
        onChangeText={handleChangeText("title")}
      />
      <TextInput
        style={[styles.textInput, styles.multiline]}
        value={task.description}
        placeholder="Description"
        onChangeText={handleChangeText("description")}
        multiline
      />

      <View style={[styles.textInput, styles.row]}>
        <Text>Urgent</Text>
        <Switch
          value={!!task.isUrgent}
          onValueChange={handleChangeText("isUrgent")}
          trackColor={{ true: "#f2a310", false: "#767577" }}
          thumbColor={"#fff"}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePickImage}>
        <Text style={styles.buttonText}>
          {!taskId ? "Create Image" : "Update Image"}
        </Text>
      </TouchableOpacity>

      {task.imageUri && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: task.imageUri ?? undefined }}
            style={styles.image}
          />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSaveTask}>
        <Text style={styles.buttonText}>
          {!taskId ? "Create Tasks" : "Update Tasks"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleFinishTask}>
        <Text style={styles.buttonText}>{"Finish Task"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    margin: 8,
    borderRadius: 8,
    marginBlock: 14,
  },
  multiline: {
    height: 180,
    verticalAlign: "top",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#f2a310",
    paddingBlock: 14,
    borderRadius: 8,
    fontSize: 16,
    textAlign: "center",
    alignItems: "center",
    margin: 8,
  },
  buttonText: {
    color: "#fff",
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: 0.8,
  },
  imageContainer: {
    height: 200,
    margin: 16,
  },
  image: {
    height: 200,
    width: "100%",
    resizeMode: "cover",
  },
});
