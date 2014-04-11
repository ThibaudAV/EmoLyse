

// Annule le comportement par défaut d’une page web qui, lorsque que l’on glisse un fichier dans la fenêtre, l’ouvre pour l’afficher. 
window.ondragover = window.ondrop = function(e) {e.preventDefault();return false;}

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var gui = global.window.nwDispatcher.requireNwGui();// Load native UI library
var win = gui.Window.get();// Get the current window

var app = module.exports = express.createServer();

// Configuration

win.setMinimumSize(800, 549);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'secretEmoLyse' }));
  app.use(app.router);
  app.use('/public',express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

// Nouvelle experience 
app.post('/nouvExperience', function(req, res) {
    if (req.body.nomExp != '') {
        res.redirect('/expEtape1');
    }
    req.session.error = "Pas de nom de projets.";
    res.redirect('/');
})

app.get('/expEtape1', routes.expEtape1);
app.get('/expEtape2', routes.expEtape2);
app.get('/expEtape3', routes.expEtape3);


app.listen(3001, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


