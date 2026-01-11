import { Users, Ticket, Layers } from 'lucide-react';
import { AppMode } from './types';

export const NAV_ITEMS = [
  { id: AppMode.INPUT, label: 'Data Source', icon: Users },
  { id: AppMode.LOTTERY, label: 'Prize Draw', icon: Ticket },
  { id: AppMode.GROUPING, label: 'Auto Grouping', icon: Layers },
];

export const COLORS = [
  'bg-red-100 text-red-800 border-red-200',
  'bg-orange-100 text-orange-800 border-orange-200',
  'bg-amber-100 text-amber-800 border-amber-200',
  'bg-green-100 text-green-800 border-green-200',
  'bg-emerald-100 text-emerald-800 border-emerald-200',
  'bg-teal-100 text-teal-800 border-teal-200',
  'bg-cyan-100 text-cyan-800 border-cyan-200',
  'bg-sky-100 text-sky-800 border-sky-200',
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-indigo-100 text-indigo-800 border-indigo-200',
  'bg-violet-100 text-violet-800 border-violet-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
  'bg-pink-100 text-pink-800 border-pink-200',
  'bg-rose-100 text-rose-800 border-rose-200',
];

export const SAMPLE_NAMES = [
  "Emma Thompson", "Liam Wilson", "Olivia Davis", "Noah Martinez",
  "Ava Taylor", "William Anderson", "Sophia Thomas", "James Jackson",
  "Isabella White", "Oliver Harris", "Mia Martin", "Benjamin Thompson",
  "Charlotte Garcia", "Elijah Martinez", "Amelia Robinson", "Lucas Clark",
  "Harper Rodriguez", "Mason Lewis", "Evelyn Lee", "Logan Walker",
  "Alexander Hall", "Abigail Allen", "Henry Young", "Emily King"
];