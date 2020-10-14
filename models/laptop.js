var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LaptopSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category_List',
    required: true,
  },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  //file_url: { type: String },
});

//Virtual for laptop's URL
LaptopSchema.virtual('url').get(function () {
  return '/catalog/laptop/' + this._id;
});

//export model
module.exports = mongoose.model('Laptop', LaptopSchema);
