"use client";

import React from "react";
import { ThemeProvider } from "./theme-provider";
import { ErrorBoundary } from "@/components/feedback/error-boundary";

export interface RootProvidersProps {
  children: React.ReactNode;
}

export function RootProviders({ children }: RootProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>{children}</ThemeProvider>
    </ErrorBoundary>
  );
}
