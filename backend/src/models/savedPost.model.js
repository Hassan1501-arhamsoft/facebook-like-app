import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./user.model.js";
import Post from "./post.model.js";

const SavedPost = sequelize.define(
  "SavedPost",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED, 
      allowNull: false,
    },
    post_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    }
  },
  {
    tableName: "saved_posts",
    timestamps: true,
  }
);


User.hasMany(SavedPost, { foreignKey: "user_id", onDelete: "CASCADE" });
SavedPost.belongsTo(User, { foreignKey: "user_id", as: "user" });
Post.hasMany(SavedPost, { foreignKey: "post_id", onDelete: "CASCADE" });
SavedPost.belongsTo(Post, { foreignKey: "post_id", as: "post" });

export default SavedPost;