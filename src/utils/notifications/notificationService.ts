import notifee, {
  TriggerType,
  TimestampTrigger,
  AndroidImportance,
} from "@notifee/react-native";
import { NotificationItem } from "@/screens/NotificationsScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const NOTIFICATION_IDS = {
  PRINT_SIGN_MAIL: "remind_print_sign_mail",
  STATUS: "status",
  BALLOT: "ballot",
};

export const NOTIFICATION_DELAY_MINUTES = 5;
export const NOTIFICATION_STORAGE_KEY = "local_notifications_list";

export async function scheduleGenericNotification(config: {
  idPrefix: string;
  type: NotificationItem["type"];
  title: string;
  body: string;
  delayInMinutes: number;
  actionTarget: any;
  payload?: any;
}) {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: "voter_reminders",
    name: "Voter Registration Reminders",
    importance: AndroidImportance.HIGH,
  });

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: Date.now() + config.delayInMinutes * 60 * 1000,
  };

  const notificationId = config.idPrefix;

  await notifee.createTriggerNotification(
    {
      id: notificationId,
      title: config.title,
      body: config.body,
      android: {
        channelId,
        pressAction: { id: "default", launchActivity: "default" },
      },
      data: {
        type: config.type,
        notificationId,
        ...(config.payload || {}),
      },
    },
    trigger,
  );

  const newNotificationItem: NotificationItem = {
    id: notificationId,
    title: config.title,
    previewText: config.body,
    date: new Date().toLocaleString(),
    isRead: false,
    type: config.type,
    actionTarget: config.actionTarget,
    payload: config.payload || {},
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

export async function markNotificationAsReadInStorage(notificationId: string) {
  try {
    const existing = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (!existing) return;

    const list: NotificationItem[] = JSON.parse(existing);

    const updatedList = list.map(item =>
      item.id === notificationId ? { ...item, isRead: true } : item,
    );

    await AsyncStorage.setItem(
      NOTIFICATION_STORAGE_KEY,
      JSON.stringify(updatedList),
    );
  } catch (error) {
    console.error("Failed to mark notification as read in storage:", error);
  }
}

export async function cancelMailReminderNotification() {
  await notifee.cancelNotification(NOTIFICATION_IDS.PRINT_SIGN_MAIL);
}
