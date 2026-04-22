"use client";

import { useEffect, useState } from "react";
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
} from "@mui/material";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data } = await API.get("/leads");
      setLeads(data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateLead = async (id, field, value) => {
    try {
      await API.put(`/leads/${id}`, { [field]: value });
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ White TextField Style for Dark UI
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

      <Box
        p={3}
        sx={{
          backgroundColor: "#000",
          minHeight: "100vh",
        }}
      >
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
            {leads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell sx={{ color: "#fff" }}>
                  {lead.name}
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  {lead.mobile}
                </TableCell>

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
            ))}
          </TableBody>
        </Table>
      </Box>
    </ProtectedRoute>
  );
}