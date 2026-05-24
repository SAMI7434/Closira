/**
 * Navigation type declarations for React Navigation.
 */
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { Enquiry } from "./api";

export type RootTabParamList = {
  Dashboard: undefined;
  Leads: undefined;
  Escalations: undefined;
  FollowUps: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  ConversationDetail: { enquiry: Enquiry };
};

export type DashboardScreenProps = BottomTabScreenProps<RootTabParamList, "Dashboard">;
export type LeadsScreenProps      = BottomTabScreenProps<RootTabParamList, "Leads">;
export type EscalationsScreenProps = BottomTabScreenProps<RootTabParamList, "Escalations">;
export type FollowUpsScreenProps  = BottomTabScreenProps<RootTabParamList, "FollowUps">;
export type ConversationDetailScreenProps = NativeStackScreenProps<RootStackParamList, "ConversationDetail">;