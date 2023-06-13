const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: Array, required: true },
  directions: { type: Array, required: true },
  course: { type: String, required: true },
});

const RecipeModel = mongoose.model("recipe", recipeSchema);

module.exports = { RecipeModel };
