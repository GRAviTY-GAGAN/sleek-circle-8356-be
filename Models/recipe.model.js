const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types
const commentSchema = mongoose.Schema({
  userName:String,
  comment: String,
  userID: String
})

const recipeSchema = mongoose.Schema(
  {
    image: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: String },
    directions: { type: String },
    variations: { type: String },
    course: { type: String, required: true },
    review: { type: String },
    category: { type: String, required: true },
    timeRequired: { type: String },
    likes: { type: Array },
    comments: { type: Array },
    userID: { type: String },
    userName: { type: String }
    // likes: [{type : ObjectId, ref: "user"}],
    // comment: [String]
  },
  { versionKey: false,
    timestamps: true
  }
);

const RecipeModel = mongoose.model("recipe", recipeSchema);

module.exports = { RecipeModel };
