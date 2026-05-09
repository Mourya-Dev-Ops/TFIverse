'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import {
  FaBookmark, FaStar, FaHeart, FaEye, FaPen, FaSignOutAlt,
  FaEdit, FaTimes, FaCalendar, FaMapMarkerAlt, FaCamera,
  FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaImdb, FaGlobe,
  FaShareAlt, FaDownload, FaLink, FaCheck,
  FaTrash, FaExclamationTriangle, FaCheckCircle, FaBell, FaCrown, 
  FaLayerGroup, FaTh, FaThumbtack, FaUsers, FaSearch
} from 'react-icons/fa';
import { SiLetterboxd } from 'react-icons/si';
import toast, { Toaster } from 'react-hot-toast';

import { Badge } from '@/components/Badge';
import { cachedJson } from '@/lib/tmdb-cache';
import { getBadgeAnimation } from '@/lib/badge-animations';
import Lottie from 'lottie-react';


const DEFAULT_POSTER = '/images/no-poster.png';
const USERNAME_MIN = 3;
const USERNAME_MAX = 20;
const BIO_MAX = 500;

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Core state
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [heroesData, setHeroesData] = useState<any[]>([]);

  // Data state
  const [stats, setStats] = useState<any>({});
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [tierLists, setTierLists] = useState<any[]>([]);
  
  // NEW FEATURES - CINEMA SILVER THEME
  const [pinnedTierList, setPinnedTierList] = useState<any>(null);
  const [favoriteHero, setFavoriteHero] = useState<string>('');
  const [favoriteMovie, setFavoriteMovie] = useState<string>('');
  const [statusEmoji, setStatusEmoji] = useState<string>('🎬');
  const [themeColor, setThemeColor] = useState<string>('var(--color-secondary)');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [privacySettings, setPrivacySettings] = useState<any>({
    show_watchlist: true,
    show_activity: true,
    show_followers: true,
    allow_dms: true
  });
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // UI/edit state
  const [showEditModal, setShowEditModal] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadType, setUploadType] = useState<'avatar' | 'banner' | ''>('');
  
  // Validation
  const [usernameError, setUsernameError] = useState('');
  const [bioError, setBioError] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [favoriteHeroData, setFavoriteHeroData] = useState<any>(null);
  const [favoriteMovieData, setFavoriteMovieData] = useState<any>(null);

  // MEMES STATE
  const [memesTab, setMemesTab] = useState<'uploaded' | 'liked' | 'bookmarked'>('uploaded');
  const [uploadedMemes, setUploadedMemes] = useState<any[]>([]);
  const [likedMemes, setLikedMemes] = useState<any[]>([]);
  const [bookmarkedMemes, setBookmarkedMemes] = useState<any[]>([]);
  const [memesLoading, setMemesLoading] = useState(false);

  // Delete meme function
  async function deleteMeme(memeId: string) {
    if (!user) return;
    if (!window.confirm('Are you sure you want to delete this meme? 🗑️')) return;
    try {
      await fetch(`/api/memes/${memeId}`, { method: 'DELETE' });
      setUploadedMemes(prev => prev.filter(m => m.id !== memeId));
      toast.success('Meme deleted! ✨');
    } catch (error) {
      toast.error('Failed to delete meme 😞');
      console.error(error);
    }
  }

  // Load memes function
  useEffect(() => {
    if (!user) return;
    loadUserMemes();
  }, [user, memesTab]);

  async function loadUserMemes() {
    if (!user) return;
    setMemesLoading(true);
    
    try {
      if (memesTab === 'uploaded') {
        const res = await fetch(`/api/content/me/memes`);
        if (res.ok) {
          const data = await res.json();
          setUploadedMemes(data.memes || []);
        }
      } else if (memesTab === 'liked') {
        const res = await fetch(`/api/content/me/memes/liked`);
        if (res.ok) {
          const data = await res.json();
          setLikedMemes(data.memes || []);
        }
      } else if (memesTab === 'bookmarked') {
        const res = await fetch(`/api/content/me/memes/bookmarked`);
        if (res.ok) {
          const data = await res.json();
          setBookmarkedMemes(data.memes || []);
        }
      }
    } catch (error) {
      console.error('Failed to load memes:', error);
    } finally {
      setMemesLoading(false);
    }
  }

  // Load heroes from database
  useEffect(() => {
    async function loadHeroes() {
      try {
        const res = await fetch('/api/heroes');
        if (res.ok) {
          const data = await res.json();
          console.log('🎬 Heroes loaded:', data.heroes?.length || 0);
          const transformedHeroes = data.heroes.map((h: any) => ({
            slug: h.slug,
            name: h.data?.name || h.name,
            ...h.data,
          }));
          setHeroesData(transformedHeroes);
        }
      } catch (error) {
        console.error('Failed to load heroes:', error);
      }
    }
    
    loadHeroes();
  }, []);

  const [editData, setEditData] = useState({
    username: '',
    bio: '',
    userlocation: '',
    pronouns: '',
    twitterurl: '',
    instagramurl: '',
    youtubeurl: '',
    tiktokurl: '',
    letterboxdurl: '',
    imdburl: '',
    website: ''
  });

  // Header controls
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileLink, setProfileLink] = useState('');

  // Completeness + activity
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  // Followers/Following
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [followSearchQuery, setFollowSearchQuery] = useState('');

  const [emailVerified, setEmailVerified] = useState(false);

  // Delete Account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [movieSearchQuery, setMovieSearchQuery] = useState('');
  const [showMovieDropdown, setShowMovieDropdown] = useState(false);
  const [selectedMovieData, setSelectedMovieData] = useState<any>(null);

  // Load everything - Converted to API calls
  useEffect(() => {
    (async () => {
      if (status === 'loading') return;
      
      if (!session) {
        router.push('/signin?redirect=/profile');
        return;
      }

      try {
        const sUser = session.user;
        setUser(sUser);
        setEmailVerified(true);

        // Fetch profile from API
        const profileRes = await fetch('/api/profile/me');
        if (!profileRes.ok) throw new Error('Failed to fetch profile');
        
        const profileData = await profileRes.json();
        const current = profileData.profile;
        
        setProfile(current);

        if (current) {
          // Load new fields
          setFavoriteHero(current.favoriteHeroSlug || '');
          setFavoriteMovie(current.favoriteMovieSlug || '');
          setThemeColor(current.themeColor || 'var(--color-secondary)');
          setStatusMessage(current.statusMessage || '');
          setPrivacySettings(current.privacySettings || {
            show_watchlist: true,
            show_activity: true,
            show_followers: true,
            allow_dms: true
          });

          // Load status emoji
          if (current.statusEmoji) {
            console.log('🎭 Loading status emoji:', current.statusEmoji);
            setStatusEmoji(current.statusEmoji);
          }

          // Fetch all data in parallel
          const [statsRes, watchlistRes, watchedRes, reviewsRes, badgesRes, tierListsRes, pinnedRes, followersRes, followingRes, notifsRes, adminRes] = await Promise.all([
            fetch('/api/profile/stats'),
            fetch('/api/content/me/watchlist'),
            fetch('/api/content/me/watched'),
            fetch('/api/content/me/reviews'),
            fetch('/api/profile/badges'),
            fetch('/api/content/me/tier-lists'),
            fetch('/api/profile/pinned-tier-list'),
            fetch('/api/profile/followers/count'),
            fetch('/api/profile/following/count'),
            fetch('/api/notifications'),
            fetch('/api/profile/admin-check'),
          ]);

          if (statsRes.ok) {
            const data = await statsRes.json();
            setStats(data.stats || {});
          }

          if (watchlistRes.ok) {
            const data = await watchlistRes.json();
            setWatchlist(data.watchlist || []);
          }

          if (watchedRes.ok) {
            const data = await watchedRes.json();
            setWatchedMovies(data.watched || []);
          }

          if (reviewsRes.ok) {
            const data = await reviewsRes.json();
            setUserReviews(data.reviews || []);
          }

          if (badgesRes.ok) {
            const data = await badgesRes.json();
            setUserBadges(data.badges || []);
          }

          if (tierListsRes.ok) {
            const data = await tierListsRes.json();
            setTierLists(data.tierLists || []);
          }

          if (pinnedRes.ok) {
            const data = await pinnedRes.json();
            setPinnedTierList(data.pinnedTierList);
          }

          if (followersRes.ok) {
            const data = await followersRes.json();
            setFollowersCount(data.count || 0);
          }

          if (followingRes.ok) {
            const data = await followingRes.json();
            setFollowingCount(data.count || 0);
          }

          if (notifsRes.ok) {
            const data = await notifsRes.json();
            setNotifications(data.notifications || []);
            setUnreadCount((data.notifications || []).filter((n: any) => !n.read).length);
          }

          if (adminRes.ok) {
            const data = await adminRes.json();
            setIsAdmin(data.isAdmin || false);
          }

          // Update last seen
          await fetch('/api/profile/update-last-seen', { method: 'POST' });
        }
      } catch (err) {
        console.error('Profile load error:', err);
      } finally {
        setLoading(false);
      }
    })();

    // Continuous last_seen_at updates
    const updateLastSeen = async () => {
      if (session?.user?.id) {
        await fetch('/api/profile/update-last-seen', { method: 'POST' });
      }
    };

    const interval = setInterval(updateLastSeen, 2 * 60 * 1000);

    return () => {
      clearInterval(interval);
      updateLastSeen();
    };
  }, [session, status, router]);

  // Load favorite hero/movie after heroes data is ready
  useEffect(() => {
    if (!profile || heroesData.length === 0) return;
    
    console.log('🎯 Loading favorites with heroes data:', heroesData.length);
    
    // Load favorite hero
    if (profile.favoriteHeroSlug) {
      const hero = heroesData.find((h: any) => h.slug === profile.favoriteHeroSlug);
      console.log('🎯 Loading favorite hero:', profile.favoriteHeroSlug, hero); 
      if (hero) setFavoriteHeroData(hero);
    }
    
    // Load favorite movie
    if (profile.favoriteMovieSlug) {
      for (const hero of heroesData as any[]) {
        if (hero.movies && Array.isArray(hero.movies)) {
          const m = hero.movies.find((mm: any) => mm.slug === profile.favoriteMovieSlug);
          if (m) {
            console.log('🎬 Found favorite movie:', m.title);
            setFavoriteMovieData(m);
            setSelectedMovieData({
              ...m,
              heroName: hero.name,
              heroSlug: hero.slug,
            });
            break;
          }
        }
      }
    }
  }, [profile, heroesData]);

  // Filter movies based on search query
  const filteredMovies = useMemo(() => {
    if (!movieSearchQuery.trim()) return [];

    const query = movieSearchQuery.toLowerCase();
    const results: any[] = [];

    // Search through all heroes and their movies
    (heroesData as any[]).forEach((hero: any) => {
      if (hero.movies && Array.isArray(hero.movies)) {
        hero.movies.forEach((movie: any) => {
          if (
            movie.title?.toLowerCase().includes(query) ||
            movie.slug?.toLowerCase().includes(query)
          ) {
            results.push({
              ...movie,
              heroName: hero.name,
              heroSlug: hero.slug,
            });
          }
        });
      }
    });

    // Limit to top 20 results
    return results.slice(0, 20);
  }, [movieSearchQuery, heroesData]);

  // Prefill edit form
  useEffect(() => {
    if (!profile) return;
    setEditData({
      username: profile.username || '',
      bio: profile.bio || '',
      userlocation: profile.location || '',
      pronouns: profile.pronouns || '',
      twitterurl: profile.twitterUrl || '',
      instagramurl: profile.instagramUrl || '',
      youtubeurl: profile.youtubeUrl || '',
      tiktokurl: profile.tiktokUrl || '',
      letterboxdurl: profile.letterboxdUrl || '',
      imdburl: profile.imdbUrl || '',
      website: profile.website || '',
    });
  }, [profile]);

  // Username validation with debounce
  useEffect(() => {
    if (!editData.username || editData.username === profile?.username) {
      setUsernameError('');
      return;
    }

    const timer = setTimeout(async () => {
      if (editData.username.length < USERNAME_MIN) {
        setUsernameError(`Username must be at least ${USERNAME_MIN} characters`);
        return;
      }
      if (editData.username.length > USERNAME_MAX) {
        setUsernameError(`Username must be less than ${USERNAME_MAX} characters`);
        return;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(editData.username)) {
        setUsernameError('Username can only contain letters, numbers, and underscores');
        return;
      }

      setCheckingUsername(true);
      
      const res = await fetch(`/api/profile/check-username?username=${editData.username}`);
      const data = await res.json();
      
      setCheckingUsername(false);
      
      if (data.exists) {
        setUsernameError('❌ Username already taken');
      } else {
        setUsernameError('');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [editData.username, profile?.username, user?.id]);

  // Bio validation
  useEffect(() => {
    if (editData.bio.length > BIO_MAX) {
      setBioError(`Bio must be less than ${BIO_MAX} characters (${editData.bio.length}/${BIO_MAX})`);
    } else {
      setBioError('');
    }
  }, [editData.bio]);

  // Link + completeness
  useEffect(() => {
    if (!profile) return;

    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const username = profile.username || '';
    setProfileLink(`${base}/u/${encodeURIComponent(username)}`);

    const core = {
      username: !!profile.username && profile.username.trim().length > 0,
      bio: !!profile.bio && profile.bio.trim().length > 0,
      avatar: !!profile.avatarUrl || !!profile.avatar_url,
      banner: !!profile.bannerUrl || !!profile.banner_url,
      location: !!profile.location,
    };

    const socials = {
      website: !!profile.website,
      twitterurl: !!profile.twitterUrl || !!profile.twitter_url,
      instagramurl: !!profile.instagramUrl || !!profile.instagram_url,
      youtubeurl: !!profile.youtubeUrl || !!profile.youtube_url,
      tiktokurl: !!profile.tiktokUrl || !!profile.tiktok_url,
      letterboxdurl: !!profile.letterboxdUrl || !!profile.letterboxd_url,
      imdburl: !!profile.imdbUrl || !!profile.imdb_url,
    };

    const socialsFilled = Object.values(socials).filter(Boolean).length;
    const socialCredits = Math.min(5, socialsFilled);
    const coreFilled = Object.values(core).filter(Boolean).length;

    const pct = Math.round(((coreFilled + socialCredits) / 10) * 100);
    setProfileCompleteness(pct);

    const missing: string[] = [];
    Object.entries(core).forEach(([k, v]) => { if (!v) missing.push(k); });
    if (socialCredits < 5) missing.push(`${5 - socialCredits} social links`);
    setMissingFields(missing);
  }, [profile]);

  // Activities
  useEffect(() => {
    const combined: any[] = [];
    if (watchlist?.length) {
      combined.push(...watchlist.map((w: any) => ({ type: 'watchlist', date: w.createdAt || w.addedAt || null, movieslug: w.movieSlug })));
    }
    if (watchedMovies?.length) {
      combined.push(...watchedMovies.map((wm: any) => ({ type: 'watched', date: wm.watchedAt || wm.createdAt || null, movieslug: wm.movieSlug })));
    }
    if (userReviews?.length) {
      combined.push(...userReviews.map((r: any) => ({ type: 'review', date: r.createdAt || null, movieslug: r.movieSlug, rating: r.rating })));
    }
    combined.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    setActivities(combined.slice(0, 10));
  }, [watchlist, watchedMovies, userReviews]);

  const derivedCounts = useMemo(() => ({
    watchlist: (watchlist || []).length,
    watched: (watchedMovies || []).length,
    reviews: (userReviews || []).length,
    likes: stats?.likesCount || 0,
    ratings: stats?.ratingsCount || 0,
    tierLists: (tierLists || []).length,
  }), [watchlist, watchedMovies, userReviews, stats, tierLists]);

  // Handlers
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };
  
  // Profile Complete badge replaces Email Verified
  const computedBadges = useMemo(() => {
    const base = (userBadges || []).map((b: any) => ({
      badge_id: b.badge?.key || b.badgeId || 'unknown',
      name: b.badge?.name || 'Badge',
      description: b.badge?.description || '',
      rarity: b.badge?.rarity || 'common',
      earned_at: b.earnedAt || b.createdAt || null,
    }));
    
    // Profile Complete badge (100% profile = verified profile)
    if (profileCompleteness === 100 && !base.some(x => x.badge_id === 'profile-complete')) {
      base.unshift({
        badge_id: 'profile-complete',
        name: 'Profile Complete ✅',
        description: 'Verified Profile - 100% Complete',
        rarity: 'rare',
        earned_at: new Date().toISOString(),
      });
    }
    
    // Add verified badge if user is verified
    if (profile?.isVerified && !base.some(x => x.badge_id === 'verified')) {
      base.unshift({
        badge_id: 'verified',
        name: '⭐ Verified',
        description: 'Verified account',
        rarity: 'legendary',
        earned_at: null,
      });
    }
    
    return base;
  }, [userBadges, profileCompleteness, profile?.isVerified]);

  const handleCopyLink = async () => {
    try { 
      await navigator.clipboard.writeText(profileLink); 
      setCopied(true); 
      setTimeout(() => setCopied(false), 1500); 
    } catch {}
  };
  
  const handleExportData = async () => {
    const data = {
      profile,
      stats,
      watchlist,
      watchedMovies,
      reviews: userReviews,
      tierLists,
      badges: (userBadges || []).map((b: any) => b?.badge?.name || b?.name || 'Badge'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const uname = (profile?.username || 'user').toLowerCase();
    a.href = url; 
    a.download = `tfiverse-profile-${uname}-${ts}.json`; 
    a.click();
    URL.revokeObjectURL(url);
  };
  // File validation
  const validateFile = (file: File, type: 'avatar' | 'banner'): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return `File size must be less than 5MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB) 📸`;
    }
    if (!file.type.startsWith('image/')) {
      return 'File must be an image 🖼️';
    }
    return null;
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const error = validateFile(file, 'avatar');
      if (error) {
        toast.error(error);
        return;
      }
      setAvatarFile(file);
    }
  };
  
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const error = validateFile(file, 'banner');
      if (error) {
        toast.error(error);
        return;
      }
      setBannerFile(file);
    }
  };
  
  const handleAvatarUpload = async () => {
    if (!avatarFile || !user) return;
    
    setUploading(true);
    setUploadType('avatar');
    setUploadProgress(0);
    
    const toastId = toast.loading('📤 Uploading avatar... 0%');
    
    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const next = Math.min(prev + 10, 90);
          toast.loading(`📤 Uploading avatar... ${next}%`, { id: toastId });
          return next;
        });
      }, 200);
      
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const res = await fetch('/api/profile/upload-avatar', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      toast.loading('📤 Uploading avatar... 100%', { id: toastId });
      
      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      
      setProfile((prev: any) => ({ ...prev, avatarUrl: data.avatarUrl }));
      setAvatarFile(null);
      
      toast.success('✨ Avatar updated successfully!', { id: toastId, duration: 3000 });
      setTimeout(() => window.location.reload(), 1000);
      
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error('❌ Failed to update avatar: ' + (error.message || 'Unknown error'), { id: toastId });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setUploadType('');
    }
  };

  const handleBannerUpload = async () => {
    if (!bannerFile || !user) return;
    
    setUploading(true);
    setUploadType('banner');
    setUploadProgress(0);
    
    const toastId = toast.loading('📤 Uploading banner... 0%');
    
    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const next = Math.min(prev + 10, 90);
          toast.loading(`📤 Uploading banner... ${next}%`, { id: toastId });
          return next;
        });
      }, 200);
      
      const formData = new FormData();
      formData.append('banner', bannerFile);
      
      const res = await fetch('/api/profile/upload-banner', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      toast.loading('📤 Uploading banner... 100%', { id: toastId });
      
      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      
      setProfile((prev: any) => ({ ...prev, bannerUrl: data.bannerUrl }));
      setBannerFile(null);
      
      toast.success('✨ Banner updated successfully!', { id: toastId, duration: 3000 });
      setTimeout(() => window.location.reload(), 1000);
      
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error('❌ Failed to update banner: ' + (error.message || 'Unknown error'), { id: toastId });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setUploadType('');
    }
  };

  // Save profile with new fields - CINEMA SILVER
  const handleSaveProfile = async () => {
    if (!user) return;
    
    if (usernameError) {
      toast.error('❌ ' + usernameError);
      return;
    }
    
    if (bioError) {
      toast.error('❌ ' + bioError);
      return;
    }
    
    if (checkingUsername) {
      toast.error('⏳ Still checking username availability...');
      return;
    }
    
    const savingToast = toast.loading('💾 Saving profile...');
    
    try {
      const payload: Record<string, any> = {
        username: editData.username?.trim() || null,
        bio: editData.bio?.trim() || null,
        location: editData.userlocation?.trim() || null,
        pronouns: editData.pronouns?.trim() || null,
        twitterUrl: editData.twitterurl?.trim() || null,
        instagramUrl: editData.instagramurl?.trim() || null,
        youtubeUrl: editData.youtubeurl?.trim() || null,
        tiktokUrl: editData.tiktokurl?.trim() || null,
        letterboxdUrl: editData.letterboxdurl?.trim() || null,
        imdbUrl: editData.imdburl?.trim() || null,
        website: editData.website?.trim() || null,
        favoriteHeroSlug: favoriteHero || null,
        favoriteMovieSlug: favoriteMovie || null,
        themeColor: themeColor,
        statusMessage: statusMessage?.trim() || null,
        statusEmoji: statusEmoji || '🎬',
        privacySettings: privacySettings,
      };

      const res = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Update failed');
      }

      const profileRes = await fetch('/api/profile/me');
      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile(data.profile);
      }

      const badgesRes = await fetch('/api/profile/badges');
      if (badgesRes.ok) {
        const data = await badgesRes.json();
        setUserBadges(data.badges || []);
      }

      setShowEditModal(false);
      toast.success('✨ Profile updated successfully!', { id: savingToast, duration: 3000 });
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('❌ ' + (error.message || 'Failed to update profile'), { id: savingToast });
    }
  };

  // Pin/Unpin tier list
  const handlePinTierList = async (tierListId: string) => {
    if (!user) return;
    
    try {
      if (pinnedTierList?.id === tierListId) {
        // Unpin
        await fetch('/api/profile/unpin-tier-list', { method: 'POST' });
        setPinnedTierList(null);
        toast.success('📌 Tier list unpinned');
      } else {
        // Pin
        const res = await fetch('/api/profile/pin-tier-list', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tierListId }),
        });

        if (!res.ok) throw new Error('Pin failed');

        const data = await res.json();
        setPinnedTierList(data.tierList);
        toast.success('📌 Tier list pinned to profile');
      }
    } catch (error) {
      console.error('Pin error:', error);
      toast.error('Failed to pin tier list');
    }
  };

  // Load Followers
  const loadFollowers = async () => {
    if (!user) return;
    
    const res = await fetch('/api/profile/followers');
    if (res.ok) {
      const data = await res.json();
      setFollowersList(data.followers || []);
    }
  };

  // Load Following
  const loadFollowing = async () => {
    if (!user) return;
    
    const res = await fetch('/api/profile/following');
    if (res.ok) {
      const data = await res.json();
      setFollowingList(data.following || []);
    }
  };
  
  // Follow/Unfollow from modal
  const handleFollowToggle = async (targetUserId: string) => {
    if (!user) return;
    
    try {
      const isFollowing = followingList.some(f => f.id === targetUserId);
      
      const res = await fetch('/api/profile/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId }),
      });

      if (!res.ok) throw new Error('Follow toggle failed');

      const data = await res.json();
      
      if (data.action === 'unfollowed') {
        setFollowingList(prev => prev.filter(f => f.id !== targetUserId));
        setFollowingCount(prev => prev - 1);
        toast.success('👋 Unfollowed');
      } else {
        // Reload following list
        loadFollowing();
        setFollowingCount(prev => prev + 1);
        toast.success('✨ Following!');
      }
    } catch (error) {
      console.error('Follow toggle error:', error);
      toast.error('Failed to toggle follow');
    }
  };

  // Mark notification as read
  const markNotificationRead = async (id: string) => {
    await fetch('/api/notifications/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Delete Account Handler
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    
    setDeleting(true);
    try {
      const res = await fetch('/api/profile/delete', {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete account');
      }

      await signOut({ callbackUrl: '/' });
    } catch (err: any) {
      console.error('Delete account error:', err);
      toast.error(`Failed to delete account: ${err.message || 'Unknown error'}`);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white text-2xl font-bold"
        >
          🎬 Loading profile...
        </motion.div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">😞 Profile not found</div>
      </div>
    );
  }

  const avatarUrl = profile.avatarUrl || profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&size=200&background=C0C0C0&color=000&bold=true`;
  const bannerUrl = profile.bannerUrl || profile.banner_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920';
  const joinDate = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';

  // Filter followers/following by search
  const filteredFollowers = followersList.filter(f => 
    f.username.toLowerCase().includes(followSearchQuery.toLowerCase())
  );
  const filteredFollowing = followingList.filter(f => 
    f.username.toLowerCase().includes(followSearchQuery.toLowerCase())
  );

  return (
    <main className="bg-black min-h-screen" style={{ '--theme-color': themeColor } as any}>
      <Toaster position="top-center" />

      {/* Header - CINEMA SILVER */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/[0.06]">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button 
                onClick={() => router.back()} 
                whileHover={{ x: -4 }}
                className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden md:inline text-sm font-bold">← Back</span>
              </motion.button>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/" className="text-2xl font-black text-white hover:scale-105 transition-transform drop-shadow-lg">
                  TFi<span className="text-white/80">verse</span>
                </Link>
              </motion.div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications Bell */}
              <div className="relative">
                <motion.button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  whileHover={{ scale: 1.1 }}
                  className="relative text-white/70 hover:text-white font-bold transition-colors"
                  title="🔔 Notifications"
                >
                  <FaBell size={20} />
                  {unreadCount > 0 && (
                    <motion.span 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </motion.button>
                
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-12 w-80 bg-black/95 border border-white/[0.06] backdrop-blur-xl rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50"
                  >
                    <div className="p-4 border-b border-white/[0.06]">
                      <h3 className="font-bold text-white">🔔 Notifications</h3>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-white/50">
                        📭 No notifications yet
                      </div>
                    ) : (
                      <div className="divide-y divide-white/[0.06]">
                        {notifications.map((notif) => (
                          <motion.div 
                            key={notif.id}
                            whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                            className={`p-4 cursor-pointer transition-colors ${!notif.read ? 'bg-white/[0.05]' : ''}`}
                            onClick={() => {
                              markNotificationRead(notif.id);
                              if (notif.link) router.push(notif.link);
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">
                                {notif.type === 'new_follower' && '👤'}
                                {notif.type === 'tier_list_like' && '❤️'}
                                {notif.type === 'review_like' && '👍'}
                                {notif.type === 'badge_earned' && '🏆'}
                                {notif.type === 'profile_view_milestone' && '👁️'}
                              </div>
                              <div className="flex-1">
                                <p className="text-white font-semibold text-sm">{notif.title}</p>
                                <p className="text-white/60 text-xs mt-1">{notif.message}</p>
                                <p className="text-white/40 text-xs mt-1">
                                  {new Date(notif.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              {!notif.read && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Admin Button */}
              {isAdmin && (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all shadow-lg border border-white/[0.1]"
                    title="👑 Admin Panel"
                  >
                    <FaCrown size={16} />
                    <span className="text-sm">Admin</span>
                  </Link>
                </motion.div>
              )}

              <motion.button 
                onClick={() => setShowShareModal(true)} 
                whileHover={{ scale: 1.05 }}
                className="hidden md:flex items-center gap-2 text-white/70 hover:text-white font-bold text-sm transition-colors"
                title="📤 Share Profile"
              >
                <FaShareAlt size={16} /><span>Share</span>
              </motion.button>
              <motion.button 
                onClick={handleExportData} 
                whileHover={{ scale: 1.05 }}
                className="hidden md:flex items-center gap-2 text-white/70 hover:text-white font-bold text-sm transition-colors"
                title="💾 Export Data"
              >
                <FaDownload size={16} /><span>Export</span>
              </motion.button>
              <motion.button 
                onClick={handleCopyLink} 
                whileHover={{ scale: 1.05 }}
                className="hidden md:flex items-center gap-2 text-white/70 hover:text-white font-bold text-sm transition-colors"
                title="🔗 Copy Link"
              >
                <FaLink size={16} /><span>{copied ? '✅ Copied!' : 'Copy'}</span>
              </motion.button>
              <motion.button 
                onClick={handleSignOut} 
                whileHover={{ scale: 1.05 }}
                className="hidden md:flex items-center gap-2 text-white/70 hover:text-white font-bold text-sm transition-colors"
                title="👋 Sign Out"
              >
                <FaSignOutAlt size={16} /><span>Sign Out</span>
              </motion.button>
              <motion.img
                whileHover={{ scale: 1.1 }}
                src={avatarUrl.replace('size=200', 'size=40')}
                alt={profile.username}
                className="w-10 h-10 rounded-full ring-2 ring-white/[0.2] hover:ring-white/[0.4] transition-all cursor-pointer"
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16"></div>

      {/* Hero Banner - CINEMA SILVER */}
      <section className="relative overflow-hidden">
        <div className="relative h-[500px]">
          <div className="relative h-[500px] overflow-hidden bg-gradient-to-r from-white/[0.05] to-white/[0.02]">
            <img 
              src={bannerUrl}
              alt="📸 Banner" 
              className="w-full h-full object-cover opacity-60 hover:opacity-70 transition-opacity duration-300"
              style={{ imageRendering: 'auto' }}
              loading="eager"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black" />
          
          {/* Upload Banner Buttons */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            {bannerFile && (
              <motion.button 
                onClick={handleBannerUpload} 
                disabled={uploading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 text-sm flex items-center gap-2 shadow-lg"
              >
                {uploading && uploadType === 'banner' ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="rounded-full h-4 w-4 border-2 border-black border-t-transparent"
                    />
                    {uploadProgress}%
                  </>
                ) : (
                  <>📤 Upload Banner</>
                )}
              </motion.button>
            )}
            <label className="px-4 py-2 bg-black/60 backdrop-blur-md text-white font-bold rounded-lg hover:bg-black/80 transition-all cursor-pointer flex items-center gap-2 border border-white/[0.2] hover:border-white/[0.4]">
              <FaCamera size={16} /><span className="text-sm">🖼️ Change Banner</span>
              <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
            </label>
          </div>
        </div>

       {/* Avatar + Profile Info - DISCORD STYLE MINIMAL */}
<div className="relative z-10 container mx-auto px-4 md:px-8 -mt-32">
  <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
    
    {/* AVATAR SECTION - DISCORD STYLE */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="relative group flex-shrink-0"
    >
      <div className="relative w-48 h-48">
        {/* Perfect Circle Avatar */}
        <img
          src={avatarUrl}
          alt={profile.username}
          className="w-full h-full rounded-full border-4 border-black shadow-lg object-cover relative z-10"
          style={{ imageRendering: 'auto' }}
          loading="eager"
        />

        {/* Edit Button - BOTTOM LEFT (ATTACHED) */}
        <label className="absolute bottom-0 left-0 w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg border-4 border-black hover:shadow-xl transition-all z-30 hover:scale-110">
          <FaEdit className="text-black" size={18} />
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </label>

        {/* Online Status - BOTTOM RIGHT (ATTACHED) */}
        {/* <div className="absolute bottom-0 right-0 w-6 h-6 bg-white border-4 border-black rounded-full z-20 shadow-lg" /> */}
        
        {/* Upload Button - BELOW AVATAR */}
        {avatarFile && (
          <motion.button
            onClick={handleAvatarUpload}
            disabled={uploading}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black font-bold rounded-lg text-xs shadow-lg z-20 hover:shadow-xl transition-all whitespace-nowrap"
          >
            {uploading ? `📤 ${uploadProgress}%` : '📤 Upload Avatar'}
          </motion.button>
        )}
      </div>
    </motion.div>

    {/* PROFILE INFO - COMPACT */}
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="flex-1 pt-4"
    >
      {/* Username + Badges */}
      <div className="mb-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-5xl font-black text-white">
            {profile.username}
          </h1>
          {computedBadges && computedBadges.length > 0 && (
            <div className="flex items-center gap-1">
              {computedBadges.slice(0, 3).map((b, i) => (
                <motion.div key={`${b.badge_id}-${i}`} whileHover={{ scale: 1.15 }}>
                  <Badge badge={b} size={20} showTooltip />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-3 text-white/70 text-sm mb-3 flex-wrap">
        <span>@{(profile.username || '').toLowerCase().replace(/\s+/g, '')}</span>
        {profile.pronouns && <span>•</span>}
        {profile.pronouns && <span>{profile.pronouns}</span>}
        {profile.location && <span>📍 {profile.location}</span>}
        <span>📅 {joinDate}</span>
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="text-white/80 text-sm mb-4 italic max-w-2xl">
          "{profile.bio}"
        </p>
      )}

      {/* Favorite Hero & Movie */}
      {(profile?.favoriteHeroSlug || profile?.favoriteMovieSlug) && (
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {profile?.favoriteHeroSlug && favoriteHeroData && (
            <Link 
              href={`/hero/${favoriteHeroData.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white/80 hover:text-white text-xs transition-all"
            >
              <span>💖</span>
              <span>{favoriteHeroData.name}</span>
            </Link>
          )}
          {profile?.favoriteMovieSlug && favoriteMovieData && (
            <Link 
              href={`/movie/${profile.favoriteMovieSlug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white/80 hover:text-white text-xs transition-all"
            >
              <span>🎬</span>
              <span>{favoriteMovieData.title}</span>
            </Link>
          )}
        </div>
      )}

      {/* Followers & Following */}
      <div className="flex items-center gap-3 text-white/70 text-sm mb-4">
        <button onClick={() => { loadFollowers(); setShowFollowersModal(true); }} className="hover:text-white transition-colors">
          <span className="font-bold text-white">{followersCount}</span> Followers
        </button>
        <span>•</span>
        <button onClick={() => { loadFollowing(); setShowFollowingModal(true); }} className="hover:text-white transition-colors">
          <span className="font-bold text-white">{followingCount}</span> Following
        </button>
      </div>

      {/* Social Icons */}
      <div className="flex gap-3 mb-4">
        {(profile.twitterUrl || profile.twitter_url) && (
          <a href={profile.twitterUrl || profile.twitter_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
            <FaTwitter size={16} />
          </a>
        )}
        {(profile.instagramUrl || profile.instagram_url) && (
          <a href={profile.instagramUrl || profile.instagram_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
            <FaInstagram size={16} />
          </a>
        )}
        {(profile.youtubeUrl || profile.youtube_url) && (
          <a href={profile.youtubeUrl || profile.youtube_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
            <FaYoutube size={16} />
          </a>
        )}
        {(profile.tiktokUrl || profile.tiktok_url) && (
          <a href={profile.tiktokUrl || profile.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
            <FaTiktok size={16} />
          </a>
        )}
        {(profile.letterboxdUrl || profile.letterboxd_url) && (
          <a href={profile.letterboxdUrl || profile.letterboxd_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
            <SiLetterboxd size={16} />
          </a>
        )}
        {(profile.imdbUrl || profile.imdb_url) && (
          <a href={profile.imdbUrl || profile.imdb_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
            <FaImdb size={16} />
          </a>
        )}
        {profile.website && (
          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
            <FaGlobe size={16} />
          </a>
        )}
      </div>

      {/* Buttons + Stats - COMPACT ROW */}
      

<div className="flex items-center gap-6 flex-wrap mb-8">
  {/* Buttons */}
  <motion.button
    onClick={() => setShowEditModal(true)}
    whileHover={{ scale: 1.05 }}
    className="px-6 py-2.5 bg-white text-black font-bold rounded-lg text-sm hover:shadow-lg transition-all"
  >
    Edit Profile
  </motion.button>

  {profile?.username && (
    <Link
      href={`/u/${encodeURIComponent(profile.username)}`}
      className="px-6 py-2.5 border border-white/30 text-white font-bold rounded-lg text-sm hover:bg-white/10 transition-all"
    >
      View Profile
    </Link>
  )}

  {/* Stats Inline */}
  <div className="flex items-center gap-3 text-white/70 text-xs ml-auto">
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
      {/* Completeness */}
      {profileCompleteness < 100 && (
        <div className="mb-4">
          <CompletenessBar percent={profileCompleteness} />
        </div>
      )}
    </motion.div>
  </div>
</div>

  </section>
  
  

  {/* Content Sections */}
  <section className="container mx-auto px-4 md:px-8 py-12 max-w-7xl">
    <div className="space-y-12">
      {/* PINNED TIER LIST - CINEMA SILVER */}
      {pinnedTierList && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <FaThumbtack className="text-white/80" size={24} />
            <h2 className="text-3xl font-black text-white">📌 Pinned Tier List</h2>
          </div>
          <Link 
            href={`/tier-list/${pinnedTierList.id}`}
            className="group relative bg-white/5 hover:bg-white/10 border border-white/[0.1] hover:border-white/[0.2] rounded-2xl p-8 transition-all hover:scale-[1.02] block"
          >
            <div className="absolute top-4 right-4">
              <FaThumbtack className="text-white/60 text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-white group-hover:text-white/90 transition-colors mb-4">
              {pinnedTierList.title}
            </h3>
            <div className="flex items-center gap-6 text-white/60 text-sm">
              <span className="flex items-center gap-2">
                <FaHeart className="text-white/40" /> ❤️ {pinnedTierList.likes || 0} likes
              </span>
              <span className="flex items-center gap-2">
                <FaEye className="text-white/40" /> 👁️ {pinnedTierList.views || 0} views
              </span>
              <span className="ml-auto">
                📅 {new Date(pinnedTierList.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </Link>
        </motion.section>
      )}
      
      {/* TIER LISTS SECTION */}
      <TierListsSection tierLists={tierLists} pinnedId={pinnedTierList?.id} onPin={handlePinTierList} />
      
      <ActivityTimeline activities={activities} />
      <WatchlistSection watchlist={watchlist} totalCount={derivedCounts.watchlist} />
      <ReviewsSection reviews={userReviews} />
      <WatchedSection watchedMovies={watchedMovies} />

      {/* MEMES SECTION - CINEMA SILVER */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <span className="text-4xl">😂</span> My Memes
          </h2>
        </div>

        {/* Tabs - CINEMA SILVER */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <motion.button
            onClick={() => setMemesTab('uploaded')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-xl font-bold transition ${
              memesTab === 'uploaded'
                ? 'bg-white text-black'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            📤 Uploaded ({uploadedMemes.length})
          </motion.button>
          <motion.button
            onClick={() => setMemesTab('liked')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-xl font-bold transition ${
              memesTab === 'liked'
                ? 'bg-white text-black'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            ❤️ Liked ({likedMemes.length})
          </motion.button>
          <motion.button
            onClick={() => setMemesTab('bookmarked')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-xl font-bold transition ${
              memesTab === 'bookmarked'
                ? 'bg-white text-black'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            📚 Bookmarked ({bookmarkedMemes.length})
          </motion.button>
        </div>

        {/* Memes Horizontal Scroll */}
        {memesLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse flex-shrink-0 w-[280px]">
                <div className="aspect-square bg-white/5 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (memesTab === 'uploaded' ? uploadedMemes : memesTab === 'liked' ? likedMemes : bookmarkedMemes).length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/[0.1]">
            <div className="text-6xl mb-4">😢</div>
            <p className="text-white/70 text-lg">
              {memesTab === 'uploaded' ? 'No memes uploaded yet 📸' :
               memesTab === 'liked' ? 'No memes liked yet 💔' :
               'No memes bookmarked yet 📚'}
            </p>
            <Link href="/memes" className="mt-4 inline-block px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition">
              🎬 Explore Memes
            </Link>
          </div>
        ) : (
          <HorizontalScroller ariaLabel="😂 Memes">
            {(memesTab === 'uploaded' ? uploadedMemes : memesTab === 'liked' ? likedMemes : bookmarkedMemes).map((meme: any) => (
              <div key={meme.id} className="w-[280px] flex-shrink-0 snap-start">
                <Link 
                  href={`/memes/${meme.id}`}
                  className="group relative block rounded-2xl overflow-hidden border border-white/[0.1] hover:border-white/[0.3] transition-all hover:scale-105"
                >
                  <div className="aspect-square relative">
                    <img
                      src={meme.image_url}
                      alt={meme.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                    
                    {/* Status Badge */}
                    {memesTab === 'uploaded' && (
                      <div className="absolute top-3 right-3">
                        {meme.status === 'pending' && (
                          <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">
                            ⏳ Pending
                          </span>
                        )}
                        {meme.status === 'approved' && (
                          <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">
                            ✅ Approved
                          </span>
                        )}
                        {meme.status === 'rejected' && (
                          <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">
                            ❌ Rejected
                          </span>
                        )}
                      </div>
                    )}

                    {/* Delete Button */}
                    {memesTab === 'uploaded' && (
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          deleteMeme(meme.id);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-3 left-3 p-2 bg-white text-black rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-white/90"
                      >
                        <FaTrash size={14} />
                      </motion.button>
                    )}
                  </div>
                  
                  <div className="p-4 bg-black">
                    <h3 className="text-white font-bold line-clamp-2 mb-2 min-h-[3rem]">
                      {meme.title}
                    </h3>
                    <div className="flex items-center gap-4 text-white/60 text-sm">
                      <span className="flex items-center gap-1">
                        ❤️ {meme.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        👁️ {meme.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        📤 {meme.shares || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </HorizontalScroller>
        )}
      </motion.section>
    </div>
  </section>

      {/* Danger Zone - CINEMA SILVER */}
<section className="container mx-auto px-4 md:px-8 py-12 max-w-7xl">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="p-6 bg-white/5 rounded-xl border border-white/[0.1] hover:border-white/[0.2] transition-all"
  >
    <h2 className="text-2xl font-bold text-white/80 mb-2 flex items-center gap-3">
      <span className="text-3xl">⚠️</span>
      <span>Danger Zone</span>
    </h2>
    <p className="text-white/60 mb-4">
      Once you delete your account, there is no going back. All your data will be permanently removed. 🗑️
    </p>
    <motion.button
      onClick={() => setShowDeleteModal(true)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-6 py-3 bg-white text-black hover:bg-white/90 font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg"
    >
      <FaTrash />
      🗑️ Delete My Account
    </motion.button>
  </motion.div>
</section>


      {/* FOLLOWERS MODAL - CINEMA SILVER */}
      <AnimatePresence>
        {showFollowersModal && (
          <ModalShell onClose={() => { setShowFollowersModal(false); setFollowSearchQuery(''); }} title={`👥 Followers (${followersCount})`}>
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="text"
                  placeholder="🔍 Search followers..."
                  value={followSearchQuery}
                  onChange={(e) => setFollowSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:border-white/[0.3] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredFollowers.length === 0 ? (
                <p className="text-white/60 text-center py-8">
                  {followSearchQuery ? '😢 No followers found' : '👻 No followers yet'}
                </p>
              ) : (
                filteredFollowers.map((follower: any) => (
                  <motion.div 
                    key={follower.id} 
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <Link href={`/u/${follower.username}`}>
                      <img 
                        src={follower.avatarUrl || follower.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(follower.username)}&size=80`}
                        alt={follower.username}
                        className="w-12 h-12 rounded-full border border-white/[0.2] hover:border-white/[0.4] transition-all"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link href={`/u/${follower.username}`} className="text-white font-bold hover:text-white/80 transition-colors">
                        {follower.username}
                      </Link>
                      {follower.bio && <p className="text-white/60 text-sm line-clamp-1">📝 {follower.bio}</p>}
                    </div>
                    {follower.id !== user?.id && (
                      <motion.button
                        onClick={() => handleFollowToggle(follower.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                          followingList.some(f => f.id === follower.id)
                            ? 'bg-white/20 text-white hover:bg-white/30'
                            : 'bg-white text-black hover:bg-white/90'
                        }`}
                      >
                        {followingList.some(f => f.id === follower.id) ? '✅ Following' : '➕ Follow'}
                      </motion.button>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* FOLLOWING MODAL - CINEMA SILVER */}
      <AnimatePresence>
        {showFollowingModal && (
          <ModalShell onClose={() => { setShowFollowingModal(false); setFollowSearchQuery(''); }} title={`🔗 Following (${followingCount})`}>
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="text"
                  placeholder="🔍 Search following..."
                  value={followSearchQuery}
                  onChange={(e) => setFollowSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:border-white/[0.3] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredFollowing.length === 0 ? (
                <p className="text-white/60 text-center py-8">
                  {followSearchQuery ? '😢 No users found' : '🚫 Not following anyone yet'}
                </p>
              ) : (
                filteredFollowing.map((following: any) => (
                  <motion.div 
                    key={following.id} 
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <Link href={`/u/${following.username}`}>
                      <img 
                        src={following.avatarUrl || following.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(following.username)}&size=80`}
                        alt={following.username}
                        className="w-12 h-12 rounded-full border border-white/[0.2] hover:border-white/[0.4] transition-all"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link href={`/u/${following.username}`} className="text-white font-bold hover:text-white/80 transition-colors">
                        {following.username}
                      </Link>
                      {following.bio && <p className="text-white/60 text-sm line-clamp-1">📝 {following.bio}</p>}
                    </div>
                    <motion.button
                      onClick={() => handleFollowToggle(following.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-lg font-bold text-sm bg-white/20 text-white hover:bg-white/30 transition-all"
                    >
                      ✅ Following
                    </motion.button>
                  </motion.div>
                ))
              )}
            </div>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* SHARE MODAL - CINEMA SILVER */}
      <AnimatePresence>
        {showShareModal && (
          <ModalShell onClose={() => setShowShareModal(false)} title="📤 Share Profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Preview Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl overflow-hidden border border-white/[0.1] bg-white/5"
              >
                <div className="relative h-28 w-full bg-gradient-to-r from-white/10 to-white/5">
                  <img 
                    src={bannerUrl} 
                    alt="📸 Banner" 
                    className="w-full h-full object-cover opacity-60"
                    style={{ imageRendering: 'auto' }}
                    loading="eager"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden border border-white/[0.1]">
                      <img
                        src={avatarUrl}
                        alt={profile.username}
                        className="w-full h-full object-cover"
                        style={{ imageRendering: 'auto' }}
                        loading="eager"
                      />
                    </div>
                    <div className="font-semibold text-white">{profile.username}</div>
                  </div>
                  {profile.bio && <div className="mt-3 text-white/70 text-sm line-clamp-2">"{profile.bio}"</div>}
                  <div className="mt-3 text-xs text-white/60 break-all">🔗 {profileLink}</div>
                </div>
              </motion.div>

              {/* QR Code */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-white/[0.1] bg-white/5 p-4 flex flex-col items-center justify-center"
              >
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(profileLink)}`}
                  alt="QR Code"
                  className="h-56 w-56 rounded-xl border border-white/[0.1] bg-black p-2"
                />
                <div className="mt-4 grid grid-cols-2 gap-2 w-full">
                  <motion.button 
                    onClick={handleCopyLink}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/5 hover:bg-white/10 px-3 py-2 text-white transition-all"
                  >
                    {copied ? <FaCheck /> : <FaLink />}
                    {copied ? '✅ Copied!' : '🔗 Copy'}
                  </motion.button>
                  <motion.button
                    onClick={async () => {
                      if (navigator.share) {
                        try {
                          await navigator.share({
                            title: `${profile.username} on TFiverse`,
                            text: profile.bio || 'Check out this profile',
                            url: profileLink,
                          });
                        } catch {}
                      } else {
                        handleCopyLink();
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/5 hover:bg-white/10 px-3 py-2 text-white transition-all"
                  >
                    <FaShareAlt /> 📤 Share
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* DELETE ACCOUNT MODAL - CINEMA SILVER */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm grid place-items-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-black border border-white/[0.1] rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">❌ Delete Account?</h3>
                <p className="text-white/70 text-sm">
                  This action cannot be undone. All your data will be permanently deleted forever. ☠️
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-white/80 text-sm font-bold mb-2">
                  Type <span className="text-white/60 font-mono bg-white/10 px-2 py-1 rounded">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE here..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:border-white/[0.3] focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText('');
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-lg transition-all"
                >
                  👈 Cancel
                </motion.button>
                <motion.button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE' || deleting}
                  whileHover={deleteConfirmText === 'DELETE' && !deleting ? { scale: 1.05 } : {}}
                  whileTap={deleteConfirmText === 'DELETE' && !deleting ? { scale: 0.95 } : {}}
                  className="flex-1 px-4 py-3 bg-white text-black disabled:bg-white/50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all"
                >
                  {deleting ? '⏳ Deleting...' : '🗑️ Delete Forever'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT PROFILE MODAL - CINEMA SILVER */}
      <AnimatePresence>
        {showEditModal && (
          <ModalShell onClose={() => setShowEditModal(false)} title="✏️ Edit Profile">
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Username */}
              <div>
                <label className="block text-white/80 text-sm font-bold mb-2">
                  👤 Username {checkingUsername && <span className="text-yellow-400 text-xs ml-2">⏳ checking...</span>}
                </label>
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none ${
                    usernameError ? 'border-white/[0.1]' : 'border-white/[0.1] focus:border-white/[0.3]'
                  }`}
                  placeholder="Enter your username"
                  maxLength={USERNAME_MAX}
                />
                <div className="flex items-center justify-between mt-1">
                  {usernameError && <p className="text-white/60 text-xs">❌ {usernameError}</p>}
                  <p className="text-white/40 text-xs ml-auto">{editData.username.length}/{USERNAME_MAX}</p>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-white/80 text-sm font-bold mb-2">📝 Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  rows={4}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none resize-none ${
                    bioError ? 'border-white/[0.1]' : 'border-white/[0.1] focus:border-white/[0.3]'
                  }`}
                  placeholder="Tell us about yourself..."
                  maxLength={BIO_MAX}
                />
                <div className="flex items-center justify-between mt-1">
                  {bioError && <p className="text-white/60 text-xs">ℹ️ {bioError}</p>}
                  <p className={`text-xs ml-auto ${editData.bio.length > BIO_MAX - 50 ? 'text-white/60' : 'text-white/40'}`}>
                    {editData.bio.length}/{BIO_MAX}
                  </p>
                </div>
              </div>
              
              {/* Status Message - CINEMA SILVER */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  🎭 Status Message
                </label>
                <div className="flex gap-2">
                  <select
                    value={statusEmoji}
                    onChange={(e) => setStatusEmoji(e.target.value)}
                    className="w-16 px-3 py-2 bg-white/5 border border-white/[0.1] rounded-lg text-white focus:outline-none focus:border-white/[0.3]"
                  >
                    <option value="🎬">🎬</option>
                    <option value="😊">😊</option>
                    <option value="🎮">🎮</option>
                    <option value="🎨">🎨</option>
                    <option value="🔥">🔥</option>
                    <option value="⚡">⚡</option>
                    <option value="✨">✨</option>
                    <option value="🎉">🎉</option>
                    <option value="😴">😴</option>
                    <option value="🍕">🍕</option>
                    <option value="☕">☕</option>
                    <option value="🌟">🌟</option>
                  </select>
                  
                  <input
                    type="text"
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    placeholder="Like sugar on my tongue..."
                    maxLength={150}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:border-white/[0.3] focus:outline-none"
                  />
                </div>
              </div>

              {/* Favorite Hero */}
              <div>
                <label className="block text-white/80 text-sm font-bold mb-2">💖 Favorite Hero</label>
                <select
                  value={favoriteHero}
                  onChange={(e) => setFavoriteHero(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white focus:border-white/[0.3] focus:outline-none"
                >
                  <option value="">None</option>
                  {(heroesData as any[]).map((hero: any) => (
                    <option key={hero.slug} value={hero.slug}>{hero.name}</option>
                  ))}
                </select>
              </div>

              {/* Favorite Movie Autocomplete */}
              <div className="movie-search-container">
                <label className="block text-white/80 text-sm font-bold mb-2">
                  🎬 Favorite Movie
                </label>
                
                {/* Movie Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={movieSearchQuery}
                    onChange={(e) => setMovieSearchQuery(e.target.value)}
                    onFocus={() => setShowMovieDropdown(true)}
                    placeholder="🔍 Search for a movie..."
                    className="w-full px-4 py-2 bg-white/5 border border-white/[0.1] rounded-lg text-white focus:outline-none focus:border-white/[0.3] pr-10"
                  />
                  {movieSearchQuery && (
                    <motion.button
                      onClick={() => {
                        setMovieSearchQuery('');
                        setFavoriteMovie('');
                      }}
                      whileHover={{ scale: 1.2 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      <FaTimes />
                    </motion.button>
                  )}
                </div>

                {/* Current Selection */}
                {favoriteMovie && !movieSearchQuery && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-3 p-3 bg-white/5 border border-white/[0.1] rounded-lg flex items-center gap-3"
                  >
                    <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0 bg-white/5">
                      {selectedMovieData?.poster ? (
                        <img 
                          src={selectedMovieData.poster} 
                          alt={selectedMovieData.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                          🎬
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate">
                        {selectedMovieData?.title || favoriteMovie.replace(/-/g, ' ')}
                      </p>
                      {selectedMovieData?.year && (
                        <p className="text-white/60 text-sm">📅 {selectedMovieData.year}</p>
                      )}
                    </div>
                    <motion.button
                      onClick={() => {
                        setFavoriteMovie('');
                        setSelectedMovieData(null);
                      }}
                      whileHover={{ scale: 1.2 }}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <FaTrash size={16} />
                    </motion.button>
                  </motion.div>
                )}

                {/* Dropdown Results */}
                {showMovieDropdown && movieSearchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 max-h-96 overflow-y-auto bg-black border border-white/[0.1] rounded-lg shadow-2xl"
                  >
                    {filteredMovies.length > 0 ? (
                      <div className="p-2 space-y-1">
                        {filteredMovies.map((movie: any) => (
                          <motion.button
                            key={movie.slug}
                            onClick={() => {
                              setFavoriteMovie(movie.slug);
                              setSelectedMovieData(movie);
                              setMovieSearchQuery('');
                              setShowMovieDropdown(false);
                            }}
                            whileHover={{ x: 4 }}
                            className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-all text-left"
                          >
                            <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0 bg-white/5">
                              {movie.poster ? (
                                <img 
                                  src={movie.poster} 
                                  alt={movie.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20">
                                  🎬
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-semibold truncate">{movie.title}</p>
                              <p className="text-white/60 text-sm">
                                📅 {movie.year} • {movie.heroName || 'Unknown'}
                              </p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-white/40">
                        <p>😢 No movies found</p>
                        <p className="text-xs mt-1">Try a different search term</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Theme Color - CINEMA SILVER */}
              <div>
                <label className="block text-white/80 text-sm font-bold mb-2">🎨 Profile Theme Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-16 h-12 rounded-lg cursor-pointer border border-white/[0.1]"
                  />
                  <input
                    type="text"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white font-mono focus:border-white/[0.3] focus:outline-none"
                  />
                </div>
              </div>

              {/* Privacy Settings */}
              <div>
                <label className="block text-white/80 text-sm font-bold mb-3">🔒 Privacy Settings</label>
                <div className="space-y-3">
                  <motion.label whileHover={{ x: 4 }} className="flex items-center gap-3 cursor-pointer p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                    <input
                      type="checkbox"
                      checked={privacySettings.show_watchlist}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, show_watchlist: e.target.checked })}
                      className="w-5 h-5 rounded border-white/[0.2] accent-white"
                    />
                    <span className="text-white">📚 Show watchlist publicly</span>
                  </motion.label>
                  <motion.label whileHover={{ x: 4 }} className="flex items-center gap-3 cursor-pointer p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                    <input
                      type="checkbox"
                      checked={privacySettings.show_activity}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, show_activity: e.target.checked })}
                      className="w-5 h-5 rounded border-white/[0.2] accent-white"
                    />
                    <span className="text-white">📊 Show activity feed</span>
                  </motion.label>
                  <motion.label whileHover={{ x: 4 }} className="flex items-center gap-3 cursor-pointer p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                    <input
                      type="checkbox"
                      checked={privacySettings.show_followers}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, show_followers: e.target.checked })}
                      className="w-5 h-5 rounded border-white/[0.2] accent-white"
                    />
                    <span className="text-white">👥 Show followers/following counts</span>
                  </motion.label>
                  <motion.label whileHover={{ x: 4 }} className="flex items-center gap-3 cursor-pointer p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                    <input
                      type="checkbox"
                      checked={privacySettings.allow_dms}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, allow_dms: e.target.checked })}
                      className="w-5 h-5 rounded border-white/[0.2] accent-white"
                    />
                    <span className="text-white">💬 Allow direct messages</span>
                  </motion.label>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-white/80 text-sm font-bold mb-2">📍 Location</label>
                <input
                  type="text"
                  value={editData.userlocation}
                  onChange={(e) => setEditData({ ...editData, userlocation: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:border-white/[0.3] focus:outline-none"
                  placeholder="City, Country"
                />
              </div>

              {/* Pronouns */}
              <div>
                <label className="block text-white/80 text-sm font-bold mb-2">👋 Pronouns</label>
                <input
                  type="text"
                  value={editData.pronouns}
                  onChange={(e) => setEditData({ ...editData, pronouns: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:border-white/[0.3] focus:outline-none"
                  placeholder="he/him, she/her, they/them"
                />
              </div>

              {/* Social Links - CINEMA SILVER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-bold mb-2">𝕏 Twitter</label>
                  <input
                    type="url"
                    value={editData.twitterurl}
                    onChange={(e) => setEditData({ ...editData, twitterurl: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:border-white/[0.3] focus:outline-none"
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-bold mb-2">📷 Instagram</label>
                  <input
                    type="url"
                    value={editData.instagramurl}
                    onChange={(e) => setEditData({ ...editData, instagramurl: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:border-white/[0.3] focus:outline-none"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-bold mb-2">🎥 YouTube</label>
                  <input
                    type="url"
                    value={editData.youtubeurl}
                    onChange={(e) => setEditData({ ...editData, youtubeurl: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:border-white/[0.3] focus:outline-none"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-bold mb-2">🎵 TikTok</label>
                  <input
                    type="url"
                    value={editData.tiktokurl}
                    onChange={(e) => setEditData({ ...editData, tiktokurl: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:border-white/[0.3] focus:outline-none"
                    placeholder="https://tiktok.com/@..."
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-bold mb-2">📽️ Letterboxd</label>
                  <input
                    type="url"
                    value={editData.letterboxdurl}
                    onChange={(e) => setEditData({ ...editData, letterboxdurl: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:border-white/[0.3] focus:outline-none"
                    placeholder="https://letterboxd.com/..."
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-bold mb-2">🎬 IMDb</label>
                  <input
                    type="url"
                    value={editData.imdburl}
                    onChange={(e) => setEditData({ ...editData, imdburl: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:border-white/[0.3] focus:outline-none"
                    placeholder="https://imdb.com/..."
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-white/80 text-sm font-bold mb-2">🌐 Website</label>
                <input
                  type="url"
                  value={editData.website}
                  onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:border-white/[0.3] focus:outline-none"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              {/* Save Button */}
              <div className="flex gap-3 pt-4 border-t border-white/[0.1]">
                <motion.button
                  onClick={() => setShowEditModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-lg transition-all"
                >
                  👈 Cancel
                </motion.button>
                <motion.button
                  onClick={handleSaveProfile}
                  disabled={!!usernameError || !!bioError || checkingUsername}
                  whileHover={!usernameError && !bioError && !checkingUsername ? { scale: 1.05 } : {}}
                  whileTap={!usernameError && !bioError && !checkingUsername ? { scale: 0.95 } : {}}
                  className="flex-1 px-6 py-3 bg-white text-black disabled:bg-white/50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all"
                >
                  💾 Save Changes
                </motion.button>
              </div>
            </div>
          </ModalShell>
        )}
      </AnimatePresence>
    </main>
  );
}

/* TIER LISTS SECTION - CINEMA SILVER */
function TierListsSection({ tierLists, pinnedId, onPin }: { tierLists: any[]; pinnedId?: string; onPin: (id: string) => void; }) {
  if (!tierLists || tierLists.length === 0) {
    return (
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
          <FaLayerGroup className="text-white/60" /> 🏆 Tier Lists <span className="text-white/40 text-xl">0</span>
        </h2>
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/[0.1]">
          <FaTh className="text-white/20 text-6xl mx-auto mb-4" />
          <p className="text-white/60 mb-6">📭 No tier lists created yet</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/tier-lists/create" 
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-black hover:bg-white/90 font-bold transition-all shadow-lg"
            >
              <FaLayerGroup size={20} />
              <span>➕ Create Your First Tier List</span>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
        <FaLayerGroup className="text-white/60" /> 🏆 Tier Lists <span className="text-white/40 text-xl">{tierLists.length}</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tierLists.map((list: any, idx: number) => (
          <motion.div 
            key={list.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-white/5 hover:bg-white/10 border border-white/[0.1] hover:border-white/[0.2] rounded-xl p-6 transition-all hover:scale-105"
          >
            {/* Pin Button */}
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                onPin(list.id);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
                pinnedId === list.id
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
              }`}
              title={pinnedId === list.id ? '📌 Unpin from profile' : '📌 Pin to profile'}
            >
              <FaThumbtack size={16} />
            </motion.button>

            <Link href={`/tier-list/${list.id}`}>
              <div className="flex items-start justify-between mb-4 pr-8">
                <h3 className="text-xl font-bold text-white group-hover:text-white/90 transition-colors line-clamp-2">
                  {list.title}
                </h3>
                {list.isPublic && (
                  <span className="px-2 py-1 bg-white/10 text-white text-xs font-bold rounded-full whitespace-nowrap">
                    🌐 Public
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <span className="flex items-center gap-1">
                  <FaHeart className="text-white/40" /> ❤️ {list.likes || 0}
                </span>
                <span className="flex items-center gap-1">
                  <FaEye className="text-white/40" /> 👁️ {list.views || 0}
                </span>
                <span className="ml-auto text-xs">
                  📅 {new Date(list.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            href="/tier-lists/create" 
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-black hover:bg-white/90 font-bold transition-all shadow-lg"
          >
            <FaLayerGroup size={20} />
            <span>➕ Create New Tier List</span>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}


/* MODAL SHELL - CINEMA SILVER */
function ModalShell({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string; }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      onClick={onClose} 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 20 }} 
        onClick={(e) => e.stopPropagation()} 
        className="bg-black border border-white/[0.1] rounded-2xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.1]">
          <h3 className="text-xl md:text-2xl font-black text-white">{title}</h3>
          <motion.button 
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="text-white/60 hover:text-white transition-colors"
          >
            <FaTimes size={22} />
          </motion.button>
        </div>
        <div>{children}</div>
      </motion.div>
    </motion.div>
  );
}

/* COMPLETENESS BAR - CINEMA SILVER */
function CompletenessBar({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const isComplete = clamped === 100;
  const color = isComplete ? 'bg-white' : clamped >= 70 ? 'bg-white/80' : clamped >= 40 ? 'bg-white/60' : 'bg-white/40';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/[0.1] bg-white/5 p-4 hover:bg-white/[0.08] transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-white">📊 Profile Completeness</div>
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white font-bold"
        >
          {clamped}%
        </motion.div>
      </div>
      <div className="mt-3 h-3 w-full rounded-full bg-white/10 overflow-hidden relative">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${clamped}%` }} 
          transition={{ type: 'spring', stiffness: 90, damping: 20 }} 
          className={`h-full ${color} relative shadow-lg`}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="tfv-shimmer h-full w-1/3 opacity-30" />
          </div>
        </motion.div>
      </div>
      <style jsx global>{`
        .tfv-shimmer { 
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 100%); 
          animation: tfv-shimmer-move 1.8s infinite; 
        }
        @keyframes tfv-shimmer-move { 
          0% { transform: translateX(-150%); } 
          100% { transform: translateX(300%); } 
        }
      `}</style>
      <div className={`mt-3 text-sm font-medium ${isComplete ? 'text-white' : 'text-white/70'}`}>
        {isComplete ? '✅ Perfect! Profile looks complete.' : '🎯 Complete profile to unlock badges!'}
      </div>
    </motion.div>
  );
}

/* ACTIVITY TIMELINE - CINEMA SILVER */
function ActivityTimeline({ activities }: { activities: any[] }) {
  const iconFor = (type: string) =>
    type === 'review' ? <FaStar className="text-white" /> :
    type === 'watched' ? <FaEye className="text-white" /> :
    <FaBookmark className="text-white" />;

  const labelFor = (type: string) =>
    type === 'review' ? '✍️ Reviewed' :
    type === 'watched' ? '👁️ Watched' :
    '📚 Added to Watchlist';

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-white">
        <FaCalendar className="text-white/60" /> 📅 Activity
      </h2>
      {!activities || activities.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/[0.1]">
          <p className="text-white/60">📭 No recent activity</p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.1] rounded-xl border border-white/[0.1] bg-white/5 max-h-72 overflow-y-auto">
          {activities.map((a, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link 
                href={a.movieslug ? `/movie/${a.movieslug}` : '#'} 
                className="flex items-center gap-4 p-4 hover:bg-white/10 transition-all group"
              >
                <div className="h-10 w-10 grid place-items-center rounded-full bg-white/10 border border-white/[0.1] group-hover:border-white/[0.2] transition-all group-hover:scale-110">
                  {iconFor(a.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold truncate group-hover:text-white/90 transition-colors">
                    {labelFor(a.type)}
                    {a.movieslug ? ` • ${a.movieslug.replace(/-/g, ' ')}` : ''}
                  </div>
                  <div className="text-white/50 text-sm">
                    {a.type === 'review' && typeof a.rating === 'number' ? `⭐ Rating ${a.rating}/5 • ` : ''}
                    {a.date ? new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}
                  </div>
                </div>
                <svg className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}

/* WATCHLIST SECTION - CINEMA SILVER */
function WatchlistSection({ watchlist, totalCount }: { watchlist: any[]; totalCount: number; }) {
  const [moviesData, setMoviesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      if (!watchlist || watchlist.length === 0) { setLoading(false); return; }

      const promises = watchlist.slice(0, 20).map(async (item: any) => {
        let found: any = null;

        for (const hero of heroesData as any) {
          if (hero.movies) {
            const m = hero.movies.find((mm: any) => mm.slug === item.movieSlug);
            if (m) {
              let posterUrl = m?.poster || DEFAULT_POSTER;
              if (m.tmdbId) {
                try {
                  const tmdbData = await cachedJson(`https://api.themoviedb.org/3/movie/${m.tmdbId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
                  if (tmdbData?.poster_path) posterUrl = `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`;
                } catch {}
              }
              found = { ...m, poster: posterUrl, slug: item.movieSlug, year: m.year ?? 'Unknown' };
              break;
            }
          }
        }

        if (!found) {
          const tm = await searchMovieBySlug(item.movieSlug);
          if (tm) {
            found = tm;
          } else {
            found = {
              title: item.movieSlug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
              poster: DEFAULT_POSTER,
              slug: item.movieSlug,
              year: 'Unknown',
            };
          }
        }
        return found;
      });

      const results = await Promise.all(promises);
      setMoviesData(results.filter(Boolean));
      setLoading(false);
    }

    fetchMovies();
  }, [watchlist]);

  if (loading) {
    return (
      <section>
        <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
          <FaBookmark className="text-white/60" /> 📚 Watchlist
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4].map((n) => (
            <motion.div 
              key={n}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-[180px] h-[270px] bg-white/10 rounded-xl flex-shrink-0" 
            />
          ))}
        </div>
      </section>
    );
  }

  if (!moviesData || moviesData.length === 0) {
    return (
      <section>
        <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
          <FaBookmark className="text-white/60" /> 📚 Watchlist <span className="text-white/40 text-xl">0</span>
        </h2>
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/[0.1]">
          <FaBookmark className="text-white/20 text-6xl mx-auto mb-4" />
          <p className="text-white/60 mb-4">🎬 No movies in watchlist yet</p>
          <Link href="/movies" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.1] bg-white/5 hover:bg-white/10 text-white transition-all">
            🎯 Browse Movies
          </Link>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
        <FaBookmark className="text-white/60" /> 📚 Watchlist <span className="text-white/40 text-xl">{totalCount}</span>
      </h2>
      <HorizontalScroller ariaLabel="📚 watchlist">
        {moviesData.map((movie: any, index: number) => (
          <Link key={`${movie.slug}-${index}`} href={`/movie/${movie.slug}`} className="group relative flex-shrink-0 snap-start">
            <motion.div 
              whileHover={{ scale: 1.05, y: -4 }}
              className="relative w-[180px] h-[270px] rounded-xl overflow-hidden border-2 border-white/[0.1] group-hover:border-white/[0.3] transition-all shadow-xl"
            >
              <img
                src={movie.poster || DEFAULT_POSTER}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => ((e.target as HTMLImageElement).src = DEFAULT_POSTER)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
            <div className="p-4">
              <p className="text-white text-sm font-bold line-clamp-2 group-hover:text-white/90 transition-colors">{movie.title}</p>
              <p className="text-white/60 text-xs mt-1">📅 {movie.year}</p>
            </div>
          </Link>
        ))}
      </HorizontalScroller>
    </motion.section>
  );
}

