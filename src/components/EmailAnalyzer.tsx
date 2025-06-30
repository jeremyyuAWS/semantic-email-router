import React, { useState, useEffect } from "react";
import { Mail, Zap, Clock, Target, Brain, FileText, AlertTriangle, CheckCircle, TrendingUp, Users, Sparkles } from "lucide-react";
import sampleEmailsData from "../../data/sample_emails.json";
import { ProcessedEmail, AnalysisResult, WorkflowState, FeedbackUpdate } from "../types/workflow";

interface EmailAnalyzerProps {
  workflowState: WorkflowState;
  onEmailProcessed: (email: ProcessedEmail) => void;
  onLearningUpdate: (update: FeedbackUpdate) => void;
  onBulkModeChange: (enabled: boolean) => void;
}

const EmailAnalyzer: React.FC<EmailAnalyzerProps> = ({
  workflowState,
  onEmailProcessed,
  onLearningUpdate,
  onBulkModeChange
}) => {
  const [emailContent, setEmailContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSampleEmail, setSelectedSampleEmail] = useState<string | null>(null);
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(false);
  const [feedbackValue, setFeedbackValue] = useState("");

  const sampleEmails = sampleEmailsData.emails;
  const demoScenarios = sampleEmailsData.demo_scenarios;

  const analysisSteps = [
    "Parsing email content and metadata...",
    "Detecting intent and urgency patterns...", 
    "Extracting entities and technical specifications...",
    "Searching knowledge base for relevant matches...",
    "Generating routing tags and department assignments...",
    "Calculating confidence scores and preparing output..."
  ];

  // Enhanced analysis function that uses the realistic expected results
  const performSemanticAnalysis = async (content: string): Promise<AnalysisResult> => {
    setIsAnalyzing(true);
    setProcessingSteps([]);
    setCurrentStep(0);

    // Find matching sample email for realistic analysis
    const matchingSample = sampleEmails.find(email => {
      // Check if this is a sample email by comparing content similarity
      const contentWords = content.toLowerCase().split(/\s+/);
      const sampleWords = email.content.toLowerCase().split(/\s+/);
      
      // Calculate overlap percentage
      const overlap = contentWords.filter(word => 
        word.length > 3 && sampleWords.some(sampleWord => 
          sampleWord.includes(word) || word.includes(sampleWord)
        )
      ).length;
      
      return overlap > Math.min(contentWords.length, sampleWords.length) * 0.4;
    });

    // Process each step with realistic timing
    for (let i = 0; i < analysisSteps.length; i++) {
      setCurrentStep(i);
      setProcessingSteps(prev => [...prev, analysisSteps[i]]);
      
      // Variable timing based on step complexity
      const stepTiming = [800, 1200, 1500, 2000, 1000, 600];
      await new Promise(resolve => setTimeout(resolve, stepTiming[i] + Math.random() * 500));
    }

    let result: AnalysisResult;

    if (matchingSample) {
      // Use the realistic expected analysis for sample emails
      result = {
        ...matchingSample.expected_analysis,
        processing_time: 2500 + Math.random() * 1500
      };
    } else {
      // Generate realistic analysis for custom emails
      result = await generateCustomAnalysis(content);
    }

    setAnalysisResult(result);
    setIsAnalyzing(false);
    return result;
  };

  // Generate analysis for non-sample emails using intelligent parsing
  const generateCustomAnalysis = async (content: string): Promise<AnalysisResult> => {
    const lowerContent = content.toLowerCase();
    
    // Intent detection based on keywords and patterns
    let intent = "General Inquiry";
    if (lowerContent.includes("order") || lowerContent.includes("purchase") || lowerContent.includes("buy")) {
      intent = "Product Order Request";
    } else if (lowerContent.includes("quote") || lowerContent.includes("pricing") || lowerContent.includes("estimate")) {
      intent = "Quote Request";
    } else if (lowerContent.includes("urgent") || lowerContent.includes("emergency") || lowerContent.includes("critical")) {
      intent = lowerContent.includes("service") || lowerContent.includes("repair") ? 
        "Emergency Service Request" : "Urgent Order Request";
    } else if (lowerContent.includes("contract") || lowerContent.includes("agreement") || lowerContent.includes("legal")) {
      intent = "Legal Services Request";
    } else if (lowerContent.includes("support") || lowerContent.includes("help") || lowerContent.includes("issue")) {
      intent = "Support Request";
    }

    // Entity extraction using pattern matching
    const entities: Record<string, any> = {};
    
    // Extract quantities
    const quantityMatches = content.match(/(\d+)\s*(pieces?|units?|pounds?|feet|tons?|gallons?|each)/gi);
    if (quantityMatches) {
      entities.quantities = quantityMatches.map(match => match.trim());
    }

    // Extract materials/products
    const materialPatterns = [
      /\b\d+[LH]?\s+(?:stainless\s+)?steel\b/gi,
      /\bschedule\s+\d+\b/gi,
      /\b\d+["']\s*(?:od|id|diameter)\b/gi,
      /\b(?:304|316L?|carbon)\s+steel\b/gi
    ];
    
    materialPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        entities.materials = entities.materials || [];
        entities.materials.push(...matches);
      }
    });

    // Extract dates and deadlines
    const datePatterns = [
      /\b(?:by\s+)?(?:friday|monday|tuesday|wednesday|thursday|saturday|sunday)\b/gi,
      /\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:st|nd|rd|th)?\b/gi,
      /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/gi
    ];
    
    datePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        entities.deadlines = entities.deadlines || [];
        entities.deadlines.push(...matches);
      }
    });

    // Extract contact information
    const emailMatch = content.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    const phoneMatch = content.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    
    if (emailMatch || phoneMatch) {
      entities.contact_info = {};
      if (emailMatch) entities.contact_info.email = emailMatch[0];
      if (phoneMatch) entities.contact_info.phone = phoneMatch[0];
    }

    // Generate routing tags based on content analysis
    const routing_tags: Record<string, any> = {
      priority: lowerContent.includes("urgent") || lowerContent.includes("emergency") || lowerContent.includes("critical") ? "High" : "Normal",
      department: "General",
      urgency: lowerContent.includes("asap") || lowerContent.includes("immediately") ? "Critical" : "Standard"
    };

    // Department routing based on content
    if (lowerContent.includes("stainless") || lowerContent.includes("steel") || lowerContent.includes("pipe")) {
      routing_tags.department = "Stainless Steel Sales";
    } else if (lowerContent.includes("demolition") || lowerContent.includes("construction") || lowerContent.includes("hvac")) {
      routing_tags.department = "Construction Services";
    } else if (lowerContent.includes("medical") || lowerContent.includes("hospital") || lowerContent.includes("mri")) {
      routing_tags.department = "Medical Equipment Services";
    } else if (lowerContent.includes("legal") || lowerContent.includes("contract") || lowerContent.includes("compliance")) {
      routing_tags.department = "Legal Services";
    }

    // Generate knowledge base match simulation
    let knowledge_base_match;
    if (entities.materials || lowerContent.includes("product") || lowerContent.includes("service")) {
      knowledge_base_match = {
        source: "General_Catalog_2025.xlsx",
        row: Math.floor(Math.random() * 500) + 1,
        content: "Related product or service found in knowledge base",
        confidence: 0.7 + Math.random() * 0.25
      };
    }

    const confidence = 0.75 + Math.random() * 0.2;

    return {
      intent,
      entities,
      routing_tags,
      knowledge_base_match,
      confidence: Math.min(confidence, 0.95),
      processing_time: 2000 + Math.random() * 2000
    };
  };

  const loadSampleEmail = (emailId: string) => {
    const email = sampleEmails.find(e => e.id === emailId);
    if (email) {
      setEmailContent(email.content);
      setSelectedSampleEmail(emailId);
      setAnalysisResult(null);
    }
  };

  const runDemoScenario = async (scenarioId: string) => {
    const scenario = demoScenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    onBulkModeChange(true);
    
    for (const emailId of scenario.emails) {
      const email = sampleEmails.find(e => e.id === emailId);
      if (email) {
        loadSampleEmail(emailId);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await handleAnalyze();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  };

  const handleAnalyze = async () => {
    if (!emailContent.trim()) return;

    const startTime = Date.now();
    const result = await performSemanticAnalysis(emailContent);
    const processingTime = Date.now() - startTime;

    // Find the matching sample email for complete data
    const matchingSample = sampleEmails.find(email => {
      const contentWords = emailContent.toLowerCase().split(/\s+/);
      const sampleWords = email.content.toLowerCase().split(/\s+/);
      const overlap = contentWords.filter(word => 
        word.length > 3 && sampleWords.some(sampleWord => 
          sampleWord.includes(word) || word.includes(sampleWord)
        )
      ).length;
      return overlap > Math.min(contentWords.length, sampleWords.length) * 0.4;
    });

    const processedEmail: ProcessedEmail = {
      id: `email_${Date.now()}`,
      content: emailContent,
      company: matchingSample?.company || "Custom Email",
      industry: matchingSample?.industry || "General",
      subject: matchingSample?.subject || "Email Analysis",
      attachments: matchingSample?.attachments || [],
      analysis: result,
      processingTime,
      confidenceProgression: [0.3, 0.5, 0.7, 0.85, result.confidence]
    };

    onEmailProcessed(processedEmail);
  };

  const submitFeedback = () => {
    if (!feedbackValue.trim() || !analysisResult) return;

    const feedbackUpdate: FeedbackUpdate = {
      field: "general_feedback",
      oldValue: "original_analysis",
      newValue: feedbackValue,
      timestamp: new Date().toISOString(),
      confidence_improvement: 0.05 + Math.random() * 0.1,
      emailId: selectedSampleEmail || "custom"
    };

    onLearningUpdate(feedbackUpdate);
    setFeedbackValue("");
    setShowFeedbackPanel(false);
  };

  const getProgressColor = (step: number) => {
    if (step < currentStep) return "text-emerald-600";
    if (step === currentStep) return "text-blue-600";
    return "text-slate-400";
  };

  return (
    <div className="space-y-6">
      {/* Sample Email Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-6" id="sample-emails">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-slate-900">Try Industry-Specific Sample Emails</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {sampleEmails.map((email) => (
            <button
              key={email.id}
              onClick={() => loadSampleEmail(email.id)}
              className={`text-left p-4 border-2 rounded-lg transition-colors ${
                selectedSampleEmail === email.id
                  ? "border-purple-300 bg-purple-50"
                  : "border-slate-200 hover:border-purple-200 hover:bg-purple-25"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-slate-900">{email.company}</div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  email.industry === "Construction" ? "bg-orange-100 text-orange-800" :
                  email.industry === "Healthcare" ? "bg-red-100 text-red-800" :
                  email.industry === "Legal" ? "bg-purple-100 text-purple-800" :
                  "bg-blue-100 text-blue-800"
                }`}>
                  {email.industry}
                </div>
              </div>
              <div className="text-sm text-slate-600 mb-2">{email.subject}</div>
              <div className="text-xs text-slate-500">
                Expected: {email.expected_analysis.intent}
              </div>
            </button>
          ))}
        </div>

        {/* Demo Scenarios */}
        <div className="border-t border-slate-200 pt-4">
          <h4 className="font-medium text-slate-900 mb-3">Or Run Complete Demo Scenarios:</h4>
          <div className="flex flex-wrap gap-3">
            {demoScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => runDemoScenario(scenario.id)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors text-sm font-medium"
              >
                {scenario.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Email Input */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Mail className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">Email Content Analysis</h3>
        </div>
        
        <div className="space-y-4" id="email-input">
          <textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            placeholder="Paste your customer email content here... The AI will analyze intent, extract entities, and suggest routing based on your knowledge base."
            className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              {emailContent.length} characters • {emailContent.split(/\s+/).filter(w => w.length > 0).length} words
            </div>
            <button
              onClick={handleAnalyze}
              disabled={!emailContent.trim() || isAnalyzing}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              id="analyze-button"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Analyze Email</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Processing Steps */}
      {isAnalyzing && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-slate-900">AI Processing Pipeline</h3>
          </div>
          
          <div className="space-y-3">
            {analysisSteps.map((step, index) => (
              <div key={index} className={`flex items-center space-x-3 ${getProgressColor(index)}`}>
                <div className="flex-shrink-0">
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : index === currentStep ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-current rounded-full opacity-30" />
                  )}
                </div>
                <span className="text-sm font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && !isAnalyzing && (
        <div className="space-y-6" id="analysis-results">
          {/* Intent & Confidence */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-semibold text-slate-900">Analysis Results</h3>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  analysisResult.confidence >= 0.9 ? "bg-emerald-100 text-emerald-800" :
                  analysisResult.confidence >= 0.8 ? "bg-blue-100 text-blue-800" :
                  analysisResult.confidence >= 0.7 ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {Math.round(analysisResult.confidence * 100)}% confidence
                </div>
                <div className="text-sm text-slate-500">
                  {analysisResult.processing_time?.toFixed(0)}ms
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Detected Intent</h4>
                <div className="text-lg text-blue-600 font-semibold mb-4">
                  {analysisResult.intent}
                </div>
                
                <h4 className="font-medium text-slate-900 mb-2">Routing Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(analysisResult.routing_tags || {}).map(([key, value]) => (
                    <span key={key} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {key}: {String(value)}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-2">Extracted Entities</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Object.entries(analysisResult.entities || {}).map(([key, value]) => (
                    <div key={key} className="border border-slate-200 rounded-lg p-3">
                      <div className="font-medium text-slate-700 capitalize mb-1">
                        {key.replace(/_/g, " ")}
                      </div>
                      <div className="text-sm text-slate-600">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Knowledge Base Match */}
          {analysisResult.knowledge_base_match && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h4 className="font-medium text-emerald-900">Knowledge Base Match Found</h4>
                <div className="px-2 py-1 bg-emerald-200 text-emerald-800 rounded text-xs font-medium">
                  {Math.round(analysisResult.knowledge_base_match.confidence * 100)}% match
                </div>
              </div>
              <div className="text-sm text-emerald-800 mb-2">
                <strong>Source:</strong> {analysisResult.knowledge_base_match.source}
                {analysisResult.knowledge_base_match.row && ` • Row ${analysisResult.knowledge_base_match.row}`}
              </div>
              <div className="text-emerald-700">
                {analysisResult.knowledge_base_match.content}
              </div>
            </div>
          )}

          {/* Structured Output for CRM */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h4 className="font-medium text-slate-900 mb-4">Structured Output (CRM Ready)</h4>
            <div className="bg-slate-50 rounded-lg p-4">
              <pre className="text-sm text-slate-700 overflow-x-auto">
{JSON.stringify({
  intent: analysisResult.intent,
  entities: analysisResult.entities,
  routing: analysisResult.routing_tags,
  knowledge_match: analysisResult.knowledge_base_match,
  confidence: analysisResult.confidence,
  timestamp: new Date().toISOString()
}, null, 2)}
              </pre>
            </div>
          </div>

          {/* Feedback Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-slate-900">Provide Feedback to Improve Analysis</h4>
              <button
                onClick={() => setShowFeedbackPanel(!showFeedbackPanel)}
                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {showFeedbackPanel ? "Hide" : "Give Feedback"}
              </button>
            </div>
            
            {showFeedbackPanel && (
              <div className="space-y-3">
                <textarea
                  value={feedbackValue}
                  onChange={(e) => setFeedbackValue(e.target.value)}
                  placeholder="What should be corrected? (e.g., 'Intent should be Emergency Service, not Quote Request' or 'Missing extraction of deadline Friday')"
                  className="w-full h-20 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
                <button
                  onClick={submitFeedback}
                  disabled={!feedbackValue.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  Submit Feedback
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailAnalyzer;