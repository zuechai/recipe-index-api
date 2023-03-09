function setImagePath(image) {
  if (image) {
    return `{baseUrl}/static/images/${image}`;
  }
  return null;
}

module.exports = { setImagePath };
