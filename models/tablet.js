var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TabletSchema = new Schema({
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

//Virtual for Tablet's URL
TabletSchema.virtual('url').get(function () {
  return '/catalog/tablet/' + this._id;
});

//export model
module.exports = mongoose.model('Tablet', TabletSchema);
