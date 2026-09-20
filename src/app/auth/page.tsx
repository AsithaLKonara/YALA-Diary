"use client";

import React, { useState } from "react";
import Image from "next/image";
import "./auth.css";
import "@/app/sections.css";
import Footer from "@/components/Footer";

type AuthMode = "login" | "register" | "forgot";

// Google SVG Icon
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// Apple SVG Icon
const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
    <path d="M16.365 1.545c1.47 1.77 1.365 4.38-.285 4.59-1.635.225-3.375-1.425-4.845-3.195-1.47-1.785-1.575-4.2-.075-4.425 1.515-.225 3.735 1.26 5.205 3.03zm-1.095 5.565c-2.31.06-4.11 1.485-5.205 1.485-1.095 0-2.835-1.35-4.545-1.35-2.19 0-4.23 1.275-5.355 3.24C-2.28 15.3 1.095 22.95 4.395 22.95c1.605 0 2.22-1.005 4.14-1.005 1.89 0 2.475 1.005 4.17 1.005 3.39 0 5.415-4.71 6.36-7.125-3.03-1.2-3.48-5.61-.555-7.23-.975-1.41-2.475-1.92-3.99-1.92z"/>
  </svg>
);

// Facebook SVG Icon
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <>
      <div className="auth-page">
        <div className="auth-bg">
          <Image 
            src="/images/assets/elephants/pexels-sargaraj-tr-423973759-19669417.jpg"
            alt="Auth Background"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="auth-overlay"></div>
        </div>

        <div className="auth-content">
          <div className="auth-left">
            <div className="auth-left-text">
              <h1>The Wild Awaits</h1>
              <p>Sign in to manage your luxury safari bookings, access curated itineraries, and personalize your journey into the untamed heart of Yala National Park.</p>
            </div>
          </div>

          <div className="auth-right">
            {mode === "login" && (
              <div className="auth-form-container">
                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle">Sign in to your account</p>
                
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="auth-group">
                    <label className="auth-label">Email Address</label>
                    <input type="email" className="auth-input" placeholder="david@example.com" />
                  </div>
                  <div className="auth-group">
                    <label className="auth-label">Password</label>
                    <input type="password" className="auth-input" placeholder="••••••••" />
                    <span className="auth-forgot" onClick={() => setMode("forgot")}>Forgot Password?</span>
                  </div>
                  <button className="auth-btn">Sign In</button>
                </form>

                <div className="auth-divider">or continue with</div>

                <div className="social-auth">
                  <button className="social-btn"><GoogleIcon /> Google</button>
                  <button className="social-btn"><AppleIcon /> Apple</button>
                  <button className="social-btn"><FacebookIcon /> Facebook</button>
                </div>

                <div className="auth-switch">
                  Don&apos;t have an account? <span onClick={() => setMode("register")}>Sign Up</span>
                </div>
              </div>
            )}

            {mode === "register" && (
              <div className="auth-form-container">
                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">Join us for exclusive safari access</p>
                
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="auth-group">
                    <label className="auth-label">Full Name</label>
                    <input type="text" className="auth-input" placeholder="David Attenborough" />
                  </div>
                  <div className="auth-group">
                    <label className="auth-label">Email Address</label>
                    <input type="email" className="auth-input" placeholder="david@example.com" />
                  </div>
                  <div className="auth-group">
                    <label className="auth-label">Password</label>
                    <input type="password" className="auth-input" placeholder="••••••••" />
                  </div>
                  <button className="auth-btn">Create Account</button>
                </form>

                <div className="auth-divider">or register with</div>

                <div className="social-auth">
                  <button className="social-btn"><GoogleIcon /> Google</button>
                  <button className="social-btn"><AppleIcon /> Apple</button>
                  <button className="social-btn"><FacebookIcon /> Facebook</button>
                </div>

                <div className="auth-switch">
                  Already have an account? <span onClick={() => setMode("login")}>Log In</span>
                </div>
              </div>
            )}

            {mode === "forgot" && (
              <div className="auth-form-container">
                <h2 className="auth-title">Reset Password</h2>
                <p className="auth-subtitle">We&apos;ll send you instructions to reset it</p>
                
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="auth-group">
                    <label className="auth-label">Email Address</label>
                    <input type="email" className="auth-input" placeholder="david@example.com" />
                  </div>
                  <button className="auth-btn" style={{ marginTop: 20 }}>Send Reset Link</button>
                </form>

                <div className="auth-switch" style={{ marginTop: 40 }}>
                  Remembered your password? <span onClick={() => setMode("login")}>Back to Login</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
