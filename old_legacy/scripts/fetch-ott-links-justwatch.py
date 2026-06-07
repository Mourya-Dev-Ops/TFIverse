#!/usr/bin/env python3
"""
OTT Links Fetcher using JustWatch API
Gets DIRECT platform URLs (Netflix, Prime, etc.)
"""

import sys
import os

# Fix Windows encoding issue
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from dotenv import load_dotenv
import time
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from simplejustwatchapi.justwatch import search

# Load environment - checking .env.local first
load_dotenv('.env.local')
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://tfiverse:newpassword123@localhost:5432/tfiverse')

# Platform mapping
PLATFORM_MAPPING = {
    'Netflix': 'Netflix',
    'Amazon Prime Video': 'Amazon Prime Video',
    'Prime Video': 'Amazon Prime Video',
    'Disney Plus': 'Disney+ Hotstar',
    'Disney+': 'Disney+ Hotstar',
    'Hotstar': 'Disney+ Hotstar',
    'JioCinema': 'JioCinema',
    'Zee5': 'Zee5',
    'Sony Liv': 'Sony Liv',
    'SonyLIV': 'Sony Liv',
    'Voot': 'Voot',
    'Aha': 'Aha',
    'Sun Nxt': 'Sun NXT',
    'SunNXT': 'Sun NXT',
    'YouTube': 'YouTube',
    'Google Play Movies': 'Google Play Movies',
    'Apple TV': 'Apple TV',
    'MX Player': 'MX Player',
}

# Statistics
stats = {
    'total': 0,
    'success': 0,
    'no_data': 0,
    'errors': 0,
    'links_added': 0
}


def fetch_ott_from_justwatch(title, year=None):
    """Fetch OTT links with DIRECT URLs from JustWatch"""
    
    try:
        print(f"   [SEARCH] Searching JustWatch for: {title}")
        
        # Search for the movie in India
        results = search(
            title=title,
            country="IN",
            language="en",
            count=5,
            best_only=True
        )
        
        if not results:
            print(f"   [WARN] No results from JustWatch")
            return None
        
        print(f"   [INFO] Found {len(results)} results")
        
        # Find best match
        movie = None
        for idx, result in enumerate(results):
            print(f"   -> Result {idx+1}: {result.title} ({getattr(result, 'release_year', 'N/A')})")
            
            # Match by year if available
            if year and hasattr(result, 'release_year') and result.release_year:
                if abs(result.release_year - year) <= 1:
                    movie = result
                    print(f"   [OK] Matched by year!")
                    break
            elif idx == 0:  # First result as fallback
                movie = result
                print(f"   [OK] Using first result")
                break
        
        if not movie:
            print(f"   [WARN] No suitable match found")
            return None
        
        # Get offers
        if not hasattr(movie, 'offers') or not movie.offers:
            print(f"   [WARN] No offers available")
            return None
        
        print(f"   [INFO] Found {len(movie.offers)} offers")
        
        ott_links = []
        
        for idx, offer in enumerate(movie.offers):
            try:
                # Get platform name from package
                if hasattr(offer, 'package') and offer.package:
                    platform_name = offer.package.name
                else:
                    print(f"   [WARN] Offer {idx+1}: No package info")
                    continue
                
                # Get URL
                if hasattr(offer, 'url') and offer.url:
                    direct_url = offer.url
                else:
                    print(f"   [WARN] Offer {idx+1}: No URL")
                    continue
                
                # Normalize platform name
                platform_name = PLATFORM_MAPPING.get(platform_name, platform_name)
                
                # Get monetization type
                monetization = getattr(offer, 'monetization_type', 'FLATRATE')
                
                if monetization == 'FLATRATE':
                    offer_type = 'subscription'
                elif monetization == 'RENT':
                    offer_type = 'rent'
                elif monetization == 'BUY':
                    offer_type = 'buy'
                else:
                    offer_type = 'subscription'
                
                # Get quality
                quality = getattr(offer, 'presentation_type', None)
                
                ott_links.append({
                    'platform': platform_name,
                    'url': direct_url,
                    'type': offer_type,
                    'quality': quality
                })
                
                print(f"   [ADD] {platform_name} ({offer_type})")
                
            except Exception as e:
                print(f"   [ERROR] Processing offer {idx+1}: {str(e)}")
                continue
        
        return ott_links if ott_links else None
        
    except Exception as e:
        print(f"   [ERROR] JustWatch Error: {str(e)}")
        return None


