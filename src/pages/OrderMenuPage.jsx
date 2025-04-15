import { MenuContext } from '@/contexts/menuContext'
import { SpeechContext } from '@/contexts/speechContext'
import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'

export const OrderMenuPage = () => {

const {createOrderMenu} = useContext(MenuContext);
const responseOrderMenu = createOrderMenu();
const { translateText } = useContext(SpeechContext);
const [fromLang, setFromLang] = useState("en");
const [toLang, setToLang] = useState("zh-CN");
const [transcript, setTranscript] = useState("");
const [translated, setTranslated] = useState("");
const [isRecording, setIsRecording] = useState(false);

console.log(responseOrderMenu)

const startRecording = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = fromLang;
  recognition.interimResults = false;
  recognition.onresult = async (event) => {
    const spokenText = event.results[0][0].transcript;
    setTranscript(spokenText);
    const result = await translateText(spokenText, fromLang, toLang);
    setTranslated(result);
  };
  recognition.onerror = (e) => {
    console.error(e);
    alert("Speech recognition error");
  };
  recognition.start();
  setIsRecording(true);
};

  return (
    <div>
      <h2>Live Voice Translator</h2>
      <button onClick={startRecording}>
        {isRecording ? "🎤 Listening..." : "Start Recording"}
      </button>
      <div>
        <strong>You said:</strong> {transcript}
        <br />
        <strong>Translated:</strong> {translated}
      </div>
    </div>
  )
}
