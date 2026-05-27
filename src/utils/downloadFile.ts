import RNFS from "react-native-fs";
import { Platform, PermissionsAndroid, Alert } from "react-native";

export const downloadPdf = async (
  url: string,
  fileName: string = "document.pdf",
) => {
  try {
    // Android permission
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Permission denied");
        return;
      }
    }

    const destination = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    const result = await RNFS.downloadFile({
      fromUrl: url,
      toFile: destination,
    }).promise;

    if (result.statusCode === 200) {
      Alert.alert("Success", `PDF saved to:\n${destination}`);
    } else {
      Alert.alert("Error", "Failed to download PDF");
    }
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Something went wrong");
  }
};
