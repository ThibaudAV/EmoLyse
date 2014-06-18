
/*
 * GET home page.
 */

var _EmoLyse = require('./../lib/EmoLyse');
var Evaluation = require('./../lib/models/Evaluation.class');
var Configuration = require('./../lib/models/Configuration.class');
var Participant = require('./../lib/models/Participant.class');
var Emotion = require('./../lib/models/Emotion.class');
var Avatar = require('./../lib/models/Avatar.class');

var fs = require("fs");

// on initilialise la class unique 
var EmoLyse = new _EmoLyse();
	EmoLyse.init();

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
	});



	return true;
};



exports.newExperience = function(req, res) {

		var slug = require('slug');
		var fs = require('fs');

		if (req.body.nomExp != '' ) {
			if (req.body.configExp != '' &&  typeof req.body.configExp != 'undefined') {
				ID = slug(req.body.nomExp, '_');
				if(!EmoLyse.getExperience(ID)){
					EmoLyse.newExperience(req.body.nomExp,req.body.descriptionExp,req.body.configExp,req.files.imageExp);

					res.redirect('/evaluations');
				} else req.session.error = "Le nom de l'expérience existe déjà";
			} else req.session.error = "Il faut choisir une configuration";
		} else req.session.error = "Le nom de l'expérience est vide";


	res.redirect('/');

};

exports.openExperience = function(req, res) {

			if (req.param('experience') != '' &&  typeof req.param('experience') != 'undefined') {
			
				EmoLyse.openExperience(req.param('experience'));

				res.redirect('/evaluations');
			} else req.session.error = "Il faut choisir une experience";

		res.redirect('/');
};



exports.saveZipExperience = function(req, res) {
	var util = require('util');
	var fs = require('fs');
	var archiver = require('archiver');
	var experience;


	// si un experience particuliére est demandé 
	if(req.param('id')){
		experience = EmoLyse.getExperience(req.param('id'))
		if(experience) {


		} else {
				req.session.error = "Erreur : L'experience n'existe pas. " ; 
				res.redirect('/listeExperiences');
				return true;
		}
	// sinon
	} else {
		experience = EmoLyse.experience;
	}


// var output = fs.createWriteStream(__dirname + '/example-output.zip');
var archive = archiver('zip');

// output.on('close', function() {
//   console.log(archive.pointer() + ' total bytes');
//   console.log('archiver has been finalized and the output file descriptor has closed.');
// });

archive.on('error', function(err) {
	throw err;
});

res.header('Content-Type', 'application/zip');
res.header('Content-Disposition', 'attachment; filename="EmoLyse_' + experience.ID + '.zip"');

archive.pipe(res);
var srcDirectory =__dirname+"/../EXPERIENCES/"+experience.ID+"/";

archive
	// .append(null, { name: dir })
	// .append(fs.createReadStream(dir), { name: 'file2.txt' })
.bulk([
		{ src: [ '**/*' ],dest: experience.ID, cwd: srcDirectory, expand: true }
])
	.finalize();



	// res.sendfile('/uploads/' + uid + '/' + file);
};


exports.experience = function(req, res){
	// On requpére l'error si il y en a.
	error = req.session.error;
	// On supprimer l'error car on la réqupéré
	req.session.error = null;


	if(req.param('action') == 'editExperienceDescription' && req.param('value') !='') {
		EmoLyse.experience.description = req.param('value');
		EmoLyse.saveExperience();
	} else if(req.param('action') == 'editImageProduit' && req.files.imageExp.name != '') {

		EmoLyse.setImageExp(req.files.imageExp);
		EmoLyse.saveExperience();
	}



	res.render('experience', { 
		title: 'Emolyse - Experience',
		showMenuExperience:true,
		showMenuParametre:true,
		error: error,
		experience: EmoLyse.experience,
	})
};

