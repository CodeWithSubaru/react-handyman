import { DrawerToggleButton } from "@react-navigation/drawer";
import { Stack } from "expo-router";
import { View } from "react-native";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerLeft: () => (
            <View
              style={{
                marginLeft: -16,
                marginRight: 4,
              }}
            >
              <DrawerToggleButton tintColor="#000" />
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="[id]/new-tasks"
        options={{
          title: "New Tasks",
        }}
      />
    </Stack>
  );
};
export default Layout;
