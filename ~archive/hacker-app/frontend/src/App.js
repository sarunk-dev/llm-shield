import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

function App() {
  const [visitors, setVisitors] = useState([]);

  const fetchVisitors = () => {
    fetch("http://localhost:2001/visitors")
      .then((response) => response.json())
      .then((data) => setVisitors(data))
      .catch((error) => console.error("Error fetching visitors:", error));
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      {/* Main Heading */}
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Visitor Information
      </Typography>

      {/* Refresh Button */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<RefreshIcon />}
        onClick={fetchVisitors}
        style={{ marginBottom: "1rem" }}
      >
        Refresh Table
      </Button>

      {/* Visitor Table */}
      <TableContainer component={Paper}>
        <Table aria-label="visitor table">
          <TableHead>
            <TableRow>
              <TableCell>IP</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date Visited</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visitors.map((visitor, index) => (
              <TableRow key={index}>
                <TableCell>{visitor.ip}</TableCell>
                <TableCell>{visitor.name}</TableCell>
                <TableCell>{visitor.dateVisited}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App;
