const mongoose = require("mongoose");
const cors = require("cors");
const app = require("./app");
// Enable CORS for all routes
const corsOptionsDelegate = require("./configCors/corsOptions");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true, // Add this line to use the new URL parser
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.log("error"));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
