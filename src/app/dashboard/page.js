"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import API from "@/lib/api";

import {
  Table, TableHead, TableRow, TableCell, TableBody,
  TextField, MenuItem, Box, Button, Alert,
  Select, Pagination
} from "@mui/material";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const fileRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await API.get("/leads");
      setLeads(Array.isArray(res.data) ? res.data : res.data.leads || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  // ✅ FIX: instant UI update
  const updateLead = async (id, field, value) => {
    try {
      await API.put(`/leads/${id}`, { [field]: value });

      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === id ? { ...lead, [field]: value } : lead
        )
      );
    } catch {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  const handleUpload = async () => {
    const file = fileRef.current.files[0];
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.post("/leads/upload", formData);
      setMessage("✅ Uploaded successfully");
      fetchLeads();
    } catch {
      setMessage("❌ Upload failed");
    }
  };

  // ✅ FILTER
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchSearch =
        lead.name?.toLowerCase().includes(search.toLowerCase()) ||
        lead.mobile?.includes(search);

      const matchStatus = statusFilter
        ? lead.status === statusFilter
        : true;

      const matchDate = dateFilter
        ? new Date(lead.createdAt).toDateString() ===
          new Date(dateFilter).toDateString()
        : true;

      return matchSearch && matchStatus && matchDate;
    });
  }, [leads, search, statusFilter, dateFilter]);

  const paginatedLeads = filteredLeads.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const selectStyle = {
    color: "#fff",
    ".MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
    "& .MuiSvgIcon-root": { color: "#fff" },
  };

  return (
    <ProtectedRoute>
      <Navbar />

      {/* ✅ FIX: proper spacing */}
      <Box sx={{ p: 3, mt: 6, background: "#000", minHeight: "100vh" }}>

        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >

          {/* LEFT */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <input type="file" ref={fileRef} />
            <Button variant="contained" onClick={handleUpload}>
              Upload Excel
            </Button>
          </Box>

          {/* RIGHT */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ input: { color: "#fff" } }}
            />

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
              size="small"
              sx={selectStyle}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="interested">Interested</MenuItem>
              <MenuItem value="not_interested">Not Interested</MenuItem>
              <MenuItem value="follow_up">Follow Up</MenuItem>
            </Select>

            <TextField
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              size="small"
              sx={{ input: { color: "#fff" } }}
            />
          </Box>
        </Box>

        {message && <Alert sx={{ mb: 2 }}>{message}</Alert>}

        {/* TABLE */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Mobile</TableCell>
              <TableCell sx={{ color: "#fff" }}>Status</TableCell>
              <TableCell sx={{ color: "#fff" }}>Call</TableCell>
              <TableCell sx={{ color: "#fff" }}>Feedback</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedLeads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell sx={{ color: "#fff" }}>{lead.name}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{lead.mobile}</TableCell>

                <TableCell>
                  <Select
                    value={lead.status || "new"}
                    onChange={(e) =>
                      updateLead(lead._id, "status", e.target.value)
                    }
                    size="small"
                    sx={selectStyle}
                  >
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="interested">Interested</MenuItem>
                    <MenuItem value="not_interested">Not Interested</MenuItem>
                    <MenuItem value="follow_up">Follow Up</MenuItem>
                  </Select>
                </TableCell>

                <TableCell>
                  <Select
                    value={lead.callStatus || "pending"}
                    onChange={(e) =>
                      updateLead(lead._id, "callStatus", e.target.value)
                    }
                    size="small"
                    sx={selectStyle}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="picked">Picked</MenuItem>
                    <MenuItem value="not_picked">Not Picked</MenuItem>
                  </Select>
                </TableCell>

                <TableCell>
                  <TextField
                    defaultValue={lead.feedback || ""}
                    placeholder="Add feedback"
                    onBlur={(e) =>
                      updateLead(lead._id, "feedback", e.target.value)
                    }
                    size="small"
                    sx={{
                      input: { color: "#fff" },
                      "& input::placeholder": {
                        color: "#fff",
                        opacity: 0.7,
                      },
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Math.ceil(filteredLeads.length / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
          />
        </Box>
      </Box>
    </ProtectedRoute>
  );
}