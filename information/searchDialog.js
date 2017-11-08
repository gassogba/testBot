"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
const MicrosoftGraphClient = require("@microsoft/microsoft-graph-client");
var searchHandler = require('./searchHandler');

class searchDialog {
    constructor(authHelper) {
      this.authHelper = authHelper;
      this.waterfall = [].concat((session, args, next) => {
        session.conversationData.message = args.intent.data.result.fulfillment.speech;
        session.conversationData.intent = args.intent.intent;
        session.conversationData.entities = args.entities;
        next();
      }, authHelper.getAccessToken(), (session, results, next) => {
        if (results.response != null) {
          searchHandler.getPersonalInfo(session, results);

          var intent = session.conversationData.intent;
          if(intent == 'personalNumber'){
            session.beginDialog('personalPhoneRender');
          }else if (intent == 'personalMail'){
            session.beginDialog('personalMailRender');
          }else if (intent == 'personalSkills'){
            session.beginDialog('personalSkillsRender');
          }else{
            session.send("your query was not find. Please try again.")
          }
        }else{
          session.endConversation('Sorry, an error occured. Please try again !');
        }
      });
    }
}
exports.searchDialog = searchDialog;
exports.default = searchDialog;
//# sourceMappingURL=searchDialog.js.map
