// "use client";

// import { useEffect } from "react";
// import useStore from "@/store";
// import { setAuthToken } from "@/lib/apiCalls";

// export default function AuthInit({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const hydrateUser = useStore((s) => s.hydrateUser);
//   const { user } = useStore((state) => state);

//   useEffect(() => {
//     hydrateUser();
//     if (user?.token) {
//       setAuthToken(user.token);
//     }
//   }, [hydrateUser]);

//   return <>{children}</>;
// }

// "use client";

// import { useEffect } from "react";
// import useStore from "@/store";
// import { setAuthToken } from "@/lib/apiCalls";

// export default function AuthInit() {
//   const { user, hydrateUser } = useStore();

//   useEffect(() => {
//     hydrateUser();
//     if (user?.token) {
//       setAuthToken(user.token);
//     }
//   }, [user, hydrateUser]);

//   return null;
// }

"use client";

import { useEffect } from "react";
import useStore from "@/store";
import { setAuthToken } from "@/lib/apiCalls";

export default function AuthInit() {
  const { user, hydrated, hydrateUser } = useStore();

  // 1️⃣ Hydrate ONLY once
  useEffect(() => {
    hydrateUser();
  }, [hydrateUser]);

  // 2️⃣ Set axios token AFTER hydration
  useEffect(() => {
    if (hydrated && user?.token) {
      setAuthToken(user.token);
    }
  }, [hydrated, user?.token]);

  return null;
}

