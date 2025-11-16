#!/usr/bin/env node
/**
 * Health check script for ECS container
 * Checks if the /api/health endpoint is responding
 */

const http = require('http');

const options = {
    hostname: 'localhost',
    port: process.env.PORT || 3000,
    path: '/api/health',
    method: 'GET',
    timeout: 5000,
    headers: {
        'User-Agent': 'ECS-HealthCheck/1.0'
    }
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            try {
                const body = JSON.parse(data);
                if (body.status === 'healthy') {
                    console.log('Health check passed:', body);
                    process.exit(0);
                } else {
                    console.error('Health check failed: Invalid status in response', body);
                    process.exit(1);
                }
            } catch (e) {
                console.error('Health check failed: Invalid JSON response', e.message);
                process.exit(1);
            }
        } else {
            console.error(`Health check failed: HTTP ${res.statusCode}`);
            process.exit(1);
        }
    });
});

req.on('error', (err) => {
    console.error('Health check failed: Connection error', err.message);
    process.exit(1);
});

req.on('timeout', () => {
    req.destroy();
    console.error('Health check failed: Timeout');
    process.exit(1);
});

req.end();

