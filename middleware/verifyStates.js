const statesData = require("../model/statesData.json");

const verifyStates = (req, res, next) => {
  try {
    //converting to uppercase
    const stateCode = req.params.id.toUpperCase();
    const state = statesData.find((state) => state.code === stateCode);

    // if state not found 404
    if (!state) {
      return res
        .status(404)
        .json({ message: "Invalid state abbreviation parameter" });
    }
    req.state = state;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = verifyStates;