exports.newParticipant = function(req, res) {
	var slug = require('slug'); 

		if (req.body.numUser != '') {
			if (req.body.sexeUser == 'H'|| req.body.sexeUser == 'F') {

				if (req.body.dateNaissance != '') {

					if (req.body.lvlEtude != '' &&  typeof req.body.lvlEtude != 'undefined') {
						ID = slug(req.body.numUser, '_');
						if(!EmoLyse.experience.getParticipant(ID))
						{

							var participant =  new Participant();
							participant.init(ID,req.body.numUser,req.body.sexeUser,req.body.dateNaissance,req.body.lvlEtude);
							// EmoLyse.newExperience(req.body.nomExp,req.body.descriptionExp,req.body.configExp);
							EmoLyse.experience.addParticipant(participant);
							// on enregistre l'experience
							EmoLyse.saveExperience();
							res.redirect('/evaluations');

						} else req.session.error = "Le participant existe déja";
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
							// pour le moment j'ai choisie de definir l'id par un getTime
							date = new Date();
							ID = date.getTime();

							evaluation.init(
									ID,
									EmoLyse.experience.configuration.getEmotion(req.param('emotion')).nom,
									req.param('avatar'),
									req.param('proximite'),
									req.param('tempsDeReponse')
								);

							participant.addEvaluation(evaluation);
							// on sovegarder la nouvel experience
							EmoLyse.saveExperience();

							res.redirect('/expEtape3?id='+participant.ID);

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

	var _showParticipant = '';
	var participant = null;

	if(typeof req.param('showParticipant') != 'undefined' && req.param('showParticipant') != '') {
		_showParticipant = true;
		participant = EmoLyse.experience.getParticipant(req.param('showParticipant'));

		if(req.param('action') == 'editDateDeNaissance' && req.param('value') !='') {
			participant.dateDeNaissance = req.param('value');
			EmoLyse.saveExperience();
		} else if(req.param('action') == 'editSexe' && req.param('value') !='') {
			participant.sexe = req.param('value');
			EmoLyse.saveExperience();
		} else if(req.param('action') == 'editLvlEtude' && req.param('value') !='') {
			participant.lvlEtude = req.param('value');
			EmoLyse.saveExperience();
		} else if(req.param('action') == 'supprParticipant') {

			EmoLyse.experience.deleteParticipant(req.param('showParticipant'));
			participant = null;
			_showParticipant = '';
			EmoLyse.saveExperience();
		} else if(req.param('action') == 'supprEmotion' && req.param('value') !='') {
			participant.deleteEvaluation(req.param('value'));
			
		} 
	}

	res.render('evaluations', { 
		title: 'Emolyse - Evaluations',
		showMenuExperience:true,
		showMenuParametre:true,
		error: error,
		participants:EmoLyse.experience.participants,
		showParticipant:_showParticipant,
		participant:participant,
		experience:EmoLyse.experience,
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
				preferences:EmoLyse.getPreferences(),
				participant: participant,
				experience: EmoLyse.experience
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
		preferences:EmoLyse.getPreferences(),
		participantID:req.param('id'),
		error: error,
	});
};

// Config 
exports.configuration = function(req, res){
	var util = require('util');
	var slug = require('slug'); 
	// On requpére l'error si il y en a.
	error = req.session.error;
	// On supprimer l'error car on la réqupéré
	req.session.error = null;

	var _configuration = null;
	var _showModalNewConfig = true;

	var _showEmotion = (req.param('showEmotion'))? req.param('showEmotion') : "";

	if(req.param('action') == 'newConfig') 
	{
		if(req.param('nomConfig') != '')
		{
			var nom = req.param('nomConfig');
			var ID = slug(nom, '_');
			// si l'ID de la config n'est pas deja utiliser
			if(!EmoLyse.getConfig(ID))
			{
				_configuration = new Configuration();
				_configuration.init(
						ID,
						nom,
						req.param('descriptionConfig')
					);

				EmoLyse.saveConfiguration(_configuration);
				_showModalNewConfig = false;

			} else error = "Erreur : Le nom de la configuration est deja utilisé";
		} else error = "Erreur : Le nom de la configuration n'est pas définie";

	} else if(req.param('action') == 'showConfig')
	{
		if(req.param('id') != '')
		{
			_configuration = EmoLyse.getConfig(req.param('id'));
			_showModalNewConfig = false;
		}
	} else if(req.param('action') == 'editConfig')
	{
		_configuration = EmoLyse.getConfig(req.param('id'));
		_showModalNewConfig = false;
		if(_configuration)
		{
			switch(req.param('edit')) {
			case 'editConfigTitre':
			ID = slug(req.param('value'), '_')
				// si il y a une titre et si l'id crée n'est pas le meme et si l'id est disponible
				if(req.param('value') && ID != _configuration.ID && (!EmoLyse.getConfig(ID))) 
				{
					var fs = require("fs-extra");

					exConfigurationID = _configuration.ID
					// atention modification de l'id 
					// donc la config est "copier et renomer" puis on supprimer l'ex config 
					_configuration.ID = ID;
					_configuration.titre = req.param('value');
					// on enregistre la nouvelle config
					EmoLyse.saveConfiguration(_configuration);
					// on copy les emotions dans dans la nouvelle config
					fs.copySync(__dirname+"/../CONFIG/"+exConfigurationID+'/emotions', __dirname+"/../CONFIG/"+_configuration.ID+'/emotions', function(err){
						if (err) 
							return false;
					});
					// et on supprimer la config avec le vieux ID
					EmoLyse.supprConfiguration(exConfigurationID);

					res.json({ refresh: "true", configurationID: _configuration.ID })
					return true;
				}
				res.status(500);
				res.json({ error: "Le titre de la configuration est indisponible"})
				return true;
				break;
			case 'editConfigDescription':
				
				_configuration.description = req.param('value');

				EmoLyse.saveConfiguration(_configuration);
				res.json({ refresh: "" })
				return true;
				
				break;
			case 'editEmotionNom':

				// Indisponible pour le moment. trop d'erreur possible 

				break;
			case 'editEmotionDescription':

				emotion = _configuration.getEmotion(req.param('emotionID'));
				if(emotion)
				{
					emotion.description = req.param('value');

					EmoLyse.saveConfiguration(_configuration);
					res.json({ refresh: "" })
					return true;
				} else error = "Erreur : L'emotion n'est pas définie ";
				res.status(500);
				res.json({ error: error})
				return true;

				break;
			case 'newAvatar':
				// on recupére l'emotion courante
				emotion = _configuration.getEmotion(req.param('showEmotion'));
				if(emotion)
				{
					if(req.param('nomAvatar') != '')
					{
						ID = slug(req.param('nomAvatar'), '_');
						if(!emotion.getAvatar(ID)) // si l'avatar n'existe pas deja
						{
							if(req.files.imageAvatar.name )
							{
								var fs = require("fs-extra");
								// var im = require('imagemagick');

								// on uplode l'image dans les emotions
								newImageName = ID+"_"+req.files.imageAvatar.name;


									var newPath = __dirname+"/../CONFIG/"+_configuration.ID+"/emotions/"+emotion.ID+"/"+newImageName ;
									// fs.writeFile(newPath, data, function (err) {

									// });
									
														
									fs.readFile(req.files.imageAvatar.path, function (err, data) {
									  // ...
									  fs.writeFile(newPath, data, function (err) {

									  });
									});
									// im.crop({
									// 	srcPath: req.files.imageAvatar.path,
									// 	dstPath: newPath,
									// 	width: 145,
									// 	height: 310,
									// 	quality: 1,
									// 	gravity: "Center"
									// }, function(err, stdout, stderr){
									// 	if (err) throw err;
									// 	// console.log('resized image to fit within 200x200px');
									// });
				



					

								img = emotion.ID+"/"+newImageName;
								avatar = new Avatar();
								avatar.init(ID,req.param('nomAvatar'),img);
								
								emotion.addAvatar(avatar);
							} else error = "Erreur : L'image de l'avatar' n'est pas définie";
						} else error = "Erreur : Le nom de l'avatar' existe deja";
					} else error = "Erreur : Le nom de l'avatar' n'est pas définie";
					
				}

				break;
			case 'editAvatarNom':


				// code block

				break;
			case 'editAvatarImage':


				// code block

				break;
			case 'editAvatarUp':
				emotion = _configuration.getEmotion(req.param('showEmotion'));
				if(emotion)
				{
					avatar = emotion.getAvatar(req.param('avatarID'));
					if(avatar)
					{
						for(var i=0; i<emotion.avatars.length; i++) 
						{
							// si j'ai vien un avatar precedent
							if(emotion.avatars[i-1]) 
							{
								// quand je suis a l'avatar a up
								if(emotion.avatars[i].ID == avatar.ID)
								{

									emotion.avatars[i] = emotion.avatars[i-1];
									emotion.avatars[i-1] = avatar;
									break; // fin de la boucle 
								}
							}
						}
					} else error = "Erreur : L'avatar n'est pas définie";
				} else error = "Erreur : L'emotion n'est pas définie";
				break;
			case 'editAvatarDown':
				emotion = _configuration.getEmotion(req.param('showEmotion'));
				if(emotion)
				{
					avatar = emotion.getAvatar(req.param('avatarID'));
					if(avatar)
					{
						for(var i=0; i<emotion.avatars.length; i++) 
						{
							// si j'ai vien un avatar apres et
							if(emotion.avatars[i+1]) 
							{
								// quand je suis a l'avatar a down
								if(emotion.avatars[i].ID == avatar.ID)
								{

									emotion.avatars[i] = emotion.avatars[i+1];
									emotion.avatars[i+1] = avatar;
									break; // fin de la boucle 
								}
							}
						}
					} else error = "Erreur : L'avatar n'est pas définie";
				} else error = "Erreur : L'emotion n'est pas définie";
				break;
			case 'supprAvatar':
				emotion = _configuration.getEmotion(req.param('showEmotion'));
				if(emotion)
				{
					avatar = emotion.getAvatar(req.param('avatarID'));
					if(avatar)
					{
						var fs = require('fs-extra');

						var file = __dirname+"/../CONFIG/"+_configuration.ID+"/emotions/"+avatar.img;
						fs.remove(file, function(err){
							if (err) throw false;
							
						});
						emotion.deleteAvatar(avatar.ID);
						


					} else error = "Erreur : L'avatar n'est pas définie";
				} else error = "Erreur : L'emotion n'est pas définie";
				break;
			default:

				// default code block
			}

			// on sauvegarde la config 
			EmoLyse.saveConfiguration(_configuration);

		} else error = "Erreur : Le nom de la configuration n'est pas définie";

	} else if(req.param('action') == 'newEmotion')
	{
		_configuration = EmoLyse.getConfig(req.param('id'));
		_showModalNewConfig = false;
		if(_configuration)
		{
			
			var ID = slug(req.param('nomEmotion'), '_');
			// si il n'y a pas deja une emotion avec le meme nom 
			if(!_configuration.getEmotion(ID) )
			{
				emotion = new Emotion();

				emotion.init(ID,req.param('nomEmotion'),req.param('descriptionEmotion'));

				_configuration.addEmotion(emotion);

				EmoLyse.saveConfiguration(_configuration);
				
			} else error = "Erreur : Le nom de l'emotion est deja utilisé";
		} else error = "Erreur : Le nom de la configuration n'est pas définie";
	} else if(req.param('action') == 'supprEmotion')
	{
		_configuration = EmoLyse.getConfig(req.param('id'));
		_showModalNewConfig = false;
		if(_configuration)
		{
			emotion = _configuration.getEmotion(req.param('showEmotion'));
			if( emotion )
			{
				var fs = require('fs-extra');

				var file = __dirname+"/../CONFIG/"+_configuration.ID+"/emotions/"+emotion.ID;
				fs.remove(file, function(err){
					if (err) throw false;

				});

				_configuration.deleteEmotion(req.param('showEmotion'));

				EmoLyse.saveConfiguration(_configuration);
				_showEmotion = '';
			} else error = "Erreur : L'emotion n'est pas choisie";
		} else error = "Erreur : Le nom de la configuration n'est pas définie";
	}


	res.render('configuration', { 
		title: 'Emolyse - Configuration',
		showMenuExperience:false,
		showMenuParametre:true,
		error: error,
		showEmotion: _showEmotion,
		showModalNewConfig: _showModalNewConfig,
		configuration: _configuration,
	});
};

exports.saveZipConfiguration = function(req, res) {
	var util = require('util');
	var fs = require('fs');
	var archiver = require('archiver');
	_configuration = EmoLyse.getConfig(req.param('id'));
	if(_configuration)
	{

		var archive = archiver('zip');


		archive.on('error', function(err) {
			throw err;
		});

		res.header('Content-Type', 'application/zip');
		res.header('Content-Disposition', 'attachment; filename="EmoLyse_' + _configuration.ID + '.config.zip"');

		archive.pipe(res);
		var srcDirectory =__dirname+"/../CONFIG/"+_configuration.ID+"/";

		archive
			.bulk([
					{ src: [ '**/*' ],dest: _configuration.ID, cwd: srcDirectory, expand: true }
			])
			.finalize();

	} else {
		req.session.error = "Erreur : La configuration n'existe pas. " ; 
		res.redirect('/listeConfigurations');
	}
};

exports.listeConfigurations = function(req, res){
	// On requpére l'error si il y en a.
	error = req.session.error;
	// On supprimer l'error car on la réqupéré
	req.session.error = null;

	_configurations = EmoLyse.getConfigs();

	res.render('listeConfigurations', { 
		title: 'Emolyse - Les configurations',
		showMenuExperience:false,
		showMenuParametre:true,
		error: error,
		configurations: _configurations,
	});

};
exports.supprConfiguration = function(req, res) {
	EmoLyse.supprConfiguration(req.param('id'));
	res.redirect('/listeConfigurations');
};


exports.listeExperiences = function(req, res){
	// On requpére l'error si il y en a.
	error = req.session.error;
	// On supprimer l'error car on la réqupéré
	req.session.error = null;

	_experiences = EmoLyse.getExperiences();

	res.render('listeExperiences', { 
		title: 'Emolyse - Les experiences',
		showMenuExperience:false,
		showMenuParametre:true,
		error: error,
		experiences: _experiences,
	});

};

exports.supprExperience = function(req, res) {
	EmoLyse.supprExperience(req.param('id'));
	res.redirect('/listeExperiences');
};

//À propos d\'EmoLyse
exports.info = function(req, res){
	// On requpére l'error si il y en a.
	error = req.session.error;
	// On supprimer l'error car on la réqupéré
	req.session.error = null;


	res.render('info', { 
		title: 'Emolyse - À propos d\'EmoLyse',
		showMenuExperience:false,
		showMenuParametre:true,
		error: error,
	});

};

// Aide
exports.aide = function(req, res){
	// On requpére l'error si il y en a.
	error = req.session.error;
	// On supprimer l'error car on la réqupéré
	req.session.error = null;


	res.render('aide', { 
		title: 'Emolyse - Aide',
		showMenuExperience:false,
		showMenuParametre:true,
		error: error,
	});

};

// Aide
exports.preferences = function(req, res){
	// On requpére l'error si il y en a.
	error = req.session.error;
	// On supprimer l'error car on la réqupéré
	req.session.error = null;

	preferences = EmoLyse.getPreferences();

	if(req.param('action') == "editTextNouvelleEval" && req.param('value')) {

		preferences.textNouvelleEval = req.param('value').replace(/\n/g, '<br>');
		EmoLyse.setPreferences(preferences);

	} else if(req.param('action') == "editTextFinEval" && req.param('value')) {
		
		preferences.textFinEval = req.param('value').replace(/\n/g, '<br>');
		EmoLyse.setPreferences(preferences);

	}



	res.render('preferences', { 
		title: 'Emolyse - Aide',
		showMenuExperience:false,
		showMenuParametre:true,
		preferences:preferences,
		error: error,
	});

};
exports.importZipConfiguration = function(req, res){
	// On requpére l'error si il y en a.
	error = req.session.error;
	// On supprimer l'error car on la réqupéré
	req.session.error = null;

	var fs = require('fs');
	var AdmZip = require('adm-zip');



	if(req.files.importConfig.name) {

		var configDirectory =__dirname+"/../CONFIG/";

		var zip = new AdmZip( req.files.importConfig.path );
		var zipEntries = zip.getEntries(); // an array of ZipEntry records

		zipEntries.forEach(function(zipEntry) {
				console.log(zipEntry.toString()); // outputs zip entries information

				if (zipEntry.name == "config.json") {

					config = JSON.parse( zip.readAsText(zipEntry) );
					// si une config porte deja le meme nom 
					if(!EmoLyse.getConfig(config.ID)){
						zip.extractAllTo(/*target path*/configDirectory, /*overwrite*/true);

					} else {
						req.session.error = "Une configuration porte déjà le même nom." ; 
					}
				}
			});
		
	}


	res.redirect('/listeConfigurations');

};


exports.importZipExperience = function(req, res){
	// On requpére l'error si il y en a.
	error = req.session.error;
	// On supprimer l'error car on la réqupéré
	req.session.error = null;

	var fs = require('fs');
	var AdmZip = require('adm-zip');



	if(req.files.importExperience.name) {

		var expDirectory =__dirname+"/../EXPERIENCES/";

		var zip = new AdmZip( req.files.importExperience.path );
		var zipEntries = zip.getEntries(); // an array of ZipEntry records

		zipEntries.forEach(function(zipEntry) {

				if (zipEntry.name == "experience.json") {
					experience = JSON.parse( zip.readAsText(zipEntry) );
					// si une config porte deja le meme nom 
					if(!EmoLyse.getExperience(experience.ID)){
						zip.extractAllTo(/*target path*/expDirectory, /*overwrite*/true);

					} else {
						req.session.error = "Une experience porte déjà le même nom." ; 
					}
				}
			});
		
	}


	res.redirect('/listeExperiences');


};

exports.saveXLSExperience = function(req, res){
	// On requpére l'error si il y en a.
	error = req.session.error;
	// On supprimer l'error car on la réqupéré
	req.session.error = null;

	var fs = require('fs-extra');

	// si un experience particuliére est demandé 
	if(req.param('id')){
		experience = EmoLyse.getExperience(req.param('id'))
		if(experience) {

		} else {
				req.session.error = "Erreur : L'experience n'existe pas. " ; 
				res.redirect('/listeExperiences');
				return true;
		}
	// sinon
	} else {
		experience = EmoLyse.experience;
	}


	data = '';

	var delimiter = "\t";

	var header=	'"' +"Numéro du participant"+ '"'			+delimiter+
				'"' +"Sexe"+ '"'							+delimiter+
				'"' +"Date de naissance"+ '"'				+delimiter+
				'"' +"Plus haut niveau d'étude"+ '"'		+delimiter+

				'"' +"Evaluation"+ '"'						+delimiter+
				'"' +"Emotion"+ '"'							+delimiter+
				'"' +"Proximité"+ '"'						+delimiter+
				'"' +"Intensité"+ '"'						+delimiter+
				'"' +"Durée"+ '"';

	data += header + '\r\n';

	var participant;
	var evaluation;
	var row;
	for (var i = 0; i < experience.participants.length; i++) {
		participant = experience.participants[i];

		for (var i = 0; i < participant.evaluations.length; i++) {
			evaluation = participant.evaluations[i]

			row = 	'"' +participant.numero+ '"' 				+delimiter+
					'"' +participant.sexe+ '"' 					+delimiter+
					'"' +participant.dateDeNaissance+ '"' 		+delimiter+
					'"' +participant.lvlEtude+ '"' 				+delimiter+

					'"' +evaluation.ID+ '"' 					+delimiter+
					'"' +evaluation.emotion+ '"' 				+delimiter+
					'"' +evaluation.proximite+ '"' 				+delimiter+
					'"' +evaluation.avatar+ '"' 				+delimiter+
					'"' +evaluation.tempsDeReponse+ '"' 		;
			data += row+ '\r\n';
		};
	};


	res.header('Content-Type', 'application/vnd.openxmlformats');
	res.header('charset', 'utf-8');
	res.header("Content-Disposition", "attachment; filename=" + "EmoLyse_"+experience.ID+".xls");
	res.send(data);
};