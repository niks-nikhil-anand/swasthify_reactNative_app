import React from 'react';
import { 
  Home, 
  User, 
  UserPlus, 
  Activity, 
  Package, 
  Calendar, 
  FileText, 
  CreditCard, 
  Mail, 
  Info, 
  Sun, 
  Moon, 
  LogOut, 
  LogIn, 
  ChevronLeft,
  Search,
  Bell,
  Settings,
  MoreVertical,
  Menu,
  LucideProps
} from 'lucide-react-native';

const iconMap = {
  home: Home,
  user: User,
  'user-plus': UserPlus,
  doctor: UserPlus,
  activity: Activity,
  lab: Activity,
  package: Package,
  pkg: Package,
  calendar: Calendar,
  appointments: Calendar,
  'file-text': FileText,
  doc: FileText,
  'health-records': FileText,
  'credit-card': CreditCard,
  wallet: CreditCard,
  pricing: CreditCard,
  mail: Mail,
  contact: Mail,
  info: Info,
  about: Info,
  sun: Sun,
  moon: Moon,
  logout: LogOut,
  'log-out': LogOut,
  'log-in': LogIn,
  signin: LogIn,
  'chevron-left': ChevronLeft,
  back: ChevronLeft,
  search: Search,
  bell: Bell,
  settings: Settings,
  more: MoreVertical,
  menu: Menu,
};

interface IconProps {
  name: keyof typeof iconMap;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const Icon = ({ 
  name, 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 1.8 
}: IconProps) => {
  const IconComponent = iconMap[name] || HelpCircle;
  
  return (
    <IconComponent 
      size={size} 
      color={color} 
      strokeWidth={strokeWidth} 
    />
  );
};

export default Icon;

// Fallback for unknown icons
const HelpCircle = (props: LucideProps) => (
  <Info {...props} />
);
