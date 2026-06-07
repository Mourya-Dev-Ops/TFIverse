import { FaStar, FaQuoteLeft } from "react-icons/fa";

export default function OverviewTab({ data, theme }: { data: any, theme: any }) {
  const aura = data.heroAura || data.queenAura || data.divaAura || data.risingQueenAura || data.antagonistEssence || data.comedyEssence || data.characterEssence || data.singerEssence || data.producerEssence || data.cinematographyEssence || data.editingEssence || data.lyricalEssence || data.choreographyEssence || data.stuntEssence || data.artDirectionEssence || data.costumeEssence || data.vfxEssence || data.lineProducerEssence || data.proEssence || null;
  const debutAnalysis = data.debutAnalysis || null;
  const breakingMoment = data.breakingMoment || null;
  const knownFor = data.knownFor || [];
  const favorites = data.favorites || null;
  const hobbies = data.hobbiesAndInterests || data.hobbies || [];
  const quotes = data.quotes || [];

  return (
    <>
      {/* Cinematic Bio */}
      <div className="relative p-10 md:p-14 rounded-[2rem] bg-[#0a0a0a] border border-white/5 overflow-hidden group hover:border-white/10 transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <FaStar className={`absolute top-10 right-10 text-4xl opacity-5 ${theme.accent}`} />

        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-8 flex items-center gap-4">
          <span className={`w-4 h-4 rounded-full ${theme.accentBg} animate-pulse opacity-50`} />
          The Legend
        </h3>
        <div className="text-base md:text-lg lg:text-xl leading-[1.8] text-neutral-300 font-light tracking-wide">
          <p className="first-letter:text-6xl md:first-letter:text-8xl first-letter:font-black first-letter:text-white first-letter:mr-3 first-letter:mt-2 first-letter:float-left">
            {data.bio}
          </p>
        </div>
      </div>

      {/* Debut & Breakthrough (Rising Stars) */}
      {(debutAnalysis || breakingMoment) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {debutAnalysis && (
            <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] relative overflow-hidden group">
              <div className={`absolute left-0 top-0 w-1 h-full ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>The Origin</h4>
              <div className="mb-4">
                <span className="text-xl font-black text-white">{debutAnalysis.debutFilm}</span>
                <span className="text-xs text-neutral-500 font-bold ml-2">({debutAnalysis.debutYear})</span>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">{debutAnalysis.debutRole}</p>
              <p className="text-neutral-500 text-xs italic">"{debutAnalysis.significance}"</p>
            </div>
          )}
          {breakingMoment && (
            <div className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] relative overflow-hidden group">
              <div className={`absolute left-0 top-0 w-1 h-full ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>The Breakthrough</h4>
              <div className="mb-4">
                <span className="text-xl font-black text-white">{breakingMoment.film}</span>
                <span className="text-xs text-neutral-500 font-bold ml-2">({breakingMoment.year})</span>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">{breakingMoment.impact}</p>
              {breakingMoment.collection && (
                <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase text-neutral-300">
                  Box Office: {breakingMoment.collection}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Aura Bento Grid */}
      {aura && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {(aura.boxOfficeAppeal || aura.legendaryAppeal) && (
            <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>{aura.legendaryAppeal ? 'Legendary Appeal' : 'Box Office Appeal'}</h4>
              <p className="text-neutral-400 leading-relaxed text-sm">{aura.boxOfficeAppeal || aura.legendaryAppeal}</p>
            </div>
          )}
          {aura.screenPresence && (
            <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Screen Presence</h4>
              <p className="text-neutral-400 leading-relaxed text-sm">{aura.screenPresence}</p>
            </div>
          )}
          {aura.beautyLegacy && (
            <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Beauty Legacy</h4>
              <p className="text-neutral-400 leading-relaxed text-sm">{aura.beautyLegacy}</p>
            </div>
          )}
          {(aura.signature || aura.signatureStyle) && (
            <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Signature Style</h4>
              <p className="text-neutral-400 leading-relaxed text-sm">{aura.signature || aura.signatureStyle}</p>
            </div>
          )}
          {aura.trademarkStyle && (
            <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Trademark</h4>
              <p className="text-neutral-400 leading-relaxed text-sm">{aura.trademarkStyle}</p>
            </div>
          )}
          {aura.modernAppeal && (
            <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Modern Appeal</h4>
              <p className="text-neutral-400 leading-relaxed text-sm">{aura.modernAppeal}</p>
            </div>
          )}
          {aura.fanbase && (
            <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] md:col-span-2 ${theme.glowColor}`}>
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>The Fanbase</h4>
              <p className="text-neutral-400 leading-relaxed text-sm md:text-base">{aura.fanbase}</p>
            </div>
          )}
          {aura.cinematicLegacy && (
            <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] md:col-span-2 ${theme.glowColor}`}>
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Cinematic Legacy</h4>
              <p className="text-neutral-400 leading-relaxed text-sm md:text-base">{aura.cinematicLegacy}</p>
            </div>
          )}
        </div>
      )}

      {/* Known For Highlights */}
      {knownFor.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2">Defining Legacy</h3>
          <div className="space-y-3">
            {knownFor.map((item: string, idx: number) => (
              <div key={idx} className="flex gap-4 items-start p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
                <span className={`text-lg font-black ${theme.accent} shrink-0 mt-0.5`}>0{idx + 1}</span>
                <p className="text-neutral-400 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorites Mini Bento */}
      {favorites && Object.keys(favorites).length > 0 && (
        <div className="mt-8">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2">Favorites & Preferences</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(favorites).map(([key, value], idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 flex flex-col justify-center">
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-2 block">{key}</span>
                <span className="font-bold text-neutral-200 text-sm">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hobbies & Interests - Full Detail */}
      {hobbies && hobbies.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-4">Beyond Cinema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hobbies.map((hobby: any, idx: number) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 group hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">{typeof hobby === 'string' ? hobby : hobby.hobby}</h4>
                  {hobby.proficiency && (
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${theme.badgeTheme}`}>{hobby.proficiency}</span>
                  )}
                </div>
                {hobby.description && <p className="text-neutral-500 text-xs leading-relaxed">{hobby.description}</p>}
                {hobby.impact && <p className="text-neutral-600 text-[10px] leading-relaxed mt-2 italic">{hobby.impact}</p>}
                {hobby.frequency && <span className="text-[9px] text-neutral-600 uppercase tracking-widest mt-2 block">{hobby.frequency}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quotes */}
      {quotes.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-4">In Their Words</h3>
          <div className="space-y-4">
            {quotes.slice(0, 4).map((q: any, idx: number) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 relative">
                <FaQuoteLeft className="text-xl opacity-10 absolute top-4 right-4" />
                <p className="text-neutral-300 text-sm leading-relaxed italic mb-3">"{q.quote}"</p>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${theme.accent}`}>{q.year}</span>
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
