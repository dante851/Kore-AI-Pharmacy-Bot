const constants = require("../constants/botConstants");
const richCardTemplate = require("../richCardTemplate.json");
module.exports = {
  populateBotResponse: function (
    vbResponse,
    responseId,
    messageDataWithBotUserSession
  ) {
    const verbiage_builder_resp = vbResponse;
    let entityStatus = messageDataWithBotUserSession.entity_status;
    let failedEntity = messageDataWithBotUserSession.failedEntity;
    const result = verbiage_builder_resp.filter(
      (ele) => ele.RESPONSE_ID === responseId
    );

    const resultCopy = JSON.parse(JSON.stringify(result));

    if (responseId.startsWith("ESI_PHA_FAQ")) {
      // Custom FAQ Responses
      return msgTemplate(result);
    } else {
      // Custom Bot Responses Condition
      if (responseId) {
        if (responseId.indexOf("INVALID_MSG") > -1) {
          let str = replacePlaceholders(
            resultCopy[0].WEB_RESPONSE_MSG,
            failedEntity
          );
          resultCopy[0].WEB_RESPONSE_MSG = str;
          return msgTemplate(resultCopy);
        } else if (responseId.indexOf("FALLBACK_MSG") > -1) {
          if (resultCopy[0].WEB_RESPONSE_MSG.includes("~")) {
            let fallbackmsgArr = resultCopy[0].WEB_RESPONSE_MSG.split("~");
            let fallbackmsg = getRandomFallbackMessage(fallbackmsgArr);
            resultCopy[0].WEB_RESPONSE_MSG = fallbackmsg;
            return msgTemplate(resultCopy);
          } else {
            return msgTemplate(resultCopy);
          }
        } else {
          if (resultCopy[0].WEB_RESPONSE_MSG.indexOf("${") > -1) {
            let str = replacePlaceholders(
              resultCopy[0].WEB_RESPONSE_MSG,
              entityStatus
            );
            resultCopy[0].WEB_RESPONSE_MSG = str;
            return msgTemplate(resultCopy);
          } else {
            return msgTemplate(result);
          }
        }
      }
    }
  },
};

// Function to send custom messages.
function msgTemplate(templateData) {
  let textResponses;
  if (templateData.length > 1) {
    textResponses = templateData.filter(
      (response) => response.MEDIA_TYPE === "TEXT"
    );
    // Remove the 0th value from the array
    templateData.splice(0, 1);
  }
  const templateType = templateData[0]?.MEDIA_TYPE;
  let cardData = templateData[0]?.DATA;

  const dafaultTextTemplate = templateData[0]?.WEB_RESPONSE_MSG;

  switch (templateType) {
    case "TABLE":
      return selectRichCardTemplate(
        richCardTemplate.tableTemplate,
        cardData,
        templateType,
        textResponses
      );
    case "QUICK_REPLIES":
      return selectRichCardTemplate(
        richCardTemplate.quickReplyTemplate,
        templateData,
        templateType,
        textResponses
      );
    case "BUTTONS":
      return selectRichCardTemplate(
        richCardTemplate.buttonTemplate,
        templateData,
        templateType,
        textResponses
      );

    default:
      return dafaultTextTemplate;
  }
}

// Function to select richcard templates.

function selectRichCardTemplate(
  templateTypeFormat,
  templateData,
  templatetype,
  textResponses
) {
  if (templatetype === "TABLE") {
    let obj = templateTypeFormat;
    obj.payload = JSON.parse(templateData);
    obj.payload["template_type"] = templatetype.toLowerCase();
    return JSON.stringify(obj);
  } else if (templatetype === "QUICK_REPLIES") {
    let obj = templateTypeFormat;
    let resultData = templateData;
    let quickreplyData = resultData.map((ele) => {
      return {
        content_type: "text",
        title: ele.BUTTON_LABEL,
        payload: ele.BUTTON_ID,
        image_url: "",
      };
    });
    obj.payload["quick_replies"] = quickreplyData;
    obj.payload["template_type"] = templatetype.toLowerCase();
    obj.payload["text"] = textResponses[0]?.WEB_RESPONSE_MSG;
    return JSON.stringify(obj);
  } else if (templatetype === "BUTTONS") {
    let obj = templateTypeFormat;
    let resultData = templateData;
    let buttonData = resultData.map((ele) => {
      return {
        type: "text",
        title: ele.BUTTON_LABEL,
        payload: ele.BUTTON_ID,
      };
    });
    obj.payload["buttons"] = buttonData;
    obj.payload["template_type"] = templatetype
      .slice(0, templatetype.length - 1)
      .toLowerCase();
    obj.payload["text"] = textResponses[0]?.WEB_RESPONSE_MSG;
    return JSON.stringify(obj);
  }
}

// Function to get a replace ${} from message with dynamic values sent from VBuilder.

function replacePlaceholders(template, values) {
  // Find all placeholders in the template
  const placeholders = template.match(/\${([^}]+)}/g);


  // Check if all placeholders have corresponding values in the values object
  const allPlaceholdersMatched = placeholders.every((placeholder) => {
    const key = placeholder.slice(2, -1); // Extract the key from the placeholder
    return values.hasOwnProperty(key); // Check if the key exists in the values object
  });


  // If not all placeholders have corresponding values, return the original template
  if (!allPlaceholdersMatched) {
    return constants.errorMessages.SOMETHING_WENT_WRONG;
  }


  // Replace placeholders with corresponding values
  return template.replace(/\${([^}]+)}/g, (match, key) => values[key] || "");
}

// Function to get a random fallback message from the array
function getRandomFallbackMessage(messagesArray) {
  const randomIndex = Math.floor(Math.random() * messagesArray.length);
  return messagesArray[randomIndex];
}
