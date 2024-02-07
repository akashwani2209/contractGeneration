const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');

const app = express();
const port = 3000;

const oAuth2Client = new google.auth.OAuth2({
  client_id: '234569330265-0ktltmdpbk2mvrqneo0cqkoc2vrdpksr.apps.googleusercontent.com',
  client_secret: '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',
  redirect_uris: ['https://www.google.com/'],
});

oAuth2Client.setCredentials({
  access_token: 'ya29.a0AfB_byBZEGdqDKGwXDL86Sq3YsVJnhchgiLM7KwLk-0kC9rQMSfhmDisbHW-nFqXu9jk-FghMkkw80miRWIstXrsaeDmVI47T7UiYGLXMnp9GeLNtMYuzWqnSk_CoKBIMcdzcbKqL7JNmXXFTvld97f964my1-pCNHtHaCgYKAQQSARASFQHGX2MidugocnuU6uFKrK5vNeHZgQ0171',
  refresh_token: '1//041blexSdt3hPCgYIARAAGAQSNwF-L9IrLt3eeiWj6ELpLOBy2iKn20Y2NRrzTH-ROT5lwMBlft5bOxun-t8VqKprVREuGJMGDYs',
});
const drive = google.drive({ version: 'v3', auth: oAuth2Client });

drive.files.list({
  q: "mimeType='application/vnd.google-apps.document' and name='Example1'",
}, (err, res) => {
  if (err) return console.error('The API returned an error:', err.message);

  const files = res.data.files;
  if (files.length) {
    const fileId = files[0].id;

    const previewLink = `https://docs.google.com/viewer?url=https://drive.google.com/uc?id=${fileId}`;

    app.get('/', (req, res) => {
      res.send(`<iframe src="${previewLink}" width="100%" height="600" frameborder="0"></iframe>`);
    });

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } else {
    console.log('No Google Docs file found.');
  }
});
