// class avatar
var Avatar = function Avatar() {
	this.ID = null;
	this.nom = null;
	this.img = null;

	this.init = function(ID,nom,img) {
		this.ID = ID;
		this.nom = nom;
		this.img = img;
	}
	this.uploadImage = function(img) {
		
	}
}

module.exports = Avatar;