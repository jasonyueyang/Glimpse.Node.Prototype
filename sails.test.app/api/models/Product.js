/**
* Product.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    
    id : 
    { 
      type: 'integer',
      autoIncrement: true
    },
    name: 
    {
      type: 'string',
      defaultsTo: ''
    },
    description: 
    { 
      type: 'string',
      defaultsTo: '' 
    },
    price: 
    {
      type : 'float',
      defaultsTo : 0.0
    }
  }
};

