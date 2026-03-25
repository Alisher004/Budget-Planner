import { Insight } from '@/lib/insights';

interface InsightCardProps {
  insight: Insight;
}

export default function InsightCard({ insight }: InsightCardProps) {
  const typeStyles = {
    warning: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      title: 'text-red-900',
      message: 'text-red-700',
    },
    suggestion: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      message: 'text-yellow-700',
    },
    positive: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900',
      message: 'text-green-700',
    },
  };

  const styles = typeStyles[insight.type];

  return (
    <div className={`${styles.bg} border ${styles.border} rounded-lg p-4 hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-3">
        <span className={`text-2xl ${styles.icon}`}>{insight.icon}</span>
        <div className="flex-1">
          <h3 className={`font-semibold ${styles.title} mb-1`}>{insight.title}</h3>
          <p className={`text-sm ${styles.message}`}>{insight.message}</p>
        </div>
      </div>
    </div>
  );
}
