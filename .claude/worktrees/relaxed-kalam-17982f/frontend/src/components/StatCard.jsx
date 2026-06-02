import React from 'react';

/**
 * Reusable stat card for dashboard overview tiles.
 * Props: title, value, change, icon, color ('green'|'blue'|'yellow'|'purple'|'red')
 */
const COLOR_MAP = {
  green:  { bg: 'bg-primary-50  dark:bg-primary-900/20', icon: 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300', badge: 'text-primary-600 dark:text-primary-400' },
  blue:   { bg: 'bg-blue-50   dark:bg-blue-900/20',   icon: 'bg-blue-100   dark:bg-blue-800   text-blue-600   dark:text-blue-300',   badge: 'text-blue-600   dark:text-blue-400'   },
  yellow: { bg: 'bg-earth-50  dark:bg-earth-900/20',  icon: 'bg-earth-100  dark:bg-earth-800  text-earth-600  dark:text-earth-300',  badge: 'text-earth-600  dark:text-earth-400'  },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300', badge: 'text-purple-600 dark:text-purple-400' },
  red:    { bg: 'bg-red-50    dark:bg-red-900/20',    icon: 'bg-red-100    dark:bg-red-800    text-red-600    dark:text-red-300',    badge: 'text-red-600    dark:text-red-400'    },
};

export default function StatCard({ title, value, change, icon: Icon, color = 'green', subtitle }) {
  const c = COLOR_MAP[color] || COLOR_MAP.green;
  const isPositive = typeof change === 'string' ? change.startsWith('+') : change >= 0;

  return (
    <div className={`card flex items-start gap-4 ${c.bg} border-0 fade-in`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${c.icon}`}>
        {Icon && <Icon size={24} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium truncate">{title}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">{value}</p>
        {(change !== undefined || subtitle) && (
          <p className={`text-xs mt-1 font-medium ${isPositive ? 'text-primary-600 dark:text-primary-400' : 'text-red-500'}`}>
            {change !== undefined ? change : ''}{subtitle ? ` ${subtitle}` : ''}
          </p>
        )}
      </div>
    </div>
  );
}
