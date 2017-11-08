
var builder = require('botbuilder');

var sendPersonalInfo = module.exports.sendPersonalInfo = function(session){
  var phone = session.conversationData.personalData.value;
  var botResponse = session.conversationData.message;
  var message = botResponse + ' ' + phone;
  var choiceMessage = 'Is it the correct number ?'
  session.send(message);
  builder.Prompts.confirm(session, choiceMessage);
}

var confirmationData = module.exports.confirmationData = function(session, results){
  if(results.response){
    session.send('I hope my answer helps you. Don\'t hesitate to ask me another question');
  } else {
    var message = 'Do you want to change it ?';
    builder.Prompts.confirm(session, message);
  }
}

var changeInfo = module.exports.changeInfo = function(session, results){
  if(results.response){
    var message = 'I don\'t have the authorization yet for updating your phone number.';
    session.send(message);
  }
}
