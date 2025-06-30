import React, { useState, useEffect } from 'react';
import { Brain, Target, Zap, AlertTriangle, CheckCircle, Clock, TrendingUp, Network, Database, Users } from 'lucide-react';
import advancedScenariosData from '../../data/advanced_scenarios.json';
import { ProcessedEmail, AnalysisResult } from '../types/workflow';

interface AdvancedScenario {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  complexity_score: number;
  emails: any[];
}

interface SemanticSearchDemonstration {
  query: string;
  reasoning_steps: string[];
  knowledge_sources: string[];
  complexity_indicators: string[];
  confidence_progression: number[];
}

interface AdvancedEmailAnalyzerProps {
  onScenarioComplete: (results: any) => void;
}

const AdvancedEmailAnalyzer: React.FC<AdvancedEmailAnalyzerProps> = ({ onScenarioComplete }) => {
  const [selectedScenario, setSelectedScenario] = useState<AdvancedScenario | null>(null);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [semanticSteps, setSemanticSteps] = useState<SemanticSearchDemonstration | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [learningMetrics, setLearningMetrics] = useState({
    entityExtractionAccuracy: 0,
    crossReferenceSuccess: 0,
    complexityHandling: 0,
    responseTimeImprovement: 0
  });

  const scenarios: AdvancedScenario[] = advancedScenariosData.complex_scenarios;

  const runSemanticAnalysis = async (email: any) => {
    setIsAnalyzing(true);
    setSemanticSteps(null);

    // Simulate advanced semantic processing steps
    const steps = [
      "Parsing multi-entity relationships and dependencies",
      "Cross-referencing technical specifications with knowledge base",
      "Analyzing temporal constraints and delivery dependencies", 
      "Identifying regulatory compliance requirements",
      "Assessing business risk and escalation needs",
      "Generating structured output with confidence scoring"
    ];

    const knowledgeSources = [
      "Technical specifications database",
      "Regulatory compliance matrix",
      "Vendor capability profiles",
      "Historical incident patterns",
      "Industry standard references"
    ];

    const demonstration: SemanticSearchDemonstration = {
      query: generateSemanticQuery(email),
      reasoning_steps: steps,
      knowledge_sources: knowledgeSources,
      complexity_indicators: email.complexity_indicators || [],
      confidence_progression: []
    };

    // Simulate progressive analysis with confidence building
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const confidence = 0.6 + (i * 0.07) + Math.random() * 0.05;
      demonstration.confidence_progression.push(confidence);
      setSemanticSteps({ ...demonstration });
    }

    // Generate final analysis result
    const result = generateAdvancedAnalysis(email);
    setAnalysisResults(prev => [...prev, result]);

    // Update learning metrics
    updateLearningMetrics(result);

    setIsAnalyzing(false);
    return result;
  };

  const generateSemanticQuery = (email: any): string => {
    // Extract key terms for semantic search
    const content = email.content.toLowerCase();
    const keyTerms = [];

    // Extract technical specifications
    const techMatches = content.match(/\d+['"]\s*(od|id)|schedule\s*\d+|grade\s*\d+|[a-z]+\s*steel/gi);
    if (techMatches) keyTerms.push(...techMatches.slice(0, 3));

    // Extract urgency indicators
    const urgencyMatches = content.match(/urgent|critical|emergency|immediate|asap/gi);
    if (urgencyMatches) keyTerms.push(...urgencyMatches.slice(0, 2));

    // Extract regulatory terms
    const regulatoryMatches = content.match/fda|astm|iso|asme|cfr|gdpr|hipaa/gi);
    if (regulatoryMatches) keyTerms.push(...regulatoryMatches.slice(0, 3));

    return keyTerms.join(' ');
  };

  const generateAdvancedAnalysis = (email: any): any => {
    // Simulate advanced analysis based on email complexity
    const baseConfidence = 0.85 + Math.random() * 0.12;
    
    return {
      emailId: email.id,
      timestamp: new Date().toISOString(),
      analysis: {
        ...email.expected_analysis,
        confidence: Math.min(baseConfidence, 0.98),
        advanced_metrics: {
          entity_extraction_count: Object.keys(email.expected_analysis.entities).length,
          cross_reference_matches: Math.floor(Math.random() * 5) + 3,
          regulatory_flags: email.expected_analysis.routing_tags.regulatory_flags?.length || 0,
          complexity_score: email.complexity_score || 7.5,
          processing_time: 2500 + Math.random() * 2000
        }
      },
      semantic_insights: {
        terminology_learned: extractTerminology(email.content),
        pattern_recognition: identifyPatterns(email),
        knowledge_gaps: identifyKnowledgeGaps(email),
        improvement_suggestions: generateImprovements(email)
      }
    };
  };

  const extractTerminology = (content: string): string[] => {
    // Simulate terminology extraction
    const terms = [
      "pharmaceutical grade materials",
      "schedule 80 wall thickness", 
      "cascade failure analysis",
      "multi-jurisdiction compliance"
    ];
    return terms.slice(0, 2 + Math.floor(Math.random() * 3));
  };

  const identifyPatterns = (email: any): string[] => {
    return [
      "High-urgency pattern with penalty clauses",
      "Multi-phase delivery coordination required",
      "Regulatory compliance across multiple standards"
    ];
  };

  const identifyKnowledgeGaps = (email: any): string[] => {
    return [
      "Custom flange specifications need CAD integration",
      "International shipping documentation templates"
    ];
  };

  const generateImprovements = (email: any): string[] => {
    return [
      "Auto-detect custom part numbers for quote routing",
      "Flag international compliance requirements earlier",
      "Integrate vendor certification database"
    ];
  };

  const updateLearningMetrics = (result: any) => {
    setLearningMetrics(prev => ({
      entityExtractionAccuracy: Math.min(prev.entityExtractionAccuracy + 0.02, 0.98),
      crossReferenceSuccess: Math.min(prev.crossReferenceSuccess + 0.03, 0.95),
      complexityHandling: Math.min(prev.complexityHandling + 0.015, 0.92),
      responseTimeImprovement: Math.min(prev.responseTimeImprovement + 0.01, 0.85)
    }));
  };

  const runCompleteScenario = async (scenario: AdvancedScenario) => {
    setSelectedScenario(scenario);
    setAnalysisResults([]);
    setCurrentEmailIndex(0);

    for (let i = 0; i < scenario.emails.length; i++) {
      setCurrentEmailIndex(i);
      await runSemanticAnalysis(scenario.emails[i]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    onScenarioComplete({
      scenario: scenario.name,
      results: analysisResults,
      metrics: learningMetrics
    });
  };

  return (
    <div className="space-y-6">
      {/* Advanced Scenario Selection */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-slate-900">Advanced Semantic Analysis Scenarios</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => runCompleteScenario(scenario)}
              disabled={isAnalyzing}
              className="text-left p-4 border-2 border-slate-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-slate-900">{scenario.name}</div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  scenario.difficulty === 'Expert' ? 'bg-red-100 text-red-800' :
                  scenario.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {scenario.difficulty}
                </div>
              </div>
              <div className="text-sm text-slate-600 mb-3">{scenario.description}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-600">Complexity: {scenario.complexity_score}/10</span>
                <span className="text-slate-500">{scenario.emails.length} emails</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Real-Time Semantic Processing */}
      {selectedScenario && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {selectedScenario.name} - Email {currentEmailIndex + 1} of {selectedScenario.emails.length}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Clock className="w-4 h-4" />
              <span>Processing: {isAnalyzing ? 'Active' : 'Complete'}</span>
            </div>
          </div>

          {semanticSteps && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">Semantic Query Analysis</h4>
                <div className="text-sm font-mono bg-slate-100 p-2 rounded text-slate-700">
                  {semanticSteps.query}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-blue-600" />
                    Reasoning Steps
                  </h4>
                  <div className="space-y-2">
                    {semanticSteps.reasoning_steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                          index < semanticSteps.confidence_progression.length
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-slate-100 text-slate-400'
                        }`}>
                          {index < semanticSteps.confidence_progression.length ? '✓' : index + 1}
                        </div>
                        <div className="text-sm text-slate-600">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center">
                    <Database className="w-4 h-4 mr-2 text-emerald-600" />
                    Knowledge Sources
                  </h4>
                  <div className="space-y-2">
                    {semanticSteps.knowledge_sources.map((source, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <div className="text-sm text-slate-600">{source}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {semanticSteps.confidence_progression.length > 0 && (
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-purple-600" />
                    Confidence Progression
                  </h4>
                  <div className="flex items-end space-x-2 h-16">
                    {semanticSteps.confidence_progression.map((confidence, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="bg-purple-600 rounded-t"
                          style={{ 
                            height: `${confidence * 60}px`,
                            width: '20px'
                          }}
                        />
                        <div className="text-xs text-slate-500 mt-1">
                          {Math.round(confidence * 100)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Learning Metrics Dashboard */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <Network className="w-5 h-5 mr-2 text-indigo-600" />
          Advanced Learning Metrics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-900">
                  {Math.round(learningMetrics.entityExtractionAccuracy * 100)}%
                </div>
                <div className="text-sm text-blue-700">Entity Extraction Accuracy</div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6 text-emerald-600" />
              <div>
                <div className="text-2xl font-bold text-emerald-900">
                  {Math.round(learningMetrics.crossReferenceSuccess * 100)}%
                </div>
                <div className="text-sm text-emerald-700">Cross-Reference Success</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-900">
                  {Math.round(learningMetrics.complexityHandling * 100)}%
                </div>
                <div className="text-sm text-purple-700">Complexity Handling</div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-900">
                  {Math.round(learningMetrics.responseTimeImprovement * 100)}%
                </div>
                <div className="text-sm text-orange-700">Response Time Improvement</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results Summary */}
      {analysisResults.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Advanced Analysis Results</h3>
          <div className="space-y-4">
            {analysisResults.map((result, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-slate-900">
                    Email {index + 1}: {result.analysis.intent}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      result.analysis.confidence >= 0.95 ? 'bg-emerald-100 text-emerald-800' :
                      result.analysis.confidence >= 0.9 ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {Math.round(result.analysis.confidence * 100)}% confidence
                    </div>
                    <div className="text-sm text-slate-500">
                      {result.analysis.advanced_metrics.processing_time}ms
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-slate-700">Entities Extracted:</span>
                    <span className="ml-2 text-slate-600">
                      {result.analysis.advanced_metrics.entity_extraction_count}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Cross-References:</span>
                    <span className="ml-2 text-slate-600">
                      {result.analysis.advanced_metrics.cross_reference_matches}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Complexity Score:</span>
                    <span className="ml-2 text-slate-600">
                      {result.analysis.advanced_metrics.complexity_score}/10
                    </span>
                  </div>
                </div>

                {result.semantic_insights && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="text-sm">
                      <span className="font-medium text-slate-700">Terminology Learned:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {result.semantic_insights.terminology_learned.map((term: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedEmailAnalyzer;