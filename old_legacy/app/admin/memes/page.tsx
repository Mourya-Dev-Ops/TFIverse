import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/navbar';
import AdminMemesClient from './admin-memes-client';

export default async function AdminMemesPage() {
  const session = await auth();
  
  // Check if admin (adjust based on your admin check)
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar user={session.user} />
      <AdminMemesClient />
    </div>
  );
}
