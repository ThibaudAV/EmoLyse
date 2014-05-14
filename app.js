

// Annule le comportement par défaut d’une page web qui, lorsque que l’on glisse un fichier dans la fenêtre, l’ouvre pour l’afficher. 
window.ondragover = window.ondrop = function(e) {e.preventDefault();return false;}

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');




var gui = global.window.nwDispatcher.requireNwGui();// Load native UI library

var win = gui.Window.get();// Get the current window
    win.show();
var app = module.exports = express.createServer();

// Configuration

// win.setMinimumSize(800, 549);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options', {layout: __dirname + '/views/layout.ejs'});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'secret' }));
  app.use(app.router);
  app.use('/public',express.static(__dirname + '/public'));

  // en public pour avoir acces au images par exemple
  app.use('/EXPERIENCES',express.static(__dirname + '/EXPERIENCES'));
  app.use('/CONFIG',express.static(__dirname + '/CONFIG'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});




// Routes
app.get('/', function(req, res) {

    res.redirect('/index');
});

app.get('/index', routes.index);


// POST Nouvelle Experience
app.post('/newExperience', routes.newExperience);

// POST Ouvrir Experience
app.post('/openExperience', routes.openExperience);

app.get('/saveExperience', routes.saveExperience);

// paramétre de l'experience
app.get('/experience', routes.experience);



// POST Nouvel Participant ( Participant )
app.post('/newParticipant', routes.newParticipant);

// Nouvel Evaluation d'un participant
app.get('/newEvaluation', routes.newEvaluation);


// Etape 1 de l'evaluation : Choix de l'emotion
// @Param : id du participant 
app.get('/expEtape1', routes.expEtape1);
// Etape 2 de l'evaliation : Manipulation de l'avatar 
// @Param : id du participant , emotion choisie
app.get('/expEtape2', routes.expEtape2);
//Etape 3 de l'evaluation : Fin de l'evaluation 
app.get('/expEtape3', routes.expEtape3);
app.get('/evaluations', routes.evaluations);

// gestion d'une configuration , créer une nouvel config
app.all('/configuration', routes.configuration);

// voir la liste des config , supprimer une config
app.all('/listeConfigurations', routes.listeConfigurations);



app.listen(3002, function(){
  // console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


