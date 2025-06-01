import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Home.css";
import heroImage from "../assest/Image.svg";
import donateImage from "../assest/Image.svg";
import axios from "axios";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts`);
      setPosts(res.data);
    };
    fetchPosts();
  }, []);

  const handleClaim = () => {
    navigate("/signup");
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <h1>ShareBite</h1>
        <nav>
          <Link to="/signup">Sign Up</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <img src={heroImage} alt="Food Donation" className="hero-image" />
        <div className="hero-text">
          <h2>Join Us in Fighting Hunger</h2>
          <p>
            ShareBite connects donors with those in need. Together, we can
            reduce food waste and help communities thrive.
          </p>
          <Link to="/signup" className="cta-button">
            Get Started
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2>Why Donate Food?</h2>
        <div className="about-content">
          <img src={donateImage} alt="Donate Food" className="about-image" />
          <p>
            Millions of people go hungry every day while tons of food go to
            waste. By donating food, you can make a real difference in someone's
            life. Join our mission to create a world where no one goes to bed
            hungry.
          </p>
        </div>
      </section>
      <section className="public-posts-section">
        <h2>Available Donations</h2>
        <div className="post-cards-container">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onClaim={handleClaim} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; 2025 ShareBite. All rights reserved.</p>
        <p>
          <a href="/about">About Us</a> | <a href="/contact">Contact</a> |{" "}
          <a href="/faq">FAQ</a>
        </p>
      </footer>
    </div>
  );
}


const PostCard = ({ post, onClaim }) => {
  const [showModal, setShowModal] = useState(false);
  const maxLength = 100;

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const shortDescription =
    post.description.length > maxLength
      ? post.description.substring(0, maxLength) + "..."
      : post.description;

  return (
    <>
      <div className="post-card">
        <h3>{post.type}</h3>
        <p>
          {shortDescription}
          {post.description.length > maxLength && (
            <span onClick={openModal} className="toggle-description">
              {" "}Show More
            </span>
          )}
        </p>
        <p><strong>Qty:</strong> {post.quantity}</p>
        <p><strong>Location:</strong> {post.locationText}</p>
        <button onClick={onClaim}>Claim</button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{post.type}</h2>
            <p>{post.description}</p>
            <button className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};



