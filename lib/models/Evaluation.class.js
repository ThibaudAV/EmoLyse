

/* 
 * Class Utilisateur 
 */
var Evaluation = function Evaluation() {
	this.ID = null;
	this.emotion = null;
	this.avatar = null;
	this.proximite = null;
	this.tempsDeReponse = null;

	// init
	this.init = function(ID,emotion,avatar,proximite,tempsDeReponse) {
		this.ID = ID;
		this.emotion = emotion;
		this.avatar = avatar;
		this.proximite = proximite;
		this.tempsDeReponse = tempsDeReponse;
	}

}

module.exports = Evaluation;

