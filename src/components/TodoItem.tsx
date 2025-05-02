"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

export interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  isImportant: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ id, text, completed, isImportant, onToggle, onDelete }: TodoItemProps) {
  const checkboxRef = useRef<HTMLButtonElement>(null);
  
  // 为重要任务添加特殊效果
  useEffect(() => {
    if (isImportant && checkboxRef.current) {
      checkboxRef.current.classList.add("glow-checkbox");
    }
  }, [id, isImportant]);
  
  return (
    <div className={`flex items-center justify-between p-4 border-b border-amber-500/20 transition-colors hover:bg-amber-600/10 ${isImportant ? 'bg-amber-900/10' : ''}`}>
      <div className="flex items-center gap-2">
        <Checkbox 
          id={`todo-${id}`}
          ref={checkboxRef}
          checked={completed}
          onCheckedChange={() => onToggle(id)}
          className={isImportant ? "glow-checkbox" : ""}
        />
        <label
          htmlFor={`todo-${id}`}
          className={`text-sm ${completed 
            ? "line-through text-amber-300/40" 
            : "text-amber-50"} ${isImportant ? "font-bold" : ""}`}
        >
          {text}
        </label>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(id)}
        aria-label="删除"
        className="text-amber-300 hover:text-amber-100 hover:bg-amber-700/30"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
} 