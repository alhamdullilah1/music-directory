import { PrismaClient } from '@prisma/client';
import { Player } from '@/components/Player/Player';
import { Music } from 'lucide-react';

const prisma = new PrismaClient();

// Revalidate every 60 seconds or use dynamic
export const revalidate = 60;

export default async function Home() {
  const songs = await prisma.song.findMany({
    include: {
      chords: {
        orderBy: { timestamp: 'asc' }
      },
      gears: {
        orderBy: { timestamp: 'asc' }
      },
      lyrics: {
        orderBy: { timestamp: 'asc' }
      }
    },
    orderBy: { id: 'asc' }
  });

  return (
    <main style={{ minHeight: '100vh', padding: '2rem' }}>
      <header className="glass-nav" style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        padding: '1rem 2rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem',
        zIndex: 50
      }}>
        <div style={{ background: 'var(--accent)', padding: '0.5rem', borderRadius: '50%', color: 'var(--bg-primary)' }}>
          <Music size={24} />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Vibemaker</h1>
      </header>

      <div style={{ paddingTop: '80px', maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
        {songs.length > 0 ? (
          <Player songs={songs} />
        ) : (
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h2>No songs found. Please seed the database.</h2>
          </div>
        )}
      </div>
    </main>
  );
}
