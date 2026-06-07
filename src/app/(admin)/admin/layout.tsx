import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, LayoutDashboard, ArrowLeft } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // In a real production app, verify session.user.role === 'admin'
  if (!session?.user) {
    redirect('/login?callbackUrl=/admin/moderation');
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-black p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <ShieldCheck className="w-8 h-8 text-indigo-500" />
          <div>
            <h1 className="font-black tracking-tight text-xl">Admin</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">TFIverse Portal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/admin/moderation" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white font-semibold transition-all">
            <LayoutDashboard size={18} /> Moderation
          </Link>
          {/* Future admin links go here */}
        </nav>

        <div className="mt-auto pt-8">
          <Link href="/" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors font-medium">
            <ArrowLeft size={16} /> Back to App
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
