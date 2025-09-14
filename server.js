const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Store signal status (in a real application, this would be in a database)
let currentSignalStatus = {
    timestamp: new Date().toISOString(),
    signals: {
        N: { L: 'red', S: 'red', R: 'red' },
        S: { L: 'red', S: 'red', R: 'red' },
        E: { L: 'red', S: 'red', R: 'red' },
        W: { L: 'red', S: 'red', R: 'red' }
    }
};

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'traffic-simulation.html'));
});

// API endpoint to get signal status
app.get('/api/signals/status', (req, res) => {
    res.json({
        success: true,
        data: currentSignalStatus,
        message: 'Signal status retrieved successfully'
    });
});

// API endpoint to update signal status (called by frontend)
app.post('/api/signals/update', (req, res) => {
    try {
        const { signals } = req.body;
        
        currentSignalStatus = {
            timestamp: new Date().toISOString(),
            signals: signals || currentSignalStatus.signals
        };
        
        console.log(`🚦 Signal status updated at ${currentSignalStatus.timestamp}`);
        
        res.json({
            success: true,
            data: currentSignalStatus,
            message: 'Signal status updated successfully'
        });
    } catch (error) {
        console.error('Error updating signal status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update signal status',
            error: error.message
        });
    }
});

// API endpoint to validate signal activation (no validation - always allow)
app.post('/api/signals/validate', (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                canActivate: true,
                message: 'All signals allowed - no restrictions'
            }
        });
    } catch (error) {
        console.error('Error validating signal:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to validate signal',
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚦 Traffic Simulation Server running on port ${PORT}`);
    console.log(`🌐 Open http://localhost:${PORT} to access the simulation`);
});

module.exports = app;
