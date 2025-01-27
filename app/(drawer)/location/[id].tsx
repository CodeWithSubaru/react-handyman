import TasksItem from "@/components/TasksItem";
import { ILocations, ITasks } from "@/types/interfaces.types";
import { Link, Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const Page = () => {
  const { id } = useLocalSearchParams();
  const db = useSQLiteContext();
  const [tasks, setTasks] = useState<ITasks[]>([]);
  const [locationName, setLocationName] = useState("");

  const loadLocation = useCallback(async () => {
    const [location] = await db.getAllAsync<ILocations>(
      `SELECT * FROM locations WHERE id = ?`,
      Number(id)
    );

    if (location) {
      setLocationName(location.name);
    }
    const tasks = await db.getAllAsync<ITasks>(
      `SELECT * FROM tasks WHERE locationId = ?`,
      +location.id
    );

    setTasks(tasks);
  }, [id, db]);

  useFocusEffect(
    useCallback(() => {
      loadLocation();
    }, [loadLocation])
  );

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: locationName || "Tasks" }} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TasksItem item={item} />}
        ListEmptyComponent={
          <Text style={styles.emptyTask}>No Task added yet...</Text>
        }
      />

      <Link href={`/location/${id}/new-tasks`} asChild>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};
export default Page;
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#f2a310",
    borderRadius: "100%",
  },
  fabText: {
    color: "#fff",
    fontSize: 24,
  },
  emptyTask: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: "center",
    marginTop: 24,
  },
});
