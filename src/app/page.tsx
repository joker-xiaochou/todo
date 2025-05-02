import { TodoList } from "@/components/TodoList";

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-cyan-50 drop-shadow-lg">
          科技感待办事项清单
        </h1>
        <TodoList />
      </div>
    </div>
  );
} 