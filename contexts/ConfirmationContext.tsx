"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
  onConfirm: () => Promise<void> | void;
}

interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean;
  isLoading: boolean;
}

interface ConfirmationContextType {
  confirmAction: (options: ConfirmationOptions) => void;
  state: ConfirmationState;
  closeModal: () => void;
  handleConfirm: () => Promise<void>;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(
  undefined,
);

const defaultState: ConfirmationState = {
  isOpen: false,
  isLoading: false,
  title: "",
  description: "",
  confirmText: "Confirm",
  cancelText: "Cancel",
  variant: "danger",
  onConfirm: () => {},
};

export function ConfirmationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<ConfirmationState>(defaultState);

  const confirmAction = useCallback((options: ConfirmationOptions) => {
    setState({
      ...defaultState,
      ...options,
      isOpen: true,
      isLoading: false,
    });
  }, []);

  const closeModal = useCallback(() => {
    setState(defaultState);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!state.onConfirm) return;

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await state.onConfirm();
      closeModal();
    } catch (error) {
      // Keep modal open on error, let the onConfirm handler deal with error notification
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [state.onConfirm, closeModal]);

  return (
    <ConfirmationContext.Provider
      value={{
        confirmAction,
        state,
        closeModal,
        handleConfirm,
      }}
    >
      {children}
    </ConfirmationContext.Provider>
  );
}

export function useConfirmation() {
  const context = useContext(ConfirmationContext);
  if (context === undefined) {
    throw new Error(
      "useConfirmation must be used within a ConfirmationProvider",
    );
  }
  return context;
}
