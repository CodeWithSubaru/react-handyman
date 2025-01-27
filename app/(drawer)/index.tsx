import LocationForm from "@/components/LocationForm";
import LocationItem from "@/components/LocationItem";
import { type ILocations } from "@/types/interfaces.types";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const Page = () => {
  const db = useSQLiteContext();
  const [locations, setLocations] = useState<ILocations[]>([]);

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    const locations = await db.getAllAsync<ILocations>(
      `SELECT * FROM locations`
    );

    setLocations(locations);
  };

  const addLocation = async (name: ILocations["name"]) => {
    await db.runAsync(`INSERT INTO locations (name) VALUES (?)`, name);
    loadLocation();
  };

  return (
    <View>
      <LocationForm onSubmit={addLocation} />

      <FlatList
        data={locations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <LocationItem item={item} onDelete={loadLocation} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No location added yet...</Text>
        }
      />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyText: {
    marginTop: 28,
    textAlign: "center",
    fontSize: 18,
  },
});
