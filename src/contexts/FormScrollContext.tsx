import React, { createContext, useContext, useRef } from "react";
import {
  findNodeHandle,
  InteractionManager,
  NativeMethods,
  UIManager,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type ScrollToOptions = { x?: number; y?: number; animated?: boolean };

interface ScrollResponderHandle extends NativeMethods {
  scrollTo: (options: ScrollToOptions) => void;
}

type FormFieldHandle = NativeMethods;

interface RegisteredField {
  ref: FormFieldHandle;
  focusAction?: () => void;
}

interface FormScrollViewHandle extends KeyboardAwareScrollView {
  getScrollResponder: () => ScrollResponderHandle | null;
}

interface FormScrollContextType {
  registerField: (
    name: string,
    focusAction?: () => void,
  ) => (ref: FormFieldHandle | null) => void;
  scrollToFirstError: (errors: Record<string, string>) => void;
  scrollViewRef: React.RefObject<FormScrollViewHandle | null>;
}

const FormScrollContext = createContext<FormScrollContextType | null>(null);

export const FormScrollProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const scrollViewRef = useRef<FormScrollViewHandle | null>(null);
  const fieldsRef = useRef<Record<string, RegisteredField | null>>({});

  const registerField =
    (name: string, focusAction?: () => void) =>
    (ref: FormFieldHandle | null) => {
      if (ref && name) {
        fieldsRef.current[name] = { ref, focusAction };
      }
    };

  const scrollToFirstError = (errors: Record<string, string>) => {
    const firstErrorKey = Object.keys(errors).find(key => Boolean(errors[key]));
    const registeredField = firstErrorKey
      ? fieldsRef.current[firstErrorKey]
      : undefined;
    const scrollView = scrollViewRef.current;

    if (!registeredField || !scrollView) return;

    InteractionManager.runAfterInteractions(() => {
      registeredField.focusAction?.();
      if (typeof registeredField.ref.focus === "function") {
        registeredField.ref.focus();
      }

      const scrollResponder = scrollView.getScrollResponder();
      const scrollViewNode = findNodeHandle(scrollView);
      const targetNode = findNodeHandle(
        registeredField.ref as unknown as React.Component,
      );

      if (!scrollResponder || scrollViewNode === null || targetNode === null) {
        return;
      }

      UIManager.measureLayout(
        targetNode,
        scrollViewNode,
        () => scrollResponder.scrollTo({ y: 0, animated: true }),
        (_x, y) =>
          scrollResponder.scrollTo({
            y: Math.max(0, y - 20),
            animated: true,
          }),
      );
    });
  };

  return (
    <FormScrollContext.Provider
      value={{ registerField, scrollToFirstError, scrollViewRef }}
    >
      {children}
    </FormScrollContext.Provider>
  );
};

export const useFormScroll = () => {
  const context = useContext(FormScrollContext);
  if (!context) {
    throw new Error("useFormScroll must be used within FormScrollProvider");
  }
  return context;
};
