# JSON to PostgreSQL Migration Safety Report
**Generated:** 2026-05-07
**Project:** TFIverse-v2

## 1. Scope of Migration
The following static JSON files in `src/data` are slated for migration to the PostgreSQL database:
- `heroes.json` -> `people` table
- `memes.json` -> `memes` table
- `rumors.json` -> `rumors` table
- `upcoming.json` -> `movies` table

## 2. Integrity Risks & Schema Conflicts

### 🔴 CRITICAL ALERTS

1. **UUID Constraint Violations (`memes.json` & `rumors.json`)**
   - **Risk:** The database schema enforces UUIDs for `memes.id` and `rumors.id`. The JSON files use string IDs (`"dummy-meme-1"`, `"1"`).
   - **Handling Strategy:** We will generate fresh UUIDs during the import process. The old string IDs will be discarded.

2. **Foreign Key Violations (`memes.json`)**
   - **Risk:** `memes.json` assigns `userId: "system"`. The DB requires a valid `UUID` referencing the `users` table. 
   - **Handling Strategy:** The migration script will first check for a "System Admin" user. If it does not exist, it will create one (or skip meme import if auth is strictly external). To be safe, we will create a dedicated "System" user UUID and map all dummy memes to it.

3. **Not-Null Constraints (`upcoming.json`)**
   - **Risk:** The `movies` table requires `tmdbId` (`notNull().unique()`). However, `upcoming.json` is missing TMDB IDs for several films (e.g., "Devara", "Game Changer").
   - **Handling Strategy:** We **cannot** safely import `upcoming.json` directly into the `movies` table without TMDB IDs. We will skip the import of records missing `tmdbId` and flag them in the migration logs.

4. **Primary Key Mapping (`heroes.json`)**
   - **Risk:** `heroes.json` has integer IDs, but the `people` table uses `varchar` IDs.
   - **Handling Strategy:** We will use the `slug` as the primary `id` for the `people` table (e.g., `id: "prabhas"`).

## 3. Data Transformation & Upsert Strategy

To ensure zero production data loss and an **idempotent** process (the script can be run 100 times without duplicating data):

*   **People (`heroes.json`):** Upsert based on `slug`. If a hero already exists, update their `metadata` JSON blob.
*   **Movies (`upcoming.json`):** Upsert based on `tmdbId`.
*   **Memes & Rumors:** Upsert based on unique identifiers (like `title` + `imageUrl` for memes, or `title` for rumors) to prevent duplicate inserts on subsequent runs.

## 4. Rollback Strategy
Because the migration uses `ON CONFLICT DO UPDATE` (upserts), a rollback is technically an overwrite from a previous database backup. However, since we are moving from JSON to a DB, the "rollback" simply involves un-commenting the dual-read logic in the UI and reading from the JSON files again. 

**DO NOT DELETE the `src/data` folder until 48 hours after successful production migration.**
