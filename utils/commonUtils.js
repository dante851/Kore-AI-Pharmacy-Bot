const { verbiageBuilder } = require("../verbiageBuilder");
const constants = require("../constants/botConstants");
const richCardTemplate = require("../richCardTemplate.json");
module.exports = {
  populateBotResponse: function (
    vbResponse,
    responseId,
    messageDataWithBotUserSession
  ) {
    const verbiage_builder_resp = vbResponse;
    let entityStatus = messageDataWithBotUserSession.entityStatus;
    let failedEntity = messageDataWithBotUserSession.failedEntity;
    let orderIdInput = "";
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
          console.log(str);
          return msgTemplate(resultCopy);
        } else {
          if (resultCopy[0].WEB_RESPONSE_MSG.indexOf("${") > -1) {
            let str = replacePlaceholders(
              resultCopy[0].WEB_RESPONSE_MSG,
              entityStatus
            );
            resultCopy[0].WEB_RESPONSE_MSG = str;
            console.log(str);
            return msgTemplate(resultCopy);
          }
        }
      }
      // switch (responseId) {
      //   case constants.botConversationUniqId.ESI_PHA_ORD_INFO_ORD_ID_RESP:
      //     let values = entityStatus;
      //     let str = replacePlaceholders(resultCopy[0].WEB_RESPONSE_MSG, values);
      //     resultCopy[0].WEB_RESPONSE_MSG = str;
      //     console.log(str)
      //     return msgTemplate(resultCopy);

      //   case constants.botConversationUniqId.ESI_PHA_ORD_INFO_MEMBER_ID_RESP:
      //     let memberIdInput = entityStatus;
      //     let memberStr = resultCopy[0].WEB_RESPONSE_MSG.replaceAll(
      //       "${member_status}",
      //       memberIdInput
      //     );
      //     resultCopy[0].WEB_RESPONSE_MSG = memberStr;
      //     return msgTemplate(resultCopy);

      //   case constants.botConversationUniqId.ESI_PHA_ORD_INFO_INVALID_MSG:
      //     if (failedEntity !== null) {
      //       let failedEntityInputStr =
      //         resultCopy[0].WEB_RESPONSE_MSG.replaceAll(
      //           "${dynamic_entity}",
      //           failedEntity
      //         );
      //       resultCopy[0].WEB_RESPONSE_MSG = failedEntityInputStr;
      //       return msgTemplate(resultCopy);
      //     }
      //     break;

      //   default:
      //     return msgTemplate(result);
      // }
    }
  },
};
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

function replacePlaceholders(template, values) {
  return template.replace(/\${([^}]+)}/g, (match, key) => values[key] || "");
}
