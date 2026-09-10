import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { db } from '../src/lib/db';
import { movies } from '../src/lib/schema/content';
import { realtimeSessions, hourlyTrendingLogs, cityBookingSnapshots } from '../src/lib/schema/tracking';
import { mapCityToTerritory } from '../src/lib/api/box-office/utils';
import { eq, or, sql } from 'drizzle-orm';

const B2_PUBLIC_URL = 'https://f004.backblazeb2.com/file/tfiverse-backups';
const MOVIES_DATA_URL = 'https://raw.githubusercontent.com/tfiverse/tfiverse-data-engine/main/data/movies.json'; // Keep movies static for now
const BMS_DATA_URL = `${B2_PUBLIC_URL}/LATEST_bms_live.json`;
const PAYTM_DATA_URL = `${B2_PUBLIC_URL}/LATEST_paytm_live.json`;
const BMS_ADVANCE_URL = `${B2_PUBLIC_URL}/LATEST_bms_advance.json`;
const PAYTM_ADVANCE_URL = `${B2_PUBLIC_URL}/LATEST_paytm_advance.json`;
const BMS_DEEP_ADVANCE_URL = `${B2_PUBLIC_URL}/LATEST_bms_deep_advance.json`;
const PAYTM_DEEP_ADVANCE_URL = `${B2_PUBLIC_URL}/LATEST_paytm_deep_advance.json`;
const SACNILK_DATA_URL = 'https://raw.githubusercontent.com/tfiverse/tfiverse-data-engine/main/data/sacnilk_data.json';
const BMS_VENUES_URL = 'https://raw.githubusercontent.com/tfiverse/tfiverse-data-engine/main/data/bms_venues_master.json';

