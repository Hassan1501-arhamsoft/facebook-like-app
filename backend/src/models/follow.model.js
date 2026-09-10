import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./user.model.js";

const Follow = sequelize.define("Follow", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  follower_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    }
  },
  following_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    }
  },
  status: {
    type: DataTypes.ENUM("pending", "accepted"),
    defaultValue: "pending",
    allowNull: false,
  }
}, {
  tableName: "follows",
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ["follower_id", "following_id"], 
    }
  ]
});

// Associations
User.belongsToMany(User, {
  through: Follow,
  as: "Followers", // People following the user
  foreignKey: "following_id",
  otherKey: "follower_id"
});

User.belongsToMany(User, {
  through: Follow,
  as: "Following", // People the user follows
  foreignKey: "follower_id",
  otherKey: "following_id"
});

Follow.belongsTo(User, { foreignKey: "follower_id", as: "FollowerData" });
Follow.belongsTo(User, { foreignKey: "following_id", as: "FollowingData" });
export default Follow;