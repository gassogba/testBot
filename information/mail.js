
var sendPersonalInfo = module.exports.sendPersonalInfo = function(session){
  var botResponse = session.conversationData.message;
  var mail = session.conversationData.personalData.value;
  var messages = botResponse + ' ' + mail +'.\nI hope my answer helps you. Don\'t hesitate to ask me another question'
  session.send(messages);
}
