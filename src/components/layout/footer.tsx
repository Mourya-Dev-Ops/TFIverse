import Link from "next/link";
import { FaTwitter, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] pt-20 pb-10 px-6 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand */}
        <div className="md:col-span-2">
          <Link href="/" className="text-xl font-bold tracking-tight mb-5 block text-white">
            TFIVERSE
          </Link>
          <p className="text-white/25 text-sm max-w-xs leading-relaxed mb-6">
            The premium sanctuary for Telugu cinema. Discover heroes, rank movies, join the culture.
          </p>
          <div className="flex items-center gap-3">
            {[FaTwitter, FaInstagram, FaYoutube, FaTiktok].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full border border-white/[0.06] flex items-center justify-center text-white/25 hover:text-white/60 hover:border-white/15 transition-all">
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white/50 font-semibold text-[11px] uppercase tracking-[0.2em] mb-6">Universe</h4>
          <ul className="space-y-3 text-white/25 text-sm">
            <li><Link href="/heroes" className="hover:text-white/60 transition-colors">Heroes</Link></li>
            <li><Link href="/movies" className="hover:text-white/60 transition-colors">Movies</Link></li>
            <li><Link href="/tier-list" className="hover:text-white/60 transition-colors">Tier Lists</Link></li>
            <li><Link href="/box-office" className="hover:text-white/60 transition-colors">Box Office</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white/50 font-semibold text-[11px] uppercase tracking-[0.2em] mb-6">Support</h4>
          <ul className="space-y-3 text-white/25 text-sm">
            <li><Link href="/about" className="hover:text-white/60 transition-colors">About</Link></li>
            <li><Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link></li>
            <li><Link href="/contact" className="hover:text-white/60 transition-colors">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-white/15 text-xs">© {new Date().getFullYear()} TFIVERSE</p>
        <p className="text-white/10 text-[10px] font-semibold uppercase tracking-[0.25em]">Built for the culture</p>
      </div>
    </footer>
  );
}
