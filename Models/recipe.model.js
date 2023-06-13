const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: String },
  directions: { type: String },
  variations: { type: String },
  course: { type: String, required: true },
  review: { type: String },
  category: { type: String },
});

// {
//     id: 8,
//     image: "https://www.skinnytaste.com/wp-content/uploads/2023/02/Egg-White-Muffins-with-Turkey-Bacon-Cottage-Cheese-and-Veggies-8-1024x1536.jpg",
//     name: "High Protein Egg White Muffins with Turkey Bacon",
//     desc: "Meal prep these delicious, high-protein Egg White Muffins with turkey bacon, cottage cheese, and veggies for a quick breakfast on the go!.",
//     category: "Non-Veg",
//     ing: "Egg Whites: Buy a 16-ounce carton of egg whites. | Cottage Cheese: You’ll need one small container of 2% cottage cheese. | Seasoning: Garlic powder, seasoning salt | Onions: Chop shallots (or red onions) and scallions. | Bell Pepper: I like using orange or red bell pepper. | Broccoli: Steam and chop a half cup of fresh or frozen broccoli. | Turkey Bacon: Cut six slices of turkey bacon in half. I used Applegate, but any brand will do. | Cheese: Sharp shredded cheddar cheese",
//     steps: "Vegetables: Sauté the shallots, scallions, and bell pepper in olive oil over medium-low heat for about five minutes. Add in the broccoli and cook for a minute. | Egg Mixture: Combine the egg whites, cottage cheese, garlic powder, and seasoning salt, and then mix in the vegetables. | Line a muffin tin with a half slice of turkey bacon around the edges, pour in the eggs, and top the cups with shredded cheese.",
//     variations: "Vegetarian: Omit the sausage | Dairy Free: Omit the parmesan cheese | Egg Free: Omit the egg, there’s still plenty of protein.",
//     course: "Breakfast",
//     review: "5k"
// },

const RecipeModel = mongoose.model("recipe", recipeSchema);

module.exports = { RecipeModel };
