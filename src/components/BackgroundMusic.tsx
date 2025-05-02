"use client";

import { useEffect, useRef, useState } from 'react';

/**
 * 背景音乐组件，循环播放星穹铁道主题音乐
 */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTip, setShowTip] = useState(true);
  
  useEffect(() => {
    const audioElement = audioRef.current;
    
    if (audioElement) {
      audioElement.volume = 0.3; // 设置默认音量为30%
      
      // 监听音频结束事件以实现循环播放
      const handleEnded = () => {
        if (audioElement) {
          audioElement.currentTime = 0;
          audioElement.play().catch(error => console.error('自动播放失败:', error));
        }
      };
      
      audioElement.addEventListener('ended', handleEnded);
      
      // 设置5秒后隐藏提示
      const tipTimer = setTimeout(() => {
        setShowTip(false);
      }, 5000);
      
      return () => {
        // 使用缓存的引用进行清理
        audioElement.removeEventListener('ended', handleEnded);
        clearTimeout(tipTimer);
      };
    }
  }, []);
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // 在用户交互时尝试播放音频
        audioRef.current.play().catch(error => {
          console.error('播放音乐失败:', error);
        });
      }
      setIsPlaying(!isPlaying);
      setShowTip(false); // 用户点击后隐藏提示
    }
  };
  
  // 调整音量的函数
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const volume = parseFloat(e.target.value);
      audioRef.current.volume = volume;
    }
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* 音频元素 */}
      <audio 
        ref={audioRef}
        src="/HOYO-MiX - 星穹铁道 Star Rail.mp3"
        loop
      />
      
      {/* 音量控制滑块，仅在播放时显示 */}
      {isPlaying && (
        <div className="bg-black/30 backdrop-blur-md rounded-full px-4 py-2 w-28 flex items-center transition-all duration-300">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="0.3"
            onChange={handleVolumeChange}
            className="w-full"
            title="调整音量"
          />
        </div>
      )}
      
      {/* 播放/暂停按钮 */}
      <button
        onClick={togglePlay}
        className={`${isPlaying ? 'bg-amber-500/80' : 'bg-amber-500/70'} hover:bg-amber-600/80 backdrop-blur-sm text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-all duration-300 focus:outline-none ${isPlaying ? '' : 'animate-pulse'}`}
        style={{
          boxShadow: isPlaying 
            ? '0 0 15px rgba(245, 158, 11, 0.6), 0 0 30px rgba(245, 158, 11, 0.3)' 
            : '0 0 10px rgba(245, 158, 11, 0.3)'
        }}
        aria-label={isPlaying ? "暂停背景音乐" : "播放背景音乐"}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </button>
      
      {/* 提示信息 */}
      {showTip && !isPlaying && (
        <div className="absolute right-16 bg-black/50 text-white rounded-lg px-3 py-2 backdrop-blur-sm music-tooltip">
          点击播放音乐
        </div>
      )}
    </div>
  );
} 