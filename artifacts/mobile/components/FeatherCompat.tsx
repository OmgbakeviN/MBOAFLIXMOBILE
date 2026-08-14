import React from 'react';

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Activity,
  Award,
  Bell,
  Book,
  BookOpen,
  Bookmark,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  Compass,
  Coffee,
  CreditCard,
  Eye,
  EyeOff,
  Film,
  Globe2,
  Heart,
  Home,
  Image,
  Info,
  Lock,
  LogOut,
  LucideIcon,
  LucideProps,
  Mail,
  MapPin,
  Menu,
  Music,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Share2,
  Shield,
  SlidersHorizontal,
  Star,
  Sun,
  User,
  UserPlus,
  Video,
  X,
} from 'lucide-react-native';

const glyphMap = {
  activity: 1,
  anchor: 1,
  archive: 1,
  'alert-circle': 1,
  'arrow-left': 1,
  'arrow-right': 1,
  'arrow-up-right': 1,
  award: 1,
  bell: 1,
  book: 1,
  'book-open': 1,
  bookmark: 1,
  check: 1,
  'check-circle': 1,
  'chevron-down': 1,
  'chevron-left': 1,
  'chevron-right': 1,
  'chevron-up': 1,
  compass: 1,
  coffee: 1,
  droplet: 1,
  'credit-card': 1,
  eye: 1,
  edit: 1,
  'edit-3': 1,
  'eye-off': 1,
  film: 1,
  flag: 1,
  globe: 1,
  grid: 1,
  heart: 1,
  home: 1,
  image: 1,
  info: 1,
  lock: 1,
  'log-out': 1,
  mail: 1,
  map: 1,
  'map-pin': 1,
  menu: 1,
  music: 1,
  'more-horizontal': 1,
  pause: 1,
  play: 1,
  plus: 1,
  'refresh-cw': 1,
  search: 1,
  settings: 1,
  'share-2': 1,
  shield: 1,
  sliders: 1,
  star: 1,
  tool: 1,
  triangle: 1,
  sun: 1,
  user: 1,
  users: 1,
  'user-plus': 1,
  video: 1,
  x: 1,
} as const;

export type FeatherCompatName =
  keyof typeof glyphMap;

const ICONS: Record<
  FeatherCompatName,
  LucideIcon
> = {
  activity: Activity,
  anchor: Compass,
  archive: Book,
  'alert-circle': AlertCircle,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  award: Award,
  bell: Bell,
  book: Book,
  'book-open': BookOpen,
  bookmark: Bookmark,
  check: Check,
  'check-circle': CheckCircle,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  compass: Compass,
  coffee: Coffee,
  droplet: Globe2,
  'credit-card': CreditCard,
  eye: Eye,
  edit: BookOpen,
  'edit-3': BookOpen,
  'eye-off': EyeOff,
  film: Film,
  flag: Award,
  globe: Globe2,
  grid: Image,
  heart: Heart,
  home: Home,
  image: Image,
  info: Info,
  lock: Lock,
  'log-out': LogOut,
  mail: Mail,
  map: MapPin,
  'map-pin': MapPin,
  menu: Menu,
  music: Music,
  'more-horizontal': MoreHorizontal,
  pause: Pause,
  play: Play,
  plus: Plus,
  'refresh-cw': RefreshCw,
  search: Search,
  settings: Settings,
  'share-2': Share2,
  shield: Shield,
  sliders: SlidersHorizontal,
  star: Star,
  tool: Settings,
  triangle: Compass,
  sun: Sun,
  user: User,
  users: UserPlus,
  'user-plus': UserPlus,
  video: Video,
  x: X,
};

interface FeatherCompatProps
  extends Omit<
    LucideProps,
    'ref'
  > {
  name: FeatherCompatName;
}

function FeatherBase({
  name,
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  ...props
}: FeatherCompatProps) {
  const Icon =
    ICONS[name] ??
    CircleHelp;

  return (
    <Icon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}

const Feather = Object.assign(
  FeatherBase,
  {
    glyphMap,
  }
);

export { Feather };
export default Feather;
