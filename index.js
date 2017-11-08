var restify = require('restify');
var builder = require('botbuilder');
var restify = require('restify');
var dotenv = require('dotenv');
var apiai = require('apiai');
var path = require("path");
var expressSession = require("express-session");
var AuthHelper_1 = require("./helpers/authHelper");
var ApiAiRecognizer = require('apiai-recognizer-botbuilder').ApiAiRecognizer;
var searchDialog_1 = require("./information/searchDialog");
var phoneInfo = require('./information/phone.js');
var mailInfo = require('./information/mail.js');
var skillsInfo = require('./information/skill.js');

dotenv.load();
//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
  //appId: process.env.BOT_ID,
  //appPassword: process.env.BOT_SECRET
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

server.get('/code', restify.serveStatic({
  'directory': path.join(__dirname, '/public'),
  'file': 'code.html'
}));

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(expressSession({ secret: 'SOME_SECRET', resave: true, saveUninitialized: false }));
//=========================================================
// Bots Dialogs
//=========================================================
bot.recognizer(new ApiAiRecognizer(process.env.APIAI_ACCESS_TOKEN, 'en'));
var authHelper = new AuthHelper_1.AuthHelper(server, bot);
let dlg = new searchDialog_1.default(authHelper);

bot.dialog('greetings', function(session, args){
  session.send(args.intent.data.result.fulfillment.speech);
}).triggerAction({matches: 'welcome'});

bot.dialog('getInfo', dlg.waterfall)
  .triggerAction({matches: 'personalNumber'});

bot.dialog('getInfo2', dlg.waterfall)
  .triggerAction({matches: 'personalMail'});

bot.dialog('getInfo3', dlg.waterfall)
  .triggerAction({matches: 'personalSkills'});

bot.dialog('personalPhoneRender', [
  function(session){
    phoneInfo.sendPersonalInfo(session);
  },
  function(session, results){
    phoneInfo.confirmationData(session, results);
  },
  function(session, results){
    phoneInfo.changeInfo(session, results);
  }
]);

bot.dialog('personalSkillsRender', [
  function(session){
    skillsInfo.sendPersonalSkills(session);
  },
  function(session, results, next){
    skillsInfo.addSkills(session, results);
  },
  function(session, results, next){
    skillsInfo.updateSkills(session, results);
  }
]);

bot.dialog('personalMailRender', [
  function(session){
    mailInfo.sendPersonalInfo(session)
  }
]);

bot.dialog('questions', function(session, args){
  session.send(args.intent.data.result.fulfillment.speech);
}).triggerAction({matches: 'questions'});

bot.dialog('/', [
  function (session, args, next) {
    session.send('No intent matched');
  }
]);
