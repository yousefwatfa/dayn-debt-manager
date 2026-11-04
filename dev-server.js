'use strict';
// Local development server. On Vercel the same handler runs from api/index.js.
const http = require('node:http');
const { handler, notifyAll } = require('./lib/core');

const PORT = process.env.PORT || 3000;
http.createServer(handler).listen(PORT, () => console.log(`Debt manager running on http://localhost:${PORT}`));
setInterval(() => notifyAll().catch(() => {}), 3600e3).unref();

