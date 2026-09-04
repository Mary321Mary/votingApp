import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";

export const useScrollToError = (
  errors: Record<string, any>,
  scrollViewRef: React.RefObject<ScrollView>,
) => {
  const fieldRefs = useRef<Record<string, View | null>>({});

  const registerField = (name: string) => (ref: View | null) => {
    fieldRefs.current[name] = ref;
  };

  useEffect(() => {
    const firstErrorKey = Object.keys(errors).find(key => Boolean(errors[key]));

    if (!firstErrorKey) return;

    const targetNode = fieldRefs.current[firstErrorKey];
    const scrollViewNode = scrollViewRef.current;

    if (targetNode && scrollViewNode) {
      targetNode.measureLayout(
        scrollViewNode.getInnerViewNode
          ? scrollViewNode.getInnerViewNode()
          : scrollViewNode,
        (x, y) => {
          scrollViewNode.scrollTo({ y: Math.max(0, y - 20), animated: true });
        },
        () => {
          console.warn("Failed to measure field layout");
        },
      );
    }
  }, [errors, scrollViewRef]);

  return { registerField };
};
