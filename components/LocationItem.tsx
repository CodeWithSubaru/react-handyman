import { ILocations } from "@/types/interfaces.types";
import { useSQLiteContext } from "expo-sqlite";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const LocationItem = ({
  item,
  onDelete,
}: {
  item: ILocations;
  onDelete: () => void;
}) => {
  const db = useSQLiteContext();

  const handleDelete = async () => {
    await db.runAsync(`DELETE FROM locations WHERE id = ?`, item.id);
    onDelete();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.locationTitle}>{item.name}</Text>
      <TouchableOpacity onPress={handleDelete}>
        <Ionicons name="trash-outline" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};
export default LocationItem;
const styles = StyleSheet.create({
  container: {
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fefefe",
    boxShadow: "#000",
    marginInline: 12,
    borderRadius: 8,
  },
  locationTitle: {
    fontSize: 16,
    color: "#0e0e0e",
    fontWeight: "600",
  },
  icon: {
    fontSize: 20,
    color: "#0e0e0e",
  },
});
