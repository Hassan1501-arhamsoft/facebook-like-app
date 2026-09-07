import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./user.model.js";

const Post = sequelize.define(
  "Post",
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  },
  {
    tableName: "posts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Define Relationships
User.hasMany(Post, { foreignKey: "user_id", as: "posts", onDelete: "CASCADE" });
Post.belongsTo(User, { foreignKey: "user_id", as: "author" });

export default Post;