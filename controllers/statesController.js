const fs = require("fs");
const State = require("../model/States");

/* const insertStatesFromJson = async () => {
  try {
    // read states from statesData.json
    const statesData = JSON.parse(
      fs.readFileSync("./model/statesData.json", "utf8")
    );

    for (const stateData of statesData) {
      const newState = new State({
        state: stateData.state,
        slug: stateData.slug,
        code: stateData.code,
        nickname: stateData.nickname,
        website: stateData.website,
        admission_date: stateData.admission_date,
        admission_number: stateData.admission_number,
        capital_city: stateData.capital_city,
        capital_url: stateData.capital_url,
        population: stateData.population,
        population_rank: stateData.population_rank,
        constitution_url: stateData.constitution_url,
        state_flag_url: stateData.state_flag_url,
        state_seal_url: stateData.state_seal_url,
        map_image_url: stateData.map_image_url,
        landscape_background_url: stateData.landscape_background_url,
        skyline_background_url: stateData.skyline_background_url,
        twitter_url: stateData.twitter_url,
        facebook_url: stateData.facebook_url,
        funfacts: stateData.funfacts,
      });

      // Save the document to MongoDB
      await newState.save();
      console.log(`State ${stateData.state} inserted into the database.`);
    }

    console.log("All states inserted successfully.");
  } catch (err) {
    console.error("Error inserting states:", err);
  }
}; */

const getAllStates = async (req, res) => {
  try {
    const states = await State.find();
    res.json(states);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createNewState = async (req, res) => {
  const newState = new State({
    state: req.body.state,
    slug: req.body.slug,
    code: req.body.code,
    nickname: req.body.nickname,
    website: req.body.website,
    admission_date: req.body.admission_date,
    admission_number: req.body.admission_number,
    capital_city: req.body.capital_city,
    capital_url: req.body.capital_url,
    population: req.body.population,
    population_rank: req.body.population_rank,
    constitution_url: req.body.constitution_url,
    state_flag_url: req.body.state_flag_url,
    state_seal_url: req.body.state_seal_url,
    map_image_url: req.body.map_image_url,
    landscape_background_url: req.body.landscape_background_url,
    skyline_background_url: req.body.skyline_background_url,
    twitter_url: req.body.twitter_url,
    facebook_url: req.body.facebook_url,
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

const getState = async (req, res) => {
  try {
    const state = await State.findById(req.params.id);
    if (!state) {
      return res
        .status(404)
        .json({ message: `State with ID ${req.params.id} not found` });
    }
    res.json(state);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  insertStatesFromJson,
  getAllStates,
  createNewState,
  updateState,
  deleteState,
  getState,
};
