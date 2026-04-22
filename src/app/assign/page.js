"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import API from "@/lib/api";
import { Box, Button, TextField, MenuItem } from "@mui/material";

export default function Assign() {
  const [leads, setLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);
  const [employeeId, setEmployeeId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const leadsRes = await API.get("/leads");
    const usersRes = await API.get("/auth/users"); // need backend route

    setLeads(leadsRes.data);
    setEmployees(usersRes.data);
  };

  const assign = async () => {
    await API.post("/leads/assign", {
      leadIds: selected,
      employeeId,
    });

    alert("Assigned!");
  };

  return (
    <ProtectedRoute>
      <Navbar />

      <Box p={3}>
        <TextField
          select
          label="Select Employee"
          fullWidth
          onChange={(e) => setEmployeeId(e.target.value)}
        >
          {employees.map((emp) => (
            <MenuItem key={emp._id} value={emp._id}>
              {emp.name}
            </MenuItem>
          ))}
        </TextField>

        <Button sx={{ mt: 2 }} variant="contained" onClick={assign}>
          Assign Selected Leads
        </Button>
      </Box>
    </ProtectedRoute>
  );
}