import React, { forwardRef } from "react";
import { Stage, Layer, Star, Text, Image } from 'react-konva';
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

  return (
    <div>

      <Stage width={STAGE_DIMENSIONS.width} height={STAGE_DIMENSIONS.height} ref={ref}>
        <Layer>


          {image &&
            <Image image={image}

              draggable={true}

            />}

        </Layer>
      </Stage>

    </div>
  );
});

export default SMSCanvas;
