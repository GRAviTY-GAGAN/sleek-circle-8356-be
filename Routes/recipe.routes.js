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
  let { page, category, course } = req.query;
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

  try {
    const recipes = await RecipeModel.find(filterQuery)
      .limit(12)
      .skip(12 * page);
    const recipesCount = await RecipeModel.find(filterQuery).countDocuments();
    res.json({ recipes, recipesCount });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = { recipeRoute };
