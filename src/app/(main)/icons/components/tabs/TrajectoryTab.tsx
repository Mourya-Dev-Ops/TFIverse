import { FaInstagram, FaTwitter, FaImdb, FaCar, FaHome, FaStar, FaQuoteLeft, FaDumbbell, FaMoneyBillWave, FaFilm, FaCrown, FaChartBar, FaMusic, FaFire, FaFistRaised, FaHandshake, FaPenNib, FaEye, FaCamera, FaIndustry, FaTrophy, FaLightbulb, FaHeart, FaComments, FaGlobe, FaCalendarAlt, FaPlayCircle } from "react-icons/fa";
export default function TrajectoryTab({ data, theme, category }: { data: any, theme: any, category?: string }) {
  const fanbaseAnalysis = data.fanbaseAnalysis || null;
  const competitorComparison = data.competitorComparison || null;
  const superstarpotential = data.superstarpotential || null;
  const careerTrajectory = data.careerTrajectory || null;
  const uniqueSellingProposition = data.uniqueSellingProposition || null;
  const upcomingProjects = data.upcomingProjects || null;
  const futureOutlook = data.futureOutlook || null;
  const detailedSocialInfluence = data.detailedSocialInfluence || null;
  return (
              <>
                {/* Career Trajectory */}
                {careerTrajectory && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaChartBar /> Career Trajectory
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                        <span className={`text-3xl font-black ${theme.accent}`}>{careerTrajectory.totalFilms}</span>
                        <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mt-1">Total Films</span>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                        <span className={`text-3xl font-black text-white`}>{careerTrajectory.hitPercentage}</span>
                        <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mt-1">Hit Rate</span>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center col-span-2">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Trend</span>
                        <span className={`text-lg font-black text-white block`}>{careerTrajectory.careerTrend}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {careerTrajectory.boxOfficeGrowth && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Box Office Growth</h4>
                          <p className="text-neutral-400 text-sm leading-relaxed">{careerTrajectory.boxOfficeGrowth}</p>
                        </div>
                      )}
                      {careerTrajectory.trajectoryAnalysis && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Analysis</h4>
                          <p className="text-neutral-400 text-sm leading-relaxed">{careerTrajectory.trajectoryAnalysis}</p>
                        </div>
                      )}
                    </div>
                    
                    {careerTrajectory.filmography && careerTrajectory.filmography.length > 0 && (
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-x-auto">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500`}>Key Projects</h4>
                        <div className="min-w-[600px]">
                          <div className="grid grid-cols-6 gap-4 text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-3 px-2">
                            <span className="col-span-2">Film</span>
                            <span>Role</span>
                            <span>Box Office</span>
                            <span className="col-span-2">Verdict</span>
                          </div>
                          {careerTrajectory.filmography.map((film: any, i: number) => (
                            <div key={i} className="grid grid-cols-6 gap-4 items-center p-3 rounded-xl hover:bg-white/5 border border-transparent transition-colors">
                              <div className="col-span-2">
                                <span className="text-sm font-bold text-white block">{film.film}</span>
                                <span className={`text-[9px] font-black ${theme.accent}`}>{film.year} • {film.language}</span>
                              </div>
                              <span className="text-xs text-neutral-400">{film.character}</span>
                              <span className="text-xs text-neutral-300 font-bold">{film.collection}</span>
                              <div className="col-span-2">
                                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest inline-block mb-1 ${film.verdict?.includes('Hit') || film.verdict?.includes('Success') || film.verdict?.includes('Blockbuster') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{film.verdict}</span>
                                <p className="text-[10px] text-neutral-500 line-clamp-2" title={film.criticalResponse}>{film.criticalResponse}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Unique Selling Proposition */}
                {uniqueSellingProposition && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Unique Selling Proposition
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(uniqueSellingProposition).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                          <p className="text-neutral-400 text-sm leading-relaxed">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Superstar Potential Bento */}
                {superstarpotential && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaChartBar /> Potential Forecast
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Likelihood</span>
                        <span className={`text-4xl font-black ${theme.accent}`}>{superstarpotential.likelihood}</span>
                      </div>
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] md:col-span-2 ${theme.glowColor}`}>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Estimated Timeline</span>
                        <span className="text-3xl font-black text-white">{superstarpotential.estimatedTimeline || superstarpotential.timelineToEstablish}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a]">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-6 ${theme.accent}`}>The Roadmap (Required Factors)</h4>
                        <ul className="space-y-4">
                          {superstarpotential.requiredFactors.map((factor: string, i: number) => (
                            <li key={i} className="text-neutral-300 text-sm leading-relaxed flex gap-3">
                              <span className={`font-black ${theme.accent} shrink-0`}>→</span>{factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a]">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Long-term Forecast</h4>
                        <p className="text-neutral-400 text-sm leading-relaxed">{superstarpotential.forecast}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detailed Social Influence */}
                {detailedSocialInfluence && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Digital Influence
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor} col-span-1 md:col-span-2 flex flex-col items-center text-center justify-center`}>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Influence Score</span>
                        <span className={`text-6xl font-black ${theme.accent}`}>{detailedSocialInfluence.digitalInfluenceScore}</span>
                        <p className="text-neutral-400 mt-4 text-sm max-w-lg">{detailedSocialInfluence.socialMediaStrategy}</p>
                      </div>
                      
                      {detailedSocialInfluence.instagram && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[#E1306C]`}>Instagram</h4>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-xs text-neutral-400">Followers</span>
                              <span className="text-sm font-black text-white">{detailedSocialInfluence.instagram.followers?.toLocaleString() || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-xs text-neutral-400">Engagement</span>
                              <span className="text-sm font-black text-white">{detailedSocialInfluence.instagram.engagementRate}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-xs text-neutral-400">Level</span>
                              <span className="text-sm font-black text-white">{detailedSocialInfluence.instagram.influencerLevel}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {detailedSocialInfluence.youtube && detailedSocialInfluence.youtube.active && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[#FF0000]`}>YouTube</h4>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-xs text-neutral-400">Channel</span>
                              <span className="text-sm font-black text-white">{detailedSocialInfluence.youtube.channel}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-xs text-neutral-400">Subscribers</span>
                              <span className="text-sm font-black text-white">{detailedSocialInfluence.youtube.subscribers?.toLocaleString() || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Market & Fanbase Analysis */}
                {fanbaseAnalysis && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Market & Fanbase
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Primary Demographic</span>
                        <p className="text-sm text-white leading-relaxed">{fanbaseAnalysis.primaryDemographic}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Social Media Influence</span>
                        <p className="text-sm text-neutral-400 leading-relaxed">{fanbaseAnalysis.socialMediaInfluence}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 block">Geographic Reach</span>
                        <span className="text-sm font-bold text-white">{fanbaseAnalysis.geographicReach}</span>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 block">Loyalty Level</span>
                        <span className={`text-sm font-black ${theme.accent}`}>{fanbaseAnalysis.loyaltyLevel}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Competitor Comparison */}
                {competitorComparison && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaChartBar /> Competitive Analysis
                    </h3>
                    
                    <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] mb-6">
                      <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Unique Differentiator</h4>
                      <p className="text-neutral-300 text-sm leading-relaxed">{competitorComparison.uniqueDifference}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a]">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Competitive Edge</h4>
                        <p className="text-neutral-400 text-sm leading-relaxed">{competitorComparison.competitiveEdge}</p>
                      </div>
                      
                      {competitorComparison.peersInSamePhase && (
                        <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a]">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-6 ${theme.accent}`}>Peers in Same Phase</h4>
                          <div className="space-y-3">
                            {competitorComparison.peersInSamePhase.map((peer: string, idx: number) => {
                              const [name, desc] = peer.split(' (');
                              return (
                                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5">
                                  <span className="text-sm font-bold text-white block mb-1">{name}</span>
                                  {desc && <span className="text-[10px] text-neutral-500 uppercase tracking-widest">{desc.replace(')', '')}</span>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Upcoming Projects */}
                {upcomingProjects && upcomingProjects.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFilm /> Upcoming Projects
                    </h3>
                    <div className="space-y-4">
                      {upcomingProjects.map((project: any, idx: number) => (
                        <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          
                          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-4 pl-4">
                            <div>
                              <h4 className="text-xl font-black text-white mb-1">{project.film}</h4>
                              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{project.genre} • {project.expectedRelease}</span>
                            </div>
                            <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 shrink-0">
                              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.accent} block text-center`}>Status</span>
                              <span className="text-sm font-bold text-white block text-center">{project.status}</span>
                            </div>
                          </div>

                          <div className="pl-4 grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                              <p className="text-neutral-400 text-sm leading-relaxed mb-3"><span className="text-neutral-500 font-bold mr-2 block mb-1">Significance:</span>{project.significance}</p>
                              <div className="flex gap-4">
                                {project.hero && (
                                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/10 rounded text-neutral-300">Hero: {project.hero}</span>
                                )}
                                {project.budget && (
                                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/10 rounded text-neutral-300">Budget: {project.budget}</span>
                                )}
                              </div>
                            </div>
                            {project.expectations && (
                              <div className="flex flex-col justify-center items-center p-4 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Expectations</span>
                                <span className={`text-xl font-black ${theme.accent}`}>{project.expectations}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Future Outlook */}
                {futureOutlook && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaChartBar /> Future Outlook
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {futureOutlook.nextPhase && (
                        <div className={`p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 md:col-span-2 ${theme.glowColor}`}>
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Next Phase</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{futureOutlook.nextPhase}</p>
                        </div>
                      )}
                      {futureOutlook.criticalFilm && (
                        <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Critical Turning Point</h4>
                          <p className="text-neutral-400 text-sm leading-relaxed">{futureOutlook.criticalFilm}</p>
                        </div>
                      )}
                      {futureOutlook.marketPosition && (
                        <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Market Position</h4>
                          <p className="text-neutral-400 text-sm leading-relaxed">{futureOutlook.marketPosition}</p>
                        </div>
                      )}
                      {futureOutlook.industrySentiment && (
                        <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 md:col-span-2">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Industry Sentiment</h4>
                          <p className="text-neutral-400 text-sm leading-relaxed">{futureOutlook.industrySentiment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
  );
}
