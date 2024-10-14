import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function InputPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      if (/^localhost/i.test(url)) {
        formattedUrl = 'http://' + url;
      } else {
        formattedUrl = 'https://' + url;
      }
    }

    setLoading(true);
    const backendCall = `http://localhost:3001/summarize?url=${encodeURIComponent(formattedUrl)}`;
    console.log(`Fetching from: ${backendCall}`);
    fetch(backendCall)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.summaryId) {
          // Redirect to the summary page
          navigate(`/summary/${data.summaryId}`);
        } else {
          alert(`An error occurred: ${data.error || 'Unknown error occurred.'}`);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
        alert(`An error occurred: ${error.message}`);
      });
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Knowledge Base Summarizer
      </Typography>
      <Typography variant="body1" gutterBottom>
        Enter a link below to get a summary of the URL, including important images associated with the information.
      </Typography>
      <TextField
        fullWidth
        label="URL"
        variant="outlined"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading || !url}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Summarize'}
      </Button>
    </Container>
  );
}

export default InputPage;