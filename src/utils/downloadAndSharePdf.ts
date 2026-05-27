import RNFS from "react-native-fs";
import Share from "react-native-share";
import { Alert } from "react-native";

export const downloadAndSharePdf = async (
  pdfUrl: string,
  fileName = "document.pdf",
) => {
  try {
    const localFile = `${RNFS.CachesDirectoryPath}/${fileName}`;

    const result = await RNFS.downloadFile({
      fromUrl: pdfUrl,
      toFile: localFile,
    }).promise;

    if (result.statusCode !== 200) {
      Alert.alert("Error", "Failed to download PDF");
      return;
    }

    await Share.open({
      url: `file://${localFile}`,
      type: "application/pdf",
      title: "Open PDF",
      failOnCancel: false,
    });
  } catch (error) {
    console.log(error);
    Alert.alert("Error", "Something went wrong");
  }
};
