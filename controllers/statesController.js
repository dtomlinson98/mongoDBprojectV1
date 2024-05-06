const fs = require("fs");
const State = require("../model/States");

// function for GET all states
const getAllStates = async (req, res) => {
  try {
    //read states from MongoDB and JSON file
    const mongoStates = await State.find();
    const jsonData = fs.readFileSync("./model/statesData.json", "utf8");
    const jsonStates = JSON.parse(jsonData);

    const filteredStates = jsonStates
      .filter((state) => req.filteredStates.includes(state.code))
      .map((jsonState) => {
        const mongoState = mongoStates.find(
          (state) => state.code === jsonState.code
        );
        // if state has funfacts add it
        if (mongoState && mongoState.funfacts) {
          return { ...jsonState, funfacts: mongoState.funfacts };
          // if no funfacts just return JSON
        } else {
          return jsonState;
        }
      });

    res.json(filteredStates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// function for GET single state
const getState = async (req, res) => {
  try {
    const state = req.state;
    res.json(state);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Issue" });
  }
};

// function for GET state random fact
const getRandomFunFact = async (req, res) => {
  try {
    // Fetch the state from req.state object
    const state = req.state;

    // Check if the state exists and has a funfacts
    if (state && state.funfacts && state.funfacts.length > 0) {
      // Select a random funfacts from the array of funfacts
      const randomFunFact =
        state.funfacts[Math.floor(Math.random() * state.funfacts.length)];
      res.json({ funfact: randomFunFact });
    } else {
      res
        .status(404)
        .json({ message: `No Fun Facts found for ${state.state}` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Issue" });
  }
};

// function for GET state capital
const getStateCapital = (req, res) => {
  try {
    const state = req.state;

    // if state and capital are retrieved
    if (state && state.capital_city) {
      res.json({ state: state.state, capital: state.capital_city });
      // this shouldn't trigger since all states have capitals in JSON
    } else {
      res.status(404).json({ message: `No capital found for ${state.code}` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Issue" });
  }
};

// function for GET state nickname
const getStateNickname = (req, res) => {
  try {
    const state = req.state;

    // if state and nickname are retrieved
    if (state && state.nickname) {
      res.json({ state: state.state, nickname: state.nickname });
      // this shouldn't trigger since all states have nickname in JSON
    } else {
      res.status(404).json({ message: `No nickname found for ${state.code}` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Issue" });
  }
};

// function for GET state population
const getStatePopulation = (req, res) => {
  try {
    const state = req.state;

    // if state and population are retrieved
    if (state && state.population) {
      //adding commas in correct locations
      const populationString = state.population.toLocaleString();
      res.json({ state: state.state, population: populationString });
      // this shouldn't trigger since all states have populations in JSON
    } else {
      res
        .status(404)
        .json({ message: `No population found for ${state.code}` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Issue" });
  }
};

// function for GET state admission_date
const getStateAdmissionDate = (req, res) => {
  try {
    const state = req.state;

    // if state and admision_date was retrieved
    if (state && state.admission_date) {
      res.json({ state: state.state, admitted: state.admission_date });
      // this shouldn't trigger since all states have admission_dates in JSON
    } else {
      res
        .status(404)
        .json({ message: `No admission date found for ${state.code}` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Issue" });
  }
};

// function for POST funfacts array
const postFunFact = async (req, res) => {
  try {
    // set state code from request URL
    const stateCode = req.state.code;
    //console.log("State Code From URL:", stateCode);

    // set fun facts array from the request body
    const { funfacts } = req.body;
    //console.log("Fun Facts From URL Body:", funfacts);

    // if funfacts were not provided
    if (!funfacts) {
      return res
        .status(400)
        .json({ message: "State fun facts value required" });
      // if funfacts were not in an array
    } else if (!Array.isArray(funfacts)) {
      // if funfacts is not an array
      return res
        .status(400)
        .json({ message: "State fun facts value must be an array" });
    }

    // fetch the state object from MongoDB
    let mongoState = await State.findOne({ code: stateCode });

    // if state is not in mongoDB, create it
    if (!mongoState) {
      mongoState = new State({
        code: stateCode,
        funfacts: funfacts,
      });
      // if state is already in mongoDB, push it
    } else {
      if (mongoState.funfacts) {
        mongoState.funfacts.push(...funfacts);
      } else {
        mongoState.funfacts = funfacts;
      }
    }

    await mongoState.save();

    // respond with what mongo recieved
    res.status(200).json(mongoState);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Issue" });
  }
};

// function for PATCH funfacts array
const patchFunFact = async (req, res) => {
  try {
    // set state code from request URL
    const stateCode = req.state.code;
    //console.log("State Code From URL:", stateCode);

    // set index and funfacts from request body
    let { index, funfact } = req.body;
    //console.log("Index From User:", index);
    //console.log("Fun Fact From User PATCH:", funfacts);

    // if no index provided
    if (!index) {
      return res
        .status(400)
        .json({ message: "State fun fact index value required" });
    }

    // change user index to zero-based
    index = index - 1;
    //console.log("Zero-Based Index:", index);

    // if no funfact provided
    if (!funfact) {
      return res.status(400).json({ message: "State fun fact value required" });
    }

    // fetch mongoDB
    let mongoState = await State.findOne({ code: stateCode });
    //console.log("MongoDB Before PATCH:", mongoState);

    // if state not found 404
    if (!mongoState) {
      return res.status(404).json({ message: "State not found" });
    }

    // if no funfacts exits
    if (!mongoState.funfacts) {
      return res
        .status(404)
        .json({ message: `No Fun Facts found for ${stateCode}` });
    }

    // if index doesn't existst
    if (index < 0 || index >= mongoState.funfacts.length) {
      return res
        .status(400)
        .json({ message: `No Fun Fact found at that index for ${stateCode}` });
    }

    mongoState.funfacts[index] = funfact;
    await mongoState.save();

    // respond with updated mongoDB document
    res.status(200).json(mongoState);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Issue" });
  }
};

// function for DELETE funfacts
// kind of redundant may be able to use merge/verify middlware
const deleteFunFact = async (req, res) => {
  try {
    // set state code from request URL
    const stateCode = req.state.code;
    //console.log("State Code From URL:", stateCode);

    // set index from request body
    const { index } = req.body;
    //console.log("Index to Delete:", index);

    // if no index provided
    if (!index) {
      return res
        .status(400)
        .json({ message: "State fun fact index value required" });
    }

    // change the index to zero-based for MongoDB
    const adjustedIndex = index - 1;
    //console.log("Adjusted Index:", adjustedIndex);

    // fetch object from MongoDB
    let mongoState = await State.findOne({ code: stateCode });
    //console.log("Object in MongoDB:", mongoState);

    // if state not found in mongoDB check JSON file
    if (!mongoState) {
      const jsonData = fs.readFileSync("./model/statesData.json", "utf8");
      const jsonStates = JSON.parse(jsonData);
      const jsonState = jsonStates.find((state) => state.code === stateCode);

      // if state not found in JSON file
      if (!jsonState) {
        return res.status(404).json({ message: "State not found" });
      }

      // if state found in JSON but has no funfacts
      if (!jsonState.funfacts || jsonState.funfacts.length === 0) {
        return (
          res
            .status(404)
            // might need to adjust response!!
            .json({ message: `No Fun Facts found for ${jsonState.state}` })
        );
      }

      // if state found in JSON and has funfacts
      return res.status(404).json({ message: "State not found in MongoDB" });
    }

    // if no funfacts exist to delete
    if (!mongoState.funfacts || mongoState.funfacts.length === 0) {
      const jsonData = fs.readFileSync("./model/statesData.json", "utf8");
      const jsonStates = JSON.parse(jsonData);
      const jsonState = jsonStates.find((state) => state.code === stateCode);
      return res
        .status(404)
        .json({ message: `No Fun Facts found for ${jsonState.state}` });
    }

    // if index doesn't exist
    if (adjustedIndex < 0 || adjustedIndex >= mongoState.funfacts.length) {
      const jsonData = fs.readFileSync("./model/statesData.json", "utf8");
      const jsonStates = JSON.parse(jsonData);
      const jsonState = jsonStates.find((state) => state.code === stateCode);
      return res.status(400).json({
        message: `No Fun Fact found at that index for ${jsonState.state}`,
      });
    }

    // delete funfacts
    mongoState.funfacts.splice(adjustedIndex, 1);

    await mongoState.save();

    // respond mongoDB document
    res.status(200).json(mongoState);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Issue" });
  }
};

module.exports = {
  getAllStates,
  getState,
  getRandomFunFact,
  getStateCapital,
  getStateNickname,
  getStatePopulation,
  getStateAdmissionDate,
  postFunFact,
  patchFunFact,
  deleteFunFact,
};
