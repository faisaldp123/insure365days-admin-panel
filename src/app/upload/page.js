"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import API from "@/lib/api";
import { Box, Button } from "@mui/material";

export default function Upload() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    await API.post("/leads/upload", formData);
    alert("Uploaded!");
  };

  return (
    <ProtectedRoute>
      <Navbar />

      <Box p={3}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <Button variant="contained" onClick={handleUpload}>
          Upload Excel
        </Button>
      </Box>
    </ProtectedRoute>
  );
}