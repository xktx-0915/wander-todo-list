require('dotenv').config();
const app = require('./app');
const { initDb } = require('./config/db');

const PORT = process.env.PORT || 3000;

let server;

// Sync database and start server
initDb().then(() => {
  server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}/api/v1/docs`);
  });
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
  // Still start server for documentation purposes even if DB fails
  server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} (DB connection failed)`);
    console.log(`API Documentation: http://localhost:${PORT}/api/v1/docs`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});
