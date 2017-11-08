var builder = require('botbuilder');
const MicrosoftGraphClient = require("@microsoft/microsoft-graph-client");

var sendPersonalSkills = module.exports.sendPersonalSkills = function(session){
  var skills = session.conversationData.personalData.value;
  var botResponse = session.conversationData.message;
  var message = botResponse + ' ' + skills;
  var choiceMessage = 'Do you want to add new skills ?'
  session.send(message);
  builder.Prompts.confirm(session, choiceMessage);
}

var addSkills = module.exports.addSkills = function(session, results){
  if(results.response){
    var message = "Please enter your skills. Please separate each of them with a coma. "
    builder.Prompts.text(session, message);
  }else{
    session.endDialog();
  }
}

var confirmSkills = module.exports.confirmSkills = function(session, results){
  var skillsToAdd = results.response.split(',');
  var skills = (session.conversationData.personalData.value).concat(skillsToAdd);
  var message = "Is it the correct skills you want to add ?"
  builder.prompts.confirm(session, message);
}

var updateSkills = module.exports.updateSkills = function(session, results){
  if(results.response){
    session.send('OK');
    /*var client = MicrosoftGraphClient.Client.init({
      authProvider: (done) => {
        done(null, session.conversationData.token);
      }
    });

    client.api('me/')
    .patch({"skills": skills})
    .then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });*/
  }else{
    session.beginDialog('addPersonalSkills');
  }

}
