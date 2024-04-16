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

const PUBLISHER_URL = process.env.REACT_APP_PUBLISHER_URL;

const PROCESSOR_API_URL = process.env.REACT_APP_PROCESSOR_API;
const IPFS_URL_BASE = process.env.REACT_APP_IPFS_URL_BASE;


export default function EditorHome() {
  const { id } = useParams();
  const [promptText, setPromptText] = useState("");
  const [selectedChain, setSelectedChain] = useState('');
  const [selectedAllocation, setSelectedAllocation] = useState(300);
  const [isTemplateSelectViewSelected, setIsTemplateSelectViewSelected] = useState(false);
  const [templateOptionList, setTemplateOptionList] = useState([]);
  const [activeItemList, setActiveItemList] = useState([]);





  const [nftData, setNftData] = useState({
    name: "",
    description: "",
    external_url: "",
    image: "",
    attributes: []
  });


  const [chainList, setChainList] = useState([]);
  const { openAlertDialog, } = useAlertDialog();
  const { user } = useUser();

  const [sessionDetails, setSessionDetails] = useState({});
  const canvasRef = useRef(null);


  useEffect(() => {
    axios.get(`${PROCESSOR_API_URL}/sessions/details?id=${id}`).then((response) => {

      const activeSelectedImageName = response.data.activeSelectedImage;
      if (activeSelectedImageName) {
        const activeSelectedImageURL = `${PROCESSOR_API_URL}/intermediates/${activeSelectedImageName}`;
        const nImageList: any = Object.assign([], activeItemList);
        nImageList.push({ src: activeSelectedImageURL, id: nImageList.length, type: 'image'});

        setActiveItemList(nImageList);
      }

      setSessionDetails(response.data);
    }).catch((error) => {

    });

    // get list of available chains
    axios.get(`${PROCESSOR_API_URL}/utils/chain_list`).then((response) => {
      const chainList = response.data;
      console.log(chainList);
      setChainList(chainList);
      setSelectedChain(chainList[0].key);
    }).catch((error) => {

    });

  }, []);

  const updateNFTData = (value) => {
    let newNftData = Object.assign({}, nftData, value);
    setNftData(newNftData);
  }



  const submitGenerateRequest = async () => {
    const payload = {
      prompt: promptText,
      sessionId: id
    }
    const generateStatus = await axios.post(`${PROCESSOR_API_URL}/sessions/request_generate`, payload);
    startGenerationPoll();
  }

  async function startGenerationPoll() {
    const pollStatus = await axios.get(`${PROCESSOR_API_URL}/sessions/generate_status?id=${id}`);

    if (pollStatus.data.generationStatus === 'COMPLETED') {

      const generatedImageUrlName = pollStatus.data.activeGeneratedImage;
      const generatedURL = `${PROCESSOR_API_URL}/generations/${generatedImageUrlName}`;

   
      const nImageList: any = Object.assign([], activeItemList);
      nImageList.push({ src: generatedURL, id: nImageList.length, type: 'image' });

      setActiveItemList(nImageList);
      setSessionDetails(pollStatus.data);
      return;
    } else {
      setTimeout(() => {
        startGenerationPoll();
      }, 5000);


    }

  }

  const onAttestationDialogClose = () => {

  }
  const submitAttestation = () => {
    if (sessionDetails.attestationId) {

    } else {

      const payload = {
        sessionId: id,
        fid: user.fid.toString(),
      };

      axios.post(`${PROCESSOR_API_URL}/sessions/create_attestation`, payload).then((response) => {

        showPublishDialg();

      }).catch((error) => {

      });
    }
  }

  const showTemplatesSelect = () => {
    console.log("SHOWING TEMPLATE SELECT");

    setIsTemplateSelectViewSelected(!isTemplateSelectViewSelected);

  }

  const onPublishDialog = (formData) => {

    const nftData = {
      name: formData.get('nftName'),
      description: formData.get("nftDescription"),
      attributes: []
    }

    const creatorAllocation = formData.get("creatorAllocation");
    const selectedChain = formData.get("selectedChain");

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

      sessionPayload.selectedChain = parseInt(selectedChain);
      sessionPayload.creatorAllocation = creatorAllocation;

      console.log(sessionPayload);

      axios.post(`${PROCESSOR_API_URL}/sessions/publish_and_set_uri`, sessionPayload).then(function (dataResponse) {
        console.log(dataResponse);
        const publicationResponse = dataResponse.data;
        const publicationId = publicationResponse._id;
        window.location.href = `${PUBLISHER_URL}/p/${publicationId}`;

      })


    }


  }

  const showAttestationDialog = () => {
    if (sessionDetails.attestationId) {

     const publishDialog = <PublishDialog onSubmit={onPublishDialog}
     chainList={chainList} selectedChain={selectedChain} 
     setSelectedChain={setSelectedChain}
     />
     openAlertDialog(publishDialog);
    } else {
      const attestationDialog = <AttestationDialog onSubmit={submitAttestation} />
      openAlertDialog(attestationDialog, onAttestationDialogClose);

    }

  }

  const showPublishDialg = () => {
    const publishDialog = <PublishDialog onSubmit={onPublishDialog}
    chainList={chainList} selectedChain={selectedChain} 
    setSelectedChain={setSelectedChain}
    />
    openAlertDialog(publishDialog);
  }

  const getRemoteTemplateData = () => {
    console.log("getting remote data");
    axios.get(`${PROCESSOR_API_URL}/utils/template_list`).then((response) => {
      console.log(response.data);

      console.log("FINAL FINAL");
      const generatedImageUrlName = response.data.activeGeneratedImage;
      const generatedURL = 
      setTemplateOptionList(response.data);
    });
  }

  const saveIntermediateImage = () => {
    if (canvasRef.current) {
      const canvasInstance = canvasRef.current;
      const dataURL = canvasInstance.toDataURL();


      const sessionPayload = {
        image: dataURL,
        sessionId: id
      }
      axios.post(`${PROCESSOR_API_URL}/sessions/save_intermediate`, sessionPayload).then(function (dataResponse) {
        console.log(dataResponse);


      })


    }
  }

  const addImageToCanvas = (templateOption) => {

    const templateURL = `${IPFS_URL_BASE}/ipfs/${templateOption.ipfs_pin_hash}`;

    const nImageList: any = Object.assign([], activeItemList);
    nImageList.push({ src: templateURL, id: nImageList.length, type: 'image' });
    setActiveItemList(nImageList);
    setIsTemplateSelectViewSelected(false);
  }

  const addTextBoxToCanvas = (payload) => {
    const nImageList: any = Object.assign([], activeItemList);
    nImageList.push(payload);
    setActiveItemList(nImageList);

  }


  let viewDisplay = <span />;

  if (isTemplateSelectViewSelected) {
    viewDisplay = (
      <SelectTemplate getRemoteTemplateData={getRemoteTemplateData}
        templateOptionList={templateOptionList} addImageToCanvas={addImageToCanvas} />
    )
  } else {
    viewDisplay = (
      <SMSCanvas ref={canvasRef} sessionDetails={sessionDetails}
      activeItemList={activeItemList} />
    )
  }
  return (
    <div className='m-auto'>


      <div className='flex'>
        <div className='text-center w-[85%] inline-flex h-[100vh] overflow-scroll m-auto'>

          {viewDisplay}

        </div>

        <div className='w-[15%] inline-flex bg-green-500 '>
          <EditorToolbar promptText={promptText} setPromptText={setPromptText}
            submitGenerateRequest={submitGenerateRequest}
            saveIntermediateImage={saveIntermediateImage}
            showAttestationDialog={showAttestationDialog} sessionDetails={sessionDetails}
            updateNFTData={updateNFTData}
            setNftData={setNftData}
            nftData={nftData}
            chainList={chainList}
            selectedChain={selectedChain}
            setSelectedChain={setSelectedChain}
            selectedAllocation={selectedAllocation}
            setSelectedAllocation={setSelectedAllocation}
            showTemplatesSelect={showTemplatesSelect}
            addTextBoxToCanvas={addTextBoxToCanvas}
          />
        </div>
      </div>





    </div>
  )
}