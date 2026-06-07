import { FaInstagram, FaTwitter, FaImdb, FaCar, FaHome, FaStar, FaQuoteLeft, FaDumbbell, FaMoneyBillWave, FaFilm, FaCrown, FaChartBar, FaMusic, FaFire, FaFistRaised, FaHandshake, FaPenNib, FaEye, FaCamera, FaIndustry, FaMicrophone, FaHeadphones, FaUserFriends, FaCut, FaNewspaper, FaUsers, FaTasks, FaCubes, FaUserTie, FaPalette, FaBuilding, FaMicrochip } from "react-icons/fa";
export default function CraftTab({ data, theme, category }: { data: any, theme: any, category: string }) {
  const villainSpecialization = data.villainSpecialization || null;
  const iconicAntagonistRoles = data.iconicAntagonistRoles || null;
  const heroAntagonisms = data.heroAntagonisms || null;
  const dualCareer = data.dualCareer || null;
  const comedySpecialization = data.comedySpecialization || null;
  const iconicComedyRoles = data.iconicComedyRoles || null;
  const heroComedyPartnerships = data.heroComedyPartnerships || null;
  const characterVersatility = data.characterVersatility || null;
  const actingApproach = data.actingApproach || null;
  const screenChemistry = data.screenChemistry || null;
  const screenChemistryByCostar = data.screenChemistryByCostar || null;
  const directorCollaborations = data.directorCollaborations || null;
  const stuntExpertise = data.stuntExpertise || null;
  const actionVersatility = data.actionVersatility || null;
  const danceStyle = data.danceStyle || null;
  const danceStyleVersatility = data.danceStyleVersatility || null;
  const actorCollaborations = data.actorCollaborations || null;
  const lyricalStyle = data.lyricalStyle || null;
  const frequentDirectorCollaborations = data.frequentDirectorCollaborations || null;
  const visualStyle = data.visualStyle || null;
  const technicalExpertise = data.technicalExpertise || null;
  const productionApproach = data.productionApproach || null;
  const starCollaborations = data.starCollaborations || null;
  const musicalEssence = data.musicalEssence || null;
  const orchestralProfile = data.orchestralProfile || null;
  const musicalInnovations = data.musicalInnovations || null;
  const visionaryEssence = data.visionaryEssence || null;
  const filmmakingStyle = data.filmmakingStyle || null;
  const iconicRoles = data.iconicRoles || null;
  const transformations = data.transformations || null;
  const voiceProfile = data.voiceProfile || null;
  const collaborations = data.collaborations || null;
  const filmmakerRelationships = data.filmmakerRelationships || null;
  const iconicCharacterRoles = data.iconicCharacterRoles || data.characterRoles || [];
  const heroPartnerships = data.heroPartnerships || [];
  
  // Newly added missed vars
  const vocalProfile = data.vocalProfile || null;
  const genreVersatility = data.genreVersatility || null;
  const musicDirectorCollaborations = data.musicDirectorCollaborations || null;
  const duetPartnerships = data.duetPartnerships || null;
  const editingStyle = data.editingStyle || null;
  const pacingAndRhythm = data.pacingAndRhythm || null;
  const mediaInfluence = data.mediaInfluence || null;
  const journalismCareer = data.journalismCareer || null;
  const industryRelationships = data.industryRelationships || null;
  const coordinationExpertise = data.coordinationExpertise || null;
  const vfxStyle = data.vfxStyle || null;
  const costumeExpertise = data.costumeExpertise || null;
  const characterCostumeApproach = data.characterCostumeApproach || null;
  const designStyle = data.designStyle || null;
  const productionDesignExpertise = data.productionDesignExpertise || null;
  const actionStyle = data.actionStyle || null;
  return (
              <>
                {/* Villain Specialization */}
                {villainSpecialization && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Villain Specialization
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-red-500 opacity-50 group-hover:opacity-100 transition-opacity`} />
                      {Object.entries(villainSpecialization).map(([key, value]: [string, any]) => {
                        if (typeof value === 'string') {
                          return (
                            <div key={key} className="mb-6 pl-4 last:mb-0">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-red-400`}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                            </div>
                          );
                        } else if (Array.isArray(value)) {
                          return (
                            <div key={key} className="mb-6 pl-4 last:mb-0">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-red-400`}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {value.map((item: string, i: number) => (
                                  <span key={i} className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] text-red-300 font-bold">{item}</span>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}

                {/* Iconic Antagonist Roles */}
                {iconicAntagonistRoles.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFilm /> Iconic Antagonist Roles
                    </h3>
                    <div className="space-y-4">
                      {iconicAntagonistRoles.map((role: any, idx: number) => (
                        <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                          <div className="pl-4">
                            <div className="flex flex-col md:flex-row gap-2 md:gap-6 md:items-center mb-3">
                              <h4 className="text-lg font-black text-white">{role.film || role.movie}</h4>
                              <span className="text-[10px] font-black uppercase tracking-widest text-red-400">{role.year} {role.language && `• ${role.language}`}</span>
                            </div>
                            {role.characterName && (
                              <div className="mb-2">
                                <span className="text-xs font-bold text-neutral-200">as </span>
                                <span className={`text-sm font-black text-red-400`}>{role.characterName}</span>
                              </div>
                            )}
                            {role.characterType && (
                              <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[9px] uppercase tracking-widest font-bold text-red-300 inline-block mb-3">{role.characterType}</span>
                            )}
                            {role.impact && <p className="text-neutral-400 text-sm leading-relaxed mt-2">{role.impact}</p>}
                            {role.iconicScene && <p className="text-neutral-500 text-xs leading-relaxed mt-2 italic border-l-2 border-red-500/30 pl-3">{role.iconicScene}</p>}
                            {role.heroOpposite && (
                              <div className="mt-3 flex items-center gap-2">
                                <span className="text-[9px] uppercase tracking-widest text-neutral-600 font-bold">vs</span>
                                <span className="text-xs font-bold text-white">{role.heroOpposite}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hero Antagonisms (Villain vs Hero matchups) */}
                {heroAntagonisms && Array.isArray(heroAntagonisms) && heroAntagonisms.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Hero Antagonisms
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {heroAntagonisms.map((matchup: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-red-500/20 transition-colors">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`text-lg font-black text-red-400`}>{matchup.hero || matchup.heroName}</span>
                          </div>
                          <div className="space-y-2">
                            {matchup.filmsCount && (
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs text-neutral-400">Films Together</span>
                                <span className="text-sm font-black text-white">{matchup.filmsCount}</span>
                              </div>
                            )}
                            {matchup.chemistry && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{matchup.chemistry}</p>}
                            {matchup.bestFilm && (
                              <div className="flex justify-between items-center border-b border-white/5 pb-2 mt-2">
                                <span className="text-xs text-neutral-400">Best Film</span>
                                <span className="text-xs font-bold text-white">{matchup.bestFilm}</span>
                              </div>
                            )}
                            {matchup.dynamicType && <p className="text-[10px] uppercase tracking-widest font-bold text-red-300 mt-2">{matchup.dynamicType}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dual Career (Jagapathi Babu) */}
                {dualCareer && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaChartBar /> Dual Career Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {dualCareer.leadRoles && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${theme.accent}`}>Lead Roles Era</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{dualCareer.leadRoles}</p>
                        </div>
                      )}
                      {dualCareer.antagonistRoles && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-red-400">Antagonist Roles Era</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{dualCareer.antagonistRoles}</p>
                        </div>
                      )}
                      {dualCareer.careerBalance && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 md:col-span-2">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-400">Career Balance</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{dualCareer.careerBalance}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Comedy Specialization */}
                {comedySpecialization && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Comedy Specialization
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-amber-500 opacity-50 group-hover:opacity-100 transition-opacity`} />
                      {Object.entries(comedySpecialization).map(([key, value]: [string, any]) => {
                        if (typeof value === 'string') {
                          return (
                            <div key={key} className="mb-6 pl-4 last:mb-0">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-amber-400">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                            </div>
                          );
                        } else if (Array.isArray(value)) {
                          return (
                            <div key={key} className="mb-6 pl-4 last:mb-0">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-amber-400">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {value.map((item: string, i: number) => (
                                  <span key={i} className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] text-amber-300 font-bold">{item}</span>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}

                {/* Iconic Comedy Roles */}
                {iconicComedyRoles.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFilm /> Iconic Comedy Roles
                    </h3>
                    <div className="space-y-4">
                      {iconicComedyRoles.map((role: any, idx: number) => (
                        <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                          <div className="pl-4">
                            <div className="flex flex-col md:flex-row gap-2 md:gap-6 md:items-center mb-3">
                              <h4 className="text-lg font-black text-white">{role.film || role.movie}</h4>
                              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">{role.year} {role.language && `• ${role.language}`}</span>
                            </div>
                            {role.characterName && (
                              <div className="mb-2">
                                <span className="text-xs font-bold text-neutral-200">as </span>
                                <span className="text-sm font-black text-amber-400">{role.characterName}</span>
                              </div>
                            )}
                            {role.comedyType && (
                              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] uppercase tracking-widest font-bold text-amber-300 inline-block mb-3">{role.comedyType}</span>
                            )}
                            {role.impact && <p className="text-neutral-400 text-sm leading-relaxed mt-2">{role.impact}</p>}
                            {role.iconicScene && <p className="text-neutral-500 text-xs leading-relaxed mt-2 italic border-l-2 border-amber-500/30 pl-3">{role.iconicScene}</p>}
                            {role.iconicDialogue && <p className="text-neutral-500 text-xs leading-relaxed mt-2 italic border-l-2 border-amber-500/30 pl-3">"{role.iconicDialogue}"</p>}
                            {role.heroOpposite && (
                              <div className="mt-3 flex items-center gap-2">
                                <span className="text-[9px] uppercase tracking-widest text-neutral-600 font-bold">with</span>
                                <span className="text-xs font-bold text-white">{role.heroOpposite}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hero Comedy Partnerships */}
                {heroComedyPartnerships && Array.isArray(heroComedyPartnerships) && heroComedyPartnerships.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Hero Comedy Partnerships
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {heroComedyPartnerships.map((partner: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-amber-500/20 transition-colors">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-lg font-black text-amber-400">{partner.hero || partner.heroName}</span>
                          </div>
                          <div className="space-y-2">
                            {partner.filmsCount && (
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs text-neutral-400">Films Together</span>
                                <span className="text-sm font-black text-white">{partner.filmsCount}</span>
                              </div>
                            )}
                            {partner.chemistry && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{partner.chemistry}</p>}
                            {partner.bestFilm && (
                              <div className="flex justify-between items-center border-b border-white/5 pb-2 mt-2">
                                <span className="text-xs text-neutral-400">Best Film</span>
                                <span className="text-xs font-bold text-white">{partner.bestFilm}</span>
                              </div>
                            )}
                            {partner.comedyDynamic && <p className="text-[10px] uppercase tracking-widest font-bold text-amber-300 mt-2">{partner.comedyDynamic}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Character Artist: Character Versatility */}
                {characterVersatility && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Character Versatility
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      {Object.entries(characterVersatility).map(([key, value]: [string, any]) => {
                        if (typeof value === 'string') {
                          return (
                            <div key={key} className="mb-6 pl-4 last:mb-0">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                            </div>
                          );
                        } else if (Array.isArray(value)) {
                          return (
                            <div key={key} className="mb-6 pl-4 last:mb-0">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${theme.accent}`}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {value.map((item: string, i: number) => (
                                  <span key={i} className={`px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-neutral-300 font-bold`}>{item}</span>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}

                {/* Character Artist: Acting Approach */}
                {actingApproach && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Acting Approach
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      {Object.entries(actingApproach).map(([key, value]: [string, any]) => {
                        if (typeof value === 'string') {
                          return (
                            <div key={key} className="mb-6 pl-4 last:mb-0">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                            </div>
                          );
                        } else if (Array.isArray(value)) {
                          return (
                            <div key={key} className="mb-6 pl-4 last:mb-0">
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${theme.accent}`}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {value.map((item: string, i: number) => (
                                  <span key={i} className={`px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-neutral-300 font-bold`}>{item}</span>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}

                {/* Character Artist: Iconic Character Roles */}
                {iconicCharacterRoles.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFilm /> Iconic Character Roles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {iconicCharacterRoles.map((role: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          <div className="pl-4">
                            <div className="flex flex-col gap-1 mb-3">
                              <h4 className="text-lg font-black text-white">{role.film || role.movie}</h4>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accent}`}>{role.year} {role.language && `• ${role.language}`}</span>
                            </div>
                            {role.characterName && (
                              <div className="mb-2">
                                <span className="text-xs font-bold text-neutral-400">as </span>
                                <span className="text-sm font-black text-white">{role.characterName}</span>
                              </div>
                            )}
                            {role.characterType && (
                              <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-neutral-300 inline-block mb-3`}>{role.characterType}</span>
                            )}
                            {role.impact && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{role.impact}</p>}
                            {role.description && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{role.description}</p>}
                            {role.iconicScene && <p className="text-neutral-500 text-[10px] leading-relaxed mt-2 italic border-l-2 border-white/10 pl-3">{role.iconicScene}</p>}
                            {role.iconicDialogue && <p className="text-neutral-500 text-[10px] leading-relaxed mt-2 italic border-l-2 border-white/10 pl-3">"{role.iconicDialogue}"</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Character Artist: Hero Partnerships */}
                {heroPartnerships && Array.isArray(heroPartnerships) && heroPartnerships.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Hero Partnerships
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {heroPartnerships.map((partner: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-lg font-black text-white">{partner.hero || partner.heroName}</span>
                          </div>
                          <div className="space-y-2">
                            {partner.filmsCount && (
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs text-neutral-400">Films Together</span>
                                <span className="text-sm font-black text-white">{partner.filmsCount}</span>
                              </div>
                            )}
                            {partner.partnership && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{partner.partnership}</p>}
                            {partner.bestFilm && (
                              <div className="flex justify-between items-center border-b border-white/5 pb-2 mt-2">
                                <span className="text-xs text-neutral-400">Best Film</span>
                                <span className="text-xs font-bold text-white">{partner.bestFilm}</span>
                              </div>
                            )}
                            {partner.dynamicType && <p className={`text-[10px] uppercase tracking-widest font-bold ${theme.accent} mt-2`}>{partner.dynamicType}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Character Artist: Director Collaborations */}
                {directorCollaborations && Array.isArray(directorCollaborations) && directorCollaborations.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFilm /> Director Collaborations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {directorCollaborations.map((collab: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-lg font-black text-white">{collab.directorName || collab.director}</span>
                          </div>
                          <div className="space-y-2">
                            {collab.filmsTogether && (
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs text-neutral-400">Films Together</span>
                                <span className="text-sm font-black text-white">{collab.filmsTogether}</span>
                              </div>
                            )}
                            {collab.partnership && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{collab.partnership}</p>}
                            {collab.films && Array.isArray(collab.films) && (
                              <div className="mt-4 space-y-2">
                                {collab.films.map((film: any, i: number) => (
                                  <div key={i} className="flex flex-col gap-1 text-xs border-l-2 border-white/10 pl-2">
                                    <span className="font-bold text-neutral-300">{film.title} <span className="text-neutral-500">({film.year})</span></span>
                                    {film.character && <span className={`text-[9px] uppercase tracking-widest ${theme.accent}`}>{film.character}</span>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Singer: Vocal Profile */}
                {vocalProfile && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaMicrophone /> Vocal Profile
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(vocalProfile).map(([key, value]: [string, any]) => (
                          <div key={key} className="pl-4">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            {typeof value === 'string' ? (
                              <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                            ) : Array.isArray(value) ? (
                              <ul className="space-y-1">
                                {value.map((item: string, i: number) => (
                                  <li key={i} className="text-neutral-300 text-sm leading-relaxed flex items-center gap-2">
                                    <span className={`w-1 h-1 rounded-full ${theme.accentBg}`} /> {item}
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

                {/* Genre Versatility (Singers & Cinematographers) */}
                {genreVersatility && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaMusic /> Genre Mastery
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(genreVersatility).map(([genre, data]: [string, any]) => (
                        <div key={genre} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${data.expertise === 'Mastery' ? theme.accentBg : data.expertise === 'Strong' ? 'bg-neutral-400' : 'bg-neutral-600'} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          <div className="pl-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-black text-white uppercase tracking-tight">{genre.replace(/([A-Z])/g, ' $1').trim()}</h4>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${data.expertise === 'Mastery' ? theme.accent : 'text-neutral-400'}`}>{data.expertise}</span>
                            </div>
                            {(data.iconicSongs || data.notableFilms) && Array.isArray(data.iconicSongs || data.notableFilms) && (
                              <div className="space-y-1 mt-3">
                                {(data.iconicSongs || data.notableFilms).map((item: string, i: number) => (
                                  <p key={i} className="text-neutral-400 text-xs leading-relaxed border-l-2 border-white/10 pl-2">
                                    "{item}"
                                  </p>
                                ))}
                              </div>
                            )}
                            {data.editingApproach && (
                              <p className="text-neutral-400 text-[10px] leading-relaxed mt-3 pt-3 border-t border-white/5">
                                {data.editingApproach}
                              </p>
                            )}
                            {data.erasHandled && Array.isArray(data.erasHandled) && (
                              <div className="mt-3 pt-3 border-t border-white/5">
                                <p className="text-[9px] uppercase tracking-widest text-neutral-500 mb-2">Eras Handled</p>
                                <div className="flex flex-wrap gap-1">
                                  {data.erasHandled.map((era: string, i: number) => (
                                    <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-neutral-300">{era}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Singer: Music Director Collaborations */}
                {musicDirectorCollaborations && Array.isArray(musicDirectorCollaborations) && musicDirectorCollaborations.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaHeadphones /> Maestro Collaborations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {musicDirectorCollaborations.map((collab: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-black text-white">{collab.musicDirectorName || collab.musicDirector}</span>
                            {collab.songsTogether && <span className={`text-sm font-black ${theme.accent}`}>{collab.songsTogether} <span className="text-[10px] text-neutral-500 uppercase">Songs</span></span>}
                          </div>
                          <div className="space-y-2">
                            {collab.partnership && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{collab.partnership}</p>}
                            {collab.creativeChemistry && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{collab.creativeChemistry}</p>}
                            {collab.mostIconicSong && (
                              <div className="flex justify-between items-center border-b border-white/5 pb-2 mt-2">
                                <span className="text-xs text-neutral-400">Iconic Song</span>
                                <span className="text-xs font-bold text-white">{collab.mostIconicSong}</span>
                              </div>
                            )}
                            {collab.vocalarrangement && <p className={`text-[10px] leading-relaxed italic text-neutral-500 mt-2`}>{collab.vocalarrangement}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Singer: Duet Partnerships */}
                {duetPartnerships && Array.isArray(duetPartnerships) && duetPartnerships.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaUserFriends /> Duet Partnerships
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {duetPartnerships.map((partner: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-black text-white">{partner.partnerName || partner.partner}</span>
                            {partner.duetsTogether && <span className={`text-sm font-black ${theme.accent}`}>{partner.duetsTogether} <span className="text-[10px] text-neutral-500 uppercase">Duets</span></span>}
                          </div>
                          <div className="space-y-2">
                            {partner.vocalChemistry && <p className="text-neutral-400 text-xs leading-relaxed mt-2">{partner.vocalChemistry}</p>}
                            {partner.mostMemorableDuet && (
                              <div className="flex justify-between items-center border-b border-white/5 pb-2 mt-2">
                                <span className="text-xs text-neutral-400">Iconic Duet</span>
                                <span className="text-xs font-bold text-white">{partner.mostMemorableDuet}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Editor: Editing Style */}
                {editingStyle && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaCut /> Editing Signature
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(editingStyle).map(([key, value]: [string, any]) => (
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

                {/* Editor: Pacing & Rhythm */}
                {pacingAndRhythm && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaMusic /> Pacing & Rhythm
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(pacingAndRhythm).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          {typeof value === 'string' ? (
                            <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                          ) : Array.isArray(value) ? (
                            <ul className="space-y-2">
                              {value.map((item: string, i: number) => (
                                <li key={i} className="text-neutral-300 text-xs leading-relaxed border-l-2 border-white/10 pl-3">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PRO: Media Influence */}
                {mediaInfluence && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaNewspaper /> Influence & Reach
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(mediaInfluence).map(([key, value]: [string, any]) => (
                          <div key={key} className="pl-4">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* PRO: Journalism Career */}
                {journalismCareer && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaPenNib /> Journalistic Roots
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(journalismCareer).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          {typeof value === 'string' ? (
                            <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                          ) : Array.isArray(value) ? (
                            <ul className="space-y-2">
                              {value.map((item: string, i: number) => (
                                <li key={i} className="text-neutral-300 text-xs leading-relaxed border-l-2 border-white/10 pl-3">{item}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PRO: Industry Relationships */}
                {industryRelationships && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaUsers /> The Trust Network
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(industryRelationships).map(([key, value]: [string, any]) => (
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

                {/* Line Producer: Coordination Expertise */}
                {coordinationExpertise && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaTasks /> Operations Suite
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(coordinationExpertise).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          <div className="pl-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            {typeof value === 'string' ? (
                              <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                            ) : (
                              <div className="space-y-3">
                                {value.expertise && <p className={`text-xs font-black uppercase tracking-widest ${theme.accent}`}>{value.expertise}</p>}
                                {value.locationsHandled && (
                                  <div className="flex flex-wrap gap-1">
                                    {value.locationsHandled.map((loc: string, i: number) => (
                                      <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-neutral-400">{loc}</span>
                                    ))}
                                  </div>
                                )}
                                {Object.entries(value).map(([k, v]: [string, any]) => (
                                  !['expertise', 'locationsHandled'].includes(k) && (
                                    <div key={k}>
                                      <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter mb-1">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
                                      <p className="text-neutral-300 text-xs leading-relaxed">{v}</p>
                                    </div>
                                  )
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* VFX Supervisor: VFX Style */}
                {vfxStyle && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaCubes /> Visual Signature
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(vfxStyle).map(([key, value]: [string, any]) => (
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

                {/* VFX Supervisor: Technical Expertise */}
                {technicalExpertise && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaMicrochip /> The VFX Suite
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(technicalExpertise).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          {typeof value === 'string' ? (
                            <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                          ) : Array.isArray(value) ? (
                            <ul className="space-y-2">
                              {value.map((item: string, i: number) => (
                                <li key={i} className="text-neutral-300 text-xs leading-relaxed border-l-2 border-white/10 pl-3">{item}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Costume Designer: Costume Expertise */}
                {costumeExpertise && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaCut /> Costume Expertise
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(costumeExpertise).map(([type, data]: [string, any]) => (
                        <div key={type} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          <div className="pl-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500">
                              {type.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            {typeof data === 'string' ? (
                              <p className="text-neutral-300 text-sm leading-relaxed">{data}</p>
                            ) : (
                              <div className="space-y-3">
                                {data.expertise && <p className={`text-xs font-black uppercase tracking-widest ${theme.accent}`}>{data.expertise}</p>}
                                {data.historicalEras && (
                                  <div className="flex flex-wrap gap-1">
                                    {data.historicalEras.map((era: string, i: number) => (
                                      <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-neutral-400">{era}</span>
                                    ))}
                                  </div>
                                )}
                                {data.fabricTypes && (
                                  <div className="flex flex-wrap gap-1">
                                    {data.fabricTypes.map((fabric: string, i: number) => (
                                      <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-neutral-300 italic">{fabric}</span>
                                    ))}
                                  </div>
                                )}
                                {Object.entries(data).map(([k, v]: [string, any]) => (
                                  !['expertise', 'historicalEras', 'fabricTypes'].includes(k) && (
                                    <div key={k}>
                                      <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter mb-1">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
                                      <p className="text-neutral-300 text-xs leading-relaxed">{v}</p>
                                    </div>
                                  )
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Costume Designer: Character Costume Approach */}
                {characterCostumeApproach && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaUserTie /> Behavioral Design Philosophy
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <div className="space-y-6">
                        {Object.entries(characterCostumeApproach).map(([key, value]: [string, any]) => (
                          <div key={key} className="pl-4">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Art Director: Design Style */}
                {designStyle && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaPalette /> Design Signature
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(designStyle).map(([key, value]: [string, any]) => (
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

                {/* Art Director: Production Design Expertise */}
                {productionDesignExpertise && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaBuilding /> Production Design Expertise
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(productionDesignExpertise).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          {typeof value === 'string' ? (
                            <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                          ) : Array.isArray(value) ? (
                            <ul className="space-y-2">
                              {value.map((item: string, i: number) => (
                                <li key={i} className="text-neutral-300 text-xs leading-relaxed border-l-2 border-white/10 pl-3">{item}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stunt Director: Action Style */}
                {actionStyle && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFistRaised /> Action Signature
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(actionStyle).map(([key, value]: [string, any]) => (
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

                {/* Stunt Director: Stunt Expertise */}
                {stuntExpertise && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFistRaised /> Combat Expertise
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(stuntExpertise).map(([type, data]: [string, any]) => (
                        <div key={type} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${data.expertise === 'Mastery' ? theme.accentBg : data.expertise === 'Strong' ? 'bg-neutral-400' : 'bg-neutral-600'} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          <div className="pl-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-black text-white uppercase tracking-tight">{type.replace(/([A-Z])/g, ' $1').trim()}</h4>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${data.expertise === 'Mastery' ? theme.accent : 'text-neutral-400'}`}>{data.expertise}</span>
                            </div>
                            {data.styles && Array.isArray(data.styles) && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {data.styles.map((style: string, i: number) => (
                                  <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-neutral-300">{style}</span>
                                ))}
                              </div>
                            )}
                            {data.notableSequences && Array.isArray(data.notableSequences) && (
                              <div className="space-y-1 mt-3">
                                {data.notableSequences.map((seq: string, i: number) => (
                                  <p key={i} className="text-neutral-400 text-xs leading-relaxed border-l-2 border-white/10 pl-2">{seq}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stunt Director: Action Versatility */}
                {actionVersatility && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFilm /> Action Versatility
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(actionVersatility).map(([style, data]: [string, any]) => (
                        <div key={style} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${data.expertise === 'Mastery' ? theme.accentBg : data.expertise === 'Strong' ? 'bg-neutral-400' : 'bg-neutral-600'} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          <div className="pl-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-black text-white uppercase tracking-tight">{style.replace(/([A-Z])/g, ' $1').trim()}</h4>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${data.expertise === 'Mastery' ? theme.accent : 'text-neutral-400'}`}>{data.expertise}</span>
                            </div>
                            {data.notableFilms && Array.isArray(data.notableFilms) && (
                              <div className="space-y-1 mt-3">
                                {data.notableFilms.map((film: string, i: number) => (
                                  <p key={i} className="text-neutral-400 text-xs leading-relaxed border-l-2 border-white/10 pl-2">"{film}"</p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Choreographer: Dance Style */}
                {danceStyle && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaMusic /> Dance Signature
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(danceStyle).map(([key, value]: [string, any]) => (
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

                {/* Choreographer: Dance Style Versatility */}
                {danceStyleVersatility && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaMusic /> Style Mastery
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(danceStyleVersatility).map(([style, data]: [string, any]) => (
                        <div key={style} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${data.expertise === 'Mastery' ? theme.accentBg : data.expertise === 'Strong' ? 'bg-neutral-400' : 'bg-neutral-600'} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          <div className="pl-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-black text-white uppercase tracking-tight">{style.replace(/([A-Z])/g, ' $1').trim()}</h4>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${data.expertise === 'Mastery' ? theme.accent : 'text-neutral-400'}`}>{data.expertise}</span>
                            </div>
                            {data.notableSongs && Array.isArray(data.notableSongs) && (
                              <div className="space-y-1 mt-3">
                                {data.notableSongs.map((song: string, i: number) => (
                                  <p key={i} className="text-neutral-400 text-xs leading-relaxed border-l-2 border-white/10 pl-2">
                                    "{song}"
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Choreographer: Actor Collaborations */}
                {actorCollaborations && actorCollaborations.heroCollaborations && Array.isArray(actorCollaborations.heroCollaborations) && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaHandshake /> Star Partnerships
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {actorCollaborations.heroCollaborations.map((collab: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          <div className="pl-4">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="text-lg font-black text-white">{collab.heroName}</h5>
                              <span className={`text-sm font-black ${theme.accent}`}>{collab.songsChoreographed} <span className="text-[10px] uppercase text-neutral-500">Songs</span></span>
                            </div>
                            {collab.danceChemistry && <p className="text-neutral-400 text-xs leading-relaxed mb-3">{collab.danceChemistry}</p>}
                            {collab.mostIconicSong && (
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs text-neutral-400">Iconic Song</span>
                                <span className="text-xs font-bold text-white">{collab.mostIconicSong}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lyricist: Lyrical Style */}
                {lyricalStyle && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaPenNib /> Poetic Signature
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(lyricalStyle).map(([key, value]: [string, any]) => (
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

                {/* Lyricist: Frequent Director Collaborations */}
                {frequentDirectorCollaborations && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFilm /> Director Collaborations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(frequentDirectorCollaborations).map(([director, details]: [string, any]) => (
                        <div key={director} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          <div className="pl-4">
                            <h4 className="text-lg font-black text-white mb-2">{director.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}</h4>
                            {details.relationship && <p className={`text-[10px] font-black uppercase tracking-widest ${theme.accent} mb-3`}>{details.relationship}</p>}
                            {details.impact && <p className="text-neutral-400 text-xs leading-relaxed mb-4">{details.impact}</p>}
                            {details.films && Array.isArray(details.films) && (
                              <div>
                                <h5 className="text-[9px] uppercase tracking-widest text-neutral-500 mb-2">Notable Films</h5>
                                <div className="flex flex-wrap gap-2">
                                  {details.films.slice(0, 5).map((film: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-neutral-300">{film}</span>
                                  ))}
                                  {details.films.length > 5 && <span className="px-2 py-1 text-[10px] text-neutral-500">+{details.films.length - 5} more</span>}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cinematographer: Visual Style */}
                {visualStyle && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaEye /> Visual Style
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(visualStyle).map(([key, value]: [string, any]) => (
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

                {/* Cinematographer: Technical Expertise */}
                {technicalExpertise && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaCamera /> Technical Expertise
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(technicalExpertise).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          {typeof value === 'string' ? (
                            <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                          ) : Array.isArray(value) ? (
                            <ul className="space-y-2">
                              {value.map((item: string, i: number) => (
                                <li key={i} className="text-neutral-300 text-xs leading-relaxed border-l-2 border-white/10 pl-3">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Producer: Production Approach */}
                {productionApproach && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaIndustry /> Production Blueprint
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(productionApproach).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Producer: Star & Director Collaborations */}
                {starCollaborations && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaHandshake /> Landmark Partnerships
                    </h3>
                    
                    {starCollaborations.heroCollaborations && Array.isArray(starCollaborations.heroCollaborations) && (
                      <div className="mb-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4 px-2">Hero Collaborations</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {starCollaborations.heroCollaborations.map((collab: any, idx: number) => (
                            <div key={idx} className="p-6 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                              <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                              <div className="pl-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="text-lg font-black text-white">{collab.heroName}</h5>
                                  <span className={`text-sm font-black ${theme.accent}`}>{collab.filmsTogether} <span className="text-[10px] uppercase text-neutral-500">Films</span></span>
                                </div>
                                <p className="text-neutral-400 text-xs leading-relaxed mb-3">{collab.partnershipSuccess}</p>
                                {collab.mostSuccessfulProduction && (
                                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-xs text-neutral-400">Biggest Hit</span>
                                    <span className="text-xs font-bold text-white">{collab.mostSuccessfulProduction.split('-')[0]}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {starCollaborations.directorPartnerships && Array.isArray(starCollaborations.directorPartnerships) && (
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4 px-2">Director Partnerships</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {starCollaborations.directorPartnerships.map((collab: any, idx: number) => (
                            <div key={idx} className="p-6 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                              <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                              <div className="pl-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="text-lg font-black text-white">{collab.directorName}</h5>
                                  <span className={`text-sm font-black ${theme.accent}`}>{collab.filmsTogether} <span className="text-[10px] uppercase text-neutral-500">Films</span></span>
                                </div>
                                <p className="text-neutral-400 text-xs leading-relaxed mb-3">{collab.creativePartnership}</p>
                                {collab.successRate && (
                                  <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                                    <span className="text-xs text-neutral-400">Success Rate</span>
                                    <span className="text-xs font-bold text-white">{collab.successRate}</span>
                                  </div>
                                )}
                                {collab.mostSuccessfulProduction && (
                                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-xs text-neutral-400">Biggest Hit</span>
                                    <span className="text-xs font-bold text-white">{collab.mostSuccessfulProduction}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Music Director Sonic Blueprint */}
                {musicalEssence && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaMusic /> Musical Essence
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      
                      {Object.entries(musicalEssence).map(([key, value]) => {
                        if (typeof value !== 'string') return null;
                        return (
                          <div key={key} className="mb-6 pl-4 last:mb-0">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {orchestralProfile && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaMusic /> Orchestral Profile & Production
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {Object.entries(orchestralProfile).map(([key, value]) => {
                        if (typeof value !== 'string' && !Array.isArray(value)) return null;
                        return (
                          <div key={key} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500`}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            {typeof value === 'string' ? (
                              <p className="text-neutral-300 text-sm leading-relaxed">{value}</p>
                            ) : (
                              <ul className="space-y-2">
                                {value.map((item: string, i: number) => (
                                  <li key={i} className="text-neutral-300 text-xs flex gap-2"><span className={`${theme.accent} shrink-0`}>•</span>{item}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {musicalInnovations && musicalInnovations.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Musical Innovations
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {musicalInnovations.map((innovation: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-xs font-bold text-white mb-2`}>{innovation.innovation || innovation.title}</h4>
                          <p className="text-neutral-400 text-sm leading-relaxed">{innovation.description || innovation.impact}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Director Visionary Essence */}
                {visionaryEssence && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaFilm /> The Vision
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      
                      {visionaryEssence.directorialVision && (
                        <div className="mb-6 pl-4">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Directorial Vision</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{visionaryEssence.directorialVision}</p>
                        </div>
                      )}
                      
                      {visionaryEssence.signatureStyle && (
                        <div className="mb-6 pl-4">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Signature Style</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{visionaryEssence.signatureStyle}</p>
                        </div>
                      )}

                      {visionaryEssence.recurringThemes && (
                        <div className="mb-6 pl-4">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Recurring Themes</h4>
                          <p className="text-neutral-400 text-sm leading-relaxed">{visionaryEssence.recurringThemes}</p>
                        </div>
                      )}

                      {visionaryEssence.culturalImpact && (
                        <div className="mb-6 pl-4">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Cultural Impact</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed italic border-l-2 border-white/10 pl-4">{visionaryEssence.culturalImpact}</p>
                        </div>
                      )}
                      
                      {visionaryEssence.cinemaRevolution && (
                        <div className="pl-4">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Cinema Revolution</h4>
                          <p className="text-neutral-400 text-sm leading-relaxed">{visionaryEssence.cinemaRevolution}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Director Filmmaking Style */}
                {filmmakingStyle && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <span className={theme.accent}>✦</span> Filmmaking Style
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {filmmakingStyle.approach && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500`}>Approach</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{filmmakingStyle.approach}</p>
                        </div>
                      )}
                      {filmmakingStyle.visualLanguage && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500`}>Visual Language</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{filmmakingStyle.visualLanguage}</p>
                        </div>
                      )}
                      {filmmakingStyle.editingStyle && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500`}>Editing Style</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{filmmakingStyle.editingStyle}</p>
                        </div>
                      )}
                      {filmmakingStyle.soundDesign && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500`}>Sound Design</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{filmmakingStyle.soundDesign}</p>
                        </div>
                      )}
                      {filmmakingStyle.actorDirection && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 md:col-span-2">
                          <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-neutral-500`}>Actor Direction</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{filmmakingStyle.actorDirection}</p>
                        </div>
                      )}
                    </div>
                    
                    {(filmmakingStyle.technicalInnovations || filmmakingStyle.thematicPreoccupations || filmmakingStyle.styleEvolution) && (
                      <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5">
                        {filmmakingStyle.styleEvolution && (
                          <div className="mb-6">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme.accent}`}>Style Evolution</h4>
                            <p className="text-neutral-300 text-sm leading-relaxed italic">{filmmakingStyle.styleEvolution}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {filmmakingStyle.technicalInnovations && (
                            <div>
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500`}>Technical Innovations</h4>
                              {Array.isArray(filmmakingStyle.technicalInnovations) ? (
                                <ul className="space-y-2">
                                  {filmmakingStyle.technicalInnovations.map((item: string, i: number) => (
                                    <li key={i} className="text-neutral-400 text-xs flex gap-2"><span className={`${theme.accent} shrink-0`}>•</span>{item}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-neutral-400 text-sm leading-relaxed">{filmmakingStyle.technicalInnovations}</p>
                              )}
                            </div>
                          )}
                          {filmmakingStyle.thematicPreoccupations && filmmakingStyle.thematicPreoccupations.length > 0 && (
                            <div>
                              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500`}>Thematic Preoccupations</h4>
                              <ul className="space-y-2">
                                {filmmakingStyle.thematicPreoccupations.map((item: string, i: number) => (
                                  <li key={i} className="text-neutral-400 text-xs flex gap-2"><span className={`${theme.accent} shrink-0`}>•</span>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Iconic Roles (Legend) */}
                {iconicRoles.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Cinematic Milestones
                    </h3>
                    <div className="space-y-6">
                      {iconicRoles.map((role: any, idx: number) => (
                        <div key={idx} className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          
                          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-4 pl-4">
                            <div>
                              <h4 className="text-2xl font-black tracking-tight text-white mb-1">{role.characterName}</h4>
                              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{role.film} ({role.year})</span>
                            </div>
                            <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shrink-0 text-center">
                              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.accent} block`}>Role Type</span>
                              <span className="text-sm font-bold text-white">{role.roleType}</span>
                            </div>
                          </div>
                          
                          <div className="pl-4 space-y-3">
                            <p className="text-neutral-300 text-sm leading-relaxed"><span className="text-neutral-500 font-bold mr-2">Significance:</span>{role.significance}</p>
                            <p className="text-neutral-400 text-xs leading-relaxed"><span className="text-neutral-500 font-bold mr-2">Impact:</span>{role.culturalImpact}</p>
                            {role.legendaryQuote && (
                              <p className="text-neutral-300 text-xs italic bg-black/50 p-3 rounded-lg border border-white/5">"{role.legendaryQuote}"</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Physical Transformations Timeline */}
                {transformations.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Cinematic Transformations
                    </h3>
                    <div className="space-y-6">
                      {transformations.map((trans: any, idx: number) => (
                        <div key={idx} className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                          {/* Animated background line */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />

                          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-4 pl-4">
                            <div>
                              <h4 className="text-2xl font-black uppercase tracking-tight text-white mb-1">{trans.film}</h4>
                              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{trans.period}</span>
                            </div>

                            {/* Weight Tag */}
                            {(trans.targetWeight || trans.weightGained) && (
                              <div className={`px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shrink-0 text-center`}>
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.accent} block`}>Result</span>
                                <span className="text-sm font-bold text-white">{trans.targetWeight || trans.weightGained}</span>
                              </div>
                            )}
                          </div>

                          <p className="text-neutral-400 text-sm leading-relaxed pl-4">{trans.transformation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Iconic Dialogues Box */}
                {voiceProfile?.iconicDialogues && voiceProfile.iconicDialogues.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 mt-12 flex items-center gap-3">
                      <FaQuoteLeft /> Immortal Lines
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {voiceProfile.iconicDialogues.map((dialogue: any, idx: number) => (
                        <div key={idx} className={`p-8 rounded-[2rem] border border-white/5 bg-[#050505] relative ${theme.glowColor} group`}>
                          <FaQuoteLeft className={`text-4xl absolute top-6 right-6 opacity-10 ${theme.accent} group-hover:scale-110 transition-transform`} />
                          <p className="text-xl md:text-2xl font-bold text-white leading-tight mb-6 mt-4 relative z-10">
                            "{dialogue.dialogue}"
                          </p>
                          <div className="flex flex-col gap-1">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accent}`}>{dialogue.movie} ({dialogue.year})</span>
                            <span className="text-xs text-neutral-500">{dialogue.context}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Collaborations */}
                {(collaborations?.frequentDirectors || filmmakerRelationships?.frequentDirectors) && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 mt-12">Visionary Partners (Directors)</h3>
                    <div className="flex overflow-x-auto gap-4 pb-8 no-scrollbar snap-x">
                      {(collaborations?.frequentDirectors || filmmakerRelationships?.frequentDirectors).map((collab: any, idx: number) => (
                        <div key={idx} className="w-[300px] md:w-[400px] shrink-0 p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 snap-start flex flex-col justify-between whitespace-normal">
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-black text-white shrink-0">
                                {collab.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-lg font-black text-white leading-tight">{collab.name}</h4>
                                <span className={`text-[9px] uppercase tracking-widest ${theme.accent}`}>{collab.filmCount} Films</span>
                              </div>
                            </div>
                            {(collab.partnership || collab.chemistry) && (
                              <p className="text-sm text-neutral-400 leading-relaxed mb-6 italic">"{collab.partnership || collab.chemistry}"</p>
                            )}
                          </div>
                          <div>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {(Array.isArray(collab.films) ? collab.films : []).map((film: any, i: number) => (
                                <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/5">
                                  {typeof film === 'string' ? film : film.title}
                                </span>
                              ))}
                            </div>
                            {collab.legacy && (
                              <p className="text-xs text-neutral-500 mt-2"><strong className="text-neutral-400">Legacy:</strong> {collab.legacy}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {screenChemistryByCostar && (
                  <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] mb-8 mt-12">
                    <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Chemistry Breakdown</h4>
                    <div className="space-y-4">
                      {screenChemistryByCostar.bestChemistry && (
                        <div>
                          <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold mb-1 block">Best Chemistry</span>
                          <p className="text-neutral-300 text-sm leading-relaxed">{screenChemistryByCostar.bestChemistry}</p>
                        </div>
                      )}
                      {screenChemistryByCostar.chemistryComparisonAcrossActors && (
                        <div>
                          <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold mb-1 block">Actor Comparison</span>
                          <p className="text-neutral-300 text-sm leading-relaxed">{screenChemistryByCostar.chemistryComparisonAcrossActors}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {(collaborations?.frequentHeroines || filmmakerRelationships?.frequentHeroines) && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 mt-12">On-Screen Chemistry</h3>
                    <div className="flex overflow-x-auto gap-4 pb-8 no-scrollbar snap-x">
                      {(collaborations?.frequentHeroines || filmmakerRelationships?.frequentHeroines).map((collab: any, idx: number) => (
                        <div key={idx} className="w-[300px] md:w-[400px] shrink-0 p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 snap-start flex flex-col justify-between whitespace-normal">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-black text-white shrink-0">
                                  {collab.name.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="text-lg font-black text-white leading-tight">{collab.name}</h4>
                                  <span className={`text-[9px] uppercase tracking-widest ${theme.accent}`}>{collab.filmCount} Films</span>
                                </div>
                              </div>
                              {collab.fanFollowing && <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded ${theme.badgeTheme}`}>{collab.fanFollowing}</span>}
                            </div>
                            {(collab.chemistry || collab.relationship) && (
                              <p className="text-sm text-neutral-400 leading-relaxed mb-4 italic">"{collab.chemistry || collab.relationship}"</p>
                            )}
                          </div>
                          {collab.films && (
                            <div className="flex flex-wrap gap-2">
                              {(Array.isArray(collab.films) ? collab.films : []).map((film: any, i: number) => (
                                <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/5">
                                  {typeof film === 'string' ? film : film.title}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(screenChemistry?.frequentLeadMen) && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 mt-12">On-Screen Chemistry</h3>
                    <div className="flex overflow-x-auto gap-4 pb-8 no-scrollbar snap-x">
                      {screenChemistry.frequentLeadMen.map((collab: any, idx: number) => (
                        <div key={idx} className="w-[300px] md:w-[400px] shrink-0 p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 snap-start flex flex-col justify-between whitespace-normal">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-black text-white shrink-0">
                                  {collab.actorName.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="text-lg font-black text-white leading-tight">{collab.actorName}</h4>
                                  <span className={`text-[9px] uppercase tracking-widest ${theme.accent}`}>{collab.pairingCount} Films</span>
                                </div>
                              </div>
                            </div>
                            {(collab.chemistry) && (
                              <p className="text-sm text-neutral-400 leading-relaxed mb-4 italic">"{collab.chemistry}"</p>
                            )}
                            {collab.fanFollowing && <p className={`text-[10px] text-neutral-500 leading-relaxed mb-4`}>Fan Following: {collab.fanFollowing}</p>}
                          </div>
                          {collab.latestFilm && (
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/5">
                                Latest: {collab.latestFilm}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(collaborations?.musicDirectors || filmmakerRelationships?.musicDirectors) && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 mt-4">Musical Synergy</h3>
                    <div className="flex overflow-x-auto gap-4 pb-8 no-scrollbar snap-x">
                      {(collaborations?.musicDirectors || filmmakerRelationships?.musicDirectors).map((collab: any, idx: number) => (
                        <div key={idx} className="w-[300px] md:w-[400px] shrink-0 p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 snap-start whitespace-normal">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                              <FaMusic className="text-neutral-400" />
                            </div>
                            <div>
                              <h4 className="text-lg font-black text-white leading-tight">{collab.name || collab.musicDirector}</h4>
                              {collab.filmCount && <span className={`text-[9px] uppercase tracking-widest ${theme.accent}`}>{collab.filmCount} Films</span>}
                            </div>
                          </div>
                          {(collab.relationship || collab.chemistry) && (
                            <p className="text-sm text-neutral-400 leading-relaxed mb-4 italic">"{collab.relationship || collab.chemistry}"</p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {(collab.legendaryCompositions || collab.films || []).map((comp: any, i: number) => (
                              <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/5">
                                {typeof comp === 'string' ? comp : comp.title}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Director Collaborations */}
                {(collaborations?.heroCollaborations || collaborations?.heroineCollaborations || collaborations?.cinematographers) && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 mt-8 flex items-center gap-3">
                      <FaFilm /> Iconic Collaborations
                    </h3>
                    
                    {collaborations.heroCollaborations && (
                      <div className="mb-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4 px-2">Hero Collaborations</h4>
                        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
                          {collaborations.heroCollaborations.map((collab: any, idx: number) => (
                            <div key={idx} className="w-[300px] md:w-[400px] shrink-0 p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 snap-start whitespace-normal flex flex-col justify-between">
                              <div>
                                <h4 className="text-lg font-black text-white mb-2">{collab.actor}</h4>
                                {collab.legacy && <p className="text-sm text-neutral-400 leading-relaxed mb-4 italic">"{collab.legacy}"</p>}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {(collab.films || []).map((film: string, i: number) => (
                                  <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/5">
                                    {film}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {collaborations.heroineCollaborations && (
                      <div className="mb-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4 px-2">Heroine Collaborations</h4>
                        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
                          {collaborations.heroineCollaborations.map((collab: any, idx: number) => (
                            <div key={idx} className="w-[300px] md:w-[400px] shrink-0 p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 snap-start whitespace-normal flex flex-col justify-between">
                              <div>
                                <h4 className="text-lg font-black text-white mb-2">{collab.actor}</h4>
                                {collab.legacy && <p className="text-sm text-neutral-400 leading-relaxed mb-4 italic">"{collab.legacy}"</p>}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {(collab.films || []).map((film: string, i: number) => (
                                  <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/5">
                                    {film}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {collaborations.cinematographers && (
                      <div className="mb-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4 px-2">Cinematographers</h4>
                        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
                          {collaborations.cinematographers.map((collab: any, idx: number) => (
                            <div key={idx} className="w-[300px] md:w-[400px] shrink-0 p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 snap-start whitespace-normal flex flex-col justify-between">
                              <div>
                                <h4 className="text-lg font-black text-white mb-2">{collab.name || collab.cinematographer}</h4>
                                {collab.visualStyle && <p className="text-sm text-neutral-400 leading-relaxed mb-4 italic">"{collab.visualStyle}"</p>}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {(collab.films || []).map((film: string, i: number) => (
                                  <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/5">
                                    {film}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}



                {/* Dubbing Artists */}
                {voiceProfile?.dubbingArtists && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Voice Counterparts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(voiceProfile.dubbingArtists).map(([lang, artist]: [string, any]) => (
                        <div key={lang} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between">
                          <span className="text-xs font-bold text-white uppercase tracking-wide">{lang}</span>
                          <span className="text-xs text-neutral-400 text-right max-w-[60%]">{artist}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Playback Singers */}
                {voiceProfile?.playbackSingers && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Musical Voices</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {voiceProfile.playbackSingers.primary && (
                        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between">
                          <span className="text-xs font-bold text-white uppercase tracking-wide">Primary Voice</span>
                          <span className="text-xs text-neutral-400 text-right max-w-[60%]">{voiceProfile.playbackSingers.primary}</span>
                        </div>
                      )}
                      {voiceProfile.playbackSingers.others?.map((singer: string, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between">
                          <span className="text-xs font-bold text-white uppercase tracking-wide">Frequent Voice</span>
                          <span className="text-xs text-neutral-400 text-right max-w-[60%]">{singer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
  );
}
