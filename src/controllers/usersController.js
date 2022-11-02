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
