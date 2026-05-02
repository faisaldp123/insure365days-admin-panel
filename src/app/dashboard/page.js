"use client";

import { useEffect, useState, useMemo } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import API from "@/lib/api";

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
  const rowsPerPage = 10; // ✅ 10 per page

  // Download modal
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [dlFromDate, setDlFromDate] = useState("");
  const [dlToDate, setDlToDate] = useState("");
  const [dlStatus, setDlStatus] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  // ✅ Reset page when filters change
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

  // FILTER TABLE
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

  // ✅ Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / rowsPerPage));

  const paginatedLeads = filteredLeads.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // DOWNLOAD FILTER
  const getDownloadLeads = () => {
    return leads.filter((lead) => {
      const matchStatus = dlStatus ? lead.status === dlStatus : true;

      const leadDate = new Date(lead.createdAt);
      const from = dlFromDate ? new Date(dlFromDate + "T00:00:00") : null;
      const to = dlToDate ? new Date(dlToDate + "T23:59:59") : null;

      return (!from || leadDate >= from) && (!to || leadDate <= to) && matchStatus;
    });
  };

  // DOWNLOAD FUNCTION
  const handleDownload = () => {
    const data = getDownloadLeads();

    if (data.length === 0) {
      alert("No leads found");
      return;
    }

    const headers = ["Name", "Mobile", "Status", "Call", "Feedback", "Date"];

    const rows = data.map((l) => [
      l.name || "",
      l.mobile || "",
      l.status || "",
      l.callStatus || "",
      l.feedback || "",
      l.createdAt ? new Date(l.createdAt).toLocaleString() : "",
    ]);

    const csv =
      "\uFEFF" +
      [headers, ...rows]
        .map((r) => r.map((c) => `"${c}"`).join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const fileName = `leads_${dlStatus || "all"}_${dlFromDate || "start"}_${dlToDate || "end"}.csv`;

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
    setDownloadOpen(false);
  };

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

      <Box sx={{ p: 3, mt: 5, background: "#000", minHeight: "100vh" }}>

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
          {/* LEFT FILTERS */}
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
              size="small"
              sx={selectStyle}
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
              sx={{ input: { color: "#fff" } }}
            />
          </Box>

          {/* RIGHT DOWNLOAD */}
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => setDownloadOpen(true)}
          >
            Download Leads
          </Button>
        </Box>

        {message && <Alert>{message}</Alert>}

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
                    onBlur={(e) =>
                      updateLead(lead._id, "feedback", e.target.value)
                    }
                    size="small"
                    sx={{ input: { color: "#fff" } }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography sx={{ color: "#aaa" }}>
            Showing {paginatedLeads.length} of {filteredLeads.length} leads
          </Typography>

          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            shape="rounded"
          />
        </Box>
      </Box>

      {/* DOWNLOAD MODAL */}
      <Dialog open={downloadOpen} onClose={() => setDownloadOpen(false)}>
        <DialogTitle>
          <FilterListIcon /> Download Leads
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Select value={dlStatus} onChange={(e) => setDlStatus(e.target.value)}>
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>

          <TextField
            type="date"
            label="From"
            value={dlFromDate}
            onChange={(e) => setDlFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            type="date"
            label="To"
            value={dlToDate}
            onChange={(e) => setDlToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDownloadOpen(false)}>Cancel</Button>
          <Button onClick={handleDownload} variant="contained">
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </ProtectedRoute>
  );
}