import { Insight } from '@/lib/insights';
import InsightCard from './InsightCard';

interface InsightsSectionProps {
  insights: Insight[];
}

export default function InsightsSection({ insights }: InsightsSectionProps) {
  if (insights.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Финансовые рекомендации</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">
            Добавьте данные о доходах и расходах, чтобы получить персональные рекомендации
          </p>
        </div>
      </div>
    );
  }

  const warnings = insights.filter(i => i.type === 'warning');
  const suggestions = insights.filter(i => i.type === 'suggestion');
  const positives = insights.filter(i => i.type === 'positive');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Финансовые рекомендации</h2>
      
      <div className="space-y-3">
        {/* Warnings first */}
        {warnings.map(insight => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
        
        {/* Then suggestions */}
        {suggestions.map(insight => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
        
        {/* Finally positives */}
        {positives.map(insight => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Рекомендации обновляются автоматически на основе ваших данных
        </p>
      </div>
    </div>
  );
}
