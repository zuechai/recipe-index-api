# Recipe Index

## About

Recipe app for users to store and develop recipes. Created for professional recipe developments.

## How to run:

1. Clone recipe-index-client and follow instructions after completing API instructions.
2. Run `npm i`
3. Create a new MySQL database and set up a dotenv file with the following variables:
   - `BASE_URL=\<localhost>`
   - `PORT=\<5050>`
   - `DB_USER=\<root>`
   - `DB_PASSWORD=\<password>`
   - `DB_NAME=\<database>`
   - `DB_PORT=\<3306>`
   - `DATABASE_URL=mysql://DB_USER:DB_PASSWORD@localhost:DB_PORT/DB_NAME"`
4. Run:
   - `npm run generate`
   - `npm run migrate`
   - `npm run seed`
5. Run `npm start` to start running the server.

## Scripts

- start: nodemon server.js,
- format: npx prisma format,
- generate: npx prisma generate,
- migrate: npx prisma migrate dev,
- migrate:reset: npx prisma migrate reset,
- seed: node prisma/seed.js,
- push: npx prisma db push

## Features: (implemented and planned)

- User authentication
- Create, store, edit, and delete recipes
- Share read-only versions of recipes in your index
- Fork someone elses recipe if public or shared with you
- Suggest revisions to a shared recipe
- View history of changes to the recipe
- Easily adjust the yield with automatic, readable conversions
- Search bar to access recipes by keyword
- Sticky ingredient bar that follows the scrollbar down the recipe's method (tablet and desktop view)
- More to come. Not all features are implemented yet.
