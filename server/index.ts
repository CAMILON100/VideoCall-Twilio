import './bootstrap-globals';
import { createExpressHandler } from './createExpressHandler';
import express, { RequestHandler } from 'express';
import path from 'path';
import { ServerlessFunction } from './types';
import fs from 'fs';

/* const options = {
  key: fs.readFileSync("../../../../../../etc/letsencrypt/live/fitafter50.ml/privkey.pem"),
  cert: fs.readFileSync("../../../../../../etc/letsencrypt/live/fitafter50.ml/cert.pem")
}; */


const PORT = process.env.PORT ?? 8081;

const app = express();
const server = require('http').createServer(app);
app.use(express.json());

// This server reuses the serverless endpoints from the "plugin-rtc" Twilio CLI Plugin, which is used when the "npm run deploy:twilio-cli" command is run.
// The documentation for this endpoint can be found in the README file here: https://github.com/twilio-labs/plugin-rtc
const tokenFunction: ServerlessFunction = require('@twilio-labs/plugin-rtc/src/serverless/functions/token').handler;
const tokenEndpoint = createExpressHandler(tokenFunction);

const noopMiddleware: RequestHandler = (_, __, next) => next();
const authMiddleware =
  process.env.REACT_APP_SET_AUTH === 'firebase' ? require('./firebaseAuthMiddleware') : noopMiddleware;

app.all('/token', authMiddleware, tokenEndpoint);

app.use((req, res, next) => {
  // Here we add Cache-Control headers in accordance with the create-react-app best practices.
  // See: https://create-react-app.dev/docs/production-build/#static-file-caching
  if (req.path === '/' || req.path === 'index.html') {
    res.set('Cache-Control', 'no-cache');
  } else {
    res.set('Cache-Control', 'max-age=31536000');
  }
  next();
});
app.use(express.static(path.join(__dirname, '../build')));

app.get('*', (_, res) => {
  // Don't cache index.html
  res.set('Cache-Control', 'no-cache');
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

server.listen(PORT, () => console.log(`twilio-video-app-react server running on ${PORT}`));
