import { useState, useCallback, useEffect } from 'react';
import { WorkflowState, ProcessedEmail, LearningMetrics, BulkProcessingResult, FeedbackUpdate } from '../types/workflow';

const initialLearningMetrics: LearningMetrics = {
  totalEmailsProcessed: 0,
  averageConfidence: 0,
  confidenceImprovement: 0,
  feedbackIterations: 0,
  jargonLearned: {
    "ss": "stainless steel",
    "304": "304 grade stainless steel",
    "316": "316 grade stainless steel",
    "sch 40": "schedule 40",
    "od": "outside diameter"
  },
  industrySpecializations: {},
  processingTimeImprovement: 0
};

export const useWorkflowState = () => {
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    id: `workflow_${Date.now()}`,
    timestamp: new Date().toISOString(),
    emails: [],
    currentStep: 'analysis',
    learningMetrics: initialLearningMetrics,
    bulkMode: false
  });

  const [crossTabData, setCrossTabData] = useState<{
    lastAnalyzedEmail?: ProcessedEmail;
    knowledgeBaseQueries: string[];
    routingResults: any[];
    learningUpdates: FeedbackUpdate[];
  }>({
    knowledgeBaseQueries: [],
    routingResults: [],
    learningUpdates: []
  });

  const addProcessedEmail = useCallback((email: ProcessedEmail) => {
    setWorkflowState(prev => {
      const updatedEmails = [...prev.emails, email];
      const avgConfidence = updatedEmails.reduce((sum, e) => sum + (e.analysis?.confidence || 0), 0) / updatedEmails.length;
      
      return {
        ...prev,
        emails: updatedEmails,
        learningMetrics: {
          ...prev.learningMetrics,
          totalEmailsProcessed: updatedEmails.length,
          averageConfidence: avgConfidence,
          industrySpecializations: {
            ...prev.learningMetrics.industrySpecializations,
            [email.industry]: (prev.learningMetrics.industrySpecializations[email.industry] || 0) + 1
          }
        }
      };
    });

    setCrossTabData(prev => ({
      ...prev,
      lastAnalyzedEmail: email,
      knowledgeBaseQueries: email.analysis?.entities ? 
        [...prev.knowledgeBaseQueries, Object.values(email.analysis.entities).join(' ')] : 
        prev.knowledgeBaseQueries
    }));
  }, []);

  const updateLearningMetrics = useCallback((feedbackUpdate: FeedbackUpdate) => {
    setWorkflowState(prev => ({
      ...prev,
      learningMetrics: {
        ...prev.learningMetrics,
        feedbackIterations: prev.learningMetrics.feedbackIterations + 1,
        confidenceImprovement: prev.learningMetrics.confidenceImprovement + feedbackUpdate.confidence_improvement
      }
    }));

    setCrossTabData(prev => ({
      ...prev,
      learningUpdates: [...prev.learningUpdates, feedbackUpdate]
    }));
  }, []);

  const setBulkMode = useCallback((enabled: boolean, scenarioId?: string) => {
    setWorkflowState(prev => ({
      ...prev,
      bulkMode: enabled,
      selectedScenario: scenarioId
    }));
  }, []);

  const setCurrentStep = useCallback((step: WorkflowState['currentStep']) => {
    setWorkflowState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const generateBulkProcessingResults = useCallback((): BulkProcessingResult => {
    const { emails } = workflowState;
    
    if (emails.length === 0) {
      return {
        totalProcessed: 0,
        averageProcessingTime: 0,
        confidenceDistribution: {},
        topIntents: {},
        industryBreakdown: {},
        routingDistribution: {},
        knowledgeBaseHitRate: 0,
        improvementMetrics: {
          beforeAvgConfidence: 0,
          afterAvgConfidence: 0,
          processingTimeReduction: 0
        }
      };
    }

    const totalProcessed = emails.length;
    const averageProcessingTime = emails.reduce((sum, e) => sum + e.processingTime, 0) / totalProcessed;
    
    const confidenceDistribution = emails.reduce((acc, email) => {
      const confidence = email.analysis?.confidence || 0;
      const bucket = confidence >= 0.9 ? 'High (90%+)' : 
                    confidence >= 0.8 ? 'Good (80-89%)' : 
                    confidence >= 0.7 ? 'Medium (70-79%)' : 'Low (<70%)';
      acc[bucket] = (acc[bucket] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topIntents = emails.reduce((acc, email) => {
      const intent = email.analysis?.intent || 'Unknown';
      acc[intent] = (acc[intent] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const industryBreakdown = emails.reduce((acc, email) => {
      acc[email.industry] = (acc[email.industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const routingDistribution = emails.reduce((acc, email) => {
      const dept = email.analysis?.routing_tags?.department || 'Unrouted';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const knowledgeBaseHitRate = emails.filter(e => e.analysis?.knowledge_base_match).length / totalProcessed;

    // Calculate improvement metrics
    const beforeAvgConfidence = emails.length > 0 ? (emails[0]?.analysis?.confidence || 0.75) : 0.75;
    const afterAvgConfidence = workflowState.learningMetrics.averageConfidence;
    const processingTimeReduction = Math.max(0, 15 - (averageProcessingTime / 1000)); // Percentage improvement

    return {
      totalProcessed,
      averageProcessingTime,
      confidenceDistribution,
      topIntents,
      industryBreakdown,
      routingDistribution,
      knowledgeBaseHitRate,
      improvementMetrics: {
        beforeAvgConfidence,
        afterAvgConfidence,
        processingTimeReduction
      }
    };
  }, [workflowState]);

  return {
    workflowState,
    crossTabData,
    addProcessedEmail,
    updateLearningMetrics,
    setBulkMode,
    setCurrentStep,
    generateBulkProcessingResults,
    setCrossTabData
  };
};