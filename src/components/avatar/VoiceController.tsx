'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { voiceEngine } from '@/lib/voice';
import { useLipSync } from './LipSync';

interface VoiceContextType {
  isSpeaking: boolean;
  currentSubtitle: string;
  speak: (text: string) => Promise<void>;
  stop: () => void;
}

const VoiceContext = createContext<VoiceContextType>({
  isSpeaking: false,
  currentSubtitle: '',
  speak: async () => {},
  stop: () => {},
});

export const VoiceControllerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSpeakingState, setIsSpeakingState] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const { setIsSpeaking } = useLipSync();

  // Pre-warm voices on mount so voice engine is hot and zero-delay when clicked
  useEffect(() => {
    if (typeof window !== 'undefined') {
      voiceEngine.initVoices();
    }
  }, []);

  const speak = useCallback(
    async (text: string) => {
      setCurrentSubtitle(text);
      setIsSpeakingState(true);
      setIsSpeaking(true);

      await voiceEngine.speak({
        text,
        onStart: () => {
          setIsSpeakingState(true);
          setIsSpeaking(true);
        },
        onEnd: () => {
          setIsSpeakingState(false);
          setIsSpeaking(false);
        },
        onError: () => {
          setIsSpeakingState(false);
          setIsSpeaking(false);
        },
      });
    },
    [setIsSpeaking]
  );

  const stop = useCallback(() => {
    voiceEngine.stop();
    setIsSpeakingState(false);
    setIsSpeaking(false);
    setCurrentSubtitle('');
  }, [setIsSpeaking]);

  return (
    <VoiceContext.Provider
      value={{
        isSpeaking: isSpeakingState,
        currentSubtitle,
        speak,
        stop,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoiceController = () => useContext(VoiceContext);
