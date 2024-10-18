// InputPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

function InputPage() {
  const [firstName, setFirstName] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("No Experience");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleSummarize = async () => {
    console.log("handleSummarize called with:", {
      firstName,
      experienceLevel,
      url,
    });
    if (!firstName || !url) {
      alert("Please enter both your name and a valid URL.");
      console.warn("Missing input: firstName or url");
      return;
    }

    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      if (/^localhost/i.test(url)) {
        formattedUrl = "http://" + url;
      } else {
        formattedUrl = "https://" + url;
      }
    }

    console.log("Formatted URL:", formattedUrl);

    try {
      const backendCall = `http://localhost:3001/summarize`;
      console.log("Sending request to backend:", backendCall);
      const response = await fetch(backendCall, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          experienceLevel,
          url: formattedUrl,
        }),
      });
      const data = await response.json();
      console.log("Response from backend:", data);
      if (data.summaryId) {
        navigate(`/summary/${data.summaryId}`);
      } else {
        alert(`An error occurred: ${data.error || "Unknown error occurred."}`);
        console.error("Backend error:", data.error);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <Container maxWidth="sm" className="container">
      <Typography variant="h4" gutterBottom>
        Knowledge Base Summarizer
      </Typography>
      <Typography variant="body1" gutterBottom>
        Enter your details below to get a summary of the page, including
        important images associated with the information.
      </Typography>
      <TextField
        label="Your first name"
        fullWidth
        margin="normal"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Technology experience level</InputLabel>
        <Select
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
        >
          <MenuItem value="No Experience">No Experience</MenuItem>
          <MenuItem value="Beginner">Beginner</MenuItem>
          <MenuItem value="Intermediate">Intermediate</MenuItem>
          <MenuItem value="Expert">Expert</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Page to summarize"
        fullWidth
        margin="normal"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSummarize}
        sx={{ marginTop: "1rem" }}
      >
        Summarize
      </Button>
    </Container>
  );
}

export default InputPage;
