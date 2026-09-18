import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./user.model.js";

const Message = sequelize.define(
  "message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    
  },
  {
    
    timestamps: true,
  }
);

User.hasMany(Message, { foreignKey: "sender_id", as: "SentMessages" , onDelete: "CASCADE"});
User.hasMany(Message, { foreignKey: "receiver_id", as: "ReceivedMessages" , onDelete: "CASCADE"});

// Define the foreign key constraints directly in the association
Message.belongsTo(User, { 
    foreignKey: { name: "sender_id", allowNull: false }, 
    as: "Sender" 
});
Message.belongsTo(User, { 
    foreignKey: { name: "receiver_id", allowNull: false }, 
    as: "Receiver" 
});

export default Message;