var mongoose = require("mongoose");
var Category = require('../models/category');


var categories = {

  getAll: function(req, res) {
    Category.find({},{'__v': 0}, function(err, categories){
		    res.json(categories);
	  });
  },
  getAllPublic: function(req, res) {
    Category.find({},{'__v': 0}, function(err, categories){
        res.json(categories);
    });
  },


  create: function(req, res) {
    var newCategory = req.body;
  	if(newCategory.hasOwnProperty('name') && newCategory.hasOwnProperty('color') && newCategory.hasOwnProperty('label')){

  
  		var addCategory = new Category({'name':newCategory['name'], 'label': newCategory['label'],'color':newCategory['color']});
  		console.log(addCategory);
  		addCategory.save();
      res.json(addCategory);
  	}
  	else {
  		res.status(401).json({
  			"status": 401,
  			"message": "Data format is wrong. Not all required properties are included"
		  });
    }
  },

	update: function(req, res) {
    var updatedCategory = req.body;
  	if(updatedCategory.hasOwnProperty('name') && updatedCategory.hasOwnProperty('color') && updatedCategory.hasOwnProperty('label')){
  		id = updatedCategory['_id']
  		Category.findOne({'_id': id}, function(err, category){
  			
  			category['name'] = updatedCategory['name']; 
  			category['label'] = updatedCategory['label'];
  			category['color'] = updatedCategory['color'];
			category.save();
			res.json(category);
		});
  	}
  	else {
  		res.status(401).json({
  			"status": 401,
  			"message": "Data format is wrong. Not all required properties are included"
		  });
    }
  },
};


module.exports = categories;
