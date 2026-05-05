"use client";

import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();

  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    setToken(localStorage.getItem("token"));
  }, []);

  // ⛔ If not logged in → don't show navbar
  if (!token) return null;

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography sx={{ flexGrow: 1 }}>
          CRM Panel
        </Typography>

        <Button color="inherit" onClick={() => router.push("/dashboard")}>
          Dashboard
        </Button>

        <Button color="inherit" onClick={() => router.push("/contacts")}>
          New Leads
        </Button>

        {role === "admin" && (
          <>
            <Button color="inherit" onClick={() => router.push("/upload")}>
              Manage Leads
            </Button>

            <Button color="inherit" onClick={() => router.push("/assign")}>
              Assign Leads
            </Button>
          </>
        )}

        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}