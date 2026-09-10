import { Op } from "sequelize";
import User from "../models/user.model.js";
import Follow from "../models/follow.model.js";

export const getSuggestionsService = async (userId, limit = 5) => {

  const existingConnections = await Follow.findAll({
    where: {
      [Op.or]: [
        { follower_id: userId },
        { following_id: userId }
      ]
    }
  });

  const excludedUserIds = existingConnections.map(conn => {
    return conn.follower_id === userId ? conn.following_id : conn.follower_id;
  });
  
  excludedUserIds.push(userId); 

  
  return await User.findAll({
    where: { id: { [Op.notIn]: excludedUserIds } },
    attributes: ["id", "name", "profileImage", "email"],
    limit: parseInt(limit),
  });
};

export const sendFollowRequestService = async (followerId, followingId) => {
  if (followerId === parseInt(followingId)) throw new Error("You cannot follow yourself.");

  const existingFollow = await Follow.findOne({
    where: { follower_id: followerId, following_id: followingId },
  });

  if (existingFollow) {
    await existingFollow.destroy();
    return { action: "unfollowed" };
  }

  const follow = await Follow.create({
    follower_id: followerId,
    following_id: followingId,
    status: "pending",
  });

  return { action: "requested", follow };
};

export const getPendingRequestsService = async (userId) => {
  return await Follow.findAll({
    where: { following_id: userId, status: "pending" },
    include: [
      {
        model: User,
        as: "FollowerData", 
        attributes: ["id", "name", "profileImage"],
      },
    ],
  });
};

export const respondToRequestService = async (userId, requestId, action) => {
  const followRequest = await Follow.findOne({
    where: { id: requestId, following_id: userId, status: "pending" },
  });

  if (!followRequest) throw new Error("Follow request not found.");

  if (action === "accept") {
    followRequest.status = "accepted";
    await followRequest.save();
    return { status: "accepted" };
  } else if (action === "reject") {
    await followRequest.destroy();
    return { status: "rejected" };
  } else {
    throw new Error("Invalid action.");
  }
};


//network 


export const getFriendsService = async (userId) => {
  const connections = await Follow.findAll({
    where: {
      status: "accepted",
      [Op.or]: [
        { follower_id: userId },
        { following_id: userId }
      ]
    },
    include: [
      {
        model: User,
        as: "FollowerData",
        attributes: ["id", "name", "profileImage", "email"],
      },
      {
        model: User,
        as: "FollowingData",
        attributes: ["id", "name", "profileImage", "email"],
      },
    ],
  });

  // Use a Map to automatically remove duplicate users
  const uniqueFriends = new Map();

  connections.forEach(conn => {
    // Determine who the friend is (the person who is NOT you)
    const friend = conn.follower_id === userId ? conn.FollowingData : conn.FollowerData;

    // Add them to the Map using their ID as the unique key
    if (friend && !uniqueFriends.has(friend.id)) {
      uniqueFriends.set(friend.id, friend);
    }
  });

  // Convert the Map back into a standard array for the frontend
  return Array.from(uniqueFriends.values());
};

export const removeFriendService = async (userId, friendId) => {
  const connection = await Follow.findOne({
    where: {
      status: "accepted",
      [Op.or]: [
        { follower_id: userId, following_id: friendId },
        { follower_id: friendId, following_id: userId }
      ]
    }
  });

  if (!connection) throw new Error("Friendship record not found.");

  await connection.destroy();
  return { success: true };
};