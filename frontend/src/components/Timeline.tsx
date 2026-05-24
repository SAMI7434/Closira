/**
 * Timeline — vertical stepper showing state changes for an enquiry.
 */
import React from "react";
import { View, Text } from "react-native";
import type { TimelineEntry } from "../types/api";
import { formatDate, timeAgo } from "../utils";
import { cn } from "../utils/helpers";

interface TimelineProps {
  entries: TimelineEntry[];
}

export function Timeline({ entries }: TimelineProps) {
  if (entries.length === 0) return (
    <View className="py-4"><Text className="text-gray-400 text-center text-sm">No history yet.</Text></View>
  );

  return (
    <View className="py-2">
      {entries.map((entry, idx) => {
        const isLast = idx === entries.length - 1;
        return (
          <View key={entry.id} className="flex-row">
            {/* left column — dot + line */}
            <View className="items-center mr-3" style={{ width: 16 }}>
              <View className={`w-3 h-3 rounded-full ${isLast ? "bg-primary" : "bg-gray-300"}`} />
              {!isLast ? <View className="flex-1 w-0.5 bg-gray-300 mt-1" /> : null}
            </View>

            {/* right column — content */}
            <View className={cn("flex-1 pb-4 mb-4", isLast ? "" : "border-b border-gray-100")}>
              <Text className="text-sm font-medium text-gray-800">{entry.event}</Text>
              {entry.old_value ? (
                <View className="flex-row items-center mt-1">
                  <Text className="text-xs text-gray-400 line-through">{entry.old_value}</Text>
                  <Text className="text-xs text-gray-400 mx-1">→</Text>
                  <Text className="text-xs font-medium text-gray-700">{entry.new_value}</Text>
                </View>
              ) : (
                <Text className="text-xs text-gray-500 mt-0.5">{entry.new_value ?? "—"}</Text>
              )}
              <Text className="text-xs text-gray-400 mt-1">
                {formatDate(entry.created_at)} · {timeAgo(entry.created_at)}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
