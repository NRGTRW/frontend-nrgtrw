import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import "./TestimonialsSection.css";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ content: "", rating: 5 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/testimonials`,
      );
      setTestimonials(response.data.data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit a testimonial");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/testimonials`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(
        "Testimonial submitted successfully! It will be reviewed by our team.",
      );
      setFormData({ content: "", rating: 5 });
      setShowForm(false);
      fetchTestimonials();
    } catch (error) {
      toast.error("Failed to submit testimonial");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? "filled" : ""}`}>
        ★
      </span>
    ));
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <h2 className="testimonials-title">What Our Customers Say</h2>

        {testimonials.length > 0 ? (
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="user-info">
                    <img
                      src={
                        testimonial.user.profilePicture ||
                        "/default-profile.webp"
                      }
                      alt={testimonial.user.name}
                      className="user-avatar"
                    />
                    <span className="user-name">{testimonial.user.name}</span>
                  </div>
                  <div className="rating">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                <p className="testimonial-content">{testimonial.content}</p>
                <span className="testimonial-date">
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-testimonials">
            No testimonials yet. Be the first to share your experience!
          </p>
        )}

        {user && (
          <div className="testimonial-actions">
            {!showForm ? (
              <button
                className="submit-testimonial-btn"
                onClick={() => setShowForm(true)}
              >
                Share Your Experience
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="testimonial-form">
                <div className="form-group">
                  <label htmlFor="rating">Rating:</label>
                  <select
                    id="rating"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rating: parseInt(e.target.value),
                      })
                    }
                    required
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Good</option>
                    <option value={2}>2 Stars - Fair</option>
                    <option value={1}>1 Star - Poor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="content">Your Review:</label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Share your experience with our products and services..."
                    required
                    minLength={10}
                    maxLength={500}
                  />
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
