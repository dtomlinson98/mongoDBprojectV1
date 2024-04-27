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
        // if state has funfact add it
        if (mongoState && mongoState.funfact) {
          return { ...jsonState, funfact: mongoState.funfact };
          // if no funfact just return JSON
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
    res.status(500).json({ message: "Internal server error" });
  }
};

// function for GET state random fact
const getRandomFunFact = async (req, res) => {
  try {
    // Fetch the state from req.state object
    const state = req.state;

    // Check if the state exists and has a funfact
    if (state && state.funfact && state.funfact.length > 0) {
      // Select a random funfact from the array of funfact
      const randomFunFact =
        state.funfact[Math.floor(Math.random() * state.funfact.length)];
      res.json({ funfact: randomFunFact });
    } else {
      res
        .status(404)
        .json({ message: `No Fun Facts found for ${state.state}` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
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
    res.status(500).json({ message: "Internal server error" });
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
    res.status(500).json({ message: "Internal server error" });
  }
};

// function for GET state population
const getStatePopulation = (req, res) => {
  try {
    const state = req.state;

    // if state and population are retrieved
    if (state && state.population) {
      res.json({ state: state.state, population: state.population });
      // this shouldn't trigger since all states have populations in JSON
    } else {
      res
        .status(404)
        .json({ message: `No population found for ${state.code}` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
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
    res.status(500).json({ message: "Internal server error" });
  }
};

// function for POST funfact array
const postFunFact = async (req, res) => {
  try {
    // set state code from request URL
    const stateCode = req.state.code;
    //console.log("State Code From URL:", stateCode);

    // set fun facts array from the request body
    const { funfact } = req.body;
    //console.log("Fun Facts From URL Body:", funfact);

    // fetch the state object from MongoDB
    let mongoState = await State.findOne({ code: stateCode });

    // if state is not in mongoDB, create it
    if (!mongoState) {
      mongoState = new State({
        code: stateCode,
        funfact: funfact,
      });
      // if state is already in mongoDB, push it
    } else {
      if (mongoState.funfact) {
        mongoState.funfact.push(...funfact);
      } else {
        mongoState.funfact = funfact;
      }
    }

    await mongoState.save();

    // respond with what mongo recieved
    res.status(200).json(mongoState);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// function for PATCH funfact array
const patchFunFact = async (req, res) => {
  try {
    // set state code from request URL
    const stateCode = req.state.code;
    console.log("State Code From URL:", stateCode);

    // set index and funfact from request body
    let { index, funfact } = req.body;
    //console.log("Index From User:", index);
    //console.log("Fun Fact From User PATCH:", funfact);

    // change user index to zero-based
    index = index - 1;
    //console.log("Zero-Based Index:", index);

    // fetch object from MongoDB
    let mongoState = await State.findOne({ code: stateCode });
    //console.log("MongoDB Before PATCH:", mongoState);

    // if state not found, 404
    if (!mongoState) {
      return res.status(404).json({ message: "State not found" });
    }

    // if there is a funfact and the index exitts
    if (mongoState.funfact && mongoState.funfact.length > index && index >= 0) {
      mongoState.funfact[index] = funfact;
      //if index doesn't exist
    } else {
      return res.status(400).json({ message: "Invalid index" });
    }

    await mongoState.save();

    // respond with updated mongoDB document
    res.status(200).json(mongoState);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// function for DELETE funfact
const deleteFunFact = async (req, res) => {
  try {
    // set state code from request URL
    const stateCode = req.state.code;
    console.log("State Code From URL:", stateCode);

    // set index from request body
    const { index } = req.body;
    //console.log("Index to Delete:", index);

    // change the index to zero-based for MongoDB
    const adjustedIndex = index - 1;
    //console.log("Adjusted Index:", adjustedIndex);

    // fetch object from MongoDB
    let mongoState = await State.findOne({ code: stateCode });
    //console.log("Object in MongoDB:", mongoState);

    // if state not found, 404
    if (!mongoState) {
      return res.status(404).json({ message: "State not found" });
    }

    // if index valid
    if (
      mongoState.funfact &&
      mongoState.funfact.length > adjustedIndex &&
      adjustedIndex >= 0
    ) {
      // delete funfact at the specified index
      mongoState.funfact.splice(adjustedIndex, 1);
    } else {
      return res.status(400).json({ message: "Invalid index" });
    }

    await mongoState.save();

    // respond with updated MongoDB document
    res.status(200).json(mongoState);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
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
