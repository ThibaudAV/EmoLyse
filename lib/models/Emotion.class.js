
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
	// retourne l'avatar avec l'ID
	this.getAvatar = function(ID) {

		for(var i=0; i<this.avatars.length; i++) 
		{
			if(this.avatars[i].ID == ID)
			{
				return this.avatars[i];
			}
		}
		return false;
	}
	// supprime le avatars avec l'ID
	this.deleteAvatar = function(ID) {

		for(var i=0; i<this.avatars.length; i++) 
		{
			if(this.avatars[i].ID == ID)
			{
				this.avatars.splice(i,1);
				return true;
			}
		}
		return false;
	}

}


module.exports = Emotion;