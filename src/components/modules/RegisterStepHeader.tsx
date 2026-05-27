import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

type Props = {
  titleKey: string;
  completedSteps: number;
  currentStep: number;
  totalSteps?: number;
};

export const RegisterStepHeader: React.FC<Props> = ({
  titleKey,
  completedSteps,
  currentStep,
  totalSteps = 4,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{t(titleKey)}</Text>

      <View style={styles.progressBar}>
        <Text style={styles.stepLabel}>{t("general.step")}</Text>

        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;

          const isCompleted = step <= completedSteps;
          const isCurrent = step === currentStep;

          return (
            <View
              key={step}
              style={[
                styles.stepItem,
                (isCompleted || isCurrent) && styles.stepItemActive,
              ]}
            >
              <Text style={styles.stepText}>{isCompleted ? "✓" : step}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
  },

  progressBar: {
    flexDirection: "row",
    alignItems: "center",
  },

  stepLabel: {
    fontSize: 12,
    marginRight: 10,
  },

  stepItem: {
    width: 27,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
    marginHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  stepItemActive: {
    backgroundColor: "#bed9ec",
  },

  stepText: {
    fontSize: 12,
    fontWeight: "400",
  },
});
