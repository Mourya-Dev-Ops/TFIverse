import { FaDumbbell } from "react-icons/fa";

export default function DossierTab({ data, theme }: { data: any, theme: any }) {
  const personalInfo = data.personalInfo || {};
  const physicalStats = data.physicalStats || data.appearance || null;
  const voiceProfile = data.voiceProfile || null;
  const onScreenPersona = data.onScreenPersona || null;

  return (
    <>
      {/* Personal Traits */}
      {personalInfo.personalTraits && (
        <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4">Character Profile</h3>
          {personalInfo.personalTraits.personalityType && <p className="text-neutral-300 text-sm leading-relaxed mb-4">{personalInfo.personalTraits.personalityType}</p>}
          {personalInfo.personalTraits.knownForPersonality && <p className="text-neutral-500 text-xs leading-relaxed">{personalInfo.personalTraits.knownForPersonality}</p>}
          <div className="flex gap-3 mt-4 flex-wrap">
            {personalInfo.personalTraits.zodiacSign && (
              <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-neutral-300 font-bold">☉ {personalInfo.personalTraits.zodiacSign}</span>
            )}
            {personalInfo.personalTraits.bloodGroup && (
              <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-neutral-300 font-bold">🩸 {personalInfo.personalTraits.bloodGroup}</span>
            )}
          </div>
        </div>
      )}

      {/* Physical Stats Bento */}
      {physicalStats && (
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 flex items-center gap-3">
            <FaDumbbell /> Physical Architecture
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Height</span>
              <span className={`text-2xl font-black ${theme.accent}`}>{physicalStats.body?.height || (physicalStats.height?.feet ? `${physicalStats.height.feet} (${physicalStats.height.cm}cm)` : "N/A")}</span>
            </div>
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Weight</span>
              <span className={`text-2xl font-black ${theme.accent}`}>{physicalStats.body?.weight?.current || (physicalStats.weight?.kg ? `${physicalStats.weight.kg}kg` : "N/A")}</span>
            </div>
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center col-span-2">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-2">Body Type</span>
              <span className="text-sm font-bold text-neutral-300">{physicalStats.body?.bodyType || physicalStats.build || "N/A"}</span>
            </div>
          </div>

          {/* Measurements */}
          {physicalStats.measurements && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Object.entries(physicalStats.measurements).map(([key, val]: [string, any]) => (
                <div key={key} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 text-center">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">{key}</span>
                  <span className="text-xs font-bold text-neutral-300">{val}</span>
                </div>
              ))}
            </div>
          )}

          {/* Appearance */}
          {(physicalStats.appearance || physicalStats.hairColor || physicalStats.eyeColor) && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {(physicalStats.appearance?.hairColor || physicalStats.hairColor) && (
                <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Hair</span>
                  <span className="text-xs font-bold text-neutral-300">{physicalStats.appearance?.hairColor || physicalStats.hairColor}</span>
                </div>
              )}
              {(physicalStats.appearance?.eyeColor || physicalStats.eyeColor) && (
                <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Eyes</span>
                  <span className="text-xs font-bold text-neutral-300">{physicalStats.appearance?.eyeColor || physicalStats.eyeColor}</span>
                </div>
              )}
              {physicalStats.appearance?.skinTone && (
                <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Skin Tone</span>
                  <span className="text-xs font-bold text-neutral-300">{physicalStats.appearance.skinTone}</span>
                </div>
              )}
            </div>
          )}

          {/* Distinctive Features */}
          {(physicalStats.appearance?.distinctiveFeatures || physicalStats.distinctiveFeatures) && (
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 mb-6">
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Distinctive Features</h4>
              <ul className="space-y-2">
                {(Array.isArray(physicalStats.appearance?.distinctiveFeatures || physicalStats.distinctiveFeatures) ? (physicalStats.appearance?.distinctiveFeatures || physicalStats.distinctiveFeatures) : []).map((feat: string, i: number) => (
                  <li key={i} className="text-neutral-400 text-xs leading-relaxed flex gap-2"><span className="text-neutral-600 shrink-0">—</span>{feat}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Personal Style */}
          {physicalStats.personalStyle && (
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 mb-6">
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Personal Style</h4>
              <p className="text-neutral-400 text-sm leading-relaxed">{physicalStats.personalStyle}</p>
            </div>
          )}

          {/* Health History (Legend) */}
          {physicalStats.healthHistory && (
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 mb-6">
              <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Health History</h4>
              <p className="text-neutral-400 text-sm leading-relaxed">{physicalStats.healthHistory}</p>
            </div>
          )}

          {/* Footwear */}
          {physicalStats.footwear && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {Object.entries(physicalStats.footwear).map(([key, val]: [string, any]) => (
                <div key={key} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 text-center">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Shoe {key}</span>
                  <span className="text-xs font-bold text-neutral-300">{val}</span>
                </div>
              ))}
            </div>
          )}



          {/* Fitness & Nutrition Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {physicalStats.fitnessProfile && (
              <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5">
                <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Fitness Regimen</h4>
                <p className="text-neutral-400 text-sm mb-3">{physicalStats.fitnessProfile.fitnessLevel}</p>
                {physicalStats.fitnessProfile.mainTrainer && (
                  <div className="bg-black/50 p-3 rounded-lg border border-white/5 mb-3">
                    <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Trainer</span>
                    <span className="text-xs text-neutral-300">{physicalStats.fitnessProfile.mainTrainer}</span>
                  </div>
                )}
                {physicalStats.fitnessProfile.dailyTrainingHours && (
                  <span className="text-[10px] text-neutral-500 block mb-1">Training: {physicalStats.fitnessProfile.dailyTrainingHours}</span>
                )}
                {physicalStats.fitnessProfile.trainingFocus && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {physicalStats.fitnessProfile.trainingFocus.map((focus: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-neutral-300">{focus}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {physicalStats.nutritionProfile && (
              <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5">
                <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme.accent}`}>Nutrition Protocol</h4>
                <p className="text-neutral-400 text-sm mb-3">{physicalStats.nutritionProfile.dietaryApproach}</p>
                <div className="space-y-2">
                  {physicalStats.nutritionProfile.calorieManagement && (
                    <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Caloric Intake</span>
                      <span className="text-xs text-neutral-200">{physicalStats.nutritionProfile.calorieManagement}</span>
                    </div>
                  )}
                  {physicalStats.nutritionProfile.macroFocus && (
                    <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Macros</span>
                      <span className="text-xs text-neutral-200">{physicalStats.nutritionProfile.macroFocus}</span>
                    </div>
                  )}
                  {physicalStats.nutritionProfile.supplementationApproach && (
                    <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">Supplements</span>
                      <span className="text-xs text-neutral-200">{physicalStats.nutritionProfile.supplementationApproach}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Health Metrics */}
          {physicalStats.healthMetrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {Object.entries(physicalStats.healthMetrics).map(([key, val]: [string, any]) => (
                <div key={key} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 text-center">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-xs font-bold text-neutral-300">{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Voice Profile */}
      {voiceProfile && (
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">Vocal Dynamics</h3>
          <div className="p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-full h-1 ${theme.accentBg} opacity-20`} />
            <p className="text-lg text-neutral-300 leading-relaxed mb-8 italic">
              "{voiceProfile.signatureVoiceElements || voiceProfile.voiceCharacteristics?.voiceType}"
            </p>

            {voiceProfile.notableCharacteristics && voiceProfile.notableCharacteristics.length > 0 && (
              <div className="mb-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500">Notable Characteristics</h4>
                <ul className="space-y-2">
                  {voiceProfile.notableCharacteristics.map((char: string, i: number) => (
                    <li key={i} className="text-neutral-400 text-xs leading-relaxed flex gap-2"><span className={`${theme.accent} shrink-0`}>•</span>{char}</li>
                  ))}
                </ul>
              </div>
            )}

            {voiceProfile.languagesFluent && (
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-neutral-500">Linguistic Arsenal</h4>
                <div className="flex flex-wrap gap-3">
                  {voiceProfile.languagesFluent.map((lang: any, i: number) => (
                    <div key={i} className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1">
                      <span className="text-sm font-bold text-white">{lang.language}</span>
                      <span className={`text-[9px] uppercase tracking-widest ${theme.accent}`}>{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* On-Screen Persona (Legend) */}
      {onScreenPersona && (
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 px-2 mt-8">The Persona</h3>
          <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden">
            {onScreenPersona.actingStyle && (
              <div className="mb-6">
                <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${theme.accent}`}>Acting Style</h4>
                <p className="text-neutral-300 text-sm leading-relaxed">{onScreenPersona.actingStyle}</p>
              </div>
            )}
            {onScreenPersona.typecastedAs && (
              <div className="mb-6">
                <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${theme.accent}`}>Archetypes</h4>
                <p className="text-neutral-400 text-xs leading-relaxed">{onScreenPersona.typecastedAs}</p>
              </div>
            )}
            {onScreenPersona.strengthAreas && (
              <div className="mb-6">
                <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${theme.accent}`}>Strength Areas</h4>
                <ul className="space-y-2">
                  {onScreenPersona.strengthAreas.map((area: string, i: number) => (
                    <li key={i} className="text-neutral-400 text-xs leading-relaxed flex gap-2"><span className="text-neutral-600 shrink-0">—</span>{area}</li>
                  ))}
                </ul>
              </div>
            )}
            {onScreenPersona.styleEvolution && (
              <div className="mb-6">
                <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${theme.accent}`}>Style Evolution</h4>
                <p className="text-neutral-400 text-xs leading-relaxed">{onScreenPersona.styleEvolution}</p>
              </div>
            )}
            {onScreenPersona.actingPhilosophy && (
              <div>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${theme.accent}`}>Acting Philosophy</h4>
                <p className="text-neutral-400 text-xs leading-relaxed italic">"{onScreenPersona.actingPhilosophy}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
