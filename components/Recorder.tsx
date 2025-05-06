// "use client";

// import { useRecorder } from "../hooks/useRecorder";

// export default function Recorder() {
//   const { recording, startRecording, stopRecording, transcript } = useRecorder();

//   return (
//     <div className="flex flex-col items-center gap-6">
//       <button
//         onClick={recording ? stopRecording : startRecording}
//         className={`px-6 py-3 rounded-full text-white font-semibold transition ${
//           recording ? "bg-red-500" : "bg-green-500"
//         }`}
//       >
//         {recording ? "Stop Recording" : "Start Talking"}
//       </button>

//       <div className="bg-white p-4 rounded-md shadow w-80 min-h-[100px] border text-gray-800">
//         <h2 className="font-semibold mb-2">Transcript</h2>
//         <p>{transcript || "🎧 Waiting for voice..."}</p>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState, useRef } from "react";

export default function Recorder() {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleRecord = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play(); // playback for feedback
    };

    if (!recording) {
      mediaRecorder.start();
      setRecording(true);
    } else {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleRecord}
        className={`transition px-8 py-3 rounded-full font-semibold text-lg shadow-md hover:scale-105 duration-200 ${
          recording
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-[#00ADB5] hover:bg-[#00c4cc] text-white"
        }`}
      >
        {recording ? "Stop Recording" : "Start Talking"}
      </button>
      {recording && <span className="text-sm text-red-400">🎙️ Listening...</span>}
    </div>
  );
}
