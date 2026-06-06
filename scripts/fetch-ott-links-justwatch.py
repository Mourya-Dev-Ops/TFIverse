#!/usr/bin/env python3
"""
OTT Links Fetcher using JustWatch API
Gets DIRECT platform URLs (Netflix, Prime, etc.)
"""

from dotenv import load_dotenv
import os
import sys
import time
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from simplejustwatchapi.justwatch import search

# Load environment
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
        print(f"   🔍 Searching JustWatch for: {title}")

        # Search for the movie in India (with retry)
        results = None
        for attempt in range(3):
            try:
                results = search(
                    title=title,
                    country="IN",
                    language="en",
                    count=5,
                    best_only=True
                )
                break
            except Exception as retry_err:
                if attempt < 2:
                    wait_time = (attempt + 1) * 5
                    print(f"   ⏳ Rate limited, retrying in {wait_time}s... (attempt {attempt+2}/3)")
                    time.sleep(wait_time)
                else:
                    raise retry_err

        if not results:
            print(f"   ⚠️  No results from JustWatch")
            return None

        print(f"   📊 Found {len(results)} results")

        # Find best match
        movie = None
        for idx, result in enumerate(results):
            print(f"   → Result {idx+1}: {result.title} ({getattr(result, 'release_year', 'N/A')})")

            # Match by year if available
            if year and hasattr(result, 'release_year') and result.release_year:
                if abs(result.release_year - year) <= 1:
                    movie = result
                    print(f"   ✓ Matched by year!")
                    break
            elif idx == 0:  # First result as fallback
                movie = result
                print(f"   ✓ Using first result")
                break

        if not movie:
            print(f"   ⚠️  No suitable match found")
            return None

        # Get offers
        if not hasattr(movie, 'offers') or not movie.offers:
            print(f"   ⚠️  No offers available")
            return None

        print(f"   📺 Found {len(movie.offers)} offers")

        ott_links = []

        for idx, offer in enumerate(movie.offers):
            try:
                # Get platform name from package
                if hasattr(offer, 'package') and offer.package:
                    platform_name = offer.package.name
                else:
                    print(f"   ⚠️  Offer {idx+1}: No package info")
                    continue

                # Get URL
                if hasattr(offer, 'url') and offer.url:
                    direct_url = offer.url
                else:
                    print(f"   ⚠️  Offer {idx+1}: No URL")
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

                print(f"   ✓ {platform_name} ({offer_type})")

            except Exception as e:
                print(f"   ⚠️  Error processing offer {idx+1}: {str(e)}")
                continue

        return ott_links if ott_links else None

    except Exception as e:
        print(f"   ❌ JustWatch Error: {str(e)}")
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
            print(f"   ⚠️  DB Error for {link['platform']}: {str(e)}")
            continue

    return saved_count

def process_movie(cursor, movie):
    """Process a single movie"""
    movie_id = movie['id']
    title = movie['title']
    year = movie.get('year')

    print(f"\\n🎬 Processing: {title} ({year or 'N/A'})")
    print(f"   DB ID: {movie_id}")

    # Fetch OTT data from JustWatch
    ott_links = fetch_ott_from_justwatch(title, year)

    # Always update last_sync_at so we don't retry this movie immediately
    try:
        cursor.execute("UPDATE movies SET last_ott_sync_at = %s WHERE id = %s", (datetime.now(), movie_id))
    except Exception as e:
        print(f"   ⚠️  Failed to update last_ott_sync_at: {str(e)}")

    if not ott_links:
        print(f"   ⚠️  No OTT data available")
        stats['no_data'] += 1
        return False

    # Save to database
    saved_count = save_ott_links(cursor, movie_id, ott_links)

    if saved_count > 0:
        print(f"   ✅ Added {saved_count} DIRECT OTT link(s)")
        for link in ott_links:
            url_preview = link['url'][:60] + "..." if len(link['url']) > 60 else link['url']
            quality = f" [{link['quality']}]" if link.get('quality') else ""
            print(f"      • {link['platform']} ({link['type']}){quality}")
            print(f"        {url_preview}")

        stats['success'] += 1
        stats['links_added'] += saved_count
        return True
    else:
        print(f"   ⚠️  No links saved")
        stats['no_data'] += 1
        return False

def main():
    """Main execution"""
    print("="*70)
    print("🎬 TFIVerse OTT Links Fetcher (JustWatch - DIRECT URLs)")
    print("="*70)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    import argparse
    parser = argparse.ArgumentParser(description="Fetch OTT links from JustWatch")
    parser.add_argument('--limit', type=int, default=4000, help="Limit the number of movies to process")
    parser.add_argument('--recent', action='store_true', help="Only fetch OTT links for movies added in the last 7 days")
    args = parser.parse_args()

    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        cursor = conn.cursor()
        print("✅ Database connected\n")
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        sys.exit(1)

    try:
        query = """
            SELECT m.id, m.title, m.year
            FROM movies m
            WHERE m.last_ott_sync_at IS NULL
            AND m.year IS NOT NULL
            AND m.year <= EXTRACT(YEAR FROM CURRENT_DATE)
        """
        
        if args.recent:
            query += " AND m.created_at > NOW() - INTERVAL '7 days'"
            
        query += " ORDER BY m.release_date DESC NULLS LAST LIMIT %s"

        cursor.execute(query, (args.limit,))

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
        print(f"\\n{'='*70}")
        print(f"[{i}/{stats['total']}]")

        try:
            process_movie(cursor, movie)
            conn.commit()
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
            stats['errors'] += 1
            conn.rollback()
            continue

        time.sleep(2)  # Be nice to JustWatch

    print("\\n" + "="*70)
    print("📊 SUMMARY")
    print("="*70)
    print(f"Total movies processed: {stats['total']}")
    print(f"✅ Success: {stats['success']}")
    print(f"⚠️  No data: {stats['no_data']}")
    print(f"❌ Errors: {stats['errors']}")
    print(f"📺 Total DIRECT OTT links added: {stats['links_added']}")
    print("="*70)
    print(f"Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70)

    cursor.close()
    conn.close()
    print("\\n✨ Done!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\\n\\n⚠️  Interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\\n\\n💥 Fatal error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
