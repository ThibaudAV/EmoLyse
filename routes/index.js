
/*
 * GET home page.
 */

var _EmoLyse = require('./../lib/EmoLyse');

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
    showMenuExperience:true,
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

  if (req.params.id != '') {
    participant = EmoLyse.experience.getParticipant(ID);

    if(participant) // si le participant existe
    {
      //participant.addEvaluation

    } else req.session.error = "Erreur : Le participant n'est pas valide";
    
  } else req.session.error = "Erreur : Le participant n'est pas definie";

  res.redirect('/evaluations');

};

exports.evaluations = function(req, res){
  // On requpére l'error si il y en a.
  error = req.session.error;
  // On supprimer l'error car on la réqupéré
  req.session.error = null;

  res.render('evaluations', { 
    title: 'Emolyse - Evaluations',
    showMenuExperience:true,
    error: error,
    participants:EmoLyse.experience.participants,
  })
};


exports.expEtape1 = function(req, res){
  var util = require('util');
  // On requpére l'error si il y en a.
  error = req.session.error;
  // On supprimer l'error car on la réqupéré
  req.session.error = null;

  if (req.params.id != '') {
    participant = EmoLyse.experience.getParticipant(ID);
    if(participant) // si le participant existe
    {
      res.render('evalEtape1', { 
        title: 'Emolyse - Evaluation 1/2',
        showMenuExperience:true,
        error: error,
        participant: participant,
        emotions:Emolyse.experience.configuration.emotions
      })

    } else req.session.error = "Erreur : Le participant n'est pas valide";
    
  } else req.session.error = "Erreur : Le participant n'est pas definie";

  res.redirect('/evaluations');



};

exports.expEtape2 = function(req, res){
  // On requpére l'error si il y en a.
  error = req.session.error;
  // On supprimer l'error car on la réqupéré
  req.session.error = null;

  res.render('evalEtape2', { 
    title: 'Emolyse - Evaluation 2/2'+EmoLyse.experience.nom,
    showMenuExperience:true,
    error: error,
  })
};