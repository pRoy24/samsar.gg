import React, { forwardRef, useRef, useEffect, useState } from "react";
import { Stage, Layer, Star, Text, Image, Transformer, Group, Line } from 'react-konva';
import { CURRENT_TOOLBAR_VIEW } from '../../constants/Types.ts';
import { useImage } from 'react-konva-utils';
import ResizableImage from "./ResizableImage.tsx";
import ResizableText from "./ResizableText.tsx";
import ResizableShape from "./ResizableShape.js";

const IMAGE_BASE = `${process.env.REACT_APP_PROCESSOR_API}`;

const STAGE_DIMENSIONS = {
  width: 1024,
  height: 1024,
}

const SMSCanvas = forwardRef((props: any, ref: any) => {

  const { sessionDetails, activeItemList, currentView, editBrushWidth, maskGroupRef } = props;
  const [showMask, setShowMask] = useState(false);
  const [mask, setMask] = useState(null);
  const [lines, setLines] = useState([]);
  const [isPainting, setIsPainting] = useState(false);
  const imageSrc = `${IMAGE_BASE}/generations/${sessionDetails?.activeSelectedImage}`;
  const [image, status] = useImage(imageSrc, 'anonymous');
  const [selectedId, selectImage] = useState(null);

  const handleStageClick = (e) => {
    // Check if the click is on empty stage area
    if (e.target === e.target.getStage()) {
      selectImage(null); // Deselect any selected image
    }
  };

  const setItemAsSelected = (itemId) => {
    selectImage(itemId);
  }

  const generateCursor = (size) => {
    return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'><circle cx='${size / 2}' cy='${size / 2}' r='${size / 2 - 1}' fill='%23000' /></svg>") ${size / 2} ${size / 2}, auto`;
  };


  useEffect(() => {
    setShowMask(false);

    if (currentView === CURRENT_TOOLBAR_VIEW.SHOW_EDIT_MASK_DISPLAY) {
      setShowMask(true);
      const stage = ref.current.getStage();
      const container = stage.container();
      container.style.cursor = generateCursor(editBrushWidth);
    }
  }, [currentView]);


  if (currentView === CURRENT_TOOLBAR_VIEW.SHOW_EDIT_MASK_DISPLAY) {

    const stage = ref.current.getStage();
    const container = stage.container();
    container.style.cursor = generateCursor(editBrushWidth);
  }

  let imageStackList = <span />;

  if (activeItemList && activeItemList.length > 0) {
    imageStackList = activeItemList.map(function (item, index) {
      if (item.type === 'image') {
        return (
          <ResizableImage
            key={index}
            image={item}
            isSelected={selectedId === item.id}
            onSelect={() => setItemAsSelected(item.id)}
            onUnselect={() => selectImage(null)}
            showMask={showMask}
          />
        )
      } else if (item.type === 'text') {
        return (
          <ResizableText
            key={index}
            text={item.text}
            config={item.config} 
            isSelected={selectedId === item.id}
            onSelect={() => selectImage(item.id)}
            onUnselect={() => selectImage(null)}

          />
        )
      } else if (item.type === 'shape') {
        return (
          <ResizableShape
            key={index}
            shape={item.shape}
            config={item.config} 
            isSelected={selectedId === item.id}
            onSelect={() => selectImage(item.id)}
            onUnselect={() => selectImage(null)}
          />
        )
      }
    }).filter(Boolean);
  }


  const handleLayerMouseDown = (e) => {
    setIsPainting(true);
    const pos = e.target.getStage().getPointerPosition();
    addLine([pos.x, pos.y, pos.x, pos.y]);
  };

  // This function updates the lines array with the new points
  const addLine = (points) => {
    setLines([...lines, { points, stroke: 'white', strokeWidth: editBrushWidth }]);
  };


  const handleLayerMouseMove = (e) => {
    if (!isPainting) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    setLines(lines.slice(0, -1).concat(lastLine));
  };

  const handleLayerMouseUp = () => {
    setIsPainting(false);
  };

  let currentCursor = 'default';

  return (
    <div className={`m-auto bg-stone-400 pt-8 pb-8  shadow-lg  `}>
      <Stage
        width={STAGE_DIMENSIONS.width}
        height={STAGE_DIMENSIONS.height}
        ref={ref}
        onMouseDown={handleStageClick}  // Listen for mouse down events on the stage

      >
        <Layer
          onMouseDown={handleLayerMouseDown}
          onMousemove={handleLayerMouseMove}
          onMouseup={handleLayerMouseUp}

          style={{ cursor: currentCursor }}
        >
          <Group id="baseGroup">
            {imageStackList}
          </Group>

          {showMask && (
            <Group id="maskGroup">
              {lines.map((line, i) => (
                <Line key={i} points={line.points} stroke={line.stroke} strokeWidth={line.strokeWidth} />
              ))}
            </Group>
          )}
        </Layer>

      </Stage>
    </div>
  );
});

export default SMSCanvas;