'use client';

import React, { createContext, useContext, useState, useRef } from 'react';

interface LipSyncContextType {
  isSpeaking: boolean;
  setIsSpeaking: (speaking: boolean) => void;
  mouthOpenRef: React.MutableRefObject<number>;
  mouthWidthRef: React.MutableRefObject<number>;
}

const LipSyncContext = createContext<LipSyncContextType>({
  isSpeaking: false,
  setIsSpeaking: () => {},
  mouthOpenRef: { current: 0 },
  mouthWidthRef: { current: 0 },
});

export const LipSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mouthOpenRef = useRef<number>(0);
  const mouthWidthRef = useRef<number>(0);

  return (
    <LipSyncContext.Provider
      value={{
        isSpeaking,
        setIsSpeaking,
        mouthOpenRef,
        mouthWidthRef,
      }}
    >
      {children}
    </LipSyncContext.Provider>
  );
};

export const useLipSync = () => useContext(LipSyncContext);
