const express = require("express");
const app = express();
const router = express.Router();

app.use(express.json());

const { findUsers } = require("../controllers/usersController");

router.get("/search", findUsers);

module.exports = router;
