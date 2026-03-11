import Link from 'next/link';
import { Home, Compass, User, Settings, LogOut } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="font-heading text-xl font-bold tracking-tight text-primary">
            GoodMatter
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/dashboard/investor" className="flex items-center space-x-3 px-3 py-2 bg-primary/5 text-primary rounded-lg font-medium">
            <Compass size={20} />
            <span>Dealflow</span>
          </Link>
          <Link href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-500 hover:bg-gray-50 hover:text-primary rounded-lg font-medium transition">
            <User size={20} />
            <span>Profile</span>
          </Link>
          <Link href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-500 hover:bg-gray-50 hover:text-primary rounded-lg font-medium transition">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center space-x-3 w-full px-3 py-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition">
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
