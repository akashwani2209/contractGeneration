const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');

const app = express();
const port = 3002;

let dynamicFilename = 'Contract2.pdf';

// Create OAuth 2.0 client
const oAuth2Client = new google.auth.OAuth2(
  client_id='234569330265-0ktltmdpbk2mvrqneo0cqkoc2vrdpksr.apps.googleusercontent.com',
  client_secret='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',
  redirect_uris='https://www.google.com/',
);

// Set the credentials on the OAuth2 client
oAuth2Client.setCredentials({
  access_token: 'ya29.a0AfB_byDGMx5gnyu1E1NoZAvgBMxc6zasPM5hegpivzTMIvFK4iBm0G6MUVK23RZA252RU9Qdwc7meHGFAtlZm0Sb-D7YPb_MZJfH_yeQGcxuVRtKvOUAzmm7Nr23pgMOJSKLASRTv2AXm9GmD-8jJtrxwWrfGpqd2eRXaCgYKAUoSARASFQHGX2MicGLpMkWxEjVS4tZptymEhw0171',
  refresh_token: '1//04GYzwgtQGCPSCgYIARAAGAQSNwF-L9IrQupyVE36cw8Yl7Jz426sTIoMZBCz9ttXe1defCeUWI-bKe8Oy-FMhZdSfBkf6A_Or24',
});

// Create a Google Drive instance
const drive = google.drive({ version: 'v3', auth: oAuth2Client });

// Example: Get the file metadata (id) from Google Drive
drive.files.list({
  q: "mimeType='application/pdf' and name='Contract2.pdf'",
}, (err, res) => {
  if (err) return console.error('The API returned an error:', err.message);

  const files = res.data.files;
  if (files.length) {
    const fileId = files[0].id;

    // Example: Generate a PDF preview link using Google Drive Viewer
    const previewLink = `https://drive.google.com/viewerng/viewer?embedded=true&url=https://drive.google.com/uc?id=${fileId}`;

    // Start a local server to serve the HTML page with the PDF preview link
    app.get('/', (req, res) => {
      res.send(`<iframe src="${previewLink}" width="100%" height="600" frameborder="0"></iframe>`);
    });

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:3002`);
    });
  } else {
    console.log('No PDF file found.');
  }
});
