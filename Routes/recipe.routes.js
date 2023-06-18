const express = require("express");
const { adminAuth } = require("../Middleware/AdminAuth");
const { RecipeModel } = require("../Models/recipe.model");

const recipeRoute = express.Router();

recipeRoute.post("/add", adminAuth, async (req, res) => {
  try {
    const recipe = new RecipeModel(req.body);
    await recipe.save();
    res.statusMessage = "Recipe added";
    res.json({
      msg: "Recipe has been added to the database.",
      recipe,
      status: "success",
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

recipeRoute.get("/", async (req, res) => {
  let { page, category, course, title } = req.query;
  console.log(req.query);
  if (page) {
    page = Number(page) - 1;
  }
  if (!page || page < 0) {
    page = 0;
  }

  const filterQuery = {};
  if (category) {
    filterQuery.category = { $in: category };
  }

  if (course) {
    filterQuery.course = { $in: course };
  }

  if (title) {
    filterQuery.name = { $regex: title, $options: "i" };
  }

  try {
    const recipes = await RecipeModel.find(filterQuery)
      .limit(12)
      .skip(12 * page);
    const recipesCount = await RecipeModel.find(filterQuery).countDocuments();

    const breakfastCount = await RecipeModel.find({
      course: "Breakfast",
    }).countDocuments();

    const lunchCount = await RecipeModel.find({
      course: "Lunch",
    }).countDocuments();

    const dinnerCount = await RecipeModel.find({
      course: "Dinner",
    }).countDocuments();

    const startersCount = await RecipeModel.find({
      course: "Starters",
    }).countDocuments();

    const drinksCount = await RecipeModel.find({
      course: "Drinks",
    }).countDocuments();
    res.json({
      recipes,
      recipesCount,
      breakfastCount,
      lunchCount,
      dinnerCount,
      startersCount,
      drinksCount,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

recipeRoute.get("/signleRecipe/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await RecipeModel.findOne({ _id: id });

    res.json({ recipe });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = { recipeRoute };
