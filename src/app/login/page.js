"use client";

import { useState, useEffect } from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import API from "@/lib/api";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // ✅ If already logged in → redirect
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
  }, []);

  const handleLogin = async () => {
    try {
      const { data } = await API.post("/auth/login", form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      router.push("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",              // full height
        display: "flex",
        justifyContent: "center",     // horizontal center
        alignItems: "center",         // vertical center
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper sx={{ p: 4, width: 350 }}>
        <Typography variant="h6" textAlign="center" mb={2}>
          Login
        </Typography>

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
}