const express = require('express');
const bodyParser = require('body-parser');
const connectToDb = require('./db/connect');

const app = express();

// Middleware
app.use(bodyParser.json());

// Root route to test the server
app.get('/', (req, res) => {
    res.send('Welcome to my page');
});

// Initialize database connection and start server
(async () => {
    try {
        await connectToDb();
        console.log('Database connection established');

        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
})();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./autoSwagger.json');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json()).use('/', require('./routes'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

