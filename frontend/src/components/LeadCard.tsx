/**
 * LeadCard — displays a single enquiry in list / detail feeds.
 */
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { Enquiry } from "../types/api";
import { StatusBadge } from "./StatusBadge";
import { ChannelBadge } from "./ChannelBadge";
import { truncate, timeAgo } from "../utils";

interface LeadCardProps {
  enquiry: Enquiry;
  onPress?: (enquiry: Enquiry) => void;
}

export function LeadCard({ enquiry, onPress }: LeadCardProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress?.(enquiry)}
      activeOpacity={0.7}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-200"
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-3">
          <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
            {enquiry.subject}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">
            {enquiry.customer_name} · {enquiry.customer_email}
          </Text>
        </View>
        <StatusBadge status={enquiry.status} />
      </View>

      <Text className="text-sm text-gray-700 mb-2.5" numberOfLines={2}>
        {truncate(enquiry.message, 90)}
      </Text>

      <View className="flex-row items-center justify-between">
        <ChannelBadge channel={enquiry.channel} />
        <Text className="text-xs text-gray-400">{timeAgo(enquiry.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );
}
