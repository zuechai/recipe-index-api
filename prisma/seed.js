const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");

const fs = require("fs");
const filePath = "./prisma/recipeData.json";
const file = fs.readFileSync(filePath);
const recipes = JSON.parse(file);

async function main(newUser) {
  try {
    // create users
    async function createUsers(newUser) {
      try {
        const created = await prisma.users.create({
          data: {
            ...newUser,
          },
        });
        console.log(created);
      } catch (e) {
        console.log(e);
      }
    }

    createUsers(newUser);
  } catch (e) {
    console.log(e);
  }
}

const anthony = {
  userId: "c45d495f-cd2d-4ebe-b90a-d5e650d241fc",
  firstName: "Anthony",
  lastName: "Zuech",
  username: "zuechai",
  email: "recipe@index.com",
};

const calvin = {
  userId: "7b895a22-4e1b-42f8-bb7e-53de20a86e4d",
  firstName: "Calvin",
  lastName: "Zoofield",
  username: "calvin",
  email: "calvin@index.com",
};

main(anthony);
main(calvin);

//--------------

async function createRecipes(recipes) {
  // try {
  const { title, image, ingredients, methods } = recipes;

  const userId = "c45d495f-cd2d-4ebe-b90a-d5e650d241fc";
  const recipeId = uuidv4();

  const user = await prisma.users.findUnique({
    where: {
      userId,
    },
  });

  if (!user) {
    console.log("Check seed file and correct userId");
  }

  ingredients.forEach(({ measurement, ingredient }, i) => {
    const create = async () => {
      let ing = await prisma.ingredients.findUnique({
        where: { ingredient },
      });

      if (!ing) {
        ing = await prisma.ingredients.create({
          data: { ingredient },
        });
      }

      console.log(recipeId);
      await prisma.recipeIngredients.create({
        data: {
          measurement: measurement,
          ingredientId: ing.ingredientId,
          recipeId: recipeId,
        },
      });
    };

    create();
  });

  let imagePath;
  if (image) {
    imagePath = `http://localhost:5050/static/images/${image}`;
  } else {
    imagePath = null;
  }

  const createdRec = await prisma.recipes.create({
    data: {
      recipeId,
      title,
      image: imagePath,
      users: {
        connect: { userId },
      },
      methods: {
        create: methods,
      },
    },
    include: {
      recipeIngredients: {
        select: {
          id: true,
          measurement: true,
          ingredientId: true,
        },
      },
      methods: {
        select: {
          id: true,
          stepNum: true,
          method: true,
        },
      },
    },
  });
  // } catch (e) {
  //   console.log(e);
  // }
}

recipes.forEach((recipe, i) => {
  const create = async () => {
    const r = await createRecipes(recipe);
  };
  create();
});
