import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OpenAI from "openai";
import './GiftInput.css';

export default function GiftInput() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        recipient: '',
        age: '',
        occasion: '',
        budget: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if ((name === 'age' || name === 'budget') && value !== '' && value < 0) return;
        setFormData({ ...formData, [name]: value });
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const openai = new OpenAI({
                apiKey: import.meta.env.VITE_OPENAI_API_KEY,
                baseURL: "https://openrouter.ai/api/v1",
                dangerouslyAllowBrowser: true,
                defaultHeaders: {
                    "HTTP-Referer": window.location.origin,
                    "X-Title": "Gift Oracle",
                }
            });

            const prompt = `Suggest 4 specific gift ideas for my ${formData.recipient}, age ${formData.age}, for their ${formData.occasion} available in India. 
            CRITICAL RULES:
            1. The price for EACH gift idea must be approximately ₹${formData.budget} (Indian Rupees).
            2. Use the "₹" symbol for prices.
            3. Return ONLY a valid JSON array.
            4. Each object MUST have: "title", "description", "price" (starting with ₹), and "search_term" (specific keyword for Amazon.in).
            
            Format: [{"title": "...", "description": "...", "price": "₹...", "search_term": "..."}]`;

            const response = await openai.chat.completions.create({
                model: "openai/gpt-4o-mini", 
                messages: [{ role: "user", content: prompt }],
            });

            const text = response.choices[0].message.content;
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            const cleanJson = JSON.parse(jsonMatch ? jsonMatch[0] : text);
            navigate('/results', { state: { gifts: cleanJson } });
        } catch (error) {
            console.error("Error:", error);
            alert("Oracle is busy. Try again!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="gift-container">
            <div className="gift-content">
                <div className="gift-header">
                    <span className="sparkle"></span>
                    <h1>Find the Perfect Gift</h1>
                    <p>AI-powered suggestions tailored to your special someone</p>
                </div>

                <div className="mad-libs-card">
                    <form onSubmit={handleGenerate}>
                        <div className="mad-libs-text">
                            I need a gift for my
                            <input
                                type="text"
                                name="recipient"
                                placeholder="mother"
                                value={formData.recipient}
                                onChange={handleChange}
                                maxLength={20}
                                required
                            />
                            <br />
                            who is
                            <input
                                type="number"
                                name="age"
                                placeholder="55 years old"
                                value={formData.age}
                                onChange={handleChange}
                                min="1"
                                max="115"
                                required
                            />
                            <br />
                            for their
                            <input
                                type="text"
                                name="occasion"
                                placeholder="birthday"
                                value={formData.occasion}
                                onChange={handleChange}
                                maxLength={30}
                                required
                            />
                            <br />
                            with a budget of ₹
                            <input
                                type="number"
                                name="budget"
                                placeholder="1000"
                                value={formData.budget}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                        <button type="submit" className="generate-btn" disabled={loading}>
                            {loading ? "Consulting the Oracle..." : " GENERATE SUGGESTIONS"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}