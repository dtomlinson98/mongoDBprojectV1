const express = require("express");
const router = express.Router();
const statesController = require("../../controllers/statesController");
const contiguousCheck = require("../../middleware/contiguousCheck");
const mergeStateData = require("../../middleware/mergeStateData");
const verifyStates = require("../../middleware/verifyStates");

// route for all states
router.get("/", contiguousCheck, statesController.getAllStates);

// route for single state data including funfact if applicable
router.get("/:id", verifyStates, mergeStateData, statesController.getState);

// route for random funfact
router.get(
  "/:id/funfact",
  verifyStates,
  mergeStateData,
  statesController.getRandomFunFact
);

// route for capital
router.get("/:id/capital", verifyStates, statesController.getStateCapital);

// route for nickname
router.get("/:id/nickname", verifyStates, statesController.getStateNickname);

// route for population
router.get(
  "/:id/population",
  verifyStates,
  statesController.getStatePopulation
);

// route for admission
router.get(
  "/:id/admission",
  verifyStates,
  statesController.getStateAdmissionDate
);

// Route for other CRUD operations on individual states
router
  .route("/:id")
  .post(statesController.createNewState)
  .put(statesController.updateState)
  .delete(statesController.deleteState);

module.exports = router;