// City-to-State mapping for Indian cities
const CITY_STATE_MAP: Record<string, string> = {
    // Maharashtra
    'Mumbai': 'Maharashtra', 'Pune': 'Maharashtra', 'Nagpur': 'Maharashtra', 'Nashik': 'Maharashtra', 'Thane': 'Maharashtra',
    'Aurangabad': 'Maharashtra', 'Navi Mumbai': 'Maharashtra', 'Solapur': 'Maharashtra', 'Kolhapur': 'Maharashtra', 'Sangli': 'Maharashtra',
    'Amravati': 'Maharashtra', 'Jalgaon': 'Maharashtra', 'Akola': 'Maharashtra', 'Latur': 'Maharashtra', 'Kalyan': 'Maharashtra',
    'Pimpri-Chinchwad': 'Maharashtra', 'Bhiwandi': 'Maharashtra', 'Panvel': 'Maharashtra', 'Ahmednagar': 'Maharashtra', 'Malegaon': 'Maharashtra',
    'Satara': 'Maharashtra', 'Ichalkaranji': 'Maharashtra', 'Nanded': 'Maharashtra', 'Parbhani': 'Maharashtra', 'Chandrapur': 'Maharashtra',
    'Dhule': 'Maharashtra', 'Jalna': 'Maharashtra', 'Wardha': 'Maharashtra', 'Yavatmal': 'Maharashtra', 'Beed': 'Maharashtra', 'Washim': 'Maharashtra',
    'Ratnagiri': 'Maharashtra', 'Osmanabad': 'Maharashtra', 'Hingoli': 'Maharashtra', 'Gondia': 'Maharashtra', 'Buldhana': 'Maharashtra',
    // Delhi/NCR  
    'Delhi': 'NCR', 'New Delhi': 'NCR', 'Noida': 'NCR', 'Gurgaon': 'NCR', 'Gurugram': 'NCR', 'Faridabad': 'NCR', 'Ghaziabad': 'NCR',
    'Greater Noida': 'NCR',
    // UP
    'Lucknow': 'Uttar Pradesh', 'Kanpur': 'Uttar Pradesh', 'Agra': 'Uttar Pradesh', 'Varanasi': 'Uttar Pradesh', 'Allahabad': 'Uttar Pradesh',
    'Prayagraj': 'Uttar Pradesh', 'Meerut': 'Uttar Pradesh', 'Bareilly': 'Uttar Pradesh', 'Aligarh': 'Uttar Pradesh', 'Moradabad': 'Uttar Pradesh',
    'Gorakhpur': 'Uttar Pradesh', 'Saharanpur': 'Uttar Pradesh', 'Jhansi': 'Uttar Pradesh', 'Muzaffarnagar': 'Uttar Pradesh',
    'Mathura': 'Uttar Pradesh', 'Firozabad': 'Uttar Pradesh', 'Rampur': 'Uttar Pradesh', 'Shahjahanpur': 'Uttar Pradesh',
    'Ayodhya': 'Uttar Pradesh', 'Sultanpur': 'Uttar Pradesh', 'Unnao': 'Uttar Pradesh', 'Hardoi': 'Uttar Pradesh',
    'Rae Bareli': 'Uttar Pradesh', 'Lakhimpur': 'Uttar Pradesh', 'Etawah': 'Uttar Pradesh', 'Mirzapur': 'Uttar Pradesh',
    'Sambhal': 'Uttar Pradesh', 'Amroha': 'Uttar Pradesh', 'Hathras': 'Uttar Pradesh', 'Banda': 'Uttar Pradesh',
    // Karnataka
    'Bangalore': 'Karnataka', 'Bengaluru': 'Karnataka', 'Mysore': 'Karnataka', 'Mysuru': 'Karnataka', 'Hubli': 'Karnataka',
    'Mangalore': 'Karnataka', 'Mangaluru': 'Karnataka', 'Belgaum': 'Karnataka', 'Belagavi': 'Karnataka', 'Davangere': 'Karnataka',
    'Davanagere': 'Karnataka', 'Bellary': 'Karnataka', 'Ballari': 'Karnataka', 'Tumkur': 'Karnataka', 'Shimoga': 'Karnataka',
    'Shivamogga': 'Karnataka', 'Raichur': 'Karnataka', 'Bijapur': 'Karnataka', 'Vijayapura': 'Karnataka', 'Gulbarga': 'Karnataka',
    'Kalaburagi': 'Karnataka', 'Udupi': 'Karnataka', 'Hassan': 'Karnataka', 'Chitradurga': 'Karnataka', 'Mandya': 'Karnataka',
    // Tamil Nadu
    'Chennai': 'Tamil Nadu', 'Coimbatore': 'Tamil Nadu', 'Madurai': 'Tamil Nadu', 'Tiruchirappalli': 'Tamil Nadu', 'Salem': 'Tamil Nadu',
    'Trichy': 'Tamil Nadu', 'Tirunelveli': 'Tamil Nadu', 'Erode': 'Tamil Nadu', 'Vellore': 'Tamil Nadu', 'Thanjavur': 'Tamil Nadu',
    'Tiruppur': 'Tamil Nadu', 'Dindigul': 'Tamil Nadu', 'Hosur': 'Tamil Nadu', 'Nagercoil': 'Tamil Nadu', 'Pondicherry': 'Tamil Nadu',
    'Puducherry': 'Tamil Nadu', 'Cuddalore': 'Tamil Nadu', 'Kumbakonam': 'Tamil Nadu',
    // Telangana
    'Hyderabad': 'Telangana', 'Secunderabad': 'Telangana', 'Warangal': 'Telangana', 'Karimnagar': 'Telangana', 'Nizamabad': 'Telangana',
    'Khammam': 'Telangana', 'Mahbubnagar': 'Telangana', 'Nalgonda': 'Telangana', 'Adilabad': 'Telangana', 'Suryapet': 'Telangana',
    'Siddipet': 'Telangana', 'Miryalaguda': 'Telangana', 'Mancherial': 'Telangana',
    // Andhra Pradesh
    'Visakhapatnam': 'Andhra Pradesh', 'Vijayawada': 'Andhra Pradesh', 'Guntur': 'Andhra Pradesh', 'Nellore': 'Andhra Pradesh',
    'Kurnool': 'Andhra Pradesh', 'Rajahmundry': 'Andhra Pradesh', 'Tirupati': 'Andhra Pradesh', 'Kakinada': 'Andhra Pradesh',
    'Kadapa': 'Andhra Pradesh', 'Anantapur': 'Andhra Pradesh', 'Vizag': 'Andhra Pradesh', 'Eluru': 'Andhra Pradesh',
    'Ongole': 'Andhra Pradesh', 'Nandyal': 'Andhra Pradesh', 'Machilipatnam': 'Andhra Pradesh', 'Adoni': 'Andhra Pradesh',
    'Tenali': 'Andhra Pradesh', 'Proddatur': 'Andhra Pradesh', 'Chittoor': 'Andhra Pradesh', 'Hindupur': 'Andhra Pradesh',
    'Bhimavaram': 'Andhra Pradesh', 'Madanapalle': 'Andhra Pradesh', 'Srikakulam': 'Andhra Pradesh', 'Chirala': 'Andhra Pradesh',
    // Gujarat
    'Ahmedabad': 'Gujarat', 'Surat': 'Gujarat', 'Vadodara': 'Gujarat', 'Rajkot': 'Gujarat', 'Bhavnagar': 'Gujarat',
    'Jamnagar': 'Gujarat', 'Junagadh': 'Gujarat', 'Gandhinagar': 'Gujarat', 'Gandhidham': 'Gujarat', 'Anand': 'Gujarat',
    'Navsari': 'Gujarat', 'Morbi': 'Gujarat', 'Nadiad': 'Gujarat', 'Bharuch': 'Gujarat', 'Mehsana': 'Gujarat',
    'Bhuj': 'Gujarat', 'Porbandar': 'Gujarat', 'Palanpur': 'Gujarat', 'Vapi': 'Gujarat', 'Valsad': 'Gujarat',
    // Rajasthan
    'Jaipur': 'Rajasthan', 'Jodhpur': 'Rajasthan', 'Udaipur': 'Rajasthan', 'Kota': 'Rajasthan', 'Ajmer': 'Rajasthan',
    'Bikaner': 'Rajasthan', 'Bhilwara': 'Rajasthan', 'Alwar': 'Rajasthan', 'Sikar': 'Rajasthan', 'Pali': 'Rajasthan',
    'Sri Ganganagar': 'Rajasthan', 'Tonk': 'Rajasthan', 'Kishangarh': 'Rajasthan', 'Beawar': 'Rajasthan', 'Bharatpur': 'Rajasthan',
    'Hanumangarh': 'Rajasthan', 'Chittorgarh': 'Rajasthan', 'Jhunjhunu': 'Rajasthan', 'Churu': 'Rajasthan', 'Banswara': 'Rajasthan',
    // MP
    'Bhopal': 'Madhya Pradesh', 'Indore': 'Madhya Pradesh', 'Jabalpur': 'Madhya Pradesh', 'Gwalior': 'Madhya Pradesh',
    'Ujjain': 'Madhya Pradesh', 'Sagar': 'Madhya Pradesh', 'Dewas': 'Madhya Pradesh', 'Satna': 'Madhya Pradesh',
    'Ratlam': 'Madhya Pradesh', 'Rewa': 'Madhya Pradesh', 'Murwara': 'Madhya Pradesh', 'Singrauli': 'Madhya Pradesh',
    'Burhanpur': 'Madhya Pradesh', 'Khandwa': 'Madhya Pradesh', 'Bhind': 'Madhya Pradesh', 'Chhindwara': 'Madhya Pradesh',
    'Morena': 'Madhya Pradesh', 'Katni': 'Madhya Pradesh', 'Vidisha': 'Madhya Pradesh', 'Mandsaur': 'Madhya Pradesh',
    // West Bengal
    'Kolkata': 'West Bengal', 'Howrah': 'West Bengal', 'Durgapur': 'West Bengal', 'Asansol': 'West Bengal', 'Siliguri': 'West Bengal',
    'Bardhaman': 'West Bengal', 'Burdwan': 'West Bengal', 'Kharagpur': 'West Bengal', 'Haldia': 'West Bengal',
    'Baharampur': 'West Bengal', 'Habra': 'West Bengal',
    // Bihar
    'Patna': 'Bihar', 'Gaya': 'Bihar', 'Muzaffarpur': 'Bihar', 'Bhagalpur': 'Bihar', 'Darbhanga': 'Bihar',
    'Purnia': 'Bihar', 'Begusarai': 'Bihar', 'Arrah': 'Bihar', 'Katihar': 'Bihar', 'Chapra': 'Bihar',
    'Munger': 'Bihar', 'Sasaram': 'Bihar', 'Jehanabad': 'Bihar', 'Buxar': 'Bihar',
    // Punjab
    'Ludhiana': 'Punjab', 'Amritsar': 'Punjab', 'Jalandhar': 'Punjab', 'Patiala': 'Punjab', 'Bathinda': 'Punjab',
    'Mohali': 'Punjab', 'Pathankot': 'Punjab', 'Moga': 'Punjab', 'Hoshiarpur': 'Punjab', 'Batala': 'Punjab',
    'Phagwara': 'Punjab', 'Khanna': 'Punjab', 'Muktsar': 'Punjab', 'Rajpura': 'Punjab', 'Barnala': 'Punjab',
    // Haryana
    'Chandigarh': 'Chandigarh', 'Ambala': 'Haryana', 'Panipat': 'Haryana', 'Karnal': 'Haryana', 'Sonipat': 'Haryana',
    'Hisar': 'Haryana', 'Rohtak': 'Haryana', 'Yamunanagar': 'Haryana', 'Sirsa': 'Haryana', 'Bhiwani': 'Haryana',
    'Kurukshetra': 'Haryana', 'Rewari': 'Haryana', 'Jind': 'Haryana', 'Bahadurgarh': 'Haryana', 'Panchkula': 'Haryana',
    // Jharkhand
    'Ranchi': 'Jharkhand', 'Jamshedpur': 'Jharkhand', 'Dhanbad': 'Jharkhand', 'Bokaro': 'Jharkhand', 'Hazaribag': 'Jharkhand',
    'Deoghar': 'Jharkhand', 'Giridih': 'Jharkhand', 'Ramgarh': 'Jharkhand',
    // Odisha
    'Bhubaneswar': 'Odisha', 'Cuttack': 'Odisha', 'Rourkela': 'Odisha', 'Berhampur': 'Odisha', 'Sambalpur': 'Odisha',
    'Brahmapur': 'Odisha', 'Balasore': 'Odisha', 'Puri': 'Odisha', 'Bhadrak': 'Odisha', 'Jeypore': 'Odisha',
    // Assam
    'Guwahati': 'Assam', 'Silchar': 'Assam', 'Dibrugarh': 'Assam', 'Jorhat': 'Assam', 'Nagaon': 'Assam', 'Tezpur': 'Assam',
    'Tinsukia': 'Assam',
    // Uttarakhand
    'Dehradun': 'Uttarakhand', 'Haridwar': 'Uttarakhand', 'Roorkee': 'Uttarakhand', 'Haldwani': 'Uttarakhand',
    'Rudrapur': 'Uttarakhand', 'Rishikesh': 'Uttarakhand', 'Kashipur': 'Uttarakhand',
    // Chhattisgarh
    'Raipur': 'Chhattisgarh', 'Bhilai': 'Chhattisgarh', 'Bilaspur': 'Chhattisgarh', 'Korba': 'Chhattisgarh',
    'Durg': 'Chhattisgarh', 'Rajnandgaon': 'Chhattisgarh', 'Raigarh': 'Chhattisgarh', 'Jagdalpur': 'Chhattisgarh',
    // Kerala
    'Kochi': 'Kerala', 'Thiruvananthapuram': 'Kerala', 'Kozhikode': 'Kerala', 'Thrissur': 'Kerala', 'Kannur': 'Kerala',
    'Kollam': 'Kerala', 'Palakkad': 'Kerala', 'Alappuzha': 'Kerala', 'Malappuram': 'Kerala', 'Kottayam': 'Kerala',
    'Trivandrum': 'Kerala', 'Calicut': 'Kerala', 'Cochin': 'Kerala', 'Ernakulam': 'Kerala',
    // Goa
    'Panaji': 'Goa', 'Margao': 'Goa', 'Vasco da Gama': 'Goa', 'Ponda': 'Goa', 'Mapusa': 'Goa', 'Goa': 'Goa',
    // HP
    'Shimla': 'Himachal Pradesh', 'Dharamshala': 'Himachal Pradesh', 'Solan': 'Himachal Pradesh', 'Mandi': 'Himachal Pradesh',
    'Kullu': 'Himachal Pradesh', 'Hamirpur': 'Himachal Pradesh', 'Una': 'Himachal Pradesh', 'Bilaspur': 'Himachal Pradesh',
    // J&K
    'Jammu': 'Jammu and Kashmir', 'Srinagar': 'Jammu and Kashmir', 'Udhampur': 'Jammu and Kashmir', 'Kathua': 'Jammu and Kashmir',
    // NE
    'Shillong': 'Meghalaya', 'Imphal': 'Manipur', 'Aizawl': 'Mizoram', 'Agartala': 'Tripura',
    'Itanagar': 'Arunachal Pradesh', 'Kohima': 'Nagaland', 'Dimapur': 'Nagaland', 'Gangtok': 'Sikkim',
    // Others
    'Port Blair': 'Andaman And Nicobar Islands',
};

