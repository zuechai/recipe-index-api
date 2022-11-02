const express = require("express");
const cors = require("cors");
const app = express();
const { Sequelize } = require("sequelize");
const { initializeTables } = require("./utils/dbSetup");

require("dotenv").config();
app.use(express.json());
app.use(cors());

// SEQUELIZE AND DATA MODEL IMPORTS
const sqlize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

const Unit = require("./models/Unit")(sqlize);
const Ingredient = require("./models/Ingredient")(sqlize);
const User = require("./models/User")(sqlize);
const Recipe = require("./models/Recipe")(sqlize);
const IngredientList = require("./models/IngredientList")(sqlize);
const Method = require("./models/Method")(sqlize);
const Collaborator = require("./models/Collaborator")(sqlize);

const createUser = async () => {
  try {
    const signUpUser = {
      first_name: "Anthony",
      last_name: "Zuech",
      user_name: "zuechai",
      google_id: "zuechai@gmail.com",
    };

    const users = await User.findAll({
      where: {
        user_name: signUpUser.user_name,
        google_id: signUpUser.google_id,
      },
      raw: true,
    });

    if (users.length > 0) {
      const foundUser = users.find(
        (user) => user.google_id === "zuechai@gmail.com"
      );
      console.log("A user already exists with this email");
      console.log(foundUser);
      return;
    }
    console.log("Success! Account created!");
    await User.create({ ...signUpUser });
    return;
  } catch (e) {
    console.log(`Error =====>\n${e}`);
  }
};

// createUser();

const recipe = {
  // id
  name: "Fermented Napa Cabbage",
  image: null,
  ingredients: [
    {
      ingredient: "napa cabbage",
      quantity: 1,
      unit: "head",
      preparation: null,
    },
    {
      ingredient: "water",
      quantity: 4,
      unit: "quarts",
      preparation: "",
    },
    {
      ingredient: "garlic",
      quantity: 1,
      unit: "clove",
      preparation: "",
    },
    {
      ingredient: "distilled white vinegar",
      quantity: 0.5,
      unit: "cup",
      preparation: "",
    },
  ],
  methods: [
    {
      id: 1,
      stepNum: 1,
      method:
        "Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini.",
    },
    {
      id: 2,
      stepNum: 2,
      method:
        "Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini.",
    },
    {
      id: 3,
      stepNum: 3,
      method:
        "Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini.",
    },
    {
      id: 4,
      stepNum: 4,
      method:
        "Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini.",
    },
  ],
  userToken: "zuechai",
};

// todo add all the error handling!!!
const createRecipe = async () => {
  try {
    // validate recipe is valid... . . . ...
    const { name, image, ingredients, methods, userToken } = recipe;

    // find the user
    const user = await User.findOne({ where: { user_name: userToken } });
    // check if user was found
    if (!user) {
      console.log("Invalid user token");
      return false;
    }
    // create entry in recipes
    const sqlRecipe = await Recipe.create({
      title: name,
      image_url: image,
      user_id: user.user_id,
    });
    console.log(sqlRecipe);

    // find or create a unit & ingredient -- add error handling
    ingredients.forEach(({ ingredient, quantity, unit }) => {
      const createUnit = async () => {
        // find or create the unit
        const [sqlUnit, created] = await Unit.findOrCreate({
          where: { unit: unit },
        });
        // check if the unit was found
        if (created) {
          console.log(created, sqlUnit);
          return sqlUnit;
        }
        console.log("Unit already exists", sqlUnit);
        return sqlUnit;
      };

      // find or create an ingredient -- add error handling
      const createIngredient = async () => {
        // find or create the ingredient
        const [sqlIng, created] = await Ingredient.findOrCreate({
          where: { ingredient: ingredient },
        });
        // check if the ingredient was found
        if (created) {
          console.log(`${sqlIng} created!`, created);
          return sqlIng;
        }
        console.log(`Found: created is ${created}`);
        return sqlIng;
      };

      // create an ingredient list for the recipe -- add error handling
      const createIngredientList = async (sqlIngredient, sqlUnit) => {
        const createdList = await IngredientList.create({
          recipe_id: sqlRecipe.recipe_id,
          ingredient_id: sqlIngredient.ingredient_id,
          quantity: quantity,
          unit_id: sqlUnit.unit_id,
        });
      };

      // call async functions
      const callAsyncFuncs = async () => {
        const sqlUnit = await createUnit();
        const sqlIngredient = await createIngredient();
        console.log(sqlIngredient);
        createIngredientList(sqlIngredient, sqlUnit);
      };
      callAsyncFuncs();
    });

    // create methods for the recipe -- add error handling
    methods.forEach(({ stepNum, method }) => {
      const createMethods = async () => {
        const createdMethods = await Method.create({
          recipe_id: sqlRecipe.recipe_id,
          step_num: stepNum,
          method: method,
        });
      };
      createMethods();
    });

    // addCollaborators()
    return;
  } catch (e) {
    console.log(e);
  }
};

// initializeTables(sqlize);
createRecipe();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
