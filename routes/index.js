
/*
 * GET home page.
 */

var _EmoLyse = require('./../lib/EmoLyse');
var Evaluation = require('./../lib/models/Evaluation.class');

var fs = require("fs");
var EmoLyse = new _EmoLyse();


exports.index = function(req, res){
  // On requpére l'error si il y en a.
	error = req.session.error;
  // On supprimer l'error car on la réqupéré
	req.session.error = null;

  // On recupére la liste des configs
  _configs = EmoLyse.getConfigs();
  // On recupére la lise des experiences
  _experiences = EmoLyse.getExperiences();

  res.render('index', { 
  	title: 'Emolyse',
    configs: _configs,
    experiences: _experiences,
    showMenuExperience:false,
    showMenuParametre:true,
  	error: error,
 	})
};



exports.newExperience = function(req, res) {

    var util = require('util');
    var fs = require('fs');

    if (req.body.nomExp != '') {
      if (req.body.configExp != '' &&  typeof req.body.configExp != 'undefined') {
      
        EmoLyse.newExperience(req.body.nomExp,req.body.descriptionExp,req.body.configExp,req.files.imageExp);



        res.redirect('/evaluations');
      } else req.session.error = "Il faut choisir une configuration";
    } else req.session.error = "Le nom de l'eperience est vide";


  res.redirect('/');

};

exports.openExperience = function(req, res) {

      if (req.body.experience != '' &&  typeof req.body.experience != 'undefined') {
      
        EmoLyse.openExperience(req.body.experience);

        res.redirect('/evaluations');
      } else req.session.error = "Il faut choisir une experience";

    res.redirect('/');
};



exports.saveExperience = function(req, res) {
    var util = require('util');
  res.send(util.inspect(EmoLyse.saveExperience(), false, null));
};


exports.experience = function(req, res){

    var util = require('util');

  // On requpére l'error si il y en a.
  error = req.session.error;
  // On supprimer l'error car on la réqupéré
  req.session.error = null;


  res.render('experience', { 
    title: 'Emolyse - Experience',
    showMenuExperience:false,
    showMenuParametre:true,
    error: error,
    experience: EmoLyse.experience,
  })
};

exports.newParticipant = function(req, res) {

    if (req.body.numUser != '') {
      if (req.body.sexeUser == 'H'|| req.body.sexeUser == 'F') {

        if (req.body.dateNaissance != '') {

          if (req.body.lvlEtude != '' &&  typeof req.body.lvlEtude != 'undefined') {
      
            // EmoLyse.newExperience(req.body.nomExp,req.body.descriptionExp,req.body.configExp);
            EmoLyse.experience.addParticipant(req.body.numUser,req.body.sexeUser,req.body.dateNaissance,req.body.lvlEtude);
            // on enregistre l'experience
            EmoLyse.saveExperience()
            res.redirect('/evaluations');

          } else req.session.error = "Il faut choisir un niveau d'etude";
        } else req.session.error = "Il faut remplire la date de naissanace";
      } else req.session.error = "Il faut indiquer le sexe du participant";
    } else req.session.error = "Il faut indiquer le numéro du participant";

    res.redirect('/evaluations');
};

