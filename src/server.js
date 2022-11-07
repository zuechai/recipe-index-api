// import
const express = require("express");
const cors = require("cors");
const app = express();
const { sqlize } = require("./utils/dbConnect");

// initialize
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use("/static", express.static("public"));

// routes
const recipesRoute = require("./routes/recipesRoute");

// const createUser = async () => {
//   try {
//     await User.create({
//       firstName: "Calvin",
//       lastName: "Mayfield Zuech",
//       username: "zuefield",
//       email: "calvin.zuefield@gmail.com",
//     });
//   } catch (e) {
//     console.log("User already exists");
//   }
// };

// createUser();

app.use("/recipes", recipesRoute);

// run server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
