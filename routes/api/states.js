const express = require("express");
const router = express.Router();
const statesController = require("../../controllers/statesController");

// Route for fetching all states
router.get("/", statesController.getAllStates);

// Route for other CRUD operations on individual states
router
  .route("/:id")
  .get(statesController.getState)
  .post(statesController.createNewState)
  .put(statesController.updateState)
  .delete(statesController.deleteState);

module.exports = router;
