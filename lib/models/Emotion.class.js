
// var Avatar = require(__dirname+'/Avatar.class');
// class emotion 
var Emotion = function Emotion() {
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


module.exports = Emotion;