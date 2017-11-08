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
  }).catch((err) => {
    console.log(err);
    session.endConversation(`Sorry, I was not able to access your personal data !`);
  });
}
