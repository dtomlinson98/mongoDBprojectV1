const State = require("../model/States");

const mergeStateData = async (req, res, next) => {
  try {
    // get verified parameter
    const stateCode = req.params.id;

    // getting funfacts
    const mongoState = await State.findOne({ code: stateCode });

    // merging data from json and mongoDB
    if (mongoState && mongoState.funfact) {
      req.state.funfact = mongoState.funfact;
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = mergeStateData;
