

// Annule le comportement par défaut d’une page web qui, lorsque que l’on glisse un fichier dans la fenêtre, l’ouvre pour l’afficher. 
window.ondragover = window.ondrop = function(e) {e.preventDefault();return false;}

/**
 * Module dependencies.
 */

var express = require('express')
  , controller = require('./controller');


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

  var oneDay = 86400000; // pour mettre en cache 

  app.use('/public',express.static(__dirname + '/public', { maxAge: oneDay }));

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


//******************************************************************
//*  Routes
//******************************************************************

// Index
app.get('/', function(req, res) {

    res.redirect('/index');
});
app.get('/index', controller.index);


// **** Experience ****

// POST Nouvelle Experience
app.post('/newExperience', controller.newExperience);

// POST or GET Ouvrir Experience
app.all('/openExperience', controller.openExperience);



// supprimer une experience
app.get('/supprExperience', controller.supprExperience);

// Fiche de l'experience
app.all('/experience', controller.experience);

// liste des experience de l'application
app.all('/listeExperiences', controller.listeExperiences);

// sauvegarder (zip) une experience
app.get('/saveXLSExperience', controller.saveXLSExperience);

// sauvegarder (zip) une experience
app.get('/saveZipExperience', controller.saveZipExperience);

// importer (zip) une experience
app.all('/importZipExperience', controller.importZipExperience);

// **** Evaluation ****

// POST Nouvel Participant ( Participant )
app.post('/newParticipant', controller.newParticipant);

// Nouvel Evaluation d'un participant
app.get('/newEvaluation', controller.newEvaluation);

// Etape 1 de l'evaluation : Choix de l'emotion
// @Param : id du participant 
app.get('/expEtape1', controller.expEtape1);
// Etape 2 de l'evaliation : Manipulation de l'avatar 
// @Param : id du participant , emotion choisie
app.get('/expEtape2', controller.expEtape2);
//Etape 3 de l'evaluation : Fin de l'evaluation 
app.get('/expEtape3', controller.expEtape3);

// liste des evaluation par participant 
app.all('/evaluations', controller.evaluations);


// **** gestion des configurations ****

// gestion d'une configuration , créer une nouvel config
app.all('/configuration', controller.configuration);

// voir la liste des config , supprimer une config
app.all('/listeConfigurations', controller.listeConfigurations);

// supprimer une configuration
app.get('/supprConfiguration', controller.supprConfiguration);

// sauvegarder (zip) une configuration
app.get('/saveZipConfiguration', controller.saveZipConfiguration);

// importer (zip) une configuration
app.all('/importZipConfiguration', controller.importZipConfiguration);

// Preferences
app.all('/preferences', controller.preferences);


//À propos d\'EmoLyse
app.get('/info', controller.info);
// Aide
app.get('/aide', controller.aide);



app.listen(3002, function(){
  // console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


