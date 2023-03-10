const express = require("express");
const app = express();
const router = express.Router();

app.use(express.json());

const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/accountController");

// create => signup
router.put("/signup", createUser);

// read => login
router.get("/", getUser);

// logout

// update => edit
router.patch("/update", updateUser);

// delete
router.delete("/delete", deleteUser);

module.exports = router;
