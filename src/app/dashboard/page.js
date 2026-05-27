"use client";

import { useEffect, useState, useMemo } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import API from "@/lib/api";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Table, TableHead, TableRow, TableCell, TableBody,
  TextField, MenuItem, Box, Button, Alert,
  Select, Pagination, Dialog, DialogTitle, DialogContent,
  DialogActions, Typography
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [downloadOpen, setDownloadOpen] = useState(false);
  const [dlFromDate, setDlFromDate] = useState("");
  const [dlToDate, setDlToDate] = useState("");
  const [dlStatus, setDlStatus] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
  setRole(localStorage.getItem("role") || "");
  fetchLeads();
}, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, dateFilter]);

  const fetchLeads = async () => {
    try {
      const res = await API.get("/leads");
      const data = Array.isArray(res.data) ? res.data : res.data.leads || [];
      setLeads(data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateLead = async (id, field, value) => {
    try {
      await API.put(`/leads/${id}`, { [field]: value });
      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === id ? { ...lead, [field]: value } : lead
        )
      );
    } catch {
      console.error("Update failed");
    }
  };

  const deleteLead = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this lead?"
  );

  if (!confirmDelete) return;

  try {
    await API.delete(`/leads/${id}`);

    setLeads((prev) =>
      prev.filter((lead) => lead._id !== id)
    );

    setMessage("Lead deleted successfully");
  } catch (err) {
    console.error(err);
    setMessage("Delete failed");
  }
};

const deleteAllLeads = async (type) => {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete all ${type} leads?`
  );

  if (!confirmDelete) return;

  try {
    await API.delete("/leads/delete-all", {
      data: { type },
    });

    fetchLeads();

    setMessage(
      `All ${type} leads deleted successfully`
    );
  } catch (err) {
    console.error(err);
    setMessage("Delete failed");
  }
};

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchSearch =
        lead.name?.toLowerCase().includes(search.toLowerCase()) ||
        lead.mobile?.includes(search);

      const matchStatus = statusFilter ? lead.status === statusFilter : true;

      const matchDate = dateFilter
        ? new Date(lead.createdAt).toDateString() ===
          new Date(dateFilter).toDateString()
        : true;

      return matchSearch && matchStatus && matchDate;
    });
  }, [leads, search, statusFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / rowsPerPage));

  const paginatedLeads = filteredLeads.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const selectStyle = {
    color: "#fff",
    ".MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
    "& .MuiSvgIcon-root": { color: "#fff" },
  };

  const STATUS_OPTIONS = [
    { value: "", label: "All Status" },
    { value: "new", label: "New" },
    { value: "interested", label: "Interested" },
    { value: "not_interested", label: "Not Interested" },
    { value: "follow_up", label: "Follow Up" },
  ];

  return (
    <ProtectedRoute>
      <Navbar />

      <Box sx={{ p: { xs: 2, md: 3 }, mt: 5, background: "#000", minHeight: "100vh" }}>

        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            gap: 2,
            mb: 3,
          }}
        >
          {/* FILTERS */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              width: { xs: "100%", md: "auto" },
            }}
          >
            <TextField
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              fullWidth
              sx={{
                input: { color: "#fff" },
                width: { md: "200px" },
              }}
            />

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
              fullWidth
              sx={{
                ...selectStyle,
                width: { md: "180px" },
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>

            <TextField
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              size="small"
              fullWidth
              sx={{
                input: { color: "#fff" },
                width: { md: "180px" },
              }}
            />
          </Box>

          {/* DOWNLOAD BUTTON */}
        {role === "admin" && (
  <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 1,
    }}
  >
    <Button
      variant="contained"
      color="error"
      onClick={() => deleteAllLeads("excel")}
    >
      Delete Excel
    </Button>

    <Button
      variant="contained"
      color="error"
      onClick={() => deleteAllLeads("contact")}
    >
      Delete Contact
    </Button>

    <Button
      variant="contained"
      color="error"
      onClick={() => deleteAllLeads("all")}
    >
      Delete All
    </Button>

    <Button
      variant="contained"
      startIcon={<DownloadIcon />}
      onClick={() => setDownloadOpen(true)}
    >
      Download Leads
    </Button>
  </Box>
)}
        </Box>

        {message && <Alert>{message}</Alert>}

        {/* TABLE */}
        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                <TableCell sx={{ color: "#fff" }}>Email</TableCell>
                <TableCell sx={{ color: "#fff" }}>Mobile</TableCell>
                <TableCell sx={{ color: "#fff" }}>
  Insurance Type
</TableCell>

<TableCell sx={{ color: "#fff" }}>
  Message
</TableCell>

<TableCell sx={{ color: "#fff" }}>
  Source
</TableCell>
                <TableCell sx={{ color: "#fff" }}>Status</TableCell>
                <TableCell sx={{ color: "#fff" }}>Call</TableCell>
                <TableCell sx={{ color: "#fff" }}>Feedback</TableCell>
                <TableCell sx={{ color: "#fff" }}>Delete</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedLeads.map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell sx={{ color: "#fff" }}>{lead.name}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{lead.email || "-"}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{lead.mobile}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>
  {lead.insuranceType || "-"}
</TableCell>

<TableCell sx={{ color: "#fff" }}>
  {lead.message || "-"}
</TableCell>

<TableCell sx={{ color: "#fff" }}>
  {lead.source === "contact"
    ? "Contact Form"
    : "Excel"}
</TableCell>

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
                      onBlur={(e) =>
                        updateLead(lead._id, "feedback", e.target.value)
                      }
                      size="small"
                      sx={{
                        input: { color: "#fff" },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#555" },
                          "&:hover fieldset": { borderColor: "#888" },
                          "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
  {role === "admin" && (
    <Button
      color="error"
      variant="contained"
      size="small"
      startIcon={<DeleteIcon />}
      onClick={() => deleteLead(lead._id)}
    >
      Delete
    </Button>
  )}
</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* PAGINATION */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography sx={{ color: "#aaa", mb: 1 }}>
            Showing {paginatedLeads.length} of {filteredLeads.length} leads
          </Typography>

          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#fff",
                border: "1px solid #555",
              },
              "& .Mui-selected": {
                backgroundColor: "#1976d2",
                color: "#fff",
              },
            }}
          />
        </Box>
      </Box>
    </ProtectedRoute>
  );
}