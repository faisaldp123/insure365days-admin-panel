"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import API from "@/lib/api";
import { Box, Button, Typography } from "@mui/material";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);

      await API.post("/leads/upload", formData);

      setMessage("✅ File uploaded successfully!");
      setFile(null);

      // clear input
      document.getElementById("fileInput").value = "";
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />

      <Box
        p={3}
        sx={{
          pt: { xs: 3, md: 3 },
        }}
      >
        {/* FILE INPUT */}
        <input
          id="fileInput"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* BUTTON */}
        <Button
          variant="contained"
          onClick={handleUpload}
          sx={{
            mt: 3,
            minWidth: "160px",
            opacity: 1, // ✅ keep visible
            backgroundColor: loading ? "#555" : "#1976d2", // ✅ visible in dark mode
            color: "#fff",
            "&:disabled": {
              backgroundColor: "#555", // ✅ override MUI disabled fade
              color: "#fff",
              opacity: 1,
            },
          }}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Excel"}
        </Button>

        {/* MESSAGE */}
        {message && (
          <Typography
            sx={{
              mt: 2,
              color: message.includes("success") ? "#4caf50" : "#f44336",
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </ProtectedRoute>
  );
}