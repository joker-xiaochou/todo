"use client";

import { useRef, useCallback, useEffect } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';

type FireworksProps = {
  fire: boolean;
  onComplete?: () => void;
};

const canvasStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  zIndex: 999,
} as const;

export function Fireworks({ fire, onComplete }: FireworksProps) {
  const refAnimationInstance = useRef<any>(null);

  const getInstance = useCallback((instance: any) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio: number, opts: object) => {
    refAnimationInstance.current?.({
      ...opts,
      origin: { y: 0.7 },
      particleCount: Math.floor(200 * particleRatio),
    });
  }, []);

  const fireEffect = useCallback(() => {
    if (!refAnimationInstance.current) return;
    
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
    
    // 动画完成后的回调
    setTimeout(() => {
      onComplete?.();
    }, 2000);
  }, [makeShot, onComplete]);

  useEffect(() => {
    if (fire) {
      fireEffect();
    }
  }, [fire, fireEffect]);

  return (
    <ReactCanvasConfetti
      onInit={({ confetti }) => refAnimationInstance.current = confetti}
      style={canvasStyles}
    />
  );
} 