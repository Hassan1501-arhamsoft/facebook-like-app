import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./user.model.js";

const Report = sequelize.define(
  "Report",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reporter_id: {
      type: DataTypes.BIGINT.UNSIGNED, // Matches your User ID type
      allowNull: false,
    },
    reported_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "reviewed", "resolved"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "reports",
    timestamps: true,
  }
);

// Define Relationships
User.hasMany(Report, { foreignKey: "reporter_id", as: "SubmittedReports", onDelete: "CASCADE" });
User.hasMany(Report, { foreignKey: "reported_id", as: "ReceivedReports", onDelete: "CASCADE" });
Report.belongsTo(User, { foreignKey: "reporter_id", as: "Reporter" });
Report.belongsTo(User, { foreignKey: "reported_id", as: "Reported" });

export default Report;