
var sendPersonalInfo = module.exports.sendPersonalInfo = function(session){
  var botResponse = session.conversationData.message;
  var mail = session.conversationData.personalData.value;
  var messages = botResponse + ' ' + mail
  session.send(messages);
}
