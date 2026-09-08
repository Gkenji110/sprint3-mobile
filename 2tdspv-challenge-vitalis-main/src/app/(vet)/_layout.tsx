import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text } from "react-native";

/**
 * Abas do lado do veterinário — grupo separado do `(tabs)` do tutor.
 * `ControleDeAcesso` é quem decide qual dos dois grupos a sessão atual vê.
 */
export default function VetTabLayout() {
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
            PetHub Vet
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
        name="pacientes"
        options={{
          title: "Pacientes",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="pets" size={28} color={color} />
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
