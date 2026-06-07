'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  FaArrowLeft, FaHome, FaShareAlt,
  FaUserPlus, FaUserCheck,
  FaBookmark, FaEye, FaPen, FaStar, FaHeart,
  FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaImdb, FaGlobe,
  FaLayerGroup
} from 'react-icons/fa';
import { SiLetterboxd } from 'react-icons/si';
import Badge from '@/components/Badge';

const DEFAULT_POSTER = '/images/no-poster.png';

interface ProfileClientProps {
  profile: any;
  privacySettings: any;
  counts: any;
  isFollowing: boolean;
  isOnline: boolean;
  lastSeen: string | null;
  isOwnProfile: boolean;
  currentUserId: string | null;
}

export default function ProfileClient({
  profile,
  privacySettings,
  counts,
  isFollowing: initialIsFollowing,
  isOnline: initialIsOnline,
  lastSeen,
  isOwnProfile,
  currentUserId,
}: ProfileClientProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followers, setFollowers] = useState(counts.followers);
  const [isOnline, setIsOnline] = useState(initialIsOnline);
  const [activeTab, setActiveTab] = useState<'watched' | 'watchlist' | 'reviews' | 'tier-lists' | 'memes'>('watched');
  
  // Data states
  const [watchedData, setWatchedData] = useState<any[]>([]);
  const [watchlistData, setWatchlistData] = useState<any[]>([]);
  const [reviewsData, setReviewsData] = useState<any[]>([]);
  const [tierListsData, setTierListsData] = useState<any[]>([]);
  const [userMemes, setUserMemes] = useState<any[]>([]);
  const [badgesData, setBadgesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const dataFetchedRef = useRef(false);

  // Fetch data ONCE
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/profile/${profile.username}/content`, {
          method: 'GET',
          cache: 'no-store'
        });

        if (res.ok) {
          const data = await res.json();
          setWatchedData(data.watched || []);
          setWatchlistData(data.watchlist || []);
          setReviewsData(data.reviews || []);
          setTierListsData(data.tierLists || []);
          setUserMemes(data.memes || []);
          setBadgesData(data.badges || []);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile.username]);

  // Follow handler
  const handleFollow = async () => {
    if (!session) {
      router.push('/signin');
      return;
    }

    try {
      const res = await fetch('/api/profile/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: profile.user_id }),
      });

      if (!res.ok) throw new Error('Failed to follow/unfollow');

      const data = await res.json();

      if (data.action === 'followed') {
        setIsFollowing(true);
        setFollowers(prev => prev + 1);
      } else {
        setIsFollowing(false);
        setFollowers(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error following:', error);
    }
  };

  // Share
  const handleShare = () => {
    if (navigator.share && profile) {
      navigator.share({
        title: `${profile.username}'s Profile`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied!');
    }
  };

  // Derived counts
  const derivedCounts = useMemo(() => ({
    watchlist: watchlistData.length,
    watched: watchedData.length,
    reviews: reviewsData.length,
    tierLists: tierListsData.length,
    memes: userMemes.length,
  }), [watchlistData, watchedData, reviewsData, tierListsData, userMemes]);

  const avatarUrl = profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`;
  const bannerUrl = profile.banner_url || '';

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Banner Section */}
      <div className="relative h-80 bg-gradient-to-b from-white/10 to-black overflow-visible">
        {bannerUrl && (
          <img
            src={bannerUrl}
            alt="Banner"
            className="w-full h-full object-cover opacity-40"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        
        {/* Top Nav */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <button
            onClick={() => router.back()}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl transition"
          >
            <FaArrowLeft className="text-white" size={18} />
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl transition"
            >
              <FaShareAlt className="text-white" size={18} />
            </button>
            <Link
              href="/"
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl transition"
            >
              <FaHome className="text-white" size={18} />
            </Link>
          </div>
        </div>

        {/* Avatar - FULL VISIBLE */}
        <div className="absolute -bottom-24 left-8 z-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-48 h-48"
          >
            <img
              src={avatarUrl}
              alt={profile.username}
              className="w-full h-full rounded-full border-4 border-black shadow-lg object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`;
              }}
            />
            {/* Online Status Indicator */}
            {isOnline && (
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-white border-4 border-black rounded-full z-20 shadow-lg" />
            )}
          </motion.div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-10">
        {/* Header with Follow */}
        <div className="flex items-start justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-5xl font-black text-white">
                {profile.username}
              </h1>
              {isOnline && (
                <span className="text-xs text-green-400 font-semibold">🟢 Online now</span>
              )}
            </div>
            
            {/* Animated Badges */}
            {badgesData && badgesData.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-3">
                {badgesData.map((badge, idx) => {
                  const badgeObj = typeof badge === 'object' ? badge : { name: badge };
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.2 }}
                    >
                      <Badge 
                        badge={{
                          badge_id: badgeObj.badge_id || badgeObj.key || badgeObj.id,
                          name: badgeObj.name || badgeObj.title,
                          description: badgeObj.description,
                          rarity: badgeObj.rarity || 'common',
                          icon: badgeObj.icon,
                          earned_at: badgeObj.earned_at || badgeObj.earnedAt,
                        }}
                        size={24}
                        showTooltip
                      />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {!isOwnProfile && (
            <motion.button
              onClick={handleFollow}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition ${
                isFollowing
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-white text-black hover:shadow-lg'
              }`}
            >
              {isFollowing ? (
                <>
                  <FaUserCheck size={16} /> Following
                </>
              ) : (
                <>
                  <FaUserPlus size={16} /> Follow
                </>
              )}
            </motion.button>
          )}
        </div>

        {/* Status Message */}
        {profile.status_message && (
          <p className="text-white/70 text-sm mb-2 italic">
            "{profile.status_message}"
          </p>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="text-white/80 text-sm mb-4 italic max-w-2xl">
            "{profile.bio}"
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-white/70 text-sm mb-4 flex-wrap">
          <span>@{profile.username.toLowerCase().replace(/\s+/g, '')}</span>
          {profile.pronouns && <span>•</span>}
          {profile.pronouns && <span>{profile.pronouns}</span>}
          {profile.location && <span>📍 {profile.location}</span>}
          {profile.created_at && (
            <span>📅 {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          )}
        </div>

        {/* Favorite Hero & Movie - SHOWING */}
        {(profile.favorite_hero || profile.favorite_movie) && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {profile.favorite_hero && (
              <Link 
                href={`/hero/${profile.favorite_hero.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white/80 hover:text-white text-xs transition-all"
              >
                <span>💖</span>
                <span>{profile.favorite_hero.name}</span>
              </Link>
            )}
            {profile.favorite_movie && (
              <Link 
                href={`/movie/${profile.favorite_movie.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white/80 hover:text-white text-xs transition-all"
              >
                <span>🎬</span>
                <span>{profile.favorite_movie.title}</span>
              </Link>
            )}
          </div>
        )}

        {/* Followers & Following */}
        <div className="flex items-center gap-3 text-white/70 text-sm mb-4">
          <button className="hover:text-white transition-colors">
            <span className="font-bold text-white">{followers}</span> Followers
          </button>
          <span>•</span>
          <button className="hover:text-white transition-colors">
            <span className="font-bold text-white">{counts.following}</span> Following
          </button>
        </div>

        {/* Social Links */}
        <div className="flex gap-3 mb-6">
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
              <FaGlobe size={16} />
            </a>
          )}
          {profile.twitter_url && (
            <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
              <FaTwitter size={16} />
            </a>
          )}
          {profile.instagram_url && (
            <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
              <FaInstagram size={16} />
            </a>
          )}
          {profile.youtube_url && (
            <a href={profile.youtube_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
              <FaYoutube size={16} />
            </a>
          )}
          {profile.tiktok_url && (
            <a href={profile.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
              <FaTiktok size={16} />
            </a>
          )}
          {profile.imdb_url && (
            <a href={profile.imdb_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
              <FaImdb size={16} />
            </a>
          )}
          {profile.letterboxd_url && (
            <a href={profile.letterboxd_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
              <SiLetterboxd size={16} />
            </a>
          )}
        </div>

        {/* Stats + Button */}
<div className="flex items-center gap-4 flex-wrap mb-8">
  {/* Only show if viewing own profile */}
  {isOwnProfile && (
    <motion.button
      onClick={() => router.push('/profile')}
      whileHover={{ scale: 1.05 }}
      className="px-6 py-2.5 bg-white text-black font-bold rounded-lg text-sm hover:shadow-lg transition-all"
    >
      Edit Profile
    </motion.button>
  )}

  {/* Stats Inline */}
  <div className="flex items-center gap-3 text-white/70 text-xs">
    <div className="text-center">
      <p className="font-black text-white text-lg">{derivedCounts.watched}</p>
      <p>👁️ Watched</p>
    </div>
    <div className="h-8 w-px bg-white/20" />
    <div className="text-center">
      <p className="font-black text-white text-lg">{derivedCounts.watchlist}</p>
      <p>📚 Watchlist</p>
    </div>
    <div className="h-8 w-px bg-white/20" />
    <div className="text-center">
      <p className="font-black text-white text-lg">{derivedCounts.reviews}</p>
      <p>✍️ Reviews</p>
    </div>
    <div className="h-8 w-px bg-white/20" />
    <div className="text-center">
      <p className="font-black text-white text-lg">{derivedCounts.tierLists}</p>
      <p>🏆 Tier Lists</p>
    </div>
  </div>
</div>


        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {privacySettings.show_watched && (
            <button
              onClick={() => setActiveTab('watched')}
              className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition ${
                activeTab === 'watched'
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              👁️ Watched ({derivedCounts.watched})
            </button>
          )}
          {privacySettings.show_watchlist && (
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition ${
                activeTab === 'watchlist'
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              📚 Watchlist ({derivedCounts.watchlist})
            </button>
          )}
          {privacySettings.show_reviews && (
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition ${
                activeTab === 'reviews'
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              ✍️ Reviews ({derivedCounts.reviews})
            </button>
          )}
          {privacySettings.show_tier_lists && (
            <button
              onClick={() => setActiveTab('tier-lists')}
              className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition ${
                activeTab === 'tier-lists'
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              🏆 Tier Lists ({derivedCounts.tierLists})
            </button>
          )}
          {privacySettings.show_memes && derivedCounts.memes > 0 && (
            <button
              onClick={() => setActiveTab('memes')}
              className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition ${
                activeTab === 'memes'
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              😂 Memes ({derivedCounts.memes})
            </button>
          )}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-white/60">Loading...</div>
          </div>
        ) : (
          <div className="min-h-[400px]">
            {activeTab === 'watched' && (
              <div>
                {watchedData.length === 0 ? (
                  <div className="text-center py-20 text-white/40">
                    <FaEye className="text-5xl mx-auto mb-4 opacity-20" />
                    <p>No watched movies yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {watchedData.map((item, idx) => (
                      <Link key={idx} href={`/movie/${item.movieSlug}`} className="group">
                        <div className="aspect-[2/3] rounded-lg overflow-hidden bg-white/5 mb-2">
                          <img
                            src={item.poster || DEFAULT_POSTER}
                            alt="Movie"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <p className="text-sm text-white/80 font-semibold line-clamp-1">
                          {item.title || item.movieSlug}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'watchlist' && (
              <div>
                {watchlistData.length === 0 ? (
                  <div className="text-center py-20 text-white/40">
                    <FaBookmark className="text-5xl mx-auto mb-4 opacity-20" />
                    <p>No movies in watchlist yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {watchlistData.map((item, idx) => (
                      <Link key={idx} href={`/movie/${item.movieSlug}`} className="group">
                        <div className="aspect-[2/3] rounded-lg overflow-hidden bg-white/5 mb-2">
                          <img
                            src={item.poster || DEFAULT_POSTER}
                            alt="Movie"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <p className="text-sm text-white/80 font-semibold line-clamp-1">
                          {item.title || item.movieSlug}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {reviewsData.length === 0 ? (
                  <div className="text-center py-20 text-white/40">
                    <FaStar className="text-5xl mx-auto mb-4 opacity-20" />
                    <p>No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviewsData.map((review, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="p-6 rounded-lg bg-white/5 border border-white/10"
                      >
                        <Link href={`/movie/${review.movieSlug}`} className="text-lg font-bold text-white hover:text-white/80 transition mb-2 block">
                          {review.movieTitle || review.movieSlug}
                        </Link>
                        {review.rating && (
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                size={14}
                                className={i < (review.rating || 0) ? 'text-white' : 'text-white/20'}
                              />
                            ))}
                            <span className="text-white/60 text-sm ml-2">{review.rating}/5</span>
                          </div>
                        )}
                        {review.reviewText && (
                          <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                            "{review.reviewText}"
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tier-lists' && (
              <div>
                {tierListsData.length === 0 ? (
                  <div className="text-center py-20 text-white/40">
                    <FaLayerGroup className="text-5xl mx-auto mb-4 opacity-20" />
                    <p>No tier lists yet</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {tierListsData.map((tierList, idx) => (
                      <Link
                        key={idx}
                        href={`/tier-list/${tierList.id}`}
                        className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition group"
                      >
                        <h3 className="font-bold text-white group-hover:text-white/80 transition">
                          {tierList.title}
                        </h3>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'memes' && (
              <div>
                {userMemes.length === 0 ? (
                  <div className="text-center py-20 text-white/40">
                    <span className="text-5xl mb-4 block opacity-20">😂</span>
                    <p>No memes yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {userMemes.map((meme, idx) => (
                      <Link key={idx} href={`/memes/${meme.id}`} className="group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-white/5 group-hover:scale-105 transition-transform">
                          <img
                            src={meme.imageUrl || DEFAULT_POSTER}
                            alt={meme.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs text-white/70 mt-2 line-clamp-1">{meme.title}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
