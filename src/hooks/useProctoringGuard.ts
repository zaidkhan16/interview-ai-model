import { useState, useEffect, useCallback, useRef } from 'react';
import type { ProctoringGuardState, ProctoringViolation, ProctoringViolationType } from '../types/auth';

interface UseProctoringGuardOptions {
  isActive: boolean;
  maxViolations?: number;
  onViolation?: (violation: ProctoringViolation) => void;
}

export function useProctoringGuard({
  isActive,
  maxViolations = 3,
  onViolation,
}: UseProctoringGuardOptions) {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [violations, setViolations] = useState<ProctoringViolation[]>([]);
  const [currentAlert, setCurrentAlert] = useState<ProctoringViolation | null>(null);
  const [isAudioWarningEnabled, setIsAudioWarningEnabled] = useState<boolean>(true);

  const violationCountRef = useRef<number>(0);
  const lastViolationTimeRef = useRef<number>(0);
  const onViolationRef = useRef(onViolation);

  useEffect(() => {
    onViolationRef.current = onViolation;
  }, [onViolation]);

  // Synthesize an alert warning tone via Web Audio API
  const playAlertTone = useCallback(() => {
    if (!isAudioWarningEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // High warning tone
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch {
      // AudioContext might be blocked before first user gesture
    }
  }, [isAudioWarningEnabled]);

  // Record a security violation
  const recordViolation = useCallback(
    (type: ProctoringViolationType, title: string, description: string, severity: 'warning' | 'danger' | 'critical' = 'danger') => {
      const now = Date.now();
      // Debounce rapid duplicate trigger events (within 1.2s)
      if (now - lastViolationTimeRef.current < 1200) {
        return;
      }
      lastViolationTimeRef.current = now;

      violationCountRef.current += 1;
      const count = violationCountRef.current;

      const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const newViolation: ProctoringViolation = {
        id: `viol_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type,
        title: `${title} (Strike ${count}/${maxViolations})`,
        description,
        timestamp: formattedTime,
        severity: count >= maxViolations ? 'critical' : severity,
      };

      setViolations((prev) => [newViolation, ...prev]);
      setCurrentAlert(newViolation);
      playAlertTone();

      if (onViolationRef.current) {
        onViolationRef.current(newViolation);
      }
    },
    [maxViolations, playAlertTone]
  );

  // Request native Fullscreen lock
  const requestFullscreen = useCallback(async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if ((document.documentElement as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
        await (document.documentElement as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } catch (err) {
      console.warn('Fullscreen request denied or not supported:', err);
    }
  }, []);

  // Exit Fullscreen safely
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
    } catch (err) {
      console.warn('Exit fullscreen error:', err);
    }
  }, []);

  // Dismiss currently active warning alert modal
  const dismissAlert = useCallback(() => {
    setCurrentAlert(null);
  }, []);

  // Clear all violation records
  const resetViolations = useCallback(() => {
    violationCountRef.current = 0;
    setViolations([]);
    setCurrentAlert(null);
  }, []);

  // Listeners when proctoring mode is active
  useEffect(() => {
    if (!isActive) {
      return;
    }

    // 1. Tab visibility change (Switched tab / Minimized browser)
    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        recordViolation(
          'TAB_SWITCH',
          'Tab Switch / Navigation Away Detected',
          'Switching browser tabs or minimizing the interview session is strictly prohibited.',
          'danger'
        );
      }
    };

    // 2. Window Blur (Defocus, Alt+Tab, Split screen click outside)
    const handleWindowBlur = () => {
      // Don't trigger if document is already hidden (visibilitychange will handle it)
      if (!document.hidden) {
        recordViolation(
          'WINDOW_BLUR',
          'Window Focus Lost (Alt+Tab / App Switch)',
          'You clicked outside or switched to another application window during active proctoring.',
          'warning'
        );
      }
    };

    // 3. Prevent Leaving / Web exit (beforeunload)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Proctored interview session is in progress. Leaving will forfeit your interview progress.';
      return 'Proctored interview session is in progress. Leaving will forfeit your interview progress.';
    };

    // 4. Fullscreen changes
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!(document.fullscreenElement || (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement);
      setIsFullscreen(isNowFullscreen);
      if (!isNowFullscreen && isActive) {
        recordViolation(
          'FULLSCREEN_EXIT',
          'Exited Fullscreen Lockdown',
          'Leaving fullscreen mode breaches anti-cheat compliance. Please return to fullscreen.',
          'warning'
        );
      }
    };

    // 5. Intercept devtools and prohibited key combinations
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // F12 or DevTools shortcuts (Cmd+Option+I / Ctrl+Shift+I, Cmd+Option+J / Ctrl+Shift+J, Cmd+Option+C / Ctrl+Shift+C)
      const isDevTools =
        e.key === 'F12' ||
        (cmdOrCtrl && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (isMac && e.metaKey && e.altKey && (e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J' || e.key === 'c' || e.key === 'C'));

      // View Source (Ctrl+U / Cmd+Option+U)
      const isViewSource = cmdOrCtrl && (e.key === 'u' || e.key === 'U');

      if (isDevTools || isViewSource) {
        e.preventDefault();
        e.stopPropagation();
        recordViolation(
          'DEVTOOLS_SHORTCUT',
          'Developer Tools / Source Access Blocked',
          `Shortcut (${e.key}) is disabled under active proctored examination rules.`,
          'critical'
        );
      }
    };

    // 6. Context Menu (Right-Click) Interception
    const handleContextMenu = (e: MouseEvent) => {
      // Block right click to prevent inspecting elements
      e.preventDefault();
      recordViolation(
        'CONTEXT_MENU',
        'Right-Click Context Menu Restricted',
        'Inspect and context actions are restricted during proctored evaluation.',
        'warning'
      );
    };

    // 7. Mouse Out of Bounds Detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        // Optional light notice or debounced warning
      }
    };

    // Attach all proctoring listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isActive, recordViolation]);

  const guardState: ProctoringGuardState = {
    isProctoringActive: isActive,
    isFullscreen,
    violationCount: violations.length,
    maxViolations,
    violations,
    currentAlert,
    isAudioWarningEnabled,
  };

  return {
    guardState,
    requestFullscreen,
    exitFullscreen,
    dismissAlert,
    resetViolations,
    toggleAudioWarning: () => setIsAudioWarningEnabled((prev) => !prev),
  };
}
