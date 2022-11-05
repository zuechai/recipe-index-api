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
      first_name: "Calvin",
      last_name: "Mayfield Zuech",
      user_name: "zuefield",
      google_id: "calvin.zuefield@gmail.com",
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
        (user) => user.google_id === "calvin.zuefield@gmail.com"
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
  name: "Calvin's favorite Breakfast",
  image: null,
  ingredients: [
    {
      ingredient: "raisins",
      quantity: 10,
      unit: "each",
      preparation: null,
    },
    {
      ingredient: "dried cranberries",
      quantity: 10,
      unit: "each",
      preparation: "",
    },
    {
      ingredient: "milk",
      quantity: 0.25,
      unit: "cup",
      preparation: "",
    },
    {
      ingredient: "peanut butter",
      quantity: 1,
      unit: "spoonful",
      preparation: "",
    },
  ],
  methods: [
    {
      id: 1,
      stepNum: 1,
      method: "Count the raisins.",
    },
    {
      id: 2,
      stepNum: 2,
      method: "Count the cranberries",
    },
    {
      id: 3,
      stepNum: 3,
      method: "Pour the milk.",
    },
    {
      id: 4,
      stepNum: 4,
      method:
        "Enjoy a spoonful of peanut butter separately from dried fruit milk mixture.",
    },
  ],
  userToken: "zuefield",
  collaborators: [{ username: "zuefield", canEdit: false }],
};

// todo add all the error handling!!!
const createRecipe = async () => {
  try {
    // validate recipe is valid... . . . ...
    const { name, image, ingredients, methods, userToken, collaborators } =
      recipe;

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

    // add a collaborator if one is provided and exist
    collaborators.forEach(({ username, canEdit }) => {
      const addCollaborators = async () => {
        // find the user to add as a collaborator
        const foundUser = await User.findOne({
          where: { user_name: username },
        });
        // valid user was found
        if (foundUser) {
          // add the user as a collaborator
          await Collaborator.create({
            recipe_id: sqlRecipe.recipe_id,
            recipe_user_id: user.user_id,
            collaborator_id: foundUser.user_id,
            can_edit: canEdit ?? false,
          });
        }
      };
      addCollaborators();
    });

    return;
  } catch (e) {
    console.log(e);
  }
};

// initializeTables(sqlize);
// createRecipe();

// const createUser = async () => {
//   try {
//     const signUpUser = {
//       first_name: "Anthony",
//       last_name: "Zuech",
//       user_name: "zuechai",
//       google_id: "zuechai@gmail.com",
//     };

//     const users = await User.findAll({
//       where: {
//         user_name: signUpUser.user_name,
//         google_id: signUpUser.google_id,
//       },
//       raw: true,
//     });

//     if (users.length > 0) {
//       const foundUser = users.find(
//         (user) => user.google_id === "calvin.zuefield@gmail.com"
//       );
//       console.log("A user already exists with this email");
//       console.log(foundUser);
//       return;
//     }
//     console.log("Success! Account created!");
//     await User.create({ ...signUpUser });
//     return;
//   } catch (e) {
//     console.log(`Error =====>\n${e}`);
//   }
// };

// // createUser();

// const recipe = {
//   // id
//   name: "Calvin's favorite Breakfast",
//   image: null,
//   ingredients: [
//     {
//       ingredient: "raisins",
//       quantity: 10,
//       unit: "each",
//       preparation: null,
//     },
//     {
//       ingredient: "dried cranberries",
//       quantity: 10,
//       unit: "each",
//       preparation: "",
//     },
//     {
//       ingredient: "milk",
//       quantity: 0.25,
//       unit: "cup",
//       preparation: "",
//     },
//     {
//       ingredient: "peanut butter",
//       quantity: 1,
//       unit: "spoonful",
//       preparation: "",
//     },
//   ],
//   methods: [
//     {
//       id: 1,
//       stepNum: 1,
//       method: "Count the raisins.",
//     },
//     {
//       id: 2,
//       stepNum: 2,
//       method: "Count the cranberries",
//     },
//     {
//       id: 3,
//       stepNum: 3,
//       method: "Pour the milk.",
//     },
//     {
//       id: 4,
//       stepNum: 4,
//       method:
//         "Enjoy a spoonful of peanut butter separately from dried fruit milk mixture.",
//     },
//   ],
//   userToken: "zuechai",
//   // collaborators: [{ username: "zuechai", canEdit: false }],
// };

// // todo add all the error handling!!!
// const createRecipe = async () => {
//   try {
//     // validate recipe is valid... . . . ...
//     const { name, image, ingredients, methods, userToken, collaborators } =
//       recipe;

//     // find the user
//     const user = await User.findOne({ where: { user_name: userToken } });
//     // check if user was found
//     if (!user) {
//       console.log("Invalid user token");
//       return false;
//     }
//     // create entry in recipes
//     const sqlRecipe = await Recipe.create({
//       title: name,
//       image_url: image,
//       user_id: user.user_id,
//     });
//     console.log(sqlRecipe);

//     // find or create a unit & ingredient -- add error handling
//     ingredients.forEach(({ ingredient, quantity, unit }) => {
//       // find or create an ingredient -- add error handling
//       const createIngredient = async () => {
//         // find or create the ingredient
//         const [sqlIng, created] = await Ingredient.findOrCreate({
//           where: { ingredient: ingredient },
//         });
//         // check if the ingredient was found
//         if (created) {
//           console.log(`${sqlIng} created!`, created);
//           return sqlIng;
//         }
//         console.log(`Found: created is ${created}`);
//         return sqlIng;
//       };

//       // create an ingredient list for the recipe -- add error handling
//       const createIngredientList = async (sqlIngredient) => {
//         const createdList = await IngredientList.create({
//           recipe_id: sqlRecipe.recipe_id,
//           ingredient_id: sqlIngredient.ingredient_id,
//           measurement: `${quantity} ${unit}`,
//         });
//       };

//       // call async functions
//       const callAsyncFuncs = async () => {
//         const sqlIngredient = await createIngredient();
//         console.log(sqlIngredient);
//         createIngredientList(sqlIngredient);
//       };
//       callAsyncFuncs();
//     });

//     // create methods for the recipe -- add error handling
//     methods.forEach(({ stepNum, method }) => {
//       const createMethods = async () => {
//         const createdMethods = await Method.create({
//           recipe_id: sqlRecipe.recipe_id,
//           step_num: stepNum,
//           method: method,
//         });
//       };
//       createMethods();
//     });

//     // add a collaborator if one is provided and exist
//     collaborators.forEach(({ username, canEdit }) => {
//       const addCollaborators = async () => {
//         // find the user to add as a collaborator
//         const foundUser = await User.findOne({
//           where: { user_name: username },
//         });
//         // valid user was found
//         if (foundUser) {
//           // add the user as a collaborator
//           await Collaborator.create({
//             recipe_id: sqlRecipe.recipe_id,
//             recipe_user_id: user.user_id,
//             collaborator_id: foundUser.user_id,
//             can_edit: canEdit ?? false,
//           });
//         }
//       };
//       addCollaborators();
//     });

//     return;
//   } catch (e) {
//     console.log(e);
//   }
// };

// createRecipe();
