const State = require("../model/States");

const mergeStateData = async (req, res, next) => {
  try {
    // Get verified parameter from verifyStates middleware
    const verifiedState = req.state;

    // Getting funfacts from MongoDB
    const mongoState = await State.findOne({ code: verifiedState.code });

    // If MongoDB has data for the state and it includes a funfact, add it to the state object
    if (mongoState && mongoState.funfacts) {
      verifiedState.funfacts = mongoState.funfacts;
    }

    //logging output of mergedData
    //console.log("Merged State Object:", verifiedState);

    // Set req.state to the merged data
    req.state = verifiedState;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = mergeStateData;
