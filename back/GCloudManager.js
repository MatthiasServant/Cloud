const { PubSub } = require("@google-cloud/pubsub");

class GCloudManager {
  constructor() {
    this.pubsub = new PubSub({
      projectId: process.env.PROJECT_ID,
      keyFilename: "./data/leprojetsubv-03afe917999e.json",
    });
  }

  async createTopic(topicName) {
    const [topic] = await this.pubsub.createTopic(topicName);
    console.log(`Topic ${topic.name} created.`);
    return topic;
  }

  async deleteTopic(topicName) {
    const topic = this.pubsub.topic(topicName);
    await topic.delete();
    console.log(`Topic ${topic.name} deleted.`);
  }

  async createSubscription(topicName, subscriptionName) {
    const topic = this.pubsub.topic(topicName);
    const [subscription] = await topic.createSubscription(subscriptionName);
    console.log(
      `Subscription ${subscription.name} created. In topic ${topic.name}`
    );
    return subscription;
  }

  async deleteSubscription(topicName, subscriptionName) {
    const topic = this.pubsub.topic(topicName);
    const subscription = topic.subscription(subscriptionName);
    await subscription.delete();
    console.log(`Subscription ${subscription.name} deleted.`);
  }

  listenForMessages(topicName, subscriptionName, messageHandler, errorHandler) {
    const topic = this.pubsub.topic(topicName);
    const subscription = topic.subscription(subscriptionName);

    subscription.on("message", messageHandler);
    subscription.on("error", errorHandler);

    this.currentSubscription = subscription;
  }

  stopListening() {
    if (this.currentSubscription) {
      this.currentSubscription.removeListener("message", this.messageHandler);
      this.currentSubscription.removeListener("error", this.errorHandler);
      console.log("Stopped listening to messages");
    }
  }

  async publishMessage(topicName, messageBuffer, attributes = {}) {
    const topic = this.pubsub.topic(topicName);
    const messageId = await topic.publishMessage({
      data: messageBuffer,
      attributes: attributes,
    });
    console.log(`Message ${messageId} published.`);
    return messageId;
  }
}

module.exports = GCloudManager;
