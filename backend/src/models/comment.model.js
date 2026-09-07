import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./user.model.js";
import Post from "./post.model.js";

const Comment = sequelize.define(
  "Comment",
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
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "comments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Define Relationships
Post.hasMany(Comment, { foreignKey: "post_id", as: "comments", onDelete: "CASCADE" });
Comment.belongsTo(Post, { foreignKey: "post_id" });

User.hasMany(Comment, { foreignKey: "user_id", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "user_id", as: "author" });

export default Comment;