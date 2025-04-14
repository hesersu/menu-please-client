import React from "react";
import { createContext } from "react";

const SpeechContext = createContext();

const SpeechContextWrapper = ({ children }) => {
  // Synthesize Speech
  async function googleTextToSpeech(text, language) {
    console.log(text, language);

    try {
      const apiKey = import.meta.env.VITE_GOOGLESTTS_API;
      if (!apiKey || !text) return;

      const url = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`;

      let data;

      if (language === "Chinese") {
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
      } else if (language === "Korean") {
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
      } else if (language === "Japanese") {
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
      audio.play();
      console.log(audioUrl);
      return audioUrl;
    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <SpeechContext.Provider
      value={{
        googleTextToSpeech,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export { SpeechContext, SpeechContextWrapper };
