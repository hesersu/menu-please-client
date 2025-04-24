import React from "react";
import { createContext } from "react";
import { useState } from "react";
import axios from "axios";

const SpeechContext = createContext();

const SpeechContextWrapper = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Synthesize Speech
  async function googleTextToSpeech(text, language) {
    console.log(text, language);

    try {
      setIsPlaying(true);
      const apiKey = import.meta.env.VITE_GOOGLESTTS_API;
      if (!apiKey || !text) return;

      const url = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`;

      let data;

      if (language === "Chinese" || language === "zh-CN") {
        data = {
          input: {
            text: text,
          },
          voice: {
            languageCode: "cmn-CN",
            name: "cmn-CN-Chirp3-HD-Aoede",
            ssmlGender: "FEMALE",
          },
          audioConfig: {
            audioEncoding: "MP3",
          },
        };
      } else if (language === "Korean" || language === "ko") {
        data = {
          input: {
            text: text,
          },
          voice: {
            languageCode: "ko-KR",
            name: "ko-KR-Chirp3-HD-Aoede",
            ssmlGender: "FEMALE",
          },
          audioConfig: {
            audioEncoding: "MP3",
          },
        };
      } else if (language === "Japanese" || language === "ja") {
        data = {
          input: {
            text: text,
          },
          voice: {
            languageCode: "ja-JP",
            name: "ja-JP-Chirp3-HD-Aoede",
            ssmlGender: "FEMALE",
          },
          audioConfig: {
            audioEncoding: "MP3",
          },
        };
      } else if (language === "English" || language === "en") {
        data = {
          input: {
            text: text,
          },
          voice: {
            languageCode: "en-US",
            name: "en-US-Chirp3-HD-Aoede",
            ssmlGender: "FEMALE",
          },
          audioConfig: {
            audioEncoding: "MP3",
          },
        };
      }

      //   const data = {
      //     input: {
      //       text: text,
      //     },
      //     voice: {
      //       languageCode: "cmn-CN",
      //       name: "cmn-CN-Chirp3-HD-Aoede",
      //       ssmlGender: "FEMALE",
      //     },
      //     audioConfig: {
      //       audioEncoding: "MP3",
      //     },
      //   };

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
      });

      const responseJson = await response.json();
      console.log(responseJson);
      // Base64 Naguc
      const base64 = responseJson.audioContent;
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // Event Listeners to track audio
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      });

      audio.addEventListener("error", () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        console.error("Audio playback error");
      });

      // Audio Play
      audio.play();
      return audioUrl;
    } catch (error) {
      setIsPlaying(false);
      throw new Error(error);
    }
  }
  // Traslate transcribed text
  const translateText = async (text, fromLang, toLang) => {
    try {
      const apiKey = import.meta.env.VITE_GOOGLESTTS_API;
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          q: text,
          source: fromLang,
          target: toLang,
          format: "text",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const translated = response.data.data.translations[0].translatedText;
      // googleTextToSpeech(translated, toLang)
      // speak(translated, toLang);
      return translated;
    } catch (error) {
      console.error("Translation error:", error);
      return "";
    }
  };

  // const speak = (text, toLang = "zh-CN") => {
  //   const utterance = new SpeechSynthesisUtterance(text);
  //   utterance.lang = lang;
  //   speechSynthesis.speak(utterance);
  // };

  //Handle Translate Audio
  return (
    <SpeechContext.Provider
      value={{
        googleTextToSpeech,
        translateText,
        isPlaying,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export { SpeechContext, SpeechContextWrapper };
