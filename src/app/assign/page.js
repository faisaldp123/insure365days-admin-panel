"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import API from "@/lib/api";

import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
} from "@mui/material";

export default function Assign() {
  const [leads, setLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);
  const [employeeId, setEmployeeId] = useState("");

  // ✅ pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const leadsRes = await API.get("/leads");
    const usersRes = await API.get("/auth/users");

    setLeads(leadsRes.data);
    setEmployees(usersRes.data);
  };

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const assign = async () => {
    if (!employeeId || selected.length === 0) {
      alert("Select employee and leads");
      return;
    }

    await API.post("/leads/assign", {
      leadIds: selected,
      employeeId,
    });

    alert("Assigned Successfully!");
    setSelected([]);
  };

  // ✅ pagination logic
  const totalPages = Math.max(1, Math.ceil(leads.length / rowsPerPage));

  const paginatedLeads = leads.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <ProtectedRoute>
      <Navbar />

      <Box
        sx={{
          p: { xs: 2, md: 3 },
          mt: { xs: 3, md: 5 },
          background: "#000",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
          Assign Leads to Employee
        </Typography>

        {/* ✅ COMPACT EMPLOYEE SELECT */}
        <TextField
          select
          label="Select Employee"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          size="small" // ✅ makes it short
          sx={{
            mb: 2,
            width: { xs: "100%", md: "250px" }, // ✅ not too wide
            input: { color: "#fff" },
            label: { color: "#aaa" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#555" },
            },
            "& .MuiSvgIcon-root": {
              color: "#fff",
            },
          }}
        >
          {employees.map((emp) => (
            <MenuItem key={emp._id} value={emp._id}>
              {emp.name}
            </MenuItem>
          ))}
        </TextField>

        {/* TABLE */}
        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>Select</TableCell>
                <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                <TableCell sx={{ color: "#fff" }}>Email</TableCell>
                <TableCell sx={{ color: "#fff" }}>Mobile</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedLeads.map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(lead._id)}
                      onChange={() => handleSelect(lead._id)}
                      sx={{ color: "#fff" }}
                    />
                  </TableCell>

                  <TableCell sx={{ color: "#fff" }}>
                    {lead.name}
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }}>
                    {lead.email}
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }}>
                    {lead.mobile}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* BUTTON */}
        <Button
          variant="contained"
          onClick={assign}
          sx={{
            mt: 3,
            width: { xs: "100%", md: "auto" },
          }}
        >
          Assign Selected Leads
        </Button>

        {/* ✅ PAGINATION */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
          }}
        >
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