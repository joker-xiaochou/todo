import { TodoList } from "@/components/TodoList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-16 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="w-full max-w-md mx-auto backdrop-blur-sm bg-black/20 rounded-xl p-6 border border-amber-500/20 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-amber-50 drop-shadow-lg">
          科技感待办事项清单
        </h1>
        <TodoList />
      </div>
    </main>
  );
} 