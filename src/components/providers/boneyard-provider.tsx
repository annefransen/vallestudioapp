"use client";

import * as React from "react";
import "@/bones/registry";

export function BoneyardProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
