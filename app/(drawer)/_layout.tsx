import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { useSQLiteContext } from "expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { usePathname, useRouter } from "expo-router";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { Text, View, Image, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { ILocations } from "@/types/interfaces.types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "@/assets/images/logo.jpg";

const LOGO_IMAGE = Image.resolveAssetSource(Logo).uri;

const CustomDrawer = (props: any) => {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const db = useSQLiteContext();
  const [locations, setLocations] = useState<ILocations[]>([]);
  const isDrawerOpen = useDrawerStatus() === "open";
  const pathname = usePathname();

  useEffect(() => {
    if (isDrawerOpen) loadLocation();
  }, [isDrawerOpen]);

  const loadLocation = async () => {
    const locations = await db.getAllAsync<ILocations>(
      `SELECT * FROM locations`
    );

    setLocations(locations);
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView>
        <Image source={{ uri: LOGO_IMAGE }} style={styles.imageLogo} />
        <DrawerItemList
          {...props}
          state={{
            ...props.state,
            routes: props.state.routes.filter(
              (route: { name: string }) => !route.name.startsWith("locations")
            ),
          }}
        />
        <Text>Location</Text>
        {locations.map((location) => {
          const isActive = pathname === `/location/${location.id}`;

          return (
            <DrawerItem
              key={location.id}
              label={location.name}
              onPress={() => router.navigate(`/location/${location.id}`)}
              focused={isActive}
              activeTintColor="#f2a310"
              inactiveTintColor="#000"
            />
          );
        })}
      </DrawerContentScrollView>
      <View
        style={{
          paddingBottom: 20 + bottom,
          borderTopWidth: 1,
          borderTopColor: "#dde3fe",
          padding: 16,
        }}
      >
        <Text>Copyright Sample 2024</Text>
      </View>
    </View>
  );
};

export default function Layout() {
  const db = useSQLiteContext();

  useDrizzleStudio(db);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawer}
        screenOptions={{
          // full screen and active link hover
          drawerHideStatusBarOnOpen: true,
          drawerActiveTintColor: "#f2a310",
          headerTintColor: "#000",
          drawerContentContainerStyle: {
            backgroundColor: "#fff",
          },
          drawerItemStyle: {
            borderRadius: 8,
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Home",
            drawerLabel: "Home",
          }}
        />
        <Drawer.Screen
          name="location"
          options={{
            title: "Location",
            drawerLabel: "Location",
            drawerItemStyle: { display: "none" },
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  imageLogo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {},
});
