/**
 * ProductController
 *
 * @description :: Server-side logic for managing Products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
     
  /**
   * `ProductController.newProduct()`
   */
  newProduct: function (req, res) {
      
    var data = {
      name: req.param('name'),
      description: req.param('description'),
      price: req.param('price')
    };
        
    Product.create(data).exec( function createCB(err, created) {
             return res.view('productDetails', {product: created});
     });
 
  },

  /**
   * `ProductController.allProducts()`
   */
  allProducts: function (req, res) { 
   
    Product.find().exec( function (err, productList) {
          return res.view('productList', {productList: productList});
    });
   
  }, 


  /**
   * `ProductController.getProduct()`
   */
  getProduct: function (req, res) { 
    Product.findOne({where: {id: req.param('productId')}}).exec(
      function(err, product) {
        return res.view('productDetails', { product : product });
      });
  } 
};

