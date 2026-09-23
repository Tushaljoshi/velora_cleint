import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase/config"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useUser } from "@clerk/clerk-react";
import "./Results.css";

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const gifts = location.state?.gifts || [];

    const handleSubmitFeedback = async () => {
        if (rating === 0) {
            alert("Please select a rating!");
            return;
        }

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "reviews"), {
                stars: rating,
                reviewText: review,
                submittedAt: serverTimestamp(),
                userName: user?.fullName || "Guest User",
                userEmail: user?.primaryEmailAddress?.emailAddress || "No Email Provided",
                userId: user?.id || "anonymous",
                platform: "Web App"
            });

            setShowPopup(true);
            setRating(0);
            setHover(0);
            setReview("");
        } catch (error) {
            console.error("Firebase Error:", error);
            alert("Could not save your review. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="results-container">
            {/* SUCCESS POPUP MODAL */}
            {showPopup && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="success-icon">✓</div>
                        <h2>Thank You!</h2>
                        <p>Your feedback helps the Oracle become even wiser.</p>
                        <button
                            className="close-modal-btn" 
                            onClick={() => {
                                setShowPopup(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

            <header className="results-header">
                <h1>The Oracle's Selections</h1>
                <p>Curated gift ideas based on your preferences</p>
            </header>

            {/* GIFT CARDS GRID */}
            <div className="gift-grid">
                {gifts.length > 0 ? (
                    gifts.map((gift, index) => {
                        const finalSearch = encodeURIComponent(gift.search_term || gift.title || "unique gift");
                        const platformLinks = {
                            amazon: `https://www.amazon.in/s?k=${finalSearch}`,
                            flipkart: `https://www.flipkart.com/search?q=${finalSearch}`,
                            google: `https://www.google.com/search?q=${finalSearch}+buy+online`
                        };

                        return (
                            <div className="gift-card" key={index}>
                                <div className="card-content">
                                    <h3>{gift.title}</h3>
                                    <p>{gift.description}</p>
                                </div>
                                <div className="card-footer-multi">
                                    <span className="price-tag">{gift.price}</span>
                                    <div className="platform-buttons">
                                        <a href={platformLinks.amazon} target="_blank" rel="noopener noreferrer" className="shop-btn amz">Amazon</a>
                                        <a href={platformLinks.flipkart} target="_blank" rel="noopener noreferrer" className="shop-btn fk">Flipkart</a>
                                        <a href={platformLinks.google} target="_blank" rel="noopener noreferrer" className="shop-btn gg">Google</a>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="no-results">
                        <p>No suggestions found. Try another search!</p>
                    </div>
                )}
            </div>

            {/* FEEDBACK SECTION */}
            <div className="feedback-section">
                <h3>Rate your experience</h3>
                <div className="star-rating">
                    {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        return (
                            <button
                                type="button"
                                key={starValue}
                                className={starValue <= (hover || rating) ? "on" : "off"}
                                onClick={() => setRating(starValue)}
                                onMouseEnter={() => setHover(starValue)}
                                onMouseLeave={() => setHover(rating)}
                            >
                                <span className="star">&#9733;</span>
                            </button>
                        );
                    })}
                </div>
                <textarea
                    placeholder="Write your review here..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="review-input"
                />
                <button 
                    className="submit-feedback-btn" 
                    onClick={handleSubmitFeedback}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Saving..." : "Submit Feedback"}
                </button>
            </div>

            <button className="back-btn" onClick={() => navigate('/')}>
                ← FIND ANOTHER GIFT
            </button>
        </div>
    );
}