


import Recorder from "../../components/Recorder"
import Header from "../../components/Header";
import ChatBox from "../../components/ChatBox";
import VoiceAssistant from "../../components/VoiceAssistant";
export default function Home() {
  // return (
  //   <div className="min-h-screen flex flex-col items-center justify-start">
  //     <Header />
  //     <main className="w-full max-w-4xl p-6 mt-12 flex flex-col items-center gap-8">
  //       <Recorder />
  //       <ChatBox />
  //     </main>
  //   </div>
  // );




  return (
    <div className="min-h-screen flex flex-col items-center justify-start">
      <Header />
    {/* <main className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-4"> */}
    <main className="w-full max-w-4xl p-6 mt-12 flex flex-col items-center gap-8">
      <VoiceAssistant />
    </main>
    </div>
  );
}
