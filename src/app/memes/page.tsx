import { auth } from "@/auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import MemeClient from "@/components/memes/meme-client";
import { getMemes, getMemeOfTheWeek } from "@/app/actions/memes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memes | TFIverse Portal",
  description: "The connected TFI universe through the lens of pure entertainment. Higher quality, lower fluff, total control.",
};

export default async function MemesPage() {
  const session = await auth();
  
  // Parallel fetch for speed
  const [initialMemes, featuredMeme] = await Promise.all([
    getMemes({ sort: "new", limit: 24 }),
    getMemeOfTheWeek()
  ]);

  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      <Navbar user={session?.user} />
      
      <MemeClient 
        initialMemes={initialMemes as any} 
        featuredMeme={featuredMeme as any}
        isAuthenticated={!!session?.user} 
        user={session?.user}
      />

      <Footer />
    </main>
  );
}
