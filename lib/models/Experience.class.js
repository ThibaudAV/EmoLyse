
var Configuration = require(__dirname+'/Configuration.class');

var Participant = require(__dirname+'/Participant.class');
var Evaluation = require(__dirname+'/Evaluation.class');

/* 
 * Class Experience 
 */
var Experience =  function Experience() {
	this.ID = null;
	this.nom  = null;
	this.description = null;
	this.imageExp = null;
	this.configuration = new Configuration();
	this.participants = [];

	// init de l'experience
	this.init = function(ID,nom, description, configuration, imageExp) {
		this.ID = ID; 
		this.nom = nom;
		this.description = description;
		this.imageExp = imageExp;

		// on charge la config a partir de sont chemain 
		this.configuration.load(configuration);
	}

	// on charge une experience a partir de l'url du dossier
	this.load = function(experience) {
		// on init la experience
		this.init(experience.ID,experience.nom,experience.description,experience.configuration,experience.imageExp);


		// pour tous les participants
			
		for(var i=0; i<experience.participants.length; i++) 
		{
			var participant = new Participant();
			participant.init(
				experience.participants[i].ID, 
				experience.participants[i].numero, 
				experience.participants[i].sexe, 
				experience.participants[i].dateDeNaissance, 
				experience.participants[i].lvlEtude);

			// pour toutes les evaluations
			for(var ii=0; ii<experience.participants[i].evaluations.length; ii++) 
			{
				var evaluation = new Evaluation();
				evaluation.init(
					experience.participants[i].evaluations[ii].ID, 
					experience.participants[i].evaluations[ii].emotion, 
					experience.participants[i].evaluations[ii].avatar,
					experience.participants[i].evaluations[ii].proximite,
					experience.participants[i].evaluations[ii].tempsDeReponse);

				// on ajoute les evaluations du participants
				participant.addEvaluation(evaluation);
			}
			// on ajoute les participants a la experience
			this.participants.push(participant);
		}
		
		return true;
	}

	// ajouter un participant
	this.addParticipant = function(numero,sexe,dateDeNaissance,lvlEtude) {
		var slug = require('slug'); 

		participant = new Participant();
		participant.init(slug(numero, '_'),numero,sexe,dateDeNaissance,lvlEtude);

		this.participants.push(participant);
	}
	// retourne le participant avec l'ID
	this.getParticipant = function(ID) {

		for(var i=0; i<this.participants.length; i++) 
		{
			if(this.participants[i].ID == ID)
			{
				return this.participants[i];
			}
		}
		return false;
	}
}

module.exports = Experience;
