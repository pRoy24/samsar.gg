import React, { forwardRef, useRef, useEffect } from "react";
import { Stage, Layer, Star, Text, Image, Transformer } from 'react-konva';
import { useImage } from 'react-konva-utils';
import { getScalingFactor } from '../../utils/image.js';
const IMAGE_BASE = `${process.env.REACT_APP_PROCESSOR_API}`;

export default function ResizableImage({ image, isSelected, onSelect, onUnselect, ...props }) {
  const [img] = useImage(image.src, "anonymous");
  const shapeRef = useRef();
  const trRef = useRef();
  const { showMask } = props;

  const imageDimensions = {
    width: img?.width,
    height: img?.height,
  }
  const scalingFactor = getScalingFactor(imageDimensions);

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        {...props}
        image={img}
        ref={shapeRef}
        onClick={(e) => {
          e.cancelBubble = true; // Prevent event from bubbling to the stage
          onSelect();
        }}
        onTap={(e) => {
          e.cancelBubble = true; // Same as above for touch devices
          onSelect();
        }}
        scaleX={scalingFactor}
        scaleY={scalingFactor}
        draggable={showMask ?  false : true}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
}