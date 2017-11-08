var fs = require("fs");
var path = require("path");
var expressSession = require("express-session");
var restify = require("restify");
var builder = require("botbuilder");
var AuthHelper_1 = require("authHelper");
var searchDialog_1 = require("./dialogs/searchDialog");

var server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.queryParser());

server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

var bot = new builder.UniversalBot(new builder.ChatConnector({}));
server.post('/api/messages', bot.connector('*').listen());
server.listen(process.env.PORT, () => console.log(`${server.name} listening to ${server.url}`));
server.get('/code', restify.serveStatic({
    'directory': path.join(__dirname, '../public'),
    'file': 'code.html'
}));
bot.recognizer(new builder.LuisRecognizer(process.env.LUIS_MODEL_URL));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(expressSession({ secret: 'SOME_SECRET', resave: true, saveUninitialized: false }));
var authHelper = new AuthHelper_1.AuthHelper(server, bot);
let dlg = new searchDialog_1.default(authHelper);
bot.dialog('/', [
    function (session, args, next) {
        session.send('No intent matched');
    }
]);
    bot.dialog(dlg.id, dlg.waterfall).triggerAction({ matches: dlg.name });

exports.Server = Server;
const server = new Server();
server.run();
