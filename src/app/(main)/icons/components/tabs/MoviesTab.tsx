import { FaInstagram, FaTwitter, FaImdb, FaCar, FaHome, FaStar, FaQuoteLeft, FaDumbbell, FaMoneyBillWave, FaFilm, FaCrown, FaChartBar, FaMusic, FaFire, FaFistRaised, FaHandshake, FaPenNib, FaEye, FaCamera, FaIndustry, FaTrophy, FaLightbulb, FaHeart, FaComments, FaGlobe, FaCalendarAlt, FaPlayCircle } from "react-icons/fa";
export default function MoviesTab({ data, theme, category, filmography }: { data: any, theme: any, category?: string, filmography: any[] }) {
  const movies = data.movies || null;
  const directorFilms = data.directorFilms || null;
  return (
              <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 flex items-center gap-3">
                    <FaFilm /> Theatrical Releases
                  </h3>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${theme.badgeTheme}`}>
                    {filmography.length} Films
                  </span>
                </div>

                {filmography.length === 0 ? (
                  <div className="p-16 rounded-[2rem] border border-white/5 bg-[#0a0a0a] text-center">
                    <FaFilm className="text-4xl text-neutral-600 mx-auto mb-4 opacity-50" />
                    <p className="text-neutral-300 font-bold uppercase tracking-widest mb-2">Database Syncing</p>
                    <p className="text-neutral-500 text-sm">Filmography is being imported from TMDB servers.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {filmography.map((credit, idx) => (
                      <div key={idx} className="aspect-[2/3] rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 relative group hover:border-white/20 transition-all duration-500">
                        {credit.moviePoster ? (
                          <img
                            src={credit.moviePoster}
                            alt={credit.movieTitle}
                            className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#111] to-black p-4 text-center">
                            <span className="text-neutral-600 text-[10px] font-bold uppercase tracking-widest mb-2">{credit.movieYear}</span>
                            <span className="text-neutral-400 text-sm font-bold uppercase">{credit.movieTitle}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity z-10" />
                        <div className="absolute bottom-0 left-0 w-full p-4 md:p-5 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-20">
                          <p className="font-black uppercase text-white leading-tight mb-1">{credit.movieTitle}</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${theme.accent}`}>{credit.movieYear}</span>
                            <span className="text-neutral-500 text-[9px]">•</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 block mt-1">{credit.character || credit.job}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
  );
}
