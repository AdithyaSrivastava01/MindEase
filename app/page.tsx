import Chat from './components/Chat';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

export default function Home() {
  return (
    <main className="h-screen relative">
      <Chat />
      
      {/* Floating Dashboard Button */}
      <Link href="/dashboard">
        <button className="fixed bottom-6 left-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50">
          <LayoutDashboard className="w-6 h-6" />
        </button>
      </Link>
    </main>
  );
}