import Post from "../modal/Post.js";

export const createPost = async (req, res) => {
  try {
    const { user, type, description, quantity, locationText, mapCoordinates, expiryDate } = req?.body;

    console.log("Creating post with data:", req.body);

    // Validate required fields
    if (!user || !type || !description || !quantity || !expiryDate) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // Create a new post
    const newPost = new Post({
      user,
      type,
      description,
      quantity,
      locationText,
      mapCoordinates,
      expiryDate,
    });

    // Save the post to the database
    const savedPost = await newPost.save();

    res.status(201).json({ message: "Post created successfully", post: savedPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts." });
  }
};


export const getPostsByUser = async (req, res) => {
  const { userId } = req?.params;
  try {
    const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user's posts." });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req?.params;
  try {
    const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPost) return res.status(404).json({ message: "Post not found." });
    res.status(200).json({ message: "Post updated.", post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Failed to update post." });
  }
};


export const deletePost = async (req, res) => {
  const { id } = req?.params;
  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) return res.status(404).json({ message: "Post not found." });
    res.status(200).json({ message: "Post deleted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post." });
  }
};

