const request = require('supertest');
const express = require('express');

// We need to import the app, but server.js starts the server.
// Ideally, we should refactor server.js to export 'app' without listening if imported.
// For now, we'll create a mock app to test routes if possible, or just test a simple endpoint if the server structure allows.
// Given the server.js structure, it listens immediately.
// We will try to require it, but it might start the server on the port.
// To avoid port conflicts during tests, we might need to refactor server.js.

// Let's try to test a simple isolated express app first to ensure Jest works,
// then we can address the server.js refactoring if needed.

const app = express();
app.get('/test', (req, res) => res.status(200).json({ message: 'pass' }));

describe('Backend Smoke Test', () => {
    it('should pass a simple test', async () => {
        const res = await request(app).get('/test');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('pass');
    });
});
