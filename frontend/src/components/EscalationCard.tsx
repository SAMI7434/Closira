/**
 * EscalationCard — displays an escalated enquiry card used on the Escalations tab.
 */
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { Escalation } from "../types/api";
import { STATUS_CONFIG } from "../constants";

interface EscalationCardProps {
  escalation: Escalation;
  onPress?: (escalation: Escalation) => void;
}

/** Map priority string to an emoji / colour indicator. */
const PRIORITY_DOT: Record<string, string> = {
  urgent:  "🔴",
  high:    "🟠",
  medium:  "🟡",
  low:     "🟢",
};

export function EscalationCard({ escalation, onPress }: EscalationCardProps) {
  const statusConfig = STATUS_CONFIG[escalation.status] ?? {
    label: escalation.status,
    bg: "bg-gray-100",
    text: "text-gray-700",
  };

  return (
    <TouchableOpacity
      onPress={() => onPress?.(escalation)}
      activeOpacity={0.7}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-red-200"
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-semibold text-red-700 flex-1 mr-2" numberOfLines={1}>
          {PRIORITY_DOT[escalation.priority]}  {escalation.priority.toUpperCase()}
        </Text>
        <View className={`rounded-full ${statusConfig.bg} px-2 py-0.5`}>
          <Text className={`text-xs font-semibold ${statusConfig.text}`}>
            {statusConfig.label}
          </Text>
        </View>
      </View>
      <Text className="text-sm text-gray-800 mb-1" numberOfLines={2}>
        {escalation.reason}
      </Text>
      {escalation.assignee ? (
        <View className="flex-row items-center mt-1.5">
          <Text className="text-xs text-gray-400">Assigned to: </Text>
          <Text className="text-xs font-medium text-gray-700">{escalation.assignee}</Text>
        </View>
      ) : null}
      <Text className="text-xs text-gray-400 mt-1">
        {timeAgo(escalation.created_at)}
      </Text>
    </TouchableOpacity>
  );
}
