import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./user.model.js";
import Post from "./post.model.js";

const PostLike = sequelize.define(
  "PostLike",
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
  },
  {
    tableName: "post_likes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false, // Only tracking when the like occurred
    indexes: [
      {
        unique: true,
        fields: ["user_id", "post_id"], // Prevents duplicate likes
      },
    ],
  }
);

// Define Relationships
Post.hasMany(PostLike, { foreignKey: "post_id", as: "likes", onDelete: "CASCADE" });
PostLike.belongsTo(Post, { foreignKey: "post_id" });

User.hasMany(PostLike, { foreignKey: "user_id", onDelete: "CASCADE" });
PostLike.belongsTo(User, { foreignKey: "user_id" });

export default PostLike;