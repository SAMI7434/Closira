/**
 * ChannelBadge — coloured badge for the communication channel (email, whatsapp, …).
 */
import React from "react";
import { Text, View } from "react-native";
import { CHANNEL_LABELS } from "../constants";

interface ChannelBadgeProps {
  channel: string;
}

const CHANNEL_STYLES: Record<string, { bg: string; text: string }> = {
  email:    { bg: "bg-indigo-100", text: "text-indigo-700" },
  whatsapp: { bg: "bg-green-100",  text: "text-green-700"  },
  chat:     { bg: "bg-purple-100", text: "text-purple-700" },
  phone:    { bg: "bg-amber-100",  text: "text-amber-700"  },
};

export function ChannelBadge({ channel }: ChannelBadgeProps) {
  const styles = CHANNEL_STYLES[channel] ?? { bg: "bg-gray-100", text: "text-gray-700" };
  return (
    <View className={`rounded-md ${styles.bg} px-2 py-0.5 flex-row`}>
      <Text className={`text-xs font-medium ${styles.text}`}>{CHANNEL_LABELS[channel] ?? channel}</Text>
    </View>
  );
}
