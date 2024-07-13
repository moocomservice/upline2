const functions = require('firebase-functions');
const express = require('express');
const { ngExpressEngine } = require('@nguniversal/express-engine');
const path = require('path');

async function createApp() {
  const { AppServerModuleNgFactory } = await import(path.resolve(__dirname, '../dist/upline2/server/main.server.mjs'));

  const app = express();

  app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory
  }));

  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, '../dist/upline2/browser'));

  app.get('*.*', express.static(path.join(__dirname, '../dist/upline2/browser'), {
    maxAge: '1y'
  }));

  app.get('*', (req, res) => {
    res.render('index', { req });
  });

  return app;
}

const ssrApp = functions.https.onRequest(async (req, res) => {
  const app = await createApp();
  return app(req, res);
});

exports.ssr = ssrApp;
