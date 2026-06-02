const userCreate = (req, res) => {
  const data = req.body;

  res.json({
    message: "User Created",
    data,
  });
};

module.exports = userCreate;
