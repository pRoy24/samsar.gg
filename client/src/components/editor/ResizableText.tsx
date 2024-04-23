import React, { useRef, useEffect } from 'react';
import { Text, Transformer, Group } from 'react-konva';


const ResizableText = ({ text, isSelected, onSelect, ...props }) => {
  const textRef = useRef();
  const trRef = useRef();
  const { config, id } = props;


    useEffect(() => {
      if (trRef.current) {
        if (isSelected && textRef.current) {
          trRef.current.nodes([textRef.current]);
          trRef.current.getLayer().batchDraw();
        } else {
          // Ensure transformer is detached when not selected
          trRef.current.nodes([]);
          trRef.current.getLayer().batchDraw();
        }
      }
    }, [isSelected]);



  return (
    <Group id={id}>
      <Text
        {...props}

        fontFamily={config.fontFamily}
        fontSize={config.fontSize}
        fill={config.fillColor}
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
    </Group>
  );
};

export default ResizableText;