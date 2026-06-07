#!/usr/bin/env python3


import requests
import json
import os
from datetime import datetime
from pathlib import Path

# Configuration
API_KEY = "ba5dc12f58f09088d036049c565c2fe9"
BASE_URL = "https://api.themoviedb.org/3"
DELAY = 0.2  # Seconds between API calls

class FilmographyFetcher:
    def __init__(self, api_key: str, hero_name: str, person_id: int):
        self.api_key = api_key
        self.hero_name = hero_name
        self.person_id = person_id
        self.base_url = BASE_URL

        # Create directory structure
        self.output_dir = Path(f"tmdb/heroes/{hero_name.lower().replace(' ', '_')}")
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def fetch_filmography(self) -> dict:
        """
        Fetch filmography from TMDB API
        Returns: movie_credits response with all cast movies
        """
        print(f"🎬 Fetching filmography for {self.hero_name} (ID: {self.person_id})...")

        try:
            url = f"{self.base_url}/person/{self.person_id}/movie_credits"
            params = {'api_key': self.api_key}

            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()

            data = response.json()

            if 'cast' not in data:
                print("❌ Error: No cast movies found!")
                return None

            return data

        except requests.exceptions.RequestException as e:
            print(f"❌ API Error: {e}")
            return None

    def process_filmography(self, raw_data: dict) -> dict:
        """
        Process and format filmography data
        Extract key information for each movie
        """
        print("📊 Processing filmography data...")

        movies = raw_data.get('cast', [])

        processed_movies = []
        for movie in movies:
            processed_movie = {
                'tmdb_id': movie.get('id'),
                'title': movie.get('title'),
                'original_title': movie.get('original_title'),
                'release_date': movie.get('release_date'),
                'year': movie.get('release_date', '')[:4] if movie.get('release_date') else '',
                'original_language': movie.get('original_language'),
                'character': movie.get('character'),
                'order': movie.get('order'),
                'vote_average': movie.get('vote_average'),
                'vote_count': movie.get('vote_count'),
                'poster_path': movie.get('poster_path'),
                'backdrop_path': movie.get('backdrop_path'),
                'genre_ids': movie.get('genre_ids', []),
                'overview': movie.get('overview')
            }
            processed_movies.append(processed_movie)

        result = {
            'metadata': {
                'hero_name': self.hero_name,
                'tmdb_person_id': self.person_id,
                'total_movies': len(processed_movies),
                'fetched_at': datetime.now().isoformat(),
                'api_version': 'tmdb_3'
            },
            'movies': processed_movies
        }

        return result

    def save_filmography(self, data: dict) -> bool:
        """Save filmography to JSON file"""
        try:
            filepath = self.output_dir / 'filmography.json'

            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

            print(f"✅ Saved to: {filepath}")
            return True

        except Exception as e:
            print(f"❌ Error saving file: {e}")
            return False

    def run(self):
        """Execute the filmography fetching process"""
        # Fetch
        raw_data = self.fetch_filmography()
        if not raw_data:
            return False

        # Process
        processed_data = self.process_filmography(raw_data)

        # Display summary
        print(f"\n📊 Filmography Summary:")
        print(f"   Hero: {processed_data['metadata']['hero_name']}")
        print(f"   Total Movies: {processed_data['metadata']['total_movies']}")
        print(f"   TMDB ID: {processed_data['metadata']['tmdb_person_id']}")

        # Save
        success = self.save_filmography(processed_data)

        if success:
            filepath = self.output_dir / 'filmography.json'
            file_size = filepath.stat().st_size / 1024  # KB
            print(f"   File Size: {file_size:.1f} KB")

        return success


def main():
    print("""
╔════════════════════════════════════════════════════════════════╗
║      🎬 SCRIPT #1: TMDB Filmography Fetcher 🎬               ║
║  Fetches complete hero filmography from TMDB API              ║
╚════════════════════════════════════════════════════════════════╝
    """)

    import sys

    if len(sys.argv) < 3:
        print("Usage: python fetch_filmography.py <hero_name> <tmdb_person_id>")
        print("\nExample: python fetch_filmography.py prabhas 237045")
        print("\nCommon TMDB IDs:")
        print("  Prabhas: 237045")
        print("  Allu Arjun: 16731")
        print("  Ram Charan: 19640")
        print("  Mahesh Babu: 1309")
        sys.exit(1)

    hero_name = sys.argv[1]
    person_id = int(sys.argv[2])

    fetcher = FilmographyFetcher(API_KEY, hero_name, person_id)
    success = fetcher.run()

    if success:
        print(f"\n✅ COMPLETE! Ready for SCRIPT #2")
        print(f"   Next: Pass this filmography.json to script 2")
        sys.exit(0)
    else:
        print("\n❌ Failed!")
        sys.exit(1)


if __name__ == "__main__":
    main()
