import React from "react";
import { X, Zap, Shield, Target, Database, TrendingUp, Users } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">How Semantic Email Router Works</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Overview */}
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Transform Email Chaos into Intelligent Routing</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              Semantic Email Router uses advanced AI to automatically understand, categorize, and route customer emails 
              with human-level comprehension. By grounding responses in your actual business documents, we eliminate 
              hallucination and ensure 95%+ routing accuracy.
            </p>
          </div>

          {/* Key Benefits */}
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Key Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-1">Lightning Fast Processing</h4>
                  <p className="text-sm text-slate-600">Reduce email triage time from hours to seconds with instant semantic analysis</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-1">Zero Hallucination</h4>
                  <p className="text-sm text-slate-600">All responses grounded in your actual catalogs, service codes, and business rules</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-1">Precision Routing</h4>
                  <p className="text-sm text-slate-600">Smart tags ensure every email reaches the right department with full context</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-1">CRM Ready</h4>
                  <p className="text-sm text-slate-600">Structured JSON output integrates seamlessly with SharePoint, Salesforce, or any CRM</p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-6">How It Works</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Email Intake & Parsing</h4>
                  <p className="text-slate-600">Customer emails are captured and preprocessed to extract key content and metadata</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Semantic Analysis</h4>
                  <p className="text-slate-600">AI models analyze intent (Quote, Order, Inquiry) and extract entities like products, quantities, dates, and locations</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Knowledge Base Matching</h4>
                  <p className="text-slate-600">RAG (Retrieval Augmented Generation) searches your uploaded catalogs and documents for exact matches</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Intelligent Routing</h4>
                  <p className="text-slate-600">Generate routing tags, priority levels, and structured output for seamless downstream integration</p>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Perfect For</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <TrendingUp className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="font-medium text-slate-900 mb-2">Manufacturing</h4>
                <p className="text-sm text-slate-600">Product orders, quote requests, spec inquiries</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
                <Users className="w-8 h-8 text-emerald-600 mb-3" />
                <h4 className="font-medium text-slate-900 mb-2">Service Companies</h4>
                <p className="text-sm text-slate-600">Service requests, scheduling, capability questions</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                <Database className="w-8 h-8 text-purple-600 mb-3" />
                <h4 className="font-medium text-slate-900 mb-2">Distribution</h4>
                <p className="text-sm text-slate-600">Inventory inquiries, bulk orders, supplier communication</p>
              </div>
            </div>
          </div>

          {/* Demo Instructions */}
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Try the Demo</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p><strong>Email Analyzer:</strong> Use sample emails or paste your own content to see semantic analysis in action</p>
              <p><strong>Knowledge Base:</strong> Explore how uploaded documents ground AI responses and eliminate hallucination</p>
              <p><strong>JSON Output:</strong> View structured data ready for CRM integration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;