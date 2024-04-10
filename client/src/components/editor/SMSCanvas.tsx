import React, { forwardRef, useRef, useEffect } from "react";
import { Stage, Layer, Star, Text, Image, Transformer } from 'react-konva';
import { useImage } from 'react-konva-utils';
const IMAGE_BASE = `${process.env.REACT_APP_PROCESSOR_API}`;

const STAGE_DIMENSIONS = {
  width: 1048,
  height: 1048,
}



const SMSCanvas = forwardRef((props: any, ref) => {
  const { sessionDetails } = props;
  const imageSrc = `${IMAGE_BASE}/generations/${sessionDetails?.activeSelectedImage}`;
  console.log(imageSrc);
  const [image, status] = useImage(imageSrc, 'anonymous');
  const [selectedId, selectImage] = React.useState(null);

  return (
    <div className="">

      <Stage width={STAGE_DIMENSIONS.width} height={STAGE_DIMENSIONS.height} ref={ref}>
        <Layer>
          {
            image &&

            <URLImage
              image={{ src: imageSrc }}
              x={20}
              y={20}
              isSelected={selectedId === 'unique-id'}
              onSelect={() => {
                selectImage('unique-id');
              }}
            />


          }

        </Layer>
      </Stage>

    </div>
  );
});



const URLImage = ({ image, isSelected, onSelect, ...props }) => {
  const [img] = useImage(image.src, "anonymous");
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
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
        onClick={onSelect}
        onTap={onSelect}
        draggable
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};


export default SMSCanvas;
