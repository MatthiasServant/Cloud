const GCloudManager = require("../GCloudManager");

const gcloudManager = new GCloudManager();

exports.createTopic = async (req, res) => {
  try {
    const { topicName } = req.body;
    const topic = await gcloudManager.createTopic(topicName);
    res.status(200).send(`Topic ${topic.name} created successfully`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const { topicName } = req.body;
    await gcloudManager.deleteTopic(topicName);
    res.status(200).send(`Topic ${topicName} deleted successfully`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createSubscription = async (req, res) => {
  try {
    const { topicName, subscriptionName } = req.body;
    const subscription = await gcloudManager.createSubscription(
      topicName,
      subscriptionName
    );
    res
      .status(200)
      .send(`Subscription ${subscription.name} created successfully`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    const { topicName, subscriptionName } = req.body;
    await gcloudManager.deleteSubscription(topicName, subscriptionName);
    res
      .status(200)
      .send(`Subscription ${subscriptionName} deleted successfully`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.publishMessage = async (req, res) => {
  try {
    const { topicName, message, attributes } = req.body;
    const messageBuffer = Buffer.from(message);
    const messageId = await gcloudManager.publishMessage(
      topicName,
      messageBuffer,
      attributes
    );
    res.status(200).send(`Message ${messageId} published successfully`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
