// SummaryPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Container, Button } from '@mui/material';

function SummaryPage() {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`http://localhost:3001/summary/${id}`);
        const data = await response.json();
        if (data) {
          setSummary(data);
        } else {
          setError('Summary not found.');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error loading summary.');
      }
    };

    fetchSummary();
  }, [id]);

  return (
    <Container maxWidth="sm" className="container">
      {error ? (
        <Typography variant="h5">{error}</Typography>
      ) : summary ? (
        <>
          <Typography variant="h4" gutterBottom>
            Summary
          </Typography>
          <Typography variant="body1" gutterBottom>
            {summary.summaryText}
          </Typography>
          <Typography variant="h5" gutterBottom>
            Notable Images
          </Typography>
          {summary.images.map((image, index) => (
            <div key={index} className="image-card">
              <img src={image.url} alt={`Image ${index + 1}`} />
              <Typography variant="body2">{image.caption}</Typography>
            </div>
          ))}
        </>
      ) : (
        <Typography variant="h5">Loading...</Typography>
      )}
      <Button variant="contained" color="secondary" onClick={() => navigate('/')} sx={{ marginTop: '1rem' }}>
        Back to Input Page
      </Button>
    </Container>
  );
}

export default SummaryPage;
