"use client";

import { useEffect, useState, useMemo } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import API from "@/lib/api";

import {
  Table, TableHead, TableRow, TableCell, TableBody,
  TextField, Box, Pagination, Typography
} from "@mui/material";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, dateFilter]);

  const fetchContacts = async () => {
    try {
      const res = await API.get("/contact");
      const data = Array.isArray(res.data) ? res.data : [];
      setContacts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // FILTER
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchSearch =
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.mobile?.includes(search) ||
        c.email?.toLowerCase().includes(search.toLowerCase());

      const matchDate = dateFilter
        ? new Date(c.createdAt).toDateString() ===
          new Date(dateFilter).toDateString()
        : true;

      return matchSearch && matchDate;
    });
  }, [contacts, search, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / rowsPerPage));

  const paginatedContacts = filteredContacts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <ProtectedRoute>
      <Navbar />

      <Box sx={{ p: 3, mt: 5, background: "#000", minHeight: "100vh" }}>

        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >
          {/* FILTERS */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ input: { color: "#fff" } }}
            />

            <TextField
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              size="small"
              sx={{ input: { color: "#fff" } }}
            />
          </Box>
        </Box>

        {/* TABLE */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Mobile</TableCell>
              <TableCell sx={{ color: "#fff" }}>Message</TableCell>
              <TableCell sx={{ color: "#fff" }}>Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedContacts.map((c) => (
              <TableRow key={c._id}>
                <TableCell sx={{ color: "#fff" }}>{c.name}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{c.email}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{c.mobile}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{c.message}</TableCell>
                <TableCell sx={{ color: "#fff" }}>
                  {new Date(c.createdAt).toLocaleString()}
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
            Showing {paginatedContacts.length} of {filteredContacts.length} contacts
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
    </ProtectedRoute>
  );
}