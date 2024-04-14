import React, { useEffect, useState, useRef } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';
import SMSCanvas from './SMSCanvas.tsx';
import EditorToolbar from './EditorToolbar.tsx';
import { useParams } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext.js';
import axios from 'axios';
import { useAlertDialog } from '../../contexts/AlertDialogContext.js';
const PUBLISHER_URL = process.env.REACT_APP_PUBLISHER_URL;

const PROCESSOR_API_URL = process.env.REACT_APP_PROCESSOR_API;


export default function EditorHome() {
  const { id } = useParams();
  const [promptText, setPromptText] = useState("");
  const [selectedChain, setSelectedChain] = useState('');
  const [ selectedAllocation , setSelectedAllocation ] = useState(300);

  const [ nftData, setNftData ] = useState({
    name: "",
    description: "",
    external_url: "",
    image: "",
    attributes: []
  });


  const [ chainList, setChainList ] = useState([]);
  const { openAlertDialog, } = useAlertDialog();
  const { user } = useUser();

  const [sessionDetails, setSessionDetails] = useState({});
  const canvasRef = useRef(null);


  useEffect(() => {
    axios.get(`${PROCESSOR_API_URL}/sessions/details?id=${id}`).then((response) => {
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
    if (user.attestationId) {

    } else {
  
      const payload = {
        sessionId: id,
        fid: user.fid.toString(),
      };

      axios.post(`${PROCESSOR_API_URL}/sessions/create_attestation`, payload).then((response) => {


      }).catch((error) => {

      });
    }


  }

  const showAttestationDialog = () => {


    if (sessionDetails.attestationId) {
      publishCanvasAndSetURI();
    } else {
      const componentData = (
        <div className='font-white'>
          <div className='text-center'>
            <h1 className='text-2xl'>Attestation</h1>
            <p className='text-sm'>Please attest that the generated image is not inappropriate</p>
            <button onClick={submitAttestation} className='bg-white-100'>
              Create Attestation
            </button>
          </div>
        </div>
      )

      openAlertDialog(componentData, onAttestationDialogClose);

    }

  }

  const publishCanvasAndSetURI = () => {

    if (canvasRef.current) {
      const canvasInstance = canvasRef.current;
      const dataURL = canvasInstance.toDataURL();
 
      let sessionPayload: any = {
        image: dataURL,
        sessionId: id
      }
      if (nftData) {
        sessionPayload = Object.assign(sessionPayload, {nft: nftData});
      }

      sessionPayload.selectedChain = selectedChain;
      sessionPayload.creatorAllocation = selectedAllocation;

      console.log(sessionPayload);

      axios.post(`${PROCESSOR_API_URL}/sessions/publish_and_set_uri`, sessionPayload).then(function (dataResponse) {
        console.log(dataResponse);
        const publicationResponse = dataResponse.data;
        const publicationId = publicationResponse._id;
        window.location.href = `${PUBLISHER_URL}/p/${publicationId}`;

      })


    }

  }

  const publishCanvas = () => {


    if (canvasRef.current) {
      const canvasInstance = canvasRef.current;
      const dataURL = canvasInstance.toDataURL();


      const sessionPayload = {
        image: dataURL,
        sessionId: id
      }
      axios.post(`${PROCESSOR_API_URL}/sessions/publish`, sessionPayload).then(function (dataResponse) {
        console.log(dataResponse);

      })


    }
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


  return (
    <div className='m-auto'>


      <div className='flex '>
        <div className='text-center w-[85%] inline-flex h-[100vh] overflow-scroll'>

          <SMSCanvas ref={canvasRef} sessionDetails={sessionDetails} />

        </div>

        <div className='w-[15%] inline-flex bg-green-500 '>
          <EditorToolbar promptText={promptText} setPromptText={setPromptText}
            submitGenerateRequest={submitGenerateRequest}
            publishCanvas={publishCanvas} saveIntermediateImage={saveIntermediateImage}
            showAttestationDialog={showAttestationDialog} sessionDetails={sessionDetails}
            updateNFTData={updateNFTData}
            setNftData={setNftData}
            nftData={nftData}
            chainList={chainList}
            selectedChain={selectedChain}
            setSelectedChain={setSelectedChain}
            selectedAllocation={selectedAllocation}
            setSelectedAllocation={setSelectedAllocation}
          />
        </div>
      </div>





    </div>
  )
}