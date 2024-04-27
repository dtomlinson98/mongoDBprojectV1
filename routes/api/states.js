const express = require("express");
const router = express.Router();
const statesController = require("../../controllers/statesController");
const contiguousCheck = require("../../middleware/contiguousCheck");
const mergeStateData = require("../../middleware/mergeStateData");
const verifyStates = require("../../middleware/verifyStates");

// route for GET all states
router.get("/", contiguousCheck, statesController.getAllStates);

// route for GET single state data including funfact if applicable
router.get("/:id", verifyStates, mergeStateData, statesController.getState);

// route for GET random funfact
router.get(
  "/:id/funfact",
  verifyStates,
  mergeStateData,
  statesController.getRandomFunFact
);

// route for GET capital
router.get("/:id/capital", verifyStates, statesController.getStateCapital);

// route for GET nickname
router.get("/:id/nickname", verifyStates, statesController.getStateNickname);

// route for GET population
router.get(
  "/:id/population",
  verifyStates,
  statesController.getStatePopulation
);

// route for GET admission
router.get(
  "/:id/admission",
  verifyStates,
  statesController.getStateAdmissionDate
);

// route for POST funfact array
router.post(
  "/:id/funfact",
  verifyStates,
  mergeStateData,
  statesController.postFunFact
);

// route for PATCH funfact array
router.patch("/:id/funfact", verifyStates, statesController.patchFunFact);

// route for DELETE funfact
router.delete("/:id/funfact", verifyStates, statesController.deleteFunFact);

module.exports = router;
