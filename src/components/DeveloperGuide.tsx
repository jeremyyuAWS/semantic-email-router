import React, { useState } from "react";
import { Code2, GitBranch, Zap, Shield, Settings, FileText, Server, Database } from "lucide-react";

const DeveloperGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState("architecture");

  const sections = [
    { id: "architecture", name: "Agent Architecture", icon: GitBranch },
    { id: "customization", name: "Customization Guide", icon: Settings },
    { id: "deployment", name: "Deployment", icon: Server },
    { id: "security", name: "Security & Scale", icon: Shield },
    { id: "api", name: "API Reference", icon: FileText }
  ];

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Code2 className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-slate-900">Developer Documentation</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-purple-100 text-purple-700 border border-purple-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{section.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        
        {/* Agent Architecture */}
        {activeSection === "architecture" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Agent Pipeline Architecture</h3>
              <p className="text-slate-600 mb-6">
                The Semantic Email Router uses a multi-agent pipeline for processing emails. Each agent has a specific responsibility and can be customized independently.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <h4 className="font-semibold text-slate-900">Intent Detector</h4>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Classifies email purpose: Order, Quote, Inquiry, Support, etc.
                </p>
                <div className="bg-slate-50 rounded p-3">
                  <code className="text-xs text-slate-700">
                    agents/intent_detector.json
                  </code>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-emerald-600 font-bold text-sm">2</span>
                  </div>
                  <h4 className="font-semibold text-slate-900">Entity Extractor</h4>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Extracts products, quantities, dates, locations, and specifications.
                </p>
                <div className="bg-slate-50 rounded p-3">
                  <code className="text-xs text-slate-700">
                    agents/entity_extractor.json
                  </code>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <h4 className="font-semibold text-slate-900">Knowledge Matcher</h4>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Uses RAG to match entities against uploaded catalogs and documents.
                </p>
                <div className="bg-slate-50 rounded p-3">
                  <code className="text-xs text-slate-700">
                    agents/knowledge_matcher.json
                  </code>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">4</span>
                  </div>
                  <h4 className="font-semibold text-slate-900">Routing Tagger</h4>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Generates department routing, priority levels, and integration metadata.
                </p>
                <div className="bg-slate-50 rounded p-3">
                  <code className="text-xs text-slate-700">
                    agents/routing_tagger.json
                  </code>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Implementation Frameworks</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong className="text-blue-800">LangChain:</strong>
                  <br />
                  <code className="text-blue-700">from langchain.agents import AgentExecutor</code>
                </div>
                <div>
                  <strong className="text-blue-800">CrewAI:</strong>
                  <br />
                  <code className="text-blue-700">from crewai import Agent, Task, Crew</code>
                </div>
                <div>
                  <strong className="text-blue-800">LangGraph:</strong>
                  <br />
                  <code className="text-blue-700">from langgraph import StateGraph</code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customization Guide */}
        {activeSection === "customization" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Customization for Client POCs</h3>
              <p className="text-slate-600 mb-6">
                Adapt the Semantic Email Router for specific industry use cases and client requirements.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border border-slate-200 rounded-lg p-6">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-orange-600" />
                  Agent Prompt Customization
                </h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-slate-800 mb-2">Industry-Specific Entities</h5>
                    <div className="bg-slate-50 rounded p-3">
                      <pre className="text-xs text-slate-700 overflow-x-auto">
{`// Manufacturing Example
"entities_to_extract": [
  "material_grade",      // 304, 316L, Carbon Steel
  "dimensions",          // Pipe OD, sheet thickness
  "quantities",          // Units, lengths, weights
  "delivery_date",       // Lead time requirements
  "specifications"       // ASTM, ASME standards
]

// Service Industry Example  
"entities_to_extract": [
  "service_type",        // Demolition, cleanup, hauling
  "project_location",    // Address, site details
  "project_scope",       // Square footage, materials
  "timeline",            // Start date, duration
  "special_requirements" // Permits, safety protocols
]`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-slate-800 mb-2">Custom Routing Rules</h5>
                    <div className="bg-slate-50 rounded p-3">
                      <pre className="text-xs text-slate-700 overflow-x-auto">
{`// Route by product line
if (entities.product_type === "stainless_steel") {
  routing.department = "Stainless Sales";
  routing.sharepoint_folder = "/Sites/Sales/Stainless";
} else if (entities.product_type === "carbon_steel") {
  routing.department = "Carbon Sales";
  routing.sharepoint_folder = "/Sites/Sales/Carbon";
}

// Route by urgency
if (entities.delivery_date <= 7 days) {
  routing.priority = "High";
  routing.escalation = true;
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-6">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-purple-600" />
                  Knowledge Base Schema
                </h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-slate-800 mb-2">Document Processing Pipeline</h5>
                    <div className="bg-slate-50 rounded p-3">
                      <pre className="text-xs text-slate-700 overflow-x-auto">
{`1. Upload Document → Parse (unstructured.io)
2. Chunk by semantic boundaries (512 tokens)
3. Generate embeddings (OpenAI ada-002)
4. Store in vector database (Chroma/Pinecone)
5. Create metadata index (product codes, categories)

// Chunk metadata example
{
  "document_id": "penn_catalog_2025.xlsx",
  "row_number": 172,
  "product_sku": "PIP-304-1.5OD-SCH40",
  "category": "Pipe & Tubing",
  "embedding_vector": [...],
  "confidence_threshold": 0.75
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-6">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                  Reinforcement Learning Setup
                </h4>
                <p className="text-slate-600 mb-4">
                  Implement feedback loops to improve tagging accuracy over time.
                </p>
                <div className="bg-slate-50 rounded p-3">
                  <pre className="text-xs text-slate-700 overflow-x-auto">
{`// User correction feedback
{
  "email_id": "email_001",
  "original_tags": ["department: Sales", "priority: Normal"],
  "corrected_tags": ["department: Operations", "priority: High"],
  "feedback_timestamp": "2025-01-15T10:30:00Z",
  "confidence_improvement": +0.15
}

// Retrain model periodically with correction data
// Store in feedback_corrections.json for batch processing`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Deployment */}
        {activeSection === "deployment" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Production Deployment Guide</h3>
              <p className="text-slate-600 mb-6">
                Deploy the Semantic Email Router to production with proper monitoring and scalability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-3">🐳 Docker Deployment</h4>
                <div className="bg-slate-50 rounded p-3">
                  <pre className="text-xs text-slate-700 overflow-x-auto">
{`# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]

# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports: ["3000:3000"]
  postgres:
    image: pgvector/pgvector
  redis:
    image: redis:alpine`}
                  </pre>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-3">☁️ Cloud Options</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-slate-800">Azure:</strong>
                    <div className="text-slate-600">Container Instances + Cosmos DB + Cognitive Services</div>
                  </div>
                  <div>
                    <strong className="text-slate-800">AWS:</strong>
                    <div className="text-slate-600">ECS Fargate + RDS + Bedrock</div>
                  </div>
                  <div>
                    <strong className="text-slate-800">Supabase:</strong>
                    <div className="text-slate-600">Edge Functions + PGVector + Auth</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-6">
              <h4 className="font-semibold text-slate-900 mb-4">📊 Monitoring & Observability</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-slate-800 mb-2">Key Metrics</h5>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Email processing latency (p95 &lt; 3s)</li>
                    <li>• Classification accuracy (&gt;95%)</li>
                    <li>• Knowledge base hit rate (&gt;80%)</li>
                    <li>• API integration success rate</li>
                    <li>• User correction frequency</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-slate-800 mb-2">Alerting Thresholds</h5>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Processing failures &gt; 5%</li>
                    <li>• Confidence scores &lt; 0.7</li>
                    <li>• Knowledge base misses &gt; 30%</li>
                    <li>• API rate limit warnings</li>
                    <li>• Vector database latency &gt; 500ms</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security & Scale */}
        {activeSection === "security" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Security & Scalability</h3>
              <p className="text-slate-600 mb-6">
                Enterprise-grade security considerations and scaling strategies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-red-200 bg-red-50 rounded-lg p-6">
                <h4 className="font-semibold text-red-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Checklist
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <input type="checkbox" className="mt-1" defaultChecked />
                    <span className="text-red-800">API keys encrypted at rest (AES-256)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <input type="checkbox" className="mt-1" defaultChecked />
                    <span className="text-red-800">TLS 1.3 for all API communications</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-red-800">OAuth 2.0 / SAML SSO integration</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-red-800">Email content encryption (customer PII)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-red-800">Audit logging (GDPR compliance)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-red-800">Rate limiting (prevent abuse)</span>
                  </div>
                </div>
              </div>

              <div className="border border-blue-200 bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Scaling Considerations
                </h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-blue-800">Horizontal Scaling:</strong>
                    <div className="text-blue-700 mt-1">
                      • Stateless agent workers<br />
                      • Redis for session management<br />
                      • Load balancer with sticky sessions
                    </div>
                  </div>
                  <div>
                    <strong className="text-blue-800">Vector Database:</strong>
                    <div className="text-blue-700 mt-1">
                      • Partition by company/tenant<br />
                      • Index optimization for similarity search<br />
                      • Caching layer for frequent queries
                    </div>
                  </div>
                  <div>
                    <strong className="text-blue-800">Queue Management:</strong>
                    <div className="text-blue-700 mt-1">
                      • Background processing for large emails<br />
                      • Priority queuing by customer tier<br />
                      • Dead letter queue for failures
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-6">
              <h4 className="font-semibold text-slate-900 mb-4">🏢 Enterprise Integration Patterns</h4>
              <div className="bg-slate-50 rounded p-4">
                <pre className="text-xs text-slate-700 overflow-x-auto">
{`// Multi-tenant isolation
{
  "tenant_id": "penn_stainless_co",
  "knowledge_base": "tenant_specific_embeddings",
  "routing_rules": "custom_department_mapping",
  "api_quotas": {
    "emails_per_hour": 1000,
    "api_calls_per_day": 10000
  }
}

// Enterprise webhook integration
POST /webhooks/email_processed
{
  "tenant_id": "company_123",
  "email_id": "msg_456",
  "analysis_result": {...},
  "routing_destination": "salesforce",
  "confidence": 0.94,
  "processing_time_ms": 1250
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* API Reference */}
        {activeSection === "api" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">API Reference</h3>
              <p className="text-slate-600 mb-6">
                Complete API documentation for integrating with the Semantic Email Router.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border border-slate-200 rounded-lg p-6">
                <h4 className="font-semibold text-slate-900 mb-4">📨 Email Analysis Endpoint</h4>
                <div className="bg-slate-50 rounded p-4">
                  <pre className="text-sm text-slate-700 overflow-x-auto">
{`POST /api/v1/analyze-email

Request:
{
  "email_content": "Hi, I'd like to order 50 pieces of 304 stainless pipe...",
  "sender_email": "customer@company.com",
  "subject": "Product Order Request",
  "tenant_id": "penn_stainless"
}

Response:
{
  "analysis_id": "anlz_1234567890",
  "timestamp": "2025-01-15T10:30:00Z",
  "intent": "Product Order Request",
  "entities": {
    "product": "304 stainless pipe",
    "quantity": "50 pieces",
    "specifications": "1.5\" OD, Schedule 40"
  },
  "routing_tags": {
    "department": "Sales",
    "priority": "Normal",
    "product_line": "Pipe & Tubing"
  },
  "knowledge_base_match": {
    "source": "penn_catalog_2025.xlsx",
    "row": 172,
    "content": "PIP-304-1.5OD-SCH40: $28.50/ft",
    "confidence": 0.94
  },
  "structured_output": {
    "crm_ready": true,
    "sharepoint_path": "/Sales/Orders/2025/Q1",
    "next_actions": ["Generate quote", "Check inventory"]
  }
}`}
                  </pre>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-6">
                <h4 className="font-semibold text-slate-900 mb-4">📚 Knowledge Base Management</h4>
                <div className="bg-slate-50 rounded p-4">
                  <pre className="text-sm text-slate-700 overflow-x-auto">
{`POST /api/v1/knowledge-base/upload
Content-Type: multipart/form-data

{
  "file": (binary),
  "tenant_id": "penn_stainless",
  "document_type": "product_catalog",
  "metadata": {
    "version": "2025.1",
    "effective_date": "2025-01-01"
  }
}

GET /api/v1/knowledge-base/search?q=stainless+pipe&tenant_id=penn

{
  "results": [
    {
      "document": "penn_catalog_2025.xlsx",
      "chunk": "304 SS Pipe 1.5\" OD Schedule 40...",
      "score": 0.94,
      "metadata": {...}
    }
  ]
}`}
                  </pre>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-6">
                <h4 className="font-semibold text-slate-900 mb-4">🔧 Webhook Configuration</h4>
                <div className="bg-slate-50 rounded p-4">
                  <pre className="text-sm text-slate-700 overflow-x-auto">
{`POST /api/v1/webhooks/configure

{
  "tenant_id": "penn_stainless",
  "events": ["email.analyzed", "routing.completed"],
  "endpoint": "https://customer.com/webhook/semantic-router",
  "authentication": {
    "type": "bearer_token",
    "token": "sk_live_..."
  },
  "retry_policy": {
    "max_attempts": 3,
    "backoff": "exponential"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperGuide;