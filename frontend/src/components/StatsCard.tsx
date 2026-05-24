/**
 * StatsCard — summary tile shown on the Dashboard.
 */
import React from "react";
import { View, Text } from "react-native";
import { cn } from "../utils/helpers";

interface StatsCardProps {
  label: string;
  value: number | string;
  colorClass?: string;
}

export function StatsCard({ label, value, colorClass = "" }: StatsCardProps) {
  return (
    <View className={`flex-1 rounded-2xl p-4 mr-3 last:mr-0 bg-white shadow-sm border border-gray-200`}>
      <Text className="text-sm text-gray-500 font-medium mb-1">{label}</Text>
      <Text className={`text-2xl font-bold text-gray-900 ${colorClass}`}>{value}</Text>
    </View>
  );
}
