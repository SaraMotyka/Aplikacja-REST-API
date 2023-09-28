const app = require("./app");
const db = require("./db");

const startServer = async () => {
  try {
    await db.connect();
    console.log("Database connection successful");
    app.listen(3000, async () => {
      console.log("Server running. Use our API on port: 3000");
    });
  } catch (error) {
    console.error(error.message);
  }
};

startServer();
