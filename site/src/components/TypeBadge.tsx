interface TypeBadgeProps {
  type: 'spot' | 'food' | 'transport' | 'hotel' | 'note'
  className?: string
}

const typeConfig = {
  spot: {
    emoji: '🗾',
    label: { ja: 'スポット', en: 'Spot' },
    colors: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
  },
  food: {
    emoji: '🍣',
    label: { ja: 'グルメ', en: 'Food' },
    colors: 'bg-sunset-100 text-sunset-700 dark:bg-sunset-900/30 dark:text-sunset-300'
  },
  transport: {
    emoji: '🚄',
    label: { ja: '交通', en: 'Transport' },
    colors: 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300'
  },
  hotel: {
    emoji: '🛏️',
    label: { ja: '宿泊', en: 'Hotel' },
    colors: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
  },
  note: {
    emoji: '📝',
    label: { ja: 'メモ', en: 'Note' },
    colors: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

export default function TypeBadge({ type, className = '' }: TypeBadgeProps) {
  const config = typeConfig[type]
  const lang = typeof window !== 'undefined' 
    ? (window.location.pathname.startsWith('/en') ? 'en' : 'ja')
    : 'ja'

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${config.colors} ${className}`}>
      <span className="mr-1">{config.emoji}</span>
      {config.label[lang]}
    </span>
  )
}