import React, { useEffect, useState } from "react";
import "../style/dashboard.css"; // make sure this path matches your project structure
import axios from "axios";

// Dummy data for demonstration
const samplePosts = [
  {
    id: 1,
    type: "Donate",
    description: "5 leftover lasagna portions",
    quantity: "5 servings",
    location: "123 Maple St.",
    expiryDate: "2025-06-05",
    status: "Posted",
  },
  {
    id: 2,
    type: "Request",
    description: "Need bread and milk for family of 3",
    quantity: "1 loaf, 2 liters",
    location: "456 Oak Ave.",
    expiryDate: "2025-06-02",
    status: "Claimed",
  },
  {
    id: 3,
    type: "Donate",
    description: "10 sandwich packs from café",
    quantity: "10 packs",
    location: "789 Pine Rd.",
    expiryDate: "2025-06-01",
    status: "PickedUp",
  },
];

function App() {
  const [posts, setPosts] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [createPost, setCreatePost] = useState(false);
  const [viewClaims,setViewClaims]=useState(false)
    const userId = localStorage.getItem("userId") || ""; // Get user ID from localStorage

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
        `${process.env.REACT_APP_API_URL}posts`,
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
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const fetchAllPosts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/posts`
      );
      setPosts(response.data); // This assumes response.data is the array of posts
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
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const claimPost = async (postId) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/claims`, {
      postId,
      claimerId:userId , 
    });
    console.log("Claim successful:", response.data);
  } catch (error) {
    console.error("Error claiming post:", error);
  }
};

const viewClaimsForPost = async (postId) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/claims/${postId}`);
        console.log("Claims for post:", response.data);
        setViewClaims(response.data); // Assuming you want to display these claims in a modal or section
        console.log("Claims for post:", response.data);
    } catch (error) {
        console.error("Error fetching claims for post:", error);
    }
}


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
            <li>
              <a href="#my-account">My Account</a>
            </li>
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
              <div key={post._id} className="post-card">
                {/* HEADER */}
                <div className="post-card__header">
                  <h3>
                    {post.type} • {post.locationText}
                  </h3>
                  <span
                    className={`status-badge status-${post.status.toLowerCase()}`}
                  >
                    {post.status}
                  </span>
                </div>

                {/* BODY */}
                <div className="post-card__body">
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
                <div className="post-card__footer">
                  {post.status === "Posted" && (
                   post.user!==userId ? <button onClick={() => claimPost(post._id)} className="btn btn-claim">Claim</button>:<button onClick={()=>viewClaimsForPost(post._id)} className="btn btn-claimed">Claims req</button>
                  )}
                  {post.status === "Claimed" && (
                    <button className="btn btn-picked">Mark Picked Up</button>
                  )}
                  {post.status === "PickedUp" && (
                    <span className="status-complete">
                      Waiting for Confirmation...
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

        {/* Right column: Map */}
        {/* <section className="map-container" id="map"> */}
        {/* In a real implementation, you'd integrate Leaflet/Google Maps here and plot markers. */}
        {/* </section> */}
        {createPost && (
          <div className="modal">
            <div className="modal-content">
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
      </main>
    </div>
  );
}

export default App;
