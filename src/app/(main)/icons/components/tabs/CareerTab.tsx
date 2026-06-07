import { FaChartBar, FaCompactDisc, FaSpotify, FaYoutube, FaMusic, FaCalendarAlt, FaFilm, FaBullhorn, FaBriefcase, FaBolt, FaBuilding, FaCut, FaStar } from "react-icons/fa";

export default function CareerTab({ data, theme }: { data: any, theme: any }) {
  const careerRetrospective = data.careerRetrospective || null;
  const careerStats = data.careerStats || data.careerStatistics || data.commercialStatistics || data.villainCareerStats || data.comedyCareerStats || data.characterStatistics || data.singingStatistics || data.productionStatistics || data.cinematographyStatistics || data.editingStatistics || data.lyricalStatistics || data.choreographyStatistics || data.stuntStatistics || data.artDirectionStatistics || data.costumeStatistics || data.vfxStatistics || data.coordinationStatistics || data.proStatistics || null;
  const boxOfficeMilestones = data.boxOfficeMilestones || null;
  const awardsByType = data.awardsBYType || data.awardsByType || null;
  const genreStrength = data.genreStrength || data.genreExpertise || data.genreSpecialization || null;
  const awards = data.awards || data.beautyAwards || data.fashionAwards || data.awardsAndRecognition || [];
  const streamingDominance = data.streamingDominance || data.streamingPresence || null;
  const chartbusterSongs = data.chartbusterSongs || null;
  const songsSung = data.songsSung || null;
  const productionByDecade = data.productionByDecade || null;
  const landmarkProductions = data.landmarkProductions || null;
  const strategicPromotions = data.strategicPromotions || null;
  const productionsCoordinated = data.productionsCoordinated || null;
  const iconicVFXSequences = data.iconicVFXSequences || null;
  const vfxStudioAssociation = data.vfxStudioAssociation || null;
  const iconicCharacterCostumes = data.iconicCharacterCostumes || null;
  const iconicSetDesigns = data.iconicSetDesigns || null;
  const iconicActionSequences = data.iconicActionSequences || null;
  const iconicChoreography = data.iconicChoreography || null;
  const iconicSongsWritten = data.iconicSongsWritten || null;
  const iconicEditedFilms = data.iconicEditedFilms || null;
  const iconicVisuallyStunningFilms = data.iconicVisuallyStunningFilms || null;
  const commercialImpact = data.commercialImpact || null;
  const careersTimeline = data.careersTimeline || null;

  return (
    <>
      {/* Career Retrospective (Legend) */}
      {careerRetrospective && (
        <div className="mb-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
            <FaChartBar /> Career Retrospective
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Total Films</span>
              <span className={`text-3xl font-black text-white`}>{careerRetrospective.totalCareerFilms}</span>
            </div>
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Hit Ratio</span>
              <span className={`text-3xl font-black ${theme.accent}`}>{careerRetrospective.hitPercentage?.replace(/[^0-9%]/g, '') || "N/A"}</span>
            </div>
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center col-span-2">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Peak Era</span>
              <span className={`text-lg font-black text-white block`}>{careerRetrospective.peakPeriod?.split(' - ')[0] || "N/A"}</span>
            </div>
          </div>

          <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 mb-8">
            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>The Arc</h4>
            <p className="text-neutral-300 text-sm leading-relaxed">{careerRetrospective.careerArc}</p>
          </div>

          {/* Decade by Decade */}
          {careerRetrospective.byDecade && (
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-neutral-500">Decade Breakdown</h4>
              <div className="space-y-4">
                {Object.entries(careerRetrospective.byDecade).map(([decade, data]: [string, any]) => {
                  if (!data || !data.contribution) return null;
                  return (
                    <div key={decade} className="p-6 rounded-2xl bg-[#050505] border border-white/5 flex flex-col md:flex-row gap-6 relative group overflow-hidden">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-20 group-hover:opacity-100 transition-opacity`} />
                      <div className="w-24 shrink-0">
                        <span className={`text-2xl font-black ${theme.accent}`}>{decade}</span>
                        {data.filmCount && <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block mt-1">{data.filmCount} Films</span>}
                      </div>
                      <div className="flex-1">
                        {data.peakStatus && <h5 className="text-sm font-bold text-white mb-2">{data.peakStatus}</h5>}
                        <p className="text-xs text-neutral-400 leading-relaxed mb-3">{data.contribution}</p>
                        {data.majorFilms && data.majorFilms.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {data.majorFilms.map((film: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-white/5 rounded text-[9px] uppercase tracking-widest text-neutral-300 border border-white/5">
                                {film}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Career Stats Hero */}
      {careerStats && (
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2">Career Dashboard</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {(careerStats.totalMovies || careerStats.totalFilms || careerStats.totalFilmsDirected) && (
              <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                <span className={`text-3xl font-black ${theme.accent}`}>{careerStats.totalMovies || careerStats.totalFilms || careerStats.totalFilmsDirected}</span>
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mt-1">Total Films</span>
              </div>
            )}
            {(careerStats.totalBlockbusters || careerStats.blockbusters) && (
              <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                <span className={`text-3xl font-black ${theme.accent}`}>{careerStats.totalBlockbusters || careerStats.blockbusters}</span>
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mt-1">Blockbusters</span>
              </div>
            )}
            {careerStats.hitPercentage && (
              <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                <span className={`text-3xl font-black ${theme.accent}`}>{careerStats.hitPercentage}</span>
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mt-1">Hit Rate</span>
              </div>
            )}
            {careerStats.nationalAwards && (
              <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                <span className={`text-3xl font-black ${theme.accent}`}>{careerStats.nationalAwards}</span>
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mt-1">National Awards</span>
              </div>
            )}
            {(careerStats.yearsActive || careerStats.careerSpan) && (
              <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                <span className={`text-3xl font-black ${theme.accent}`}>{careerStats.yearsActive || careerStats.careerSpan}</span>
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mt-1">Years Active</span>
              </div>
            )}
          </div>

          {/* Records */}
          {careerStats.records && careerStats.records.length > 0 && (
            <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 mb-8">
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-6 ${theme.accent}`}>Records & Firsts</h4>
              <ul className="space-y-3">
                {careerStats.records.map((r: string, i: number) => (
                  <li key={i} className="text-neutral-400 text-xs leading-relaxed flex gap-3"><span className={`${theme.accent} shrink-0 font-black`}>★</span>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Milestones Timeline */}
          {careerStats.milestones && careerStats.milestones.length > 0 && (
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2">Career Timeline</h4>
              <div className="space-y-3">
                {careerStats.milestones.map((m: string, i: number) => (
                  <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
                    <span className={`text-xs font-black ${theme.accent} shrink-0 w-12`}>{m.substring(0, 4)}</span>
                    <p className="text-neutral-400 text-xs leading-relaxed">{m.substring(6)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Box Office Milestones */}
      {boxOfficeMilestones && (
        <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 mb-8 mt-8">
          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-6 ${theme.accent}`}>Box Office Milestones</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl border border-white/5 bg-white/5">
              <span className="text-xs text-neutral-400 block mb-1">Career Gross</span>
              <span className="text-lg font-black text-white">{boxOfficeMilestones.totalCareerBoxOffice || 'N/A'}</span>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/5">
              <span className="text-xs text-neutral-400 block mb-1">Hit Rate</span>
              <span className="text-lg font-black text-white">{boxOfficeMilestones.hitPercentage || 'N/A'}</span>
            </div>
          </div>
          {boxOfficeMilestones.highestGrossingFilms && (
            <div className="mt-4">
              <h5 className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-3">Highest Grossing Films</h5>
              <div className="space-y-2">
                {boxOfficeMilestones.highestGrossingFilms.map((film: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-black/50 border border-white/5">
                    <span className="text-xs font-bold text-neutral-200">{film.film} <span className="text-[10px] font-normal text-neutral-500">({film.year})</span></span>
                    <span className={`text-xs font-black ${theme.accent}`}>{film.collection}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Awards By Type */}
      {awardsByType && (
        <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 mb-8 mt-8">
          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-6 ${theme.accent}`}>Awards Overview</h4>
          <div className="grid grid-cols-2 gap-4">
            {awardsByType.totalAwardsWon && (
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-xs text-neutral-400">Total Won</span>
                <span className="text-sm font-black text-white">{awardsByType.totalAwardsWon}</span>
              </div>
            )}
            {awardsByType.totalNominations && (
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-xs text-neutral-400">Nominations</span>
                <span className="text-sm font-black text-white">{awardsByType.totalNominations}</span>
              </div>
            )}
            {awardsByType.nationalAwards && (
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-xs text-neutral-400">National</span>
                <span className="text-sm font-black text-white">{awardsByType.nationalAwards}</span>
              </div>
            )}
            {awardsByType.stateAwards && (
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-xs text-neutral-400">State</span>
                <span className="text-sm font-black text-white">{awardsByType.stateAwards}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Genre Strength Radar */}
      {genreStrength && (
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Genre Mastery</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(genreStrength).map(([genre, data]: [string, any]) => (
              <div key={genre} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 group hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">{data.genre || genre}</h4>
                  <span className={`text-lg font-black ${theme.accent}`}>{data.rating || data.score || 0}<span className="text-neutral-600 text-xs">/100</span></span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full mb-3 overflow-hidden">
                  <div className={`h-full ${theme.accentBg} rounded-full`} style={{ width: `${data.rating || data.score || 0}%` }} />
                </div>
                
                {data.strength && <p className="text-neutral-500 text-[10px] leading-relaxed mb-3">{data.strength}</p>}
                {data.strengths && (
                  <ul className="space-y-1 mb-3">
                    {data.strengths.map((s: string, i: number) => (
                      <li key={i} className="text-neutral-500 text-[10px] leading-relaxed">• {s}</li>
                    ))}
                  </ul>
                )}
                
                {(data.iconicFilm || (data.iconicFilms && data.iconicFilms.length > 0)) && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {data.iconicFilm && (
                      <span className="px-2 py-0.5 bg-white/5 rounded text-[8px] uppercase tracking-widest text-neutral-400 border border-white/5">{data.iconicFilm}</span>
                    )}
                    {data.iconicFilms?.map((f: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-[8px] uppercase tracking-widest text-neutral-400 border border-white/5">{f}</span>
                    ))}
                  </div>
                )}
                {data.notes && <p className="text-neutral-600 text-[10px] leading-relaxed mt-2 italic">{data.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Awards */}
      {awards.length > 0 && (
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Awards & Recognition</h3>
          <div className="space-y-3">
            {awards.map((a: any, idx: number) => (
              <div key={idx} className="p-5 rounded-xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-sm font-black text-white">{a.awardName}</h4>
                  <span className="text-[10px] text-neutral-500">{a.givenBy} • {a.category}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-sm font-black ${theme.accent}`}>{a.year}</span>
                  {a.won && <span className="text-[9px] text-green-500 block uppercase tracking-widest font-bold">Won</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Streaming Dominance */}
      {streamingDominance && (
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8 flex items-center gap-2"><FaChartBar /> Streaming & Digital Dominance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {streamingDominance.digitalInfluenceScore && (
              <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 md:col-span-2 text-center flex flex-col items-center justify-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Digital Influence Score</span>
                <span className={`text-6xl font-black ${theme.accent}`}>{streamingDominance.digitalInfluenceScore}</span>
              </div>
            )}
            
            {Object.entries(streamingDominance).map(([key, value]: [string, any]) => {
              if (key === 'digitalInfluenceScore') return null;
              if (typeof value === 'string') {
                return (
                  <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                    <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                    <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                  </div>
                );
              } else if (typeof value === 'object' && value !== null) {
                return (
                  <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                    <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-white capitalize flex items-center gap-2`}>
                      {key} Platform
                    </h4>
                    <div className="space-y-3">
                      {value.followers && (
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-xs text-neutral-400">Followers</span>
                          <span className={`text-sm font-black ${theme.accent}`}>{value.followers.toLocaleString()}</span>
                        </div>
                      )}
                      {value.subscribers && (
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-xs text-neutral-400">Subscribers</span>
                          <span className={`text-sm font-black text-red-500`}>{value.subscribers.toLocaleString()}</span>
                        </div>
                      )}
                      {value.totalListens && (
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-xs text-neutral-400">Total Listens</span>
                          <span className="text-sm font-black text-white">{value.totalListens}</span>
                        </div>
                      )}
                      {value.monthlyListeners && (
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-xs text-neutral-400">Monthly Listeners</span>
                          <span className={`text-sm font-black ${theme.accent}`}>{value.monthlyListeners.toLocaleString()}</span>
                        </div>
                      )}
                      {value.totalStreams && (
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-xs text-neutral-400">Total Streams</span>
                          <span className="text-sm font-black text-white">{value.totalStreams}</span>
                        </div>
                      )}
                      {value.subscribersOnChannel && (
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-xs text-neutral-400">Subscribers</span>
                          <span className={`text-sm font-black text-red-500`}>{value.subscribersOnChannel.toLocaleString()}</span>
                        </div>
                      )}
                      {value.mostViewedSong && (
                        <div className="flex flex-col gap-1 border-b border-white/5 pb-2">
                          <span className="text-xs text-neutral-400">Most Viewed Song</span>
                          <span className="text-xs font-black text-white">{value.mostViewedSong}</span>
                        </div>
                      )}
                      {value.totalViews && (
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-xs text-neutral-400">Total Views</span>
                          <span className="text-sm font-black text-white">{value.totalViews}</span>
                        </div>
                      )}
                      {value.topSongs && Array.isArray(value.topSongs) && (
                        <div className="flex flex-col gap-1 mt-2">
                          <span className="text-xs text-neutral-400 mb-1">Top Songs</span>
                          <div className="flex flex-wrap gap-1">
                            {value.topSongs.map((song: string, i: number) => (
                              <span key={i} className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-neutral-300">{song}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}

      {/* Singer: Chartbuster Songs */}
      {chartbusterSongs && Array.isArray(chartbusterSongs) && chartbusterSongs.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
            <FaCompactDisc /> Chartbuster Songs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chartbusterSongs.map((song: any, idx: number) => (
              <div key={idx} className="p-6 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="pl-4">
                  <div className="flex flex-col gap-1 mb-3">
                    <h4 className="text-lg font-black text-white">{song.song || song.title}</h4>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accent}`}>{song.film} ({song.year})</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {song.musicDirector && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-neutral-300">MD: {song.musicDirector}</span>}
                    {song.chartPerformance && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-neutral-300">📈 {song.chartPerformance}</span>}
                  </div>
                  {song.significance && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{song.significance}</p>}
                  {song.culturalImpact && <p className="text-neutral-500 text-[10px] leading-relaxed mt-2 italic border-l-2 border-white/10 pl-3">{song.culturalImpact}</p>}
                  {(song.spotifyPlays || song.youtubeViews) && (
                    <div className="flex gap-4 mt-3 pt-3 border-t border-white/5">
                      {song.spotifyPlays && <span className="text-[10px] font-black text-neutral-400"><FaSpotify className="inline mr-1" /> {song.spotifyPlays}</span>}
                      {song.youtubeViews && <span className="text-[10px] font-black text-neutral-400"><FaYoutube className="inline mr-1 text-red-500" /> {song.youtubeViews}</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Singer: Songs Sung */}
      {songsSung && Array.isArray(songsSung) && songsSung.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
            <FaMusic /> Iconic Discography
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {songsSung.map((song: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors flex justify-between items-center group">
                <div>
                  <h4 className="text-sm font-black text-white mb-1 group-hover:text-neutral-200 transition-colors">{song.song || song.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-500">{song.film}</span>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${theme.accent}`}>{song.language || 'Telugu'}</span>
                  </div>
                </div>
                <span className="text-xs font-black text-neutral-600">{song.year}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Producer: Production By Decade */}
      {productionByDecade && (
        <div className="mb-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
            <FaCalendarAlt /> Era Dominance
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(productionByDecade).map(([decade, details]: [string, any]) => (
              <div key={decade} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center group hover:border-white/10 transition-colors">
                <span className={`text-2xl font-black ${theme.accent} mb-2 block`}>{decade}</span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-3">{details.films} Films</span>
                {details.hits && <span className="text-xs font-black text-white block mb-1">{details.hits} Hits</span>}
                {details.blockbusters && <span className={`text-[10px] font-bold ${theme.accent} block`}>{details.blockbusters} Blockbusters</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Producer: Landmark Productions */}
      {landmarkProductions && Array.isArray(landmarkProductions) && landmarkProductions.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
            <FaFilm /> Landmark Productions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {landmarkProductions.map((film: any, idx: number) => (
              <div key={idx} className="p-6 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="pl-4">
                  <div className="flex flex-col gap-1 mb-3">
                    <h4 className="text-lg font-black text-white">{film.title}</h4>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accent}`}>{film.year}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {film.director && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-neutral-300">Dir: {film.director}</span>}
                    {film.boxOffice && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-green-500">BO: {film.boxOffice}</span>}
                  </div>
                  {film.significance && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{film.significance}</p>}
                  {film.industryImpact && <p className="text-neutral-500 text-[10px] leading-relaxed mt-2 italic border-l-2 border-white/10 pl-3">{film.industryImpact}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRO: Strategic Promotions */}
      {strategicPromotions && Array.isArray(strategicPromotions) && strategicPromotions.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
            <FaBullhorn /> Campaign Mastercuts
          </h3>
          <div className="space-y-4">
            {strategicPromotions.map((camp: any, idx: number) => (
              <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="pl-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-xl font-black text-white">{camp.film} ({camp.year})</h4>
                      <span className={`text-xs font-black uppercase tracking-widest ${theme.accent}`}>Status: {camp.successMetric || 'Completed'}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-white/5">
                    <div>
                      {camp.strategy && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Promotion Strategy</h5>
                          <p className="text-neutral-300 text-sm leading-relaxed">{camp.strategy}</p>
                        </div>
                      )}
                      {camp.innovation && (
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Innovation</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed italic border-l-2 border-white/10 pl-3">{camp.innovation}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      {camp.mediaOutlets && Array.isArray(camp.mediaOutlets) && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Media Channels</h5>
                          <div className="flex flex-wrap gap-1">
                            {camp.mediaOutlets.map((outlet: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-neutral-300">{outlet}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {camp.successMetric && (
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Success Metric</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed border-l-2 border-white/10 pl-3">{camp.successMetric}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Line Producer: Productions Coordinated */}
      {productionsCoordinated && Array.isArray(productionsCoordinated) && productionsCoordinated.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
            <FaBriefcase /> Logistics Mastercuts
          </h3>
          <div className="space-y-4">
            {productionsCoordinated.map((prod: any, idx: number) => (
              <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="pl-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-xl font-black text-white">{prod.film} ({prod.year})</h4>
                      <span className={`text-xs font-black uppercase tracking-widest ${theme.accent}`}>Dir: {prod.director} | Producer: {prod.producer}</span>
                    </div>
                    {prod.budget && (
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-green-500">💰 {prod.budget}</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-white/5">
                    <div>
                      {prod.role && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Role</h5>
                          <p className="text-neutral-300 text-sm leading-relaxed font-bold">{prod.role}</p>
                        </div>
                      )}
                      {prod.coordinationWork && (
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Coordination Work</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed italic border-l-2 border-white/10 pl-3">{prod.coordinationWork}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      {prod.challenges && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Challenges Solved</h5>
                          <p className="text-neutral-300 text-xs leading-relaxed">{prod.challenges}</p>
                        </div>
                      )}
                      {prod.locationsManaged && (
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Locations</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed border-l-2 border-white/10 pl-3">{prod.locationsManaged}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VFX Supervisor: Iconic VFX Sequences */}
      {iconicVFXSequences && Array.isArray(iconicVFXSequences) && iconicVFXSequences.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
            <FaBolt /> Legendary VFX Mastercuts
          </h3>
          <div className="space-y-4">
            {iconicVFXSequences.map((seq: any, idx: number) => (
              <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="pl-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-xl font-black text-white">{seq.film} ({seq.year})</h4>
                      <span className={`text-xs font-black uppercase tracking-widest ${theme.accent}`}>Dir: {seq.director}</span>
                    </div>
                    {seq.awards && Array.isArray(seq.awards) && (
                      <div className="flex flex-wrap gap-2 justify-end">
                        {seq.awards.map((award: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-yellow-500">🏆 {award}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-white/5">
                    <div>
                      {seq.sequence && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Sequence Description</h5>
                          <p className="text-neutral-300 text-sm leading-relaxed">{seq.sequence}</p>
                        </div>
                      )}
                      {seq.vfxType && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">VFX Type</h5>
                          <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] text-neutral-400">{seq.vfxType}</span>
                        </div>
                      )}
                      {seq.softwareUsed && Array.isArray(seq.softwareUsed) && (
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Tech Stack</h5>
                          <div className="flex flex-wrap gap-1">
                            {seq.softwareUsed.map((tech: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-neutral-300">{tech}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      {seq.technicalAchievement && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Technical Achievement</h5>
                          <p className="text-neutral-300 text-xs leading-relaxed">{seq.technicalAchievement}</p>
                        </div>
                      )}
                      {seq.visualImpact && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Visual Impact</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed border-l-2 border-white/10 pl-3">{seq.visualImpact}</p>
                        </div>
                      )}
                      {seq.industryImpact && (
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Industry Impact</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed italic border-l-2 border-white/10 pl-3">{seq.industryImpact}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VFX Supervisor: VFX Studio Association */}
      {vfxStudioAssociation && (
        <div className="mb-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
            <FaBuilding /> Studio Ecosystem
          </h3>
          <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(vfxStudioAssociation).map(([key, value]: [string, any]) => (
                <div key={key} className="pl-4">
                  <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  {typeof value === 'string' ? (
                    <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                  ) : Array.isArray(value) ? (
                    <ul className="space-y-1">
                      {value.map((item: string, i: number) => (
                        <li key={i} className="text-neutral-300 text-sm leading-relaxed flex items-start gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${theme.accentBg} mt-1.5 flex-shrink-0`} /> <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Costume Designer: Iconic Character Costumes */}
      {iconicCharacterCostumes && Array.isArray(iconicCharacterCostumes) && iconicCharacterCostumes.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
            <FaCut /> Iconic Wardrobes
          </h3>
          <div className="space-y-4">
            {iconicCharacterCostumes.map((wardrobe: any, idx: number) => (
              <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="pl-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-xl font-black text-white">{wardrobe.film}</h4>
                      <span className={`text-xs font-black uppercase tracking-widest ${theme.accent}`}>{wardrobe.year} • Character: {wardrobe.character}</span>
                    </div>
                    {wardrobe.awards && Array.isArray(wardrobe.awards) && (
                      <div className="flex flex-wrap gap-2 justify-end">
                        {wardrobe.awards.map((award: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-yellow-500">🏆 {award}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-white/5">
                    <div>
                      {wardrobe.costumeDescription && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Costume Details</h5>
                          <p className="text-neutral-300 text-sm leading-relaxed">{wardrobe.costumeDescription}</p>
                        </div>
                      )}
                      {wardrobe.fabrics && Array.isArray(wardrobe.fabrics) && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {wardrobe.fabrics.map((fabric: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[9px] text-neutral-400 italic">🧵 {fabric}</span>
                          ))}
                        </div>
                      )}
                      {wardrobe.designProcess && (
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Design Process</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed italic border-l-2 border-white/10 pl-3">{wardrobe.designProcess}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      {wardrobe.visualImpact && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Visual Impact</h5>
                          <p className="text-neutral-300 text-xs leading-relaxed">{wardrobe.visualImpact}</p>
                        </div>
                      )}
                      {wardrobe.characterDefinition && (
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Character Definition</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed border-l-2 border-white/10 pl-3">{wardrobe.characterDefinition}</p>
                        </div>
                      )}
                      {wardrobe.periodAuthenticity && (
                        <div className="mt-4 pt-4 border-t border-white/5">
                          <p className="text-[9px] uppercase text-neutral-600 font-bold tracking-tighter">Period Authenticity: {wardrobe.periodAuthenticity}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Art Director: Iconic Set Designs */}
      {iconicSetDesigns && Array.isArray(iconicSetDesigns) && iconicSetDesigns.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
            <FaFilm /> Iconic Set Designs
          </h3>
          <div className="space-y-4">
            {iconicSetDesigns.map((set: any, idx: number) => (
              <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="pl-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-xl font-black text-white">{set.film}</h4>
                      <span className={`text-xs font-black uppercase tracking-widest ${theme.accent}`}>{set.year} • Dir: {set.director}</span>
                    </div>
                    {set.awards && Array.isArray(set.awards) && (
                      <div className="flex flex-wrap gap-2 justify-end">
                        {set.awards.map((award: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-yellow-500">🏆 {award}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-white/5">
                    <div>
                      {set.setDescription && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Set Description</h5>
                          <p className="text-neutral-300 text-sm leading-relaxed">{set.setDescription}</p>
                        </div>
                      )}
                      {set.scale && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Scale</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed">{set.scale}</p>
                        </div>
                      )}
                      {set.constructionDetails && (
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Construction</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed italic border-l-2 border-white/10 pl-3">{set.constructionDetails}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      {set.visualImpact && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Visual Impact</h5>
                          <p className="text-neutral-300 text-xs leading-relaxed">{set.visualImpact}</p>
                        </div>
                      )}
                      {set.industryImpact && (
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Industry Impact</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed border-l-2 border-white/10 pl-3">{set.industryImpact}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stunt Director: Iconic Action Sequences */}
      {iconicActionSequences && Array.isArray(iconicActionSequences) && iconicActionSequences.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
            <FaFilm /> Iconic Action Sequences
          </h3>
          <div className="space-y-4">
            {iconicActionSequences.map((seq: any, idx: number) => (
              <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="pl-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-xl font-black text-white">{seq.film}</h4>
                      <span className={`text-xs font-black uppercase tracking-widest ${theme.accent}`}>{seq.year} • Dir: {seq.director}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {seq.scale && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-red-400">{seq.scale}</span>}
                      {seq.actionType && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-neutral-300">{seq.actionType}</span>}
                      {seq.awards && Array.isArray(seq.awards) && seq.awards.map((award: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-yellow-500">🏆 {award}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-white/5">
                    <div>
                      {seq.sequence && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Sequence</h5>
                          <p className="text-neutral-300 text-sm leading-relaxed">{seq.sequence}</p>
                        </div>
                      )}
                      {seq.innovation && (
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Innovation</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed italic border-l-2 border-white/10 pl-3">{seq.innovation}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      {seq.technicalAchievement && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Technical Achievement</h5>
                          <p className="text-neutral-300 text-xs leading-relaxed">{seq.technicalAchievement}</p>
                        </div>
                      )}
                      {seq.industryImpact && (
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Industry Impact</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed border-l-2 border-white/10 pl-3">{seq.industryImpact}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Choreographer: Iconic Choreography */}
      {iconicChoreography && Array.isArray(iconicChoreography) && iconicChoreography.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
            <FaFilm /> Iconic Choreography
          </h3>
          <div className="space-y-4">
            {iconicChoreography.map((item: any, idx: number) => (
              <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="pl-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-xl font-black text-white">{item.song}</h4>
                      <span className={`text-xs font-black uppercase tracking-widest ${theme.accent}`}>{item.film} ({item.year}) • {item.hero}</span>
                    </div>
                    {item.awards && Array.isArray(item.awards) && (
                      <div className="flex flex-wrap gap-2 justify-end">
                        {item.awards.map((award: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-yellow-500">🏆 {award}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-white/5">
                    <div>
                      {item.danceStyle && (
                        <div className="mb-3">
                          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-neutral-300">{item.danceStyle}</span>
                        </div>
                      )}
                      {item.significance && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Significance</h5>
                          <p className="text-neutral-300 text-sm leading-relaxed">{item.significance}</p>
                        </div>
                      )}
                      {item.culturalImpact && (
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Cultural Impact</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed italic border-l-2 border-white/10 pl-3">{item.culturalImpact}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      {item.iconicSteps && Array.isArray(item.iconicSteps) && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Iconic Steps</h5>
                          <ul className="space-y-1">
                            {item.iconicSteps.map((step: string, i: number) => (
                              <li key={i} className="text-neutral-300 text-xs flex items-start gap-2">
                                <span className={`w-1 h-1 rounded-full ${theme.accentBg} mt-1.5 flex-shrink-0`} /> <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {item.viralMoment && (
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Viral Moment</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed">{item.viralMoment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lyricist: Iconic Songs Written */}
      {iconicSongsWritten && Array.isArray(iconicSongsWritten) && iconicSongsWritten.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
            <FaMusic /> Iconic Anthems
          </h3>
          <div className="space-y-4">
            {iconicSongsWritten.map((song: any, idx: number) => (
              <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="pl-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-xl font-black text-white">{song.song}</h4>
                      <span className={`text-xs font-black uppercase tracking-widest ${theme.accent}`}>{song.film} ({song.year})</span>
                    </div>
                    {song.awards && Array.isArray(song.awards) && (
                      <div className="flex flex-wrap gap-2 justify-end">
                        {song.awards.map((award: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-yellow-500">🏆 {award}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-white/5">
                    <div>
                      {song.lyricalExcellence && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Lyrical Excellence</h5>
                          <p className="text-neutral-300 text-sm leading-relaxed">{song.lyricalExcellence}</p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {song.musicDirector && <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-neutral-400">MD: {song.musicDirector}</span>}
                        {song.singer && <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-neutral-400">Vocals: {song.singer}</span>}
                      </div>
                    </div>
                    <div>
                      {song.famousLines && Array.isArray(song.famousLines) && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Famous Lines</h5>
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                            {song.famousLines.map((line: string, i: number) => (
                              <p key={i} className={`text-xs leading-relaxed italic ${theme.accent} mb-1 text-center`}>"{line}"</p>
                            ))}
                          </div>
                        </div>
                      )}
                      {song.culturalImpact && (
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Cultural Impact</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed border-l-2 border-white/10 pl-3">{song.culturalImpact}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor: Iconic Edited Films */}
      {iconicEditedFilms && Array.isArray(iconicEditedFilms) && iconicEditedFilms.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
            <FaFilm /> Iconic Mastercuts
          </h3>
          <div className="space-y-4">
            {iconicEditedFilms.map((film: any, idx: number) => (
              <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="pl-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-xl font-black text-white">{film.film}</h4>
                      <span className={`text-xs font-black uppercase tracking-widest ${theme.accent}`}>{film.year} • Dir: {film.director}</span>
                    </div>
                    {film.awards && Array.isArray(film.awards) && (
                      <div className="flex flex-wrap gap-2 justify-end">
                        {film.awards.map((award: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-yellow-500">🏆 {award}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-white/5">
                    <div>
                      {film.editingAchievement && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Editing Achievement</h5>
                          <p className="text-neutral-300 text-sm leading-relaxed">{film.editingAchievement}</p>
                        </div>
                      )}
                      {film.narrativeSuccess && (
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Narrative Success</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed italic border-l-2 border-white/10 pl-3">{film.narrativeSuccess}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      {film.iconicSequences && Array.isArray(film.iconicSequences) && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Iconic Sequences</h5>
                          <ul className="space-y-1">
                            {film.iconicSequences.map((seq: string, i: number) => (
                              <li key={i} className="text-neutral-300 text-xs flex items-start gap-2">
                                <span className={`w-1 h-1 rounded-full ${theme.accentBg} mt-1.5 flex-shrink-0`} /> <span>{seq}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {film.pacingMastery && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Pacing Mastery</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed">{film.pacingMastery}</p>
                        </div>
                      )}
                      {film.industryImpact && (
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Industry Impact</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed border-l-2 border-white/10 pl-3">{film.industryImpact}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cinematographer: Iconic Visually Stunning Films */}
      {iconicVisuallyStunningFilms && Array.isArray(iconicVisuallyStunningFilms) && iconicVisuallyStunningFilms.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
            <FaFilm /> Iconic Visual Masterpieces
          </h3>
          <div className="space-y-4">
            {iconicVisuallyStunningFilms.map((film: any, idx: number) => (
              <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="pl-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-xl font-black text-white">{film.film}</h4>
                      <span className={`text-xs font-black uppercase tracking-widest ${theme.accent}`}>{film.year} • Dir: {film.director}</span>
                    </div>
                    {film.awards && Array.isArray(film.awards) && (
                      <div className="flex flex-wrap gap-2 justify-end">
                        {film.awards.map((award: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-yellow-500">🏆 {award}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-white/5">
                    <div>
                      {film.visualAchievement && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Visual Achievement</h5>
                          <p className="text-neutral-300 text-sm leading-relaxed">{film.visualAchievement}</p>
                        </div>
                      )}
                      {film.technicalBreakthrough && (
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Technical Breakthrough</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed italic border-l-2 border-white/10 pl-3">{film.technicalBreakthrough}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      {film.iconicShots && Array.isArray(film.iconicShots) && (
                        <div className="mb-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Iconic Shots</h5>
                          <ul className="space-y-1">
                            {film.iconicShots.map((shot: string, i: number) => (
                              <li key={i} className="text-neutral-300 text-xs flex items-start gap-2">
                                <span className={`w-1 h-1 rounded-full ${theme.accentBg} mt-1.5 flex-shrink-0`} /> <span>{shot}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {film.industryImpact && (
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Industry Impact</h5>
                          <p className="text-neutral-400 text-xs leading-relaxed">{film.industryImpact}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Commercial Impact (Music Director) */}
      {commercialImpact && (
        <div className="mt-8">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 flex items-center gap-2"><FaStar /> Commercial Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">100 Crore Club</span>
              <span className={`text-4xl font-black ${theme.accent}`}>{commercialImpact['100CroreClub']}</span>
            </div>
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center md:col-span-2 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Average Film Collection</span>
              <span className="text-4xl font-black text-white">{commercialImpact.averageFilmCollection}</span>
            </div>
          </div>
          {commercialImpact.commercialReliability && (
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 mb-6">
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Commercial Reliability</h4>
              <p className="text-neutral-300 text-sm leading-relaxed">{commercialImpact.commercialReliability}</p>
            </div>
          )}
          {commercialImpact.boxOfficeDriven && (
            <div>
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500 px-2`}>Box Office Driven Soundtracks</h4>
              <div className="space-y-3">
                {commercialImpact.boxOfficeDriven.map((film: any, i: number) => (
                  <div key={i} className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
                    <div>
                      <span className="text-sm font-bold text-white">{film.film} <span className="text-[10px] font-normal text-neutral-500">({film.year})</span></span>
                      <p className="text-xs text-neutral-400 mt-1 max-w-lg">{film.musicRole}</p>
                    </div>
                    <span className={`text-xs font-black shrink-0 px-3 py-1 rounded bg-green-500/10 text-green-500 border border-green-500/20`}>{film.boxOffice}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Careers Timeline */}
      {careersTimeline && careersTimeline.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
            <FaChartBar /> Career Timeline
          </h3>
          <div className="space-y-6">
            {careersTimeline.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-col md:flex-row gap-4 md:gap-6 p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                <span className={`text-xl font-black ${theme.accent} shrink-0 w-24`}>{item.period || item.decade}</span>
                <div>
                  <h4 className="text-sm font-bold text-white mb-2">{item.phase || item.title || item.period}</h4>
                  <p className="text-neutral-400 text-sm leading-relaxed">{item.description}</p>
                  {item.keyFilms && item.keyFilms.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.keyFilms.map((film: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-neutral-300">{film}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
