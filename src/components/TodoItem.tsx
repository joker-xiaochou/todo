"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

export interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ id, text, completed, onToggle, onDelete }: TodoItemProps) {
  const checkboxRef = useRef<HTMLButtonElement>(null);
  
  // 添加特殊效果，如果是特定ID的项目
  useEffect(() => {
    const isHighlightedItem = id === "1746188032914";
    if (isHighlightedItem && checkboxRef.current) {
      // 添加呼吸灯效果
      const animateHighlight = () => {
        const checkbox = checkboxRef.current;
        if (checkbox) {
          checkbox.style.transition = "box-shadow 1.5s ease-in-out, transform 1.5s ease-in-out";
          
          // 交替应用效果
          const applyEffect = (strong: boolean) => {
            if (!checkbox) return;
            if (strong) {
              checkbox.style.boxShadow = "0 0 20px rgba(0, 220, 255, 0.9)";
              checkbox.style.transform = "scale(2.2)";
            } else {
              checkbox.style.boxShadow = "0 0 10px rgba(0, 220, 255, 0.6)";
              checkbox.style.transform = "scale(1.8)";
            }
          };
          
          // 交替切换效果
          let isStrong = false;
          const interval = setInterval(() => {
            applyEffect(isStrong);
            isStrong = !isStrong;
          }, 1500);
          
          // 初始应用效果
          applyEffect(false);
          
          return () => clearInterval(interval);
        }
      };
      
      // 启动动画
      const cleanup = animateHighlight();
      return cleanup;
    }
  }, [id]);
  
  return (
    <div className="flex items-center justify-between p-4 border-b border-cyan-200/20 transition-colors hover:bg-cyan-600/10">
      <div className="flex items-center gap-2">
        <Checkbox 
          id={`todo-${id}`}
          ref={checkboxRef}
          checked={completed}
          onCheckedChange={() => onToggle(id)}
          className={id === "1746188032914" ? "glow-checkbox" : ""}
        />
        <label
          htmlFor={`todo-${id}`}
          className={`text-sm ${completed 
            ? "line-through text-cyan-300/40" 
            : "text-cyan-50"} ${id === "1746188032914" ? "font-bold" : ""}`}
        >
          {text}
        </label>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(id)}
        aria-label="删除"
        className="text-cyan-300 hover:text-cyan-100 hover:bg-cyan-700/30"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
} 