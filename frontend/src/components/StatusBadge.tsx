/**
 * StatusBadge — a pill badge that reflects enquiry or escalation status.
 * Driven by the STATUS_CONFIG / ESCALATION_STATUS_CONFIG constants.
 */
import React from "react";
import { Text, View } from "react-native";
import { STATUS_CONFIG } from "../constants";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, bg: "bg-gray-100", text: "text-gray-700" };
  const padding = size === "sm" ? "px-2 py-0.5" : "px-3 py-1";
  const fontSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <View className={`rounded-full ${config.bg} ${padding}`}>
      <Text className={`font-semibold ${config.text} ${fontSize}`}>{config.label}</Text>
    </View>
  );
}
