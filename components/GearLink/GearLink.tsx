import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Guitar, Speaker, Zap } from 'lucide-react';

type GearEvent = {
  id: number;
  timestamp: number;
  guitar: string;
  pedal: string;
  amp: string;
  imageUrl?: string | null;
};

interface GearLinkProps {
  gears: GearEvent[];
  currentTime: number;
}

export const GearLink: React.FC<GearLinkProps> = ({ gears, currentTime }) => {
  const activeGear = [...gears]
    .reverse()
    .find((gear) => currentTime >= gear.timestamp);

  return (
    <div style={{ margin: '2rem 0', minHeight: '120px' }}>
      <AnimatePresence mode="wait">
        {activeGear && (
          <motion.div
            key={activeGear.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel"
            style={{
              padding: '1.5rem',
              display: 'flex',
              gap: '2rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Guitar size={24} color="var(--accent)" />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Guitar</div>
                <div style={{ fontWeight: 500 }}>{activeGear.guitar}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Zap size={24} color="var(--accent)" />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pedal</div>
                <div style={{ fontWeight: 500 }}>{activeGear.pedal}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Speaker size={24} color="var(--accent)" />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amp</div>
                <div style={{ fontWeight: 500 }}>{activeGear.amp}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
