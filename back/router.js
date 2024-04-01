const express = require("express");
const gcloudController = require("./controller/gcloudController");

const router = express.Router();

router.post("/topics", gcloudController.createTopic);
router.delete("/topics", gcloudController.deleteTopic);

router.post("/subscriptions", gcloudController.createSubscription);
router.delete("/subscriptions", gcloudController.deleteSubscription);

router.post("/publish", gcloudController.publishMessage);

module.exports = router;
