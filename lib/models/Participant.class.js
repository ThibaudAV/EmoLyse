
var Evaluation = require(__dirname+'/Evaluation.class');

/* 
 * Class Participant 
 */
var Participant = function Participant() {
	this.ID = null;
	this.numero = null;
	this.sexe = null;
	this.dateDeNaissance = null;
	this.lvlEtude = null;
	this.evaluations = [];

	// init
	this.init = function(ID,numero,sexe,dateDeNaissance,lvlEtude) {
		this.ID = ID;
		this.numero = numero;
		this.sexe = sexe;
		this.dateDeNaissance = dateDeNaissance;
		this.lvlEtude = lvlEtude;
	}

	// Ajouter une evaluation
	this.addEvaluation = function(evaluation) {
		this.evaluations.push(evaluation);
	}
	// retourne le evaluation avec l'ID
	this.getEvaluation = function(ID) {

		for(var i=0; i<this.evaluations.length; i++) 
		{
			if(this.evaluations[i].ID == ID)
			{
				return this.evaluations[i];
			}
		}
		return false;
	}
	// supprime le evaluation avec l'ID
	this.deleteEvaluation = function(ID) {

		for(var i=0; i<this.evaluations.length; i++) 
		{
			if(this.evaluations[i].ID == ID)
			{
				this.evaluations.splice(i,1);
				return true;
			}
		}
		return false;
	}

}

module.exports = Participant;
