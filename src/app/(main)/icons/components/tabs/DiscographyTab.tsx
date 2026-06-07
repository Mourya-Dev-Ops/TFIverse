import { FaInstagram, FaTwitter, FaImdb, FaCar, FaHome, FaStar, FaQuoteLeft, FaDumbbell, FaMoneyBillWave, FaFilm, FaCrown, FaChartBar, FaMusic, FaFire, FaFistRaised, FaHandshake, FaPenNib, FaEye, FaCamera, FaIndustry, FaTrophy, FaLightbulb, FaHeart, FaComments, FaGlobe, FaCalendarAlt, FaPlayCircle } from "react-icons/fa";
export default function DiscographyTab({ data, theme, category }: { data: any, theme: any, category?: string }) {
  const chartbusterSongs = data.chartbusterSongs || null;
  const discography = data.discography || null;
  const backgroundScoreMastery = data.backgroundScoreMastery || null;
  const recentFilmography = data.recentFilmography || null;
  return (
              <div className="flex flex-col gap-12">
                
                {backgroundScoreMastery && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Background Score Mastery
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      {backgroundScoreMastery.map((score: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/3 shrink-0">
                            <h4 className="text-lg font-black text-white">{score.film}</h4>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.accent} block mt-1`}>{score.year}</span>
                            {score.impact && <p className="text-neutral-500 text-xs italic mt-3 leading-relaxed border-l-2 border-white/10 pl-3">{score.impact}</p>}
                          </div>
                          <div className="flex-1">
                            {score.bgmApproach && (
                              <div className="mb-4">
                                <h5 className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2">Approach</h5>
                                <p className="text-neutral-300 text-sm leading-relaxed">{score.bgmApproach}</p>
                              </div>
                            )}
                            {score.iconicScenes && (
                              <div className="mb-4">
                                <h5 className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2">Iconic Scenes Enhanced</h5>
                                <div className="flex flex-wrap gap-2">
                                  {score.iconicScenes.map((scene: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[10px] text-neutral-300">{scene}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {score.technicalAchievements && (
                              <div>
                                <h5 className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2">Technical Achievement</h5>
                                <p className="text-neutral-400 text-xs leading-relaxed">{score.technicalAchievements}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {chartbusterSongs && chartbusterSongs.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaMusic /> Chartbuster Anthems
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {chartbusterSongs.map((song: any, idx: number) => (
                        <div key={idx} className="p-5 rounded-2xl bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all">
                          <div className={`absolute top-0 right-0 w-2 h-full ${theme.accentBg} opacity-0 group-hover:opacity-100 transition-opacity`} />
                          <h4 className="text-sm font-bold text-white mb-1">{song.song || song.trackName}</h4>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.accent} block mb-3`}>{song.film} ({song.year})</span>
                          {song.genre && <span className="text-[9px] uppercase tracking-widest px-2 py-1 bg-white/5 rounded inline-block mb-3 text-neutral-400">{song.genre}</span>}
                          {song.impact && <p className="text-neutral-400 text-xs leading-relaxed">{song.impact}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {discography && discography.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFilm /> Iconic Albums
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {discography.map((album: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 flex flex-col items-center justify-center text-center">
                          <span className={`text-2xl mb-2 ${theme.accent}`}>🎵</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">{album.year || album.releaseYear}</span>
                          <h4 className="text-sm font-bold text-neutral-200">{album.album || album.title || album.film}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {recentFilmography && recentFilmography.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFilm /> Iconic Filmography (Musical Milestones)
                    </h3>
                    <div className="space-y-6">
                      {recentFilmography.map((film: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/3 shrink-0">
                            <h4 className="text-lg font-black text-white">{film.film}</h4>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.accent} block mt-1`}>{film.year} • {film.language}</span>
                            {film.director && <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mt-1">Dir: {film.director}</span>}
                            {film.boxOffice && <span className="text-[10px] uppercase tracking-widest text-green-500 block mt-2 font-bold">Box Office: {film.boxOffice}</span>}
                          </div>
                          <div className="flex-1">
                            {film.chartbusterSongs && (
                              <div className="mb-4">
                                <h5 className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2">Chartbusters</h5>
                                <div className="flex flex-wrap gap-2">
                                  {film.chartbusterSongs.map((song: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[10px] text-neutral-300">{song}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {film.musicImpact && (
                              <div className="mb-4">
                                <h5 className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2">Musical Impact</h5>
                                <p className="text-neutral-300 text-sm leading-relaxed">{film.musicImpact}</p>
                              </div>
                            )}
                            {film.significance && (
                              <div>
                                <h5 className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2">Significance</h5>
                                <p className="text-neutral-400 text-xs leading-relaxed italic">{film.significance}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
              </div>
  );
}
