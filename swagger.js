const swaggerAutogen = require('swagger-autogen')();
const isDev = process.env.NODE_ENV === 'development';
const host = isDev ? 'localhost:3000' : 'cse341-finalproject-2pzl.onrender.com';

const doc = {
  info: {
    title: 'Book Worm API',
    description:
      'This API manages library books, tracks loans, and manages user accounts. All users can view books in the system, but only registered patrons can reserve and check them out. Staff have additional permissions, including adding new books to the system, viewing current loans for all patrons, and managing patron reservations.'
  },
  host: host,
  schemes: isDev ? ['http'] : ['https']
};

const outputFile = './autoSwagger.json';
const endpointFile = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointFile, doc);
