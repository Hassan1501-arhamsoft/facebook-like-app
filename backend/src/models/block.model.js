import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./user.model.js";

const Block = sequelize.define(
  "block",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  { timestamps: true }
);


User.hasMany(Block, { foreignKey: "blocker_id", as: "Blocking", onDelete: "CASCADE" });
Block.belongsTo(User, { foreignKey: "blocker_id", as: "Blocker" });

User.hasMany(Block, { foreignKey: "blocked_id", as: "BlockedBy", onDelete: "CASCADE" });
Block.belongsTo(User, { foreignKey: "blocked_id", as: "Blocked" });

export default Block;