import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useParams } from "react-router-dom";

function SummaryPage() {
  const { id } = useParams();
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/summary/${id}`)
      .then((response) => response.json())
      .then((data) => setSummaryData(data))
      .catch((error) => console.error("Error:", error));
  }, [id]);

  if (!summaryData) {
    return (
      <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
        <Typography variant="h5">Loading summary...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Summary
      </Typography>
      <Typography variant="body1" paragraph>
        {summaryData.summaryText}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Notable Images
      </Typography>
      {summaryData.images.map((image, index) => (
        <Card key={index} style={{ marginBottom: "1rem" }}>
          <CardMedia
            component="img"
            image={image.url}
            alt={`Image ${index + 1}`}
          />
          <CardContent>
            <Typography variant="body1">{image.caption}</Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

export default SummaryPage;
