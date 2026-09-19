import { useState, useEffect, useRef, useCallback } from 'react';
import type { MediaStreamState, MediaPermissionStatus } from '../types/auth';

export function useProctoringMedia(autoStart: boolean = false) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean>(false);
  const [hasMic, setHasMic] = useState<boolean>(false);
  const [isCameraMuted, setIsCameraMuted] = useState<boolean>(false);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [permissionStatus, setPermissionStatus] = useState<MediaPermissionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize and sample live microphone audio levels
  const setupAudioAnalyser = useCallback((mediaStream: MediaStream) => {
    try {
      const audioTracks = mediaStream.getAudioTracks();
      if (audioTracks.length === 0) return;

      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }

      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(mediaStream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        if (!analyserRef.current || audioTracks.some((t) => !t.enabled)) {
          setAudioLevel(0);
          animFrameRef.current = requestAnimationFrame(updateVolume);
          return;
        }

        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        // Normalize 0 - 100 with sensitivity curve
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setAudioLevel(normalized);

        animFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      console.warn('AudioContext setup error (non-fatal):', err);
    }
  }, []);

  // Request both Camera and Microphone access
  const requestMedia = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermissionStatus('unavailable');
      setErrorMessage('Camera & Microphone APIs are not supported on this browser.');
      return null;
    }

    setPermissionStatus('requesting');
    setErrorMessage(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setHasCamera(mediaStream.getVideoTracks().length > 0);
      setHasMic(mediaStream.getAudioTracks().length > 0);
      setPermissionStatus('granted');
      setIsCameraMuted(false);
      setIsMicMuted(false);

      setupAudioAnalyser(mediaStream);
      return mediaStream;
    } catch (err: unknown) {
      const error = err as Error;
      console.warn('getUserMedia full access failed, attempting fallback...', error.name);

      // Attempt audio-only or video-only fallback if one hardware piece was unavailable
      try {
        const audioOnlyStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = audioOnlyStream;
        setStream(audioOnlyStream);
        setHasCamera(false);
        setHasMic(true);
        setPermissionStatus('granted');
        setupAudioAnalyser(audioOnlyStream);
        return audioOnlyStream;
      } catch {
        // Handle true denial or device missing
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setPermissionStatus('denied');
          setErrorMessage('Permission was denied. Please allow Camera & Microphone access in your browser settings to continue.');
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          setPermissionStatus('unavailable');
          setErrorMessage('No camera or microphone device found on your system.');
        } else {
          setPermissionStatus('error');
          setErrorMessage(error.message || 'Unable to access camera and microphone.');
        }
        return null;
      }
    }
  }, [setupAudioAnalyser]);

  // Toggle Camera Mute/Active
  const toggleCamera = useCallback(() => {
    if (!streamRef.current) return;
    const videoTracks = streamRef.current.getVideoTracks();
    if (videoTracks.length === 0) return;

    const nextState = !isCameraMuted;
    videoTracks.forEach((track) => {
      track.enabled = !nextState;
    });
    setIsCameraMuted(nextState);
  }, [isCameraMuted]);

  // Toggle Microphone Mute/Active
  const toggleMic = useCallback(() => {
    if (!streamRef.current) return;
    const audioTracks = streamRef.current.getAudioTracks();
    if (audioTracks.length === 0) return;

    const nextState = !isMicMuted;
    audioTracks.forEach((track) => {
      track.enabled = !nextState;
    });
    setIsMicMuted(nextState);
    if (nextState) {
      setAudioLevel(0);
    }
  }, [isMicMuted]);

  // Clean stop of all tracks and audio context
  const stopMedia = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    setStream(null);
    setHasCamera(false);
    setHasMic(false);
    setAudioLevel(0);
    setPermissionStatus('idle');
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    if (autoStart) {
      void Promise.resolve().then(() => {
        if (isSubscribed) {
          requestMedia();
        }
      });
    }

    return () => {
      isSubscribed = false;
      stopMedia();
    };
  }, [autoStart, requestMedia, stopMedia]);

  const mediaState: MediaStreamState = {
    stream,
    hasCamera,
    hasMic,
    isCameraMuted,
    isMicMuted,
    audioLevel,
    permissionStatus,
    errorMessage,
  };

  return {
    mediaState,
    requestMedia,
    toggleCamera,
    toggleMic,
    stopMedia,
  };
}
