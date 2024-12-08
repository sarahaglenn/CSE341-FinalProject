const express = require('express');
// const bodyParser = require('body-parser');
const connectToDb = require('./db/connect');
const connectToMongoose = require('./db/mongooseConnect');
// const passport = require('passport');
require('./config/passport');

const app = express();

// Middleware
// app.use(bodyParser.json());
app.use(express.json());

// Root route to test the server
app.get('/', (req, res) => {
  res.send('Welcome to my page');
});

const port = process.env.PORT || 3000;

// Initialize database connection and start server
(async () => {
  try {
    await connectToDb();
    console.log('Database connection established');

    await connectToMongoose();
    console.log('Connected to database via Mongoose');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
})();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/', require('./routes'));
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    initOAuth: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      appName: 'Book Worm API',
      scopes: ['profile']
    },
    requestInterceptor: (req) => {
      const token = req.query.token;
      if (token) {
        req.headers['Authorization'] = `Bearer ${token}`;
      }
      return req;
    }
  })
);

module.exports = app;
