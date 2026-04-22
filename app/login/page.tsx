"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Music, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Fake auth for now
    setTimeout(() => {
      setIsLoading(false);
      document.cookie = `vibemaker_auth=${email}; path=/; max-age=86400`;
      window.location.href = '/';
    }, 1500);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%', 
      position: 'relative', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      overflow: 'hidden', 
      background: '#09090b',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Background Image/Logo with Overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src="/vibemaker-logo.png"
          alt="Vibemaker Background"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, filter: 'blur(8px)', transform: 'scale(1.05)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,9,11,1), rgba(9,9,11,0.8), transparent)' }} />
      </div>

      {/* Auth Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ 
          position: 'relative', 
          zIndex: 10, 
          width: '100%', 
          maxWidth: '450px', 
          padding: '2.5rem', 
          background: 'rgba(24, 24, 27, 0.5)', 
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: '24px', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', background: 'linear-gradient(to bottom right, #7c3aed, #d946ef)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.2)' }}>
            <Music color="white" size={32} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem', margin: 0 }}>Vibemaker</h1>
          <p style={{ color: '#a1a1aa', textAlign: 'center', fontSize: '0.875rem', margin: 0 }}>
            {isLogin ? "Welcome back to your ultimate music space." : "Join the ultimate music directory today."}
          </p>
        </div>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '0.25rem' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} color="#71717a" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '0.75rem 1rem 0.75rem 3rem', color: 'white', outline: 'none', transition: 'all 0.2s', fontSize: '1rem' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(139, 92, 246, 0.5)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '0.25rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} color="#71717a" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a password"
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '0.75rem 1rem 0.75rem 3rem', color: 'white', outline: 'none', transition: 'all 0.2s', fontSize: '1rem' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(139, 92, 246, 0.5)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
            </div>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              style={{ 
                padding: '0.75rem', 
                borderRadius: '8px', 
                fontSize: '0.875rem', 
                background: message.type === "error" ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: message.type === "error" ? '#f87171' : '#34d399',
                border: `1px solid ${message.type === "error" ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
              }}
            >
              {message.text}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '0.75rem 1rem', 
              background: 'white', 
              color: 'black', 
              fontWeight: 600, 
              borderRadius: '12px', 
              border: 'none', 
              cursor: isLoading ? 'not-allowed' : 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem',
              opacity: isLoading ? 0.7 : 1,
              marginTop: '1rem',
              fontSize: '1rem'
            }}
            onMouseOver={(e) => !isLoading && (e.currentTarget.style.background = '#e4e4e7')}
            onMouseOut={(e) => !isLoading && (e.currentTarget.style.background = 'white')}
          >
            {isLoading ? (
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                {isLogin ? "Sign In" : "Create Account"}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{ fontSize: '0.875rem', color: '#a1a1aa', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseOver={(e) => e.currentTarget.style.color = 'white'}
            onMouseOut={(e) => e.currentTarget.style.color = '#a1a1aa'}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </motion.div>

      {/* Global styles for loader animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
