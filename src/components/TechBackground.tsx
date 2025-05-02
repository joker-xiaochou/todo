"use client";

import { useEffect, useRef } from 'react';

export function TechBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸为窗口大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 创建节点
    const nodes: Node[] = [];
    const nodeCount = Math.floor((window.innerWidth * window.innerHeight) / 15000); // 根据屏幕大小确定节点数量

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: `rgba(0, ${150 + Math.random() * 100}, ${200 + Math.random() * 55}, ${0.3 + Math.random() * 0.4})`,
      });
    }

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 绘制深色渐变背景
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a1928');
      gradient.addColorStop(1, '#162b40');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 绘制方格网络
      ctx.strokeStyle = 'rgba(30, 60, 80, 0.15)';
      ctx.lineWidth = 0.5;
      
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 绘制科技感元素
      drawHexGrid(ctx, canvas);
      drawCircuitLines(ctx, canvas);

      // 更新和绘制节点
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        // 边界检查
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // 绘制节点
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // 连接附近节点
        nodes.forEach((node2, j) => {
          if (i === j) return;
          const dx = node.x - node2.x;
          const dy = node.y - node2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.strokeStyle = `rgba(0, 210, 255, ${0.03 * (1 - distance / 150)})`;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    // 绘制六边形网格
    const drawHexGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const hexSize = 120;
      const hexHeight = hexSize * Math.sqrt(3);
      
      ctx.strokeStyle = 'rgba(0, 100, 150, 0.1)';
      ctx.lineWidth = 1;
      
      for (let y = -hexHeight; y < canvas.height + hexHeight; y += hexHeight * 0.75) {
        for (let x = -hexSize; x < canvas.width + hexSize; x += hexSize * 1.5) {
          const offsetX = (Math.floor(y / (hexHeight * 0.75)) % 2) * hexSize * 0.75;
          drawHexagon(ctx, x + offsetX, y, hexSize * 0.5);
        }
      }
    };

    // 绘制单个六边形
    const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + size * Math.cos(angle);
        const hy = y + size * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(hx, hy);
        } else {
          ctx.lineTo(hx, hy);
        }
      }
      ctx.closePath();
      ctx.stroke();
    };

    // 绘制电路线条
    const drawCircuitLines = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const circuitCount = 10;
      const baseY = canvas.height * 0.5;
      
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 180, 230, 0.15)';
      
      for (let i = 0; i < circuitCount; i++) {
        let currentY = baseY + (Math.random() - 0.5) * canvas.height * 0.8;
        
        ctx.beginPath();
        ctx.moveTo(0, currentY);
        
        let x = 0;
        while (x < canvas.width) {
          const segmentLength = Math.random() * 50 + 50;
          const direction = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          
          x += segmentLength;
          const newY = currentY + direction * (Math.random() * 20 + 10);
          
          if (direction !== 0) {
            ctx.lineTo(x - segmentLength / 2, currentY);
            ctx.lineTo(x - segmentLength / 2, newY);
          }
          
          ctx.lineTo(x, newY);
          
          if (Math.random() > 0.9) {
            ctx.arc(x, newY, Math.random() * 3 + 1, 0, Math.PI * 2);
          }
          
          currentY = newY;
        }
        
        ctx.stroke();
      }
    };

    // 启动动画
    animate();

    // 清理事件监听器
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
};

// 节点类型定义
interface Node {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
} 