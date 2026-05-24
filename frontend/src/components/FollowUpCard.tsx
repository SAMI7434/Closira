/**
 * FollowUpCard — a compact follow-up note card.
 */
import React from "react";
import { View, Text } from "react-native";
import type { FollowUp } from "../types/api";
import { timeAgo } from "../utils";

interface FollowUpCardProps {
  followUp: FollowUp;
  backgroundColor?: string;
}

export function FollowUpCard({ followUp, backgroundColor = "bg-gray-50" }: FollowUpCardProps) {
  return (
    <View className={`rounded-xl p-3.5 mb-2 border border-gray-200 ${backgroundColor}`}>
      <Text className="text-sm text-gray-800 leading-relaxed">{followUp.notes}</Text>
      <Text className="text-xs text-gray-400 mt-2">{timeAgo(followUp.created_at)}</Text>
    </View>
  );
}
