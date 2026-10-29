import type { ComponentType, SVGProps } from "react";
import {
  BookOpen,
  CalendarDays,
  Compass,
  Drama,
  Eye,
  FaceSlightlySmiling,
  Film,
  FingerprintPattern,
  Ghost,
  Globe,
  Heart,
  Moon,
  Popcorn,
  Rocket,
  Sparkles,
  Swords,
  Timer,
  Zap,
} from "lucide-react";
import type { QuizIconKey } from "@/utils/recommendation";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const ICON_BY_KEY: Record<QuizIconKey, IconComponent> = {
  book: BookOpen,
  calendar: CalendarDays,
  compass: Compass,
  drama: Drama,
  eye: Eye,
  film: Film,
  fingerprint: FingerprintPattern,
  ghost: Ghost,
  globe: Globe,
  heart: Heart,
  moon: Moon,
  popcorn: Popcorn,
  rocket: Rocket,
  smile: FaceSlightlySmiling,
  sparkles: Sparkles,
  swords: Swords,
  timer: Timer,
  zap: Zap,
};

interface QuizIconProps {
  icon: QuizIconKey;
  className?: string;
}

export default function QuizIcon({ icon, className }: QuizIconProps) {
  const Icon = ICON_BY_KEY[icon];

  return <Icon aria-hidden="true" className={className} />;
}
