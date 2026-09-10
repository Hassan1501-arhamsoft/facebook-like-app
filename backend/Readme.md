"getSuggestionService"
-> first take all the follower and following of the current login-user with ID
-> it return a array of object that contain the follower and following lis.

-> take the follower/following id and also add the login-user Id in the excludedUserIds 
-> find all the user except these excludedUsersId list



conn.follower_id === userId
  ? conn.following_id
  : conn.follower_id

means:

If I am the follower, give me the person I'm following. Otherwise, give me the person who is following me.