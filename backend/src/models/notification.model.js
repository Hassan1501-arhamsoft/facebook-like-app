import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./user.model.js";
import Post from "./post.model.js";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    recipient_id: { // The post owner
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    actor_id: { // The person who liked/commented
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("like", "comment", "follow_request", "follow_accepted"),
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "notifications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

// Relationships
Notification.belongsTo(User, { foreignKey: "recipient_id", as: "recipient" });
Notification.belongsTo(User, { foreignKey: "actor_id", as: "actor" });
Notification.belongsTo(Post, { foreignKey: "post_id", onDelete: "CASCADE" });

export default Notification;