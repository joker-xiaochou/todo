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
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    // 从本地存储加载待办事项
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todos");
      return saved ? JSON.parse(saved) : [];
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

  // 确保存在特定ID的待办事项，并自动滚动到该项
  useEffect(() => {
    // 特定ID的待办事项
    const targetId = "1746188032914";
    const targetText = "重要任务：添加科技感光标效果 ✨";
    
    // 检查是否已存在该待办事项
    const hasTargetTodo = todos.some(todo => todo.id === targetId);
    
    // 如果不存在，添加它
    if (!hasTargetTodo) {
      setTodos(prevTodos => [
        ...prevTodos,
        {
          id: targetId,
          text: targetText,
          completed: false
        }
      ]);
    }
    
    // 自动滚动到该元素
    setTimeout(() => {
      const targetElement = document.getElementById(`todo-${targetId}`);
      if (targetElement) {
        // 向目标元素滚动，添加平滑效果
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // 添加闪烁效果
        const flashElement = () => {
          const parent = targetElement.parentElement?.parentElement;
          if (parent) {
            parent.style.transition = "background-color 0.5s ease";
            parent.style.backgroundColor = "rgba(255, 173, 0, 0.3)";
            
            setTimeout(() => {
              parent.style.backgroundColor = "transparent";
              
              setTimeout(() => {
                parent.style.backgroundColor = "rgba(255, 173, 0, 0.3)";
                
                setTimeout(() => {
                  parent.style.backgroundColor = "transparent";
                }, 500);
              }, 500);
            }, 500);
          }
        };
        
        // 延迟一下再闪烁，等滚动结束
        setTimeout(flashElement, 500);
      }
    }, 500);
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

  // 添加新待办事项
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos(prevTodos => {
        const newTodos = [
          ...prevTodos,
          {
            id: Date.now().toString(),
            text: newTodo,
            completed: false,
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
    // 防止删除特定ID的待办事项
    if (id === "1746188032914") {
      alert("这是一个重要任务，不能删除！");
      return;
    }
    
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

  // 手动触发烟花效果（仅用于测试）
  const testFireworks = () => {
    setFireConfetti(true);
    completeSoundRef.current?.play();
  };
  
  // 聚焦到特定任务
  const focusOnTask = () => {
    const targetId = "1746188032914";
    const targetElement = document.getElementById(`todo-${targetId}`);
    if (targetElement) {
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // 添加闪烁效果
      const parent = targetElement.parentElement?.parentElement;
      if (parent) {
        parent.style.transition = "background-color 0.5s ease";
        parent.style.backgroundColor = "rgba(255, 173, 0, 0.3)";
        
        setTimeout(() => {
          parent.style.backgroundColor = "transparent";
          
          setTimeout(() => {
            parent.style.backgroundColor = "rgba(255, 173, 0, 0.3)";
            
            setTimeout(() => {
              parent.style.backgroundColor = "transparent";
            }, 500);
          }, 500);
        }, 500);
      }
    }
  };

  return (
    <>
      <Fireworks fire={fireConfetti} onComplete={resetFireworks} />
      
      <Card className="w-full max-w-md mx-auto backdrop-blur-md bg-black/30 border border-amber-500/20 shadow-lg shadow-amber-500/10 transform transition-all duration-500 hover:shadow-amber-500/30">
        <CardHeader className="border-b border-amber-500/20">
          <CardTitle className="text-center text-amber-100 drop-shadow-sm">待办事项清单</CardTitle>
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
              <p className="text-center text-amber-100/70 py-4">暂无待办事项</p>
            ) : (
              todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  id={todo.id}
                  text={todo.text}
                  completed={todo.completed}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))
            )}
          </div>
          
          <div className="mt-4 text-sm text-amber-100/70">
            总计: {todos.length} | 已完成: {todos.filter(t => t.completed).length}
          </div>
          
          <div className="mt-4 text-center flex space-x-2 justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={testFireworks}
              className="border-amber-500/30 text-amber-100 hover:bg-amber-500/20 transition-all duration-300 hover:scale-105"
            >
              测试烟花效果
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={focusOnTask} 
              className="bg-amber-600/30 text-amber-100 border-amber-500/50 hover:bg-amber-500/40 transition-all duration-300 hover:scale-105"
            >
              定位到重要任务
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* 音效元素 - 预加载通过JS实现 */}
    </>
  );
} 