import React, { forwardRef, useRef, useEffect, useState } from "react";
import { Stage, Layer, Group, Line } from 'react-konva';
import { CURRENT_TOOLBAR_VIEW } from '../../constants/Types.ts';
import { useImage } from 'react-konva-utils';
import ResizableImage from "./ResizableImage.tsx";
import ResizableText from "./ResizableText.tsx";
import { STAGE_DIMENSIONS } from '../../constants/Image.js';
import ResizableRectangle from "./shapes/ResizableRectangle.tsx";
import ResizablePolygon from "./shapes/ResizablePolygon.tsx";
import ResizableCircle from "./shapes/ResizableCircle.tsx";
import { useColorMode } from '../../contexts/ColorMode.js';
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";

const IMAGE_BASE = `${process.env.REACT_APP_PROCESSOR_API}`;

const SMSCanvas = forwardRef((props: any, ref: any) => {
  const { sessionDetails, activeItemList, setActiveItemList, currentView, editBrushWidth, maskGroupRef,
    editMasklines, setEditMaskLines, currentCanvasAction,
    setSelectedId, selectedId,  buttonPositions, setButtonPositions,
  } = props;
  const [showMask, setShowMask] = useState(false);
  const [mask, setMask] = useState(null);

  const [isPainting, setIsPainting] = useState(false);
  const imageSrc = `${IMAGE_BASE}/generations/${sessionDetails?.activeSelectedImage}`;
  const [image, status] = useImage(imageSrc, 'anonymous');



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

  const handleLayerClick = (e) => {

    const clickedItem = e.target.attrs.id || e.target.getParent().attrs.id;

    console.log(clickedItem);

    if (clickedItem ) {
      setSelectedId(clickedItem);
    } else {
      setSelectedId(null);
    }
  };

  console.log(selectedId);

  useEffect(() => {

    const stage = ref.current.getStage();
    const positions = activeItemList.map(item => {
      const itemId = item.id.toString();
      const node = stage.findOne(`#${itemId}`);
      if (node) {
        const absPos = node.getClientRect({
          skipTransform: false,
          skipShadow: false,
          skipStroke: false,
        });

        return { id: item.id, x: absPos.x + 30, y: absPos.y + 30 };
      }
      return null;
    }).filter(Boolean);
    setButtonPositions(positions);
  }, [activeItemList, ref, selectedId]);

  useEffect(() => {
    const stage = ref.current.getStage();
    // stage.on('click tap', handleLayerClick);
    // return () => {
    //   stage.off('click tap', handleLayerClick);
    // };
  }, [selectedId, ref]);

  const selectLayer = (item) => {
    if (item.config && !item.config.fixed) {
      setSelectedId(item.id);
    }
  }
  const setItemAsSelected = (itemId) => {
    setSelectedId(itemId);
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

      if (!document.getElementById('samsar-konva-stage').contains(e.target)) {
       // setSelectedId(null);
      }
    };

    document.addEventListener('click', checkIfClickedOutside);
    return () => {
      document.removeEventListener('click', checkIfClickedOutside);
    };
  }, []);

  if (currentView === CURRENT_TOOLBAR_VIEW.SHOW_EDIT_MASK_DISPLAY) {
    const stage = ref.current.getStage();
    const container = stage.container();
    container.style.cursor = generateCursor(editBrushWidth);
  }

  const moveItem = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= activeItemList.length) {
      return; // Out of bounds, do nothing
    }
  
    const newList = [...activeItemList];
    const [item] = newList.splice(index, 1);
    newList.splice(newIndex, 0, item);
    setActiveItemList(newList);
  };
  

  let imageStackList = <span />;

  if (activeItemList && activeItemList.length > 0) {
    imageStackList = activeItemList.map((item, index) => {
      if (item.type === 'image') {
        return (
          <Group key={`group_image_${item.id}`} id={item.id}>
            <ResizableImage
              {...item}
              image={item}
              isSelected={selectedId === item.id}
              onSelect={() => setItemAsSelected(item.id)}
              onUnselect={() => setSelectedId(null)}
              showMask={showMask}
            />
          </Group>
        );
      } else if (item.type === 'text') {
        return (
          <Group key={`group_text_${item.id}`} id={item.id}>
            <ResizableText
              {...item}
              isSelected={selectedId === item.id}
              onSelect={() => setSelectedId(item.id)}
              onUnselect={() => setSelectedId(null)}
            />
          </Group>
        );
      } else if (item.type === 'shape') {
        if (item.shape === 'circle') {
          return (
            <Group key={`group_circle_${item.id}`} id={item.id}>
              <ResizableCircle
                {...item}
                isSelected={selectedId === item.id}
                onSelect={() => selectLayer(item)}
                onUnselect={() => setSelectedId(null)}
              />
            </Group>
          );
        } else if (item.shape === 'rectangle') {
          return (
            <Group key={`group_rectangle_${item.id}`} id={item.id}>
              <ResizableRectangle
                config={item.config}
                {...item}
                isSelected={selectedId === item.id}
                onSelect={() => selectLayer(item)}
                onUnselect={() => setSelectedId(null)}
              />
            </Group>
          );
        } else {
          return (
            <Group key={`group_polygon_${item.id}`} id={item.id}>
              <ResizablePolygon
                {...item}
                isSelected={selectedId === item.id}
                onSelect={() => selectLayer(item)}
                onUnselect={() => setSelectedId(null)}
              />
            </Group>
          );
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

  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'dark' ? `bg-gray-900` : `bg-neutral-300`;

  return (
    <div className={`m-auto relative ${bgColor} pb-8 shadow-lg pt-[60px]`}>
      <Stage
        width={STAGE_DIMENSIONS.width}
        height={STAGE_DIMENSIONS.height}
        ref={ref}
        onClick={handleLayerClick}
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
      {buttonPositions.map((pos, index) => {
        console.log(selectedId);
        if (!selectedId || (selectedId && pos.id && ((selectedId !== pos.id) || (selectedId === 0 )))) return null; // Show buttons only for the selected item

        return (
          <div key={pos.id} style={{
            position: 'absolute', left: pos.x, top: pos.y, background: "#030712",
            width: "100px", borderRadius: "5px", padding: "5px", display: "flex", justifyContent: "center",
            zIndex: 1000
          }}>
            <button onClick={() => moveItem(index, -1)}>
              <FaChevronCircleDown className="text-white" />
            </button>
            <button onClick={() => moveItem(index, 1)} style={{ marginLeft: '10px' }}>
              <FaChevronCircleUp className="text-white" />
            </button>
          </div>
        );
      })}
    </div>
  );
});

export default SMSCanvas;
