import { auth } from '@/lib/auth';
import Navbar from '@/components/layout/navbar';
import MemesClient from './memes-client';

export default async function MemesPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-black">
      <Navbar user={session?.user} />
      <MemesClient user={session?.user} />
    </div>
  );
}
