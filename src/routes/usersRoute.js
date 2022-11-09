const express = require("express");
const app = express();
const router = express.Router();

require("dotenv").config();
app.use(express.json());

const { createUser, findUser } = require("../controllers/usersController");

// get all recipes where user_id === user.id
router.post("/signup", createUser);

router.get("/", findUser);

module.exports = router;
