

// Annule le comportement par défaut d’une page web qui, lorsque que l’on glisse un fichier dans la fenêtre, l’ouvre pour l’afficher. 
window.ondragover = window.ondrop = function(e) {e.preventDefault();return false;}

/**
 * Module dependencies.
 */

var express = require('express')
  , controler = require('./controler');


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
app.get('/index', controler.index);


// **** Experience ****

// POST Nouvelle Experience
app.post('/newExperience', controler.newExperience);

// POST or GET Ouvrir Experience
app.all('/openExperience', controler.openExperience);



// supprimer une experience
app.get('/supprExperience', controler.supprExperience);

// Fiche de l'experience
app.all('/experience', controler.experience);

// liste des experience de l'application
app.all('/listeExperiences', controler.listeExperiences);

// sauvegarder (zip) une experience
app.get('/saveXLSExperience', controler.saveXLSExperience);

// sauvegarder (zip) une experience
app.get('/saveZipExperience', controler.saveZipExperience);

// importer (zip) une experience
app.all('/importZipExperience', controler.importZipExperience);

// **** Evaluation ****

// POST Nouvel Participant ( Participant )
app.post('/newParticipant', controler.newParticipant);

// Nouvel Evaluation d'un participant
app.get('/newEvaluation', controler.newEvaluation);

// Etape 1 de l'evaluation : Choix de l'emotion
// @Param : id du participant 
app.get('/expEtape1', controler.expEtape1);
// Etape 2 de l'evaliation : Manipulation de l'avatar 
// @Param : id du participant , emotion choisie
app.get('/expEtape2', controler.expEtape2);
//Etape 3 de l'evaluation : Fin de l'evaluation 
app.get('/expEtape3', controler.expEtape3);

// liste des evaluation par participant 
app.all('/evaluations', controler.evaluations);


// **** gestion des configurations ****

// gestion d'une configuration , créer une nouvel config
app.all('/configuration', controler.configuration);

// voir la liste des config , supprimer une config
app.all('/listeConfigurations', controler.listeConfigurations);

// supprimer une configuration
app.get('/supprConfiguration', controler.supprConfiguration);

// sauvegarder (zip) une configuration
app.get('/saveZipConfiguration', controler.saveZipConfiguration);

// importer (zip) une configuration
app.all('/importZipConfiguration', controler.importZipConfiguration);

// Preferences
app.all('/preferences', controler.preferences);


//À propos d\'EmoLyse
app.get('/info', controler.info);
// Aide
app.get('/aide', controler.aide);



app.listen(3002, function(){
  // console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


