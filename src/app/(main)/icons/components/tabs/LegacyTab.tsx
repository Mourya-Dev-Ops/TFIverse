import { FaInstagram, FaTwitter, FaImdb, FaCar, FaHome, FaStar, FaQuoteLeft, FaDumbbell, FaMoneyBillWave, FaFilm, FaCrown, FaChartBar, FaMusic, FaFire, FaFistRaised, FaHandshake, FaPenNib, FaEye, FaCamera, FaIndustry, FaTrophy, FaLightbulb, FaHeart, FaComments, FaGlobe, FaCalendarAlt, FaPlayCircle, FaAward, FaBook, FaShieldAlt, FaLanguage, FaQuoteRight } from "react-icons/fa";
export default function LegacyTab({ data, theme, category }: { data: any, theme: any, category?: string }) {
  const philanthropy = data.philanthropy || null;
  const quotes = data.quotes || null;
  const trivia = data.trivia || null;
  const historicalImpact = data.historicalImpact || null;
  const industryContribution = data.industryContribution || null;
  const mentorshipInfluence = data.mentorshipInfluence || null;
  const internationalRecognition = data.internationalRecognition || null;
  const criticalAppreciation = data.criticalAppreciation || null;
  const controversiesOrTriumphs = data.controversiesOrTriumphs || null;
  const influenceAndLegacy = data.influenceAndLegacy || null;
  const industryStanding = data.industryStanding || null;
  const legendaryMoments = data.legendaryMoments || null;
  const legendaryComedyMoments = data.legendaryComedyMoments || null;
  const memorableScenes = data.memorableScenes || null;
  const livePerformances = data.livePerformances || null;
  const musicalFamily = data.musicalFamily || null;
  const talentDiscovery = data.talentDiscovery || null;
  const teluguLanguageContribution = data.teluguLanguageContribution || null;
  const literaryWorks = data.literaryWorks || null;
  const famousLyricalLines = data.famousLyricalLines || null;
  const viralDanceMoments = data.viralDanceMoments || null;
  const signatureMovesCreated = data.signatureMovesCreated || null;
  const safetyAndProtocols = data.safetyAndProtocols || null;
  const internationalWork = data.internationalWork || null;
  const researchAndAuthenticity = data.researchAndAuthenticity || null;
  const innovationInVFX = data.innovationInVFX || null;
  const legacyAndImpact = data.legacyAndImpact || null;
  const industryContributions = data.industryContributions || null;
  return (
              <>
                {/* Legendary Moments (Villain) */}
                {legendaryMoments && Array.isArray(legendaryMoments) && legendaryMoments.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Legendary Moments
                    </h3>
                    <div className="space-y-4">
                      {legendaryMoments.map((moment: any, idx: number) => (
                        <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                          <div className="pl-4">
                            <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-center mb-2">
                              <h4 className="text-sm font-black text-white">{moment.film || moment.movie}</h4>
                              {moment.year && <span className="text-[10px] font-black uppercase tracking-widest text-red-400">{moment.year}</span>}
                            </div>
                            {moment.moment && <p className="text-neutral-300 text-sm leading-relaxed">{moment.moment}</p>}
                            {moment.description && <p className="text-neutral-300 text-sm leading-relaxed">{moment.description}</p>}
                            {moment.impact && <p className="text-neutral-500 text-xs leading-relaxed mt-2 italic">{moment.impact}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legendary Comedy Moments */}
                {legendaryComedyMoments && Array.isArray(legendaryComedyMoments) && legendaryComedyMoments.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Legendary Comedy Moments
                    </h3>
                    <div className="space-y-4">
                      {legendaryComedyMoments.map((moment: any, idx: number) => (
                        <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                          <div className="pl-4">
                            <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-center mb-2">
                              <h4 className="text-sm font-black text-white">{moment.film || moment.movie}</h4>
                              {moment.year && <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">{moment.year}</span>}
                            </div>
                            {moment.moment && <p className="text-neutral-300 text-sm leading-relaxed">{moment.moment}</p>}
                            {moment.description && <p className="text-neutral-300 text-sm leading-relaxed">{moment.description}</p>}
                            {moment.impact && <p className="text-neutral-500 text-xs leading-relaxed mt-2 italic">{moment.impact}</p>}
                            {moment.dialogue && <p className="text-amber-300/60 text-xs leading-relaxed mt-2 italic border-l-2 border-amber-500/30 pl-3">"{moment.dialogue}"</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Character Artist: Memorable Scenes */}
                {memorableScenes && Array.isArray(memorableScenes) && memorableScenes.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Memorable Scenes
                    </h3>
                    <div className="space-y-4">
                      {memorableScenes.map((scene: any, idx: number) => (
                        <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          <div className="pl-4">
                            <div className="flex flex-col gap-1 mb-3">
                              <h4 className="text-sm font-black text-white">{scene.film || scene.movie}</h4>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accent}`}>{scene.year}</span>
                            </div>
                            {scene.scene && <p className="text-neutral-300 text-sm leading-relaxed mb-2">{scene.scene}</p>}
                            {scene.description && <p className="text-neutral-400 text-xs leading-relaxed">{scene.description}</p>}
                            {scene.impact && <p className="text-neutral-500 text-[10px] leading-relaxed mt-2 italic border-l-2 border-white/10 pl-3">{scene.impact}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Singer: Live Performances */}
                {livePerformances && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaGlobe /> Global Stage Presence
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4">
                        <div>
                          {livePerformances.concertCareer && (
                            <div className="mb-4">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Concert Career</h4>
                              <p className="text-neutral-300 text-sm leading-relaxed">{livePerformances.concertCareer}</p>
                            </div>
                          )}
                          {livePerformances.stagePresence && (
                            <div className="mb-4">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Stage Presence</h4>
                              <p className="text-neutral-300 text-sm leading-relaxed">{livePerformances.stagePresence}</p>
                            </div>
                          )}
                        </div>
                        <div>
                          {livePerformances.notableConcerts && Array.isArray(livePerformances.notableConcerts) && (
                            <div className="mb-4">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Notable Concerts</h4>
                              <ul className="space-y-2">
                                {livePerformances.notableConcerts.map((concert: any, i: number) => (
                                  <li key={i} className="text-neutral-300 text-xs flex justify-between items-center border-b border-white/5 pb-1">
                                    <span>{concert.event} <span className="text-[9px] text-neutral-500 block">{concert.location}</span></span>
                                    <span className="font-black text-neutral-500">{concert.year}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Singer: Musical Family */}
                {musicalFamily && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaHeart /> Personal & Legacy
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {musicalFamily.musicalLegacy && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Musical Legacy</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{musicalFamily.musicalLegacy}</p>
                        </div>
                      )}
                      {musicalFamily.childrenSingers && Array.isArray(musicalFamily.childrenSingers) && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Next Generation</h4>
                          <ul className="space-y-2">
                            {musicalFamily.childrenSingers.map((child: any, i: number) => (
                              <li key={i} className="text-neutral-300 text-sm border-l-2 border-white/10 pl-2">
                                <span className="font-bold text-white">{child.name}</span>
                                {child.profession && <span className="text-[10px] block text-neutral-500 mt-1">{child.profession}</span>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Producer: Talent Discovery */}
                {talentDiscovery && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Talent Architect
                    </h3>
                    
                    {talentDiscovery.talentNurturingReputation && (
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 mb-6">
                        <p className="text-neutral-300 text-sm leading-relaxed border-l-2 border-white/10 pl-3 italic">"{talentDiscovery.talentNurturingReputation}"</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {talentDiscovery.heroesLaunched && Array.isArray(talentDiscovery.heroesLaunched) && (
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4 px-2">Heroes Launched</h4>
                          <div className="space-y-4">
                            {talentDiscovery.heroesLaunched.map((hero: any, i: number) => (
                              <div key={i} className="p-6 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                                <div className="pl-4">
                                  <h5 className="text-sm font-black text-white mb-1">{hero.heroName}</h5>
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accent} block mb-2`}>{hero.launchFilm} ({hero.year})</span>
                                  {hero.outcome && <p className="text-neutral-400 text-[10px] leading-relaxed">{hero.outcome}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {talentDiscovery.directorsIntroduced && Array.isArray(talentDiscovery.directorsIntroduced) && (
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4 px-2">Directors Introduced</h4>
                          <div className="space-y-4">
                            {talentDiscovery.directorsIntroduced.map((director: any, i: number) => (
                              <div key={i} className="p-6 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                                <div className="pl-4">
                                  <h5 className="text-sm font-black text-white mb-1">{director.directorName}</h5>
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accent} block mb-2`}>{director.debutFilm} ({director.year})</span>
                                  {director.outcome && <p className="text-neutral-400 text-[10px] leading-relaxed">{director.outcome}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* PRO: Legacy & Impact */}
                {legacyAndImpact && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaAward /> The Final Word
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(legacyAndImpact).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          {typeof value === 'string' ? (
                            <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                          ) : Array.isArray(value) ? (
                            <ul className="space-y-2">
                              {value.map((item: string, i: number) => (
                                <li key={i} className="text-neutral-300 text-xs leading-relaxed flex items-start gap-2">
                                  <span className={`w-1.5 h-1.5 rounded-full ${theme.accentBg} mt-1.5 flex-shrink-0`} /> <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PRO: Industry Contributions */}
                {industryContributions && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Industry Contributions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(industryContributions).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* VFX Supervisor: Innovation in VFX */}
                {innovationInVFX && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaLightbulb /> Technical Breakthroughs
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(innovationInVFX).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          {typeof value === 'string' ? (
                            <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                          ) : Array.isArray(value) ? (
                            <ul className="space-y-2">
                              {value.map((item: string, i: number) => (
                                <li key={i} className="text-neutral-300 text-xs leading-relaxed flex items-start gap-2">
                                  <span className={`w-1.5 h-1.5 rounded-full ${theme.accentBg} mt-1.5 flex-shrink-0`} /> <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Art Director: Research & Authenticity */}
                {researchAndAuthenticity && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaBook /> Research & Authenticity
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(researchAndAuthenticity).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          {typeof value === 'string' ? (
                            <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                          ) : Array.isArray(value) ? (
                            <ul className="space-y-2">
                              {value.map((item: string, i: number) => (
                                <li key={i} className="text-neutral-300 text-xs leading-relaxed flex items-start gap-2">
                                  <span className={`w-1.5 h-1.5 rounded-full ${theme.accentBg} mt-1.5 flex-shrink-0`} /> <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stunt Director: Safety & Protocols */}
                {safetyAndProtocols && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaShieldAlt /> Safety & Protocols
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(safetyAndProtocols).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          {typeof value === 'string' ? (
                            <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                          ) : Array.isArray(value) ? (
                            <ul className="space-y-2">
                              {value.map((item: string, i: number) => (
                                <li key={i} className="text-neutral-300 text-xs leading-relaxed flex items-start gap-2">
                                  <span className={`w-1.5 h-1.5 rounded-full ${theme.accentBg} mt-1.5 flex-shrink-0`} /> <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stunt Director: International Work */}
                {internationalWork && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaGlobe /> International Reach
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {internationalWork.globalRecognition && (
                          <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Global Recognition</h4>
                            <p className="text-neutral-300 text-sm leading-relaxed">{internationalWork.globalRecognition}</p>
                          </div>
                        )}
                        {internationalWork.crossBorderWork && (
                          <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Cross-Border Work</h4>
                            <p className="text-neutral-300 text-sm leading-relaxed">{internationalWork.crossBorderWork}</p>
                          </div>
                        )}
                        {internationalWork.internationalCollaborations && Array.isArray(internationalWork.internationalCollaborations) && (
                          <div className="md:col-span-2">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4">International Collaborations</h4>
                            <div className="flex flex-wrap gap-4">
                              {internationalWork.internationalCollaborations.map((collab: any, i: number) => (
                                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                  <h5 className="text-sm font-bold text-white mb-1">{collab.film} ({collab.year})</h5>
                                  <p className="text-xs text-neutral-400">{collab.role} • {collab.country}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Choreographer: Viral Dance Moments */}
                {viralDanceMoments && Array.isArray(viralDanceMoments) && viralDanceMoments.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Viral Moments
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {viralDanceMoments.map((moment: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          <div className="pl-4">
                            <h4 className="text-lg font-black text-white mb-1">{moment.song}</h4>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accent} block mb-3`}>{moment.film} ({moment.year})</span>
                            {moment.trendName && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-neutral-300 inline-block mb-3">{moment.trendName}</span>}
                            {moment.viralOn && <p className="text-neutral-500 text-[10px] mb-2">Platforms: {moment.viralOn}</p>}
                            {moment.viewsReach && <p className={`text-sm font-black ${theme.accent} mb-2`}>{moment.viewsReach}</p>}
                            {moment.culturalImpact && <p className="text-neutral-400 text-xs leading-relaxed">{moment.culturalImpact}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Choreographer: Signature Moves Created */}
                {signatureMovesCreated && Array.isArray(signatureMovesCreated) && signatureMovesCreated.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Signature Moves
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {signatureMovesCreated.map((move: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <h4 className="text-sm font-black text-white mb-2">{move.moveName}</h4>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accent} block mb-2`}>{move.song} • {move.film} ({move.year})</span>
                          {move.popularity && <p className="text-neutral-400 text-xs leading-relaxed mb-1">{move.popularity}</p>}
                          {move.trendinStatus && <p className="text-neutral-500 text-[10px] leading-relaxed italic">{move.trendinStatus}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lyricist: Telugu Language Contribution */}
                {teluguLanguageContribution && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaLanguage /> Language Contribution
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(teluguLanguageContribution).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          {typeof value === 'string' ? (
                            <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                          ) : Array.isArray(value) ? (
                            <ul className="space-y-2">
                              {value.map((item: string, i: number) => (
                                <li key={i} className="text-neutral-300 text-xs leading-relaxed flex items-start gap-2">
                                  <span className={`w-1.5 h-1.5 rounded-full ${theme.accentBg} mt-1.5 flex-shrink-0`} /> <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lyricist: Famous Lyrical Lines */}
                {famousLyricalLines && Array.isArray(famousLyricalLines) && famousLyricalLines.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaQuoteLeft /> Immortal Quotes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {famousLyricalLines.map((item: any, idx: number) => (
                        <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                          <FaQuoteRight className="absolute -bottom-4 -right-4 text-6xl text-white/5 group-hover:text-white/10 transition-colors" />
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          <div className="pl-4 relative z-10">
                            <p className="text-lg font-black text-white italic mb-4 leading-relaxed">"{item.line}"</p>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accent} block mb-2`}>{item.song} ({item.film})</span>
                            {item.significance && <p className="text-neutral-400 text-xs leading-relaxed mb-2">{item.significance}</p>}
                            {item.popularUsage && <p className="text-neutral-500 text-[10px] leading-relaxed italic border-l-2 border-white/10 pl-3 mt-2">{item.popularUsage}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lyricist: Literary Works */}
                {literaryWorks && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaBook /> Literary Extension
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {literaryWorks.poetryBooks && Array.isArray(literaryWorks.poetryBooks) && (
                          <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4 px-2">Published Books</h4>
                            <div className="space-y-4">
                              {literaryWorks.poetryBooks.map((book: any, i: number) => (
                                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                  <h5 className="text-sm font-bold text-white mb-1">{book.title}</h5>
                                  <p className="text-xs text-neutral-400">{book.type}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div>
                          {literaryWorks.academicRecognition && (
                            <div className="mb-6">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 px-2">Academic Recognition</h4>
                              <p className="text-neutral-300 text-xs leading-relaxed border-l-2 border-white/10 pl-3">{literaryWorks.academicRecognition}</p>
                            </div>
                          )}
                          {literaryWorks.nonFilmWriting && (
                            <div>
                              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 px-2">Non-Film Writing</h4>
                              <p className="text-neutral-400 text-xs leading-relaxed pl-3">{literaryWorks.nonFilmWriting}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Industry Standing (Director) */}
                {industryStanding && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Industry Standing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {industryStanding.currentRank && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Current Rank</span>
                          <span className={`text-xl font-black ${theme.accent}`}>{industryStanding.currentRank}</span>
                        </div>
                      )}
                      {industryStanding.producerConfidence && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Producer Confidence</span>
                          <p className="text-neutral-300 text-xs leading-relaxed">{industryStanding.producerConfidence}</p>
                        </div>
                      )}
                      {industryStanding.peerRespect && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Peer Respect</span>
                          <p className="text-neutral-300 text-xs leading-relaxed">{industryStanding.peerRespect}</p>
                        </div>
                      )}
                      {industryStanding.starPreference && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Star Preference</span>
                          <p className="text-neutral-300 text-xs leading-relaxed">{industryStanding.starPreference}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Controversies & Triumphs */}
                {controversiesOrTriumphs && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Triumphs & Resilience
                    </h3>
                    
                    {(controversiesOrTriumphs.resilience || controversiesOrTriumphs.personalTriumphs) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {controversiesOrTriumphs.resilience && (
                          <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a]">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Resilience</h4>
                            <p className="text-neutral-300 text-sm leading-relaxed">{controversiesOrTriumphs.resilience}</p>
                          </div>
                        )}
                        {controversiesOrTriumphs.personalTriumphs && (
                          <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a]">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Personal Triumphs</h4>
                            <p className="text-neutral-300 text-sm leading-relaxed">{controversiesOrTriumphs.personalTriumphs}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {controversiesOrTriumphs.majorChallenges && controversiesOrTriumphs.majorChallenges.length > 0 && (
                      <div className="mb-6">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500`}>Major Challenges</h4>
                        <div className="space-y-4">
                          {controversiesOrTriumphs.majorChallenges.map((challenge: any, idx: number) => (
                            <div key={idx} className="p-6 rounded-2xl border border-white/5 bg-[#0a0a0a] flex flex-col md:flex-row gap-6">
                              <div className="w-full md:w-1/4 shrink-0">
                                <span className="text-xs font-bold text-white block mb-1">{challenge.period}</span>
                                <span className={`text-[10px] uppercase tracking-widest ${theme.accent}`}>{challenge.challenge}</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-neutral-400 text-sm leading-relaxed mb-3">{challenge.description}</p>
                                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Outcome</span>
                                  <span className="text-xs text-neutral-200">{challenge.outcome}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {controversiesOrTriumphs.comebackStories && controversiesOrTriumphs.comebackStories.length > 0 && (
                      <div>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500`}>Comeback Stories</h4>
                        <div className="grid grid-cols-1 gap-4">
                          {controversiesOrTriumphs.comebackStories.map((story: any, idx: number) => (
                            <div key={idx} className="p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-[#0a0a0a] to-[#050505] relative overflow-hidden group">
                              <div className={`absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent`} />
                              <div className="flex justify-between items-start mb-3 relative z-10">
                                <h5 className="text-sm font-bold text-white">{story.story}</h5>
                                <span className={`text-[10px] uppercase tracking-widest px-2 py-1 bg-white/5 rounded ${theme.accent}`}>{story.period}</span>
                              </div>
                              <p className="text-neutral-400 text-xs leading-relaxed relative z-10"><span className="font-bold text-neutral-500">Breakthrough:</span> {story.breakthrough}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Historical Impact (Legend) */}
                {historicalImpact && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Historical Impact
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 mb-6 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 right-0 h-1 ${theme.accentBg} opacity-50`} />
                      <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Cinematic Revolution</h4>
                      <p className="text-neutral-300 text-sm leading-relaxed mb-6">{historicalImpact.cinematicRevolution}</p>
                      
                      {historicalImpact.recordsSet && (
                        <div className="mb-6">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500">Records Set</h4>
                          <ul className="space-y-2">
                            {historicalImpact.recordsSet.map((record: string, i: number) => (
                              <li key={i} className="text-neutral-400 text-xs leading-relaxed flex gap-2"><span className={`${theme.accent} shrink-0`}>•</span>{record}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {historicalImpact.techniquesIntroduced && (
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500">Techniques Introduced</h4>
                          <div className="flex flex-wrap gap-2">
                            {historicalImpact.techniquesIntroduced.map((tech: string, i: number) => (
                              <span key={i} className="px-3 py-1.5 bg-white/5 rounded border border-white/5 text-[10px] uppercase tracking-widest text-neutral-300">{tech}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Influence and Legacy (Maestro) */}
                {influenceAndLegacy && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Influence & Legacy
                    </h3>
                    
                    {influenceAndLegacy.cinemaRevolution && (
                      <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 mb-6 relative overflow-hidden group">
                        <div className={`absolute left-0 top-0 right-0 h-1 ${theme.accentBg} opacity-50`} />
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Cinema Revolution</h4>
                        <p className="text-neutral-300 text-sm leading-relaxed mb-6">{influenceAndLegacy.cinemaRevolution}</p>
                        
                        {influenceAndLegacy.timelineSignificance && (
                          <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500">Timeline Significance</h4>
                            <p className="text-neutral-400 text-sm leading-relaxed">{influenceAndLegacy.timelineSignificance}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {influenceAndLegacy.directorsInfluenced && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Directors Influenced</h4>
                          <ul className="space-y-2">
                            {influenceAndLegacy.directorsInfluenced.map((director: string, i: number) => (
                              <li key={i} className="text-neutral-300 text-xs flex gap-2"><span className={`${theme.accent} shrink-0`}>•</span>{director}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {influenceAndLegacy.cinematicInnovations && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Cinematic Innovations</h4>
                          <ul className="space-y-2">
                            {influenceAndLegacy.cinematicInnovations.map((innovation: string, i: number) => (
                              <li key={i} className="text-neutral-300 text-xs flex gap-2"><span className={`${theme.accent} shrink-0`}>•</span>{innovation}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Mentorship Influence (Legend) */}
                {mentorshipInfluence && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Mentorship & Influence
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {mentorshipInfluence.actorsMentored && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Actors Mentored</h4>
                          <div className="space-y-4">
                            {mentorshipInfluence.actorsMentored.map((mentee: any, i: number) => (
                              <div key={i}>
                                <span className="text-sm font-bold text-white block mb-1">{mentee.name}</span>
                                <span className="text-xs text-neutral-500">{mentee.significance}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {mentorshipInfluence.directorsInfluenced && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Directors Influenced</h4>
                          <div className="space-y-4">
                            {mentorshipInfluence.directorsInfluenced.map((mentee: any, i: number) => (
                              <div key={i}>
                                <span className="text-sm font-bold text-white block mb-1">{mentee.name}</span>
                                <span className="text-xs text-neutral-500">{mentee.films || mentee.significance}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Industry Contribution (Legend) */}
                {industryContribution && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Industry Contribution
                    </h3>
                    {industryContribution.firsts && (
                      <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 mb-6">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Historic Firsts</h4>
                        <ul className="space-y-3">
                          {industryContribution.firsts.map((first: string, i: number) => (
                            <li key={i} className="text-neutral-300 text-sm leading-relaxed flex gap-3"><span className={`font-black ${theme.accent} shrink-0`}>{i+1}.</span>{first}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* International Recognition (Legend) */}
                {internationalRecognition && internationalRecognition.filmFestivalRecognitions && internationalRecognition.filmFestivalRecognitions.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Global Footprint
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {internationalRecognition.filmFestivalRecognitions.map((fest: any, i: number) => (
                        <div key={i} className="p-6 rounded-2xl bg-[#050505] border border-white/5 relative">
                          <h4 className="text-sm font-bold text-white mb-1">{fest.festival}</h4>
                          <span className={`text-[10px] uppercase tracking-widest font-black ${theme.accent} block mb-3`}>{fest.year}</span>
                          <p className="text-xs text-neutral-400">{fest.recognition}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Critical Appreciation (Legend) */}
                {criticalAppreciation && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Critical Appreciation
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5">
                      <p className="text-neutral-300 text-sm leading-relaxed mb-6 italic">"{criticalAppreciation.criticalAnalysis}"</p>
                      {criticalAppreciation.biographicalBooks && criticalAppreciation.biographicalBooks.length > 0 && (
                        <div>
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Biographical Literature</h4>
                          <ul className="space-y-2">
                            {criticalAppreciation.biographicalBooks.map((book: string, i: number) => (
                              <li key={i} className="text-neutral-400 text-xs leading-relaxed flex gap-2"><span className="text-neutral-600 shrink-0">—</span>{book}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Philanthropy */}
                {philanthropy && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2">Giving Back</h3>
                    {philanthropy.totalEstimatedContribution && (
                      <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] mb-6 ${theme.glowColor}`}>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 block mb-2">Total Contributions</span>
                        <span className={`text-3xl md:text-5xl font-black ${theme.accent}`}>{philanthropy.totalEstimatedContribution}</span>
                      </div>
                    )}

                    {/* Foundations */}
                    {philanthropy.foundations && philanthropy.foundations.length > 0 && (
                      <div className="mb-6">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 px-2 ${theme.accent}`}>Foundations</h4>
                        <div className="space-y-4">
                          {philanthropy.foundations.map((f: any, idx: number) => (
                            <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-black text-white">{f.name}</h4>
                                {f.established && <span className="text-[10px] text-neutral-500 font-bold">Est. {f.established}</span>}
                              </div>
                              {f.annualBudget && <span className={`text-xs font-bold ${theme.accent} block mb-3`}>{f.annualBudget} /year</span>}
                              {f.focus && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {f.focus.map((area: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/5">{area}</span>
                                  ))}
                                </div>
                              )}
                              {f.majorInitiatives && (
                                <ul className="space-y-1">
                                  {f.majorInitiatives.map((mi: string, i: number) => (
                                    <li key={i} className="text-neutral-500 text-[10px] leading-relaxed flex gap-2"><span className="text-neutral-600 shrink-0">—</span>{mi}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Initiatives */}
                    {philanthropy.initiatives && philanthropy.initiatives.length > 0 && (
                      <div className="space-y-4 mb-6">
                        {philanthropy.initiatives.map((init: any, idx: number) => (
                          <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-black text-white">{init.name}</h4>
                              <span className={`text-xs font-bold ${theme.accent}`}>{init.amount}</span>
                            </div>
                            <p className="text-neutral-500 text-xs leading-relaxed mb-2">{init.description}</p>
                            {init.beneficiaries && <span className="text-[9px] text-neutral-600 uppercase tracking-widest">{init.beneficiaries}</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Recognitions */}
                    {philanthropy.recognitions && philanthropy.recognitions.length > 0 && (
                      <div>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 px-2 ${theme.accent}`}>Recognitions</h4>
                        <div className="space-y-3">
                          {philanthropy.recognitions.map((rec: any, idx: number) => (
                            <div key={idx} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between">
                              <div>
                                <span className="text-sm font-bold text-white">{rec.award}</span>
                                <span className="text-[10px] text-neutral-500 block">{rec.givenBy}</span>
                              </div>
                              <span className={`text-xs font-bold ${theme.accent}`}>{rec.year}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Trivia */}
                {trivia.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Did You Know?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {trivia.map((t: string, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 flex gap-3 items-start">
                          <span className={`text-xs font-black ${theme.accent} shrink-0`}>#{idx + 1}</span>
                          <p className="text-neutral-400 text-xs leading-relaxed">{t}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Quotes (Full) */}
                {quotes.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Complete Quotes Archive</h3>
                    <div className="space-y-4">
                      {quotes.map((q: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 relative">
                          <FaQuoteLeft className="text-xl opacity-10 absolute top-4 right-4" />
                          <p className="text-neutral-300 text-sm leading-relaxed italic mb-3">"{q.quote}"</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${theme.accent}`}>{q.year}</span>
                            {q.context && <span className="text-[9px] text-neutral-600">• {q.context}</span>}
                            {q.source && <span className="text-[9px] text-neutral-600">— {q.source}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
  );
}