/* REVIEWS SECTION - CINEMA SILVER */
function ReviewsSection({ reviews }: { reviews: any[] }) {
  const [reviewsWithMovies, setReviewsWithMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviewMovies() {
      if (!reviews || reviews.length === 0) { setLoading(false); return; }

      const results = await Promise.all(reviews.map(async (review: any) => {
        let movieData: any = null;

        for (const hero of heroesData as any) {
          if (hero.movies) {
            const m = hero.movies.find((mm: any) => mm.slug === review.movieSlug);
            if (m) {
              let posterUrl = m?.poster || DEFAULT_POSTER;
              if (m.tmdbId) {
                try {
                  const tmdbData = await cachedJson(`https://api.themoviedb.org/3/movie/${m.tmdbId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
                  if (tmdbData?.poster_path) posterUrl = `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`;
                } catch {}
              }
              movieData = { ...m, poster: posterUrl };
              break;
            }
          }
        }

        if (!movieData) {
          movieData = {
            title: review.movieSlug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            poster: DEFAULT_POSTER,
          };
        }

        return { ...review, movie: movieData };
      }));

      setReviewsWithMovies(results);
      setLoading(false);
    }

    fetchReviewMovies();
  }, [reviews]);

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-white">
          <FaPen className="text-white/60" /> ✍️ Reviews
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2].map((n) => (
            <motion.div 
              key={n}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-6 bg-white/5 rounded-xl h-32 w-full max-w-[320px]" 
            />
          ))}
        </div>
      </section>
    );
  }

  if (!reviewsWithMovies.length) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-white">
          <FaPen className="text-white/60" /> ✍️ Reviews <span className="text-white/40 text-xl">0</span>
        </h2>
        <div className="text-center py-16 bg-white/5 rounded-xl border border-white/[0.1]">
          <p className="text-white/60">📝 No reviews written yet</p>
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-white">
        <FaPen className="text-white/60" /> ✍️ Reviews <span className="text-white/40 text-xl">{reviewsWithMovies.length}</span>
      </h2>
      <HorizontalScroller ariaLabel="✍️ reviews">
        {reviewsWithMovies.map((review: any) => (
          <motion.div 
            key={review.id} 
            whileHover={{ scale: 1.05, y: -4 }}
            className="w-[320px] flex-shrink-0 snap-start p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/[0.1] hover:border-white/[0.2]"
          >
            <div className="flex gap-3">
              <Link href={`/movie/${review.movieSlug}`} className="flex-shrink-0">
                <img
                  src={review.movie.poster || DEFAULT_POSTER}
                  alt={review.movie.title}
                  className="w-20 h-28 rounded-lg object-cover border-2 border-white/[0.1] hover:border-white/[0.3] transition-all"
                  onError={(e) => ((e.target as HTMLImageElement).src = DEFAULT_POSTER)}
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-2">
                  <Link href={`/movie/${review.movieSlug}`} className="text-base font-bold hover:text-white/80 transition-colors truncate text-white">
                    {review.movie.title}
                  </Link>
                  <span className="ml-auto inline-flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < (review.rating || 0) ? 'text-white' : 'text-white/20'} 
                        size={14} 
                      />
                    ))}
                  </span>
                </div>
                <p className="text-white/70 text-sm line-clamp-3">{review.reviewText}</p>
                <p className="text-white/40 text-xs mt-2">
                  📅 {new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </HorizontalScroller>
    </motion.section>
  );
}

/* WATCHED SECTION - CINEMA SILVER */
function WatchedSection({ watchedMovies }: { watchedMovies: any[] }) {
  const [moviesData, setMoviesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      if (!watchedMovies || watchedMovies.length === 0) { setLoading(false); return; }

      const results = await Promise.all(watchedMovies.map(async (item: any) => {
        for (const hero of heroesData as any) {
          if (hero.movies) {
            const m = hero.movies.find((mm: any) => mm.slug === item.movieSlug);
            if (m) {
              let posterUrl = m?.poster || DEFAULT_POSTER;
              if (m.tmdbId) {
                try {
                  const tmdbData = await cachedJson(`https://api.themoviedb.org/3/movie/${m.tmdbId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
                  if (tmdbData?.poster_path) posterUrl = `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`;
                } catch {}
              }
              return { ...m, poster: posterUrl, slug: item.movieSlug, year: m.year ?? 'Unknown', watchedAt: item.watchedAt };
            }
          }
        }
        const tm = await searchMovieBySlug(item.movieSlug);
        if (tm) return { ...tm, watchedAt: item.watchedAt };
        return {
          title: item.movieSlug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          poster: DEFAULT_POSTER,
          slug: item.movieSlug,
          year: 'Unknown',
          watchedAt: item.watchedAt,
        };
      }));

      setMoviesData(results.filter(Boolean));
      setLoading(false);
    }

    fetchMovies();
  }, [watchedMovies]);

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-white">
          <FaEye className="text-white/60" /> 👁️ Watched
        </h2>
        <div className="flex gap-4 overflow-x-auto">
          {[1, 2, 3].map((n) => (
            <motion.div 
              key={n}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-[180px] h-[270px] bg-white/10 rounded-xl" 
            />
          ))}
        </div>
      </section>
    );
  }

  if (!moviesData.length) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-white">
          <FaEye className="text-white/60" /> 👁️ Watched <span className="text-white/40 text-xl">0</span>
        </h2>
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/[0.1]">
          <p className="text-white/60">🍿 No watched movies yet</p>
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-white">
        <FaEye className="text-white/60" /> 👁️ Watched <span className="text-white/40 text-xl">{moviesData.length}</span>
      </h2>
      <HorizontalScroller ariaLabel="👁️ watched">
        {moviesData.map((movie: any, idx: number) => (
          <Link key={`${movie.slug}-${idx}`} href={`/movie/${movie.slug}`} className="group relative flex-shrink-0 snap-start">
            <motion.div 
              whileHover={{ scale: 1.05, y: -4 }}
              className="relative w-[180px] h-[270px] rounded-xl overflow-hidden border-2 border-white/[0.1] group-hover:border-white/[0.3] transition-all shadow-xl"
            >
              <img
                src={movie.poster || DEFAULT_POSTER}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => ((e.target as HTMLImageElement).src = DEFAULT_POSTER)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
            <div className="p-4">
              <p className="text-white text-sm font-bold line-clamp-2 group-hover:text-white/90 transition-colors">{movie.title}</p>
              <p className="text-white/60 text-xs mt-1">
                📅 {movie.year}{movie.watchedAt ? ` • ${new Date(movie.watchedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
              </p>
            </div>
          </Link>
        ))}
      </HorizontalScroller>
    </motion.section>
  );
}

/* HORIZONTAL SCROLLER - CINEMA SILVER */
function HorizontalScroller({ children, ariaLabel }: { children: React.ReactNode; ariaLabel?: string }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  React.useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      {canScrollLeft && (
        <motion.button
          onClick={() => scroll('left')}
          whileHover={{ scale: 1.1, x: -4 }}
          whileTap={{ scale: 0.9 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
          aria-label="⬅️ Scroll left"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
        aria-label={ariaLabel}
      >
        {children}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <motion.button
          onClick={() => scroll('right')}
          whileHover={{ scale: 1.1, x: 4 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
          aria-label="➡️ Scroll right"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
