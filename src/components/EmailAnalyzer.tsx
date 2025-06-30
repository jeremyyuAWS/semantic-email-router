import React, { useState, useEffect } from "react";
import { Send, FileText, Target, Tag, Database, TrendingUp, Copy, Check, ExternalLink, Settings, Download, Clock, Users, Zap, Paperclip, Play, MessageCircle, Bot, User, ThumbsUp, Edit3, Brain, AlertTriangle } from "lucide-react";
import sampleEmails from "../../data/sample_emails.json";
import advancedScenariosData from "../../data/advanced_scenarios.json";
import AdvancedEmailAnalyzer from "./AdvancedEmailAnalyzer";
import { WorkflowState, ProcessedEmail, AnalysisResult, FeedbackUpdate } from "../types/workflow";

interface EmailAnalyzerProps {
  workflowState: WorkflowState;
  onEmailProcessed: (email: ProcessedEmail) => void;
  onLearningUpdate: (update: FeedbackUpdate) => void;
  onBulkModeChange: (enabled: boolean, scenarioId?: string) => void;
}

interface ProcessingStep {
  name: string;
  status: "pending" | "processing" | "complete";
  time: number;
}

interface ChatMessage {
  id: string;
  type: "user" | "agent";
  message: string;
  timestamp: string;
  metadata?: any;
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
  const [showJsonOutput, setShowJsonOutput] = useState(false);
  const [copied, setCopied] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedAttachments, setSelectedAttachments] = useState<any[]>([]);
  const [showAdvancedMode, setShowAdvancedMode] = useState(false);
  const [currentEmailContext, setCurrentEmailContext] = useState<any>(null);

  // Feedback System State
  const [showFeedbackChat, setShowFeedbackChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isAutoTyping, setIsAutoTyping] = useState(false);
  const [analysisUpdates, setAnalysisUpdates] = useState<FeedbackUpdate[]>([]);
  const [highlightedFields, setHighlightedFields] = useState<Set<string>>(new Set());

  // Combine regular and advanced scenarios
  const allScenarios = [
    ...sampleEmails.demo_scenarios,
    ...advancedScenariosData.complex_scenarios.map(scenario => ({
      id: scenario.id,
      name: scenario.name,
      description: scenario.description,
      emails: scenario.emails.map(email => email.id),
      theme: `Advanced semantic analysis - ${scenario.difficulty} level`,
      complexity_level: scenario.difficulty,
      complexity_score: scenario.complexity_score
    }))
  ];

  const initializeProcessingSteps = () => {
    return [
      { name: "Intent Detection", status: "pending" as const, time: 0 },
      { name: "Entity Extraction", status: "pending" as const, time: 0 },
      { name: "Knowledge Matching", status: "pending" as const, time: 0 },
      { name: "Routing Generation", status: "pending" as const, time: 0 }
    ];
  };

  const simulateProcessingStep = (stepIndex: number, steps: ProcessingStep[]): Promise<ProcessingStep[]> => {
    return new Promise(resolve => {
      const stepTime = 500 + Math.random() * 1000;
      
      setTimeout(() => {
        const newSteps = [...steps];
        newSteps[stepIndex] = {
          ...newSteps[stepIndex],
          status: "processing",
          time: Date.now()
        };
        setProcessingSteps(newSteps);

        setTimeout(() => {
          const completedSteps = [...newSteps];
          completedSteps[stepIndex] = {
            ...completedSteps[stepIndex],
            status: "complete",
            time: Date.now() - newSteps[stepIndex].time
          };
          resolve(completedSteps);
        }, stepTime);
      }, 200);
    });
  };

  const handleAnalyze = async () => {
    if (!emailContent.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisUpdates([]);
    setHighlightedFields(new Set());
    
    const steps = initializeProcessingSteps();
    setProcessingSteps(steps);

    let currentSteps = steps;
    
    // Process each step sequentially
    for (let i = 0; i < steps.length; i++) {
      currentSteps = await simulateProcessingStep(i, currentSteps);
      setProcessingSteps(currentSteps);
    }

    const totalProcessingTime = currentSteps.reduce((total, step) => total + step.time, 0);

    // Find matching sample email (check both regular and advanced scenarios)
    let matchingEmail = sampleEmails.emails.find(email => 
      emailContent.includes(email.content.substring(0, 50))
    );

    if (!matchingEmail) {
      // Check advanced scenarios
      for (const scenario of advancedScenariosData.complex_scenarios) {
        matchingEmail = scenario.emails.find(email => 
          emailContent.includes(email.content.substring(0, 50))
        );
        if (matchingEmail) break;
      }
    }

    // Store current email context for realistic feedback
    setCurrentEmailContext(matchingEmail);

    let result: AnalysisResult;
    if (matchingEmail) {
      result = {
        intent: matchingEmail.expected_analysis.intent,
        entities: matchingEmail.expected_analysis.entities,
        routing_tags: matchingEmail.expected_analysis.routing_tags,
        knowledge_base_match: {
          source: matchingEmail.industry === "Construction" 
            ? "Service_Catalog_2025.xlsx" 
            : matchingEmail.industry === "Healthcare"
            ? "Medical_Equipment_Database.xlsx"
            : matchingEmail.industry === "Legal"
            ? "Legal_Services_Rate_Card.pdf"
            : "Penn_2025_Product_Catalog.xlsx",
          row: matchingEmail.industry === "Construction" ? 88 : 
               matchingEmail.industry === "Healthcare" ? 847 :
               matchingEmail.industry === "Legal" ? 7 : 172,
          content: matchingEmail.industry === "Construction"
            ? "DPK-05: Five 20-yard dumpsters with pickup service - $2,850 base price, 24-48 hour response"
            : matchingEmail.industry === "Healthcare"
            ? "Siemens Magnetom Vida MRI-SIE-VIDA: E-2847 gradient coil temperature warning, 2-hour critical response"
            : matchingEmail.industry === "Legal"
            ? "Complex contract analysis: $850/hour Senior Partner, 40-60 hours typical for multi-party agreements"
            : "PIP-304-1.5OD-SCH40: 304 SS Pipe 1.5\" OD Schedule 40 - $28.50/ft, In Stock, 2-3 day lead time",
          confidence: matchingEmail.expected_analysis.confidence,
          retrievalTime: 200 + Math.random() * 300
        },
        confidence: matchingEmail.expected_analysis.confidence,
        structured_output: {
          crm_ready: true,
          sharepoint_path: matchingEmail.industry === "Construction" 
            ? "/Sites/Operations/ServiceRequests/2025" 
            : matchingEmail.industry === "Healthcare"
            ? "/Sites/Medical/EquipmentService/2025"
            : matchingEmail.industry === "Legal"
            ? "/Sites/Legal/ContractReview/2025"
            : "/Sites/Sales/ProductOrders/2025",
          next_actions: matchingEmail.industry === "Construction"
            ? ["Generate service quote", "Check equipment availability", "Schedule site visit"]
            : matchingEmail.industry === "Healthcare"
            ? ["Dispatch emergency technician", "Order replacement parts", "Schedule follow-up"]
            : matchingEmail.industry === "Legal"
            ? ["Assign senior partner", "Schedule client meeting", "Begin document review"]
            : ["Generate product quote", "Check inventory levels", "Verify specifications"]
        },
        processing_time: totalProcessingTime
      };

      if (matchingEmail.attachments) {
        setSelectedAttachments(matchingEmail.attachments);
      }

      // Create processed email object
      const processedEmail: ProcessedEmail = {
        id: `email_${Date.now()}`,
        content: emailContent,
        company: matchingEmail.company,
        industry: matchingEmail.industry,
        subject: matchingEmail.subject,
        attachments: matchingEmail.attachments,
        analysis: result,
        processingTime: totalProcessingTime,
        confidenceProgression: [result.confidence]
      };

      onEmailProcessed(processedEmail);
    } else {
      // Generic analysis for custom content
      result = {
        intent: "General Inquiry",
        entities: {
          extracted_topics: ["Customer communication", "Business inquiry"],
          estimated_urgency: "Medium",
          contact_method: "Email"
        },
        routing_tags: {
          department: "Customer Service",
          priority: "Normal",
          requires_follow_up: true,
          lead_qualification: "Cold"
        },
        confidence: 0.75,
        structured_output: {
          crm_ready: true,
          sharepoint_path: "/Sites/CustomerService/GeneralInquiries/2025",
          next_actions: ["Review inquiry", "Assign to specialist", "Follow up within 24h"]
        },
        processing_time: totalProcessingTime
      };

      const processedEmail: ProcessedEmail = {
        id: `email_${Date.now()}`,
        content: emailContent,
        company: "Unknown Company",
        industry: "General",
        subject: "Custom Email Analysis",
        analysis: result,
        processingTime: totalProcessingTime,
        confidenceProgression: [result.confidence]
      };

      onEmailProcessed(processedEmail);
    }

    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleBulkScenarioRun = async (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    onBulkModeChange(true, scenarioId);

    const scenario = allScenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    // For advanced scenarios, get the first email
    if (scenarioId.startsWith('multi_product') || scenarioId.startsWith('emergency') || scenarioId.startsWith('international')) {
      const advancedScenario = advancedScenariosData.complex_scenarios.find(s => s.id === scenarioId);
      if (advancedScenario && advancedScenario.emails.length > 0) {
        const firstEmail = advancedScenario.emails[0];
        setEmailContent(firstEmail.content);
        setSelectedAttachments(firstEmail.attachments || []);
        setCurrentEmailContext(firstEmail);
      }
    } else {
      // Regular scenario processing
      for (const emailId of scenario.emails) {
        const email = sampleEmails.emails.find(e => e.id === emailId);
        if (email) {
          setEmailContent(email.content);
          setSelectedAttachments(email.attachments || []);
          setCurrentEmailContext(email);
          await handleAnalyze();
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  };

  const loadSampleEmail = (emailId: string) => {
    let email = sampleEmails.emails.find(e => e.id === emailId);
    
    // If not found in regular emails, check advanced scenarios
    if (!email) {
      for (const scenario of advancedScenariosData.complex_scenarios) {
        email = scenario.emails.find(e => e.id === emailId);
        if (email) break;
      }
    }

    if (email) {
      setEmailContent(email.content);
      setAnalysisResult(null);
      setShowJsonOutput(false);
      setSelectedAttachments(email.attachments || []);
      setAnalysisUpdates([]);
      setHighlightedFields(new Set());
      setCurrentEmailContext(email);
    }
  };

  const handleAdvancedScenarioComplete = (results: any) => {
    console.log("Advanced scenario completed:", results);
    // Handle advanced scenario completion
  };

  const startFeedbackChat = () => {
    setShowFeedbackChat(true);
    
    // Generate contextual welcome message based on current analysis
    let welcomeMessage = "I can help improve this email analysis! ";
    
    if (currentEmailContext) {
      const industry = currentEmailContext.industry;
      const intent = analysisResult?.intent;
      
      if (industry === "Manufacturing") {
        welcomeMessage += "I notice this is a manufacturing inquiry. You can correct product specifications, material grades, quantities, or delivery requirements that I might have missed or misunderstood.";
      } else if (industry === "Healthcare") {
        welcomeMessage += "This appears to be a medical equipment issue. Please let me know if I misidentified equipment models, error codes, urgency levels, or service requirements.";
      } else if (industry === "Legal") {
        welcomeMessage += "For this legal document review request, you can correct the scope, timeline, compliance requirements, or budget I extracted from the email.";
      } else if (industry === "Construction") {
        welcomeMessage += "This looks like a construction/demolition service request. Help me understand if I got the service type, location details, timeline, or equipment requirements wrong.";
      } else {
        welcomeMessage += "You can provide corrections about the intent classification, extracted information, routing decisions, or teach me industry-specific terminology.";
      }
      
      welcomeMessage += "\n\nWhat would you like to correct or improve about this analysis?";
    } else {
      welcomeMessage += "You can provide corrections about extracted entities, intent classification, routing tags, or teach me business jargon specific to your industry. What would you like to improve?";
    }

    setChatMessages([
      {
        id: "welcome",
        type: "agent",
        message: welcomeMessage,
        timestamp: new Date().toISOString()
      }
    ]);

    // Show realistic auto-typing after a short delay
    setTimeout(() => {
      simulateContextualFeedback();
    }, 2000);
  };

  const simulateContextualFeedback = async () => {
    setIsAutoTyping(true);
    
    // Generate realistic corrections based on current email context
    let contextualCorrection = "";
    
    if (currentEmailContext) {
      const industry = currentEmailContext.industry;
      const content = currentEmailContext.content.toLowerCase();
      
      if (industry === "Manufacturing") {
        if (content.includes("304") || content.includes("stainless")) {
          contextualCorrection = "The material spec should be 316L stainless steel, not 304 - I can see from the application this is for food processing which requires 316L grade. Also, when customers say 'Schedule 40' they mean the wall thickness specification, not a delivery schedule.";
        } else if (content.includes("pipe") || content.includes("tube")) {
          contextualCorrection = "Priority should be High - the customer mentioned this is for a production line that's down. In manufacturing, any production halt is automatically high priority. Also, 'OD' means Outside Diameter and 'ID' means Inside Diameter.";
        } else {
          contextualCorrection = "The quantity looks wrong - they mentioned '50 pieces of 20-foot lengths' which should be captured as both count (50) AND total footage (1,000 feet). This affects pricing calculation in our system.";
        }
      } else if (industry === "Healthcare") {
        if (content.includes("mri") || content.includes("error")) {
          contextualCorrection = "Error code E-2847 is actually a critical alarm, not just a warning - this should route to Emergency Biomedical Engineering, not regular maintenance. Response time should be 'Immediate' not '2 hours' for gradient coil issues.";
        } else {
          contextualCorrection = "This is missing the patient impact assessment - when medical equipment fails, we need to know how many patients are affected and if there are backup systems available. That determines escalation level.";
        }
      } else if (industry === "Legal") {
        if (content.includes("contract") || content.includes("agreement")) {
          contextualCorrection = "The scope is broader than just 'contract review' - this involves FDA regulatory compliance, international trade law, and IP protection. Budget should be $15,000-$25,000 range, not the standard contract review rate.";
        } else {
          contextualCorrection = "Timeline is too aggressive - complex international agreements with regulatory components typically need 2-3 weeks minimum, not the standard 5-day contract review timeline.";
        }
      } else if (industry === "Construction") {
        if (content.includes("demolition") || content.includes("debris")) {
          contextualCorrection = "Site access is missing - downtown locations need special permits and restricted hours (usually 7 AM - 4 PM weekdays only). This affects both pricing and scheduling. Also, 'dumpster' should be 'roll-off container' in our system.";
        } else {
          contextualCorrection = "HVAC projects need prevailing wage calculations since this is a public works project. The routing should go to 'Licensed Trade Division' not general 'Construction' - union requirements are different.";
        }
      } else {
        contextualCorrection = "The intent classification missed the urgency indicators - phrases like 'ASAP' and 'need by Friday' should automatically flag as high priority and route to expedited handling queue.";
      }
    } else {
      contextualCorrection = "The system missed some key business context. When customers use abbreviations like 'SS' for stainless steel or 'Sch 80' for Schedule 80, the entity extraction should recognize these industry standard terms.";
    }
    
    // Simulate realistic typing speed
    let typedMessage = "";
    for (let i = 0; i < contextualCorrection.length; i++) {
      typedMessage += contextualCorrection[i];
      setNewMessage(typedMessage);
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 20));
    }
    
    setIsAutoTyping(false);
    
    // Auto-submit after typing
    setTimeout(() => {
      sendFeedbackMessage(contextualCorrection);
      setNewMessage("");
    }, 1500);
  };

  const sendFeedbackMessage = async (messageText?: string) => {
    const messageToSend = messageText || newMessage;
    if (!messageToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: "user",
      message: messageToSend,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    if (!messageText) setNewMessage("");
    setIsAgentTyping(true);

    const updatedAnalysis = await processFeedback(messageToSend);

    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

    let agentResponse = generateContextualAgentResponse(messageToSend, updatedAnalysis);

    const agentMessage: ChatMessage = {
      id: `agent_${Date.now()}`,
      type: "agent",
      message: agentResponse,
      timestamp: new Date().toISOString(),
      metadata: {
        feedback_processed: true,
        analysis_updated: updatedAnalysis.length > 0,
        confidence_improvement: 0.05 + Math.random() * 0.1
      }
    };

    setIsAgentTyping(false);
    setChatMessages(prev => [...prev, agentMessage]);

    if (updatedAnalysis.length > 0) {
      const newHighlights = new Set(highlightedFields);
      updatedAnalysis.forEach(update => newHighlights.add(update.field));
      setHighlightedFields(newHighlights);

      setTimeout(() => {
        setHighlightedFields(new Set());
      }, 5000);
    }
  };

  const processFeedback = async (feedback: string): Promise<FeedbackUpdate[]> => {
    if (!analysisResult) return [];

    const updates: FeedbackUpdate[] = [];
    const newResult = { ...analysisResult };
    const message = feedback.toLowerCase();

    // More sophisticated feedback processing based on context
    if (message.includes("intent should be") || message.includes("should be classified as") || message.includes("actually") && message.includes("not")) {
      const intentPatterns = [
        /intent should be ['"]?([^'".,!?]+)['"]?/i,
        /should be classified as ['"]?([^'".,!?]+)['"]?/i,
        /actually (?:a|an) ['"]?([^'".,!?]+)['"]?/i,
        /this is (?:a|an) ['"]?([^'".,!?]+)['"]?/i
      ];
      
      for (const pattern of intentPatterns) {
        const intentMatch = message.match(pattern);
        if (intentMatch) {
          const oldIntent = newResult.intent;
          const newIntent = intentMatch[1].trim();
          newResult.intent = newIntent;
          const update: FeedbackUpdate = {
            field: "intent",
            oldValue: oldIntent,
            newValue: newIntent,
            timestamp: new Date().toISOString(),
            confidence_improvement: 0.12,
            emailId: `email_${Date.now()}`
          };
          updates.push(update);
          onLearningUpdate(update);
          break;
        }
      }
    }

    // Handle priority corrections
    if (message.includes("priority should be") || message.includes("high priority") || message.includes("critical") || message.includes("immediate")) {
      const priorityMatch = message.match(/priority should be ['"]?([^'".,!?]+)['"]?/i) ||
                           (message.includes("high priority") ? ["", "High"] : null) ||
                           (message.includes("critical") || message.includes("immediate") ? ["", "Critical"] : null);
      
      if (priorityMatch) {
        const oldPriority = newResult.routing_tags.priority;
        const newPriority = priorityMatch[1] || "High";
        newResult.routing_tags.priority = newPriority;
        const update: FeedbackUpdate = {
          field: "routing_tags.priority",
          oldValue: oldPriority,
          newValue: newPriority,
          timestamp: new Date().toISOString(),
          confidence_improvement: 0.1,
          emailId: `email_${Date.now()}`
        };
        updates.push(update);
        onLearningUpdate(update);
      }
    }

    // Handle department routing corrections
    if (message.includes("should route to") || message.includes("department should") || message.includes("route to")) {
      const deptPatterns = [
        /should route to ['"]?([^'".,!?]+)['"]?/i,
        /department should be ['"]?([^'".,!?]+)['"]?/i,
        /route to ['"]?([^'".,!?]+)['"]?/i
      ];
      
      for (const pattern of deptPatterns) {
        const deptMatch = message.match(pattern);
        if (deptMatch) {
          const oldDept = newResult.routing_tags.department;
          const newDept = deptMatch[1].trim();
          newResult.routing_tags.department = newDept;
          const update: FeedbackUpdate = {
            field: "routing_tags.department",
            oldValue: oldDept,
            newValue: newDept,
            timestamp: new Date().toISOString(),
            confidence_improvement: 0.08,
            emailId: `email_${Date.now()}`
          };
          updates.push(update);
          onLearningUpdate(update);
          break;
        }
      }
    }

    // Handle material/specification corrections
    if (message.includes("316l") || message.includes("material") || message.includes("specification") || message.includes("grade")) {
      if (newResult.entities.material_grade) {
        const oldGrade = newResult.entities.material_grade;
        const newGrade = message.includes("316l") ? "316L stainless steel" : 
                        message.includes("304") ? "304 stainless steel" : "Updated specification";
        newResult.entities.material_grade = newGrade;
        const update: FeedbackUpdate = {
          field: "entities.material_grade",
          oldValue: oldGrade,
          newValue: newGrade,
          timestamp: new Date().toISOString(),
          confidence_improvement: 0.15,
          emailId: `email_${Date.now()}`
        };
        updates.push(update);
        onLearningUpdate(update);
      }
    }

    // Handle quantity corrections
    if (message.includes("quantity") || message.includes("pieces") || message.includes("count")) {
      const quantityMatch = message.match(/(\d+)\s*(?:pieces?|units?|count)/i);
      if (quantityMatch && newResult.entities.quantity) {
        const oldQuantity = newResult.entities.quantity;
        const newQuantity = `${quantityMatch[1]} pieces`;
        newResult.entities.quantity = newQuantity;
        const update: FeedbackUpdate = {
          field: "entities.quantity",
          oldValue: oldQuantity,
          newValue: newQuantity,
          timestamp: new Date().toISOString(),
          confidence_improvement: 0.1,
          emailId: `email_${Date.now()}`
        };
        updates.push(update);
        onLearningUpdate(update);
      }
    }

    if (updates.length > 0) {
      newResult.confidence = Math.min(newResult.confidence + 0.05 * updates.length, 1.0);
    }

    setAnalysisResult(newResult);
    setAnalysisUpdates(prev => [...prev, ...updates]);
    
    return updates;
  };

  const generateContextualAgentResponse = (feedback: string, updates: FeedbackUpdate[]): string => {
    const message = feedback.toLowerCase();
    
    if (updates.length === 0) {
      return "Thank you for the feedback! I've noted your suggestions and they'll help improve future analysis. Even when no immediate changes are made, your input helps train the system to better understand your specific business context and industry terminology.";
    }

    let response = "Excellent feedback! I've made the following corrections:\n\n";
    
    updates.forEach(update => {
      const fieldName = update.field.split('.').pop()?.replace(/_/g, ' ') || update.field;
      response += `✓ Updated ${fieldName}: "${update.oldValue}" → "${update.newValue}"\n`;
    });

    // Add contextual learning insights
    if (currentEmailContext) {
      const industry = currentEmailContext.industry;
      
      if (industry === "Manufacturing" && (message.includes("316l") || message.includes("material"))) {
        response += "\n💡 I've learned that for food processing applications, 316L grade is required due to corrosion resistance. I'll prioritize material grade accuracy for similar manufacturing inquiries.";
      } else if (industry === "Healthcare" && (message.includes("critical") || message.includes("emergency"))) {
        response += "\n🚨 I now understand that medical equipment failures affecting patient care require immediate escalation, regardless of the specific error code. Patient safety is the top priority.";
      } else if (industry === "Legal" && (message.includes("scope") || message.includes("complex"))) {
        response += "\n⚖️ I've learned to identify when legal work involves multiple practice areas (regulatory, IP, international) which affects both timeline and pricing estimates.";
      } else if (industry === "Construction" && (message.includes("permit") || message.includes("access"))) {
        response += "\n🏗️ I now recognize that downtown/urban construction projects have additional constraints (permits, access hours, noise restrictions) that affect scheduling and pricing.";
      }
    }
    
    if (message.includes("asap") || message.includes("urgent") || message.includes("priority")) {
      response += "\n⏰ I've learned to better recognize urgency indicators in customer language and will adjust priority routing accordingly.";
    }

    if (message.includes("ss") || message.includes("sch") || message.includes("od") || message.includes("abbreviation")) {
      response += "\n📚 I've added this industry terminology to my knowledge base. Recognizing standard abbreviations improves entity extraction accuracy.";
    }

    const totalImprovement = updates.reduce((sum, u) => sum + u.confidence_improvement, 0);
    response += `\n\n📈 Overall confidence improved by ${Math.round(totalImprovement * 100)}%. This feedback makes me more accurate for similar emails!`;

    return response;
  };

  const exportResults = () => {
    if (!analysisResult) return;
    
    const exportData = {
      analysis_timestamp: new Date().toISOString(),
      email_content: emailContent,
      analysis_result: analysisResult,
      attachments: selectedAttachments,
      feedback_history: analysisUpdates,
      learning_metrics: workflowState.learningMetrics,
      business_context: currentEmailContext ? {
        industry: currentEmailContext.industry,
        company: currentEmailContext.company,
        complexity_score: currentEmailContext.complexity_score
      } : null
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email_analysis_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyJsonOutput = () => {
    if (analysisResult) {
      const output = {
        analysis_timestamp: new Date().toISOString(),
        analysis_id: `anlz_${Date.now()}`,
        email_analysis: analysisResult,
        integration_metadata: {
          processed_by: "Semantic Email Router v1.0",
          ready_for_crm_export: analysisResult.structured_output?.crm_ready || false,
          suggested_sharepoint_path: analysisResult.structured_output?.sharepoint_path,
          recommended_actions: analysisResult.structured_output?.next_actions,
          attachments_detected: selectedAttachments.length,
          feedback_iterations: analysisUpdates.length,
          learning_metrics: workflowState.learningMetrics,
          business_context: currentEmailContext ? {
            industry: currentEmailContext.industry,
            complexity_level: currentEmailContext.complexity_score || 'Standard'
          } : null
        }
      };
      navigator.clipboard.writeText(JSON.stringify(output, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-emerald-600 bg-emerald-100";
    if (confidence >= 0.8) return "text-blue-600 bg-blue-100";
    if (confidence >= 0.7) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return "Very High";
    if (confidence >= 0.8) return "High";
    if (confidence >= 0.7) return "Medium";
    return "Low";
  };

  const isFieldHighlighted = (fieldPath: string) => {
    return highlightedFields.has(fieldPath);
  };

  return (
    <div className="space-y-6">
      {/* Advanced Mode Toggle */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="font-semibold text-purple-900">Advanced Semantic Analysis Mode</h3>
              <p className="text-sm text-purple-700">Demonstrate complex multi-entity extraction and expert-level reasoning</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdvancedMode(!showAdvancedMode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showAdvancedMode 
                ? 'bg-purple-600 text-white'
                : 'bg-white text-purple-600 border border-purple-300 hover:bg-purple-50'
            }`}
          >
            {showAdvancedMode ? 'Exit Advanced Mode' : 'Enter Advanced Mode'}
          </button>
        </div>
      </div>

      {/* Advanced Mode Panel */}
      {showAdvancedMode && (
        <AdvancedEmailAnalyzer onScenarioComplete={handleAdvancedScenarioComplete} />
      )}

      {/* Regular Demo Scenarios */}
      {!showAdvancedMode && (
        <>
          {/* Demo Scenarios */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Play className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-slate-900">Demo Scenarios</h3>
              </div>
              <div className="text-sm text-slate-600">
                Pre-configured industry workflows with semantic complexity
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allScenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => handleBulkScenarioRun(scenario.id)}
                  className={`text-left p-4 border-2 rounded-lg transition-colors ${
                    selectedScenario === scenario.id
                      ? "border-purple-300 bg-purple-50"
                      : "border-slate-200 hover:border-purple-300 hover:bg-purple-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-slate-900">{scenario.name}</div>
                    {scenario.complexity_level && (
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        scenario.complexity_level === 'Expert' ? 'bg-red-100 text-red-800' :
                        scenario.complexity_level === 'Advanced' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {scenario.complexity_level}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-slate-600 mb-2">{scenario.description}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-600">
                      {scenario.emails.length} emails
                      {scenario.complexity_score && ` • ${scenario.complexity_score}/10 complexity`}
                    </span>
                    {scenario.theme.includes('Advanced') && (
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sample Email Loader */}
          <div className="bg-white rounded-xl border border-slate-200 p-6" id="sample-emails">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Start - Load Sample Email</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleEmails.emails.map((email) => (
                <button
                  key={email.id}
                  onClick={() => loadSampleEmail(email.id)}
                  className="text-left p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
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
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-blue-600 font-medium">
                      Intent: {email.expected_analysis.intent}
                    </div>
                    {email.attachments && email.attachments.length > 0 && (
                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <Paperclip className="w-3 h-3" />
                        <span>{email.attachments.length}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Email Input - Always show regardless of mode */}
      <div className="bg-white rounded-xl border border-slate-200 p-6" id="email-input">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">Email Content</h3>
          {workflowState.bulkMode && (
            <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              Bulk Mode: Learning progression active
            </div>
          )}
        </div>
        
        {/* Attachments Preview */}
        {selectedAttachments.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Detected Attachments:</h4>
            <div className="space-y-2">
              {selectedAttachments.map((attachment, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <Paperclip className="w-4 h-4 text-slate-500" />
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">{attachment.name}</div>
                    <div className="text-sm text-slate-600">{attachment.description}</div>
                  </div>
                  <div className="text-sm text-slate-500">{attachment.size}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <textarea
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          placeholder="Paste your email content here for semantic analysis..."
          className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            
            <div className="text-sm text-slate-500">
              {emailContent.length} characters
            </div>
            {analysisResult && (
              <button
                onClick={exportResults}
                className="flex items-center space-x-2 px-3 py-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Export</span>
              </button>
            )}
          </div>
          <button
            id="analyze-button"
            onClick={handleAnalyze}
            disabled={!emailContent.trim() || isAnalyzing}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>{isAnalyzing ? "Analyzing..." : "Analyze Email"}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {(isAnalyzing || analysisResult) && (
        <div className="bg-white rounded-xl border border-slate-200 p-6" id="analysis-results">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-slate-900">Analysis Results</h3>
              {analysisUpdates.length > 0 && (
                <div className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                  {analysisUpdates.length} improvement{analysisUpdates.length !== 1 ? 's' : ''} applied
                </div>
              )}
            </div>
            {analysisResult && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={startFeedbackChat}
                  className="flex items-center space-x-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </button>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>{analysisResult.processing_time}ms</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(analysisResult.confidence)}`}>
                  {getConfidenceLabel(analysisResult.confidence)} ({Math.round(analysisResult.confidence * 100)}%)
                </div>
                <button
                  onClick={() => setShowJsonOutput(!showJsonOutput)}
                  className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>{showJsonOutput ? "Hide" : "Show"} JSON</span>
                </button>
              </div>
            )}
          </div>

          {isAnalyzing ? (
            <div className="space-y-6">
              {/* Processing Steps */}
              <div className="space-y-4">
                {processingSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === "complete" ? "bg-emerald-100 text-emerald-600" :
                      step.status === "processing" ? "bg-blue-100 text-blue-600" :
                      "bg-slate-100 text-slate-400"
                    }`}>
                      {step.status === "complete" ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : step.status === "processing" ? (
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${
                        step.status === "complete" ? "text-emerald-900" :
                        step.status === "processing" ? "text-blue-900" :
                        "text-slate-600"
                      }`}>
                        {step.name}
                      </div>
                      {step.status === "complete" && step.time && (
                        <div className="text-sm text-slate-500">{step.time}ms</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center py-8">
                <div className="inline-flex items-center space-x-2 text-blue-600">
                  <TrendingUp className="w-5 h-5 animate-pulse" />
                  <span>Running semantic analysis pipeline...</span>
                </div>
                <div className="mt-2 text-sm text-slate-500">
                  AI agents processing email content with knowledge base grounding
                </div>
              </div>
            </div>
          ) : analysisResult && (
            <div className="space-y-6">
              {/* Intent Detection */}
              <div className={`${isFieldHighlighted('intent') ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''} rounded-lg p-4 transition-all duration-1000`}>
                <h4 className="text-sm font-medium text-slate-900 mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-blue-600" />
                  Detected Intent
                  {isFieldHighlighted('intent') && (
                    <Edit3 className="w-4 h-4 ml-2 text-emerald-600" />
                  )}
                </h4>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-lg font-semibold text-blue-900">{analysisResult.intent}</div>
                </div>
              </div>

              {/* Extracted Entities */}
              <div>
                <h4 className="text-sm font-medium text-slate-900 mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-emerald-600" />
                  Extracted Entities
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(analysisResult.entities).map(([key, value]) => (
                    <div key={key} className={`bg-slate-50 rounded-lg p-3 ${
                      isFieldHighlighted(`entities.${key}`) ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''
                    } transition-all duration-1000`}>
                      <div className="text-sm font-medium text-slate-700 capitalize mb-1 flex items-center">
                        {key.replace(/_/g, " ")}
                        {isFieldHighlighted(`entities.${key}`) && (
                          <Edit3 className="w-3 h-3 ml-2 text-emerald-600" />
                        )}
                      </div>
                      <div className="text-slate-900">{String(value)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Routing Tags */}
              <div>
                <h4 className="text-sm font-medium text-slate-900 mb-2 flex items-center">
                  <Send className="w-4 h-4 mr-2 text-orange-600" />
                  Routing Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(analysisResult.routing_tags).map(([key, value]) => (
                    <div key={key} className={`bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 ${
                      isFieldHighlighted(`routing_tags.${key}`) ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''
                    } transition-all duration-1000`}>
                      <div className="text-xs font-medium text-orange-700 uppercase tracking-wide flex items-center">
                        {key.replace(/_/g, " ")}
                        {isFieldHighlighted(`routing_tags.${key}`) && (
                          <Edit3 className="w-3 h-3 ml-2 text-emerald-600" />
                        )}
                      </div>
                      <div className="text-sm text-orange-900">{String(value)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Knowledge Base Match */}
              {analysisResult.knowledge_base_match && (
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-2 flex items-center">
                    <Database className="w-4 h-4 mr-2 text-purple-600" />
                    Knowledge Base Match
                  </h4>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-purple-900">
                        {analysisResult.knowledge_base_match.source}
                      </div>
                      <div className="text-sm text-purple-700">
                        {analysisResult.knowledge_base_match.row && `Row ${analysisResult.knowledge_base_match.row}`}
                        {analysisResult.knowledge_base_match.page && `Page ${analysisResult.knowledge_base_match.page}`}
                        <span className="ml-2">({analysisResult.knowledge_base_match.retrievalTime}ms)</span>
                      </div>
                    </div>
                    <div className="text-sm text-purple-800">
                      {analysisResult.knowledge_base_match.content}
                    </div>
                  </div>
                </div>
              )}

              {/* Integration Ready Output */}
              {analysisResult.structured_output && (
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-2 flex items-center">
                    <Settings className="w-4 h-4 mr-2 text-indigo-600" />
                    Integration Ready
                  </h4>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-indigo-900">CRM Export Ready:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        analysisResult.structured_output.crm_ready 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {analysisResult.structured_output.crm_ready ? 'Yes' : 'No'}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-indigo-900">SharePoint Path:</span>
                      <div className="mt-1 flex items-center space-x-2">
                        <code className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                          {analysisResult.structured_output.sharepoint_path}
                        </code>
                        <ExternalLink className="w-3 h-3 text-indigo-600" />
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-indigo-900">Recommended Actions:</span>
                      <ul className="mt-1 space-y-1">
                        {analysisResult.structured_output.next_actions.map((action, index) => (
                          <li key={index} className="text-sm text-indigo-800 flex items-start">
                            <span className="text-indigo-500 mr-2">•</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* JSON Output */}
              {showJsonOutput && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-slate-900 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-slate-600" />
                      Structured Output (JSON) - Integration Ready
                    </h4>
                    <button
                      onClick={copyJsonOutput}
                      className="flex items-center space-x-2 px-3 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span className="text-sm">{copied ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    {JSON.stringify({
                      analysis_timestamp: new Date().toISOString(),
                      analysis_id: `anlz_${Date.now()}`,
                      email_analysis: analysisResult,
                      integration_metadata: {
                        processed_by: "Semantic Email Router v1.0",
                        ready_for_crm_export: analysisResult.structured_output?.crm_ready || false,
                        suggested_sharepoint_path: analysisResult.structured_output?.sharepoint_path,
                        recommended_actions: analysisResult.structured_output?.next_actions,
                        attachments_detected: selectedAttachments.length,
                        feedback_iterations: analysisUpdates.length,
                        learning_metrics: workflowState.learningMetrics,
                        business_context: currentEmailContext ? {
                          industry: currentEmailContext.industry,
                          complexity_level: currentEmailContext.complexity_score || 'Standard'
                        } : null
                      }
                    }, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Feedback Chat Modal */}
      {showFeedbackChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Email Analysis Feedback</h3>
                  <p className="text-sm text-slate-600">
                    {currentEmailContext ? 
                      `Reviewing ${currentEmailContext.industry} email from ${currentEmailContext.company}` :
                      "Improve accuracy with corrections and teach business jargon"
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFeedbackChat(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-blue-100' : 'bg-indigo-100'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Bot className="w-4 h-4 text-indigo-600" />
                      )}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-900'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.message}</p>
                      {message.metadata?.feedback_processed && (
                        <div className="flex items-center space-x-1 mt-2 text-xs text-indigo-600">
                          <ThumbsUp className="w-3 h-3" />
                          <span>Analysis updated with your feedback</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isAgentTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="bg-slate-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-slate-200">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={isAutoTyping ? "Auto-typing realistic feedback..." : 
                    currentEmailContext ? 
                    `Provide corrections about this ${currentEmailContext.industry.toLowerCase()} email analysis...` :
                    "Provide corrections about intent, entities, routing, or teach business jargon..."
                  }
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onKeyPress={(e) => e.key === "Enter" && !isAutoTyping && sendFeedbackMessage()}
                  disabled={isAgentTyping || isAutoTyping}
                />
                <button
                  onClick={() => sendFeedbackMessage()}
                  disabled={!newMessage.trim() || isAgentTyping || isAutoTyping}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {currentEmailContext ? (
                  <p><strong>Context-aware examples:</strong> 
                    {currentEmailContext.industry === "Manufacturing" && " \"Material should be 316L grade\" • \"Priority is high - production line down\" • \"SS means stainless steel\""}
                    {currentEmailContext.industry === "Healthcare" && " \"This is critical, not standard priority\" • \"Error E-2847 needs immediate response\" • \"Patient impact: 12 critical care patients\""}
                    {currentEmailContext.industry === "Legal" && " \"Scope includes international compliance\" • \"Timeline needs 2-3 weeks minimum\" • \"Budget range $15-25K\""}
                    {currentEmailContext.industry === "Construction" && " \"Downtown requires permits\" • \"Route to Licensed Trade Division\" • \"Prevailing wage project\""}
                  </p>
                ) : (
                  <p><strong>Examples:</strong> "Priority should be High when customer says 'ASAP'" • "'SS' means stainless steel" • "Missing quantity - they want 25 pieces"</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailAnalyzer;