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

module.exports = { recipeRoute };
