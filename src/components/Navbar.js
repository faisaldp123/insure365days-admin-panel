"use client";

import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
  Drawer,
  Box,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();

  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [open, setOpen] = useState(false); // mobile menu

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    setToken(localStorage.getItem("token"));
  }, []);

  if (!token) return null;

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const menuItems = (
    <>
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
    </>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* Logo / Title */}
          <Typography sx={{ flexGrow: 1 }}>
            CRM Panel
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {menuItems}
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 250,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 2,
          }}
        >
          {menuItems}
        </Box>
      </Drawer>
    </>
  );
}