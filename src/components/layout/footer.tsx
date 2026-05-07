import Link from "next/link";
import { FaTwitter, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { HiHeart } from "react-icons/hi2";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] pt-20 pb-10 px-6 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

        {/* Brand */}
        <div className="md:col-span-2">
          <Link href="/" className="text-xl font-bold tracking-tight mb-5 block text-white">
            TFIverse
          </Link>
          <p className="text-white/25 text-sm max-w-xs leading-relaxed mb-6">
            The premium sanctuary for Telugu cinema. Discover heroes, rank movies, join the culture.
          </p>
          <div className="flex items-center gap-3">
            {[
              { Icon: FaTwitter, href: "https://x.com/TFI_verse" },
              { Icon: FaInstagram, href: "https://www.instagram.com/tfiverse.in/" },
              { Icon: FaYoutube, href: "#" },
              { Icon: FaTiktok, href: "#" }
            ].map(({ Icon, href }, i) => (
              <a key={i} href={href} target={href !== "#" ? "_blank" : undefined} rel={href !== "#" ? "noopener noreferrer" : undefined} className="w-9 h-9 rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300">
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
        <div className="flex items-center gap-1.5 text-white/15 text-xs">
          © {new Date().getFullYear()} TFIVERSE. Made with <HiHeart className="w-3.5 h-3.5 text-red-500 mx-0.5 drop-shadow-md" /> for Telugu Cinema.
        </div>
        <p className="text-white/10 text-[10px] font-semibold uppercase tracking-[0.25em]">Built for the culture</p>
      </div>
    </footer>
  );
}
