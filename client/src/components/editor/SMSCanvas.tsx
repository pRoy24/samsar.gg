import React, { forwardRef, useRef, useEffect , useState} from "react";
import { Stage, Layer, Star, Text, Image, Transformer } from 'react-konva';
import { useImage } from 'react-konva-utils';
import ResizableImage from "./ResizableImage.tsx";
import ResizableText from "./ResizableText.tsx";
const IMAGE_BASE = `${process.env.REACT_APP_PROCESSOR_API}`;

const STAGE_DIMENSIONS = {
  width: 1080,
  height: 1080,
}



const SMSCanvas = forwardRef((props: any, ref: any) => {
  const { sessionDetails, activeItemList } = props;
  const imageSrc = `${IMAGE_BASE}/generations/${sessionDetails?.activeSelectedImage}`;
  const [image, status] = useImage(imageSrc, 'anonymous');
  const [selectedId, selectImage] = useState(null);

  const handleStageClick = (e) => {
    // Check if the click is on empty stage area
    if (e.target === e.target.getStage()) {
      selectImage(null); // Deselect any selected image
    }
  };

  let imageStackList = <span />;
  if (activeItemList && activeItemList.length > 0) {
    imageStackList = activeItemList.map(function(item, index){
      if (item.type === 'image') {
        return (
          <ResizableImage
          key={index}
          image={item}
          isSelected={selectedId === item.id}
          onSelect={() => selectImage(item.id)}
          onUnselect={() => selectImage(null)}
        />
        )
      } else if (item.type === 'text') {
        console.log("INVOKE THE TEXT");
        console.log(item);
        
        return (
          <ResizableText 
          key={index}
          text={item.text}
          isSelected={selectedId === item.id}
          onSelect={() => selectImage(item.id)}
          onUnselect={() => selectImage(null)}
          />
        )
      }
    }).filter(Boolean);
  }

  return (
    <div className="m-auto">
      <Stage
        width={STAGE_DIMENSIONS.width}
        height={STAGE_DIMENSIONS.height}
        ref={ref}
        onMouseDown={handleStageClick}  // Listen for mouse down events on the stage
      >
        <Layer>
          {imageStackList}

        </Layer>
      </Stage>
    </div>
  );
});

export default SMSCanvas;