"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";
  const urlError = searchParams?.get("error");

  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    urlError === "Configuration" ? "Server configuration error (missing OAuth keys)" :
    urlError === "OAuthSignin" ? "Error in constructing the OAuth authorization URL." :
    urlError === "OAuthCallback" ? "Error handling the OAuth response." :
    urlError === "OAuthCreateAccount" ? "Could not create OAuth provider user in the database." :
    urlError === "EmailCreateAccount" ? "Could not create email provider user in the database." :
    urlError === "Callback" ? "Error in the OAuth callback handler route." :
    urlError === "OAuthAccountNotLinked" ? "Email already exists with a different provider." :
    urlError === "EmailSignin" ? "Sending the e-mail with the verification token failed." :
    urlError === "CredentialsSignin" ? "Sign in failed. Check the details you provided are correct." :
    urlError === "SessionRequired" ? "Please sign in to access this page." :
    urlError ? "An error occurred during authentication." : ""
  );
  const [message, setMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setMessage("Registration successful! Please sign in.");
      setMode("login");
      setPassword("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

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
                
                <form onSubmit={handleLogin}>
                  {error && <div style={{ color: '#ff4d4f', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
                  {message && <div style={{ color: '#52c41a', marginBottom: '1rem', fontSize: '0.875rem' }}>{message}</div>}
                  <div className="auth-group">
                    <label className="auth-label">Email Address</label>
                    <input type="email" className="auth-input" placeholder="david@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className="auth-group">
                    <label className="auth-label">Password</label>
                    <input type="password" className="auth-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                    {/* <span className="auth-forgot" onClick={() => { setMode("forgot"); setError(""); setMessage(""); }}>Forgot Password?</span> */}
                  </div>
                  <button className="auth-btn" disabled={loading}>{loading ? "Signing In..." : "Sign In"}</button>
                </form>

                <div className="auth-divider">or continue with</div>

                <div className="social-auth">
                  <button type="button" className="social-btn" onClick={() => signIn("google", { callbackUrl })}><GoogleIcon /> Google</button>
                  {/* <button className="social-btn"><AppleIcon /> Apple</button>
                  <button className="social-btn"><FacebookIcon /> Facebook</button> */}
                </div>

                <div className="auth-switch">
                  Don&apos;t have an account? <span onClick={() => { setMode("register"); setError(""); setMessage(""); }}>Sign Up</span>
                </div>
              </div>
            )}

            {mode === "register" && (
              <div className="auth-form-container">
                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">Join us for exclusive safari access</p>
                
                <form onSubmit={handleRegister}>
                  {error && <div style={{ color: '#ff4d4f', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
                  <div className="auth-group">
                    <label className="auth-label">Full Name</label>
                    <input type="text" className="auth-input" placeholder="David Attenborough" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                  <div className="auth-group">
                    <label className="auth-label">Email Address</label>
                    <input type="email" className="auth-input" placeholder="david@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className="auth-group">
                    <label className="auth-label">Password</label>
                    <input type="password" className="auth-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
                  </div>
                  <button className="auth-btn" disabled={loading}>{loading ? "Creating Account..." : "Create Account"}</button>
                </form>

                <div className="auth-divider">or register with</div>

                <div className="social-auth">
                  <button type="button" className="social-btn" onClick={() => signIn("google", { callbackUrl })}><GoogleIcon /> Google</button>
                  {/* <button className="social-btn"><AppleIcon /> Apple</button>
                  <button className="social-btn"><FacebookIcon /> Facebook</button> */}
                </div>

                <div className="auth-switch">
                  Already have an account? <span onClick={() => { setMode("login"); setError(""); }}>Log In</span>
                </div>
              </div>
            )}

            {mode === "forgot" && (
              <div className="auth-form-container">
                <h2 className="auth-title">Reset Password</h2>
                <p className="auth-subtitle">We&apos;ll send you instructions to reset it</p>
                
                <form onSubmit={(e) => { e.preventDefault(); setMessage("Reset link sent to your email!"); }}>
                  {message && <div style={{ color: '#52c41a', marginBottom: '1rem', fontSize: '0.875rem' }}>{message}</div>}
                  <div className="auth-group">
                    <label className="auth-label">Email Address</label>
                    <input type="email" className="auth-input" placeholder="david@example.com" required />
                  </div>
                  <button className="auth-btn" style={{ marginTop: 20 }}>Send Reset Link</button>
                </form>

                <div className="auth-switch" style={{ marginTop: 40 }}>
                  Remembered your password? <span onClick={() => { setMode("login"); setMessage(""); }}>Back to Login</span>
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

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
