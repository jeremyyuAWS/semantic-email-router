import React, { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, PlayCircle, Target, Database, Settings } from "lucide-react";

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: "top" | "bottom" | "left" | "right";
  action?: string;
}

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
}

const tourSteps: TourStep[] = [
  {
    target: "welcome",
    title: "Welcome to Semantic Email Router",
    content: "This guided tour will show you how to transform unstructured emails into intelligent, routed data using AI. Let's start with analyzing a sample email.",
    position: "bottom"
  },
  {
    target: "sample-emails",
    title: "Sample Emails by Industry",
    content: "Choose from real-world emails across different industries. Each demonstrates different types of requests: orders, service calls, and professional inquiries.",
    position: "bottom",
    action: "Click a sample email to load it"
  },
  {
    target: "email-input",
    title: "Email Content Input",
    content: "Paste any customer email here. The AI will analyze intent, extract entities, and suggest routing tags based on your knowledge base.",
    position: "top"
  },
  {
    target: "analyze-button",
    title: "Semantic Analysis",
    content: "Click to start the AI analysis pipeline. Watch as multiple agents work together to understand and categorize your email.",
    position: "left",
    action: "Click 'Analyze Email' to see the magic happen"
  },
  {
    target: "analysis-results",
    title: "Structured Results",
    content: "See extracted intent, entities, routing tags, and knowledge base matches. All responses are grounded in your uploaded documents.",
    position: "top"
  },
  {
    target: "knowledge-tab",
    title: "Knowledge Base",
    content: "Upload your catalogs, service manuals, and documents. This eliminates AI hallucination by grounding responses in real data.",
    position: "bottom",
    action: "Switch to Knowledge Base tab"
  },
  {
    target: "integration-tab",
    title: "CRM Integration Ready",
    content: "View structured JSON output ready for SharePoint, Salesforce, or any CRM system. Real-time routing with confidence scores.",
    position: "bottom",
    action: "Check out the Admin & Integrations tab"
  }
];

const GuidedTour: React.FC<GuidedTourProps> = ({ isOpen, onClose, onTabChange }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setIsComplete(false);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Handle tab switching
      if (tourSteps[nextStep].target === "knowledge-tab") {
        onTabChange("knowledge");
      } else if (tourSteps[nextStep].target === "integration-tab") {
        onTabChange("admin");
      }
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      // Handle tab switching back
      if (tourSteps[prevStep].target === "welcome" || 
          tourSteps[prevStep].target === "sample-emails" ||
          tourSteps[prevStep].target === "email-input" ||
          tourSteps[prevStep].target === "analyze-button" ||
          tourSteps[prevStep].target === "analysis-results") {
        onTabChange("analyzer");
      }
    }
  };

  const handleSkip = () => {
    setIsComplete(true);
    setTimeout(onClose, 1000);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsComplete(false);
    onTabChange("analyzer");
  };

  if (!isOpen) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <PlayCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Guided Tour</h2>
              <p className="text-sm text-slate-600">
                {isComplete ? "Tour Complete!" : `Step ${currentStep + 1} of ${tourSteps.length}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {!isComplete && (
          <div className="px-6 pt-4">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {!isComplete ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  {currentTourStep.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {currentTourStep.content}
                </p>
                {currentTourStep.action && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">
                      👆 {currentTourStep.action}
                    </p>
                  </div>
                )}
              </div>

              {/* Step-specific content */}
              {currentStep === 0 && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-slate-900">Semantic Analysis</div>
                    <div className="text-xs text-slate-600">Intent & Entity Extraction</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <Database className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-slate-900">Knowledge Grounding</div>
                    <div className="text-xs text-slate-600">Document-based RAG</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-slate-900">Smart Routing</div>
                    <div className="text-xs text-slate-600">CRM Integration Ready</div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-slate-900">Available Demo Scenarios:</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-blue-900">🏭 Manufacturing Orders</span>
                      <span className="text-xs text-blue-700">Stainless steel, construction materials</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                      <span className="text-sm text-emerald-900">⚡ Emergency Services</span>
                      <span className="text-xs text-emerald-700">Medical equipment, urgent repairs</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm text-purple-900">⚖️ Professional Services</span>
                      <span className="text-xs text-purple-700">Legal, consulting, contracts</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Tour Complete!</h3>
                <p className="text-slate-600">
                  You're ready to start transforming unstructured emails into intelligent, routed data. 
                  Try analyzing different types of emails and see how the AI adapts to various industries and use cases.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-900 mb-1">Next: Try Real Emails</div>
                  <div className="text-blue-700">Paste your own customer emails to see analysis</div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <div className="font-medium text-emerald-900 mb-1">Upload Documents</div>
                  <div className="text-emerald-700">Add your catalogs for grounded responses</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-900 mb-1">Setup Integrations</div>
                  <div className="text-purple-700">Connect to CRM and email systems</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200">
          {!isComplete ? (
            <>
              <button
                onClick={handleSkip}
                className="text-slate-600 hover:text-slate-800 transition-colors"
              >
                Skip Tour
              </button>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>{currentStep === tourSteps.length - 1 ? "Finish" : "Next"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleRestart}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Restart Tour
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Start Using App
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuidedTour;