import React, { useState } from 'react';

function RangeSlider(props) {
  const { editBrushWidth, setEditBrushWidth } = props;



  const handleSliderChange = (event) => {
    setEditBrushWidth(event.target.value);
  };

  return (
    <div style={{ padding: '20px' }}>
      <input
        type="range"
        min="5"
        max="50"
        value={editBrushWidth}
        onChange={handleSliderChange}
        className='w-full'
        style={{

          background: `linear-gradient(to right, #ddd 0%, #ddd ${(editBrushWidth - 5) / 45 * 100}%, #fff ${(editBrushWidth - 5) / 45 * 100}%, #fff 100%)`,
          height: '8px',
          borderRadius: '5px',
          outline: 'none',
          transition: 'background 0.3s ease-in-out',
        }}
      />

    </div>
  );
}

export default RangeSlider;
