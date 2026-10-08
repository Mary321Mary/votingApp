import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Calendar,
  X,
  ChevronRight,
} from "lucide-react-native";

import { ThemeContext } from "@/styles/ThemeProvider";
import Header from "@/layout/Header";
import { CustomButton } from "../components/atoms/CustomButton";
import { RootStackParamList } from "../components/Navigation";

export interface NotificationItem {
  id: string;
  title: string;
  previewText: string;
  fullBodyText: string;
  date: string;
  isRead: boolean;
  type: "status" | "deadline" | "alert";
  actionTarget?: any;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Voter Registration Confirmed",
    previewText: "Your registration status in Shelby County has been verified.",
    fullBodyText:
      "Good news! Your voter registration status has been officially updated and confirmed in Shelby County. You are fully eligible to vote in the upcoming General Election on Nov 2, 2029.",
    date: "Today, 10:15 AM",
    isRead: false,
    type: "status",
    actionTarget: "Dashboard",
  },
  {
    id: "2",
    title: "Upcoming Election Deadline",
    previewText:
      "Early voting starts next week. Check your nearest polling site.",
    fullBodyText:
      "Early voting locations open next Monday across all primary districts. Make sure to review your assigned polling hours, required photo ID documents, and sample ballot before heading out.",
    date: "Yesterday, 2:30 PM",
    isRead: true,
    type: "deadline",
    actionTarget: "Dashboard",
  },
  {
    id: "3",
    title: "Important Location Update",
    previewText:
      "Polling place for Precinct 4B has changed to Balmoral Church.",
    fullBodyText:
      "Attention: The polling site previously assigned to Precinct 4B has moved to Balmoral Presbyterian Church (6413 Quince Rd). Please check the updated map and operating hours on your dashboard.",
    date: "Oct 24, 2026",
    isRead: true,
    type: "alert",
    actionTarget: "Dashboard",
  },
];

type NotificationsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Notifications"
>;

export default function NotificationsScreen({
  navigation,
}: NotificationsScreenProps) {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);

  const handleSelectNotification = (item: NotificationItem) => {
    setNotifications(prev =>
      prev.map(n => (n.id === item.id ? { ...n, isRead: true } : n)),
    );
    setSelectedNotification(item);
  };

  const handleActionClick = () => {
    const target = selectedNotification?.actionTarget || "Dashboard";
    setSelectedNotification(null);
    navigation.navigate(target);
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "status":
        return <CheckCircle2 size={22} color="#10B981" />;
      case "deadline":
        return <Calendar size={22} color="#F59E0B" />;
      case "alert":
        return <AlertCircle size={22} color="#EF4444" />;
      default:
        return <Bell size={22} color="#3B82F6" />;
    }
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={[styles.card, !item.isRead && styles.unreadCard]}
      activeOpacity={0.7}
      onPress={() => handleSelectNotification(item)}
    >
      <View style={styles.iconContainer}>{getIcon(item.type)}</View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, !item.isRead && styles.boldText]}>
            {item.title}
          </Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>

        <Text style={styles.previewText} numberOfLines={2}>
          {item.previewText}
        </Text>

        <Text style={styles.dateText}>{item.date}</Text>
      </View>

      <ChevronRight size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header text={t("menu.notifications", "Notifications")} />

      <View style={styles.listContent}>
        {notifications.length > 0 ? (
          notifications.map(item => (
            <React.Fragment key={item.id}>
              {renderItem({ item })}
            </React.Fragment>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Bell size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>
              {t("notifications.empty", "No notifications yet")}
            </Text>
          </View>
        )}
      </View>

      <Modal
        visible={Boolean(selectedNotification)}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedNotification(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleGroup}>
                {selectedNotification && getIcon(selectedNotification.type)}
                <Text style={styles.modalDate}>
                  {selectedNotification?.date}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedNotification(null)}
                style={styles.closeBtn}
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Body */}
            <Text style={styles.modalTitle}>{selectedNotification?.title}</Text>
            <Text style={styles.modalBody}>
              {selectedNotification?.fullBodyText}
            </Text>

            {/* Action / Next Step CTA */}
            <View style={styles.modalFooter}>
              <CustomButton
                title={t(
                  "notifications.view_dashboard",
                  "Go to " + selectedNotification?.actionTarget || "Dashboard",
                )}
                onPress={handleActionClick}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      flex: 1,
      backgroundColor: theme.white,
    },
    listContent: {
      padding: 15,
      gap: 10,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.background,
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.borderColor,
    },
    unreadCard: {
      backgroundColor: theme.white,
      borderColor: theme.primary,
      borderWidth: 1.5,
    },
    iconContainer: {
      marginRight: 12,
    },
    cardContent: {
      flex: 1,
      marginRight: 8,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: "500",
    },
    boldText: {
      fontWeight: "700",
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.primary,
      marginLeft: 6,
    },
    previewText: {
      fontSize: 13,
      lineHeight: 18,
      marginBottom: 4,
    },
    dateText: {
      fontSize: 11,
      color: theme.gray,
    },
    emptyContainer: {
      paddingTop: 60,
      alignItems: "center",
      gap: 12,
    },
    emptyText: {
      fontSize: 15,
    },

    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.gray,
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 24,
      minHeight: 320,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    modalHeaderTitleGroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    modalDate: {
      fontSize: 13,
      color: theme.gray,
    },
    closeBtn: {
      padding: 4,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 12,
    },
    modalBody: {
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 24,
    },
    modalFooter: {
      marginTop: "auto",
    },
  });
