"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Wer in den Systemeinstellungen „Bewegung reduzieren“ gewählt hat, bekommt von Motion keine Verschiebungen mehr. */
export default function BewegungsEinstellung({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
