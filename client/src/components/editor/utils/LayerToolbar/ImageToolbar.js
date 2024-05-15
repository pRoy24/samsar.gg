import React, { useState } from 'react';
import { FaChevronCircleDown, FaChevronCircleUp } from 'react-icons/fa';
import Konva from 'konva';

const filters = [
  { name: 'Blur', value: Konva.Filters.Blur, min: 0, max: 20, step: 1 },
  { name: 'Brighten', value: Konva.Filters.Brighten, min: -1, max: 1, step: 0.01 },
  { name: 'Contrast', value: Konva.Filters.Contrast, min: -1, max: 1, step: 0.01 },
  { name: 'Grayscale', value: Konva.Filters.Grayscale, min: 0, max: 1, step: 1 },
  { name: 'HSL', value: Konva.Filters.HSL, min: -1, max: 1, step: 0.01 },
  { name: 'Invert', value: Konva.Filters.Invert, min: 0, max: 1, step: 1 },
  { name: 'Pixelate', value: Konva.Filters.Pixelate, min: 1, max: 20, step: 1 },
  { name: 'Posterize', value: Konva.Filters.Posterize, min: 1, max: 20, step: 1 },
  { name: 'Sepia', value: Konva.Filters.Sepia, min: 0, max: 1, step: 1 },
  { name: 'Solarize', value: Konva.Filters.Solarize, min: 0, max: 1, step: 1 },
  { name: 'RGBA', value: Konva.Filters.RGBA, min: 0, max: 1, step: 0.01 }
];

export default function ImageToolbar(props) {
  const { pos, moveItem, index, applyFilter } = props;
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filterValue, setFilterValue] = useState(0);

  const handleFilterChange = (e) => {
    const filter = filters.find(f => f.name === e.target.value);
    setSelectedFilter(filter);
    setFilterValue(filter.min); // Reset the filter value
    applyFilter(index, filter.value, filter.min); // Apply filter with initial value
  };

  const handleSliderChange = (e, step) => {
    const value = parseFloat(e.target.value);
    setFilterValue(value);
    if (selectedFilter) {
      applyFilter(index, selectedFilter.value, value);
    }
  };

  return (
    <div key={pos.id} style={{
      position: 'absolute', left: pos.x, top: pos.y, background: "#030712",
      width: "200px", borderRadius: "5px", padding: "5px", display: "flex", flexDirection: "column", alignItems: "center",
      zIndex: 1000
    }}>
      <div className='flex flex-row'>
        <div className='basis-1/4'>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <button onClick={() => moveItem(index, -1)}>
              <FaChevronCircleDown className="text-white" />
            </button>
            <button onClick={() => moveItem(index, 1)} style={{ marginLeft: '10px' }}>
              <FaChevronCircleUp className="text-white" />
            </button>
          </div>
        </div>
        <div className='basis-3/4'>
          <select onChange={handleFilterChange} style={{ marginBottom: '10px', width: '100%' }}>
            <option value="">Select Filter</option>
            {filters.map(filter => (
              <option key={filter.name} value={filter.name}>{filter.name}</option>
            ))}
          </select>
          {selectedFilter && (
            <input
              type="range"
              min={selectedFilter.min}
              max={selectedFilter.max}
              step={selectedFilter.step}
              value={filterValue}
              onChange={(e) => handleSliderChange(e, selectedFilter.step)}
              style={{ width: '100%' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
