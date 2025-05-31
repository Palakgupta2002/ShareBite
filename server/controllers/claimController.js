import Claim from "../modal/Claim.js";
import Post from "../modal/Post.js";

export const claimPost = async (req, res) => {
  try {
    const { postId, claimerId,deliveryLocationText } = req.body;

    if (!postId || !claimerId) {
      return res.status(400).json({ message: "Post ID and Claimer ID are required." });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Check if already claimed by this user
    const existingClaim = await Claim.findOne({ post: postId, claimer: claimerId });
    if (existingClaim) {
      return res.status(400).json({ message: "You have already claimed this post." });
    }

    // Create the claim
    const claim = new Claim({
      post: postId,
      claimer: claimerId,
      deliveryLocationText:deliveryLocationText
    });

    const savedClaim = await claim.save();
    res.status(201).json({ message: "Post claimed successfully", claim: savedClaim });
  } catch (error) {
    console.error("Error claiming post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/claims/:postId
export const viewClaimsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const claims = await Claim.find({ post: postId }).populate("claimer", "name email","deliveryLocationText");
    res.status(200).json(claims);
  } catch (error) {
    console.error("Error fetching claims:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /api/claims/:claimId/approve
export const approveClaim = async (req, res) => {
  try {
    const { claimId } = req.params;

    const approvedClaim = await Claim.findByIdAndUpdate(
      claimId,
      { claimStatus: "Approved", approvedByOwner: true },
      { new: true }
    );

    if (!approvedClaim) {
      return res.status(404).json({ message: "Claim not found." });
    }

    // Reject other claims for this post
    await Claim.updateMany(
      { post: approvedClaim.post, _id: { $ne: claimId } },
      { claimStatus: "Rejected" }
    );

    // Update the post's status to Claimed
    await Post.findByIdAndUpdate(approvedClaim.post, { status: "Claimed" });

    res.status(200).json({ message: "Claim approved", claim: approvedClaim });
  } catch (error) {
    console.error("Error approving claim:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /api/posts/:postId/pickup
export const markPickedUp = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.status !== "Claimed") {
      return res.status(400).json({ message: "Post must be in 'Claimed' status to mark as picked up." });
    }

    // Update post status to Picked Up
    post.status = "Picked Up";
    await post.save();

    res.status(200).json({ message: "Post marked as Picked Up", post });
  } catch (error) {
    console.error("Error marking post as picked up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

