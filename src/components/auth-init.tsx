"use client";

import { useEffect } from "react";
import useStore from "@/store";

export default function AuthInit({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrateUser = useStore((s) => s.hydrateUser);

  useEffect(() => {
    hydrateUser();
  }, [hydrateUser]);

  return <>{children}</>;
}
