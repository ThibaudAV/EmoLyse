

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
	this.openExperience = function(urlExperience) {
		var experience;

		// on récupère le json de l'experience
		var fs = require("fs");
		try {
			// on ouvre le fichier json 
			var fileData = fs.readFileSync(urlExperience+"/experience.json", 'utf8');
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
					var experience = [];
					var result;
					// on ouvre le fichier json 
					var fileData = fs.readFileSync(dirFile+"/experience.json", 'utf8');
					// on parse le fichier json
					result = JSON.parse(fileData);

					// on verifie le fichier json avec un schema. 
					// 
					// A faire  !!!!!!!!!!!!!!!!!!!!!!!!!!
					
					 experience.push(dirFile);
					 experience.push(result.nom);
					 experiences.push(experience);

				} catch (ex) {

				}
			}
		});
		return experiences;
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
				// Pour un fichier xml :
				// ////////////////////////////////////////////////////////
				/*
				try {
					// on ouvre le fichier config.xml de 
					var fileData = fs.readFileSync(dirFile+"/config.xml", 'utf8');
					var parser = new xml2js.Parser();    
					// on parse le fichier xml
					parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
					    if(!err){
							// jsonConfig = result["configuration"].titre;
							// jsonConfig = util.inspect(result["configuration"].titre, false, null)

				 			configs.push(result["configuration"].titre);

						}
					});

				// var xmlDoc = libxmljs.parseXmlString(fileData);
				//  var gchild = xmlDoc.get('configuration').get('titre');
				//  configs.push(gchild);

				} catch (ex) {

				}
				*/
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
		return fs.removeSync(dir, function(err){
			if (err) return false;

			return true;
		});
	}

}


module.exports = EmoLyse;

