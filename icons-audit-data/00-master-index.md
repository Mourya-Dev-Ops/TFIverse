# 🎬 TFIverse Icons — Master Data Audit Index

> **Last Updated:** 2026-05-07
> **Total Categories:** 19
> **Total Sub-Categories:** 29
> **Total JSON Profiles:** 28
> **Categories Audited:** 13 / 19
> **Rendering Engine:** `src/app/(main)/icons/[category]/[subcategory]/[slug]/icon-profile-client.tsx` (3042 lines)

---

## 📊 Complete Category Map

| # | Category | Sub-Categories | JSON Profiles | Audit File | Status |
|---|---|---|---|---|---|
| 1 | **Heroes** | legends, superstars, rising-stars | 3 | [01-heroes.md](./01-heroes.md) | ✅ Audited + Fixed |
| 2 | **Heroines** | divas, queens, rising-queens | 3 | [02-heroines.md](./02-heroines.md) | ✅ Audited + Fixed |
| 3 | **Directors** | maestros, hitmakers, emerging | 3 | [03-directors.md](./03-directors.md) | ✅ Audited + Fixed |
| 4 | **Music Directors** | symphony-legends, musical-masters | 2 | [04-music-directors.md](./04-music-directors.md) | ✅ Audited + Fixed |
| 5 | **Villains** | iconic-antagonists, antagonists | 2 | [05-villains.md](./05-villains.md) | ✅ Audited + Fixed |
| 6 | **Comedians** | comedy-kings, comedy-titans | 2 | [06-comedians.md](./06-comedians.md) | ✅ Audited + Fixed |
| 7 | **Character Artists** | _(root)_ | 1 | [07-character-artists.md](./07-character-artists.md) | ✅ Audited + Fixed |
| 8 | **Singers** | _(root)_ | 1 | [08-singers.md](./08-singers.md) | ✅ Audited + Fixed |
| 9 | **Producers** | _(root)_ | 1 | [09-producers.md](./09-producers.md) | ✅ Audited + Fixed |
| 10 | **Cinematographers** | _(root)_ | 1 | [10-cinematographers.md](./10-cinematographers.md) | ✅ Audited + Fixed |
| 11 | **Editors** | _(root)_ | 1 | [11-editors.md](./11-editors.md) | ✅ Audited + Fixed |
| 12 | **Lyricists** | _(root)_ | 1 | [12-lyricists.md](./12-lyricists.md) | ✅ Audited + Fixed |
| 13 | **Choreographers** | _(root)_ | 1 | [13-choreographers.md](./13-choreographers.md) | ✅ Audited + Fixed |
| 14 | **Stunt Directors** | _(root)_ | 1 | [14-stunt-directors.md](./14-stunt-directors.md) | 🔲 Pending |
| 15 | **Art Directors** | _(root)_ | 1 | [15-art-directors.md](./15-art-directors.md) | 🔲 Pending |
| 16 | **Costume Designers** | _(root)_ | 1 | [16-costume-designers.md](./16-costume-designers.md) | 🔲 Pending |
| 17 | **Line Producers** | _(root)_ | 1 | [17-line-producers.md](./17-line-producers.md) | 🔲 Pending |
| 18 | **VFX Supervisors** | _(root)_ | 1 | [18-vfx-supervisors.md](./18-vfx-supervisors.md) | 🔲 Pending |
| 19 | **PROs** | _(root)_ | 1 | [19-pros.md](./19-pros.md) | 🔲 Pending |

---

## 🗂️ Full File Tree

```
public/data/
├── heroes/
│   ├── legends/
│   │   └── n-t-rama-rao.json (63KB, 1514 lines)
│   ├── superstars/
│   │   └── prabhas.json (73KB, 1353 lines)
│   └── rising-stars/
│       └── naveen-polishetty.json
├── heroines/
│   ├── divas/
│   │   └── sridevi-kapoor.json
│   ├── queens/
│   │   └── kajal-aggarwal.json
│   └── rising-queens/
│       └── srinidhi-shetty.json
├── directors/
│   ├── maestros/
│   │   └── k-viswanath.json
│   ├── hitmakers/
│   │   └── ss-rajamouli.json
│   └── emerging/
│       └── sandeep-reddy-vanga.json
├── music-directors/
│   ├── symphony-legends/
│   │   └── ilaiyaraaja.json
│   └── musical-masters/
│       └── devi-sri-prasad.json
├── villains/
│   ├── iconic-antagonists/
│   │   └── prakash-raj.json
│   └── antagonists/
│       └── jagapathi-babu.json
├── comedians/
│   ├── comedy-kings/
│   │   └── ali-comedian.json
│   └── comedy-titans/
│       └── ms-narayana.json
├── character-artists/
│   └── tanikella-bharani.json
├── singers/
│   └── shreya-ghoshal.json
├── producers/
│   └── allu-aravind.json
├── cinematographers/
│   └── kk-senthil-kumar.json
├── editors/
│   └── a-sreekar-prasad.json
├── lyricists/
│   └── sirivennela-seetharama-sastry.json
├── choreographers/
│   └── sekhar-master.json
├── stunt-directors/
│   └── peter-hein.json
├── art-directors/
│   └── thota-tharani.json
├── costume-designers/
│   └── rama-rajamouli.json
├── line-producers/
│   └── vamsi-kaka.json
├── vfx-supervisors/
│   └── v-srinivas-mohan.json
└── pros/
    └── ba-raju.json
```

---

## 🏗️ UI Rendering Styles (6 Archetypes)

Each category is mapped to one of 6 custom UI styles in `category-view.tsx`:

| Archetype | Visual Style | Categories |
|---|---|---|
| **The Gritty Standard** | Sharp rectangles, high contrast B&W | Heroes, Comedians, Character Artists, PROs |
| **The Vogue Arch** | Elegant arch shape, pink glow shadows | Heroines |
| **The Cinematic Letterbox** | Sharp edges, REC viewfinder, blue border | Directors, Producers, Line Producers, Stunt Directors |
| **The Symphony** | Pill-shape, neon purple glow, animated EQ wave | Music Directors, Singers, Lyricists |
| **The Villain** | Jagged red border, scratched overlay | Villains |
| **The Blueprint** | Dashed borders, technical grid overlay | Cinematographers, Editors, Art Directors, Costume Designers, VFX Supervisors, Choreographers |

---

## 🔧 Bugs Found & Fixed During Audits

| Date | Category | Issue | Fix |
|---|---|---|---|
| 2026-05-07 | Heroes (NTR) | `hobbies` key not picked up (used `hobbies` instead of `hobbiesAndInterests`) | Added `data.hobbies` fallback at L82 |
| 2026-05-07 | Heroes (NTR) | `heroAura.legendaryAppeal` not rendered | Added fallback in Aura Grid L381 |
| 2026-05-07 | Heroes (NTR) | `heroAura.cinematicLegacy` not rendered | Added new card in Aura Grid L424 |
