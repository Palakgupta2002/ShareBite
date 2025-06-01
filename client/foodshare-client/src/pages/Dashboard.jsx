import React, { useEffect, useState } from "react";
import "../style/dashboard.css"; 
import defaultPic from "../assest/defaultPic.png"
import axios from "axios";


function App() {
  const [posts, setPosts] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [createPost, setCreatePost] = useState(false);
  const [viewClaims, setViewClaims] = useState(false);
  const userId = localStorage.getItem("userId") || "";
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [deliveryLocationText, setDeliveryLocationText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
  const [showModalNoti, setShowModalNoti] = useState(false);

  const openClaimsModal = (postId) => {
    setSelectedPostId(postId);
    setModalOpen(true);
  };

  // Form state
  const [formData, setFormData] = useState({
    user: userId,
    type: "Donate",
    description: "",
    quantity: "",
    location: "",
    expiryDate: "",
    image: null, // For storing the uploaded image
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("user", formData.user);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("expiryDate", formData.expiryDate);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/posts`,
        formDataToSend,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setCreatePost(false);
      setFormData({
        type: "Donate",
        description: "",
        quantity: "",
        location: "",
        expiryDate: "",
        image: null,
      });
      fetchAllPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const fetchAllPosts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/posts?userId=${userId}`
      );
      setPosts(response.data);
      console.log("All Posts:", response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  // Filter logic
  const filteredPosts = posts.filter((p) => {
    const matchesType = filterType === "" || p.type === filterType;
    const matchesSearch =
      searchTerm === "" ||
      p?.description?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      p?.location?.toLowerCase().includes(searchTerm?.toLowerCase());
    return matchesType && matchesSearch;
  });

  const claimPost = async (postId, deliveryLocationText) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/claims`,
        {
          postId,
          claimerId: userId,
          deliveryLocationText,
        }
      );
      console.log("Claim successful:", response.data);
    } catch (error) {
      console.error("Error claiming post:", error);
    }
  };

  const viewClaimsForPost = async (postId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/claims/${postId}`
      );
      console.log("Claims for post:", response.data);
      setViewClaims(response.data); // Assuming you want to display these claims in a modal or section
      console.log("Claims for post:", response.data);
    } catch (error) {
      console.error("Error fetching claims for post:", error);
    }
  };

  const markPickUpStatus = async (postId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/post-status/mark-picked-up/${postId}/${userId}`
      );
      console.log("Post marked as picked up:", response.data);
      fetchAllPosts();
    } catch (error) {
      console.error("Error marking post as picked up:", error);
    }
  };
  const markAsCompleted = async (postId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/post-status/mark-completed/${postId}/${userId}`
      );
      console.log("Post marked as picked up:", response.data);
      fetchAllPosts();
    } catch (error) {
      console.error("Error marking post as picked up:", error);
    }
  };

   const getNotifications = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/notifications?userId=${userId}`
      );
      setNotifications(response.data);
      setShowModalNoti(true);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };


  return (
    <div className="app-container">
      {/* --- HEADER --- */}
      <header className="header">
        <div className="header__logo">FoodBridge</div>
        <nav className="header__nav">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="#browse">Browse Posts</a>
            </li>
            {/* <li><a href="#map">Map View</a></li> */}
            <li onClick={() => setCreatePost(true)}>
              <a href="#map">Create Post</a>
            </li>
            <li onClick={()=>getNotifications()}>Notification</li>
            <li>
              <a href="#my-account">My Account</a>
            </li>
            <li>{localStorage.getItem("userName")}</li>
          </ul>
        </nav>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="main-content">
        {/* Left column: Form + Filters + List */}
        <div className="sidebar">
          {/* 1. POST FORM */}

          {/* 2. FILTER BAR */}
          <section className="filter-bar" id="browse">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Donate">Donate</option>
              <option value="Request">Request</option>
            </select>
            <input
              type="text"
              placeholder="Search description / location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => {
                setFilterType("");
                setSearchTerm("");
              }}
            >
              Clear
            </button>
          </section>

          {/* 3. POST LIST */}
          <section className="post-list">
            {filteredPosts.map((post) => (
              <div key={post._id} className="post-card1">
                {/* HEADER */}
               
                <div className="post-card1__header">
                  <h3>
                    {post.type} • {post.locationText}
                  </h3>
                  <span
                    className={`status-badge status-${post.status.toLowerCase()}`}
                  >
                    {post.status}
                  </span>
                </div>
                 <div className="post-card1__user-info">
                  <img
                    src={defaultPic} // Default image if no profile image is provided
                    alt={`${post?.user?.name}'s profile`}
                    className="user-profile-image"
                  />
                  <div className="user-details">
                    <p className="user-name">
                      <strong>Name:</strong> {post?.user?.name || "Anonymous"}
                    </p>
                    <p className="user-email">
                      <strong>Email:</strong>{" "}
                      <a
                        href={`mailto:${post?.user?.email}`}
                        className="user-email-link"
                      >
                        {post?.user?.email || "Not Provided"}
                      </a>
                    </p>
                  </div>
                </div>

                {/* BODY */}
                <div className="post-card1__body">
                  <p className="description">{post.description}</p>
                  <p>
                    <strong>Quantity:</strong> {post.quantity}
                  </p>
                  <p>
                    <strong>Expires:</strong>{" "}
                    {new Date(post.expiryDate).toLocaleDateString()}
                  </p>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="post-card1__footer">
                  {post.status === "Posted" &&
                    (post.user._id !== userId ? (
                      <button
                        onClick={() => {
                          setSelectedPostId(post._id);
                          setShowModal(true);
                        }}
                        className="btn btn-claim"
                      >
                        Claim
                      </button>
                    ) : (
                      <button
                        onClick={() => openClaimsModal(post._id)}
                        className="btn btn-claimed"
                      >
                        Claims req
                      </button>
                    ))}
                  {post.status === "Claimed" && (
                    <button
                      onClick={() => markPickUpStatus(post._id)}
                      className="btn btn-picked"
                    >
                      Mark Picked Up
                    </button>
                  )}
                  {post.status === "Picked Up" && userId === post.user._id && (
                    <span className="status-complete">
                      Waiting for Confirmation...
                    </span>
                  )}
                  {post.status === "Picked Up" &&
                    userId !== post.user._id &&
                    userId !== post?.approvedClaim?.claimer._id && (
                      <span className="status-complete">Booked</span>
                    )}
                  {post.status === "Picked Up" &&
                    userId === post?.approvedClaim?.claimer._id && (
                      <span
                        onClick={() => markAsCompleted(post._id)}
                        className="status-complete"
                      >
                        Mark as received
                      </span>
                    )}
                  {post.status === "Completed" && (
                    <span className="status-complete">Completed ✅</span>
                  )}
                  {post.status === "Expired" && (
                    <span className="status-expired">Expired ⏰</span>
                  )}
                </div>
              </div>
            ))}
            {filteredPosts.length === 0 && (
              <p className="no-posts">No posts found.</p>
            )}
          </section>
        </div>

        {createPost && (
          <div className="modal">
            <div style={{ width: "60%" }} className="modal-content">
              <div className="modal-header">
                <h2>Create a Post</h2>
                <button
                  className="modal-close"
                  onClick={() => setCreatePost(false)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <form className="post-form" onSubmit={handleFormSubmit}>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <div className="form-group">
                      <label htmlFor="type">Type</label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleFormChange}
                      >
                        <option value="Donate">Donate</option>
                        <option value="Request">Request</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="location">Pickup Location</label>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="image">Upload Image</label>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "20px" }}>
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiry Date</label>
                      <input
                        id="expiryDate"
                        name="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="quantity">Quantity</label>
                      <input
                        id="quantity"
                        name="quantity"
                        type="text"
                        value={formData.quantity}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setCreatePost(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit">Post Now</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="claim-modal-content">
                <h3>Enter Delivery Location</h3>
                <input
                  type="text"
                  value={deliveryLocationText}
                  onChange={(e) => setDeliveryLocationText(e.target.value)}
                  placeholder="e.g., Flat 204, Green Tower"
                />
                <button
                  onClick={() => {
                    claimPost(selectedPostId, deliveryLocationText);
                    setShowModal(false);
                    setDeliveryLocationText("");
                  }}
                >
                  Submit Claim
                </button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <ClaimsModal
          postId={selectedPostId}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
         {showModalNoti && (
        <NotificationModal
          notifications={notifications}
          onClose={() => setShowModal(false)}
        />
      )}
      </main>
    </div>
  );
}

