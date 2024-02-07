const express = require('express');
const { google } = require('googleapis');

const app = express();
const port = 3002;

let editLinkDoc = ''; // Variable to store the edit link

// Create OAuth 2.0 client
const oAuth2Client = new google.auth.OAuth2({
  client_id: '234569330265-0ktltmdpbk2mvrqneo0cqkoc2vrdpksr.apps.googleusercontent.com',
  client_secret: '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',
  redirect_uris: 'https://www.google.com/',
});


// Set the credentials on the OAuth2 client
oAuth2Client.setCredentials({
  access_token: 'ya29.a0AfB_byC0n5LzRFGJdgLkWTp0SgfKVJ4R4_JTcKkUNY-Ya0mwZs7UAw0wr6eYA4bkhwo9q2TGpg6Om3qIX_RLcATPyuD1Tg2tH8oIH23qCH5L1H-nVsrrACvQ9Mjq3O8XJYKQRDjyz_qgP7M5C0QIN7M8_grYcFPU0OhPiQaCgYKASoSARASFQHGX2MieBFCF7v4J-GwAw-P_DxYuw0173',
  refresh_token: '1//04TDXzge_fgKHCgYIARAAGAQSNwF-L9Ir8TZJXctJEPlsvSBeE_CgI5FQ23AnBYhTJKJKYSw1tbVnmMiAByasozWxBo4fBjVdiwU',
});
// Create a Google Drive instance
const drive = google.drive({ version: 'v3', auth: oAuth2Client });

// Function to generate preview link based on file ID
function generatePreviewLink(fileId) {
  return `https://drive.google.com/viewerng/viewer?embedded=true&url=https://drive.google.com/uc?id=${fileId}`;
}

// Example: Get the file metadata (id) from Google Drive for Contract2.pdf
drive.files.list({
  q: "mimeType='application/pdf' and name='Contract2.pdf'",
}, (errPdf, resPdf) => {
  if (errPdf) return console.error('Error fetching Contract2.pdf:', errPdf.message);

  const filesPdf = resPdf.data.files;
  if (filesPdf.length) {
    const fileIdPdf = filesPdf[0].id;
    const previewLinkPdf = generatePreviewLink(fileIdPdf);

    // Start a local server to serve the HTML page with the PDF preview link
    app.get('/pdf', (req, res) => {
      res.send(`<iframe src="${previewLinkPdf}" width="100%" height="600" frameborder="0"></iframe>`);
    });

    console.log('PDF preview link:', previewLinkPdf);
  } else {
    console.log('No PDF file found.');
  }

  // Example: Get the file metadata (id) from Google Drive for Contract2.doc
  drive.files.list({
    q: "mimeType='application/msword' and name='Contract2.doc'",
  }, (errDoc, resDoc) => {
    if (errDoc) return console.error('Error fetching Contract2.doc:', errDoc.message);

    const filesDoc = resDoc.data.files;
    if (filesDoc.length) {
      const fileIdDoc = filesDoc[0].id;

      // Generate the Google Docs edit link using the file ID
      editLinkDoc = `https://docs.google.com/document/d/${fileIdDoc}/edit`;

      app.get('/getEditLink', (req, res) => {
        res.json({ editLinkDoc });
      });

      console.log('Google Docs edit link:', editLinkDoc);
    } else {
      console.log('No Doc file found.');
    }

    // Start the server after checking both files
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  });
});
