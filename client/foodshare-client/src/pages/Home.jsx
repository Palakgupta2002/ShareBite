import React from "react";
import { Link } from "react-router-dom";
import "../style/Home.css"; 
import heroImage from "../assest/Image.svg"; 
import donateImage from "../assest/Image.svg"; 

export default function Home() {
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
            ShareBite connects donors with those in need. Together, we can reduce food waste and help communities thrive.
          </p>
          <Link to="/signup" className="cta-button">Get Started</Link>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2>Why Donate Food?</h2>
        <div className="about-content">
          <img src={donateImage} alt="Donate Food" className="about-image" />
          <p>
            Millions of people go hungry every day while tons of food go to waste. By donating food, you can make a real difference in someone's life. Join our mission to create a world where no one goes to bed hungry.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; 2025 ShareBite. All rights reserved.</p>
        <p>
          <a href="/about">About Us</a> | <a href="/contact">Contact</a> | <a href="/faq">FAQ</a>
        </p>
      </footer>
    </div>
  );
}