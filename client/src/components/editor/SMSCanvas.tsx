import React, { forwardRef, useRef, useEffect, useState } from "react";
import { Stage, Layer, Star, Text, Image, Transformer, Group, Line } from 'react-konva';
import { CURRENT_TOOLBAR_VIEW } from '../../constants/Types.ts';
import { useImage } from 'react-konva-utils';
import ResizableImage from "./ResizableImage.tsx";
import ResizableText from "./ResizableText.tsx";
import ResizableShape from "./ResizableShape.js";
import { STAGE_DIMENSIONS } from '../../constants/Image.js';
import ResizableRectangle from "./shapes/ResizableRectangle.tsx";
import ResizablePolygon from "./shapes/ResizablePolygon.tsx";
import ResizableCircle from "./shapes/ResizableCircle.tsx";

const IMAGE_BASE = `${process.env.REACT_APP_PROCESSOR_API}`;

const SMSCanvas = forwardRef((props: any, ref: any) => {

  const { sessionDetails, activeItemList, currentView, editBrushWidth, maskGroupRef ,
    editMasklines, setEditMaskLines, currentCanvasAction
  } = props;
  const [showMask, setShowMask] = useState(false);
  const [mask, setMask] = useState(null);

  const [isPainting, setIsPainting] = useState(false);
  const imageSrc = `${IMAGE_BASE}/generations/${sessionDetails?.activeSelectedImage}`;
  const [image, status] = useImage(imageSrc, 'anonymous');
  const [selectedId, selectImage] = useState(null);

  useEffect(() => {
    if (currentCanvasAction === 'MOVE') {
      const stage = ref.current.getStage();
      const container = stage.container();
      container.style.cursor = 'grab';
    } else if (currentCanvasAction === 'RESIZE') {
      const stage = ref.current.getStage();
      const container = stage.container();
      container.style.cursor = 'nwse-resize';
    } else {
      const stage = ref.current.getStage();
      const container = stage.container();
      container.style.cursor = 'default';
    }
  }, [currentCanvasAction]);

  const handleStageClick = (e) => {
    // if (selectedId === null) return;

    // const clickedOnEmpty = e.target === e.target.getStage();
    // const isSelectedItem = e.target.attrs.id === selectedId || (e.target.getParent() && e.target.getParent().attrs.id === selectedId);
  
    // // If the click is on an empty stage area or not on the selected item or its transformer
    // if (clickedOnEmpty || !isSelectedItem) {
    //   selectImage(null); // Deselect any selected image
    // }
  };


  useEffect(() => {
    const stage = ref.current.getStage(); // Assuming `ref` is the ref to your Stage component
  
    const checkIfClickedOutside = (e) => {
      // Get the clicked shape or the stage
      const clickedShape = e.target;
      // Check if the clicked shape is part of the stage but not part of the selected group/item
      const isOutside = clickedShape === stage || // Click on empty stage
                        (selectedId && !clickedShape.findAncestor(`#${selectedId}`)); // No ancestor with selectedId
  
      if (isOutside) {
        selectImage(null); // Deselect any selected image
      }
    };
  
    // Add event listener to the Konva stage
    stage.on('click tap', checkIfClickedOutside);
  
    // Remove event listener on cleanup
    return () => {
      stage.off('click tap', checkIfClickedOutside);
    };
  }, [selectedId, ref]);




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
    } else {
      setEditMaskLines([]);

      const stage = ref.current.getStage();
      const container = stage.container();
      container.style.cursor = 'default';

    }
  }, [currentView]);



  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // This function will be triggered by any click on the webpage.
      if (!document.getElementById('samsar-konva-stage').contains(e.target)) {
        // If the clicked element is not part of the Konva stage
        selectImage(null);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener('click', checkIfClickedOutside);

    // Remove event listener on cleanup
    return () => {
      document.removeEventListener('click', checkIfClickedOutside);
    };
  }, []);

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
            key={`group_image_${item.id}`}
            id={`group_image_${item.id}`}
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
            key={`group_text_${item.id}`}
            id={`group_text_${item.id}`}
            text={item.text}
            config={item.config} 
            isSelected={selectedId === item.id}
            onSelect={() => selectImage(item.id)}
            onUnselect={() => selectImage(null)}
          />
        )
      } else if (item.type === 'shape') {
        if (item.shape === 'circle') {
          return <ResizableCircle {...item}
          key={`group_circle_${item.id}`}
          isSelected={selectedId === item.id}
          onSelect={() => setItemAsSelected(item.id)}
          onUnselect={() => selectImage(null)}
        />
        } else if (item.shape === 'rectangle') {
          return <ResizableRectangle config={item.config} {...item}
          key={`group_rectangle_${item.id}`}
          isSelected={selectedId === item.id}
          onSelect={() => setItemAsSelected(item.id)}
          onUnselect={() => selectImage(null)}
          />
        } else {
          return <ResizablePolygon {...item}
          key={`group_polygon_${item.id}`}
          isSelected={selectedId === item.id}
          onSelect={() => setItemAsSelected(item.id)}
          onUnselect={() => selectImage(null)}
           />
        }
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
    setEditMaskLines([...editMasklines, { points, stroke: 'white', strokeWidth: editBrushWidth }]);
  };


  const handleLayerMouseMove = (e) => {
    if (!isPainting || editMasklines.length === 0) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = editMasklines[editMasklines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    setEditMaskLines(editMasklines.slice(0, -1).concat(lastLine));
  };

  const handleLayerMouseUp = () => {
    setIsPainting(false);
  };

  return (
    <div className={`m-auto bg-stone-400 pt-8 pb-8  shadow-lg  `}>
      <Stage
        width={STAGE_DIMENSIONS.width}
        height={STAGE_DIMENSIONS.height}
        ref={ref}
        onClick={handleStageClick}
        id="samsar-konva-stage"  

      >
        <Layer
          onMouseDown={handleLayerMouseDown}
          onMousemove={handleLayerMouseMove}
          onMouseup={handleLayerMouseUp}
        >
          <Group id="baseGroup">
            {imageStackList}
          </Group>

          {showMask && (
            <Group id="maskGroup">
              {editMasklines.map((line, i) => (
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