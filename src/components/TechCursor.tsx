"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import "./tech-cursor.css";

// 粒子类型定义
interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  life: number;
  maxLife: number;
}

export function TechCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorTriangleRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  
  // 创建粒子
  const createParticle = useCallback(() => {
    const size = Math.random() * 5 + 1;
    const speedX = (Math.random() - 0.5) * 2;
    const speedY = (Math.random() - 0.5) * 2;
    const maxLife = Math.random() * 50 + 30;
    
    // 随机颜色 - 蓝色/青色系列为主
    const colors = [
      "rgba(0, 180, 255, 0.7)",
      "rgba(0, 240, 255, 0.7)",
      "rgba(100, 220, 255, 0.7)",
      "rgba(50, 200, 250, 0.7)",
      "rgba(0, 150, 200, 0.7)"
    ];
    
    const newParticle: Particle = {
      x: mousePosition.x,
      y: mousePosition.y,
      size,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX,
      speedY,
      life: 0,
      maxLife
    };
    
    return newParticle;
  }, [mousePosition]);
  
  // 更新和绘制粒子
  const updateParticles = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 更新现有粒子
    const updatedParticles = particles.map(particle => {
      const updatedParticle = { ...particle };
      updatedParticle.x += updatedParticle.speedX;
      updatedParticle.y += updatedParticle.speedY;
      updatedParticle.size *= 0.97;
      updatedParticle.life += 1;
      
      // 绘制粒子
      ctx.beginPath();
      ctx.arc(updatedParticle.x, updatedParticle.y, updatedParticle.size, 0, Math.PI * 2);
      
      // 根据生命周期调整透明度
      const alpha = 1 - updatedParticle.life / updatedParticle.maxLife;
      const color = updatedParticle.color.replace(/[\d.]+\)$/, `${alpha})`);
      
      ctx.fillStyle = color;
      ctx.fill();
      
      return updatedParticle;
    });
    
    // 添加新粒子
    const newParticles = [];
    if (Math.random() < 0.3) {
      newParticles.push(createParticle());
    }
    
    // 过滤掉已经消失的粒子
    const filteredParticles = [
      ...updatedParticles.filter(p => p.size > 0.2 && p.life < p.maxLife),
      ...newParticles
    ];
    
    setParticles(filteredParticles);
    
    animationFrameRef.current = requestAnimationFrame(updateParticles);
  }, [particles, createParticle]);
  
  // 设置鼠标位置
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // 更新粒子系统的鼠标位置
    setMousePosition({ x: e.clientX, y: e.clientY });
    
    // 更新自定义光标位置
    if (cursorTriangleRef.current) {
      cursorTriangleRef.current.style.left = `${e.clientX}px`;
      cursorTriangleRef.current.style.top = `${e.clientY}px`;
    }
  }, []);
  
  // 处理点击事件
  const handleMouseDown = useCallback(() => {
    if (cursorTriangleRef.current) {
      cursorTriangleRef.current.classList.add("active");
    }
  }, []);
  
  // 处理鼠标释放事件
  const handleMouseUp = useCallback(() => {
    if (cursorTriangleRef.current) {
      cursorTriangleRef.current.classList.remove("active");
    }
  }, []);
  
  // 监听可点击元素
  const handleClickableElements = useCallback(() => {
    const clickableElements = document.querySelectorAll("a, button, input, [role='button'], .clickable");
    
    const handleMouseEnter = () => {
      if (cursorTriangleRef.current) {
        cursorTriangleRef.current.classList.add("active");
      }
    };
    
    const handleMouseLeave = () => {
      if (cursorTriangleRef.current) {
        cursorTriangleRef.current.classList.remove("active");
      }
    };
    
    clickableElements.forEach(element => {
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
    });
    
    return () => {
      clickableElements.forEach(element => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);
  
  // 调整画布大小
  const handleResize = useCallback(() => {
    if (!canvasRef.current) return;
    
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
  }, []);
  
  // 应用科技感鼠标
  const applyTechCursor = useCallback(() => {
    document.body.classList.add("tech-cursor-active");
  }, []);
  
  // 初始化和清理
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", handleResize);
    
    // 应用科技感光标
    applyTechCursor();
    
    // 监听可点击元素
    const cleanupClickableListeners = handleClickableElements();
    
    if (canvasRef.current) {
      handleResize();
      animationFrameRef.current = requestAnimationFrame(updateParticles);
    }
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      
      document.body.classList.remove("tech-cursor-active");
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      cleanupClickableListeners();
    };
  }, [
    handleMouseMove, 
    handleMouseDown, 
    handleMouseUp, 
    handleResize, 
    applyTechCursor, 
    handleClickableElements,
    updateParticles
  ]);
  
  // 当鼠标位置或粒子数组变化时，更新动画
  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(updateParticles);
    
    // 限制粒子数量，避免性能问题
    if (particles.length > 100) {
      setParticles(particles.slice(0, 100));
    }
  }, [mousePosition, particles, updateParticles]);
  
  // 只有在客户端渲染时才显示
  if (typeof window === "undefined") return null;
  
  return (
    <>
      {/* 粒子效果画布 */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      
      {/* 三角形科技感光标 */}
      <div ref={cursorTriangleRef} className="cursor-triangle">
        <div className="cursor-triangle-inner"></div>
        <div className="cursor-triangle-glow"></div>
        <div className="cursor-triangle-line"></div>
      </div>
    </>
  );
} 