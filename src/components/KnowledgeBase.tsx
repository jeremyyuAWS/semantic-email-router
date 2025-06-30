import React, { useState, useEffect } from "react";
import { Upload, FileText, Search, Database, CheckCircle, Clock, AlertCircle, Eye, MessageCircle, Send, Bot, User, ThumbsUp, ExternalLink } from "lucide-react";
import knowledgeBaseData from "../../data/knowledge_base.json";
import { ProcessedEmail } from "../types/workflow";

interface KnowledgeFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploaded_date: string;
  status: string;
  rows_extracted?: number;
  pages_extracted?: number;
  description: string;
}

interface SearchResult {
  document: string;
  content: string;
  score: number;
  metadata: any;
  source_row?: number;
  source_page?: number;
}

interface ChatMessage {
  id: string;
  type: "user" | "agent";
  message: string;
  timestamp: string;
  metadata?: any;
}

interface KnowledgeBaseProps {
  crossTabQueries?: string[];
  lastAnalyzedEmail?: ProcessedEmail;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  crossTabQueries = [],
  lastAnalyzedEmail
}) => {
  const [files] = useState<KnowledgeFile[]>(knowledgeBaseData.uploaded_files);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Feedback Chat State
  const [showFeedbackChat, setShowFeedbackChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  // Auto-populate search from cross-tab workflow
  useEffect(() => {
    if (lastAnalyzedEmail && crossTabQueries.length > 0) {
      const latestQuery = crossTabQueries[crossTabQueries.length - 1];
      if (latestQuery && latestQuery.trim()) {
        setSearchQuery(latestQuery);
        performIntelligentSearch(latestQuery);
      }
    }
  }, [lastAnalyzedEmail, crossTabQueries]);

  const initializeFeedbackChat = () => {
    let welcomeMessage = "I can help improve knowledge base search and document retrieval! ";
    
    if (lastAnalyzedEmail) {
      const industry = lastAnalyzedEmail.industry;
      const company = lastAnalyzedEmail.company;
      
      welcomeMessage += `I see you just analyzed an email from ${company} in the ${industry} industry. `;
      
      if (industry === "Manufacturing") {
        welcomeMessage += "For manufacturing searches, I can learn about product specifications, material grades, dimensions, and supplier catalogs. Help me understand if search results are missing technical details or industry terminology.";
      } else if (industry === "Healthcare") {
        welcomeMessage += "For medical equipment searches, I can improve how I find service codes, error code meanings, response times, and equipment specifications. Let me know if search results don't match clinical urgency or equipment details.";
      } else if (industry === "Legal") {
        welcomeMessage += "For legal document searches, I can better understand service rates, practice areas, compliance requirements, and case complexity. Help me improve how I match legal work scope to fee schedules.";
      } else if (industry === "Construction") {
        welcomeMessage += "For construction service searches, I can learn about permit requirements, union regulations, material specifications, and project timelines. Tell me if search results miss important project constraints or requirements.";
      }
    } else {
      welcomeMessage += "You can help me improve document search accuracy by pointing out when results don't match what you're looking for, when important documents are missing, or when I need to understand industry-specific terminology better.";
    }
    
    welcomeMessage += "\n\nWhat would you like to help me improve about the knowledge base search?";
    
    setChatMessages([
      {
        id: "welcome",
        type: "agent",
        message: welcomeMessage,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  // Enhanced search that actually works with the sample data
  const performIntelligentSearch = async (query: string): Promise<SearchResult[]> => {
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const results: SearchResult[] = [];
    const searchTerms = query.toLowerCase().split(' ');

    // Search through all uploaded files and their sample data
    knowledgeBaseData.uploaded_files.forEach(file => {
      if (file.sample_data) {
        file.sample_data.forEach((row: any, index: number) => {
          let score = 0;
          let matchedFields: string[] = [];
          
          // Calculate relevance score by checking how many search terms match
          Object.entries(row).forEach(([key, value]) => {
            const fieldValue = String(value).toLowerCase();
            searchTerms.forEach(term => {
              if (fieldValue.includes(term)) {
                score += 1;
                if (!matchedFields.includes(key)) {
                  matchedFields.push(key);
                }
              }
            });
          });

          // If we have matches, add to results
          if (score > 0) {
            const normalizedScore = Math.min(score / (searchTerms.length * 2), 1);
            
            // Create content summary highlighting matched fields
            let content = "";
            if (row.service_name || row.product_name) {
              content = `${row.service_name || row.product_name}: `;
            }
            if (row.description) {
              content += row.description;
            }
            if (row.base_price || row.price_per_foot || row.price_per_sheet) {
              content += ` - ${row.base_price || row.price_per_foot || row.price_per_sheet}`;
            }
            if (row.stock_status) {
              content += ` (${row.stock_status})`;
            }
            if (row.lead_time || row.response_time) {
              content += ` • ${row.lead_time || row.response_time}`;
            }

            results.push({
              document: file.name,
              content: content || JSON.stringify(row),
              score: normalizedScore,
              metadata: row,
              source_row: row.row || index + 1
            });
          }
        });
      }

      // Also search through PDF sections if available
      if (file.sample_sections) {
        file.sample_sections.forEach((section: any, index: number) => {
          let score = 0;
          const sectionText = `${section.section} ${section.content}`.toLowerCase();
          
          searchTerms.forEach(term => {
            if (sectionText.includes(term)) {
              score += 1;
            }
          });

          if (score > 0) {
            const normalizedScore = Math.min(score / searchTerms.length, 1);
            results.push({
              document: file.name,
              content: `${section.section}: ${section.content}`,
              score: normalizedScore,
              metadata: section,
              source_page: section.page
            });
          }
        });
      }
    });

    // Sort by relevance score (highest first) and limit results
    const sortedResults = results
      .sort((a, b) => b.score - a.score)
      .slice(0, 8); // Limit to top 8 results

    setSearchResults(sortedResults);
    setIsSearching(false);
    return sortedResults;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    await performIntelligentSearch(searchQuery);
  };

  const sendFeedbackMessage = async () => {
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: "user",
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const originalMessage = newMessage;
    setNewMessage("");
    setIsAgentTyping(true);

    // Simulate agent thinking time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

    // Generate contextual agent response based on message content and search context
    let agentResponse = "";
    const message = originalMessage.toLowerCase();

    if (message.includes("search") || message.includes("didn't find") || message.includes("missing") || message.includes("not finding")) {
      if (searchQuery.includes("stainless") || searchQuery.includes("steel") || searchQuery.includes("316") || searchQuery.includes("304")) {
        agentResponse = "I understand the search isn't finding the right stainless steel specifications. I'll improve how I match material grades (304 vs 316L), dimensions (OD, wall thickness), and surface finishes. This is crucial for manufacturing inquiries where wrong material specs can be costly. Your feedback helps me understand that steel grade accuracy is critical for food processing vs general industrial applications.";
      } else if (searchQuery.includes("mri") || searchQuery.includes("error") || searchQuery.includes("medical")) {
        agentResponse = "You're right that medical equipment searches need better error code matching. I'll enhance how I connect equipment models with specific error codes, response times, and service requirements. For medical equipment, getting the wrong service response can affect patient care, so accuracy is critical. I'm learning to prioritize emergency vs routine service codes.";
      } else if (searchQuery.includes("demolition") || searchQuery.includes("hvac") || searchQuery.includes("construction")) {
        agentResponse = "I see the construction service searches need improvement. I'll better understand permit requirements, union constraints, site access limitations, and equipment specifications. Construction projects have many variables (location, timing, regulations) that affect service delivery. Your feedback helps me learn these dependencies.";
      } else if (searchQuery.includes("contract") || searchQuery.includes("legal") || searchQuery.includes("compliance")) {
        agentResponse = "The legal document searches should better match practice areas, compliance requirements, and fee structures. I'll improve how I understand contract complexity levels, regulatory scope, and appropriate attorney expertise. Legal work varies dramatically in scope and I'm learning to match complexity to resources.";
      } else {
        agentResponse = "Thank you for the search feedback! I'm noting what types of documents and information you expected to find. This helps me improve semantic matching between queries and our knowledge base content. I'll adjust how I weight different document sections and metadata for better retrieval accuracy.";
      }
    } else if (message.includes("wrong") || message.includes("incorrect") || message.includes("should") || message.includes("actually")) {
      agentResponse = "I appreciate the correction! I'm updating how I categorize and tag this type of content. When you tell me what should have been found instead, it helps train my understanding of your business context and terminology. These corrections directly improve future search accuracy for similar queries.";
    } else if (message.includes("terminology") || message.includes("abbreviation") || message.includes("means") || message.includes("jargon")) {
      agentResponse = "Excellent! Learning industry terminology is crucial for accurate search. I'm adding this language to my understanding of your business domain. When you teach me that 'SS' means stainless steel or 'Sch 80' refers to wall thickness, it helps me better match customer language to technical specifications in your catalogs.";
    } else if (message.includes("priority") || message.includes("urgent") || message.includes("emergency")) {
      agentResponse = "I understand this involves urgency classification in search results. I'm learning to better surface emergency procedures, expedited services, and critical response information when queries indicate time-sensitive situations. This helps ensure urgent requests get matched to appropriate service levels and response times.";
    } else if (message.includes("confidence") || message.includes("score") || message.includes("accuracy")) {
      agentResponse = "Your feedback about confidence and accuracy is very valuable. I'll adjust how I score search results and set thresholds for what constitutes a good match. When you tell me results should be more or less confident, it helps calibrate my matching algorithms to your business standards.";
    } else {
      agentResponse = "Thank you for this feedback! I'm processing your input and updating my understanding of how to better serve your knowledge base searches. Every piece of feedback helps me learn your business context, terminology, and what information is most important for different types of inquiries. This improves search accuracy for your entire team.";
    }

    const agentMessage: ChatMessage = {
      id: `agent_${Date.now()}`,
      type: "agent",
      message: agentResponse,
      timestamp: new Date().toISOString(),
      metadata: {
        feedback_processed: true,
        search_improvements_applied: true,
        confidence_adjustment: Math.random() * 0.1 + 0.05
      }
    };

    setIsAgentTyping(false);
    setChatMessages(prev => [...prev, agentMessage]);
  };

  const startFeedbackChat = () => {
    setShowFeedbackChat(true);
    initializeFeedbackChat();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Processed":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "Processing":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "Error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "Excel":
        return "bg-emerald-100 text-emerald-800";
      case "PDF":
        return "bg-red-100 text-red-800";
      case "Word":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // Simulate file upload
    alert("File upload simulation - In production, files would be processed and embedded for semantic search");
  };

  const getSelectedFileData = () => {
    const file = files.find(f => f.id === selectedFile);
    if (!file) return null;

    const originalFile = knowledgeBaseData.uploaded_files.find(f => f.id === selectedFile);
    return originalFile;
  };

  const quickSearchExamples = [
    "316L stainless steel pipe pharmaceutical",
    "emergency medical equipment MRI",
    "demolition debris pickup downtown",
    "contract review legal services international",
    "HVAC installation prevailing wage",
    "340B pharmaceutical compliance"
  ];

  return (
    <div className="space-y-6">
      {/* Cross-Tab Integration Status */}
      {lastAnalyzedEmail && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <ExternalLink className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-blue-900">Cross-Tab Integration Active</h4>
              <p className="text-sm text-blue-700">
                Knowledge base is being queried from email analysis for: <strong>{lastAnalyzedEmail.company}</strong> ({lastAnalyzedEmail.industry})
              </p>
            </div>
          </div>
          {crossTabQueries.length > 0 && (
            <div className="mt-3">
              <div className="text-sm text-blue-800 mb-2">Recent queries from Email Analyzer:</div>
              <div className="flex flex-wrap gap-2">
                {crossTabQueries.slice(-3).map((query, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(query)}
                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-sm transition-colors"
                  >
                    "{query}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* File Upload Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Upload className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">Upload Documents</h3>
        </div>
        
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver 
              ? "border-blue-400 bg-blue-50" 
              : "border-slate-300 hover:border-slate-400"
          }`}
        >
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-slate-900 mb-2">
            {isDragOver ? "Drop files here" : "Upload Knowledge Base Files"}
          </h4>
          <p className="text-slate-600 mb-4">
            Drag and drop files here, or click to browse
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
            <span>Supports: Excel (.xlsx)</span>
            <span>•</span>
            <span>PDF (.pdf)</span>
            <span>•</span>
            <span>Word (.docx)</span>
          </div>
          <button
            onClick={() => alert("File upload simulation - Select files to process")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Choose Files
          </button>
        </div>
      </div>

      {/* Files List */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-slate-900">Uploaded Files</h3>
          </div>
          <div className="text-sm text-slate-600">
            {files.length} files processed • {knowledgeBaseData.processing_stats.total_chunks} chunks indexed
          </div>
        </div>

        <div className="space-y-4">
          {files.map((file) => (
            <div key={file.id} className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(file.status)}
                  <div>
                    <div className="font-medium text-slate-900">{file.name}</div>
                    <div className="text-sm text-slate-600">{file.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getFileTypeColor(file.type)}`}>
                    {file.type}
                  </div>
                  <div className="text-sm text-slate-500">{file.size}</div>
                  <button
                    onClick={() => setSelectedFile(selectedFile === file.id ? null : file.id)}
                    className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Preview</span>
                  </button>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                <div className="flex items-center space-x-4">
                  {file.rows_extracted && (
                    <span>{file.rows_extracted} rows extracted</span>
                  )}
                  {file.pages_extracted && (
                    <span>{file.pages_extracted} pages extracted</span>
                  )}
                </div>
                <div>Uploaded {file.uploaded_date}</div>
              </div>

              {/* File Preview */}
              {selectedFile === file.id && (
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <h4 className="font-medium text-slate-900 mb-3">Sample Data Preview</h4>
                  {getSelectedFileData()?.sample_data && (
                    <div className="space-y-3">
                      {getSelectedFileData()?.sample_data.slice(0, 2).map((row: any, index: number) => (
                        <div key={index} className="bg-slate-50 rounded-lg p-3">
                          <div className="text-sm font-medium text-slate-700 mb-2">
                            Row {row.row || index + 1}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {Object.entries(row).filter(([key]) => key !== "row").map(([key, value]) => (
                              <div key={key}>
                                <span className="text-slate-600 capitalize">{key.replace(/_/g, " ")}:</span>
                                <span className="ml-2 text-slate-900">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {getSelectedFileData()?.sample_sections && (
                    <div className="space-y-3">
                      {getSelectedFileData()?.sample_sections.map((section: any, index: number) => (
                        <div key={index} className="bg-slate-50 rounded-lg p-3">
                          <div className="text-sm font-medium text-slate-700 mb-2">
                            Page {section.page} - {section.section}
                          </div>
                          <div className="text-sm text-slate-600">
                            {section.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Search & Test Retrieval */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-slate-900">Intelligent Document Retrieval</h3>
          </div>
          <button
            onClick={startFeedbackChat}
            className="flex items-center space-x-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Submit Feedback</span>
          </button>
        </div>
        
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search knowledge base (e.g., '316L stainless steel pharmaceutical grade', 'MRI error code E-2847')"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isSearching}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Quick Search Examples */}
        <div className="mb-6">
          <p className="text-sm text-slate-600 mb-2">Try these industry-specific searches:</p>
          <div className="flex flex-wrap gap-2">
            {quickSearchExamples.map((example, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(example)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Processing Indicator */}
        {isSearching && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 text-purple-600">
              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <span>Searching through {knowledgeBaseData.processing_stats.total_chunks} document chunks...</span>
            </div>
          </div>
        )}

        {/* Enhanced Search Results */}
        {searchResults.length > 0 && !isSearching && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-900">
                Search Results ({searchResults.length} found)
              </h4>
              <div className="text-sm text-slate-600">
                Sorted by relevance score
              </div>
            </div>
            {searchResults.map((result, index) => (
              <div key={index} className="border border-purple-200 bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-purple-900">
                    {result.document}
                  </div>
                  <div className="flex items-center space-x-2">
                    {result.source_row && (
                      <div className="text-sm text-purple-700">Row {result.source_row}</div>
                    )}
                    {result.source_page && (
                      <div className="text-sm text-purple-700">Page {result.source_page}</div>
                    )}
                    <div className="px-2 py-1 bg-purple-200 text-purple-800 rounded text-xs font-medium">
                      {Math.round(result.score * 100)}% match
                    </div>
                  </div>
                </div>
                <div className="text-sm text-purple-800 mb-2">
                  {result.content}
                </div>
                {result.metadata && Object.keys(result.metadata).length > 2 && (
                  <div className="text-xs text-purple-600">
                    <details className="cursor-pointer">
                      <summary>View metadata</summary>
                      <div className="mt-2 p-2 bg-purple-100 rounded text-purple-700">
                        {Object.entries(result.metadata)
                          .filter(([key]) => !['row', 'page'].includes(key))
                          .map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                              <span>{String(value)}</span>
                            </div>
                          ))}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {searchQuery && searchResults.length === 0 && !isSearching && (
          <div className="text-center py-8 text-slate-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No matches found for "{searchQuery}"</p>
            <p className="text-sm mt-2">Try different keywords or check the quick search examples above</p>
          </div>
        )}
      </div>

      {/* Feedback Chat Modal */}
      {showFeedbackChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Knowledge Base Feedback</h3>
                  <p className="text-sm text-slate-600">
                    {lastAnalyzedEmail ? 
                      `Reviewing search results for ${lastAnalyzedEmail.industry} context` :
                      "Help improve search and retrieval accuracy"
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
                          <span>Search improvements applied</span>
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
                  placeholder={
                    lastAnalyzedEmail ? 
                    `Feedback about ${lastAnalyzedEmail.industry.toLowerCase()} search results...` :
                    "Describe corrections or feedback about search results..."
                  }
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onKeyPress={(e) => e.key === "Enter" && sendFeedbackMessage()}
                  disabled={isAgentTyping}
                />
                <button
                  onClick={sendFeedbackMessage}
                  disabled={!newMessage.trim() || isAgentTyping}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {lastAnalyzedEmail ? (
                  <span><strong>Context examples:</strong> "Search didn't find the {lastAnalyzedEmail.industry.toLowerCase()} specifications I needed" • "Missing emergency response procedures" • "Wrong material grade results"</span>
                ) : (
                  <span><strong>Examples:</strong> "Search didn't find the stainless steel pricing I was looking for" • "MRI results should show emergency response times" • "Missing permit requirements for downtown projects"</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;