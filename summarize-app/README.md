# Summary App

## Description

Frontend:
two pages:
one page that basically takes a URL where something like:

Knowledge Base Summarizer:
Enter link below to get a summary of the URL, additionally includes important images associated with the information
The a dynamic button. Once clicked, it passes in the URL to the backend: backend-endpoint/summarize=<URL>
the dyanmic button turns into a spinny wheel and waits for a server response. The server response will respond with the summary-id
The same button turns into a "view summary" which visits backend-endpoint/summary=<summary-id>

After URL is entered, and the summary is generated, the website is redirected to a summary page that renders the summarized content in this general format

1. Summary - followed with a long text of the summary
2. Notable images - rendered images and a caption for the image, and why its important to the summary

Backend:

express app 
backend-endpoint/summarize=<URL>
  This invokes a scapper that vists a simple website and take the


backend-endpoint/summary=<summary-id>
  This returns summary text and image/captions
  This is stored in memory.


# Running
`docker-compose build --no-cache`
