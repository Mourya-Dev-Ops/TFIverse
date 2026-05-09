// lib/types/person.ts

/**
 * Hero Superstar Template - Full metadata structure
 * This matches your JSON template exactly
 */
export interface HeroSuperstarMetadata {
  metadata: {
    version: string;
    template: string;
    category: string;
    subCategory: string;
    generationDate: string;
    lastUpdated: string;
    completeness: number;
    verifiedBy: string[];
    sources: string[];
    notes: string;
  };

  heroAura: {
    screenPresence: string;
    boxOfficeAppeal: string;
    signature: string;
    fanbase: string;
    trademarkStyle: string;
  };

  images: {
    portrait: { source: string; url: string; type: string };
    banner: { source: string; url: string; type: string };
    avatar: { source: string; url: string; type: string };
    featured: { source: string; url: string; type: string };
    gallery: Array<{ id: string; source: string; url: string; type: string }>;
  };

  bio: string;

  personalInfo: {
    fullName: string;
    birthDate: string;
    age: string;
    birthPlace: string;
    currentResidence: string;
    nationality: string;
    ethnicity: string;
    physicalProfile: {
      height: string;
      weight: string;
      bodyType: string;
      hairColor: string;
      eyeColor: string;
      shoeSize: string;
    };
    personalTraits: {
      zodiacSign: string | null;
      bloodGroup: string | null;
      personalityType: string;
      knownForPersonality: string;
    };
    familyInfo: {
      maritalStatus: string;
      spouse: string | null;
      children: Array<{ name: string; birthYear: number; gender: string }>;
      family: {
        father: string | null;
        mother: string | null;
        siblings: Array<{
          name: string;
          relationship: string;
          profession: string;
          involvement: string;
        }>;
      };
    };
    education: {
      schooling: string | null;
      highSchool: string | null;
      college: string | null;
      specialization: string | null;
    };
    careerStart: {
      debutYear: number;
      debutFilm: string;
      yearsActive: number;
      activeStatus: string;
    };
  };

  socialMedia: {
    instagram: SocialMediaProfile;
    twitter: SocialMediaProfile;
    facebook: SocialMediaProfile;
    youtube: SocialMediaProfile;
  };

  physicalStats: {
    body: {
      height: string;
      weight: {
        current: string;
        range: string;
        averageIdeal: string;
      };
      bodyMassIndex: string;
      bodyType: string;
      bodyFatPercentage: string;
    };
    measurements: {
      chest: string;
      waist: string;
      biceps: string;
      thighs: string;
    };
    appearance: {
      hairColor: string;
      eyeColor: string;
      skinTone: string;
      distinctiveFeatures: string[];
    };
    footwear: {
      shoeSizeUK: string;
      shoeSizeUS: string;
      shoeSizeEU: string;
    };
    fitnessProfile: {
      fitnessLevel: string;
      mainTrainer: string | null;
      secondaryTrainers: string[];
      dailyTrainingHours: string;
      trainingFrequency: string;
      trainingFocus: string[];
    };
    roleBasedTransformations: {
      note: string;
      examples: Array<{
        role: string;
        weight: string;
        bodyFat: string;
        appearance: string;
      }>;
    };
    healthMetrics: {
      bloodGroup: string | null;
      restingHeartRate: string | null;
      bloodPressure: string | null;
      fitnessScore: string;
    };
    nutritionProfile: {
      dietaryApproach: string;
      nutritionist: string | null;
      calorieManagement: string | null;
      macroFocus: string;
      supplementationApproach: string;
    };
  };

  physicalTransformations: PhysicalTransformation[];
  voiceProfile: VoiceProfile;
  onScreenPersona: OnScreenPersona;
  lifestyle: Lifestyle;
  financialProfile: FinancialProfile;
  hobbiesAndInterests: Hobby[];
  favorites: Favorites;
  collaborations: Collaborations;
  careerStats: CareerStats;
  genreStrength: GenreStrength;
  philanthropy: Philanthropy;
  awards: Award[];
  quotes: Quote[];
  trivia: string[];
  tvAppearances: TVAppearance[];
  knownFor: string[];
}

interface SocialMediaProfile {
  platform: string;
  handle: string;
  url: string;
  followers: number | null;
  verified: boolean;
  accountType: string;
  active: boolean;
  lastPostDate: string | null;
  postFrequency?: string;
  engagementRate?: string;
}

// ... (Add other interfaces as needed)
