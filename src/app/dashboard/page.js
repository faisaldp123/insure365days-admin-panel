"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
  CircularProgress,
} from "@mui/material";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fileRef = useRef();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchLeads();
  }, []);

  // ✅ FETCH LEADS
  const fetchLeads = async () => {
    try {
      setLoading(true);

      const res = await API.get("/leads");

      console.log("API RESPONSE:", res.data);

      setLeads(Array.isArray(res.data) ? res.data : res.data.leads || []);
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATE LEAD
  const updateLead = async (id, field, value) => {
    try {
      await API.put(`/leads/${id}`, { [field]: value });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
  };

  // ✅ UPLOAD FILE
  const handleUpload = async () => {
    const file = fileRef.current.files[0];
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.post("/leads/upload", formData);
      setMessage("✅ Upload successful");
      fetchLeads();
    } catch (err) {
      setMessage("❌ Upload failed");
    }
  };

  const textFieldStyle = {
    input: { color: "#fff" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#fff" },
    },
  };

  return (
    <ProtectedRoute>
      <Navbar />

      <Box p={3} sx={{ background: "#000", minHeight: "100vh" }}>
        
        {/* Upload */}
        <Box mb={3}>
          <input type="file" ref={fileRef} />
          <Button sx={{ ml: 2 }} variant="contained" onClick={handleUpload}>
            Upload
          </Button>
        </Box>

        {message && <Alert sx={{ mb: 2 }}>{message}</Alert>}

        {/* Loader */}
        {loading ? (
          <Box textAlign="center">
            <CircularProgress />
          </Box>
        ) : (
          <Table>
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
                          updateLead(
                            lead._id,
                            "callStatus",
                            e.target.value
                          )
                        }
                        sx={textFieldStyle}
                        size="small"
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="picked">Picked</MenuItem>
                        <MenuItem value="not_picked">Not Picked</MenuItem>
                      </TextField>
                    </TableCell>

                    {/* FEEDBACK (FIXED 🔥) */}
                    <TableCell>
                      <TextField
                        defaultValue={lead.feedback || ""}
                        onBlur={(e) =>
                          updateLead(
                            lead._id,
                            "feedback",
                            e.target.value
                          )
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
                  <TableCell colSpan={6} align="center" sx={{ color: "#fff" }}>
                    No leads found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Box>
    </ProtectedRoute>
  );
}