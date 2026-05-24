/**
 * Escalations screen — shows all pending / open escalations.
 */
import React from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_ESCALATIONS } from "../mock";
import { EscalationCard } from "../components/EscalationCard";
import type { Escalation } from "../types/api";

export function EscalationsScreen({ navigation }: any) {
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 mb-2">Escalations</Text>
        <Text className="text-sm text-gray-500">Issues that require human agent attention</Text>
      </View>

      <FlatList
        data={MOCK_ESCALATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}
        renderItem={({ item }: { item: Escalation }) => (
          <EscalationCard escalation={item} />
        )}
        ListEmptyComponent={
          <View className="py-16 items-center">
            <Text className="text-gray-400 text-sm text-center">
              No active escalations 🎉
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