export default App;

const ClaimsModal = ({ postId, isOpen, onClose }) => {
  const [viewClaims, setViewClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (isOpen && postId) {
      fetchClaims();
    }
  }, [isOpen, postId]);

  const fetchClaims = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/claims/${postId}`
      );
      setViewClaims(response.data);
    } catch (err) {
      setError("Failed to fetch claims.");
    } finally {
      setLoading(false);
    }
  };

  const approveClaimHandler = async (claimId) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/claims/${claimId}/approve`
      );
      fetchClaims(); // Refresh list after approval
    } catch (err) {
      alert("Failed to approve claim");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>Claims for Post</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && viewClaims.length === 0 && (
          <p>No claims found.</p>
        )}

        <div className="claims-list">
          {viewClaims.map((claim) => (
            <div key={claim._id} className="claim-card">
              <p>
                <strong>Name:</strong> {claim.claimer?.name}
              </p>
              <p>
                <strong>Email:</strong> {claim.claimer?.email}
              </p>
              <p>
                <strong>Delivery Location:</strong> {claim.deliveryLocationText}
              </p>
              <p>
                <strong>Status:</strong> {claim.claimStatus}
              </p>
              {claim.claimStatus === "Pending" && (
                <button
                  className="btn btn-approve"
                  onClick={() => approveClaimHandler(claim._id)}
                >
                  Approve
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



const NotificationModal = ({ notifications, onClose }) => {
  return (
    <div className="noti-backdrop" onClick={onClose}>
      <div className="noti-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Notifications</h2>
        <ul className="noti-list">
          {notifications.length === 0 ? (
            <li className="noti-empty">No notifications yet.</li>
          ) : (
            notifications.map((n) => (
              <li key={n._id} className="noti-item">
                {n.message}
              </li>
            ))
          )}
        </ul>
        <button className="noti-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};



