import { auth } from '@/lib/auth';
import Navbar from '@/components/layout/navbar';
import EditMemeClient from './edit-meme-client';

export default async function EditMemePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params; // ✅ Await params
  
  if (!session?.user) {
    return <div>Unauthorized</div>;
  }
  
  return (
    <div className="min-h-screen bg-black">
      <Navbar user={session.user} />
      <EditMemeClient memeId={id} user={session.user} />
    </div>
  );
}
