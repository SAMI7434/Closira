/**
 * FollowUpsScreen — displays all follow-up notes from every enquiry.
 */
import React from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_FOLLOW_UPS, MOCK_ENQUIRIES } from "../mock";
import { FollowUpCard } from "../components/FollowUpCard";
import { STATUS_CONFIG } from "../constants";
import type { FollowUp } from "../types/api";

export function FollowUpsScreen() {
  // enrich follow-up cards with subject and status from parent enquiry
  const enriched = MOCK_FOLLOW_UPS.map((fu: FollowUp) => {
    const parent = MOCK_ENQUIRIES.find((e) => e.id === fu.enquiry_id);
    return { ...fu, _parent: parent };
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 mb-1">Follow-ups</Text>
        <Text className="text-sm text-gray-500 mb-3">Recent agent notes across all enquiries</Text>
      </View>

      <FlatList
        data={enriched}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View className="mb-3">
            {/* enquiry header */}
            {(item as any)._parent && (
              <View className="flex-row items-center mb-1">
                <Text className="text-xs font-semibold text-gray-600" numberOfLines={1}>
                  {(item as any)._parent.subject}
                </Text>
                {(item as any)._parent && (
                  <View className="ml-2 self-start rounded-full px-2 py-0.5 bg-blue-50">
                    <Text className="text-[10px] text-blue-600 font-medium">
                      {STATUS_CONFIG[(item as any)._parent.status ?? "new"]?.label ?? ""}
                    </Text>
                  </View>
                )}
              </View>
            )}
            <FollowUpCard followUp={item} />
          </View>
        )}
        ListEmptyComponent={
          <View className="py-16 items-center">
            <Text className="text-gray-400 text-sm text-center">No follow-ups yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
