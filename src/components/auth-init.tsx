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

"use client";

import { useEffect } from "react";
import useStore from "@/store";
import { setAuthToken } from "@/lib/apiCalls";

export default function AuthInit() {
  const { user, hydrateUser } = useStore();

  useEffect(() => {
    hydrateUser();
    if (user?.token) {
      setAuthToken(user.token);
    }
  }, [user, hydrateUser]);

  return null;
}
