import { MenuContext } from "@/contexts/menuContext";
import { SpeechContext } from "@/contexts/speechContext";
import React, { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";

//UI Components
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mic2, MicIcon, Play } from "lucide-react";
import { Mic } from "lucide-react";
import { AudioLines } from "lucide-react";
import { CircleStop } from "lucide-react";

export const OrderMenuPage = () => {
  const { createOrderMenu, uploadFile } = useContext(MenuContext);
  const { translateText, googleTextToSpeech, isPlaying } =
    useContext(SpeechContext);
  const { currentMenu, currentOrderMenu, handleGetOneMenu } =
    useContext(MenuContext);
  const [fromLang, setFromLang] = useState("English");
  const [toLang, setToLang] = useState("Chinese");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [speakerRole, setSpeakerRole] = useState(null);
  const [conversation, setConversation] = useState([]);
  const { menuId } = useParams();

  useEffect(() => {
    async function loadOrderMenu() {
      //Clear the conversation array when loading the page

      setConversation([
        {
          role: "Customer",
          toLang: currentOrderMenu.language,
          original: currentOrderMenu && currentOrderMenu[0].orderTranslation,
          translated: currentOrderMenu && currentOrderMenu[0].orderOriginal,
        },
      ]);
      //set languages for translation
      handleGetOneMenu(menuId);
      const languageFromCurrentMenu = currentMenu.language;

      console.log(languageFromCurrentMenu);
      const languageMap = {
        English: "English",
        Chinese: "Chinese",
        Japanese: "Japanese",
        Korean: "Korean",
      };
      const languageCode = languageMap[languageFromCurrentMenu];
      setToLang(languageCode);
    }
    loadOrderMenu();
  }, [currentOrderMenu]);

  //New start Recording function
  const startRecording = async (source, targetLanguage, role) => {
    console.log(source, targetLanguage, role);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/ogg" });
      console.log(audioBlob);

      // Upload Audio File to Google and save audioUri, mimeType

      const response = await uploadFile(audioBlob);
      console.log(response);
      const audioUri = response.file.uri;
      console.log("audio uri", audioUri);
      const mimeType = response.file.mimeType;
      console.log("audio mimeType", mimeType);

      //Call backend function to transcribe and translate the audio. Hand-over audio Uri and mime Type. Receive back the translated and transcribed text.
      const translationResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/gemini/translate-audio-from-uri`,
        {
          audioUri,
          mimeType,
          targetLanguage,
        }
      );
      const { translationResult } = translationResponse.data;

      let parsedResult = translationResult;

      if (typeof translationResult === "string") {
        parsedResult = JSON.parse(translationResult); // Safely parse if needed
      }

      if (parsedResult && parsedResult.length > 0) {
        const { audioTranscription, audioTranslation } = parsedResult[0];
        console.log(audioTranscription, audioTranslation);

        setConversation((prev) => [
          ...prev,
          {
            role: role === "customer" ? "Customer" : "Waiter",
            toLang: targetLanguage,
            original: audioTranscription,
            translated: audioTranslation,
          },
        ]);
      } else {
        console.error("No transcription/translation found.");
      }
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  // stop Recording Function
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop(); // This will trigger mediaRecorder.onstop
      setIsRecording(false); // Update your state to reflect recording stopped
    }
  };

  //Toggle Function to swtich between Recording and Stop button
  const handleToggleRecording = (role) => {
    if (isRecording) {
      stopRecording();
    } else {
      const source = role === "customer" ? fromLang : toLang;
      const target = role === "customer" ? toLang : fromLang;
      startRecording(source, target, role);
    }
  };

  function handlePlayAudio(translation, language) {
    googleTextToSpeech(translation, language);
  }

  return (
    <div className="lg:w-4/12 lg:mx-auto">
      <h2 className="mx-6 mb-5 flex items-center">
        <MicIcon className="mr-2" />
        <span>Live Translator</span>
      </h2>
      <div className="mx-6 mb-5">
        <ScrollArea className="h-120 w-full rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">
              Conversation
            </h4>
            {[...conversation].reverse().map((oneText, index) => (
              <div
                key={index}
                className={`flex ${
                  oneText.role === "Customer" ? "justify-start" : "justify-end"
                } mb-3`}
              >
                <div
                  className={`max-w-xs p-2 rounded-lg shadow-sm ${
                    oneText.role === "Customer"
                      ? "w-4/5 bg-muted text-left rounded-bl-none"
                      : "w-4/5 bg-accent text-right rounded-br-none"
                  }`}
                >
                  <div className="text-sm font-semibold mb-1">
                    {oneText.role}
                  </div>

                  {/* Message content depending on role */}
                  {oneText.role === "Customer" ? (
                    <>
                      <div>{oneText.translated}</div>
                      <div className="text-muted-foreground text-sm mt-1">
                        {oneText.original}
                      </div>
                    </>
                  ) : (
                    <>
                      <div>{oneText.translated}</div>
                      <div className="text-muted-foreground text-sm mt-1">
                        {oneText.original}
                      </div>
                    </>
                  )}

                  {/* Audio play button */}
                  <Button
                    variant="ghost"
                    disabled={isPlaying}
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      handlePlayAudio(
                        oneText.translated,
                        oneText.role === "Customer" ? toLang : fromLang
                      );
                    }}
                  >
                    <Play /> Audio
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex flex-row gap-4 mx-6 mt-10 mb-8">
        <Button
          className="flex-1 h-20 whitespace-normal text-wrap flex flex-col items-center justify-center gap-1 text-center"
          onClick={() => {
            setSpeakerRole("customer");
            handleToggleRecording("customer");
          }}
          disabled={isRecording && speakerRole !== "customer"}
        >
          {isRecording && speakerRole === "customer" ? (
            <>
              <CircleStop className="w-6 h-6" />
              <span className="text-xs sm:text-sm">
                Stop Customer Recording
              </span>
            </>
          ) : (
            <>
              <Mic className="w-6 h-6" />
              <span className="text-xs sm:text-sm">
                Start Customer Recording
              </span>
            </>
          )}
        </Button>

        <Button
          className="flex-1 h-20 whitespace-normal text-wrap flex flex-col items-center justify-center gap-1 text-center"
          onClick={() => {
            setSpeakerRole("waiter");
            handleToggleRecording("waiter");
          }}
          disabled={isRecording && speakerRole !== "waiter"}
        >
          {isRecording && speakerRole === "waiter" ? (
            <>
              <CircleStop className="w-6 h-6" />
              <span className="text-xs sm:text-sm">Stop Waiter Recording</span>
            </>
          ) : (
            <>
              <Mic className="w-6 h-6" />
              <span className="text-xs sm:text-sm">
                Start Waiter <br /> Recording
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
