import React, { useState } from "react";
import { Mail, Database, HelpCircle, Activity, Settings, Code2, Play, Users } from "lucide-react";
import EmailAnalyzer from "./components/EmailAnalyzer";
import KnowledgeBase from "./components/KnowledgeBase";
import AdminIntegrations from "./components/AdminIntegrations";
import DeveloperGuide from "./components/DeveloperGuide";
import InfoModal from "./components/InfoModal";
import GuidedTour from "./components/GuidedTour";
import IntegrationPanel from "./components/IntegrationPanel";
import WorkflowProgress from "./components/WorkflowProgress";
import BulkProcessingPanel from "./components/BulkProcessingPanel";
import LearningProgressPanel from "./components/LearningProgressPanel";
import { useWorkflowState } from "./hooks/useWorkflowState";

function App() {
  const [activeTab, setActiveTab] = useState("analyzer");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const {
    workflowState,
    crossTabData,
    addProcessedEmail,
    updateLearningMetrics,
    setBulkMode,
    setCurrentStep,
    generateBulkProcessingResults
  } = useWorkflowState();

  const tabs = [
    {
      id: "analyzer",
      name: "Email Analyzer",
      icon: Mail,
      description: "Paste and analyze customer emails with AI-powered semantic understanding"
    },
    {
      id: "knowledge",
      name: "Knowledge Base", 
      icon: Database,
      description: "Upload and manage documents that ground AI responses in real data"
    },
    {
      id: "admin",
      name: "Admin & Integrations",
      icon: Settings,
      description: "Configure API connections for Outlook, SharePoint, and CRM systems"
    },
    {
      id: "integration-testing",
      name: "Integration Testing",
      icon: Activity,
      description: "Test live connections to webhooks, CRM systems, and email platforms"
    },
    {
      id: "developer",
      name: "Developer Guide",
      icon: Code2,
      description: "Technical documentation and customization guide for engineers"
    }
  ];

  const getCurrentTabInfo = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    const tabInfo = {
      title: currentTab?.name || "Email Analyzer",
      description: currentTab?.description || "",
      features: [],
      businessValue: ""
    };

    switch (activeTab) {
      case "analyzer":
        tabInfo.features = [
          "Semantic intent detection (Quote, Order, Inquiry, Emergency)",
          "Multi-industry entity extraction (Manufacturing, Healthcare, Legal, Construction)", 
          "Smart routing tags with urgency detection",
          "Document-grounded responses with source attribution",
          "Confidence scoring and processing time metrics",
          "Email attachment detection and analysis",
          "Bulk processing with learning progression",
          "Real-time feedback integration and improvement"
        ];
        tabInfo.businessValue = "Automate front-door email routing with 95%+ accuracy across multiple industries, reducing manual triage time from hours to seconds while continuously learning from feedback to improve accuracy over time.";
        break;
      
      case "knowledge":
        tabInfo.features = [
          "Multi-format document upload (Excel, PDF, Word)",
          "Intelligent content parsing and chunking",
          "Semantic search with confidence scoring",
          "Real-time processing status and metrics",
          "Cross-tab retrieval integration",
          "Vector embedding and retrieval testing",
          "Industry-specific knowledge base templates",
          "Document versioning and update tracking"
        ];
        tabInfo.businessValue = "Eliminate AI hallucination by grounding responses in verified company documents. Knowledge base integration ensures all extracted insights reference actual catalog items, service codes, legal templates, and business rules with full source attribution.";
        break;
      
      case "admin":
        tabInfo.features = [
          "Secure API key management with encryption",
          "Outlook 365 / Gmail OAuth integration",
          "SharePoint document archiving configuration",
          "Salesforce / HubSpot CRM connection testing",
          "S3 / Azure blob storage for exports",
          "Webhook endpoint configuration and validation",
          "Multi-tenant isolation and access control",
          "Integration health monitoring and alerts"
        ];
        tabInfo.businessValue = "Seamless integration with existing business systems eliminates manual data entry and ensures extracted insights flow directly into your CRM, document management, and communication platforms with enterprise-grade security.";
        break;

      case "integration-testing":
        tabInfo.features = [
          "Live webhook endpoint testing",
          "Real-time CRM integration simulation",
          "OAuth flow testing for email platforms",
          "SharePoint upload and archiving tests",
          "Email signature parsing and contact extraction",
          "Error handling and retry logic validation",
          "Performance monitoring and latency testing",
          "Integration health dashboard"
        ];
        tabInfo.businessValue = "Validate all integration points before production deployment, ensuring reliable data flow and identifying potential issues early. Real-time testing reduces implementation risks and accelerates go-live timelines.";
        break;
      
      case "developer":
        tabInfo.features = [
          "Modular agent architecture documentation",
          "Custom prompt engineering and fine-tuning guide",
          "API reference with integration examples",
          "Security and scalability best practices",
          "Deployment guides for cloud providers",
          "Monitoring and observability setup",
          "Industry-specific customization templates",
          "Reinforcement learning implementation"
        ];
        tabInfo.businessValue = "Accelerate POC development and production deployment with comprehensive technical guidance, reducing implementation time from months to weeks while ensuring enterprise-grade scalability and security.";
        break;
    }

    return tabInfo;
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Update workflow step based on tab
    switch (tab) {
      case "analyzer":
        setCurrentStep("analysis");
        break;
      case "knowledge":
        setCurrentStep("knowledge");
        break;
      case "admin":
      case "integration-testing":
        setCurrentStep("routing");
        break;
      case "developer":
        setCurrentStep("complete");
        break;
    }
  };

  const handleStartBulkProcessing = () => {
    setIsBulkProcessing(true);
    setBulkMode(true);
    // Simulate bulk processing completion after 8 seconds
    setTimeout(() => {
      setIsBulkProcessing(false);
    }, 8000);
  };

  const handleEmailSelect = (email: any) => {
    setActiveTab("analyzer");
    setCurrentStep("analysis");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Semantic Email Router</h1>
                <p className="text-sm text-slate-600">From Unstructured Emails to Structured Intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowGuidedTour(true)}
                className="flex items-center space-x-2 px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Play className="w-5 h-5" />
                <span className="text-sm font-medium">Guided Tour</span>
              </button>
              <button
                onClick={() => setShowInfoModal(true)}
                className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm font-medium">How it works</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200" id="knowledge-tab">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={tab.id === "admin" ? "integration-tab" : undefined}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                  {workflowState.emails.length > 0 && tab.id === "analyzer" && (
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Workflow Progress Bar */}
          <WorkflowProgress 
            currentStep={workflowState.currentStep}
            emailsProcessed={workflowState.emails.length}
            onStepClick={setCurrentStep}
          />

          {/* Tab Description */}
          <div className="bg-white rounded-xl border border-slate-200 p-6" id="welcome">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              {getCurrentTabInfo().title}
            </h2>
            <p className="text-slate-600 mb-4">
              {getCurrentTabInfo().description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-2">Key Features:</h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  {getCurrentTabInfo().features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-2">Business Value:</h3>
                <p className="text-sm text-slate-600">
                  {getCurrentTabInfo().businessValue}
                </p>
              </div>
            </div>
          </div>

          {/* Cross-Tab Learning Progress Panel */}
          {workflowState.emails.length > 0 && (
            <LearningProgressPanel
              learningMetrics={workflowState.learningMetrics}
              recentUpdates={crossTabData.learningUpdates}
              onResetLearning={() => {
                // Reset learning state
                setBulkMode(false);
                setCurrentStep('analysis');
              }}
            />
          )}

          {/* Bulk Processing Panel (shown on analyzer tab when in bulk mode) */}
          {activeTab === "analyzer" && workflowState.bulkMode && (
            <BulkProcessingPanel
              isProcessing={isBulkProcessing}
              onStartBulkProcessing={handleStartBulkProcessing}
              onPauseBulkProcessing={() => setIsBulkProcessing(false)}
              bulkResults={generateBulkProcessingResults()}
              processedEmails={workflowState.emails}
              onEmailSelect={handleEmailSelect}
            />
          )}

          {/* Tab Content */}
          {activeTab === "analyzer" && (
            <EmailAnalyzer 
              workflowState={workflowState}
              onEmailProcessed={addProcessedEmail}
              onLearningUpdate={updateLearningMetrics}
              onBulkModeChange={setBulkMode}
            />
          )}
          {activeTab === "knowledge" && (
            <KnowledgeBase 
              crossTabQueries={crossTabData.knowledgeBaseQueries}
              lastAnalyzedEmail={crossTabData.lastAnalyzedEmail}
            />
          )}
          {activeTab === "admin" && <AdminIntegrations />}
          {activeTab === "integration-testing" && (
            <IntegrationPanel 
              processedEmails={workflowState.emails}
              routingResults={crossTabData.routingResults}
            />
          )}
          {activeTab === "developer" && <DeveloperGuide />}
        </div>
      </main>

      {/* Modals */}
      <InfoModal 
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
      
      <GuidedTour
        isOpen={showGuidedTour}
        onClose={() => setShowGuidedTour(false)}
        onTabChange={handleTabChange}
      />
    </div>
  );
}

export default App;