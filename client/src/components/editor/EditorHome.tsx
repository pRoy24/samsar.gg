import React, { useEffect, useState , useRef } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';
import SMSCanvas from './SMSCanvas.tsx';
import EditorToolbar from './EditorToolbar.tsx';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PROCESSOR_API_URL = process.env.REACT_APP_PROCESSOR_API;


export default function EditorHome() {
  const { id } = useParams();
  const [promptText, setPromptText] = useState("");

  const [sessionDetails, setSessionDetails] = useState({});
  const canvasRef = useRef(null);


  useEffect(() => {
    axios.get(`${PROCESSOR_API_URL}/sessions/details?id=${id}`).then((response) => {
      console.log(response.data);
      setSessionDetails(response.data);
    }).catch((error) => {

    });

  }, []);



  const submitGenerateRequest = async () => {
    const payload = {
      prompt: promptText,
      sessionId: id
    }
    const generateStatus = await axios.post(`${PROCESSOR_API_URL}/sessions/request_generate`, payload);
    console.log(generateStatus);
    startGenerationPoll();
  }

  async function startGenerationPoll() {
    const pollStatus = await axios.get(`${PROCESSOR_API_URL}/sessions/generate_status?id=${id}`);
    console.log(pollStatus);

    if (pollStatus.data.generationStatus === 'COMPLETED') {
      console.log('Completed');
      setSessionDetails(pollStatus.data);
      return;
    } else {
      setTimeout(() => {
        startGenerationPoll();
      }, 5000);


    }

  }

  const publishCanvas = () => {
    if (canvasRef.current) {
      const canvasInstance = canvasRef.current;
      const dataURL = canvasInstance.toDataURL();
      console.log(dataURL);

      const sessionPayload = {
        image: dataURL,
        sessionId: id
      }
      axios.post(`${PROCESSOR_API_URL}/sessions/publish`, sessionPayload).then(function(dataResponse) {
        console.log(dataResponse);
      
      })
      

    }
  }


  return (
    <div>
      <div className="flex flex-row justify-center h-screen">
        <div className="basis-5/6">
          <SMSCanvas ref={canvasRef} sessionDetails={sessionDetails}/>

        </div>
        <div className='basis-1/6'>
          <EditorToolbar promptText={promptText} setPromptText={setPromptText}
           submitGenerateRequest={submitGenerateRequest}
           publishCanvas={publishCanvas} />
        </div>

      </div>

    </div>
  )
}