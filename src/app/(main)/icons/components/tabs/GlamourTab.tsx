export default function GlamourTab({ data, theme }: { data: any, theme: any }) {
  const beautyProfile = data.beautyProfile || data.beautyAndStyle || null;
  const fashionIcon = data.fashionIcon || data.fashionAndStyle || null;

  return (
    <>
      {/* Beauty Profile */}
      {beautyProfile && (
        <div className="mb-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 flex items-center gap-3">
            <span className={theme.accent}>✦</span> Beauty & Aesthetics
          </h3>
          
          {beautyProfile.philosophy && (
            <div className="p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 relative overflow-hidden mb-8">
              <div className={`absolute top-0 right-0 w-full h-1 ${theme.accentBg} opacity-20`} />
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500`}>Philosophy & Iconic Look</h4>
              <p className="text-lg text-neutral-300 leading-relaxed italic">
                "{beautyProfile.philosophy}"
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {beautyProfile.skinCare && (
              <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Skincare Protocol</h4>
                {beautyProfile.skinCare.dailyRoutine && (
                  <p className="text-neutral-300 text-sm leading-relaxed mb-3">{beautyProfile.skinCare.dailyRoutine}</p>
                )}
                {beautyProfile.skinCare.productsUsed && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {beautyProfile.skinCare.productsUsed.map((prod: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300 border border-white/10">{prod}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(beautyProfile.makeupObj || beautyProfile.makeupStr || beautyProfile.hairStr) && (
              <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Signature Look</h4>
                {beautyProfile.makeupStr && (
                  <p className="text-neutral-300 text-sm leading-relaxed mb-4">{beautyProfile.makeupStr}</p>
                )}
                {beautyProfile.hairStr && (
                  <p className="text-neutral-300 text-sm leading-relaxed mb-4"><span className="text-neutral-500 mr-2">Hair:</span>{beautyProfile.hairStr}</p>
                )}
                {beautyProfile.makeupObj?.dailyMakeup && (
                  <p className="text-neutral-300 text-sm leading-relaxed mb-3"><span className="text-neutral-500 mr-2">Daily:</span>{beautyProfile.makeupObj.dailyMakeup}</p>
                )}
                {beautyProfile.makeupObj?.redCarpetMakeup && (
                  <p className="text-neutral-300 text-sm leading-relaxed"><span className="text-neutral-500 mr-2">Red Carpet:</span>{beautyProfile.makeupObj.redCarpetMakeup}</p>
                )}
              </div>
            )}
            
            {(beautyProfile.makeupInfluence || beautyProfile.makeupArtistTestimonies) && (
              <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] ${theme.glowColor}`}>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Makeup Influence</h4>
                {beautyProfile.makeupInfluence && <p className="text-neutral-300 text-sm leading-relaxed mb-4">{beautyProfile.makeupInfluence}</p>}
                {beautyProfile.makeupArtistTestimonies && <p className="text-neutral-300 text-sm leading-relaxed italic border-l-2 border-white/20 pl-4">"{beautyProfile.makeupArtistTestimonies}"</p>}
              </div>
            )}

            {(beautyProfile.legacyStr || beautyProfile.physicalAttributes || beautyProfile.internationalAppeal) && (
              <div className={`p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] md:col-span-2 ${theme.glowColor}`}>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>The Legacy</h4>
                {beautyProfile.physicalAttributes && (
                  <div className="mb-4">
                    <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold mb-1 block">Physical Attributes</span>
                    <p className="text-neutral-300 text-sm leading-relaxed">{beautyProfile.physicalAttributes}</p>
                  </div>
                )}
                {beautyProfile.legacyStr && (
                  <div className="mb-4">
                    <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold mb-1 block">Influence on Generations</span>
                    <p className="text-neutral-300 text-sm leading-relaxed">{beautyProfile.legacyStr}</p>
                  </div>
                )}
                {beautyProfile.internationalAppeal && (
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold mb-1 block">International Appeal</span>
                    <p className="text-neutral-300 text-sm leading-relaxed">{beautyProfile.internationalAppeal}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fashion Icon */}
      {fashionIcon && (
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 flex items-center gap-3">
            <span className={theme.accent}>✦</span> Sartorial Elegance
          </h3>
          
          {(fashionIcon.styleDescription || fashionIcon.evolution) && (
            <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 mb-8">
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Style Blueprint</h4>
              {fashionIcon.styleDescription && (
                <p className="text-neutral-300 text-sm leading-relaxed mb-6">{fashionIcon.styleDescription}</p>
              )}
              {fashionIcon.evolution && (
                <p className="text-neutral-300 text-sm leading-relaxed mb-6"><span className="text-neutral-500 mr-2">Evolution:</span>{fashionIcon.evolution}</p>
              )}
              {fashionIcon.trendSetter && (
                <p className="text-neutral-300 text-sm leading-relaxed mb-6"><span className="text-neutral-500 mr-2">Trendsetter:</span>{fashionIcon.trendSetter}</p>
              )}
              {fashionIcon.fashionArchives && (
                <p className="text-neutral-300 text-sm leading-relaxed mb-6"><span className="text-neutral-500 mr-2">Archives:</span>{fashionIcon.fashionArchives}</p>
              )}
              {fashionIcon.collaborationWithDesigners && fashionIcon.collaborationWithDesigners.length > 0 && (
                <div className="mb-6">
                  <span className="text-neutral-500 mr-2 text-[10px] uppercase tracking-widest font-bold block mb-2">Designers</span>
                  <div className="flex flex-wrap gap-2 inline-flex">
                    {fashionIcon.collaborationWithDesigners.map((d: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-white/5 rounded border border-white/5 text-[10px] uppercase tracking-widest text-neutral-300">{d}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {(fashionIcon.signatureLook || fashionIcon.everydayStyle) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/5">
                  {fashionIcon.signatureLook && (
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Signature Look</span>
                      <span className="text-xs font-bold text-neutral-300">{fashionIcon.signatureLook}</span>
                    </div>
                  )}
                  {fashionIcon.everydayStyle && (
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Everyday Style</span>
                      <span className="text-xs font-bold text-neutral-300">{fashionIcon.everydayStyle}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {fashionIcon.trends && fashionIcon.trends.length > 0 && (
            <div className="space-y-6">
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 px-2 ${theme.accent}`}>Trendsetting Moments</h4>
              {fashionIcon.trends.map((trend: any, idx: number) => (
                <div key={idx} className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                  <div className="flex justify-between items-start mb-4 pl-4">
                    <h5 className="text-lg font-black text-white">{trend.trend || trend.outfit}</h5>
                    {(trend.whenStarted || trend.year) && (
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${theme.badgeTheme}`}>{trend.whenStarted || trend.year}</span>
                    )}
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed pl-4 mb-4">{trend.impact || trend.adoption || trend.description}</p>
                  {trend.film && (
                      <span className={`text-[10px] ml-4 font-bold uppercase tracking-widest text-neutral-500 border border-white/5 px-2 py-1 rounded-md`}>Film: {trend.film}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