function cleanMovieTitle(title: string): string {
    return title.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim();
}

import * as fs from 'fs';

async function fetchJSON(url: string) {
    try {
        if (url.startsWith('file://')) {
            const filePath = url.replace('file://', '');
            if (fs.existsSync(filePath)) {
                return JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }
        } else {
            const res = await fetch(url);
            if (res.ok) return await res.json();
        }
    } catch (e) {
        console.error(`Failed to fetch ${url}`, e);
    }
    return [];
}

async function syncBoxOfficeData() {
    console.log("🔄 Starting Box Office Sync Engine...");

    // 1. Sync Movies First (Discovery Engine)
    console.log("📥 Pulling Dynamic Movies List...");
    const moviesData = await fetchJSON(MOVIES_DATA_URL);
    let moviesAdded = 0;
    
    if (moviesData.length > 0) {
        for (const m of moviesData) {
            try {
                await db.insert(movies).values({
                    tmdbId: m.tmdbId,
                    title: m.title,
                    slug: m.slug,
                    overview: m.overview,
                    releaseDate: new Date(m.releaseDate),
                    year: m.year,
                    posterUrl: m.posterUrl,
                    backdropUrl: m.backdropUrl,
                    metadata: m.metadata
                }).onConflictDoNothing({ target: movies.slug });
                moviesAdded++;
            } catch(e) {}
        }
        console.log(`✅ Synced ${moviesData.length} movies to local Database.`);
    }

    // ══════════════════════════════════════════════════════════
    // 1.5. SMART CATCH-UP: Check for missed days since last sync
    // ══════════════════════════════════════════════════════════
    console.log("🔍 Checking last sync timestamp...");
    const lastSyncResult = await db
        .select({ lastUpdate: sql`MAX(${realtimeSessions.lastUpdated})` })
        .from(realtimeSessions);
    
    const lastSyncDate = lastSyncResult[0]?.lastUpdate 
        ? new Date(lastSyncResult[0].lastUpdate as string)
        : null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (lastSyncDate) {
        const lastDate = new Date(lastSyncDate);
        lastDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > 1) {
            console.log(`⚠️ Last sync was ${daysDiff} days ago (${lastDate.toISOString().split('T')[0]}). Catching up...`);
            
            // For each missed COMPLETE day, try to fetch the archive from B2
            const ARCHIVE_TYPES = [
                'bms_live', 'bms_advance', 'bms_deep_advance',
                'paytm_live', 'paytm_advance', 'paytm_deep_advance'
            ];
            
            let catchupSessions: any[] = [];
            
            for (let d = 1; d < daysDiff; d++) {
                const missedDate = new Date(lastDate);
                missedDate.setDate(missedDate.getDate() + d);
                const dateStr = missedDate.toISOString().split('T')[0];
                
                console.log(`📂 Fetching archives for ${dateStr}...`);
                
                for (const type of ARCHIVE_TYPES) {
                    const archiveUrl = `${B2_PUBLIC_URL}/archives/${dateStr}/FULL_DAY_${type}.json`;
                    const archiveData = await fetchJSON(archiveUrl);
                    
                    if (archiveData.length > 0) {
                        catchupSessions.push(...archiveData);
                        console.log(`   ✅ ${type}: ${archiveData.length} sessions`);
                    } else {
                        // Fallback: try to get the last chunk of that day
                        // The chunk naming pattern is: chunks/YYYY-MM-DD/{type}_YYYY-MM-DD_HHMM.json
                        // We try the 23:00 chunk as the closest to final state
                        const chunkUrl = `${B2_PUBLIC_URL}/chunks/${dateStr}/${type}_${dateStr}_2300.json`;
                        const chunkData = await fetchJSON(chunkUrl);
                        if (chunkData.length > 0) {
                            catchupSessions.push(...chunkData);
                            console.log(`   ✅ ${type}: ${chunkData.length} sessions (from last chunk)`);
                        } else {
                            console.log(`   ⚠️ ${type}: no archive or chunk found for ${dateStr}`);
                        }
                    }
                }
            }
            
            if (catchupSessions.length > 0) {
                console.log(`📦 Total catch-up sessions: ${catchupSessions.length}. Processing...`);
                // These will be processed alongside today's sessions below
                // We'll add them to the main arrays after fetching today's data
            }
        } else {
            console.log(`✅ Last sync was today or yesterday. No catch-up needed.`);
        }
    } else {
        console.log(`🆕 First sync ever. Starting fresh with today's LATEST data.`);
    }

    // 2. Fetch Today's LATEST Sessions from B2
    console.log("📥 Pulling latest scraping data from B2...");
    const bmsSessions = await fetchJSON(BMS_DATA_URL);
    const paytmSessions = await fetchJSON(PAYTM_DATA_URL);
    const bmsAdvance = await fetchJSON(BMS_ADVANCE_URL);
    const paytmAdvance = await fetchJSON(PAYTM_ADVANCE_URL);
    
    // Fetch deep advance and merge them into the advance arrays
    const bmsDeepAdvance = await fetchJSON(BMS_DEEP_ADVANCE_URL);
    const paytmDeepAdvance = await fetchJSON(PAYTM_DEEP_ADVANCE_URL);
    bmsAdvance.push(...bmsDeepAdvance);
    paytmAdvance.push(...paytmDeepAdvance);
    
    const sacnilkData = await fetchJSON(SACNILK_DATA_URL);

    console.log(`✅ Fetched ${bmsSessions.length} BMS sessions and ${paytmSessions.length} Paytm sessions.`);
    console.log(`✅ Fetched ${bmsAdvance.length} BMS advance and ${paytmAdvance.length} Paytm advance (including Deep Advance).`);
    console.log(`✅ Fetched ${sacnilkData.length} SACNilk industry estimates.`);

    if (bmsSessions.length === 0 && paytmSessions.length === 0 && bmsAdvance.length === 0 && paytmAdvance.length === 0 && sacnilkData.length === 0) {
        console.log("⚠️ No new data to sync. Exiting.");
        process.exit(0);
    }

    // 2.1 Load BMS Venue Master for city enrichment
    console.log("🗺️  Loading BMS Venue Master for city/state enrichment...");
    const bmsVenues = await fetchJSON(BMS_VENUES_URL);
    const venueIdToCityMap = new Map<string, string>();
    for (const v of bmsVenues) {
        if (v.VenueCode && v.RegionCode) {
            venueIdToCityMap.set(v.VenueCode, v.RegionCode);
        }
    }
    console.log(`✅ Loaded ${venueIdToCityMap.size} venue-to-city mappings.`);

    // Load Geo Master for District/Mandal enrichment
    console.log("🗺️  Loading Geo Master for district/mandal enrichment...");
    const geoMasterPath = path.join(__dirname, '../data/geo_master.json');
    let cityToGeoMap = new Map<string, { district: string, mandal: string }>();
    if (fs.existsSync(geoMasterPath)) {
        const geoMaster = JSON.parse(fs.readFileSync(geoMasterPath, 'utf-8'));
        for (const val of Object.values(geoMaster) as any[]) {
            if (val.city && val.district) {
                cityToGeoMap.set(val.city.trim().toLowerCase(), {
                    district: val.district.trim(),
                    mandal: val.mandal ? val.mandal.trim() : 'Unknown'
                });
            }
        }
    }
    console.log(`✅ Loaded ${cityToGeoMap.size} city-to-geo mappings.`);

    // Enrich ALL sessions with city and state
    const enrichSession = (session: any) => {
        if (!session.city || session.city === 'Unknown' || session.city === '') {
            const venueId = session.venueId;
            if (venueId && venueIdToCityMap.has(venueId)) {
                session.city = venueIdToCityMap.get(venueId)!;
            }
        }
        if (!session.state || session.state === '' || session.state === 'null') {
            const city = session.city;
            if (city && CITY_STATE_MAP[city]) {
                session.state = CITY_STATE_MAP[city];
            }
        }
        if (session.city) {
            const geo = cityToGeoMap.get(session.city.trim().toLowerCase());
            if (geo) {
                session.district = geo.district;
                session.mandal = geo.mandal;
            } else {
                session.district = session.city;
                session.mandal = 'Unknown';
            }
        } else {
            session.district = 'Unknown';
            session.mandal = 'Unknown';
        }
    };
    
    let enrichedCount = 0;
    for (const s of [...bmsSessions, ...paytmSessions, ...bmsAdvance, ...paytmAdvance]) {
        const oldCity = s.city;
        enrichSession(s);
        if (s.city !== oldCity) enrichedCount++;
    }
    console.log(`🗺️  Enriched ${enrichedCount} sessions with city data.`);

    // 2.5. Apply Deduplication to Advance Data
    console.log("🧹 Applying deduplication engine to Advance data...");
    const advanceSessions: any[] = [];
    const bmsAdvVenueCache = new Set<string>();

    for (const session of bmsAdvance) {
        const venueKey = `${session.movie?.toLowerCase()}_${session.venue?.toLowerCase()}_${session.city?.toLowerCase()}_${session.time}`;
        bmsAdvVenueCache.add(venueKey);
        advanceSessions.push(session);
    }

    let skippedPaytmAdvCount = 0;
    for (const session of paytmAdvance) {
        const venueKey = `${session.movie?.toLowerCase()}_${session.venue?.toLowerCase()}_${session.city?.toLowerCase()}_${session.time}`;
        if (bmsAdvVenueCache.has(venueKey)) {
            skippedPaytmAdvCount++;
            continue;
        }
        advanceSessions.push(session);
    }
    console.log(`✅ Advance Deduplication complete. Discarded ${skippedPaytmAdvCount} overlapping Paytm sessions.`);

    // 3. Apply Deduplication (Primary Source Hierarchy) to Live Data
    console.log("🧹 Applying deduplication engine...");
    const finalSessions: any[] = [];
    const bmsVenueCache = new Set<string>();

    for (const session of bmsSessions) {
        const venueKey = `${session.movie?.toLowerCase()}_${session.venue?.toLowerCase()}_${session.city?.toLowerCase()}_${session.time}`;
        bmsVenueCache.add(venueKey);
        finalSessions.push(session);
    }

    let skippedPaytmCount = 0;
    for (const session of paytmSessions) {
        const venueKey = `${session.movie?.toLowerCase()}_${session.venue?.toLowerCase()}_${session.city?.toLowerCase()}_${session.time}`;
        if (bmsVenueCache.has(venueKey)) {
            skippedPaytmCount++;
            continue;
        }
        finalSessions.push(session);
    }

    console.log(`✅ Deduplication complete. Discarded ${skippedPaytmCount} overlapping Paytm sessions.`);

    // 4. Upsert into PostgreSQL
    console.log("💾 Upserting sessions into Local PostgreSQL Database...");
    
    // Cache ALL active movies for quick ID lookup
    console.log("🔍 Running Auto-Discovery for missing movies...");
    const dbMovies = await db.select().from(movies);
    const missingMoviesMap = new Map<string, string>();
    
    // Auto-discover movies from BOTH live and advance sessions
    const allSessions = [...finalSessions, ...advanceSessions];
    
    for (const session of allSessions) {
        // Use the language-aware title (e.g. "Peddi | Telugu") for separation
        const sid = session.sessionId || session.showId;
        if (!sid) continue; // Skip if no session ID
        const fullTitle = session.movie;

        const match = dbMovies.find(m => m.title.toLowerCase() === fullTitle.toLowerCase());
        if (!match) {
            const slug = fullTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            if (!missingMoviesMap.has(slug)) {
                missingMoviesMap.set(slug, fullTitle);
            }
        }
    }
    
    if (missingMoviesMap.size > 0) {
        console.log(`🆕 Found ${missingMoviesMap.size} untracked movies! Adding them dynamically...`);
        for (const [slug, title] of missingMoviesMap.entries()) {
            try {
                await db.insert(movies).values({
                    title: title,
                    slug: slug,
                    releaseDate: new Date(),
                    year: new Date().getFullYear(),
                    tmdbId: Math.floor(Math.random() * -1000000) - 1, // Dummy TMDB ID
                    metadata: {}, // Empty metadata JSON
                }).onConflictDoNothing();
            } catch(e) { 
                console.error(`Failed to insert movie ${title}:`, e);
            }
        }
        // Refresh dbMovies with the newly added ones
        const newDbMovies = await db.select().from(movies);
        dbMovies.length = 0;
        dbMovies.push(...newDbMovies);
    }

    // Capture explicit UTC extraction timestamp for Advance History
    // Node.js new Date() is universally UTC.
    const extractionTimestamp = new Date();

    // ══════════════════════════════════════════════════════════
    // 4A. PROCESS ADVANCE SNAPSHOTS BEFORE LIVE OVERWRITE
    // ══════════════════════════════════════════════════════════
    if (advanceSessions.length > 0) {
        console.log("📸 Generating City-Level Advance Booking Snapshots...");
        const snapshotMap = new Map<string, any>();
        
        advanceSessions.forEach(session => {
            const sid = session.sessionId || session.showId;
            if (!sid) return; // Skip row
            const fullTitle = session.movie;

            const dbMovie = dbMovies.find(m => m.title.toLowerCase() === fullTitle.toLowerCase());
            if (!dbMovie) return;

            const datePart = session.date || (session.time ? session.time.split(' ')[0] : null); // Use `date` field first
            if (!datePart) return;
            const city = session.city || 'Unknown';
            const territory = mapCityToTerritory(city, session.state || 'Unknown');
            
            // Group by City + Movie + Date
            const groupKey = `${dbMovie.id}_${city}_${datePart}`;
            
            if (!snapshotMap.has(groupKey)) {
                snapshotMap.set(groupKey, {
                    movieId: dbMovie.id,
                    city: city,
                    territory: territory,
                    showDate: new Date(datePart),
                    snapshotTimestamp: extractionTimestamp,
                    ticketsSold: 0,
                    grossRevenue: 0,
                    showsCount: 0,
                    capacity: 0,
                });
            }
            
            const group = snapshotMap.get(groupKey);
            group.ticketsSold += (session.soldSeats || 0);
            group.grossRevenue += (session.grossRevenue || 0);
            group.capacity += (session.totalSeats || 0);
            group.showsCount += 1;
        });

        const snapshotRows = Array.from(snapshotMap.values());
        console.log(`💾 Inserting ${snapshotRows.length} aggregated City Booking Snapshots...`);

        if (snapshotRows.length > 0) {
            const chunkSz = 1000;
            for (let i = 0; i < snapshotRows.length; i += chunkSz) {
                const chunk = snapshotRows.slice(i, i + chunkSz);
                try {
                    await db.insert(cityBookingSnapshots).values(chunk).onConflictDoNothing();
                } catch (err) {
                    console.error(`❌ Batch insert for snapshots failed:`, err);
                }
            }
        }
    }

    // ══════════════════════════════════════════════════════════
    // 4B. PROCESS LIVE SESSIONS (Overwrites previous data)
    // ══════════════════════════════════════════════════════════
    let successCount = 0;
    const chunkSize = 1000;
    
    // Prepare rows with real Movie IDs
    const validRowsMap = new Map<string, any>();
    
    finalSessions.forEach(session => {
        const sid = session.sessionId || session.showId;
        if (!sid) return; // Skip row
        if (!session.date && !session.time) return; // Skip if no date info
        const fullTitle = session.movie;

        const dbMovie = dbMovies.find(m => m.title.toLowerCase() === fullTitle.toLowerCase());
        if (!dbMovie) return;
        
        // Use `date` field if available, otherwise parse from `time`
        const datePart = session.date || (session.time ? session.time.split(' ')[0] : null);
        if (!datePart) return;
        
        let fullDate = new Date(datePart);
        if (isNaN(fullDate.getTime())) {
            console.error('Invalid Date for session:', datePart);
            return;
        }

        const uniqueKey = `${dbMovie.id}_${sid}`;
        
        validRowsMap.set(uniqueKey, {
            movieId: dbMovie.id,
            sessionId: String(sid),
            venueName: session.venue,
            chainName: session.chain,
            city: session.city,
            mandal: session.mandal,
            district: session.district,
            state: session.state,
            showDate: fullDate,
            showTime: session.time || datePart,
            audi: session.audi,
            totalSeats: session.totalSeats || 0,
            availableSeats: (session.availableSeats ?? (session.totalSeats - session.soldSeats)) || 0,
            soldSeats: session.soldSeats || 0,
            grossRevenue: session.grossRevenue || 0,
            source: session.source,
            lastUpdated: new Date()
        });
    });
    
    const validRows = Array.from(validRowsMap.values());

    // Drizzle Batch Upsert
    for (let i = 0; i < validRows.length; i += chunkSize) {
        const chunk = validRows.slice(i, i + chunkSize);
        try {
            await db.insert(realtimeSessions).values(chunk).onConflictDoUpdate({
                target: [realtimeSessions.movieId, realtimeSessions.sessionId],
                set: {
                    availableSeats: sql`EXCLUDED.available_seats`,
                    soldSeats: sql`EXCLUDED.sold_seats`,
                    grossRevenue: sql`EXCLUDED.gross_revenue`,
                    lastUpdated: new Date(),
                }
            });
            successCount += chunk.length;
        } catch (err) {
            console.error(`❌ Batch insert failed:`, err);
        }
    }

    console.log(`🎉 Successfully synchronized ${successCount} live sessions across 5 days to the database!`);

    // 5. Hourly Trending Logs Snapshot
    console.log('📊 Generating hourly trending logs...');
    const nowHour = new Date();
    nowHour.setMinutes(0, 0, 0);

    const uniqueMovieIds = Array.from(new Set(validRows.map(s => s?.movieId)));
    
    for (const mId of uniqueMovieIds) {
      if (!mId) continue;
      const aggregated = await db
        .select({
          sold: sql`SUM(${realtimeSessions.soldSeats})`.mapWith(Number),
          gross: sql`SUM(${realtimeSessions.grossRevenue})`.mapWith(Number),
          shows: sql`COUNT(${realtimeSessions.id})`.mapWith(Number),
          totalSeats: sql`SUM(${realtimeSessions.totalSeats})`.mapWith(Number),
        })
        .from(realtimeSessions)
        .where(eq(realtimeSessions.movieId, mId));

      if (aggregated.length > 0 && aggregated[0].shows > 0) {
        const stat = aggregated[0];
        const occupancy = stat.totalSeats > 0 ? (stat.sold / stat.totalSeats) * 100 : 0;
        
        try {
          await db
            .insert(hourlyTrendingLogs)
            .values({
              movieId: mId,
              timestamp: nowHour,
              soldTickets: stat.sold,
              grossRevenue: stat.gross,
              showsCount: stat.shows,
              averageOccupancy: Number(occupancy.toFixed(2)),
            })
            .onConflictDoUpdate({
              target: [hourlyTrendingLogs.movieId, hourlyTrendingLogs.timestamp],
              set: {
                soldTickets: stat.sold,
                grossRevenue: stat.gross,
                showsCount: stat.shows,
                averageOccupancy: Number(occupancy.toFixed(2)),
              }
            });
        } catch (err) {
          console.error(`❌ Failed to write hourly trending log for movie ID ${mId}:`, err);
        }
      }
    }

    // 6. SACNilk Estimates Synchronization
    if (sacnilkData.length > 0) {
        console.log('📊 Synchronizing SACNilk Industry Estimates...');
        const { dailyBoxOffice } = await import('../src/lib/schema/tracking');
        
        for (const estimate of sacnilkData) {
            if (!estimate.estimateCr || estimate.estimateCr === 0) continue;
            
            const dbMovie = dbMovies.find(m => m.title.toLowerCase() === estimate.movie.toLowerCase());
            if (!dbMovie) continue;
            
            // Calculate exact date based on the Day X offset
            const showDate = new Date(dbMovie.releaseDate);
            showDate.setDate(showDate.getDate() + (estimate.day - 1));
            
            try {
                await db.insert(dailyBoxOffice).values({
                    movieId: dbMovie.id,
                    date: showDate,
                    nett: estimate.estimateCr * 10000000, // Convert Cr to raw Number
                    dataState: 'ESTIMATED',
                    dataSource: 'SACNILK',
                }).onConflictDoUpdate({
                    target: [dailyBoxOffice.movieId, dailyBoxOffice.date],
                    set: {
                        nett: estimate.estimateCr * 10000000,
                        dataState: 'ESTIMATED',
                        dataSource: 'SACNILK',
                        updatedAt: new Date()
                    }
                });
            } catch (err) {
                console.error(`❌ Failed to write SACNilk estimate for movie ID ${dbMovie.id}:`, err);
            }
        }
        console.log(`✅ Successfully merged SACNilk estimates into daily_box_office table!`);
    }

    console.log(`✅ Sync Completed!`);
    process.exit(0);
}

syncBoxOfficeData().catch(console.error);
