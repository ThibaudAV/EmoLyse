
// var Experience = require('./models/Experience.class');

/*
 * Configuration 
 */
var Configuration = function Configuration() {
	this.ID = null; // slug du titre
	this.titre = null;
	this.description = null;
	this.emotions = [];

	this.init = function(ID,titre,description) {
		this.ID = ID;
		this.titre = titre;
		this.description = description;
	}
	// fonction pour charger une config . config 
	this.load = function(config) {

		// on init la config
		this.init(config.ID,config.titre,config.description);

		// pour toutes les emotions
		for(var i=0; i<config.emotions.length; i++) 
		{
			var emotion = new Emotion();
			emotion.init(config.emotions[i].ID, config.emotions[i].nom, config.emotions[i].description);

			// pour tous les avatars
			for(var ii=0; ii<config.emotions[i].avatars.length; ii++) 
			{
				var avatar = new Avatar();
				avatar.init(config.emotions[i].avatars[ii].ID, config.emotions[i].avatars[ii].nom, config.emotions[i].avatars[ii].img);

				// on ajoute les avatars de l'emotion
				emotion.addAvatar(avatar);
			}
			// on ajoute lemotion a la config
			this.emotions.push(emotion);
		}
		return true;
	}
	// Permet de ferifier une config 
	// fileJSON : objet json de la config
	this.verify = function(fileJSON) {



	}

	// retourne l'emotion avec l'ID
	this.getEmotion = function(ID) {

		for(var i=0; i<this.emotions.length; i++) 
		{
			if(this.emotions[i].ID == ID)
			{
				return this.emotions[i];
			}
		}
		return false;
	}
}


// class emotion 
function Emotion() {
	this.ID = null;
	this.nom = null;
	this.description = null;
	this.avatars = [];

	this.init = function(ID,nom,description) {
		this.ID = ID;
		this.nom = nom;
		this.description = description;
	}
	this.addAvatar = function(avatar) {
		this.avatars.push(avatar);
	}

}

// class avatar
function Avatar() {
	this.ID = null;
	this.nom = null;
	this.img = null;

	this.init = function(ID,nom,img) {
		this.ID = ID;
		this.nom = nom;
		this.img = img;
	}
}

module.exports = Configuration;
