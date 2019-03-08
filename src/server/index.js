/* global __dirname */

/**
 * An express web server that serves the file picker frontend app and provides
 * a dummy implementation of the LMS backend.
 */

const querystring = require('querystring');

const Bundler = require('parcel-bundler');
const express = require('express');
const bodyParser = require('body-parser');
const mustache = require('mustache');

const { listFiles } = require('./fake-lms-storage');

const app = express();
const options = {};
const bundler = new Bundler(`${__dirname}/../index.js`, options);
const lmsName = 'Canvas';

// Map of auth token to authentication state.
const isAuthenticated = {};

app.use('/assets/icons', express.static(`${__dirname}/../icons`));
app.use(bundler.middleware());
app.use(bodyParser.urlencoded({ extended: true }));

// Add some fake latency to all requests to make UI behavior more realistic in
// development.
app.use((req, res, next) => {
  const fakeLatencyMs = 300;
  setTimeout(next, fakeLatencyMs);
});

/**
 * Endpoint provided by the LMS backend to receive the authorization code from
 * the LMS endpoint.
 *
 * This will exchange the authorization code for an access/refresh token pair,
 * save the token locally to handle future API calls, and then return a trivial
 * HTML page which closes the popup window. When the popup window closes, the
 * client code will try to fetch files from the LMS.
 */
app.get('/oauth_redirect', (req, res) => {
  const authToken = req.query.state;
  isAuthenticated[authToken] = true;
  res.send(`
  <html>
    <body>
      <p>Authorization has completed. Please close this window.</p>
      <script>
        window.close();
      </script>
    </body>
  </html>
  `);
});

/**
 * Fake LMS OAuth authorization endpoint.
 *
 * This will prompt the user to approve access and then redirect back to the
 * LMS backend.
 */
app.get('/fake_lms_oauth_authorize', (req, res) => {
  const redirect_uri = req.query.redirect_uri;
  const authToken = req.query.state;
  const html = mustache.render(`
    <html>
      <body>
        <style>
          body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        </style>
        <p>
          <b>Hypothesis wants to access your files in {{ lmsName }}. Click "Authorize"
          to allow this.</b>
        </p>
        <form action="${redirect_uri}" method="GET">
          <input type="hidden" name="state" value="${authToken}">
          <button>Authorize</button>
        </form>
      </body>
    </html>
  `, { lmsName });
  res.send(html);
});

/**
 * Endpoint used by the LMS frontend to launch the LMS authorization flow.
 * The LMS frontend will open this in a popup window. It will then redirect the
 * user to the LMS's authorization endpoint.
 */
app.get('/authorize_lms_file_access', (req, res) => {
  const authToken = req.query.auth_token;
  const query = querystring.stringify({
    response_type: 'code',
    client_id: 'dummy_client_id',
    redirect_uri: '/oauth_redirect',
    scope: 'files',
    state: authToken,
  });

  // Redirect the user to the LMS's authorization server.
  res.redirect(`/fake_lms_oauth_authorize?${query}`);
});

/**
 * API used by the LMS frontend to list files available to the LMS user.
 *
 * In the real server, this would check the user's authentication state and
 * either inform the client code that it needs to launch the LMS authorization
 * flow or would use the saved access token to make a call to the LMS's files
 * API.
 */
app.get('/lms_files', (req, res) => {
  // TODO - Use `Bearer ${TOKEN}` format for auth header.
  const authToken = req.headers.authorization;
  if (!isAuthenticated[authToken]) {
    res.status(403).json({
      status: 'failure',
      reason: 'User has not authorized access to the LMS',
    });
    return;
  }

  const path = req.query.path || '/';
  const files = listFiles(path);
  res.json({ files });
});

const randomHexString = () => Math.random().toString(16).slice(2);

/**
 * Homepage route for LMS file picker.
 *
 * This generates a dummy auth token on each load to represent the user's
 * identity and then renders the file picker form.
 */
app.get('/', (req, res) => {
  // An authentication token that the frontend should include in any API
  // calls to the backend.
  const authToken = randomHexString();

  // A hint as to whether the backend believes that the user has authorized
  // access to their LMS files or not. This is used to optimize the UX flow.
  const isLmsFileAccessAuthorized = false;

  const html = mustache.render(
    `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/index.css">
  </head>
  <body>
    <script type="application/json" class="js-hypothesis-config">
      {
        "authToken": "{{ authToken }}",
        "isLmsFileAccessAuthorized": "{{ isLmsFileAccessAuthorized }}",
        "lmsName": "{{ lmsName }}"
      }
    </script>
    <div id="app"></div>
    <script src="/index.js"></script>
  </body>
</html>
`,
    { authToken, isLmsFileAccessAuthorized, lmsName }
  );
  res.send(html);
});

app.post('/', (req, res) => {
  const { source, path } = req.body;
  const html = mustache.render(
    `
<html>
<body>
<p>
  You selected <b>{{ path }}</b> from <b>{{ source }}</b>
</html>
`,
    { path, source }
  );
  res.send(html);
});

app.listen(8080);
