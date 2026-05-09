from dotenv import load_dotenv
import os
import sys
import time
import requests
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

# Load environment variables
load_dotenv()

# Get variables with fallback
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://tfiverse:newpassword123@localhost:5432/tfiverse')
TMDB_API_KEY = os.getenv('TMDB_API_KEY', 'ba5dc12f58f09088d036049c565c2fe9')

# Configuration
TMDB_BASE_URL = 'https://api.themoviedb.org/3'

# Complete India OTT Platform Map
PLATFORM_MAP = {
    # === MAJOR STREAMING ===
    8: 'Netflix',
    119: 'Amazon Prime Video',
    122: 'Disney+ Hotstar',
    283: 'JioCinema',
    531: 'Zee5',
    619: 'Sony Liv',
    105: 'Voot',
    
    # === REGIONAL PLATFORMS ===
    582: 'Aha',
    635: 'Hoichoi',
    559: 'SunNXT',
    1771: 'ManoramaMax',
    1770: 'Eros Now',
    444: 'Shemaroo',
    2182: 'ShemarooMe',
    521: 'Lionsgate Play',
    471: 'ALTBalaji',
    
    # === FREE WITH ADS ===
    212: 'YouTube',
    613: 'MX Player',
    1793: 'Hungama Play',
    
    # === RENTAL/PURCHASE ===
    2: 'Apple TV',
    3: 'Google Play Movies',
    10: 'Amazon Video',
    68: 'Microsoft Store',
    350: 'Apple TV Plus',
    
    # === TELECOM BUNDLES ===
    423: 'Airtel Xstream',
    1890: 'Vi Movies and TV',
    
    # === SPECIALTY ===
    1899: 'EPIC ON',
    257: 'Docubay',
    677: 'CuriosityStream',
    1771: 'FanCode',
    2100: 'Gaana',
    175: 'Kidoodle.TV',
}

# Statistics
stats = {
    'total': 0,
    'success': 0,
    'no_data': 0,
    'errors': 0,
    'links_added': 0
}

def get_platform_name(provider_id):
    """Get platform name from ID with fallback"""
    name = PLATFORM_MAP.get(provider_id)
    if not name:
        print(f"   ⚠️  Unknown platform ID: {provider_id}")
        name = f'Platform_{provider_id}'
    return name

def fetch_ott_from_tmdb(tmdb_id, title):
    """Fetch OTT availability from TMDB Watch Providers API"""
    
    try:
        url = f"{TMDB_BASE_URL}/movie/{tmdb_id}/watch/providers"
        params = {'api_key': TMDB_API_KEY}
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        if 'results' not in data:
            return None
            
        if 'IN' not in data['results']:
            return None
            
        india_data = data['results']['IN']
        ott_links = []
        
        main_link = india_data.get('link', '')
        
        if 'flatrate' in india_data:
            for provider in india_data['flatrate']:
                provider_id = provider.get('provider_id')
                platform_name = get_platform_name(provider_id)
                
                ott_links.append({
                    'platform': platform_name,
                    'url': main_link,
                    'type': 'subscription',
                    'provider_id': provider_id
                })
        
        if 'rent' in india_data:
            for provider in india_data['rent']:
                provider_id = provider.get('provider_id')
                platform_name = get_platform_name(provider_id)
                
                ott_links.append({
                    'platform': platform_name,
                    'url': main_link,
                    'type': 'rent',
                    'provider_id': provider_id
                })
        
        if 'buy' in india_data:
            for provider in india_data['buy']:
                provider_id = provider.get('provider_id')
                platform_name = get_platform_name(provider_id)
                
                ott_links.append({
                    'platform': platform_name,
                    'url': main_link,
                    'type': 'buy',
                    'provider_id': provider_id
                })
        
        return ott_links if ott_links else None
        
    except requests.RequestException as e:
        print(f"   ❌ API Error: {str(e)}")
        return None
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return None

