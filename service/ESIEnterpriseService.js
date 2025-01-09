const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const qs = require("qs");
const { requestHeaders } = require("../constants/botConstants");
const { preChatForm } = require("../constants/botConstants");
const { makeHttpCall } = require("../makeHttpCall");
const { orderResponse } = require("../constants/botConstants");

module.exports = {
  /**
   * Get the order details from database.
   * @param {*} id the required file.
   * @returns the id details.
   */
  async getOrderDetails(orderId) {
    const filteredResponse = orderResponse.length > 0 ? orderResponse.filter(function (data){
      return data.trxNumber = orderId;
      }) : [];
      return filteredResponse;
    // const url = `${process.env.ESI_ORDER_ID_RESPONSE_URL}=${orderId}`;
    // return makeHttpCall("get", url)
    //   .then(function (res) {
    //     return res.data;
    //   })
    //   .catch(function (err) {
    //     return err;
    //   });
  },

  /**
   * Get the member details from database.
   * @param {*} id the required file.
   * @returns the id details.
   */

  async getMemberDetails(memberId) {
    const url = `${process.env.ESI_MEMBER_ID_RESPONSE_URL}=${memberId}`;
    return makeHttpCall("get", url)
      .then(function (res) {
        return res.data;
      })
      .catch(function (err) {
        return err;
      });
  },

  /**
   * return the data from constant file.
   * @returns the id details.
   */
  getPreChatDetails() {
    return preChatForm;
  },
};
