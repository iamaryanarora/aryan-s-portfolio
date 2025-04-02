const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Serve static files from public_html directory
app.use(express.static(path.join(__dirname)));

// Special route for CV
app.get('/assets/aryanarora.pdf', (req, res) => {
    const file = path.join(__dirname, 'assets', 'aryanarora.pdf');
    
    // Check if file exists
    if (!fs.existsSync(file)) {
        console.error('PDF file not found:', file);
        return res.status(404).send('PDF file not found');
    }

    // Get file stats for content length
    const stat = fs.statSync(file);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', stat.size);
    
    // If download parameter is present, set content disposition to attachment
    if (req.query.download === 'true') {
        res.setHeader('Content-Disposition', 'attachment; filename=aryanarora.pdf');
    } else {
        res.setHeader('Content-Disposition', 'inline');
    }

    // Create read stream and pipe to response
    const fileStream = fs.createReadStream(file);
    fileStream.on('error', (error) => {
        console.error('Error reading PDF:', error);
        res.status(500).send('Error reading PDF file');
    });
    
    fileStream.pipe(res);
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).send('Internal Server Error');
});

// Start server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`