def save_ott_links(cursor, movie_id, ott_links):
    """Save OTT links to database"""
    
    saved_count = 0
    
    for link in ott_links:
        try:
            cursor.execute("""
                INSERT INTO movie_ott_links (
                    movie_id, platform, url, type, region, 
                    is_available, created_at, updated_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (movie_id, platform, type) 
                DO UPDATE SET
                    url = EXCLUDED.url,
                    is_available = true,
                    updated_at = EXCLUDED.updated_at
            """, (
                movie_id,
                link['platform'],
                link['url'],
                link['type'],
                'IN',
                True,
                datetime.now(),
                datetime.now()
            ))
            saved_count += 1
            
        except Exception as e:
            print(f"   ⚠️  DB Error for {link['platform']}: {str(e)}")
            continue
    
    return saved_count

def process_movie(cursor, movie):
    """Process a single movie"""
    
    movie_id = movie['id']
    tmdb_id = movie['tmdb_id']
    title = movie['title']
    year = movie.get('year', 'N/A')
    
    print(f"\n🎬 Processing: {title} ({year})")
    print(f"   TMDB ID: {tmdb_id}, DB ID: {movie_id}")
    
    ott_links = fetch_ott_from_tmdb(tmdb_id, title)
    
    if not ott_links:
        print(f"   ⚠️  No OTT data available")
        stats['no_data'] += 1
        return False
    
    saved_count = save_ott_links(cursor, movie_id, ott_links)
    
    if saved_count > 0:
        print(f"   ✅ Added {saved_count} OTT link(s)")
        for link in ott_links:
            print(f"      • {link['platform']} ({link['type']})")
        
        stats['success'] += 1
        stats['links_added'] += saved_count
        return True
    else:
        print(f"   ⚠️  No links saved")
        stats['no_data'] += 1
        return False

def main():
    """Main execution"""
    
    print("="*60)
    print("🎬 TFIVerse OTT Links Fetcher")
    print("="*60)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        cursor = conn.cursor()
        print("✅ Database connected\n")
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        sys.exit(1)
    
    try:
        cursor.execute("""
            SELECT m.id, m.tmdb_id, m.title, m.year
            FROM movies m
            WHERE m.tmdb_id IS NOT NULL
            AND NOT EXISTS (
                SELECT 1 FROM movie_ott_links ott 
                WHERE ott.movie_id = m.id
            )
            ORDER BY m.release_date DESC NULLS LAST
            LIMIT 100
        """)
        
        movies = cursor.fetchall()
        stats['total'] = len(movies)
        
        print(f"📊 Found {stats['total']} movies to process\n")
        
        if stats['total'] == 0:
            print("✨ All movies already have OTT data!")
            cursor.close()
            conn.close()
            return
        
    except Exception as e:
        print(f"❌ Query error: {str(e)}")
        cursor.close()
        conn.close()
        sys.exit(1)
    
    for i, movie in enumerate(movies, 1):
        print(f"\n[{i}/{stats['total']}]", end=" ")
        
        try:
            process_movie(cursor, movie)
            conn.commit()
            
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
            stats['errors'] += 1
            conn.rollback()
            continue
        
        time.sleep(0.3)
    
    print("\n" + "="*60)
    print("📊 SUMMARY")
    print("="*60)
    print(f"Total movies processed: {stats['total']}")
    print(f"✅ Success: {stats['success']}")
    print(f"⚠️  No data: {stats['no_data']}")
    print(f"❌ Errors: {stats['errors']}")
    print(f"📺 Total OTT links added: {stats['links_added']}")
    print("="*60)
    print(f"Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60)
    
    cursor.close()
    conn.close()
    print("\n✨ Done!")

# ============================================================================
# EXECUTION BLOCK - THIS WAS MISSING!
# ============================================================================

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n\n💥 Fatal error: {str(e)}")
        sys.exit(1)
