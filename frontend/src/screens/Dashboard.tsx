/**
 * Dashboard screen — shows KPI summary cards on first load.
 */
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_ENQUIRIES } from "../mock";
import { StatsCard } from "../components/StatsCard";
import { LeadCard } from "../components/LeadCard";
import type { Enquiry } from "../types/api";

export function DashboardScreen({ navigation }: any) {
  const [refreshing, setRefreshing] = useState(false);
  const enquiries = MOCK_ENQUIRIES;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const stats = {
    total:      enquiries.length,
    new:        enquiries.filter((e) => e.status === "new").length,
    escalated: enquiries.filter((e) => e.status === "escalated").length,
    resolved:  enquiries.filter((e) => e.status === "resolved").length,
  };

  const totalSuggested = enquiries.filter((e) => e.suggested_response !== null).length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
        }
      >
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-2xl font-bold text-gray-900">Dashboard</Text>
          <Text className="text-sm text-gray-500 mt-0.5">Closira Enquiry Overview</Text>
        </View>

        {/* KPI Row — horizontal scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-3">
          <StatsCard label="Total Enquiries" value={stats.total} />
          <StatsCard label="New"           value={stats.new}   colorClass="text-blue-600"   />
          <StatsCard label="Escalated"     value={stats.escalated} colorClass="text-red-600"      />
          <StatsCard label="Resolved"      value={stats.resolved}  colorClass="text-emerald-600" />
          <StatsCard label="With Suggestion" value={totalSuggested} colorClass="text-amber-600" />
        </ScrollView>

        {/* Latest Enquiries */}
        <View className="px-4 py-2">
          <Text className="text-base font-semibold text-gray-800 mb-3">Latest Enquiries</Text>
          {enquiries.slice(0, 4).map((enquiry: Enquiry) => (
            <LeadCard
              key={enquiry.id}
              enquiry={enquiry}
              onPress={(e) =>
                navigation.navigate("ConversationDetail", { enquiry: e })
              }
            />
          ))}
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
