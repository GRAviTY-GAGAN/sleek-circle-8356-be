const express = require("express");
const { adminAuth } = require("../Middleware/AdminAuth");
const { RecipeModel } = require("../Models/recipe.model");
const { userAuth } = require("../Middleware/UserAuth");
const { UserModel } = require("../Models/user.model");

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

recipeRoute.post("/saveRecipe/:id", userAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById({ _id: req.body.userID });
    console.log(id);
    if (user) {
      if (user.recipes.includes(id)) {
        res.statusMessage = "Recipe already exists.";
        res.json({
          msg: "Recipe already added to you save list.",
          status: "warning",
          user,
        });
      } else {
        console.log(id);
        const newRecipe = [...user.recipes, id];

        const update = await UserModel.findByIdAndUpdate(
          { _id: req.body.userID },
          { recipes: newRecipe }
        );

        if (update) {
          res.statusMessage = "Recipe saved.";
          res.json({
            msg: "Recipe added to your save list.",
            status: "success",
            update,
          });
        } else {
          res.statusMessage = "Request Failed";
          res.json({
            msg: "Something went wrong. Please try again.",
            status: "warning",
          });
        }
      }
    } else {
      res.statusMessage = "Request Failed";
      res.json({
        msg: "Something went wrong. Please try again.",
        status: "warning",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

recipeRoute.post("/updateRecipe/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await RecipeModel.findOne({ _id: id });

    if (recipe) {
      const updatedRecipe = await RecipeModel.findByIdAndUpdate(
        { _id: id },
        req.body
      );
      res.statusMessage = "Recipe Updated";
      res.json({
        msg: "Recipe updated successfully.",
        updatedRecipe,
        status: "success",
      });
    } else {
      res.statusMessage = "Request failed.";
      res.json({
        msg: "No Recipe found with the provided ID.",
        status: "warning",
      });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

recipeRoute.delete("/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  console.log(id, "ID");
  try {
    const deletedRecipe = await RecipeModel.findByIdAndDelete({ _id: id });

    if (deletedRecipe) {
      res.statusMessage = "Recipe deleted.";
      res.json({
        msg: "Recipe successfully deleted from the database.",
        status: "success",
      });
    } else {
      res.json({ msg: "Could not delete try again." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

recipeRoute.get("/savedRecipes", userAuth, async (req, res) => {
  const { userID } = req.body;
  try {
    const user = await UserModel.findById({ _id: userID });

    if (user) {
      const recipes = await RecipeModel.find({ _id: { $in: user.recipes } });

      res.json({ recipes: recipes });
    } else {
      res.json({ msg: "User not authorised!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

recipeRoute.get("/removeSaved/:id", userAuth, async (req, res) => {
  const { userID } = req.body;
  const { id: postID } = req.params; //destructure object and renameing
  try {
    const user = await UserModel.findById({ _id: userID });
    let updatedRecipe = user.recipes;

    updatedRecipe = updatedRecipe.filter((item) => item != postID);

    const updatedUser = await UserModel.findByIdAndUpdate(
      { _id: userID },
      { recipes: updatedRecipe }
    );
    if (updatedUser) {
      res.statusMessage = "Recipe deleted.";
      res.json({
        msg: "Recipe removed from your save list.",
        status: "success",
      });
    } else {
      res.statusMessage = "Request failed.";
      res.json({
        msg: "Something went wrong.",
        status: "error",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


recipeRoute.post('/post', userAuth, async (req, res) => {
  try {
      const newPost = await RecipeModel.create(req.body);
      res.status(201).json(newPost);
  } catch (error) {
      res.status(500).json({ error: 'Error creating post' });
  }
});


// like a recipe
recipeRoute.patch("/like/:recipeID", userAuth, async (req, res) => {
  const recipeID = req.params.recipeID;
  try {
    const recipe = await RecipeModel.findById({ _id: recipeID });
    const index = recipe.likes.findIndex((id) => {
      return id === String(req.body.userID);
    });
    // console.log("index",index)

    if (index == -1) {
      recipe.likes.push(req.body.userID);
    } else {
      recipe.likes = recipe.likes.filter((id) => id !== String(req.body.userID));
    }
    const updatedRecipe = await RecipeModel.findByIdAndUpdate(
      { _id: recipeID },
      recipe,
      {
        new: true,
      }
    );
    return res.status(200).json({ updatedRecipe });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// comment on recipe
recipeRoute.patch("/comments/:recipeID", userAuth, async (req, res) => {
  const recipeID = req.params.recipeID;
  try {
    const recipe = await RecipeModel.findById(recipeID);
    recipe.comments.push({
      userName: req.body.userName,
      comment: req.body.comment,
    });
    await RecipeModel.findByIdAndUpdate({ _id: recipeID }, recipe, {
      new: true,
    });
    return res.status(200).json({ recipe });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


module.exports = { recipeRoute };
