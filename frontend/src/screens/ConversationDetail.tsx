/**
 * ConversationDetail — full view for a single enquiry.
 * Shows header, conversation history, suggested response, SOP match, and timeline.
 */
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ConversationDetailScreenProps } from "../types/navigation";
import { ChannelBadge } from "../components/ChannelBadge";
import { StatusBadge } from "../components/StatusBadge";
import { ConversationBubble } from "../components/ConversationBubble";
import { Timeline } from "../components/Timeline";
import { MOCK_TIMELINE } from "../mock";
import { STATUS_CONFIG } from "../constants";
import { timeAgo } from "../utils";

export function ConversationDetailScreen({ route, navigation }: ConversationDetailScreenProps) {
  const { enquiry } = route.params;
  const [followUpNote, setFollowUpNote] = useState("");
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [escalationReason, setEscalationReason] = useState("");
  const [escalationLoading, setEscalationLoading] = useState(false);

  const timeline = useMemo(() => MOCK_TIMELINE(enquiry.id), [enquiry.id]);
  const conversationHistory = useMemo(() => {
    if (enquiry.conversation_history?.length) return enquiry.conversation_history;
    return [];
  }, [enquiry]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleFollowUp = async () => {
    if (!followUpNote.trim()) return;
    setFollowUpLoading(true);
    // Mock delay — replace with real api call
    setTimeout(() => {
      setFollowUpLoading(false);
      setFollowUpNote("");
      Alert.alert("Follow-up saved", "Your note has been recorded.");
    }, 600);
  };

  const handleEscalate = async () => {
    if (!escalationReason.trim()) {
      Alert.alert("Reason required", "Please explain why this needs escalation.");
      return;
    }
    setEscalationLoading(true);
    setTimeout(() => {
      setEscalationLoading(false);
      setEscalationReason("");
      Alert.alert("Escalated", "The enquiry has been handed to a human agent.");
    }, 600);
  };

  const statusConfig = STATUS_CONFIG[enquiry.status] ?? {
    label: enquiry.status,
    bg: "bg-gray-100",
    text: "text-gray-700",
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* ── Header ── */}
        <SafeAreaView edges={["top"]}>
          <View className="flex-row items-center justify-between px-4 pt-2 pb-3">
            <Text className="text-xl font-bold text-gray-900 flex-1" numberOfLines={1}>
              {enquiry.subject}
            </Text>
            <StatusBadge status={enquiry.status} />
          </View>

          {/* meta row */}
          <View className="flex-row items-center px-4 pb-3">
            <Text className="text-sm text-gray-600">
              {enquiry.customer_name} · {enquiry.customer_email}
            </Text>
            <Text className="text-gray-300 mx-2">·</Text>
            <ChannelBadge channel={enquiry.channel} />
            <Text className="text-xs text-gray-400 ml-2">{timeAgo(enquiry.created_at)}</Text>
          </View>
        </SafeAreaView>

        {/* ── Conversation History ── */}
        {conversationHistory.length > 0 && (
          <View className="px-4 mt-2">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Conversation</Text>
            <View className="bg-white rounded-xl px-4 py-3 border border-gray-200">
              {conversationHistory.map((msg, i) => (
                <ConversationBubble key={i} message={msg} />
              ))}
            </View>
          </View>
        )}

        {/* ── SOP Match / Suggested Response ── */}
        {enquiry.sop_matched && (
          <View className="px-4 mt-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">SOP Match</Text>
            <View className="rounded-xl px-4 py-3 bg-blue-50 border border-blue-200">
              <Text className="text-sm font-semibold text-blue-800">
                {enquiry.sop_matched}
              </Text>
              {enquiry.suggested_response ? (
                <Text className="text-sm text-blue-700 mt-1 leading-relaxed">
                  {enquiry.suggested_response}
                </Text>
              ) : null}
            </View>
          </View>
        )}

        {/* ── Timeline ── */}
        <View className="px-4 mt-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Status Timeline</Text>
          <View className="bg-white rounded-xl px-4 py-3 border border-gray-200">
            <Timeline entries={timeline} />
          </View>
        </View>

        {/* ── Follow-up Input ── */}
        <View className="px-4 mt-5">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Add Follow-up</Text>
          <TextInput
            placeholder="Write a follow-up note…"
            placeholderTextColor="#9ca3af"
            value={followUpNote}
            onChangeText={setFollowUpNote}
            multiline
            className="bg-white rounded-xl px-4 py-3 text-sm text-gray-800 border border-gray-200 min-h-[80px]"
            textAlignVertical="top"
          />
          <TouchableOpacity
            onPress={handleFollowUp}
            disabled={followUpLoading}
            className={`mt-2 rounded-xl py-3 items-center ${
              followUpLoading ? "bg-gray-300" : "bg-primary"
            }`}
          >
            <Text className="text-white font-semibold text-sm">
              {followUpLoading ? "Saving…" : "Save Follow-up"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Escalate ── */}
        <View className="px-4 mt-5 pb-8">
          <Text className="text-xs text-danger font-semibold mb-2 uppercase tracking-wider">
            ⚠ Escalate
          </Text>
          <TextInput
            placeholder="Reason for escalation…"
            placeholderTextColor="#9ca3af"
            value={escalationReason}
            onChangeText={setEscalationReason}
            multiline
            className="bg-white rounded-xl px-4 py-3 text-sm text-gray-800 border border-danger min-h-[80px]"
            textAlignVertical="top"
          />
          <TouchableOpacity
            onPress={handleEscalate}
            disabled={escalationLoading}
            className={`mt-2 rounded-xl py-3 items-center ${
              escalationLoading ? "bg-gray-300" : "bg-danger"
            }`}
          >
            <Text className="text-white font-semibold text-sm">
              {escalationLoading ? "Escalating…" : "Escalate to Agent"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
