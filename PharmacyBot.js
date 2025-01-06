const config = require("./config.json");
var botId = config.credentials.botId;
var botName = config.credentials.botName;
var sdk = require("./lib/sdk");
const { populateBotResponse } = require("./utils/commonUtils");
const constants = require("./constants/botConstants");
const { logFn } = require("./winstonLogger");
/*
 * This is the most basic example of BotKit.
 *
 * It showcases how the BotKit can intercept the message being sent to the bot or the user.
 *
 * We can either update the message, or chose to call one of 'sendBotMessage' or 'sendUserMessage'
 */
module.exports = {
  botId: botId,
  botName: botName,

  on_user_message: function (requestId, data, callback) {
    if (data.message === "Hi") {
      data.message = "Hello";
      //Sends back 'Hello' to user.
      return sdk.sendUserMessage(data, callback);
    } else if (!data.agent_transfer) {
      //Forward the message to bot
      return sdk.sendBotMessage(data, callback);
    } else {
      data.message = "Agent Message";
      return sdk.sendUserMessage(data, callback);
    }
  },
  on_bot_message: function (requestId, data, callback) {
    if (data.message === "hi") {
      data.message = "The Bot says hello!";
    }
    logFn("info", __filename, "on_bot_message", data.message);
    logFn("error", __filename, "on_bot_message", data.message);
    logFn("warn", __filename, "on_bot_message", data.message);

    //Sends back the message to user
    const currentLanguage = data.context.currentLanguage;
    console.log("custom data language",data.context.session.UserContext.customData.initialLanguage)
    const verbiageBuilderData =
      currentLanguage === "fr"
        ? constants.botConversationResponse.verbiage_Fr_RespData
        : constants.botConversationResponse.verbiage_En_RespData;
    data.message = populateBotResponse(
      verbiageBuilderData,
      data.message,
      data.context.session.BotUserSession
    );
    try {
      const parsedMessage = JSON.parse(data.message);
      data.overrideMessagePayload = {
        body: JSON.stringify(parsedMessage),
        isTemplate: true,
      };
    } catch (e) {
      delete data.overrideMessagePayload;
    }
    logFn(
      "info",
      __filename,
      "overrideMessagePayload",
      data.overrideMessagePayload
    );

    return sdk.sendUserMessage(data, callback);
  },
  on_agent_transfer: function (requestId, data, callback) {
    return callback(null, data);
  },
  on_event: function (requestId, data, callback) {
    console.log("on_event -->  Event : ", data.message);
    return callback(null, data);
  },
  on_alert: function (requestId, data, callback) {
    console.log("on_alert -->  : ", data.message);
    return sdk.sendAlertMessage(data, callback);
  },
};
