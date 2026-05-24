/**
 * LeadsList screen — full list of all enquiries with search/filter.
 */
import React, { useState, useMemo } from "react";
import { View, Text, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_ENQUIRIES } from "../mock";
import { LeadCard } from "../components/LeadCard";
import type { Enquiry } from "../types/api";

export function LeadsListScreen({ navigation }: any) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return MOCK_ENQUIRIES;
    const q = query.toLowerCase();
    return MOCK_ENQUIRIES.filter(
      (e: Enquiry) =>
        e.subject.toLowerCase().includes(q) ||
        e.customer_name.toLowerCase().includes(q) ||
        e.customer_email.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 mb-3">Leads</Text>
        <TextInput
          placeholder="Search by name, email, or subject…"
          placeholderTextColor="#9ca3af"
          value={query}
          onChangeText={setQuery}
          className="bg-white rounded-xl px-4 py-3 text-sm text-gray-800 border border-gray-200 mb-3"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <LeadCard
            enquiry={item}
            onPress={(e) => navigation.navigate("ConversationDetail", { enquiry: e })}
          />
        )}
        ListEmptyComponent={
          <View className="py-12 items-center">
            <Text className="text-gray-400 text-base">No leads found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
