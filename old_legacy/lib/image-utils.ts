import { IMAGE_SOURCES, type ImageSource } from './image-sources.config';

export type ImageConfig = {
  source: ImageSource;
  url: string;
};

const DEFAULT_POSTER = '/images/no-poster.png';

export function buildImageUrl(imageConfig: ImageConfig | string | null): string {
  if (!imageConfig) return DEFAULT_POSTER;

  if (typeof imageConfig === 'string') {
    if (imageConfig.startsWith('http')) {
      return imageConfig;
    }
    if (
      imageConfig.includes('hero-') ||
      imageConfig.includes('memes') ||
      imageConfig.includes('fan-') ||
      imageConfig.includes('gallery')
    ) {
      return `${IMAGE_SOURCES.backblazeb2.baseUrl}/${imageConfig}`;
    }
    if (imageConfig.startsWith('/')) {
      return imageConfig;
    }
    return DEFAULT_POSTER;
  }

  const { source, url } = imageConfig;
  const sourceConfig = IMAGE_SOURCES[source];

  if (!sourceConfig) {
    console.warn(`❌ Unknown image source: ${source}`);
    return DEFAULT_POSTER;
  }

  switch (source) {
    case 'backblazeb2': {
      if (url.startsWith('http')) return url;
      return `${sourceConfig.baseUrl}/${url}`;
    }

    case 'pinterest': {
      if (url.startsWith('http')) return url;
      return `${sourceConfig.baseUrl}/${url}`;
    }

    case 'tmdb': {
      if (url.startsWith('http')) return url;
      return `${sourceConfig.baseUrl}${url}`;
    }

    case 'imgur': {
      if (url.startsWith('http')) return url;
      return `${sourceConfig.baseUrl}/${url}`;
    }

    case 'cloudinary': {
      if (url.startsWith('http')) return url;
      return `${sourceConfig.baseUrl}/${url}`;
    }

    case 'google': {
      if (url.startsWith('http')) return url;
      return `${sourceConfig.baseUrl}/${url}`;
    }

    case 'github': {
      if (url.startsWith('http')) return url;
      return `${sourceConfig.baseUrl}/${url}`;
    }

    case 'facebook': {
      if (url.startsWith('http')) return url;
      return `${sourceConfig.baseUrl}/${url}`;
    }

    case 'black': {
      return sourceConfig.baseUrl;
    }

    case 'local': {
      if (url.startsWith('http')) return url;
      if (url.startsWith('/')) return url;
      return `${sourceConfig.baseUrl}/${url}`;
    }

    default:
      return DEFAULT_POSTER;
  }
}

export function buildImageList(images: (ImageConfig | string)[] | null): string[] {
  if (!images) return [];
  return images.map(buildImageUrl);
}

export function getSourceInfo(source: ImageSource) {
  return IMAGE_SOURCES[source];
}
