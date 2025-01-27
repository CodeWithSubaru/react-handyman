import { FormEvent, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LocationForm = ({ onSubmit }: { onSubmit: (name: string) => void }) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name);
    }
    setName("");
  };
  return (
    <View style={styles.container}>
      <TextInput style={styles.textInput} value={name} onChangeText={setName} />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Location</Text>
      </TouchableOpacity>
    </View>
  );
};
export default LocationForm;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fefefe",
    padding: 12,
    margin: 14,
    borderRadius: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 8,
    margin: 8,
    borderRadius: 8,
    marginTop: 14,
    marginBottom: 18,
  },
  button: {
    backgroundColor: "#000",
    paddingInline: 8,
    paddingBlock: 12,
    borderRadius: 8,
    marginInline: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
