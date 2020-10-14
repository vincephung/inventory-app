var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Category_ListSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String },
  //file_url: { type: String },
});

//Virtual for Category List's URL
//THE URL MIGHT HAVE TO BE JUST empty, no ID
Category_ListSchema.virtual('url').get(function () {
  return '/catalog/category_list/' + this._id;
});

//export model
module.exports = mongoose.model('Category_List', Category_ListSchema);
