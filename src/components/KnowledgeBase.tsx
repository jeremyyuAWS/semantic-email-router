import React, { useState } from "react";
import { Upload, FileText, Search, Database, CheckCircle, Clock, AlertCircle, Eye, MessageCircle, Send, Bot, User, ThumbsUp } from "lucide-react";
import knowledgeBaseData from "../../data/knowledge_base.json";

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

const KnowledgeBase: React.FC = () => {
  const [files] = useState<KnowledgeFile[]>(knowledgeBaseData.uploaded_files);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Feedback Chat State
  const [showFeedbackChat, setShowFeedbackChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "agent",
      message: "Hello! I'm here to help improve the knowledge base. You can submit corrections about search results, suggest better document organization, or provide feedback on retrieval accuracy. What would you like to discuss?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  // Enhanced search that actually works with the sample data
  const performIntelligentSearch = (query: string): SearchResult[] => {
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
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 8); // Limit to top 8 results
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // Simulate processing delay for realism
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const results = performIntelligentSearch(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
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
    setNewMessage("");
    setIsAgentTyping(true);

    // Simulate agent thinking time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

    // Generate contextual agent response based on message content
    let agentResponse = "";
    const message = newMessage.toLowerCase();

    if (message.includes("search") || message.includes("retrieval") || message.includes("find")) {
      agentResponse = "I understand you're providing feedback about search and retrieval functionality. I've noted your suggestions about improving how we match queries to documents. This feedback will help train the semantic matching algorithms to be more accurate. Thank you for helping improve the system!";
    } else if (message.includes("wrong") || message.includes("incorrect") || message.includes("mistake")) {
      agentResponse = "Thank you for the correction! I've recorded this feedback and it will be used to improve future analysis. Corrections like these are invaluable for training the models to better understand your specific business context and terminology.";
    } else if (message.includes("missing") || message.includes("should include") || message.includes("add")) {
      agentResponse = "I understand you'd like to see additional information or categories included. I've logged this suggestion for enhancing our entity extraction and knowledge base organization. Your input helps us understand what information is most valuable for your workflows.";
    } else if (message.includes("confidence") || message.includes("score") || message.includes("accuracy")) {
      agentResponse = "Your feedback about confidence scores and accuracy is very helpful. I'll adjust the confidence thresholds and note patterns where the system should be more or less certain. This type of feedback directly improves our reliability metrics.";
    } else if (message.includes("routing") || message.includes("department") || message.includes("priority")) {
      agentResponse = "I've recorded your routing and priority feedback. Understanding your organization's specific workflows helps me learn the correct department assignments and urgency levels. This will improve automatic routing accuracy for similar emails in the future.";
    } else {
      agentResponse = "Thank you for your feedback! I've processed and recorded your input. This information will be used to improve the system's understanding and performance. Every piece of feedback helps train the models to work better with your specific use cases and business requirements.";
    }

    const agentMessage: ChatMessage = {
      id: `agent_${Date.now()}`,
      type: "agent",
      message: agentResponse,
      timestamp: new Date().toISOString(),
      metadata: {
        feedback_processed: true,
        confidence_adjustment: Math.random() * 0.1 + 0.05, // Simulate learning impact
        training_data_added: true
      }
    };

    setIsAgentTyping(false);
    setChatMessages(prev => [...prev, agentMessage]);
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
    "stainless steel pipe",
    "demolition service",
    "MRI repair",
    "contract review pricing",
    "HVAC installation",
    "pharmaceutical 340B"
  ];

  return (
    <div className="space-y-6">
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
            onClick={() => setShowFeedbackChat(true)}
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
            placeholder="Search knowledge base (e.g., 'stainless steel pipe 304', 'emergency repair')"
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
          <p className="text-sm text-slate-600 mb-2">Try these searches:</p>
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
                  <p className="text-sm text-slate-600">Help improve search and retrieval accuracy</p>
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
                      <p className="text-sm">{message.message}</p>
                      {message.metadata?.feedback_processed && (
                        <div className="flex items-center space-x-1 mt-2 text-xs text-indigo-600">
                          <ThumbsUp className="w-3 h-3" />
                          <span>Feedback processed for training</span>
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
                  placeholder="Describe corrections or feedback about search results..."
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
                Example: "The search didn't find the stainless steel pricing I was looking for" or "MRI results should show emergency response times"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;