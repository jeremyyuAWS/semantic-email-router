export interface WorkflowState {
  id: string;
  timestamp: string;
  emails: ProcessedEmail[];
  currentStep: 'analysis' | 'knowledge' | 'routing' | 'complete';
  learningMetrics: LearningMetrics;
  bulkMode: boolean;
  selectedScenario?: string;
}

export interface ProcessedEmail {
  id: string;
  content: string;
  company: string;
  industry: string;
  subject: string;
  attachments?: any[];
  analysis?: AnalysisResult;
  knowledgeMatches?: KnowledgeMatch[];
  routingDecisions?: RoutingDecision[];
  feedbackApplied?: FeedbackUpdate[];
  processingTime: number;
  confidenceProgression: number[];
}

export interface AnalysisResult {
  intent: string;
  entities: Record<string, any>;
  routing_tags: Record<string, any>;
  knowledge_base_match?: KnowledgeMatch;
  confidence: number;
  structured_output?: StructuredOutput;
  processing_time?: number;
}

export interface KnowledgeMatch {
  source: string;
  row?: number;
  page?: number;
  content: string;
  confidence: number;
  retrievalTime: number;
}

export interface RoutingDecision {
  department: string;
  priority: string;
  integration_target: string;
  sharepoint_path: string;
  next_actions: string[];
  confidence: number;
}

export interface StructuredOutput {
  crm_ready: boolean;
  sharepoint_path: string;
  next_actions: string[];
}

export interface LearningMetrics {
  totalEmailsProcessed: number;
  averageConfidence: number;
  confidenceImprovement: number;
  feedbackIterations: number;
  jargonLearned: Record<string, string>;
  industrySpecializations: Record<string, number>;
  processingTimeImprovement: number;
}

export interface FeedbackUpdate {
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: string;
  confidence_improvement: number;
  emailId: string;
}

export interface BulkProcessingResult {
  totalProcessed: number;
  averageProcessingTime: number;
  confidenceDistribution: Record<string, number>;
  topIntents: Record<string, number>;
  industryBreakdown: Record<string, number>;
  routingDistribution: Record<string, number>;
  knowledgeBaseHitRate: number;
  improvementMetrics: {
    beforeAvgConfidence: number;
    afterAvgConfidence: number;
    processingTimeReduction: number;
  };
}