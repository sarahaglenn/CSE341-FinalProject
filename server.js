const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./autoSwagger.json');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json()).use('/', require('./routes'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));