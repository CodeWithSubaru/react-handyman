import { ITasks } from "@/types/interfaces.types";
import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TasksItem = ({ item }: { item: ITasks }) => {
  return (
    <Link
      href={`/location/${item.locationId.toString()}/new-tasks?taskId=${item.id.toString()}`}
      asChild
    >
      <TouchableOpacity>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Text>{item.isUrgent ? "⚠" : "○"}</Text>
          </View>
          <View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
export default TasksItem;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    gap: 16,
  },
  iconContainer: { justifyContent: "center" },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    color: "#707070",
    fontSize: 14,
  },
});
