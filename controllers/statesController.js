const fs = require("fs");
const State = require("../model/States");
const statesData = require("../model/statesData.json");

// function for getting all states
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

const createNewState = async (req, res) => {
  const newState = new State({
    //state: req.body.state,
    //slug: req.body.slug,
    code: req.body.code,
    // nickname: req.body.nickname,
    // website: req.body.website,
    // admission_date: req.body.admission_date,
    // admission_number: req.body.admission_number,
    // capital_city: req.body.capital_city,
    // capital_url: req.body.capital_url,
    // population: req.body.population,
    // population_rank: req.body.population_rank,
    // constitution_url: req.body.constitution_url,
    // state_flag_url: req.body.state_flag_url,
    // state_seal_url: req.body.state_seal_url,
    // map_image_url: req.body.map_image_url,
    // landscape_background_url: req.body.landscape_background_url,
    // skyline_background_url: req.body.skyline_background_url,
    // twitter_url: req.body.twitter_url,
    // facebook_url: req.body.facebook_url,
    funfacts: req.body.funfacts,
  });

  try {
    const savedState = await newState.save();
    res.status(201).json(savedState);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateState = async (req, res) => {
  try {
    const state = await State.findById(req.params.id);
    if (!state) {
      return res
        .status(404)
        .json({ message: `State with ID ${req.params.id} not found` });
    }

    Object.keys(req.body).forEach((key) => {
      if (key !== "_id") {
        state[key] = req.body[key];
      }
    });

    const updatedState = await state.save();
    res.json(updatedState);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteState = async (req, res) => {
  try {
    const state = await State.findById(req.params.id);
    if (!state) {
      return res
        .status(404)
        .json({ message: `State with ID ${req.params.id} not found` });
    }

    await state.remove();
    res.json({
      message: `State with ID ${req.params.id} deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// function for single state
const getState = async (req, res) => {
  try {
    const state = req.state;
    res.json(state);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// function for state random fact
const getRandomFunFact = async (req, res) => {
  try {
    // Fetch the state from req.state object
    const state = req.state;

    // Check if the state exists and has a funfact
    if (state && state.funfact && state.funfact.length > 0) {
      // Select a random funfact from the array of funfacts
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

// function for state capital
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

// function for state nickname
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

// function for state population
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

// function for state admission_date
const getStateAdmissionDate = (req, res) => {
  try {
    const state = req.state;

    // Check if state and admission date are retrieved
    if (state && state.admission_date) {
      res.json({ state: state.state, admitted: state.admission_date });
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

module.exports = {
  getAllStates,
  createNewState,
  updateState,
  deleteState,
  getState,
  getRandomFunFact,
  getStateCapital,
  getStateNickname,
  getStatePopulation,
  getStateAdmissionDate,
};
