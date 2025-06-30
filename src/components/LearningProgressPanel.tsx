import React from 'react';
import { Brain, TrendingUp, Zap, Users, BookOpen, Target } from 'lucide-react';
import { LearningMetrics, FeedbackUpdate } from '../types/workflow';

interface LearningProgressPanelProps {
  learningMetrics: LearningMetrics;
  recentUpdates: FeedbackUpdate[];
  onResetLearning?: () => void;
}

const LearningProgressPanel: React.FC<LearningProgressPanelProps> = ({
  learningMetrics,
  recentUpdates,
  onResetLearning
}) => {
  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.95) return { level: 'Expert', color: 'emerald', description: 'System has mastered your business context' };
    if (confidence >= 0.9) return { level: 'Advanced', color: 'blue', description: 'High accuracy with minimal supervision needed' };
    if (confidence >= 0.8) return { level: 'Proficient', color: 'yellow', description: 'Good performance with occasional feedback' };
    return { level: 'Learning', color: 'red', description: 'Still learning your business patterns' };
  };

  const confidenceInfo = getConfidenceLevel(learningMetrics.averageConfidence);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-slate-900">Real-Time Learning Progress</h3>
        </div>
        {onResetLearning && (
          <button
            onClick={onResetLearning}
            className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Reset Learning
          </button>
        )}
      </div>

      {/* Overall Performance */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-medium text-slate-900">System Intelligence Level</h4>
            <p className="text-sm text-slate-600">{confidenceInfo.description}</p>
          </div>
          <div className={`px-4 py-2 rounded-lg bg-${confidenceInfo.color}-100 text-${confidenceInfo.color}-800 font-medium`}>
            {confidenceInfo.level}
          </div>
        </div>
        
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div 
            className={`bg-${confidenceInfo.color}-600 h-3 rounded-full transition-all duration-1000`}
            style={{ width: `${learningMetrics.averageConfidence * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-slate-500 mt-1">
          <span>0%</span>
          <span className="font-medium">{Math.round(learningMetrics.averageConfidence * 100)}% Average Confidence</span>
          <span>100%</span>
        </div>
      </div>

      {/* Learning Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-900">{learningMetrics.totalEmailsProcessed}</div>
              <div className="text-sm text-blue-700">Emails Processed</div>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <div>
              <div className="text-2xl font-bold text-emerald-900">
                +{Math.round(learningMetrics.confidenceImprovement * 100)}%
              </div>
              <div className="text-sm text-emerald-700">Confidence Gain</div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-900">{learningMetrics.feedbackIterations}</div>
              <div className="text-sm text-purple-700">Feedback Rounds</div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Specializations */}
      <div className="mb-6">
        <h4 className="font-medium text-slate-900 mb-3 flex items-center">
          <Target className="w-4 h-4 mr-2 text-orange-600" />
          Industry Specializations
        </h4>
        <div className="space-y-2">
          {Object.entries(learningMetrics.industrySpecializations).map(([industry, count]) => (
            <div key={industry} className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{industry}</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ 
                      width: `${(count / Math.max(...Object.values(learningMetrics.industrySpecializations))) * 100}%` 
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-900">{count} emails</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learned Jargon */}
      <div className="mb-6">
        <h4 className="font-medium text-slate-900 mb-3 flex items-center">
          <Zap className="w-4 h-4 mr-2 text-yellow-600" />
          Learned Business Jargon
        </h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(learningMetrics.jargonLearned).map(([shorthand, meaning]) => (
            <div key={shorthand} className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
              <div className="text-sm">
                <span className="font-medium text-yellow-900">"{shorthand}"</span>
                <span className="text-yellow-700"> = {meaning}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Learning Updates */}
      {recentUpdates.length > 0 && (
        <div>
          <h4 className="font-medium text-slate-900 mb-3">Recent Learning Updates</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {recentUpdates.slice(-5).reverse().map((update, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-900">
                    Updated {update.field.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-500">
                    +{Math.round(update.confidence_improvement * 100)}% confidence
                  </span>
                </div>
                <div className="text-sm text-slate-600">
                  <span className="line-through text-red-600">"{update.oldValue}"</span>
                  <span className="mx-2">→</span>
                  <span className="text-emerald-600">"{update.newValue}"</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningProgressPanel;