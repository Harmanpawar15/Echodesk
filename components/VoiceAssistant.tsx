'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const startListening = () => {
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      ((window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition);

    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.start();
    setListening(true);

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      generateResponse(text);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const generateResponse = async (inputText: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: inputText }]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a helpful career coach.' },
            ...messages,
            { role: 'user', content: inputText },
          ],
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Sorry, no response.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('API error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 ">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-xl w-full space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          🎙️ Echodesk
        </h2>
        <p className="text-center text-gray-500">
          Your personal career coach powered by voice + AI
        </p>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-2 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 bg-indigo-500 text-white w-8 h-8 flex items-center justify-center rounded-full">
                  🤖
                </div>
              )}

              <div
                className={`p-4 rounded-xl max-w-[80%] text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-green-100 text-right ml-auto'
                    : 'bg-indigo-100 text-left'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="flex-shrink-0 bg-green-500 text-white w-8 h-8 flex items-center justify-center rounded-full">
                  🧑
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-indigo-500"
            >
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:.1s]" />
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:.2s]" />
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:.3s]" />
              <span className="text-sm text-indigo-400 ml-2">Typing</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <button
          onClick={startListening}
          className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition duration-300 ${
            listening
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {listening ? 'Listening...' : 'Start Talking'}
        </button>
      </div>
    </div>
  );
}
