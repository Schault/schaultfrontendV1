"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ min, max, onChange }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange(minVal, maxVal);
  }, [minVal, maxVal, onChange]);

  return (
    <div className="flex flex-col space-y-6">
      <div className="relative h-10 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 1);
            setMinVal(value);
            minValRef.current = value;
          }}
          className="thumb thumb--left"
          style={{ zIndex: minVal > max - 100 ? 5 : undefined }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(value);
            maxValRef.current = value;
          }}
          className="thumb thumb--right"
        />

        <div className="slider">
          <div className="slider__track" />
          <div ref={range} className="slider__range" />
        </div>
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <label className="block font-inter text-[10px] text-black/50 mb-1">MIN</label>
          <div className="border border-black/10 p-2 font-inter text-sm text-black/90 flex items-center">
            <span className="mr-1">₹</span>
            <input
              type="number"
              value={minVal}
              onChange={(e) => setMinVal(Number(e.target.value))}
              className="w-full bg-transparent outline-none border-none p-0"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="block font-inter text-[10px] text-black/50 mb-1">MAX</label>
          <div className="border border-black/10 p-2 font-inter text-sm text-black/90 flex items-center">
            <span className="mr-1">₹</span>
            <input
              type="number"
              value={maxVal}
              onChange={(e) => setMaxVal(Number(e.target.value))}
              className="w-full bg-transparent outline-none border-none p-0"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .thumb,
        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          -webkit-tap-highlight-color: transparent;
        }

        .thumb {
          pointer-events: none;
          position: absolute;
          height: 0;
          width: 100%;
          outline: none;
        }

        .thumb--left {
          z-index: 3;
        }

        .thumb--right {
          z-index: 4;
        }

        /* For Chrome browsers */
        .thumb::-webkit-slider-thumb {
          background-color: #cc0000;
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          height: 16px;
          width: 16px;
          margin-top: 4px;
          pointer-events: all;
          position: relative;
        }

        /* For Firefox browsers */
        .thumb::-moz-range-thumb {
          background-color: #cc0000;
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          height: 16px;
          width: 16px;
          pointer-events: all;
          position: relative;
        }

        .slider {
          position: relative;
          width: 100%;
        }

        .slider__track,
        .slider__range {
          position: absolute;
          height: 2px;
        }

        .slider__track {
          background-color: rgba(0, 0, 0, 0.1);
          width: 100%;
          z-index: 1;
        }

        .slider__range {
          background-color: #cc0000;
          z-index: 2;
        }
      `}</style>
    </div>
  );
};

export default PriceRangeSlider;
