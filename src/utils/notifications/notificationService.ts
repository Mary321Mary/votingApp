import notifee, {
  TriggerType,
  TimestampTrigger,
  AndroidImportance,
} from "@notifee/react-native";
import { NotificationItem } from "../../screens/NotificationsScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const NOTIFICATION_IDS = {
  PRINT_SIGN_MAIL: "remind_print_sign_mail",
};

export const NOTIFICATION_DELAY_MINUTES = 5;
export const NOTIFICATION_STORAGE_KEY = "local_notifications_list";

export async function scheduleMailReminderNotification(
  notificationText: string,
  params: { url: string },
  delayInMinutes = NOTIFICATION_DELAY_MINUTES,
) {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: "voter_reminders",
    name: "Voter Registration Reminders",
    importance: AndroidImportance.HIGH,
  });

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: Date.now() + delayInMinutes * 60 * 1000,
  };

  const notificationId = `mail_reminder_${Date.now()}`;

  await notifee.createTriggerNotification(
    {
      id: notificationId,
      title: "Action Required: Mail Your Form",
      body: notificationText,
      android: {
        channelId,
        pressAction: { id: "default", launchActivity: "default" },
      },
      data: {
        type: "reminder_mail",
        notificationId,
        url: params.url,
      },
    },
    trigger,
  );

  const newNotificationItem: NotificationItem = {
    id: notificationId,
    title: "Action Required: Mail Your Form",
    previewText: notificationText,
    date: new Date().toLocaleString(),
    isRead: false,
    type: "reminder_mail",
    actionTarget: "Dashboard",
    payload: {
      url: params.url,
    },
  };

  try {
    const existing = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    const list = existing ? JSON.parse(existing) : [];
    list.unshift(newNotificationItem);
    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    console.error("Failed to save local notification:", error);
  }
}

export async function scheduleBallotReminderNotification(
  notificationText: string,
  params: {
    electionName: string;
  },
  delayInMinutes = NOTIFICATION_DELAY_MINUTES,
) {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: "voter_reminders",
    name: "Voter Registration Reminders",
    importance: AndroidImportance.HIGH,
  });

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: Date.now() + delayInMinutes * 60 * 1000,
  };

  const notificationId = `ballot_reminder_${Date.now()}`;

  await notifee.createTriggerNotification(
    {
      id: notificationId,
      title: "Check Your Ballot",
      body: notificationText,
      android: {
        channelId,
        pressAction: { id: "default", launchActivity: "default" },
      },
      data: {
        type: "remind_ballot",
        notificationId,
      },
    },
    trigger,
  );

  const newNotificationItem: NotificationItem = {
    id: notificationId,
    title: `Check Your Ballot for ${params.electionName}`,
    previewText: notificationText,
    date: new Date().toLocaleString(),
    isRead: false,
    type: "remind_ballot",
    actionTarget: "Dashboard",
    payload: {},
  };

  try {
    const existing = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    const list = existing ? JSON.parse(existing) : [];
    list.unshift(newNotificationItem);
    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    console.error("Failed to save local ballot notification:", error);
  }
}

export async function cancelMailReminderNotification() {
  await notifee.cancelNotification(NOTIFICATION_IDS.PRINT_SIGN_MAIL);
}
