"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(null); // null = checking

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login"); // ✅ important
      setIsAuth(false);
    } else {
      setIsAuth(true);
    }
  }, []);

  // ⏳ While checking auth
  if (isAuth === null) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  // ❌ Not authenticated
  if (!isAuth) {
    return null;
  }

  // ✅ Authenticated
  return children;
}