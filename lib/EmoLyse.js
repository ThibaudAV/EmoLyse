

var Experience = require('./models/Experience.class');
var Configuration = require('./models/Configuration.class');

/*
 * Emolyse : Ĉlass principale de l'application 
 */

var EmoLyse = function(){

	this.experience = new Experience();


	// nouvelle experience
	this.newExperience = function(nom, description, configID, imageExp) {
		var configuration;
		// on récupère le json de la configuration 
		var fs = require("fs-extra");
		var slug = require('slug'); 



		// try {
		// 	// on ouvre le fichier json 
		// 	var fileData = fs.readFileSync(urlConfiguration+"/config.json", 'utf8');
		// 	// on parse le fichier json
		// 	configuration = JSON.parse(fileData);

		// 	// on verifie le fichier json avec un schema. 
		// 	// 
		// 	// A faire  !!!!!!!!!!!!!!!!!!!!!!!!!!
			 
			

		// } catch (ex) {
		// 	return false;			
		// }
		
		// on recupére la configuration 
		configuration = this.getConfig(configID);
		if(!configuration)
			return false;

		// on supprimer l'experience précédente si il y en a. 
		this.experience = new Experience();
		// on init l'experience . ID est un slug 
		this.experience.init(slug(nom, '_'), nom, description, configuration, imageExp.name);
		
		_this = this;
		// on copie les emotions dans l'experience
		fs.copy(__dirname+"/../CONFIG/"+configuration.ID+'/emotions', __dirname+"/../EXPERIENCES/"+_this.experience.ID+'/emotions', function(err){
			if (err) 
				return false;
		});

		// on sovegarde la nouvel experience
		this.saveExperience();

		// on uplode l'image comme on a une nouvel experience

		if (imageExp.name) {
			fs.readFile(imageExp.path, function (err, data) {
			  // ...
			  var newPath = __dirname+"/../EXPERIENCES/"+_this.experience.ID+"/"+imageExp.name ;
			  fs.writeFile(newPath, data, function (err) {

			  });
			});
		} else { // image par defaut

		}
		return true;
	}

	// ouvir une experience a partir de l'url
	this.openExperience = function(experienceID) {
	// on supprimer l'experience précédente si il y en a. 
		this.experience = new Experience();
		var dir = __dirname+"/../EXPERIENCES";   // dossier qui contien toutes les configurations 
		
		var experience;

		// on récupère le json de l'experience
		var fs = require("fs");
		try {
			// on ouvre le fichier json 
			var fileData = fs.readFileSync(dir+"/"+experienceID+"/experience.json", 'utf8');
			// on parse le fichier json
			experience = JSON.parse(fileData);

			// on verifie le fichier json avec un schema. 
			// 
			// A faire  !!!!!!!!!!!!!!!!!!!!!!!!!!
			 
		} catch (ex) {
			return false;			
		}

		this.experience.load(experience);
		return true;
	}

	// sauvegarder une experience
	this.saveExperience = function() {
		var fs = require("fs");
		// le nom du dossier et l'id de l'experience 

		var dir = __dirname+"/../EXPERIENCES/"+this.experience.ID;

		// si le dossier de l'experience n'existe pas
		if(!fs.existsSync(dir)) {
			fs.mkdir(dir, function(error) {
			  return false;
			});
		}

		fs.writeFile(dir+"/experience.json", JSON.stringify(this.experience, null, 4), function(err) {
			if(err) {
				return false
			} else {
				
			}
		});

		return JSON.stringify(this.experience);
	}
	
	this.supprExperience = function (ID) {
		var fs = require('fs-extra');
		var dir = __dirname+"/../EXPERIENCES/"+ID;
		return fs.removeSync(dir, function(err){
			if (err) return false;

			return true;
		});
	}

	// Liste des experiences du dossier EXPERIENCES  
	this.getExperiences = function() {
		var fs = require("fs");
		// var util = require('util');
		var dir = __dirname+"/../EXPERIENCES";   // dossier qui contien toutes les configurations 
		var experiences = [];                   	// les experiences
		
		// on parcour le dossier
		fs.readdirSync(dir).forEach(function(file) {

			var dirFile = dir+'/'+file;
			var stat = fs.statSync(dirFile);

			if (stat && stat.isDirectory()) { // Pour tous les dossiers

				try {
					var experience = null;
					var result;
					// on ouvre le fichier json 
					var fileData = fs.readFileSync(dirFile+"/experience.json", 'utf8');
					// on parse le fichier json
					result = JSON.parse(fileData);

					// on verifie le fichier json avec un schema. 
					// 
					// A faire  !!!!!!!!!!!!!!!!!!!!!!!!!!
					experience = new Experience();
					experience.load(result);

					 // experience.push(dirFile);
					 // experience.push(result.nom);
					 experiences.push(experience);

				} catch (ex) {

				}
			}
		});
		return experiences;
	}
	// retourn l'experience en fonction de sont id 
	this.getExperience = function  (ID) {

		var experiences = this.getExperiences();

		for(var i=0; i<experiences.length; i++) 
		{
			if(experiences[i].ID == ID)
			{
				return experiences[i];
			}
		}
		return false;
	}

	/*
	 *   Liste les configurations du dossier CONFIG.
	 *   Verifie les config et recupére les info dans le fichier config
	 *
	 * A faire : verification config
	 */
	this.getConfigs = function  () {
		var fs = require("fs");
		// var xml2js = require('xml2js');
		var util = require('util');
	 // var libxmljs = require("libxmljs");
		var configs = [];                   // les configs
		var dir = __dirname+"/../CONFIG";   // dossier qui contien toutes les configurations 

		// on parcour le dossier
		fs.readdirSync(dir).forEach(function(file) {

			var dirFile = dir+'/'+file;
			var stat = fs.statSync(dirFile);

			if (stat && stat.isDirectory()) { // si le file est un dossier 

				// ////////////////////////////////////////////////////////
				// Pour un fichier json :
				// ////////////////////////////////////////////////////////
				try {
					var config = [];
					var result;
					// on ouvre le fichier json 
					var fileData = fs.readFileSync(dirFile+"/config.json", 'utf8');
					// on parse le fichier json
					result = JSON.parse(fileData);

					// on verifie le fichier json avec un schema. 
					// 
					// A faire  !!!!!!!!!!!!!!!!!!!!!!!!!!
					// 
					configuration = new Configuration();
					configuration.load(result);

					// config.push(dirFile);
					// config.push(result.titre);
					configs.push(configuration);

				} catch (ex) {

				}

				// var obj;
				// fs.readFile(dirFile+"/config.json", 'utf8', function (err, data) {
				// 	if(!err){
				// 		obj = JSON.parse(data);
				// 		configs.push(obj);
				// 	}
				// 	configs.push(err);
				// });


			} else { // si le file est un fichier 

			};

		});

		return configs;
	}
	// retourn la config en fonction de sont id 
	this.getConfig = function  (ID) {

		var configs = this.getConfigs();

		for(var i=0; i<configs.length; i++) 
		{
			if(configs[i].ID == ID)
			{
				return configs[i];
			}
		}
		return false;
	}
	// sovegarde une nouvel config
	this.saveConfiguration = function  (configuration) {
		var fs = require("fs");
		// le nom du dossier et l'id de l'experience 

		var dir = __dirname+"/../CONFIG/"+configuration.ID;

		// si le dossier de l'a config n'existe pas
		if(!fs.existsSync(dir)) {
			fs.mkdir(dir, function(error) {
			  return false;
			});
		}
		// si le dossier de emotions n'existe pas
		if(!fs.existsSync(dir+"/emotions")) {
			fs.mkdir(dir+"/emotions", function(error) {
			  return false;
			});
		}

		for (var i = 0; i < configuration.emotions.length; i++) {
			
			if(!fs.existsSync(dir+"/emotions/"+configuration.emotions[i].ID)) {
				fs.mkdir(dir+"/emotions/"+configuration.emotions[i].ID, function(error) {
				  return false;
				});
			}
		}


		fs.writeFile(dir+"/config.json", JSON.stringify(configuration, null, 4), function(err) {
			if(err) {
				return false;
			} else {
				
			}
		});

		return JSON.stringify(configuration);
	}
	this.supprConfiguration = function (ID) {
		var fs = require('fs-extra');
		var dir = __dirname+"/../CONFIG/"+ID;
		return fs.remove(dir, function(err){
			if (err) return false;

		});
	}
	this.setImageExp = function(imageExp) {
		var fs = require('fs-extra');

		if (imageExp.name) {
			var dir = __dirname+"/../EXPERIENCES/"+this.experience.ID+"/";

			// on suppromer l'image acttuel 
			fs.removeSync(dir+this.experience.imageExp, function(err){
				if (err) return false;
			});
			// on ajoute la nouvelle image
			this.experience.imageExp = imageExp.name;
			// on upload la nouvelle image
			 fs.readFile(imageExp.path, function (err, data) {
			  var newPath = dir+imageExp.name ;
			  fs.writeFile(newPath, data, function (err) {
				if (err) return false;

				return true;
			  });
			});
		} else { // image par defaut
			
		}
	}
	this.getPreferences = function() {
		var fs = require("fs");

		var preferences = false;
		try {
			// on ouvre le fichier json 
			var fileData = fs.readFileSync(__dirname+"/preferences.json", 'utf8');
			// on parse le fichier json
			preferences = JSON.parse(fileData);

			} catch (ex) {

			}

		return preferences;
	}
	this.setPreferences = function(preferences) {
		var fs = require("fs");

		fs.writeFile(__dirname+"/preferences.json", JSON.stringify(preferences, null, 4), function(err) {
			if(err) {
				return false;
			} else {
				return true;
			}
		});
	}

}


module.exports = EmoLyse;

