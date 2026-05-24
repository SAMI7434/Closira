/**
 * ConversationBubble — a single chat bubble used inside ConversationDetail.
 */
import React from "react";
import { View, Text } from "react-native";
import type { ConversationMessage } from "../types/api";

interface ConversationBubbleProps {
  message: ConversationMessage;
}

export function ConversationBubble({ message }: ConversationBubbleProps) {
  const isAgent = message.role === "agent";
  return (
    <View className={`flex-row mb-3 ${isAgent ? "justify-end" : "justify-start"}`}>
      <View
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
          isAgent ? "bg-primary rounded-br-sm" : "bg-gray-200 rounded-bl-sm"
        }`}
      >
        <Text className={`text-sm ${isAgent ? "text-white" : "text-gray-800"}`}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}
