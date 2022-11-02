const initializeTables = async (sequelize) => {
  try {
    await sequelize.sync({ force: true });
    console.log("success");
  } catch (e) {
    console.error("No connection:", e);
  }
};

module.exports = { initializeTables };
