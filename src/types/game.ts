export type GameState = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type Difficulty = 'easy' | 'classic' | 'hard';

export interface BirdSkin {
  id: string;
  name: string;
  description: string;
  bodyColor: string;
  bellyColor: string;
  beakColor: string;
  wingColor: string;
  eyeColor: string;
  trailColor: string;
  glowColor: string;
}

export interface EnvironmentTheme {
  id: string;
  name: string;
  skyTop: string;
  skyBottom: string;
  pipeMain: string;
  pipeRim: string;
  pipeHighlight: string;
  pipeShadow: string;
  groundTop: string;
  groundBottom: string;
  groundStripe: string;
  cloudColor: string;
  accentParticles: string;
  isNight?: boolean;
}

export interface GameStats {
  highScore: number;
  totalGames: number;
  totalScore: number;
  totalFlaps: number;
  bronzeMedals: number;
  silverMedals: number;
  goldMedals: number;
  platinumMedals: number;
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, {
  name: string;
  label: string;
  pipeGap: number;
  pipeSpacing: number;
  pipeSpeed: number;
  gravity: number;
  jumpForce: number;
}> = {
  easy: {
    name: 'easy',
    label: 'Relajado',
    pipeGap: 195,
    pipeSpacing: 245,
    pipeSpeed: 2.0,
    gravity: 0.26,
    jumpForce: -6.0,
  },
  classic: {
    name: 'classic',
    label: 'Clásico',
    pipeGap: 165,
    pipeSpacing: 225,
    pipeSpeed: 2.5,
    gravity: 0.32,
    jumpForce: -6.5,
  },
  hard: {
    name: 'hard',
    label: 'Extremo',
    pipeGap: 135,
    pipeSpacing: 205,
    pipeSpeed: 3.1,
    gravity: 0.38,
    jumpForce: -7.0,
  },
};

export const BIRD_SKINS: BirdSkin[] = [
  {
    id: 'canary',
    name: 'Canario Dorado',
    description: 'El clásico plumaje amarillo con espíritu intrépido.',
    bodyColor: '#FBBF24',
    bellyColor: '#FDE68A',
    beakColor: '#EA580C',
    wingColor: '#F59E0B',
    eyeColor: '#1E293B',
    trailColor: '#FDE047',
    glowColor: 'rgba(251, 191, 36, 0.4)',
  },
  {
    id: 'cyber',
    name: 'Halcón Neón',
    description: 'Energizado con plasma azul de alta velocidad.',
    bodyColor: '#06B6D4',
    bellyColor: '#A5F3FC',
    beakColor: '#EC4899',
    wingColor: '#0284C7',
    eyeColor: '#0F172A',
    trailColor: '#38BDF8',
    glowColor: 'rgba(6, 182, 212, 0.5)',
  },
  {
    id: 'phoenix',
    name: 'Fénix Carmesí',
    description: 'Ave mística que deja una estela de chispas ardientes.',
    bodyColor: '#EF4444',
    bellyColor: '#FECACA',
    beakColor: '#F59E0B',
    wingColor: '#B91C1C',
    eyeColor: '#450A0A',
    trailColor: '#F97316',
    glowColor: 'rgba(239, 68, 68, 0.45)',
  },
  {
    id: 'shadow',
    name: 'Cuervo Nocturno',
    description: 'Sigiloso, elegante y veloz en la oscuridad.',
    bodyColor: '#334155',
    bellyColor: '#94A3B8',
    beakColor: '#F59E0B',
    wingColor: '#1E293B',
    eyeColor: '#F8FAFC',
    trailColor: '#64748B',
    glowColor: 'rgba(148, 163, 184, 0.4)',
  },
  {
    id: 'emerald',
    name: 'Colibrí Esmeralda',
    description: 'Ágil y deslumbrante como una joya tropical.',
    bodyColor: '#10B981',
    bellyColor: '#A7F3D0',
    beakColor: '#D97706',
    wingColor: '#047857',
    eyeColor: '#064E3B',
    trailColor: '#34D399',
    glowColor: 'rgba(16, 185, 129, 0.45)',
  },
];

export const THEMES: EnvironmentTheme[] = [
  {
    id: 'day',
    name: 'Día Soleado',
    skyTop: '#38BDF8',
    skyBottom: '#BAE6FD',
    pipeMain: '#22C55E',
    pipeRim: '#15803D',
    pipeHighlight: '#86EFAC',
    pipeShadow: '#166534',
    groundTop: '#15803D',
    groundBottom: '#78350F',
    groundStripe: '#16A34A',
    cloudColor: 'rgba(255, 255, 255, 0.85)',
    accentParticles: 'rgba(255, 255, 255, 0.6)',
    isNight: false,
  },
  {
    id: 'sunset',
    name: 'Atardecer Dorado',
    skyTop: '#C026D3',
    skyBottom: '#F97316',
    pipeMain: '#EA580C',
    pipeRim: '#9A3412',
    pipeHighlight: '#FDBA74',
    pipeShadow: '#7C2D12',
    groundTop: '#B45309',
    groundBottom: '#451A03',
    groundStripe: '#D97706',
    cloudColor: 'rgba(254, 215, 170, 0.65)',
    accentParticles: 'rgba(253, 186, 116, 0.5)',
    isNight: false,
  },
  {
    id: 'cyberpunk',
    name: 'Neón Ciberpunk',
    skyTop: '#0F172A',
    skyBottom: '#312E81',
    pipeMain: '#06B6D4',
    pipeRim: '#0E7490',
    pipeHighlight: '#67E8F9',
    pipeShadow: '#155E75',
    groundTop: '#4338CA',
    groundBottom: '#1E1B4B',
    groundStripe: '#6366F1',
    cloudColor: 'rgba(192, 132, 252, 0.25)',
    accentParticles: 'rgba(56, 189, 248, 0.8)',
    isNight: true,
  },
  {
    id: 'mystic',
    name: 'Bosque Esmeralda',
    skyTop: '#064E3B',
    skyBottom: '#047857',
    pipeMain: '#10B981',
    pipeRim: '#065F46',
    pipeHighlight: '#6EE7B7',
    pipeShadow: '#044E36',
    groundTop: '#065F46',
    groundBottom: '#022C22',
    groundStripe: '#059669',
    cloudColor: 'rgba(167, 243, 208, 0.3)',
    accentParticles: 'rgba(110, 231, 183, 0.6)',
    isNight: true,
  },
];
