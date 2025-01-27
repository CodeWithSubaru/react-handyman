import { Slot, useRouter } from "expo-router";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { Suspense, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import * as Notifications from "expo-notifications";

const Layout = () => {
  const router = useRouter();

  useEffect(() => {
    // removes all notification if looping happens in your notifications
    // Notifications.cancelAllScheduledNotificationsAsync().then((response) =>
    //   console.log("All Cleared")
    // );
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const url = response.notification.request.content.data?.url;

        console.log(url);
        if (url) router.push(url);
      }
    );

    return () => {
      subscription.remove();
      Notifications.cancelAllScheduledNotificationsAsync();
    };
  }, []);

  return (
    <Suspense fallback={<ActivityIndicator />}>
      <SQLiteProvider
        useSuspense
        databaseName="test.db"
        onInit={migrateDbIfNeeded}
      >
        <Slot />
      </SQLiteProvider>
    </Suspense>
  );
};

export default Layout;

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  const version = await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version");

  if (!version) return;

  let currentDbVersion = version.user_version;

  if (currentDbVersion >= DATABASE_VERSION) return;

  if (currentDbVersion >= DATABASE_VERSION) return;

  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY NOT NULL, name TEXT);
      CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, description INTEGER, isUrgent BOOLEAN DEFAULT 0, locationId INTEGER, FOREIGN KEY (locationId) REFERENCES locations(id));
  `);

    await db.runAsync("INSERT INTO locations (name) VALUES (?)", ["By"]);

    await db.runAsync(
      "INSERT INTO tasks (title, description, isUrgent, locationId) VALUES (?, ?, ?, ?)",
      ["Title1", "Long Description", 0, 1]
    );

    await db.runAsync("INSERT INTO locations (name) VALUES (?)", ["By2"]);

    await db.runAsync(
      "INSERT INTO tasks (title, description, isUrgent, locationId) VALUES (?, ?, ?, ?)",
      ["Title13", "Long Description1", 0, 2]
    );

    currentDbVersion = 1;
  }

  if (currentDbVersion === 1) {
    await db.execAsync(`
      ALTER TABLE tasks ADD COLUMN imageUri TEXT;  
    `);

    currentDbVersion = 2;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
