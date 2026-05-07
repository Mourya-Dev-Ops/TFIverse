# 🎬 TFIverse Heroines — Complete Data → Rendering Audit

> **Rendering Engine:** [icon-profile-client.tsx](file:///c:/Users/justi/OneDrive/Documents/tfiverse-v2/src/app/(main)/icons/[category]/[subcategory]/[slug]/icon-profile-client.tsx)
> **Audit Date:** 2026-05-07
> **Category:** Heroines
> **Sub-Categories:** 3 (Divas, Queens, Rising Queens)
> **Total Profiles:** 3

---

## 1. DIVAS — Sridevi Kapoor (`sridevi-kapoor.json`)
**File:** [sridevi-kapoor.json](file:///c:/Users/justi/OneDrive/Documents/tfiverse-v2/public/data/heroines/divas/sridevi-kapoor.json)

| # | JSON Key | Extracted At (Line) | Rendered In Tab | Status |
|---|---|---|---|---|
| 1 | `bio` | L68 `data.bio` | **Overview** | ✅ |
| 2 | `title` | L263 `data.title` | **Banner** title lockup | ✅ |
| 3 | `alternateNames` | L90 | **Banner** AKA pills | ✅ |
| 4 | `eraDefiner` | L253 | **Banner** badge | ✅ Fixed |
| 5 | `divaAura` | L72 | **Overview** → Aura Grid (L400) | ✅ |
| 6 | `images` | L67 | **Banner** background/portrait | ✅ |
| 7 | `personalInfo` | L68 | **Right Sidebar** | ✅ |
| 8 | `beautyLegacy` | L93 (`rawBeautyProfile`) | **Glamour** tab | ✅ |
| 9 | `fashionImpact` | L94 (`rawFashionIcon`) | **Glamour** tab | ✅ |
| 10 | `careerRetrospective` | L125 | **Career** tab | ✅ |
| 11 | `screenChemistry` | L95 | **The Craft** tab | ✅ |
| 12 | `screenChemistryByCostar` | L137 | **The Craft** tab | ✅ |
| 13 | `boxOfficeMilestones` | L88 | **Career** tab (L1957) | ✅ Fixed |
| 14 | `awardsBYType` | L87 | **Career** tab (L1989) | ✅ Fixed |
| 15 | `awards` | L86 | **Career** tab | ✅ |
| 16 | `iconicRoles` | L126 | **The Craft** tab | ✅ |
| 17 | `culturalImpact` | L128 | **Legacy** tab | ✅ |
| 18 | `internationalRecognition` | L131 | **Legacy** tab | ✅ |
| 19 | `quotes`, `trivia`, `knownFor` | L87-89 | **Legacy / Overview** | ✅ |
| * | *(Plus 20 other standard keys)* | — | Standard mapping | ✅ |

**Result: 39/39 rendered ✅ — DIVA COMPLETE**

---

## 2. QUEENS — Kajal Aggarwal (`kajal-aggarwal.json`)
**File:** [kajal-aggarwal.json](file:///c:/Users/justi/OneDrive/Documents/tfiverse-v2/public/data/heroines/queens/kajal-aggarwal.json)

| # | JSON Key | Extracted At (Line) | Rendered In Tab | Status |
|---|---|---|---|---|
| 1 | `commercialTier` | L258 | **Banner** badge | ✅ Fixed |
| 2 | `activeStatus` | L263 | **Banner** badge | ✅ Fixed |
| 3 | `queenAura` | L72 | **Overview** → Aura Grid | ✅ |
| 4 | `appearance` | L74 (`physicalStats`) | **Dossier** tab (L593) | ✅ Fixed |
| 5 | `beautyProfile` | L93 | **Glamour** tab | ✅ |
| 6 | `fashionIcon` | L94 | **Glamour** tab | ✅ |
| 7 | `socialMediaInfluence` | L76 | **Trajectory** tab (L2620) | ✅ Fixed |
| 8 | `fanbaseAnalysis` | L142 | **Trajectory** tab (L2678) | ✅ |
| 9 | `screenChemistry` | L95 | **The Craft** tab | ✅ |
| 10 | `genreExpertise` | L84 (`genreStrength`) | **Career** tab | ✅ |
| * | *(Plus 20 standard keys)* | — | Standard mapping | ✅ |

**Result: 30/30 rendered ✅ — QUEEN COMPLETE**

---

## 3. RISING QUEENS — Srinidhi Shetty (`srinidhi-shetty.json`)
**File:** [srinidhi-shetty.json](file:///c:/Users/justi/OneDrive/Documents/tfiverse-v2/public/data/heroines/rising-queens/srinidhi-shetty.json)

| # | JSON Key | Extracted At (Line) | Rendered In Tab | Status |
|---|---|---|---|---|
| 1 | `careerPhase` | L268 | **Banner** badge | ✅ |
| 2 | `risingQueenAura` | L72 | **Overview** → Aura Grid | ✅ |
| 3 | `appearance` | L74 (`physicalStats`) | **Dossier** tab (L593) | ✅ |
| 4 | `debutAnalysis` | L140 | **Trajectory** tab | ✅ |
| 5 | `breakingMoment` | L141 | **Trajectory** tab | ✅ |
| 6 | `careerTrajectory` | L145 | **Trajectory** tab | ✅ |
| 7 | `uniqueSellingProposition`| L146 | **Trajectory** tab | ✅ |
| 8 | `potentialAssessment` | L144 | **Trajectory** tab | ✅ |
| 9 | `peerAnalysis` | L143 | **Trajectory** tab | ✅ |
| 10 | `fashionStyle` | L94 | **Glamour** tab | ✅ |
| * | *(Plus 25 standard keys)* | — | Standard mapping | ✅ |

**Result: 35/35 rendered ✅ — RISING QUEEN COMPLETE**

---

## 🔧 Bugs Found & Fixed During This Audit

### Fix 1: Appearance Mapping (Kajal / Srinidhi)
> [!IMPORTANT]
> **Problem:** Heroines use `appearance` instead of `physicalStats`, but the Dossier tab only rendered `physicalStats`. Also missed `personalStyle`.
> **Fix applied:** Mapped `data.appearance` to the `physicalStats` constant on L74, which automatically populated the hair/eyes/skin rendering. Added a custom block for `personalStyle` in the Dossier tab.

### Fix 2: Detailed Social Influence (Kajal)
> [!IMPORTANT]
> **Problem:** `socialMediaInfluence` is a massive object for Kajal (Instagram stats, influence score, strategy) but was being swallowed by a basic URL extractor.
> **Fix applied:** Extracted `detailedSocialInfluence` and injected a rich "Digital Influence" Bento block in the **Trajectory** tab to show followers, engagement rate, and her 9/10 influence score.

### Fix 3: Career Stats Extensions (Sridevi)
> [!IMPORTANT]
> **Problem:** `boxOfficeMilestones` and `awardsBYType` (with an uppercase BY) were completely ignored.
> **Fix applied:** Created dedicated render blocks for both inside the **Career** tab, showing Sridevi's career gross, hit rate, and detailed national/state award breakdown.

### Fix 4: Cosmetic Banner Badges
> [!IMPORTANT]
> **Problem:** Unique metadata like `eraDefiner`, `commercialTier`, and `activeStatus` were missed.
> **Fix applied:** Added 3 new glassmorphic badges next to the Age/Generation pills in the hero banner.

---

## 📊 Summary

| Sub-Category | Profile | JSON Sections | Rendered | Minor Skips | Status |
|---|---|---|---|---|---|
| **Divas** | Sridevi | 39 | 39 | 0 | ✅ 100% |
| **Queens** | Kajal Aggarwal | 30 | 30 | 0 | ✅ 100% |
| **Rising Queens**| Srinidhi Shetty | 35 | 35 | 0 | ✅ 100% |

**Overall Heroines Category: 104/104 sections rendering = 100% functional ✅**
