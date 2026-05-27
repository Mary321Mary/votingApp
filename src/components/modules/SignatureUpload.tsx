import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, Image, StyleSheet, Button } from "react-native";
import ImagePicker from "react-native-image-crop-picker";

interface SignatureUploadProps {
  initialValue?: string;
  error?: string;
  onChange: (payload: { file: any; base64: string }) => void;
}

export default function SignatureUpload({
  initialValue = "",
  error,
  onChange,
}: SignatureUploadProps) {
  const { t } = useTranslation();
  const [image, setImage] = useState(initialValue);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.openPicker({
        width: 600,
        height: 300,
        cropping: true,
        includeBase64: true,
        mediaType: "photo",
        cropperToolbarTitle: "Crop Signature",
        compressImageQuality: 0.9,
      });

      const base64 = `data:${result.mime};base64,${result.data}`;
      setImage(base64);

      onChange({
        file: result,
        base64,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemove = () => {
    setImage("");
    onChange({ file: null, base64: "" });
  };

  return (
    <View>
      {!image ? (
        <>
          <Button title="Upload Signature" onPress={pickImage} />
          {!!error && <Text style={styles.error}>{t(error)}</Text>}
        </>
      ) : (
        <>
          <View style={styles.previewBox}>
            <Image
              source={{ uri: image }}
              style={styles.preview}
              resizeMode="contain"
            />
          </View>
          <Button title="Remove" onPress={handleRemove} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  uploadButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },

  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  error: {
    color: "red",
    marginTop: 8,
  },

  previewBox: {
    width: 300,
    height: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },

  preview: {
    width: "100%",
    height: "100%",
  },

  removeButton: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
  },

  removeText: {
    color: "#fff",
    fontWeight: "600",
  },
});
