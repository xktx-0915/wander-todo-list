const express = require("express")
const auth = require("../../middlewares/auth")
const systemController = require("../../controllers/system.controller")

const router = express.Router();

router.route("/tips").get(systemController.getTips);

module.exports = router;