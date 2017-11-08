var builder = require('botbuilder');
const MicrosoftGraphClient = require("@microsoft/microsoft-graph-client");

var sendPersonalSkills = module.exports.sendPersonalSkills = function(session){
  var skills = session.conversationData.personalData.value;
  var botResponse = session.conversationData.message;
  var message = botResponse + ' ' + skills;
  session.send(message);
}

var addSkills = module.exports.addSkills = function(session, results){
    var message = "Please enter your skills. Separate each of them with a coma. "
    builder.Prompts.text(session, message);
}

var confirmSkills = module.exports.confirmSkills = function(session, results){

  var skillsToAdd = results.response.split(',');
  session.conversationData.skills = skillsToAdd
  var message = "Are you sure to add : " + skillsToAdd;
  builder.Prompts.confirm(session, message);
}

var updateSkills = module.exports.updateSkills = function(session, results, next){

  if(results.response){
    session.send('I have just updated your profile.');
    var skills = (session.conversationData.personalData.value).concat(session.conversationData.skills);

    console.log(skills);
    var client = MicrosoftGraphClient.Client.init({
      authProvider: (done) => {
        done(null, session.conversationData.token);
      }
    });

    client.api('me/')
    .patch({"skills": skills})
    .then((res) => {
      console.log(res);
      session.send('I have just updated your profile.');
    }).catch((err) => {
      session.send('I was not able to update your profile');
      console.log(err);
    });
  }else{
    session.beginDialog('updatePersonalSkill');
  }
}
