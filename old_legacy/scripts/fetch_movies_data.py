#!/usr/bin/env python3
"""
🎬 SCRIPT #2: Fetch ALL Movies Combined Data (Full Featured - FIXED)
- Auto-finds filmography.json in correct path
- Supports: heroes, heroines, and other categories
- Shows all movies + TMDB IDs in terminal
- Fetches one-by-one with detailed progress

Usage: python3 fetch_movies_data.py heroes prabhas
       python3 fetch_movies_data.py heroines deepika
"""

import requests
import json
import time
import sys
from pathlib import Path

API_KEY = "ba5dc12f58f09088d036049c565c2fe9"
BASE_URL = "https://api.themoviedb.org/3"

class MovieDataFetcher:
    def __init__(self, category, actor_name):
        self.category = category.lower()
        self.actor_name = actor_name.lower().replace(' ', '_')
        
        # Try multiple path combinations to find filmography.json
        possible_paths = [
            Path(f"tmdb/{self.category}/{self.actor_name}/filmography.json"),
            Path(f"scripts/tmdb/{self.category}/{self.actor_name}/filmography.json"),
            Path(f"./tmdb/{self.category}/{self.actor_name}/filmography.json"),
            Path(f"./{self.actor_name}/filmography.json"),
        ]
        
        self.filmography_file = None
        self.base_dir = None
        
        for path in possible_paths:
            if path.exists():
                self.filmography_file = path
                self.base_dir = path.parent
                break
        
        if not self.base_dir:
            self.base_dir = Path(f"tmdb/{self.category}/{self.actor_name}")
            self.base_dir.mkdir(parents=True, exist_ok=True)
            self.filmography_file = self.base_dir / "filmography.json"
        
    def print_header(self):
        """Print beautiful header"""
        print(f"""
╔{'='*78}╗
║ 🎬 SCRIPT #2: TMDB Movie Details Fetcher (Full Featured) 🎬              ║
║    Category: {self.category.upper():<20} | Actor: {self.actor_name.upper():<35} ║
║    Reads filmography.json -> Fetches full movie data -> Saves combined    ║
╚{'='*78}╝
        """)
    
    def load_filmography(self):
        """Load filmography.json and display all movies"""
        try:
            if not self.filmography_file.exists():
                print(f"❌ ERROR: filmography.json not found!")
                print(f"   Searched in:")
                print(f"   - tmdb/{self.category}/{self.actor_name}/filmography.json")
                print(f"   - scripts/tmdb/{self.category}/{self.actor_name}/filmography.json")
                print(f"\n💡 TIP: Make sure to run Script #1 first to generate filmography.json")
                return None
            
            with open(self.filmography_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            movies = data.get('movies', [])
            
            # Display all movies with their TMDB IDs
            print(f"\n{'='*80}")
            print(f"📽️  FILMOGRAPHY LOADED: {len(movies)} MOVIES FOUND")
            print(f"{'='*80}\n")
            print(f"{'No':<5} {'TMDB ID':<12} {'Movie Title':<55} {'Status':<10}")
            print(f"{'-'*80}")
            
            for i, movie in enumerate(movies, 1):
                movie_id = movie.get('tmdb_id')
                title = movie.get('title', 'Unknown')
                title_display = (title[:52] + '...') if len(title) > 52 else title
                print(f"{i:<5} {movie_id:<12} {title_display:<55} {'Ready':<10}")
            
            print(f"{'-'*80}")
            print(f"✅ Total: {len(movies)} movies ready to fetch\n")
            
            movie_ids = [(m.get('tmdb_id'), m.get('title')) for m in movies]
            return movie_ids
        except FileNotFoundError:
            print(f"❌ ERROR: filmography.json not found at {self.filmography_file}")
            return None
        except json.JSONDecodeError:
            print(f"❌ ERROR: filmography.json is corrupted or not valid JSON")
            return None
        except Exception as e:
            print(f"❌ Error loading filmography: {e}")
            return None
    
    def fetch_movie_details(self, movie_id, movie_name):
        """Fetch complete movie details with cast and crew"""
        try:
            url = f"{BASE_URL}/movie/{movie_id}"
            params = {
                'api_key': API_KEY,
                'append_to_response': 'credits'
            }
            response = requests.get(url, params=params, timeout=5)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.Timeout:
            return None
        except requests.exceptions.ConnectionError:
            return None
        except Exception as e:
            return None
    
    def extract_cast(self, credits):
        """Extract cast members"""
        cast = []
        if not credits or 'cast' not in credits:
            return cast
        
        for member in credits['cast'][:15]:
            cast.append({
                'name': member.get('name'),
                'character': member.get('character'),
                'profile_path': member.get('profile_path')
            })
        return cast
    
    def extract_crew(self, credits):
        """Extract crew members"""
        crew = {}
        if not credits or 'crew' not in credits:
            return crew
        
        important_jobs = ['Director', 'Writer', 'Producer', 'Cinematography', 
                         'Original Music Composer', 'Editor', 'Screenplay']
        
        for member in credits['crew']:
            job = member.get('job')
            if job in important_jobs:
                if job not in crew:
                    crew[job] = []
                if len(crew[job]) < 3:
                    crew[job].append({
                        'name': member.get('name'),
                        'profile_path': member.get('profile_path')
                    })
        
        return crew
    
    def process_movie(self, movie_data):
        """Create movie object with all data"""
        if not movie_data:
            return None
        
        credits = movie_data.get('credits', {})
        
        processed = {
            'id': movie_data.get('id'),
            'title': movie_data.get('title'),
            'original_title': movie_data.get('original_title'),
            'release_date': movie_data.get('release_date'),
            'runtime': movie_data.get('runtime'),
            'language': movie_data.get('original_language'),
            'budget': movie_data.get('budget'),
            'revenue': movie_data.get('revenue'),
            'rating': movie_data.get('vote_average'),
            'votes': movie_data.get('vote_count'),
            'overview': movie_data.get('overview'),
            'status': movie_data.get('status'),
            'tagline': movie_data.get('tagline'),
            'genres': [g['name'] for g in movie_data.get('genres', [])],
            'production_companies': [c['name'] for c in movie_data.get('production_companies', [])],
            'cast': self.extract_cast(credits),
            'crew': self.extract_crew(credits)
        }
        
        return processed
    
    def run(self):
        """Execute the complete process"""
        self.print_header()
        
        # Step 1: Load and display filmography
        movie_ids = self.load_filmography()
        if not movie_ids:
            return False
        
        # Step 2: Fetch details for each movie
        print(f"\n{'='*80}")
        print(f"🎬 FETCHING MOVIE DETAILS (ONE BY ONE)")
        print(f"{'='*80}\n")
        
        all_movies = []
        successful = 0
        failed = 0
        
        for i, (movie_id, title) in enumerate(movie_ids, 1):
            title_display = (title[:45] + '...') if len(title) > 45 else title
            
            print(f"[{i:2d}/{len(movie_ids)}] 🎬 {title_display:<48}", end='', flush=True)
            
            movie_details = self.fetch_movie_details(movie_id, title)
            if movie_details:
                processed = self.process_movie(movie_details)
                if processed:
                    all_movies.append(processed)
                    print(" ✅ SUCCESS")
                    successful += 1
                else:
                    print(" ⚠️  Processing error")
                    failed += 1
            else:
                print(" ❌ FAILED")
                failed += 1
            
            time.sleep(0.4)
        
        print(f"\n{'='*80}")
        print(f"📊 FETCH SUMMARY")
        print(f"{'='*80}")
        print(f"✅ Successful: {successful}/{len(movie_ids)} movies")
        print(f"❌ Failed:     {failed}/{len(movie_ids)} movies")
        print(f"{'='*80}\n")
        
        # Step 3: Save combined data
        result = {
            'metadata': {
                'category': self.category,
                'actor_name': self.actor_name,
                'total_movies': len(all_movies),
                'successful_fetches': successful,
                'failed_fetches': failed,
                'created_at': time.strftime('%Y-%m-%d %H:%M:%S'),
                'note': 'All movie data combined in one file. Ready to merge to main JSON'
            },
            'movies': all_movies
        }
        
        output_file = self.base_dir / 'movies_data.json'
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
            
            file_size = output_file.stat().st_size / 1024
            
            print(f"{'='*80}")
            print(f"✅ FILE SAVED SUCCESSFULLY")
            print(f"{'='*80}")
            print(f"📁 Location: {output_file}")
            print(f"📊 File Size: {file_size:.1f} KB")
            print(f"🎬 Total Movies: {len(all_movies)}")
            print(f"{'='*80}\n")
            
            print(f"🎉 NEXT STEPS:")
            print(f"  1. Review movies_data.json")
            print(f"  2. Tell me which fields to REMOVE")
            print(f"  3. Then we merge to {self.actor_name}.json!\n")
            
            return True
        except Exception as e:
            print(f"❌ Error saving: {e}")
            return False

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 fetch_movies_data.py <category> <actor_name>")
        print("\nExamples:")
        print("  python3 fetch_movies_data.py heroes prabhas")
        print("  python3 fetch_movies_data.py heroines deepika")
        print("  python3 fetch_movies_data.py directors rajamohan")
        sys.exit(1)
    
    category = sys.argv[1]
    actor_name = sys.argv[2]
    
    fetcher = MovieDataFetcher(category, actor_name)
    success = fetcher.run()
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
