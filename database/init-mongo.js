// MongoDB initialization script for social network application

// Create database if it doesn't exist
db = db.getSiblingDB('social_network_db');

// Drop existing collections to start fresh (comment these out if you want to preserve data)
db.users.drop();
db.posts.drop();

// Create collections
db.createCollection("users");
db.createCollection("posts");

// Function to simulate password hashing (matches your application's hash for "123456")
function hashPassword(password) {
  // This is a placeholder for your actual hash function
  return "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"; // Hash of "123456"
}

// Create 8 users
const users = [
  {
    name: "Annie Smith",
    username: "annie123",
    password: hashPassword("123456"),
    createdAt: new Date(),
    following: []
  },
  {
    name: "Bob Johnson",
    username: "bobjohn",
    password: hashPassword("123456"),
    createdAt: new Date(),
    following: []
  },
  {
    name: "Charlie Davis",
    username: "charlie85",
    password: hashPassword("123456"),
    createdAt: new Date(),
    following: []
  },
  {
    name: "Dana White",
    username: "danawhite",
    password: hashPassword("123456"),
    createdAt: new Date(),
    following: []
  },
  {
    name: "Elena Rodriguez",
    username: "elenarodz",
    password: hashPassword("123456"),
    createdAt: new Date(),
    following: []
  },
  {
    name: "Frank Miller",
    username: "frankmiller",
    password: hashPassword("123456"),
    createdAt: new Date(),
    following: []
  },
  {
    name: "Grace Lee",
    username: "gracelee",
    password: hashPassword("123456"),
    createdAt: new Date(),
    following: []
  },
  {
    name: "Henry Chen",
    username: "henryc",
    password: hashPassword("123456"),
    createdAt: new Date(),
    following: []
  }
];

// Insert users and collect their IDs
const userIds = [];
users.forEach(user => {
  const result = db.users.insertOne(user);
  userIds.push(result.insertedId);
});

print("User IDs for reference:");
userIds.forEach((id, index) => {
  print(`${users[index].username}: ${id}`);
});

// Create follow relationships (each user follows several others)
for (let i = 0; i < userIds.length; i++) {
  const followingList = [];
  // Each user follows 3-5 random other users
  const numToFollow = Math.floor(Math.random() * 3) + 3; // 3-5 follows
  
  for (let j = 0; j < numToFollow; j++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * userIds.length);
    } while (randomIndex === i || followingList.includes(userIds[randomIndex].toString()));
    
    followingList.push(userIds[randomIndex].toString());
  }
  
  // Update user with following list
  db.users.updateOne(
    { _id: userIds[i] },
    { $set: { following: followingList } }
  );
}

// Sample content for posts
const postTitles = [
  "Just learned something new!",
  "My thoughts on technology",
  "Weekend adventures",
  "New project announcement",
  "Book recommendation",
  "Movie review",
  "Recipe I tried today",
  "Fitness journey update",
  "Travel memories",
  "Coding challenge completed"
];

const postBodies = [
  "Today I learned about MongoDB and how to use it effectively. It's amazing how much you can do with document databases!",
  "I believe technology should be accessible to everyone. Here's why I think this is important for our future...",
  "This weekend I went hiking and discovered the most beautiful waterfall. Nature is truly inspiring.",
  "I'm excited to announce I'm working on a new social network application. Stay tuned for updates!",
  "Just finished reading 'Clean Code' and I highly recommend it to all developers. It changed how I approach programming.",
  "The latest sci-fi movie was mind-blowing with its special effects and story. Definitely worth watching!",
  "Made a delicious pasta dish with fresh ingredients from the farmer's market. Here's how it turned out.",
  "Week 4 of my workout routine and I'm already seeing results. Consistency really is key.",
  "Throwback to my trip to Japan last year. The culture and food were absolutely incredible.",
  "Finally solved that algorithm problem that was giving me trouble. The key was using a dynamic programming approach."
];

// Create posts
const postIds = [];
userIds.forEach(userId => {
  // Each user creates 1-3 posts
  const numPosts = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < numPosts; i++) {
    const titleIndex = Math.floor(Math.random() * postTitles.length);
    const bodyIndex = Math.floor(Math.random() * postBodies.length);
    
    const post = {
      title: postTitles[titleIndex],
      body: postBodies[bodyIndex],
      userId: userId.toString(),
      user: userId,
      comments: [],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000) // Random date within last 30 days
    };
    
    const result = db.posts.insertOne(post);
    postIds.push(result.insertedId);
  }
});

// Sample content for comments
const commentBodies = [
  "Great post! I really enjoyed reading this.",
  "I have a similar experience to share...",
  "Thanks for sharing your thoughts on this.",
  "I completely agree with your perspective.",
  "This is really insightful. Have you considered...",
  "I learned something new today. Thank you!",
  "Looking forward to more content like this.",
  "I disagree on one point: I think...",
  "This reminded me of something I read recently.",
  "Could you elaborate more on the second point?"
];

// Add comments to posts
postIds.forEach(postId => {
  // Each post gets 0-5 comments
  const numComments = Math.floor(Math.random() * 6);
  
  const comments = [];
  for (let i = 0; i < numComments; i++) {
    // Random user makes the comment
    const commenterIndex = Math.floor(Math.random() * userIds.length);
    const commentBody = commentBodies[Math.floor(Math.random() * commentBodies.length)];
    
    comments.push({
      body: commentBody,
      userId: userIds[commenterIndex].toString(),
      user: userIds[commenterIndex],
      createdAt: new Date()
    });
  }
  
  if (comments.length > 0) {
    db.posts.updateOne(
      { _id: postId },
      { $set: { comments: comments } }
    );
  }
});

// Create indexes for better performance
db.users.createIndex({ username: 1 }, { unique: true });
db.posts.createIndex({ userId: 1 });
db.posts.createIndex({ "comments.userId": 1 });

print("Database initialization completed successfully!");
print("Created " + db.users.countDocuments() + " users");
print("Created " + db.posts.countDocuments() + " posts");