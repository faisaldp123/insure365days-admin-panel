"use client";

import { useEffect, useState, useRef } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import API from "@/lib/api";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  MenuItem,
  Box,
  Button,
  Alert,
} from "@mui/material";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [message, setMessage] = useState("");
  const fileRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchLeads();
  }, []);

  // ✅ FETCH LEADS WITH AUTO LOGOUT
  const fetchLeads = async () => {
    try {
      const res = await API.get("/leads");
      setLeads(res.data.leads || res.data);
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);

      // 🔥 AUTO LOGOUT
      if (err.response?.status === 401) {
        console.log("🚨 Token expired / invalid → logging out");

        localStorage.removeItem("token");

        setMessage("Session expired. Please login again.");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    }
  };

  // ✅ UPDATE LEAD WITH AUTO LOGOUT
  const updateLead = async (id, field, value) => {
    try {
      await API.put(`/leads/${id}`, { [field]: value });
      fetchLeads();
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        console.error(err);
      }
    }
  };

  // ✅ UPLOAD FILE WITH AUTO LOGOUT
  const handleUpload = async () => {
    const file = fileRef.current.files[0];
    if (!file) return alert("Please select file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.post("/leads/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("✅ Leads uploaded successfully!");
      fileRef.current.value = "";
      fetchLeads();
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        console.error(err);
        setMessage("❌ Upload failed");
      }
    }
  };

  // 🎨 STYLE
  const textFieldStyle = {
    input: { color: "#fff" },
    label: { color: "#fff" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#fff" },
      "&:hover fieldset": { borderColor: "#fff" },
      "&.Mui-focused fieldset": { borderColor: "#fff" },
    },
    "& .MuiSvgIcon-root": { color: "#fff" },
  };

  return (
    <ProtectedRoute>
      <Navbar />

      <Box p={3} sx={{ backgroundColor: "#000", minHeight: "100vh" }}>
        
        {/* ✅ UPLOAD SECTION */}
        <Box mb={3}>
          <input type="file" ref={fileRef} />
          <Button variant="contained" sx={{ ml: 2 }} onClick={handleUpload}>
            Upload Excel
          </Button>
        </Box>

        {/* ✅ MESSAGE */}
        {message && (
          <Alert
            severity={message.includes("success") ? "success" : "error"}
            onClose={() => setMessage("")}
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}

        {/* ✅ TABLE */}
        <Table sx={{ backgroundColor: "#000" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Mobile</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Status</TableCell>
              <TableCell sx={{ color: "#fff" }}>Call Status</TableCell>
              <TableCell sx={{ color: "#fff" }}>Feedback</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {leads.length > 0 ? (
              leads.map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell sx={{ color: "#fff" }}>{lead.name}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{lead.mobile}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>
                    {lead.email || "-"}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    <TextField
                      select
                      value={lead.status || "new"}
                      onChange={(e) =>
                        updateLead(lead._id, "status", e.target.value)
                      }
                      sx={textFieldStyle}
                      size="small"
                    >
                      <MenuItem value="new">New</MenuItem>
                      <MenuItem value="interested">Interested</MenuItem>
                      <MenuItem value="not_interested">
                        Not Interested
                      </MenuItem>
                      <MenuItem value="follow_up">Follow Up</MenuItem>
                    </TextField>
                  </TableCell>

                  {/* CALL STATUS */}
                  <TableCell>
                    <TextField
                      select
                      value={lead.callStatus || "pending"}
                      onChange={(e) =>
                        updateLead(lead._id, "callStatus", e.target.value)
                      }
                      sx={textFieldStyle}
                      size="small"
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="picked">Picked</MenuItem>
                      <MenuItem value="not_picked">
                        Not Picked
                      </MenuItem>
                    </TextField>
                  </TableCell>

                  {/* FEEDBACK */}
                  <TableCell>
                    <TextField
                      value={lead.feedback || ""}
                      onChange={(e) =>
                        updateLead(lead._id, "feedback", e.target.value)
                      }
                      sx={textFieldStyle}
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ color: "#fff", textAlign: "center" }}>
                  No leads found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </ProtectedRoute>
  );
}