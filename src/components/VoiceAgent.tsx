import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { Mic, MicOff, Volume2, VolumeX, Activity, ShieldCheck, Server, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { SHOOTSPACE_SYSTEM_INSTRUCTION } from '../constants';

export default function VoiceAgent() {
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [transcription, setTranscription] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionRef = useRef<any>(null);
  const audioQueueRef = useRef<Int16Array[]>([]);
  const isPlayingRef = useRef(false);

  const stopSession = useCallback(async () => {
    if (sessionRef.current) {
      await sessionRef.current.close();
      sessionRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsActive(false);
    setStatus('idle');
    setAudioLevel(0);
  }, []);

  const playAudioChunk = useCallback(async (pcmData: Int16Array) => {
    if (!audioContextRef.current) return;

    const floatData = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      floatData[i] = pcmData[i] / 32768.0;
    }

    const buffer = audioContextRef.current.createBuffer(1, floatData.length, 24000);
    buffer.getChannelData(0).set(floatData);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    
    source.onended = () => {
      if (audioQueueRef.current.length > 0) {
        playAudioChunk(audioQueueRef.current.shift()!);
      } else {
        isPlayingRef.current = false;
        setStatus('listening');
      }
    };

    isPlayingRef.current = true;
    setStatus('speaking');
    source.start();
  }, []);

  const startSession = async () => {
    try {
      setStatus('connecting');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: SHOOTSPACE_SYSTEM_INSTRUCTION,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('listening');
            
            processorRef.current!.onaudioprocess = (e) => {
              if (isMuted) return;
              
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData = new Int16Array(inputData.length);
              
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) {
                const s = Math.max(-1, Math.min(1, inputData[i]));
                pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                sum += s * s;
              }
              
              setAudioLevel(Math.sqrt(sum / inputData.length));

              const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
              sessionRef.current?.sendRealtimeInput({
                media: { data: base64Data, mimeType: 'audio/pcm;rate=24000' }
              });
            };
            
            source.connect(processorRef.current!);
            processorRef.current!.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
              const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
              const binaryString = atob(base64Audio);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const pcmData = new Int16Array(bytes.buffer);
              
              if (isPlayingRef.current) {
                audioQueueRef.current.push(pcmData);
              } else {
                playAudioChunk(pcmData);
              }
            }

            if (message.serverContent?.interrupted) {
              audioQueueRef.current = [];
              isPlayingRef.current = false;
              setStatus('listening');
            }

            if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
              setTranscription(prev => prev + " " + message.serverContent?.modelTurn?.parts?.[0]?.text);
            }
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            stopSession();
          },
          onclose: () => {
            stopSession();
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (error) {
      console.error("Failed to start session:", error);
      setStatus('idle');
    }
  };

  const toggleActive = () => {
    if (isActive) {
      stopSession();
    } else {
      startSession();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
      <div className="relative w-full max-w-md bg-[#151619] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Hardware Header */}
        <div className="p-6 border-bottom border-white/5 flex items-center justify-between bg-[#1a1b1e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Cloud className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-white font-medium tracking-tight">SHOOTSPACE</h2>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Cloud Voice Agent</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-white/10"
            )} />
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">
              {status}
            </span>
          </div>
        </div>

        {/* Main Interface */}
        <div className="p-8 flex flex-col items-center gap-12">
          {/* Visualizer */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-white/5 border-dashed animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-white/10" />
            
            <AnimatePresence mode="wait">
              {isActive ? (
                <motion.div
                  key="active"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative z-10"
                >
                  <div className="flex items-end gap-1 h-16">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          height: isActive ? [10, 20 + (audioLevel * 100), 10] : 10 
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 0.5, 
                          delay: i * 0.05 
                        }}
                        className="w-1.5 bg-emerald-400 rounded-full"
                      />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="text-white/20"
                >
                  <Activity className="w-12 h-12" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsMuted(!isMuted)}
              disabled={!isActive}
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border",
                isMuted 
                  ? "bg-red-500/10 border-red-500/20 text-red-400" 
                  : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10",
                !isActive && "opacity-20 cursor-not-allowed"
              )}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleActive}
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl",
                isActive 
                  ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20" 
                  : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20"
              )}
            >
              {isActive ? (
                <div className="w-6 h-6 bg-white rounded-sm" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>

            <button
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Status Text */}
          <div className="text-center space-y-2">
            <p className="text-white/80 font-medium">
              {isActive ? (status === 'speaking' ? "SHOOTSPACE is speaking..." : "Listening for your voice...") : "Ready to assist"}
            </p>
            <p className="text-white/40 text-xs max-w-[240px] leading-relaxed">
              {isActive 
                ? "Ask about our Data Centre plans, SLB model, or cloud services." 
                : "Click the microphone to start a conversation with SHOOTSPACE."}
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-6 bg-[#1a1b1e] border-t border-white/5 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-[10px] text-white/30 font-mono uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" />
            <span>Secure Connection</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-white/30 font-mono uppercase tracking-wider justify-end">
            <Server className="w-3 h-3" />
            <span>GIFT City Node</span>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 bg-[#0a0a0b]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>
    </div>
  );
}
