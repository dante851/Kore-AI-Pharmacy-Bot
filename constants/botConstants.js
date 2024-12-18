const verbiageRespData = [];
const verbiage_En_RespData = [];
const verbiage_Fr_RespData = [];

module.exports = {
  botConversationResponse: {
    verbiageRespData: verbiageRespData,
    verbiage_En_RespData: verbiage_En_RespData,
    verbiage_Fr_RespData: verbiage_Fr_RespData,
  },
  botConversationUniqId: {
    ESI_PHA_ORD_INFO_ORD_ID_RESP: "ESI_PHA_ORD_INFO_ORD_ID_RESP",
    ESI_PHA_ORD_INFO_MEMBER_ID_RESP: "ESI_PHA_ORD_INFO_MEMBER_ID_RESP",
    ESI_PHA_ORD_INFO_INVALID_MSG: "ESI_PHA_ORD_INFO_INVALID_MSG",
  },
  requestHeaders: {
    "content-type": "application/json",
  },
  preChatForm: {
    helpForDropDownOptions: [
      "Who are you getting help for?",
      { name: "Myself", value: "Myself" },
      { name: "Family Member", value: "Family Member" },
    ],
    reasonForHelpDropDownOptions: [
      "What can we help with you?",
      {
        name: "Getting started with home delivery",
        value: "Getting started with home delivery",
      },
      {
        name: "Medication coverage and pricing",
        value: "Medication coverage and pricing",
      },
      { name: "My Prescriptions", value: "My Prescriptions" },
      { name: "My Account", value: "My Account" },
      { name: "Other Account", value: "Other Account" },
    ],
    moreDetailsDropDownOptions: [
      "Tell us a little more",
      {
        name: "Mailing Address/Fax Number",
        value: "Mailing Address/Fax Number",
      },
      { name: "Other", value: "Other" },
    ],
  },
  serverResponses: {
    default: {
      status: 200,
      body: {},
    },
    success: {
      status: 200,
      body: {},
    },
    created: {
      status: 201,
      body: {},
    },
    error: {
      status: 400,
      body: {
        errorCode: "Bad-Request",
        message: "Invalid request, unable to process.",
      },
    },
    unauthorized: {
      status: 401,
      body: {
        errorCode: "Unauthorized",
        message:
          "Something Went Wrong. Please ensure you are logged in with the correct credentials.",
      },
    },
    serverError: {
      status: 500,
      body: {
        errorCode: "Internal-Server-Error",
        message: "Failed to process the request. Please try again later.",
      },
    },
    dataNotFound: {
      status: 404,
      body: {
        errorCode: "Data Not Found",
        message: "Data is not available in the server.",
      },
    },
  },
  statusCodes: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UN_AUTHORIZED: 401,
    INTERNAL_SERVER_ERROR: 500,
    DATA_NOT_FOUND: 404,
  },
  errorMessages: {
    USER_DOES_NOT_EXIST: "User account does not exist",
  },
  successMessages: {
    FETCHED: "Fetched Successfully",
    UPDATED: "Updated Successfully",
    DELETED: "Deleted Successfully",
  },
};
