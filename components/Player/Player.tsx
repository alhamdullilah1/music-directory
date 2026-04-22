'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Search, Home, LayoutGrid, Users, ListMusic, Heart, Shuffle, Repeat, Volume2, Mic2, Disc, Music, ChevronDown, ChevronUp } from 'lucide-react';
import { ChordRoller } from '../ChordRoller/ChordRoller';
import { GearLink } from '../GearLink/GearLink';
import YouTube from 'react-youtube';
import { songLyrics } from '../../lib/lyrics';

type Song = {
  id: number;
  title: string;
  artist: string;
  genre: string;
  scale?: string | null;
  audioUrl: string; // YouTube ID
  imageUrl?: string | null;
  paletteTheme: string;
  chords: any[];
  gears: any[];
  lyrics?: any[];
};

interface PlayerProps {
  songs: Song[];
}

export const Player: React.FC<PlayerProps> = ({ songs }) => {
  const [selectedSongId, setSelectedSongId] = useState<number | null>(songs[0]?.id || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ytPlayer, setYtPlayer] = useState<any>(null);
  
  // New State variables
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeArtist, setActiveArtist] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [sidebarView, setSidebarView] = useState<'Home' | 'Categories' | 'Artists'>('Home');
  const [volume, setVolume] = useState(70);
  const [showLyrics, setShowLyrics] = useState(true);
  
  const currentSongIndex = songs.findIndex(s => s.id === selectedSongId);
  const currentSong = songs[currentSongIndex];

  // Get Lyrics for current song
  const fallbackLyrics = currentSong ? (songLyrics[currentSong.title] || [{ time: 0, text: "♪ (Instrumental / No Lyrics Found) ♪" }]) : [];
  const dbLyrics = currentSong?.lyrics && currentSong.lyrics.length > 0 ? currentSong.lyrics : null;
  const lyrics = dbLyrics ? dbLyrics.map(l => ({ time: l.timestamp, text: l.text })) : fallbackLyrics;
  
  const currentLyric = lyrics.slice().reverse().find(l => currentTime >= l.time)?.text || "♪ (Music) ♪";

  useEffect(() => {
    if (currentSong) {
      document.body.setAttribute('data-theme', currentSong.paletteTheme);
      
      // Track listening history
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find(c => c.trim().startsWith('vibemaker_auth='));
      if (authCookie) {
        const email = authCookie.split('=')[1];
        fetch('/api/play', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ songId: currentSong.id, email })
        }).catch(console.error);
      }

    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [currentSong]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && ytPlayer) {
      interval = setInterval(async () => {
        const time = await ytPlayer.getCurrentTime();
        setCurrentTime(time);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, ytPlayer]);

  const handleYtReady = (event: any) => {
    setYtPlayer(event.target);
    setDuration(event.target.getDuration());
    event.target.setVolume(volume);
    if (isPlaying) {
      event.target.playVideo();
    }
  };

  const handleYtStateChange = (event: any) => {
    if (event.data === 1) {
      setIsPlaying(true);
      setDuration(event.target.getDuration());
    } else if (event.data === 2) {
      setIsPlaying(false);
    } else if (event.data === 0) {
      if (isRepeat) {
        event.target.seekTo(0);
        event.target.playVideo();
      } else {
        nextSong();
      }
    }
  };

  const togglePlay = () => {
    if (!ytPlayer) return;
    if (isPlaying) {
      ytPlayer.pauseVideo();
    } else {
      ytPlayer.playVideo();
    }
  };

  const nextSong = () => {
    if (currentSongIndex === -1) return;
    let nextIdx;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * songs.length);
    } else {
      nextIdx = (currentSongIndex + 1) % songs.length;
    }
    setSelectedSongId(songs[nextIdx].id);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const prevSong = () => {
    if (currentSongIndex === -1) return;
    const prevIdx = (currentSongIndex - 1 + songs.length) % songs.length;
    setSelectedSongId(songs[prevIdx].id);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Extract unique categories and artists
  const categories = ['All', ...Array.from(new Set(songs.map(s => s.genre)))];
  const uniqueArtists = Array.from(new Set(songs.map(s => s.artist)));
  
  // Filter songs based on category and artist
  let filteredSongs = songs;
  if (activeCategory !== 'All') {
    filteredSongs = filteredSongs.filter(s => s.genre === activeCategory);
  }
  if (activeArtist !== 'All') {
    filteredSongs = filteredSongs.filter(s => s.artist === activeArtist);
  }
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredSongs = filteredSongs.filter(s => 
      s.title.toLowerCase().includes(query) || 
      s.artist.toLowerCase().includes(query)
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', background: 'transparent', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Hidden YouTube Player */}
      <div style={{ position: 'absolute', top: '-9999px', width: '0', height: '0', overflow: 'hidden' }}>
        {currentSong && (
          <YouTube
            videoId={currentSong.audioUrl}
            opts={{ height: '100', width: '100', playerVars: { autoplay: 1, controls: 0 } }}
            onReady={handleYtReady}
            onStateChange={handleYtStateChange}
          />
        )}
      </div>

      {/* LEFT SIDEBAR */}
      <aside style={{ width: '260px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', padding: '1.5rem', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', color: 'var(--accent)' }}>
          <Disc size={32} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>VibeTrack</h1>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {[
            { icon: Home, label: 'Home', view: 'Home' },
            { icon: LayoutGrid, label: 'Categories', view: 'Categories' },
            { icon: Users, label: 'Artists', view: 'Artists' },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => { setSidebarView(item.view as any); setIsPlayerExpanded(false); setActiveCategory('All'); setActiveArtist('All'); }}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: '12px', background: sidebarView === item.view ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: sidebarView === item.view ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', fontWeight: 500, transition: 'all 0.2s' }}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT (Switches based on Expand State and Sidebar View) */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem', paddingBottom: '120px', position: 'relative' }}>
        
        {/* Top Bar (Always visible unless expanded) */}
        {!isPlayerExpanded && (
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <div style={{ position: 'relative', width: '400px' }}>
              <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for artists, songs, or chords..." 
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '0.9rem', outline: 'none', backdropFilter: 'blur(10px)' }} 
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>IS</div>
            </div>
          </header>
        )}

        {isPlayerExpanded ? (
          
          /* EXPANDED PLAYER VIEW */
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', paddingTop: '1rem', animation: 'fadeIn 0.3s ease' }}>
            <button 
              onClick={() => setIsPlayerExpanded(false)}
              style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.75rem', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(10px)', zIndex: 20 }}
            >
              <ChevronDown size={24} />
            </button>
            
            <div style={{ display: 'flex', gap: '4rem', width: '100%', maxWidth: '1200px', height: '100%' }}>
              
              {/* Left: Album Art & Info & CHORDS */}
              <div style={{ flex: '0 0 450px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', paddingRight: '1rem', paddingBottom: '2rem' }}>
                <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '24px', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                  {currentSong?.imageUrl ? (
                    <img src={currentSong.imageUrl} alt={currentSong.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Disc size={64} opacity={0.5} /></div>
                  )}
                </div>
                
                <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{currentSong?.title}</h2>
                <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{currentSong?.artist}</p>
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                  <span style={{ fontSize: '1rem', padding: '0.5rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)' }}>{currentSong?.genre}</span>
                  {currentSong?.scale && (
                    <span style={{ fontSize: '1rem', padding: '0.5rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Music size={16} /> {currentSong.scale}
                    </span>
                  )}
                </div>

                {/* Chords and Gear moved HERE */}
                <div style={{ width: '100%', background: 'rgba(0,0,0,0.4)', borderRadius: '24px', padding: '2rem', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live Data</h3>
                  <ChordRoller chords={currentSong?.chords || []} currentTime={currentTime} />
                  <div style={{ marginTop: '1.5rem' }}>
                    <GearLink gears={currentSong?.gears || []} currentTime={currentTime} />
                  </div>
                </div>
              </div>

              {/* Right: Lyrics View */}
              {showLyrics && (
                <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)', borderRadius: '24px', padding: '3rem', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', overflow: 'hidden' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Lyrics</h3>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '1rem' }}>
                    {lyrics.map((l, i) => (
                      <p key={i} style={{ 
                        fontSize: l.text === currentLyric ? '2.5rem' : '1.5rem', 
                        fontWeight: l.text === currentLyric ? 800 : 600, 
                        color: l.text === currentLyric ? '#fff' : 'rgba(255,255,255,0.3)',
                        transition: 'all 0.3s ease',
                        filter: l.text === currentLyric ? 'none' : 'blur(1px)'
                      }}>
                        {l.text}
                      </p>
                    ))}
                    <div style={{ height: '50vh' }} /> {/* Padding for scrolling */}
                  </div>
                </div>
              )}
            </div>
          </div>
          
        ) : sidebarView === 'Categories' ? (

          /* CATEGORIES VIEW */
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Browse Categories</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
              {categories.filter(c => c !== 'All').map(cat => (
                <div 
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setSidebarView('Home'); }}
                  style={{ aspectRatio: '16/9', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(0,0,0,0.5))', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s, background 0.2s', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'; e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#000'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(0,0,0,0.5))'; e.currentTarget.style.color = '#fff'; }}
                >
                  <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{cat}</h3>
                </div>
              ))}
            </div>
          </div>

        ) : sidebarView === 'Artists' ? (

          /* ARTISTS VIEW */
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Artists</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '3rem' }}>
              {uniqueArtists.map(artist => (
                <div 
                  key={artist}
                  onClick={() => { setActiveArtist(artist); setSidebarView('Home'); }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.3)' }}>
                    <Users size={64} opacity={0.3} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, textAlign: 'center' }}>{artist}</h3>
                </div>
              ))}
            </div>
          </div>

        ) : (
          
          /* HOME DASHBOARD VIEW */
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            
            {/* Featured Cover Flow - Only show if not filtering */}
            {activeCategory === 'All' && activeArtist === 'All' && (
              <section style={{ marginBottom: '3rem' }}>
                <div style={{ position: 'relative', width: '100%', height: '350px', borderRadius: '24px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: '3rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                  <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                     {songs[1]?.imageUrl && <img src={songs[1].imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                     <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)' }} />
                  </div>
                  <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'var(--accent)', color: '#000', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', display: 'inline-block' }}>Featured Track</span>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em', lineHeight: 1 }}>{songs[1]?.title}</h2>
                    <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' }}>{songs[1]?.artist}</p>
                    <button onClick={() => { setSelectedSongId(songs[1]?.id); setIsPlaying(true); }} style={{ padding: '0.75rem 2rem', borderRadius: '24px', background: 'var(--accent)', border: 'none', color: '#000', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Play size={20} fill="currentColor" /> Play Now
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Clear Filters Label */}
            {(activeCategory !== 'All' || activeArtist !== 'All') && (
              <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Filtered Results</h2>
                <button onClick={() => { setActiveCategory('All'); setActiveArtist('All'); }} style={{ padding: '0.5rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer' }}>Clear Filters</button>
              </div>
            )}

            {/* Categories Pills - Only show if not filtering by artist */}
            {activeArtist === 'All' && (
              <section style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                  {categories.map((cat, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveCategory(cat)}
                      style={{ 
                        padding: '0.5rem 1.5rem', 
                        borderRadius: '24px', 
                        border: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.2)', 
                        background: activeCategory === cat ? 'var(--accent)' : 'transparent', 
                        color: activeCategory === cat ? '#000' : '#fff', 
                        fontWeight: 600, 
                        cursor: 'pointer', 
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Popular Songs Row */}
            <section>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                {activeArtist !== 'All' ? `Songs by ${activeArtist}` : activeCategory === 'All' ? 'Popular Songs' : `${activeCategory} Songs`}
              </h3>
              
              {filteredSongs.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No songs found.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem', paddingBottom: '2rem' }}>
                  {filteredSongs.map(song => (
                    <div key={song.id} 
                         onClick={() => { setSelectedSongId(song.id); setIsPlaying(true); }}
                         style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.2s' }}
                         onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                         onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                      <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '16px', overflow: 'hidden', marginBottom: '1rem', position: 'relative', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>
                        {song.imageUrl ? (
                          <img src={song.imageUrl} alt={song.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Disc size={40} opacity={0.5} /></div>
                        )}
                        {/* Hover play button overlay */}
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: selectedSongId === song.id ? 1 : 0, transition: 'opacity 0.2s' }}>
                          {selectedSongId === song.id && isPlaying ? <div className="visualizer" style={{ transform: 'scale(0.5)' }}><div className="bar"/><div className="bar"/><div className="bar"/><div className="bar"/></div> : <Play size={48} fill="#fff" />}
                        </div>
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{song.artist}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

      </main>

      {/* BOTTOM PLAYER BAR */}
      <footer 
        onClick={() => !isPlayerExpanded && setIsPlayerExpanded(true)}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 2rem', zIndex: 50, justifyContent: 'space-between', cursor: isPlayerExpanded ? 'default' : 'pointer', transition: 'background 0.2s' }}
        onMouseEnter={e => !isPlayerExpanded && (e.currentTarget.style.background = 'rgba(20,20,20,0.95)')}
        onMouseLeave={e => !isPlayerExpanded && (e.currentTarget.style.background = 'rgba(10,10,10,0.85)')}
      >
        
        {/* Left: Song Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '30%' }}>
          {!isPlayerExpanded && (
            <ChevronUp size={24} color="var(--text-secondary)" style={{ marginRight: '0.5rem', opacity: 0.5 }} />
          )}
          <div style={{ width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
            {currentSong?.imageUrl && <img src={currentSong.imageUrl} alt={currentSong.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{currentSong?.title || 'Select a song'}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{currentSong?.artist || 'Unknown Artist'}</p>
          </div>
          <Heart size={20} color="var(--text-secondary)" style={{ marginLeft: '1rem', cursor: 'pointer' }} onClick={e => e.stopPropagation()} />
        </div>

        {/* Center: Controls & Scrubber */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Shuffle size={20} color={isShuffle ? 'var(--accent)' : 'var(--text-secondary)'} onClick={() => setIsShuffle(!isShuffle)} style={{ cursor: 'pointer' }} />
            <button onClick={prevSong} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><SkipBack size={24} fill="currentColor" /></button>
            <button onClick={togglePlay} style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fff', color: '#000', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" style={{ marginLeft: '4px' }} />}
            </button>
            <button onClick={nextSong} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><SkipForward size={24} fill="currentColor" /></button>
            <Repeat size={20} color={isRepeat ? 'var(--accent)' : 'var(--text-secondary)'} onClick={() => setIsRepeat(!isRepeat)} style={{ cursor: 'pointer' }} />
          </div>
          
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{formatTime(currentTime)}</span>
            <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', position: 'relative', cursor: 'pointer' }}
                 onClick={(e) => {
                   if (ytPlayer && duration) {
                     const rect = e.currentTarget.getBoundingClientRect();
                     const percent = (e.clientX - rect.left) / rect.width;
                     ytPlayer.seekTo(percent * duration, true);
                     setCurrentTime(percent * duration);
                   }
                 }}>
              <div className="track-bar-fill" style={{ width: `${(currentTime / duration) * 100 || 0}%`, background: 'var(--accent)' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Extra Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', width: '30%' }} onClick={e => e.stopPropagation()}>
          <Mic2 size={20} color={showLyrics ? 'var(--accent)' : 'var(--text-secondary)'} onClick={() => setShowLyrics(!showLyrics)} style={{ cursor: 'pointer' }} />
          <Volume2 size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
          <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', cursor: 'pointer', position: 'relative' }}
               onClick={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                 setVolume(percent * 100);
                 if (ytPlayer) ytPlayer.setVolume(percent * 100);
               }}>
            <div style={{ width: `${volume}%`, height: '100%', background: '#fff', borderRadius: '3px' }} />
          </div>
        </div>

      </footer>
    </div>
  );
};