def save_ott_links(cursor, movie_id, ott_links):
    """Save OTT links to database"""
    
    saved_count = 0
    
    for link in ott_links:
        try:
            cursor.execute("""
                INSERT INTO movie_ott_links (
                    movie_id, platform, url, type, region, 
                    is_available, quality, created_at, updated_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (movie_id, platform, type) 
                DO UPDATE SET
                    url = EXCLUDED.url,
                    is_available = true,
                    quality = EXCLUDED.quality,
                    updated_at = EXCLUDED.updated_at
            """, (
                movie_id,
                link['platform'],
                link['url'],
                link['type'],
                'IN',
                True,
                link.get('quality'),
                datetime.now(),
                datetime.now()
            ))
            saved_count += 1
            
        except Exception as e:
            print(f"   [ERROR] DB Error for {link['platform']}: {str(e)}")
            continue
    
    return saved_count


def process_movie(cursor, movie):
    """Process a single movie"""
    
    movie_id = movie['id']
    title = movie['title']
    year = movie.get('year')
    
    print(f"\n[MOVIE] Processing: {title} ({year or 'N/A'})")
    print(f"   DB ID: {movie_id}")
    
    # Fetch OTT data from JustWatch
    ott_links = fetch_ott_from_justwatch(title, year)
    
    if not ott_links:
        print(f"   [SKIP] No OTT data available")
        stats['no_data'] += 1
        return False
    
    # Save to database
    saved_count = save_ott_links(cursor, movie_id, ott_links)
    
    # Mark as fetched regardless of whether links were found
    cursor.execute("UPDATE movies SET ott_fetched = true, last_ott_sync_at = %s WHERE id = %s", (datetime.now(), movie_id))
    
    if saved_count > 0:
        print(f"   [SUCCESS] Added {saved_count} DIRECT OTT link(s)")
        for link in ott_links:
            url_preview = link['url'][:60] + "..." if len(link['url']) > 60 else link['url']
            quality = f" [{link['quality']}]" if link.get('quality') else ""
            print(f"      * {link['platform']} ({link['type']}){quality}")
            print(f"        {url_preview}")
        
        stats['success'] += 1
        stats['links_added'] += saved_count
        return True
    else:
        print(f"   [WARN] No links saved")
        stats['no_data'] += 1
        return False


def main():
    """Main execution"""
    
    print("="*70)
    print("TFIVerse OTT Links Fetcher (JustWatch - DIRECT URLs)")
    print("="*70)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        cursor = conn.cursor()
        print("[OK] Database connected\n")
    except Exception as e:
        print(f"[FAIL] Database connection failed: {str(e)}")
        sys.exit(1)
    
    try:
        # We process movies by popularity to get the big ones first
        cursor.execute("""
            SELECT id, title, year
            FROM movies
            WHERE ott_fetched = false
            ORDER BY popularity DESC NULLS LAST
            LIMIT 100
        """)
        
        movies = cursor.fetchall()
        stats['total'] = len(movies)
        
        print(f"[STATS] Found {stats['total']} movies to process\n")
        
        if stats['total'] == 0:
            print("[DONE] No movies to process!")
            cursor.close()
            conn.close()
            return
        
    except Exception as e:
        print(f"[ERROR] Query error: {str(e)}")
        cursor.close()
        conn.close()
        sys.exit(1)
    
    for i, movie in enumerate(movies, 1):
        print(f"\n{'='*70}")
        print(f"[{i}/{stats['total']}]")
        
        try:
            process_movie(cursor, movie)
            conn.commit()
            
        except Exception as e:
            print(f"   [ERROR] Global error: {str(e)}")
            stats['errors'] += 1
            conn.rollback()
            continue
        
        time.sleep(2)  # Be nice to JustWatch
    
    print("\n" + "="*70)
    print("FINAL SUMMARY")
    print("="*70)
    print(f"Total movies processed: {stats['total']}")
    print(f"Success: {stats['success']}")
    print(f"No data: {stats['no_data']}")
    print(f"Errors: {stats['errors']}")
    print(f"Total DIRECT OTT links added: {stats['links_added']}")
    print("="*70)
    print(f"Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70)
    
    cursor.close()
    conn.close()
    print("\nDone!")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nInterrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n\nFatal error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
