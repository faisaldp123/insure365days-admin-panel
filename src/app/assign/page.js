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
  const [leadSource, setLeadSource] = useState("all");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leadsRes, contactsRes, usersRes] = await Promise.all([
        API.get("/leads"),
        API.get("/contact"),
        API.get("/auth/users"),
      ]);

      const excelLeads = (leadsRes.data || []).map((lead) => ({
        ...lead,
        source: "excel",
      }));

      const contactLeads = (contactsRes.data || []).map((contact) => ({
        ...contact,
        source: "contact",
      }));

      setLeads([...excelLeads, ...contactLeads]);
      setEmployees(usersRes.data || []);
    } catch (err) {
      console.error(err);
    }
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

    try {
      await API.post("/leads/assign", {
        leadIds: selected,
        employeeId,
      });

      alert("Assigned Successfully!");
      setSelected([]);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Assignment failed");
    }
  };

  const filteredLeads =
    leadSource === "all"
      ? leads
      : leads.filter((lead) => lead.source === leadSource);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLeads.length / rowsPerPage)
  );

  const paginatedLeads = filteredLeads.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const selectStyle = {
    width: { xs: "100%", md: "250px" },

    "& .MuiInputLabel-root": {
      color: "#fff",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#fff",
    },

    "& .MuiOutlinedInput-root": {
      color: "#fff",

      "& fieldset": {
        borderColor: "#555",
      },

      "&:hover fieldset": {
        borderColor: "#888",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#1976d2",
      },
    },

    "& .MuiSvgIcon-root": {
      color: "#fff",
    },
  };

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
        <Typography
          variant="h6"
          sx={{ color: "#fff", mb: 3 }}
        >
          Assign Leads to Employee
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#fff",
                mb: 1,
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Assign To Employee
            </Typography>

            <TextField
              select
              label="Select Employee"
              value={employeeId}
              onChange={(e) =>
                setEmployeeId(e.target.value)
              }
              size="small"
              sx={selectStyle}
            >
              {employees.map((emp) => (
                <MenuItem
                  key={emp._id}
                  value={emp._id}
                >
                  {emp.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box>
            <Typography
              sx={{
                color: "#fff",
                mb: 1,
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Filter Lead Source
            </Typography>

            <TextField
              select
              label="Lead Source"
              value={leadSource}
              onChange={(e) => {
                setLeadSource(e.target.value);
                setPage(1);
              }}
              size="small"
              sx={selectStyle}
            >
              <MenuItem value="all">
                All Leads
              </MenuItem>

              <MenuItem value="excel">
                Excel Leads
              </MenuItem>

              <MenuItem value="contact">
                Contact Form Leads
              </MenuItem>
            </TextField>
          </Box>
        </Box>

        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>
                  Select
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  Name
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  Email
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  Mobile
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  Insurance Type
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  Message
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  Remarks
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  Source
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedLeads.map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(
                        lead._id
                      )}
                      onChange={() =>
                        handleSelect(lead._id)
                      }
                      sx={{
                        color: "#fff",
                      }}
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

                  <TableCell sx={{ color: "#fff" }}>
                    {lead.insuranceType || "-"}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "#fff",
                      maxWidth: "250px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {lead.message || "-"}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "#fff",
                      maxWidth: "250px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {lead.remarks || "-"}
                  </TableCell>

                  <TableCell sx={{ color: "#fff" }}>
                    {lead.source === "excel"
                      ? "Excel"
                      : "Contact Form"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <Button
          variant="contained"
          onClick={assign}
          sx={{
            mt: 3,
            width: {
              xs: "100%",
              md: "auto",
            },
          }}
        >
          Assign Selected Leads
        </Button>

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
            onChange={(e, value) =>
              setPage(value)
            }
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
