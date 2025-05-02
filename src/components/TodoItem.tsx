"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ id, text, completed, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <Checkbox 
          id={`todo-${id}`}
          checked={completed}
          onCheckedChange={() => onToggle(id)}
        />
        <label
          htmlFor={`todo-${id}`}
          className={`text-sm ${completed ? "line-through text-gray-500" : ""}`}
        >
          {text}
        </label>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(id)}
        aria-label="删除"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
} 