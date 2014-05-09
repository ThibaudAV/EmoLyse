
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

    if (req.body.nomExp != '') {
      if (req.body.configExp != '' &&  typeof req.body.configExp != 'undefined') {
      
        EmoLyse.newExperience(req.body.nomExp,req.body.descriptionExp,req.body.configExp,req.body.imageExp);

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

exports.newParticipant = function(req, res) {

    if (req.body.numUser != '') {
      if (req.body.sexeUser == 'H'|| req.body.sexeUser == 'F') {

        if (req.body.dateNaissance != '') {

          if (req.body.lvlEtude != '' &&  typeof req.body.lvlEtude != 'undefined') {
      
            // EmoLyse.newExperience(req.body.nomExp,req.body.descriptionExp,req.body.configExp);
            EmoLyse.experience.addParticipant(req.body.numUser,req.body.sexeUser,req.body.dateNaissance,req.body.lvlEtude);
            res.redirect('/evaluations');

          } else req.session.error = "Il faut choisir un niveau d'etude";
        } else req.session.error = "Il faut remplire la date de naissanace";
      } else req.session.error = "Il faut indiquer le sexe du participant";
    } else req.session.error = "Il faut indiquer le numéro du participant";

    res.redirect('/evaluations');
};


exports.newEvaluation = function(req, res) {

    if (req.body.numUser != '') {
      if (req.body.sexeUser == 'H'|| req.body.sexeUser == 'F') {

        if (req.body.dateNaissance != '') {

          if (req.body.lvlEtude != '' &&  typeof req.body.lvlEtude != 'undefined') {
      
            // EmoLyse.newExperience(req.body.nomExp,req.body.descriptionExp,req.body.configExp);
            res.redirect('/evaluations');

          } else req.session.error = "Il faut choisir un niveau d'etude";
        } else req.session.error = "Il faut remplire la date de naissanace";
      } else req.session.error = "Il faut indiquer le sexe du participant";
    } else req.session.error = "Il faut indiquer le numéro du participant";

    res.redirect('/');
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


  res.render('expEtape1', { 
    title: 'Emolyse - Experience',
    showMenuExperience:true,
    error: error,
    config: util.inspect(EmoLyse.experience.configuration.emotions, false, null),
  })
};

exports.expEtape2 = function(req, res){
  // On requpére l'error si il y en a.
  error = req.session.error;
  // On supprimer l'error car on la réqupéré
  req.session.error = null;

  res.render('expEtape2', { 
    title: 'Emolyse - Experience'+EmoLyse.experience.nom,
    showMenuExperience:true,
    error: error,
  })
};