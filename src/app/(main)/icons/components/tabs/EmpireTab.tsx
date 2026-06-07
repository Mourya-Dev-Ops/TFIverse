import { FaInstagram, FaTwitter, FaImdb, FaCar, FaHome, FaStar, FaQuoteLeft, FaDumbbell, FaMoneyBillWave, FaFilm, FaCrown, FaChartBar, FaMusic, FaFire, FaFistRaised, FaHandshake, FaPenNib, FaEye, FaCamera, FaIndustry, FaTrophy, FaLightbulb, FaHeart, FaComments, FaGlobe, FaCalendarAlt, FaPlayCircle, FaBuilding } from "react-icons/fa";
export default function EmpireTab({ data, theme, category }: { data: any, theme: any, category?: string }) {
  const politicalCareer = data.politicalCareer || null;
  const financial = data.financial || null;
  const lifestyle = data.lifestyle || null;
  const productionHouse = data.productionHouse || null;
  const brandValue = data.brandValue || null;
  return (
              <>
                {/* Political Career (Legend) */}
                {politicalCareer && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaStar /> Political Empire
                    </h3>
                    <div className={`p-10 rounded-[2rem] bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 relative overflow-hidden ${theme.glowColor}`}>
                      <div className="absolute -right-10 -bottom-10 opacity-[0.03]">
                        <FaStar size={250} />
                      </div>
                      <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between">
                        <div className="flex-1">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Party Founded</span>
                          <h3 className={`text-4xl md:text-5xl font-black tracking-tighter ${theme.accent} mb-2`}>
                            {politicalCareer.partyFounded}
                          </h3>
                          <p className="text-neutral-400 text-sm italic font-bold">"{politicalCareer.foundingPrinciple}"</p>
                          <span className="text-xs text-neutral-500 block mt-2">Founded: {politicalCareer.foundingDate}</span>
                        </div>
                        <div className="flex flex-col justify-center items-start md:items-end">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-1 block">Electoral Victories</span>
                          <span className="text-6xl font-black text-white">{politicalCareer.electoralVictories}</span>
                        </div>
                      </div>

                      {/* Chief Minister Terms */}
                      {politicalCareer.chiefMinisterTerms && (
                        <div className="mt-8">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500">Chief Minister Terms</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {politicalCareer.chiefMinisterTerms.map((term: any, idx: number) => (
                              <div key={idx} className="p-4 rounded-xl bg-[#050505] border border-white/5 relative group">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-20 group-hover:opacity-100 transition-opacity rounded-l-xl`} />
                                <div className="pl-4">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">Term {term.termNumber} ({term.duration})</span>
                                  <p className="text-sm font-bold text-white mb-2">{term.period}</p>
                                  <p className="text-xs text-neutral-500">{term.achievement}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Major Policies */}
                      {politicalCareer.majorPolicies && (
                        <div className="mt-8">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500">Major Policies</h4>
                          <div className="flex flex-wrap gap-2">
                            {politicalCareer.majorPolicies.map((policy: string, idx: number) => (
                              <span key={idx} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/5">
                                {policy}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Campaign Innovations */}
                      {politicalCareer.campaignInnovations && (
                        <div className="mt-8">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500">Campaign Innovations</h4>
                          <ul className="space-y-2">
                            {politicalCareer.campaignInnovations.map((innovation: string, idx: number) => (
                              <li key={idx} className="text-neutral-400 text-xs flex gap-2"><span className={`${theme.accent} shrink-0`}>•</span>{innovation}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Net Worth Hero Box */}
                {financial?.netWorth && (
                  <div className={`p-10 rounded-[2rem] bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 ${theme.glowColor}`}>
                    <div className="absolute -right-10 -bottom-10 opacity-5">
                      <FaMoneyBillWave size={200} />
                    </div>
                    <div className="relative z-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Estimated Valuation</span>
                      <h3 className={`text-5xl md:text-7xl font-black tracking-tighter ${theme.accent}`}>
                        {financial.netWorth.estimatedValue}
                      </h3>
                      {financial.netWorth.perFilmFee && (
                        <span className="text-sm font-bold text-neutral-300 mt-2 block bg-white/5 px-4 py-1.5 rounded-full inline-block border border-white/10">
                          {financial.netWorth.perFilmFee}
                        </span>
                      )}
                    </div>
                    {financial.netWorth.ranking && (
                      <div className="text-right relative z-10 hidden md:block max-w-xs">
                        <span className="text-xs text-neutral-400 leading-relaxed font-bold uppercase tracking-widest">
                          {financial.netWorth.ranking}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* The Garage (Cars) */}
                {lifestyle?.carCollection && lifestyle.carCollection.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8 flex items-center gap-3">
                      <FaCar /> The Garage
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lifestyle.carCollection.map((car: any, idx: number) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 flex flex-col justify-between group hover:border-white/20 transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-black uppercase tracking-tight text-white">{car.make} {car.model}</h4>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">{car.color} • {car.year}</span>
                            </div>
                            <span className={`text-xs font-bold ${theme.accent} whitespace-nowrap`}>{car.estimatedValue}</span>
                          </div>
                          <p className="text-xs text-neutral-400">{car.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real Estate / Properties */}
                {lifestyle?.properties && lifestyle.properties.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8 flex items-center gap-3">
                      <FaHome /> Real Estate Portfolio
                    </h3>
                    <div className="space-y-4">
                      {lifestyle.properties.map((prop: any, idx: number) => (
                        <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 flex flex-col md:flex-row gap-6 justify-between group">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-xl font-black uppercase tracking-tight text-white">{prop.location}</h4>
                              {prop.primaryResidence && (
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${theme.badgeTheme}`}>Primary</span>
                              )}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-4">{prop.type} • {prop.area}</span>
                            <p className="text-sm text-neutral-400 leading-relaxed">{prop.description}</p>
                          </div>
                          <div className="shrink-0 flex items-start md:justify-end">
                            <span className={`text-lg font-black ${theme.accent}`}>{prop.estimatedValue}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Business Ventures */}
                {financial?.businessVentures && (typeof financial.businessVentures === 'string' ? financial.businessVentures.length > 0 : true) && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Corporate Ventures</h3>
                    {Array.isArray(financial.businessVentures) ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {financial.businessVentures.map((venture: any, idx: number) => (
                          <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 group hover:border-white/10 transition-colors">
                            <span className={`text-[9px] uppercase tracking-widest ${theme.accent} font-bold mb-1 block`}>{venture.industry || venture.type}</span>
                            <h4 className="text-lg font-black text-white mb-1">{venture.name}</h4>
                            {venture.stake && <span className="text-xs text-neutral-500 block mb-1">{venture.stake}</span>}
                            {venture.role && <span className="text-xs text-neutral-400 block">{venture.role}</span>}
                            {venture.status && <span className={`text-[9px] uppercase tracking-widest ${theme.accent} font-bold block mt-2`}>{venture.status}</span>}
                            {venture.notes && <p className="text-neutral-500 text-[10px] leading-relaxed mt-2">{venture.notes}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                        <p className="text-sm text-neutral-400 leading-relaxed">{financial.businessVentures}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Earnings Breakdown (Superstar) */}
                {financial?.earnings && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Earnings Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(financial.earnings).map(([key, val]: [string, any]) => (
                        <div key={key} className="p-5 rounded-xl bg-[#0a0a0a] border border-white/5">
                          <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-sm font-bold text-neutral-300">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Investments (Legend) */}
                {financial?.investments && Array.isArray(financial.investments) && financial.investments.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Investments</h3>
                    <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                      <ul className="space-y-2">
                        {financial.investments.map((inv: string, i: number) => (
                          <li key={i} className="text-neutral-400 text-xs leading-relaxed flex gap-2"><span className={`${theme.accent} shrink-0`}>•</span>{inv}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Assets (Legend) */}
                {financial?.assets && Array.isArray(financial.assets) && financial.assets.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Asset Portfolio</h3>
                    <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                      <ul className="space-y-2">
                        {financial.assets.map((asset: string, i: number) => (
                          <li key={i} className="text-neutral-400 text-xs leading-relaxed flex gap-2"><span className="text-neutral-600 shrink-0">—</span>{asset}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Endorsements */}
                {(financial?.endorsements || financial?.brandEndorsements) && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Brand Portfolio</h3>
                    {Array.isArray(financial.endorsements) ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {financial.endorsements.map((brand: any, idx: number) => (
                          <div key={idx} className="p-5 rounded-xl bg-[#0a0a0a] border border-white/5 group hover:border-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-bold text-white">{brand.brand}</h4>
                              {brand.annualDeal && <span className={`text-xs font-bold ${theme.accent}`}>{brand.annualDeal}</span>}
                            </div>
                            <span className="text-[10px] text-neutral-500 block mb-1">{brand.category}</span>
                            {brand.status && <span className={`text-[9px] uppercase tracking-widest font-bold block mb-1 ${brand.status?.includes('Active') ? 'text-green-500' : 'text-neutral-600'}`}>{brand.status}</span>}
                            {brand.notes && <p className="text-neutral-500 text-[10px] leading-relaxed mt-1">{brand.notes}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                        <p className="text-sm text-neutral-400 leading-relaxed">{financial.endorsements || financial.brandEndorsements}</p>
                      </div>
                    )}
                  </div>
                )}
                {/* Fashion & Watches */}
                {lifestyle?.fashion && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Style & Horlogerie</h3>
                    {lifestyle.fashion.signatureLook && (
                      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 mb-4">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${theme.accent}`}>Signature Look</h4>
                        <p className="text-neutral-400 text-xs leading-relaxed">{lifestyle.fashion.signatureLook}</p>
                      </div>
                    )}
                    {lifestyle.fashion.favoriteDesigners && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {lifestyle.fashion.favoriteDesigners.map((d: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 bg-white/5 rounded-full text-[10px] font-bold text-neutral-300 uppercase tracking-widest">{d}</span>
                        ))}
                      </div>
                    )}
                    {lifestyle.fashion.watches && lifestyle.fashion.watches.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {lifestyle.fashion.watches.map((w: any, idx: number) => (
                          <div key={idx} className="p-5 rounded-xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-black text-white">{w.brand}</h4>
                              <span className="text-[10px] text-neutral-500">{w.model} • {w.year}</span>
                            </div>
                            <span className={`text-xs font-bold ${theme.accent}`}>{w.estimatedValue}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Producer: Production House */}
                {productionHouse && (
                  <div className="mb-12">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 px-2 flex items-center gap-3">
                      <FaBuilding /> Production Empire
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <div className="pl-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b border-white/5 pb-6">
                          <div>
                            <h4 className="text-2xl font-black text-white mb-1">{productionHouse.bannerName}</h4>
                            {productionHouse.tagline && <p className="text-neutral-400 text-sm italic">"{productionHouse.tagline}"</p>}
                          </div>
                          {productionHouse.established && (
                            <div className="text-right">
                              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block mb-1">Established</span>
                              <span className={`text-xl font-black ${theme.accent}`}>{productionHouse.established}</span>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {productionHouse.founders && (
                            <div>
                              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Founders</h5>
                              <p className="text-neutral-300 text-sm font-bold">{Array.isArray(productionHouse.founders) ? productionHouse.founders.join(', ') : productionHouse.founders}</p>
                            </div>
                          )}
                          {productionHouse.totalProductions && (
                            <div>
                              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Total Productions</h5>
                              <p className={`text-neutral-300 text-lg font-black ${theme.accent}`}>{productionHouse.totalProductions}+ Films</p>
                            </div>
                          )}
                          {productionHouse.activeBanners && Array.isArray(productionHouse.activeBanners) && (
                            <div className="md:col-span-2">
                              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-3">Active Banners</h5>
                              <div className="flex flex-wrap gap-2">
                                {productionHouse.activeBanners.map((banner: string, i: number) => (
                                  <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-neutral-300 font-bold">{banner}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {productionHouse.industryReputation && (
                            <div className="md:col-span-2">
                              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Industry Reputation</h5>
                              <p className="text-neutral-400 text-xs leading-relaxed border-l-2 border-white/10 pl-3">{productionHouse.industryReputation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Brand Value (Director) */}
                {brandValue && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Brand Value</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {brandValue.estimatedFeePerFilm && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Estimated Fee</span>
                          <span className={`text-2xl font-black ${theme.accent}`}>{brandValue.estimatedFeePerFilm}</span>
                        </div>
                      )}
                      {brandValue.marketValue && (
                        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 md:col-span-2">
                          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Market Position</span>
                          <p className="text-neutral-300 text-sm leading-relaxed">{brandValue.marketValue}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
  );
}
