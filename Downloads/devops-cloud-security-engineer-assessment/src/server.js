const express = require('express');
const morgan = require('morgan');
const prometheus = require('prom-client');
const todos = require('./routes/todos');

const app = express();
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

prometheus.collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});

app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', commit: process.env.GIT_SHA || 'local' });
});

app.use('/api/v1/todos', todos);

module.exports = app;
