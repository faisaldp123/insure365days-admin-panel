"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import API from "@/lib/api";

import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function CreateEmployee() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [open, setOpen] = useState(false); // ✅ modal

  // pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/auth/users");
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      setMsg("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      await API.post("/auth/register", {
        ...form,
        role: "employee",
      });

      setMsg("✅ Employee created successfully");

      setForm({ name: "", email: "", password: "" });

      fetchEmployees();
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(employees.length / rowsPerPage));

  const paginatedEmployees = employees.slice(
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
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff" }}>
            Employee List
          </Typography>

          <Button
            variant="contained"
            onClick={() => {
              setOpen(true);
              setMsg("");
            }}
          >
            Add Employee
          </Button>
        </Box>

        {/* TABLE */}
        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedEmployees.map((emp) => (
                <TableRow key={emp._id}>
                  <TableCell sx={{ color: "#fff" }}>
                    {emp.name}
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }}>
                    {emp.email}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* PAGINATION */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
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

        {/* MODAL */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle>Create Employee</DialogTitle>

          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              size="small"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <TextField
              label="Email"
              size="small"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <TextField
              label="Password"
              type="password"
              size="small"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            {msg && (
              <Typography sx={{ fontSize: 14 }}>
                {msg}
              </Typography>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>

            <Button
              variant="contained"
              onClick={handleCreate}
              sx={{
                backgroundColor: loading ? "#555" : "#1976d2",
              }}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ProtectedRoute>
  );
}