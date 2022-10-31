const test = async () => {
  try {
    // await User.create({
    //   first_name: "Anthony",
    //   last_name: "Zuech",
    //   user_name: "zuechai",
    //   google_id: "zuechai@gmail.com",
    // });
    const users = await User.findAll({
      where: { google_id: "zuechai@gmail.com" },
      raw: true,
    });
    if (!users.length) {
      console.log("Created new user");
    }
    console.log("A user already exists with this email", users);
  } catch (e) {
    console.log(`Error =====>\n${e}`);
  }
};

test();
