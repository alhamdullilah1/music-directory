import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ChordEvent = {
  id: number;
  timestamp: number;
  chordName: string;
};

interface ChordRollerProps {
  chords: ChordEvent[];
  currentTime: number;
}

export const ChordRoller: React.FC<ChordRollerProps> = ({ chords, currentTime }) => {
  // Find the currently active chord
  const activeChord = [...chords]
    .reverse()
    .find((chord) => currentTime >= chord.timestamp);

  return (
    <div className="chord-roller" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      height: '150px',
      margin: '2rem 0'
    }}>
      <AnimatePresence mode="wait">
        {activeChord ? (
          <motion.div
            key={activeChord.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{
              fontSize: '6rem',
              fontWeight: 800,
              color: 'var(--accent)',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              fontFamily: 'monospace'
            }}
          >
            {activeChord.chordName}
          </motion.div>
        ) : (
          <motion.div
            key="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            style={{
              fontSize: '2rem',
              fontWeight: 300,
              color: 'var(--text-secondary)'
            }}
          >
            Waiting for chords...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
