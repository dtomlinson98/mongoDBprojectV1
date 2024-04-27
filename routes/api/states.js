const express = require("express");
const router = express.Router();
const statesController = require("../../controllers/statesController");
const contiguousCheck = require("../../middleware/contiguousCheck");
const mergeStateData = require("../../middleware/mergeStateData");
const verifyStates = require("../../middleware/verifyStates");

// Route for fetching all states
router.get("/", contiguousCheck, statesController.getAllStates);

// Route for fetching state data
router.get("/:id", verifyStates, mergeStateData, statesController.getState);

// Route for other CRUD operations on individual states
router
  .route("/:id")
  .post(statesController.createNewState)
  .put(statesController.updateState)
  .delete(statesController.deleteState);

module.exports = router;
