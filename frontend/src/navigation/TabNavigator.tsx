/**
 * Bottom tab navigator — the primary navigation structure of the app.
 *
 * Tabs:
 *   Dashboard   — KPI overview + recent enquiry feed
 *   Leads       — Full list of enquiries
 *   Escalations — Active escalations requiring attention
 *   Follow-ups  — All follow-up notes
 */
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { DashboardScreen }    from "../screens/Dashboard";
import { LeadsListScreen }    from "../screens/LeadsList";
import { EscalationsScreen }  from "../screens/Escalations";
import { FollowUpsScreen }    from "../screens/FollowUps";
import { ConversationDetailScreen } from "../screens/ConversationDetail";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Tab   = createBottomTabNavigator<any>();
const Stack = createNativeStackNavigator<any>();

// ── Icons per tab label ───────────────────────────────────────────────────────
const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Dashboard:   { active: "home",     inactive: "home-outline" },
  Leads:       { active: "list",     inactive: "list-outline"   },
  Escalations: { active: "warning",  inactive: "warning-outline"},
  FollowUps:   { active: "chatbubbles", inactive: "chatbubbles-outline" },
};

/** The stack that wraps the tab navigator so we can push ConversationDetail on top. */
function TabsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabsNavigator} />
      <Stack.Screen
        name="ConversationDetail"
        component={ConversationDetailScreen}
        options={{ headerShown: true, title: "Enquiry Detail", presentation: "card" }}
      />
    </Stack.Navigator>
  );
}

/** Individual bottom-tab entries. */
function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
          paddingTop: 4,
          backgroundColor: "#ffffff",
          borderTopColor: "#e5e7eb",
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarIcon: ({ color, size, focused }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.active : icons.inactive;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard"   component={DashboardScreen}   options={{ tabBarLabel: "Home" }} />
      <Tab.Screen name="Leads"       component={LeadsListScreen}   options={{ tabBarLabel: "Leads" }} />
      <Tab.Screen name="Escalations" component={EscalationsScreen} options={{ tabBarLabel: "Escalations" }} />
      <Tab.Screen name="FollowUps"   component={FollowUpsScreen}   options={{ tabBarLabel: "Follow-ups" }} />
    </Tab.Navigator>
  );
}

export default TabsStack;
