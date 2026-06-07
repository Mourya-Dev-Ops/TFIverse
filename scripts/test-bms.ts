// Simulated Headers to bypass Cloudflare and imitate Mobile App
const HEADERS = {
    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 11; SM-G998B Build/RP1A.200720.012)',
    'Accept': 'application/json',
    'Connection': 'keep-alive',
    'X-Forwarded-For': '', 
};

function getRandomIndianIP() {
    const blocks = [49, 103, 117, 122, 157, 163];
    const block = blocks[Math.floor(Math.random() * blocks.length)];
    return `${block}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

async function scrapeBMS(venueCode: string, dateCode: string) {
    console.log(`[BMS] Fetching data for venue ${venueCode} on ${dateCode}...`);
    
    HEADERS['X-Forwarded-For'] = getRandomIndianIP();
    const url = `https://in.bookmyshow.com/api/v2/mobile/showtimes/byvenue?venueCode=${venueCode}&dateCode=${dateCode}`;
    
    try {
        const response = await fetch(url, { headers: HEADERS });
        if (!response.ok) {
            console.warn(`[BMS] Venue ${venueCode} returned ${response.status}`);
            return [];
        }

        const data = await response.json();
        const out = [];

        const sd = data.ShowDetails || [];
        if (sd.length === 0) {
            console.log("No shows found for this date.");
            return out;
        }

        const venue = sd[0].Venues || {};
        const venueName = venue.VenueName || "";
        const city = venue.VenueCity || "Unknown";
        const chain = venue.VenueCompName || "Unknown";

        for (const ev of (sd[0].Event || [])) {
            const title = ev.EventTitle || "Unknown";

            for (const ch of (ev.ChildEvents || [])) {
                const dim = (ch.EventDimension || "").trim();
                const lang = (ch.EventLanguage || "").trim();
                const suffix = [dim, lang].filter(Boolean).join(" | ");
                const movie = suffix ? `${title} [${suffix}]` : title;

                for (const sh of (ch.ShowTimes || [])) {
                    if (sh.ShowDateCode !== dateCode) continue;

                    let total = 0, avail = 0, sold = 0, gross = 0;
                    
                    for (const cat of (sh.Categories || [])) {
                        const seats = parseInt(cat.MaxSeats || 0);
                        const free = parseInt(cat.SeatsAvail || 0);
                        const price = parseFloat(cat.CurPrice || 0);
                        
                        total += seats;
                        avail += free;
                        sold += (seats - free);
                        gross += (seats - free) * price;
                    }

                    out.push({
                        movie,
                        venue: venueName,
                        chain,
                        city,
                        time: sh.ShowTime || "",
                        audi: sh.Attributes || "",
                        sessionId: String(sh.SessionId || ""),
                        totalSeats: total,
                        availableSeats: avail,
                        soldSeats: sold,
                        grossRevenue: Number(gross.toFixed(2))
                    });
                }
            }
        }
        return out;
    } catch (error) {
        console.error(`[BMS] Error parsing venue ${venueCode}:`, error);
        return [];
    }
}

async function runTest() {
    // Let's test with a major venue: AMBC (AMB Cinemas: Gachibowli, Hyderabad)
    // Or PRAS (Prasads Multiplex: Hyderabad)
    // Date: Today (or tomorrow)
    
    // Get tomorrow's date code since today might be over depending on timezone
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const dateCode = d.toISOString().split('T')[0].replace(/-/g, '');
    
    console.log(`Running test for tomorrow: ${dateCode}`);
    
    const venues = ['AMBC', 'PRAS', 'CPCH', 'SKRN'];
    
    for (const v of venues) {
        const results = await scrapeBMS(v, dateCode);
        if (results.length > 0) {
            console.log(`\n✅ Success for ${v}! Found ${results.length} shows.`);
            console.table(results.slice(0, 3)); // show first 3
        } else {
            console.log(`\n❌ No data for ${v} on this date.`);
        }
    }
}

runTest();
