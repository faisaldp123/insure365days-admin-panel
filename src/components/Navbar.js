"use client";

import { AppBar, Box, Button, Drawer, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const router = useRouter(); const [role, setRole] = useState(null); const [open, setOpen] = useState(false);
  useEffect(() => { const token = localStorage.getItem("token"); if (!token) return; try { setRole(jwtDecode(token).role); } catch { localStorage.clear(); router.replace("/login"); } }, [router]);
  const logout = () => { localStorage.clear(); router.push("/login"); };
  const navigate = (route) => { setOpen(false); router.push(route); };
  const item = (label, route) => <Button key={route} onClick={() => navigate(route)} sx={{ color: "#cbd5e1", fontWeight: 600, textTransform: "none", "&:hover": { color: "#fff", backgroundColor: "rgba(59,130,246,.18)" } }}>{label}</Button>;
  if (!role) return null;
  const links = <>{item("Dashboard", "/dashboard")}{role === "admin" && <>{item("New Leads", "/contacts")}{item("Upload Leads", "/upload")}{item("Assign Leads", "/assign")}{item("Employees", "/create-employee")}</>}<Button onClick={logout} variant="outlined" size="small" sx={{ ml: 1, borderColor: "#475569", color: "#e2e8f0", textTransform: "none", "&:hover": { borderColor: "#60a5fa", backgroundColor: "rgba(59,130,246,.12)" } }}>Logout</Button></>;
  return <><AppBar position="sticky" elevation={0} sx={{ background: "#0f172a", borderBottom: "1px solid #1e293b" }}><Toolbar sx={{ minHeight: "64px !important", maxWidth: 1500, width: "100%", mx: "auto" }}><Typography sx={{ flexGrow: 1, color: "#f8fafc", fontWeight: 800, letterSpacing: .3 }}>INSURE365 <Box component="span" sx={{ color: "#60a5fa" }}>CRM</Box></Typography><Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: .5 }}>{links}</Box><IconButton onClick={() => setOpen(true)} sx={{ display: { xs: "flex", md: "none" }, color: "#fff" }}><MenuIcon /></IconButton></Toolbar></AppBar><Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: 260, background: "#0f172a", p: 2 } }}><Box sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 1 }}>{links}</Box></Drawer></>;
}
