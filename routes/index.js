
/*
 * GET home page.
 */

exports.index = function(req, res){
	error = '';
	error = req.session.error;
	req.session.error = null;
  	
  	res.render('index', { 
  		title: 'Emolyse - Home',
  		error: error,
 	})
};

exports.expEtape1 = function(req, res){
  res.render('expEtape1', { 
  	title: 'Emolyse - Experience',
  })
};

exports.expEtape2 = function(req, res){
  res.render('expEtape2', { 
  	title: 'Emolyse - Experience',
  })
};

exports.expEtape3 = function(req, res){
  res.render('expEtape3', { 
    title: 'Emolyse - Experience',
  })
};