const validateUsername = (username) => {
  if (username.length >= 6) {
    return true;
  }
  return false;
};
const validateEmail = (email) => {
  const regex =
    /^[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?$/;
  return regex.test(email);
};

module.exports = { validateUsername, validateEmail };
