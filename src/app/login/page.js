"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "next/navigation";
import API from "@/lib/api";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && window.location.pathname === "/login") {
      router.replace("/dashboard");
    }
  }, []);

  const handleLogin = async () => {
    if (!form.email.trim() || !form.password) {
      setError("Enter your email address and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      router.push("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          "Unable to connect to the login service. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a, #020617)",
        px: 2,
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, md: 4 },
          width: "100%",
          maxWidth: 350,
          borderRadius: 3,
          background: "#111827",
        }}
      >
        {/* TITLE */}
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ color: "#fff", fontWeight: "bold" }}
        >
          Welcome to
        </Typography>

        <Typography
          variant="h5"
          textAlign="center"
          sx={{ color: "#1976d2", fontWeight: "bold", mb: 2 }}
        >
          Insure365 Days
        </Typography>

        {/* EMAIL */}
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          sx={{
            input: { color: "#fff" },
            label: { color: "#aaa" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#555" },
            },
          }}
        />

        {/* PASSWORD WITH EYE ICON */}
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          sx={{
            input: { color: "#fff" },
            label: { color: "#aaa" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#555" },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  sx={{ color: "#fff" }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* BUTTON */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            py: 1.2,
            fontWeight: "bold",
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {error && (
          <Typography
            role="alert"
            sx={{ color: "#fca5a5", fontSize: 14, mt: 1.5, textAlign: "center" }}
          >
            {error}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
