const axios = require('axios');
 
class ProductService {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8000'
    });
  }
 
  getAllProducts = () => {
    return this.api.get('/products');
  };
 
  getOneProductUPC = (upcNumber) => {
    return this.api.get(`/products?barcode_number=${upcNumber}`);
  }
  getProductTitles = (searchTerm) => {
    return this.api.get(`/products?title_like=${searchTerm}`);
  }
 
}
 
module.exports = ProductService;