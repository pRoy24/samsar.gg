import React from 'react';
import {  Rect, Text, Circle, Line } from 'react-konva';

export default function ResizableShape(props) { 
  const { shape, config } = props;


  const { x, y, width, height, fill } = config;
  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}

    />
  )
}