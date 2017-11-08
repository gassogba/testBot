var builder = require('botbuilder');
const MicrosoftGraphClient = require("@microsoft/microsoft-graph-client");

var getPersonalInfo = module.exports.getPersonalInfo = function(session, results){
  var client = MicrosoftGraphClient.Client.init({
    authProvider: (done) => {
      done(null, results.response);
    }
  });
  var intent = session.conversationData.intent;
  session.conversationData.token = results.response;
  var uri = 'me/';
  if (intent == "personalNumber"){
    uri += 'mobilePhone';
  }else if(intent == "personalMail"){
    uri+= 'mail';
  }else if(intent == "personalSkills"){
    uri+= 'skills'
  }
  client.api(uri)
  .get()
  .then((res) => {
    session.conversationData.personalData = res;
  }).catch((err) => {
    console.log(err);
    session.endConversation(`Sorry, I was not able to access your personal data !`);
  });
}