// nouvelle evaluation par un participant
exports.newEvaluation = function(req, res) {

  if (req.param('id') != '') {
    participant = EmoLyse.experience.getParticipant(req.param('id'));

    if(participant) // si le participant existe
    {
      if (typeof req.param('emotion') != 'undefined' && req.param('emotion') != '') {
        if (typeof req.param('avatar') != 'undefined' && req.param('avatar') != '') {
          if (typeof req.param('proximite') != 'undefined' && req.param('proximite') != '') {
            if (typeof req.param('tempsDeReponse') != 'undefined' && req.param('tempsDeReponse') != '') {

              evaluation = new Evaluation();
              // pour le moment j'ai choise de definir l'id par un getTime
              date = new Date();
              ID = date.getTime();

              evaluation.init(
                  ID,
                  req.param('emotion'),
                  req.param('avatar'),
                  req.param('proximite'),
                  req.param('tempsDeReponse')
                );

              participant.addEvaluation(evaluation)
              // on sovegarder la nouvel experience
              EmoLyse.saveExperience()

              res.redirect('/expEtape3');

            } else req.session.error = "Erreur : Le tempsDeReponse n'est pas définie";
          } else req.session.error = "Erreur : La proximite n'est pas définie";
        } else req.session.error = "Erreur : L'avatar n'est pas définie";
      } else req.session.error = "Erreur : L'emotion n'est pas définie";

    } else req.session.error = "Erreur : Le participant n'est pas valide";
    
  } else req.session.error = "Erreur : Le participant n'est pas définie";

  res.redirect('/evaluations');

};

exports.evaluations = function(req, res){
  // On requpére l'error si il y en a.
  error = req.session.error;
  // On supprimer l'error car on la réqupéré
  req.session.error = null;

  res.render('evaluations', { 
    title: 'Emolyse - Evaluations',
    showMenuExperience:false,
    showMenuParametre:true,
    error: error,
    participants:EmoLyse.experience.participants,
  })
};

// Etape 1 de l'evaluation : Choix de l'emotion
// @Param : id du participant 
exports.expEtape1 = function(req, res){
  // On requpére l'error si il y en a.
  error = req.session.error;
  // On supprimer l'error car on la réqupéré
  req.session.error = null;

  if (req.param('id') != '') {
    participant = EmoLyse.experience.getParticipant(req.param('id'));
    if(participant) // si le participant existe
    {
      res.render('evalEtape1', { 
        title: 'Emolyse - Evaluation 1/2',
        showMenuExperience:false,
        showMenuParametre:false,
        error: error,
        showModalHelp:true,
        participant: participant,
        emotions: EmoLyse.experience.configuration.emotions
      });
      return true;

    } else req.session.error = "Erreur : Le participant n'est pas valide";
    
  } else req.session.error = "Erreur : Le participant n'est pas définie";

  res.redirect('/evaluations');
};

// Etape 2 de l'evaliation : Manipulation de l'avatar 
// @Param : id du participant , emotion choisie
exports.expEtape2 = function(req, res){
  var util = require('util');
  // On requpére l'error si il y en a.
  error = req.session.error;
  // On supprimer l'error car on la réqupéré
  req.session.error = null;

  if (req.param('id') != '' ) {
    if (req.param('emotion') != '' ) {
      participant = EmoLyse.experience.getParticipant(req.param('id'));
      if(participant) // si le participant existe
      {
        res.render('evalEtape2', { 
          title: 'Emolyse - Evaluation 2/2',
          showMenuExperience:false,
          showMenuParametre:false,
          error: error,
          participant: participant,
          startTime: req.param('startTime'),
          experience:EmoLyse.experience,
          emotion: EmoLyse.experience.configuration.getEmotion(req.param('emotion'))
        });
        return true;

      } else req.session.error = "Erreur : Le participant n'est pas valide";
    } else req.session.error = "Erreur : L'emotion n'est pas définie";
  } else req.session.error = "Erreur : Le participant n'est pas définie";

  res.redirect('/evaluations');
};


//Etape 3 de l'evaluation : Fin de l'evaluation 
exports.expEtape3 = function(req, res){
  // On requpére l'error si il y en a.
  error = req.session.error;
  // On supprimer l'error car on la réqupéré
  req.session.error = null;

  res.render('evalEtape3', { 
    title: 'Emolyse - Evaluation',
    showMenuExperience:false,
    showMenuParametre:false,
    error: error,
  });
};

// Nouve Config 
exports.newConfiguration = function(req, res){

  res.render('newConfiguration', { 
    title: 'Emolyse - Configuration',
    showMenuExperience:true,
    showMenuParametre:true,
    error: error,
    showModalNewConfig:true,
  });
};