"use client";

import * as React from "react";
import { TutorDrawer } from "@/components/tutor/tutor-drawer";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

interface LandingTutorContextValue {
  openTutor: () => void;
  closeTutor: () => void;
}

const LandingTutorContext = React.createContext<LandingTutorContextValue>({
  openTutor: () => {},
  closeTutor: () => {},
});

export function useLandingTutor() {
  return React.useContext(LandingTutorContext);
}

export function LandingTutorProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const openTutor = React.useCallback(() => setIsOpen(true), []);
  const closeTutor = React.useCallback(() => setIsOpen(false), []);

  return (
    <LandingTutorContext.Provider value={{ openTutor, closeTutor }}>
      {children}
      <TutorDrawer isOpen={isOpen} onClose={closeTutor} />
    </LandingTutorContext.Provider>
  );
}

export function LandingNavbar() {
  const { openTutor } = useLandingTutor();
  return <Navbar onOpenTutor={openTutor} />;
}

export function TutorCtaButton() {
  const { openTutor } = useLandingTutor();
  return (
    <Button
      variant="outline"
      size="md"
      onClick={openTutor}
      className="gap-2 font-mono text-xs w-full sm:w-auto"
    >
      <span>Ask Architectural AI Tutor</span>
      <ArrowUpRight className="w-3.5 h-3.5 text-[#8a8f98]" />
    </Button>
  );
}
