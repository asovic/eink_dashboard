const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const serverRoutes = require('./server/server');

app.get('/test', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>1600x1200 Page</title>
        <style>
            body, html {
                margin: 0;
                padding: 0;
                height: 100%;
                overflow: hidden;
            }
            .container {
                width: 1600px;
                height: 1200px;
                border: 1px solid black;
                margin: 0 auto;
                box-sizing: border-box;
                overflow: hidden;
                position: relative;
            }
            .content {
                padding: 20px;
                font-family: Arial, sans-serif;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <h1>1600x1200 Page</h1>
                <p>This is a simple page with dimensions 1600x1200 pixels and a 1px border.</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Your existing API routes
app.use('/', serverRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});