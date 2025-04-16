import React from 'react';

interface TopsterProps {
  images?: string[];
  columns?: number;
}

const Topster: React.FC<TopsterProps> = ({ images = [], columns = 5 }) => {
  const totalSlots = columns * columns;
  const slots = images.length > 0 ? images : Array(totalSlots).fill(undefined);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '4px',
      }}
    >
      {slots.map((src, idx) => (
        src ? (
          <img
            key={idx}
            src={src}
            alt={`topster-${idx}`}
            style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '4px' }}
          />
        ) : (
          <div
            key={idx}
            style={{
              width: '100%',
              paddingTop: '100%',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
            }}
          />
        )
      ))}
    </div>
  );
};

export default Topster;
