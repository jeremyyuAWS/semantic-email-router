import React, { useState, useEffect } from 'react';
import { Play, Pause, BarChart, TrendingUp, Clock, Target, Database, Users } from 'lucide-react';
import { BulkProcessingResult, ProcessedEmail } from '../types/workflow';

interface BulkProcessingPanelProps {
  isProcessing: boolean;
  onStartBulkProcessing: () => void;
  onPauseBulkProcessing: () => void;
  bulkResults?: BulkProcessingResult;
  processedEmails: ProcessedEmail[];
  onEmailSelect: (email: ProcessedEmail) => void;
}

const BulkProcessingPanel: React.FC<BulkProcessingPanelProps> = ({
  isProcessing,
  onStartBulkProcessing,
  onPauseBulkProcessing,
  bulkResults,
  processedEmails,
  onEmailSelect
}) => {
  const [processingProgress, setProcessingProgress] = useState(0);

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  const renderMetricCard = (title: string, value: string | number, icon: any, color: string, subtitle?: string) => {
    const Icon = icon;
    return (
      <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4`}>
        <div className="flex items-center space-x-3">
          <Icon className={`w-6 h-6 text-${color}-600`} />
          <div>
            <div className={`text-2xl font-bold text-${color}-900`}>{value}</div>
            <div className={`text-sm text-${color}-700`}>{title}</div>
            {subtitle && <div className={`text-xs text-${color}-600 mt-1`}>{subtitle}</div>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Bulk Processing Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Bulk Processing</h3>
          <button
            onClick={isProcessing ? onPauseBulkProcessing : onStartBulkProcessing}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
              isProcessing 
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isProcessing ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Processing</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start Bulk Analysis</span>
              </>
            )}
          </button>
        </div>

        {isProcessing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Processing emails...</span>
              <span className="font-medium text-slate-900">{Math.round(processingProgress)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
            <div className="text-xs text-slate-500">
              AI agents working: Intent Detection → Entity Extraction → Knowledge Matching → Routing
            </div>
          </div>
        )}
      </div>

      {/* Bulk Processing Results */}
      {bulkResults && bulkResults.totalProcessed > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Bulk Processing Analytics</h3>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {renderMetricCard(
              'Emails Processed',
              bulkResults.totalProcessed,
              Users,
              'blue'
            )}
            {renderMetricCard(
              'Avg Processing Time',
              `${(bulkResults.averageProcessingTime / 1000).toFixed(1)}s`,
              Clock,
              'emerald',
              `${bulkResults.improvementMetrics.processingTimeReduction.toFixed(1)}% faster`
            )}
            {renderMetricCard(
              'Knowledge Hit Rate',
              `${(bulkResults.knowledgeBaseHitRate * 100).toFixed(0)}%`,
              Database,
              'purple',
              'Document matches found'
            )}
            {renderMetricCard(
              'Confidence Improvement',
              `+${((bulkResults.improvementMetrics.afterAvgConfidence - bulkResults.improvementMetrics.beforeAvgConfidence) * 100).toFixed(1)}%`,
              TrendingUp,
              'orange',
              'Through learning'
            )}
          </div>

          {/* Detailed Breakdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Intent Distribution */}
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2 text-blue-600" />
                Intent Distribution
              </h4>
              <div className="space-y-2">
                {Object.entries(bulkResults.topIntents).map(([intent, count]) => (
                  <div key={intent} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{intent}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(count / bulkResults.totalProcessed) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-900">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence Distribution */}
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-3 flex items-center">
                <BarChart className="w-4 h-4 mr-2 text-emerald-600" />
                Confidence Distribution
              </h4>
              <div className="space-y-2">
                {Object.entries(bulkResults.confidenceDistribution).map(([bucket, count]) => (
                  <div key={bucket} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{bucket}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{ width: `${(count / bulkResults.totalProcessed) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-900">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Industry Breakdown */}
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2 text-purple-600" />
                Industry Breakdown
              </h4>
              <div className="space-y-2">
                {Object.entries(bulkResults.industryBreakdown).map(([industry, count]) => (
                  <div key={industry} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{industry}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(count / bulkResults.totalProcessed) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-900">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Routing Distribution */}
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2 text-orange-600" />
                Routing Distribution
              </h4>
              <div className="space-y-2">
                {Object.entries(bulkResults.routingDistribution).map(([dept, count]) => (
                  <div key={dept} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{dept}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full"
                          style={{ width: `${(count / bulkResults.totalProcessed) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-900">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processed Emails List */}
      {processedEmails.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Processed Emails</h3>
          <div className="space-y-3">
            {processedEmails.map((email, index) => (
              <button
                key={email.id}
                onClick={() => onEmailSelect(email)}
                className="w-full text-left p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-slate-900">{email.company}</div>
                  <div className="flex items-center space-x-3">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      email.industry === "Construction" ? "bg-orange-100 text-orange-800" :
                      email.industry === "Healthcare" ? "bg-red-100 text-red-800" :
                      email.industry === "Legal" ? "bg-purple-100 text-purple-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {email.industry}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      (email.analysis?.confidence || 0) >= 0.9 ? "bg-emerald-100 text-emerald-800" :
                      (email.analysis?.confidence || 0) >= 0.8 ? "bg-blue-100 text-blue-800" :
                      (email.analysis?.confidence || 0) >= 0.7 ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {Math.round((email.analysis?.confidence || 0) * 100)}%
                    </div>
                  </div>
                </div>
                <div className="text-sm text-slate-600 mb-1">{email.subject}</div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Intent: {email.analysis?.intent || 'Processing...'}</span>
                  <span>{email.processingTime}ms</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkProcessingPanel;