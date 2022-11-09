const express = require("express");
const app = express();
const router = express.Router();

require("dotenv").config();
app.use(express.json());

const {
  getUserRecipes,
  getRecipesBySearch,
  getSelectedRecipe,
  createRecipe,
} = require("../controllers/recipesController");

// get all recipes where user_id === user.id and matches search query if present
router.get("/search", getRecipesBySearch);

// get single recipe where user_id === user.id && recipe_id === :id
router.get("/:id", getSelectedRecipe);

router.post("/", createRecipe);

module.exports = router;
