import { MenuContext } from '@/contexts/menuContext'
import { SpeechContext } from '@/contexts/speechContext'
import React, { useEffect } from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { useRef } from 'react'


//UI Components
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useParams } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const OrderMenuPage = () => {

const {createOrderMenu} = useContext(MenuContext);
const { translateText, googleTextToSpeech } = useContext(SpeechContext);
const {currentMenu, currentOrderMenu, handleGetOneMenu} = useContext(MenuContext);
const [fromLang, setFromLang] = useState("en");
const [toLang, setToLang] = useState("zh-CN");
const [transcript, setTranscript] = useState("");
const [translated, setTranslated] = useState("");
const [isRecording, setIsRecording] = useState(false);
const recognitionRef = useRef(null); 
const isStoppingRef = useRef(false); // Track if we’re already stopping
const [speakerRole, setSpeakerRole] = useState(null); // "customer" or "waiter"
const [conversation, setConversation] = useState([]);
const {menuId} = useParams()


useEffect(()=>{

async function loadOrderMenu(){
//Clear the conversation array when loading the page

setConversation([{
  role: "Customer",
  toLang: "Chinese",
  original: currentOrderMenu[0].orderTranslation,
  translated: currentOrderMenu[0].orderOriginal
}]);
//set languages for translation
handleGetOneMenu(menuId);
const languageFromCurrentMenu = currentMenu.language

console.log(languageFromCurrentMenu)
const languageMap = {
  "English": "en",
  "Chinese": "zh-CN",
  "Japanese": "ja",
  "Korean": "ko",
};
const languageCode = languageMap[languageFromCurrentMenu]
setToLang(languageCode)
console.log("this is the current language code for target", languageCode)
}
loadOrderMenu()
},[currentOrderMenu])

// Start Recording Function
const startRecording = (sourceLang, targetLang) => {
  if (isRecording || recognitionRef.current) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Your browser does not support Speech Recognition");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = sourceLang;
  recognition.interimResults = false;
  recognition.continuous = false;
  console.log("this is the recoginition", recognition)

  recognition.onresult = async (event) => {
    const spokenText = event.results[0][0].transcript;
    console.log("spokenText", spokenText)
    setTranscript(spokenText);
    const result = await translateText(spokenText, sourceLang, targetLang);
    setTranslated(result);

    //Determin role of speaker then append to conversation array
    const role = speakerRole === "customer" ? "Customer" : "Waiter";
    setConversation(prev => [
      ...prev,
      {
        role,
        toLang,
        original: spokenText,
        translated: result
      }
    ]);
    console.log(conversation)
    };
   

  recognition.onerror = (e) => {
    console.error("Recognition error:", e);
    stopRecording(); // this should trigger `onend`, but we now also add a backup
  };

  recognition.onend = () => {
    console.log("✅ onend triggered");
    recognitionRef.current = null;
    setIsRecording(false);
  };

  recognitionRef.current = recognition;
  recognition.start();
  setIsRecording(true);
};

// stop Recording Function
const stopRecording = () => {
  if (recognitionRef.current && !isStoppingRef.current) {
    console.log("stopRecording() called");
    isStoppingRef.current = true;
    recognitionRef.current.stop();

    // Force fallback after 1.5s
    setTimeout(() => {
      recognitionRef.current = null;
      setIsRecording(false);
      isStoppingRef.current = false;
      console.log("⏱ Forced fallback stop triggered");
    }, 1500);
  }
};

//Toggle Function to swtich between Recording and Stop button
const handleToggleRecording = (role) => {
  if (isRecording) {
    stopRecording();
  } else {
    const source = role === "customer" ? fromLang : toLang;
    const target = role === "customer" ? toLang : fromLang;
    startRecording(source, target);
  }
};

function handlePlayAudio(translation, language) {
googleTextToSpeech(translation, language)
}

return (
<div>
  <h2 className="mx-6 mb-5">🎙️ Live Voice Translator</h2>
   <div className='mx-6 mb-5'>
  <ScrollArea className="h-120 w-full rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Conversation</h4>
          {[...conversation].reverse().map((oneText, index) => (
              <Dialog key={index}>
                <DialogTrigger>
                  <div className="text-sm">{oneText.role}:&nbsp;{oneText.original}</div>                  
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Translated Order</DialogTitle>
                    <DialogDescription className="flex flex-col gap-5">
                     {oneText.translated}
                     <Button onClick={()=>{handlePlayAudio(
                    oneText.translated,
                    oneText.role === "Customer" ? toLang : fromLang)}}>Play audio</Button>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
                <Separator className="my-2" />
              </Dialog>
          ))}
      </div>
    </ScrollArea>
    </div>


  <div className="flex flex-col gap-5 mx-6">
    <Button
  
    onClick={() => {
      setSpeakerRole("customer");
      handleToggleRecording("customer");
    }}
    disabled={isRecording && speakerRole !== "customer"}
  >
    {isRecording && speakerRole === "customer" ? "🛑 Stop Customer Recording" : "🎤 Start Customer Recording"}
  </Button>

  <Button 
    onClick={() => {
      setSpeakerRole("waiter");
      handleToggleRecording("waiter");
    }}
    disabled={isRecording && speakerRole !== "waiter"}
  >
    {isRecording && speakerRole === "waiter" ? "🛑 Stop Waiter Recording" : "🎤 Start Waiter Recording"}
  </Button>
</div>
</div>
);
};
