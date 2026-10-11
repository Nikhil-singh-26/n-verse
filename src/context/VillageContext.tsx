"use client";

import React from "react";
export { useVillage } from "@/store/villageStore";

export function VillageProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
