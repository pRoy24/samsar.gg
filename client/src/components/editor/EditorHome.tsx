import React, { useEffect, useState, useRef } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';
import SMSCanvas from './SMSCanvas.tsx';
import EditorToolbar from './toolbar/EditorToolbar.tsx';
import { useParams } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext.js';
import axios from 'axios';
import { useAlertDialog } from '../../contexts/AlertDialogContext.js';
import SelectTemplate from './SelectTemplate.tsx';
import AttestationDialog from './utils/AttestationDialog.tsx';
import PublishDialog from './utils/PublishDialog.tsx';
import CommonContainer from '../common/CommonContainer.tsx';
import ActionToolbar from './toolbar/ActionToolbar.tsx';

import { CURRENT_TOOLBAR_VIEW , CANVAS_ACTION } from '../../constants/Types.ts';
import { STAGE_DIMENSIONS } from '../../constants/Image.js';
import { getHeaders } from '../../utils/web.js';

import './editor.css';

const PUBLISHER_URL = process.env.REACT_APP_PUBLISHER_URL;

const PROCESSOR_API_URL = process.env.REACT_APP_PROCESSOR_API;
const IPFS_URL_BASE = process.env.REACT_APP_IPFS_URL_BASE;

export default function EditorHome(props) {
  
  let { id } = useParams();

  const resetSession = () => {
    if (props.resetCurrentSession) {
      props.resetCurrentSession();
    }
  }

  if (!id) {
   id = props.id;
  }
  const [promptText, setPromptText] = useState("");
  const [selectedChain, setSelectedChain] = useState('');
  const [selectedAllocation, setSelectedAllocation] = useState(300);
  const [isTemplateSelectViewSelected, setIsTemplateSelectViewSelected] = useState(false);
  const [templateOptionList, setTemplateOptionList] = useState([]);
  const [activeItemList, setActiveItemList] = useState([]);

  const [editBrushWidth, setEditBrushWidth] = useState(5);
  const [editMasklines, setEditMaskLines] = useState([]);

  const [currentView, setCurrentView] = useState(CURRENT_TOOLBAR_VIEW.SHOW_DEFAULT_DISPLAY);

  const [selectedGenerationModel, setSelectedGenerationModel] = useState('SDXL');
  const [selectedEditModel, setSelectedEditModel] = useState('SDXL');
  const [ isGenerationPending , setIsGenerationPending ] = useState(false);
  const [ isOutpaintPending, setIsOutpaintPending ] = useState(false);
  const [ isPublicationPending, setIsPublicationPending ] = useState(false);

  const [ currentCanvasAction, setCurrentCanvasAction ] = useState(CANVAS_ACTION.DEFAULT);

  const [textConfig, setTextConfig] = useState({
    fontSize: 40,
    fontFamily: 'Times New Roman',
    fillColor: '#000000'
  });

  const setCurrentViewDisplay = (view) => {
    console.log("Setting Current View:", view);
    setCurrentView(view);
  }

  const [nftData, setNftData] = useState({
    name: "",
    description: "",
    external_url: "",
    image: "",
    attributes: []
  });


  const { openAlertDialog, } = useAlertDialog();
  const { user } = useUser();

  const [sessionDetails, setSessionDetails] = useState({});
  const [showMask, setShowMask] = useState(false);

  const canvasRef = useRef(null);
  const maskGroupRef = useRef(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`${PROCESSOR_API_URL}/sessions/details?id=${id}`).then((response) => {


      const activeSelectedImageName = response.data.activeSelectedImage;
      if (activeSelectedImageName) {
        const activeSelectedImageURL = `${PROCESSOR_API_URL}/intermediates/${activeSelectedImageName}`;
        const nImageList: any = Object.assign([], activeItemList);
        nImageList.push({ src: activeSelectedImageURL, id: nImageList.length, type: 'image' });

        setActiveItemList(nImageList);
      } else {
        const nImageList: any = Object.assign([], activeItemList);
        if (nImageList.length === 0) {
          nImageList.push({ id: `base_rect`, type: 'shape', shape: 'rectangle', config: { x: 0, y: 0, width: STAGE_DIMENSIONS.width, height: STAGE_DIMENSIONS.height, fill: 'white' } });
          setActiveItemList(nImageList);
        }
      }

      setSessionDetails(response.data);
    }).catch((error) => {

    });

  }, []);


  const resetCurrentView = () => {
    setCurrentView(CURRENT_TOOLBAR_VIEW.SHOW_DEFAULT_DISPLAY);
  }

  const prevLengthRef = useRef(activeItemList.length);

  useEffect(() => {
    // Get the current length of activeItemList
    const currentLength = activeItemList.length;

    // Check if previous length is not equal to current length
    if (prevLengthRef.current !== currentLength) {
   
      setTimeout(() => {
        saveIntermediateImage();
      }, 5000);
    
    }

    // Update the ref with the new length for the next render
    prevLengthRef.current = currentLength;
  }, [activeItemList.length]);  



  useEffect(() => {
    if (user && id) {
      axios.post(`${PROCESSOR_API_URL}/sessions/get_or_create_session`, {
        userId: user._id.toString(),
        sessionId: id
      }).then((response) => {
        console.log(response);
      }).catch((error) => {
        console.log(error);
      });
    }
  }, [user, id]);

  const updateNFTData = (value) => {
    let newNftData = Object.assign({}, nftData, value);
    setNftData(newNftData);
  }



  const submitGenerateRequest = async () => {
    const payload = {
      prompt: promptText,
      sessionId: id,
      model: selectedGenerationModel,
    }

    const generateStatus = await axios.post(`${PROCESSOR_API_URL}/sessions/request_generate`, payload);
    startGenerationPoll();
  }


  const submitOutpaintRequest = async (evt) => {
    evt.preventDefault();

    

    const baseImageData = await exportBaseGroup();
    let maskImageData;
    if (selectedEditModel === 'SDXL') {
      maskImageData = await exportMaskGroupAsColored();
    } else {
      maskImageData = await exportMaskGroupAsTransparent();
    }


    const formData = new FormData(evt.target);
    const promptText = formData.get('promptText');
    const guidanceScale = formData.get('guidanceScale');
    const numInferenceSteps = formData.get('numInferenceSteps');
    const strength = formData.get('strength');

    const payload = {
      image: baseImageData,
      maskImage: maskImageData,
      sessionId: id,
      prompt: promptText,
      model: selectedEditModel,
      guidanceScale: guidanceScale,
      numInferenceSteps: numInferenceSteps,
      strength: strength

    }
    console.log(payload);
    console.log("EE TEEEEEE");
    
    const outpaintStatus = await axios.post(`${PROCESSOR_API_URL}/sessions/request_outpaint`, payload);
    startOutpaintPoll();
  }


  const exportBaseGroup = () => {
    const baseStage: any = canvasRef.current;
    const baseLayer = baseStage.getLayers()[0];
    const baseGroup = baseLayer.children.find((child) => child.attrs && child.attrs.id === 'baseGroup');

    // Ensure the group is found
    if (baseGroup) {
      const dataUrl = baseGroup.toDataURL({
        width: STAGE_DIMENSIONS.width,
        height: STAGE_DIMENSIONS.height,
        pixelRatio: 1 // Ensures that the output resolution is not scaled; adjust as needed for high DPI displays
      });
      return dataUrl;
    } else {
      console.error('Base group not found');
      return null;
    }
  };


  const exportMaskGroupAsColored = async () => {
    const baseStage = canvasRef.current;
    const baseLayer = baseStage.getLayers()[0];
    const maskGroup = baseLayer.children.find((child) => child.attrs && child.attrs.id === 'maskGroup');

    if (maskGroup) {
      // Create an offscreen canvas
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = baseStage.width();
      offscreenCanvas.height = baseStage.height();
      const ctx = offscreenCanvas.getContext('2d');

      // Initially fill the canvas with black
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

      // Set the fill style for the mask to white
      ctx.fillStyle = 'white';

      // Draw each mask shape in white
      maskGroup.children.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.points()[0], line.points()[1]);
        for (let i = 2; i < line.points().length; i += 2) {
          ctx.lineTo(line.points()[i], line.points()[i + 1]);
        }
        ctx.closePath();  // Ensures the shape is closed for filling
        ctx.fill();
      });

      // Convert offscreen canvas to data URL
      const dataUrl = offscreenCanvas.toDataURL('image/png', 1); // Ensure full quality
      console.log(dataUrl);  // Use as needed
      return dataUrl;
    } else {
      console.error('Mask group not found');
      return null;
    }
  };

  const exportMaskGroupAsTransparent = async () => {
    const baseStage: any = canvasRef.current;
    const baseLayer = baseStage.getLayers()[0];
    const maskGroup = baseLayer.children.find((child) => child.attrs && child.attrs.id === 'maskGroup');

    if (maskGroup) {

      // Create an offscreen canvas
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = baseStage.width();
      offscreenCanvas.height = baseStage.height();
      const ctx = offscreenCanvas.getContext('2d');

      // Fill canvas with white
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

      // Use destination-out to make lines transparent
      ctx.globalCompositeOperation = 'destination-out';

      // Draw each line in the maskGroup onto the offscreen canvas
      maskGroup.children.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.points()[0], line.points()[1]);
        for (let i = 2; i < line.points().length; i += 2) {
          ctx.lineTo(line.points()[i], line.points()[i + 1]);
        }
        ctx.strokeStyle = 'rgba(0,0,0,1)';  // Fully opaque black
        ctx.lineWidth = line.strokeWidth();
        ctx.stroke();
      });

      // Reset globalCompositeOperation to default
      ctx.globalCompositeOperation = 'source-over';

      // Convert offscreen canvas to data URL
      const dataUrl = offscreenCanvas.toDataURL();
      console.log(dataUrl);  // Use as needed
      return dataUrl;
    } else {
      console.error('Mask group not found');
      return null;
    }
  };

  async function startGenerationPoll() {
    setIsGenerationPending(true);
    const pollStatus = await axios.get(`${PROCESSOR_API_URL}/sessions/generate_status?id=${id}`);

    if (pollStatus.data.generationStatus === 'COMPLETED') {

      const generatedImageUrlName = pollStatus.data.activeGeneratedImage;
      const generatedURL = `${PROCESSOR_API_URL}/generations/${generatedImageUrlName}`;
      const nImageList: any = Object.assign([], activeItemList);
      nImageList.push({ src: generatedURL, id: nImageList.length, type: 'image' });

      setActiveItemList(nImageList);
      setSessionDetails(pollStatus.data);
      setIsGenerationPending(false);
     // saveIntermediateImage();
      return;
    } else {
      setTimeout(() => {
        startGenerationPoll();
      }, 1000);
    }

  }

  async function startOutpaintPoll() {
    setIsOutpaintPending(true);

    const pollStatus = await axios.get(`${PROCESSOR_API_URL}/sessions/generate_status?id=${id}`);

    const pollStatusData = pollStatus.data;

    if (pollStatus.data.outpaintStatus === 'COMPLETED') {
      const generatedImageUrlName = pollStatus.data.activeOutpaintedImage;
      const generatedURL = `${PROCESSOR_API_URL}/generations/${generatedImageUrlName}`;

      const nImageList: any = Object.assign([], activeItemList);
      const currentItemId = nImageList.length;
      nImageList.push({ src: generatedURL, id: currentItemId, type: 'image' });

      setCurrentView(CURRENT_TOOLBAR_VIEW.SHOW_DEFAULT_DISPLAY);

      setActiveItemList(nImageList);
      setSessionDetails(pollStatus.data);
      setIsOutpaintPending(false);
    //  saveIntermediateImage();
      return;
    } else {
      setTimeout(() => {
        startOutpaintPoll();
      }, 1000);
    }

  }

  const showTemplatesSelect = () => {
    setIsTemplateSelectViewSelected(!isTemplateSelectViewSelected);

  }

  const onPublishDialog = (formData) => {

    setIsPublicationPending(true);

    const nftData = {
      name: formData.get('nftName'),
      description: formData.get("nftDescription"),
      attributes: []
    }

    const creatorAllocation = formData.get("creatorAllocation");
    const selectedChain = process.env.REACT_APP_SELECTED_CHAIN;

    if (canvasRef.current) {
      const canvasInstance = canvasRef.current;
      const dataURL = canvasInstance.toDataURL();

      let sessionPayload: any = {
        image: dataURL,
        sessionId: id
      }
      if (nftData) {
        sessionPayload = Object.assign(sessionPayload, { nft: nftData });
      }
      const headers = getHeaders();
      sessionPayload.selectedChain = parseInt(selectedChain);
      sessionPayload.creatorAllocation = creatorAllocation;
      sessionPayload.creatorHandle = user.username;

      axios.post(`${PROCESSOR_API_URL}/sessions/publish_and_set_uri`, sessionPayload, headers).then(function (dataResponse) {
        const publicationResponse = dataResponse.data;
        const publicationId = publicationResponse.slug;
        setIsPublicationPending(false);
        resetSession();

        window.location.href = `${PUBLISHER_URL}/p/${publicationId}`;

      }).catch(function(err) {
        console.log(err);
        setIsPublicationPending(false);
      });
    }
  }

  const showAttestationDialog = () => {
    const publishDialog = <PublishDialog onSubmit={onPublishDialog}
    selectedChain={selectedChain}
    setSelectedChain={setSelectedChain}
  />
  openAlertDialog(publishDialog);


  }

  const showPublishDialg = () => {
    const publishDialog = <PublishDialog onSubmit={onPublishDialog}
      selectedChain={selectedChain}
      setSelectedChain={setSelectedChain}
      isPublicationPending={isPublicationPending}
    />
    openAlertDialog(publishDialog);
  }

  const getRemoteTemplateData = (page) => {
    axios.get(`${PROCESSOR_API_URL}/utils/template_list?page=${page}`).then((response) => {

      const generatedImageUrlName = response.data.activeGeneratedImage;
      const generatedURL =
        setTemplateOptionList(response.data);
    });
  }

  const saveIntermediateImage = () => {
    if (canvasRef.current) {
      const canvasInstance = canvasRef.current;
      const dataURL = canvasInstance.toDataURL();
      const headers = getHeaders();
      const sessionPayload = {
        image: dataURL,
        sessionId: id
      }
      axios.post(`${PROCESSOR_API_URL}/sessions/save_intermediate`, sessionPayload, headers).then(function (dataResponse) {
        console.log(dataResponse);
      });
    }
  }

  const addImageToCanvas = (templateOption) => {

    const templateURL = `${PROCESSOR_API_URL}/templates/mm_final/${templateOption}`;

    const nImageList: any = Object.assign([], activeItemList);
    const currentItemId = nImageList.length;
    nImageList.push({ src: templateURL, id: nImageList.length, type: 'image',  });
    setActiveItemList(nImageList);
    setCurrentView(CURRENT_TOOLBAR_VIEW.SHOW_DEFAULT_DISPLAY);
  }

  const addTextBoxToCanvas = (payload) => {
    const nImageList: any = Object.assign([], activeItemList);
    const currentItemId = nImageList.length;
    payload.id = currentItemId;
    nImageList.push(payload);
    setActiveItemList(nImageList);
  }

  const setCurrentAction = (currentAction) => {
    console.log("Setting Current Action:", currentAction);
    setCurrentCanvasAction(currentAction);
    
  }

  const showMoveAction = () => {
    console.log("Showing Move Action");
  }

  const showResizeAction = () => {
    console.log("Showing Resize Action");
  }

  const showSaveAction = () => {
    saveIntermediateImage();
  }

  const showUploadAction = () => {

   //  showPublishDialg();
  }

  const setSelectedShape = (shapeKey) => {

    let currentLayerList: any = Object.assign([], activeItemList);

    const shapeConfig = { x: 512, y: 200, width: 200, height: 200, fill: 'white', radius: 70 }

    currentLayerList.push({
      'type': 'shape',
      'shape': shapeKey,
      'config': shapeConfig,
      'id': currentLayerList.length
    });

    setActiveItemList(currentLayerList);

  }

  let viewDisplay = <span />;

  if (currentView === CURRENT_TOOLBAR_VIEW.SHOW_TEMPLATES_DISPLAY) {
    viewDisplay = (
      <SelectTemplate getRemoteTemplateData={getRemoteTemplateData}
        templateOptionList={templateOptionList} addImageToCanvas={addImageToCanvas} 
        resetCurrentView={resetCurrentView}
        />
    )
  } else {
    viewDisplay = (
      <SMSCanvas ref={canvasRef}
        maskGroupRef={maskGroupRef}
        sessionDetails={sessionDetails}
        activeItemList={activeItemList}
        editBrushWidth={editBrushWidth}
        currentView={currentView}
        editMasklines={editMasklines}
        setEditMaskLines={setEditMaskLines}
        currentCanvasAction={currentCanvasAction}
      />
    )
  }
  return (
    <CommonContainer resetSession={resetSession}>
      <div className='m-auto'>
        <div className='block'>
          <div className='w-[6%] '>
            <ActionToolbar
              setCurrentAction={setCurrentAction}
              setCurrentViewDisplay={setCurrentViewDisplay}
              showMoveAction={showMoveAction}
              showResizeAction={showResizeAction}
              showSaveAction={showSaveAction}
              showUploadAction={showUploadAction}
            />
          </div>
          <div className='text-center w-[78%] inline-block h-[100vh] overflow-scroll m-auto p-4 mb-8 '>
            {viewDisplay}
          </div>
          <div className='w-[16%] inline-block  '>
            <EditorToolbar promptText={promptText} setPromptText={setPromptText}
              submitGenerateRequest={submitGenerateRequest}
              submitOutpaintRequest={submitOutpaintRequest}
              saveIntermediateImage={saveIntermediateImage}
              showAttestationDialog={showAttestationDialog} sessionDetails={sessionDetails}
              updateNFTData={updateNFTData}
              setNftData={setNftData}
              nftData={nftData}
              selectedChain={selectedChain}
              setSelectedChain={setSelectedChain}
              selectedAllocation={selectedAllocation}
              setSelectedAllocation={setSelectedAllocation}
              showTemplatesSelect={showTemplatesSelect}
              addTextBoxToCanvas={addTextBoxToCanvas}
              showMask={showMask}
              setShowMask={setShowMask}
              editBrushWidth={editBrushWidth}
              setEditBrushWidth={setEditBrushWidth}
              setCurrentViewDisplay={setCurrentViewDisplay}
              currentViewDisplay={currentView}
              textConfig={textConfig}
              setTextConfig={setTextConfig}
              activeItemList={activeItemList}
              setActiveItemList={setActiveItemList}
              selectedGenerationModel={selectedGenerationModel}
              setSelectedGenerationModel={setSelectedGenerationModel}
              selectedEditModel={selectedEditModel}
              setSelectedEditModel={setSelectedEditModel}
              isGenerationPending={isGenerationPending}
              isOutpaintPending={isOutpaintPending}
              isPublicationPending={isPublicationPending}
              setSelectedShape={setSelectedShape}


            />
          </div>
        </div>
      </div>
    </CommonContainer>
  )
}
