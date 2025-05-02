"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TodoItem } from "./TodoItem";
import { Fireworks } from "./Fireworks";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  isImportant: boolean; // 添加重要任务标记
}

// 添加一个用于处理存储的Todo类型
interface StoredTodo {
  id: string;
  text: string;
  completed: boolean;
  isImportant?: boolean;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    // 从本地存储加载待办事项
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todos");
      // 确保所有加载的待办事项都有isImportant属性
      if (saved) {
        const parsedTodos = JSON.parse(saved) as StoredTodo[];
        return parsedTodos.map((todo) => ({
          ...todo,
          isImportant: todo.isImportant !== undefined ? todo.isImportant : true
        }));
      }
      return [];
    }
    return [];
  });
  
  const [newTodo, setNewTodo] = useState("");
  const [fireConfetti, setFireConfetti] = useState(false);
  const previousCompletedCount = useRef(0);
  // 添加音效引用
  const addSoundRef = useRef<HTMLAudioElement | null>(null);
  const completeSoundRef = useRef<HTMLAudioElement | null>(null);
  const deleteSoundRef = useRef<HTMLAudioElement | null>(null);

  // 初始化音效
  useEffect(() => {
    if (typeof window !== "undefined") {
      addSoundRef.current = new Audio("/sounds/add.mp3");
      completeSoundRef.current = new Audio("/sounds/complete.mp3");
      deleteSoundRef.current = new Audio("/sounds/delete.mp3");
      
      // 预加载音效
      addSoundRef.current.load();
      completeSoundRef.current.load();
      deleteSoundRef.current.load();
    }
  }, []);

  // 将待办事项保存到本地存储
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  // 检测完成项目数量变化，如果增加则触发烟花特效
  useEffect(() => {
    const completedCount = todos.filter(t => t.completed).length;
    
    if (completedCount > previousCompletedCount.current && completedCount > 0) {
      setFireConfetti(true);
      // 播放完成音效
      completeSoundRef.current?.play();
    }
    
    previousCompletedCount.current = completedCount;
  }, [todos]);

  // 添加新待办事项（全部为重要任务）
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos(prevTodos => {
        const newTodos = [
          ...prevTodos,
          {
            id: Date.now().toString(),
            text: newTodo,
            completed: false,
            isImportant: true
          },
        ];
        
        // 播放添加音效
        addSoundRef.current?.play();
        
        return newTodos;
      });
      setNewTodo("");
    }
  };

  // 切换待办事项的完成状态
  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const newState = { ...todo, completed: !todo.completed };
          if (newState.completed) {
            // 播放完成音效
            completeSoundRef.current?.play();
          }
          return newState;
        }
        return todo;
      })
    );
  };

  // 删除待办事项
  const deleteTodo = (id: string) => {
    // 播放删除音效
    deleteSoundRef.current?.play();
    
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 处理输入框回车键按下事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  // 重置烟花状态
  const resetFireworks = () => {
    setFireConfetti(false);
  };

  return (
    <>
      <Fireworks fire={fireConfetti} onComplete={resetFireworks} />
      
      <Card className="w-full max-w-md mx-auto backdrop-blur-md bg-black/30 border border-amber-500/20 shadow-lg shadow-amber-500/10 transform transition-all duration-500 hover:shadow-amber-500/30">
        <CardHeader className="border-b border-amber-500/20">
          <CardTitle className="text-center text-amber-100 drop-shadow-sm">重要任务</CardTitle>
        </CardHeader>
        <CardContent className="bg-black/40">
          <div className="flex space-x-2 mb-4 mt-4">
            <Input
              placeholder="添加新任务..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-black/50 border-amber-500/30 text-amber-50 placeholder:text-amber-200/50 transition-all duration-300 focus:border-amber-400 focus:ring-amber-400/50"
            />
            <Button 
              onClick={addTodo}
              className="bg-amber-600/80 hover:bg-amber-500 text-white transition-all duration-300 hover:scale-105"
            >
              添加
            </Button>
          </div>
          
          <div className="divide-y divide-amber-500/20">
            {todos.length === 0 ? (
              <p className="text-center text-amber-100/70 py-4">暂无任务</p>
            ) : (
              todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  id={todo.id}
                  text={todo.text}
                  completed={todo.completed}
                  isImportant={todo.isImportant}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))
            )}
          </div>
          
          <div className="mt-4 text-sm text-amber-100/70">
            总计: {todos.length} | 已完成: {todos.filter(t => t.completed).length}
          </div>
        </CardContent>
      </Card>
      
      {/* 音效元素 - 预加载通过JS实现 */}
    </>
  );
} 