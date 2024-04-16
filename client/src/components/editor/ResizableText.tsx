import React, { useRef, useEffect } from 'react';
import { Text, Transformer } from 'react-konva';


const ResizableText = ({ text, isSelected, onSelect, ...props }) => {
  const textRef = useRef();
  const trRef = useRef();

  console.log("INSIDE RESIZBALE TEXT");
  console.log(text);


  useEffect(() => {
    if (isSelected && textRef.current) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        {...props}
        text={text}
        ref={textRef}
        onClick={onSelect}
        onTap={onSelect}
        draggable
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit the size of the text box if necessary
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default ResizableText;