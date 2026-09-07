import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#02C39A",
        tabBarStyle: {
          backgroundColor: "#f4f7f5",
          borderTopWidth: 1,
          borderTopColor: "rgba(0,0,0,0.05)",
          height: 80,
          paddingBottom: 20,
        },
        headerTitle: () => (
          <Text className="text-2xl font-black tracking-tighter text-on-surface uppercase font-headline">
            PetHub
          </Text>
        ),
        headerStyle: {
          backgroundColor: "#f4f7f5",
          height: 50,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: "Pets",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="pets" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendario"
        options={{
          title: "Calendário",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="calendar-today" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="consultas"
        options={{
          title: "Consultas",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="medical-services" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person-outline" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}