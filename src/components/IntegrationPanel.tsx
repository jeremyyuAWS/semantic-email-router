import React, { useState, useEffect } from "react";
import { Zap, CheckCircle, AlertCircle, ExternalLink, Webhook, Mail, Share, Activity, Database, Users, MessageSquare, Calendar, FileText, Building, Phone, Slack, Workflow, BarChart3, Clock, Target, Globe } from "lucide-react";
import { ProcessedEmail } from "../types/workflow";

interface IntegrationEndpoint {
  id: string;
  name: string;
  category: 'CRM' | 'Email' | 'Communication' | 'Storage' | 'Business';
  icon: any;
  description: string;
  endpoint: string;
  status: 'connected' | 'disconnected' | 'testing' | 'error';
  lastTest?: string;
  responseTime?: number;
  routingRules: string[];
}

interface RoutingScenario {
  id: string;
  name: string;
  description: string;
  emailType: string;
  industry: string;
  primaryRoute: string;
  secondaryRoutes: string[];
  conditions: string[];
}

interface IntegrationPanelProps {
  processedEmails?: ProcessedEmail[];
  routingResults?: any[];
}

const IntegrationPanel: React.FC<IntegrationPanelProps> = ({
  processedEmails = [],
  routingResults = []
}) => {
  const [integrations, setIntegrations] = useState<IntegrationEndpoint[]>([
    // CRM Systems
    {
      id: 'salesforce',
      name: 'Salesforce',
      category: 'CRM',
      icon: Database,
      description: 'Lead creation, opportunity tracking, contact management',
      endpoint: 'https://na1.salesforce.com/services/data/v58.0/sobjects/Lead',
      status: 'connected',
      responseTime: 245,
      routingRules: ['High-value orders', 'New customer inquiries', 'Quote requests']
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      category: 'CRM',
      icon: Target,
      description: 'Marketing automation, deal pipeline, customer journey',
      endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts',
      status: 'connected',
      responseTime: 180,
      routingRules: ['Marketing qualified leads', 'Product demos', 'Content downloads']
    },
    {
      id: 'pipedrive',
      name: 'Pipedrive',
      category: 'CRM',
      icon: BarChart3,
      description: 'Sales pipeline management, activity tracking',
      endpoint: 'https://api.pipedrive.com/v1/deals',
      status: 'testing',
      routingRules: ['Sales qualified leads', 'Follow-up activities', 'Deal updates']
    },
    {
      id: 'zoho',
      name: 'Zoho CRM',
      category: 'CRM',
      icon: Building,
      description: 'Customer relationship management, automation',
      endpoint: 'https://www.zohoapis.com/crm/v4/Leads',
      status: 'disconnected',
      routingRules: ['Customer support tickets', 'Service requests', 'Account updates']
    },

    // Email Services
    {
      id: 'outlook365',
      name: 'Outlook 365',
      category: 'Email',
      icon: Mail,
      description: 'Email processing, calendar integration, Exchange Online',
      endpoint: 'https://graph.microsoft.com/v1.0/me/messages',
      status: 'connected',
      responseTime: 120,
      routingRules: ['Internal communications', 'Meeting requests', 'Document sharing']
    },
    {
      id: 'gmail',
      name: 'Gmail Workspace',
      category: 'Email',
      icon: Mail,
      description: 'Gmail API integration, automated responses',
      endpoint: 'https://gmail.googleapis.com/gmail/v1/users/me/messages',
      status: 'connected',
      responseTime: 156,
      routingRules: ['External communications', 'Customer inquiries', 'Newsletter signups']
    },
    {
      id: 'exchange',
      name: 'Exchange Server',
      category: 'Email',
      icon: Mail,
      description: 'On-premises Exchange integration',
      endpoint: 'https://exchange.company.com/ews/exchange.asmx',
      status: 'disconnected',
      routingRules: ['Enterprise email', 'Secure communications', 'Compliance routing']
    },

    // Communication Platforms
    {
      id: 'teams',
      name: 'Microsoft Teams',
      category: 'Communication',
      icon: MessageSquare,
      description: 'Team notifications, channel updates, chat integration',
      endpoint: 'https://graph.microsoft.com/v1.0/teams/notifications',
      status: 'connected',
      responseTime: 95,
      routingRules: ['Urgent alerts', 'Team notifications', 'Project updates']
    },
    {
      id: 'slack',
      name: 'Slack',
      category: 'Communication',
      icon: Slack,
      description: 'Channel notifications, direct messages, workflow automation',
      endpoint: 'https://slack.com/api/chat.postMessage',
      status: 'connected',
      responseTime: 88,
      routingRules: ['Development alerts', 'Sales notifications', 'Support tickets']
    },
    {
      id: 'discord',
      name: 'Discord',
      category: 'Communication',
      icon: MessageSquare,
      description: 'Community notifications, webhook integrations',
      endpoint: 'https://discord.com/api/webhooks/notifications',
      status: 'testing',
      routingRules: ['Community updates', 'Event notifications', 'User engagement']
    },

    // Storage & Business Apps
    {
      id: 'sharepoint',
      name: 'SharePoint',
      category: 'Storage',
      icon: Share,
      description: 'Document archiving, metadata tagging, version control',
      endpoint: 'https://graph.microsoft.com/v1.0/sites/documents',
      status: 'connected',
      responseTime: 200,
      routingRules: ['Document storage', 'Contract archival', 'Knowledge base updates']
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      category: 'Storage',
      icon: FileText,
      description: 'File storage, sharing, collaboration',
      endpoint: 'https://graph.microsoft.com/v1.0/me/drive/items',
      status: 'connected',
      responseTime: 145,
      routingRules: ['File attachments', 'Personal documents', 'Backup storage']
    },
    {
      id: 'zapier',
      name: 'Zapier',
      category: 'Business',
      icon: Workflow,
      description: 'Workflow automation, app connections',
      endpoint: 'https://hooks.zapier.com/hooks/catch/automation',
      status: 'connected',
      responseTime: 210,
      routingRules: ['Multi-app workflows', 'Data synchronization', 'Automated processes']
    },
    {
      id: 'calendly',
      name: 'Calendly',
      category: 'Business',
      icon: Calendar,
      description: 'Meeting scheduling, appointment booking',
      endpoint: 'https://api.calendly.com/scheduled_events',
      status: 'disconnected',
      routingRules: ['Meeting requests', 'Demo bookings', 'Consultation scheduling']
    }
  ]);

  const [routingScenarios] = useState<RoutingScenario[]>([
    {
      id: 'manufacturing_order',
      name: 'Manufacturing Order',
      description: 'High-value stainless steel order from established customer',
      emailType: 'Product Order',
      industry: 'Manufacturing',
      primaryRoute: 'Salesforce',
      secondaryRoutes: ['Teams', 'SharePoint'],
      conditions: ['Order value > $50K', 'Existing customer', 'Material specifications included']
    },
    {
      id: 'medical_emergency',
      name: 'Medical Equipment Emergency',
      description: 'Critical equipment failure affecting patient care',
      emailType: 'Emergency Service',
      industry: 'Healthcare',
      primaryRoute: 'Teams',
      secondaryRoutes: ['Slack', 'Outlook 365'],
      conditions: ['Keywords: CRITICAL, EMERGENCY, PATIENT', 'Response time < 1 hour', 'Escalation required']
    },
    {
      id: 'legal_consultation',
      name: 'Legal Consultation Request',
      description: 'Complex international contract review inquiry',
      emailType: 'Professional Service',
      industry: 'Legal',
      primaryRoute: 'HubSpot',
      secondaryRoutes: ['SharePoint', 'Calendly'],
      conditions: ['Service value > $100K', 'Multi-jurisdiction', 'Senior partner required']
    },
    {
      id: 'construction_rfq',
      name: 'Construction RFQ',
      description: 'Municipal HVAC installation project bid',
      emailType: 'Bid Request',
      industry: 'Construction',
      primaryRoute: 'Pipedrive',
      secondaryRoutes: ['Teams', 'OneDrive'],
      conditions: ['Public sector', 'Prevailing wage', 'Bonding required']
    },
    {
      id: 'support_ticket',
      name: 'Customer Support',
      description: 'Product inquiry from new prospect',
      emailType: 'General Inquiry',
      industry: 'General',
      primaryRoute: 'Zoho CRM',
      secondaryRoutes: ['Gmail', 'Zapier'],
      conditions: ['New contact', 'Product interest', 'Standard response time']
    }
  ]);

  const [activeScenario, setActiveScenario] = useState<RoutingScenario | null>(null);
  const [testingInProgress, setTestingInProgress] = useState(false);
  const [routingResults, setRoutingResults] = useState<any[]>([]);

  // Update integration metrics when processed emails change
  useEffect(() => {
    if (processedEmails.length > 0) {
      simulateRoutingMetrics();
    }
  }, [processedEmails]);

  const simulateRoutingMetrics = () => {
    // Simulate routing decisions based on processed emails
    const newResults = processedEmails.slice(-3).map(email => {
      const scenario = routingScenarios.find(s => 
        s.industry === email.industry || 
        s.emailType === email.analysis?.intent
      ) || routingScenarios[0];

      return {
        emailId: email.id,
        company: email.company,
        industry: email.industry,
        primaryRoute: scenario.primaryRoute,
        secondaryRoutes: scenario.secondaryRoutes,
        confidence: 0.85 + Math.random() * 0.12,
        routingTime: 150 + Math.random() * 200,
        status: 'success'
      };
    });

    setRoutingResults(prev => [...prev, ...newResults].slice(-10));
  };

  const testIntegration = async (integrationId: string) => {
    setIntegrations(prev => prev.map(int => 
      int.id === integrationId 
        ? { ...int, status: 'testing' }
        : int
    ));

    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

    const success = Math.random() > 0.15; // 85% success rate
    setIntegrations(prev => prev.map(int => 
      int.id === integrationId 
        ? { 
            ...int, 
            status: success ? 'connected' : 'error',
            lastTest: new Date().toISOString(),
            responseTime: success ? 100 + Math.random() * 200 : undefined
          }
        : int
    ));
  };

  const runRoutingScenario = async (scenario: RoutingScenario) => {
    setActiveScenario(scenario);
    setTestingInProgress(true);

    // Test primary route
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test secondary routes
    for (const route of scenario.secondaryRoutes) {
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setTestingInProgress(false);
  };

  const testAllIntegrations = async () => {
    const connectedIntegrations = integrations.filter(int => int.status === 'connected');
    
    for (const integration of connectedIntegrations) {
      await testIntegration(integration.id);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'testing':
        return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'CRM': return Database;
      case 'Email': return Mail;
      case 'Communication': return MessageSquare;
      case 'Storage': return FileText;
      case 'Business': return Building;
      default: return Globe;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CRM': return 'blue';
      case 'Email': return 'emerald';
      case 'Communication': return 'purple';
      case 'Storage': return 'orange';
      case 'Business': return 'indigo';
      default: return 'slate';
    }
  };

  // Group integrations by category
  const groupedIntegrations = integrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, IntegrationEndpoint[]>);

  return (
    <div className="space-y-6">
      {/* Integration Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Workflow className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-900">Integration Testing Dashboard</h3>
          </div>
          <button
            onClick={testAllIntegrations}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Activity className="w-4 h-4" />
            <span>Test All Connected</span>
          </button>
        </div>

        {/* Integration Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {Object.entries(groupedIntegrations).map(([category, integrations]) => {
            const connected = integrations.filter(i => i.status === 'connected').length;
            const total = integrations.length;
            const CategoryIcon = getCategoryIcon(category);
            const color = getCategoryColor(category);
            
            return (
              <div key={category} className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4`}>
                <div className="flex items-center space-x-3">
                  <CategoryIcon className={`w-6 h-6 text-${color}-600`} />
                  <div>
                    <div className={`text-2xl font-bold text-${color}-900`}>{connected}/{total}</div>
                    <div className={`text-sm text-${color}-700`}>{category}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <div>
                <div className="text-2xl font-bold text-emerald-900">
                  {integrations.filter(i => i.status === 'connected').length}
                </div>
                <div className="text-sm text-emerald-700">Connected</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-900">
                  {Math.round(integrations.filter(i => i.responseTime).reduce((sum, i) => sum + (i.responseTime || 0), 0) / integrations.filter(i => i.responseTime).length)}ms
                </div>
                <div className="text-sm text-blue-700">Avg Response</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-900">{routingResults.length}</div>
                <div className="text-sm text-purple-700">Routes Tested</div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-900">
                  {routingResults.filter(r => r.status === 'success').length}
                </div>
                <div className="text-sm text-orange-700">Successful Routes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Categories */}
      {Object.entries(groupedIntegrations).map(([category, categoryIntegrations]) => {
        const CategoryIcon = getCategoryIcon(category);
        const color = getCategoryColor(category);
        
        return (
          <div key={category} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CategoryIcon className={`w-5 h-5 text-${color}-600`} />
              <h3 className="text-lg font-semibold text-slate-900">{category} Integrations</h3>
              <div className="text-sm text-slate-500">
                ({categoryIntegrations.filter(i => i.status === 'connected').length} of {categoryIntegrations.length} connected)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryIntegrations.map((integration) => {
                const Icon = integration.icon;
                
                return (
                  <div key={integration.id} className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 text-${color}-600`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{integration.name}</h4>
                          <p className="text-sm text-slate-600">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(integration.status)}
                        <button
                          onClick={() => testIntegration(integration.id)}
                          disabled={integration.status === 'testing'}
                          className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                          Test
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Endpoint:</span>
                        <div className="flex items-center space-x-2">
                          <code className="text-xs text-slate-500">{integration.endpoint.split('/')[2]}</code>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </div>
                      </div>
                      
                      {integration.responseTime && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Response Time:</span>
                          <span className="text-slate-900">{integration.responseTime}ms</span>
                        </div>
                      )}

                      <div className="mt-3">
                        <div className="text-sm font-medium text-slate-700 mb-1">Routing Rules:</div>
                        <div className="flex flex-wrap gap-1">
                          {integration.routingRules.map((rule, index) => (
                            <span key={index} className={`px-2 py-1 bg-${color}-100 text-${color}-800 rounded-full text-xs`}>
                              {rule}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Smart Routing Scenarios */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Target className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-900">Smart Routing Scenarios</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {routingScenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => runRoutingScenario(scenario)}
              disabled={testingInProgress}
              className="text-left p-4 border-2 border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-900">{scenario.name}</h4>
                <div className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                  {scenario.industry}
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-3">{scenario.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Target className="w-3 h-3 text-indigo-600" />
                  <span className="text-sm font-medium text-slate-900">Primary: {scenario.primaryRoute}</span>
                </div>
                <div className="text-xs text-slate-600">
                  + {scenario.secondaryRoutes.join(', ')}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Active Scenario Testing */}
        {activeScenario && (
          <div className="border border-indigo-200 bg-indigo-50 rounded-lg p-4">
            <h4 className="font-medium text-indigo-900 mb-3">
              Testing: {activeScenario.name} {testingInProgress && '(In Progress...)'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-indigo-800 mb-2">Routing Logic:</h5>
                <ul className="text-sm text-indigo-700 space-y-1">
                  {activeScenario.conditions.map((condition, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-indigo-800 mb-2">Route Sequence:</h5>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <span className="text-sm text-indigo-700">{activeScenario.primaryRoute} (Primary)</span>
                  </div>
                  {activeScenario.secondaryRoutes.map((route, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-indigo-400 text-white rounded-full flex items-center justify-center text-xs font-bold">{index + 2}</div>
                      <span className="text-sm text-indigo-600">{route} (Notification)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Routing Results */}
      {routingResults.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Routing Results</h3>
          <div className="space-y-3">
            {routingResults.slice(-5).map((result, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="font-medium text-slate-900">{result.company}</div>
                    <div className="text-sm text-slate-600">({result.industry})</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-emerald-600">Routed Successfully</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Primary Route:</span>
                    <div className="font-medium text-slate-900">{result.primaryRoute}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Confidence:</span>
                    <div className="font-medium text-slate-900">{Math.round(result.confidence * 100)}%</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Processing Time:</span>
                    <div className="font-medium text-slate-900">{Math.round(result.routingTime)}ms</div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <span className="text-slate-600 text-sm">Also notified: </span>
                  <span className="text-slate-900 text-sm">{result.secondaryRoutes.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationPanel;