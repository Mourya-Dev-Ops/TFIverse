export const IMAGE_SOURCES = {
  backblazeb2: {
    name: 'Backblaze B2',
    baseUrl: process.env.NEXT_PUBLIC_B2_URL || 'https://f001.backblazeb2.com/file/tfiverse-storage',
    type: 'cloud',
    icon: '☁️',
  },
  pinterest: {
    name: 'Pinterest',
    baseUrl: 'https://i.pinimg.com',
    type: 'external',
    icon: '📌',
  },
  tmdb: {
    name: 'TMDB',
    baseUrl: 'https://image.tmdb.org/t/p/w500',
    type: 'external',
    icon: '🎬',
  },
  imgur: {
    name: 'Imgur',
    baseUrl: 'https://i.imgur.com',
    type: 'external',
    icon: '🖼️',
  },
  cloudinary: {
    name: 'Cloudinary',
    baseUrl: 'https://res.cloudinary.com',
    type: 'external',
    icon: '☁️📸',
  },
  google: {
    name: 'Google Images',
    baseUrl: 'https://lh3.googleusercontent.com',
    type: 'external',
    icon: '🔍',
  },
  github: {
    name: 'GitHub',
    baseUrl: 'https://avatars.githubusercontent.com',
    type: 'external',
    icon: '🐙',
  },
  facebook: {
    name: 'Facebook',
    baseUrl: 'https://platform-lookaside.fbsbx.com',
    type: 'external',
    icon: '👥',
  },
  black: {
    name: 'Black Placeholder',
    baseUrl: '/images/black-placeholder.jpg',
    type: 'local',
    icon: '⬛',
  },
  local: {
    name: 'Local',
    baseUrl: '/images',
    type: 'local',
    icon: '💾',
  },
} as const;

export type ImageSource = keyof typeof IMAGE_SOURCES;

export function getAvailableSources(): ImageSource[] {
  return Object.keys(IMAGE_SOURCES) as ImageSource[];
}

export function getSourceConfig(source: ImageSource) {
  return IMAGE_SOURCES[source];
}
