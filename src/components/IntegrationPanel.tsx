import React, { useState, useEffect } from "react";
import { Zap, CheckCircle, AlertCircle, ExternalLink, Webhook, Mail, Share, Activity, Database, Users } from "lucide-react";
import { ProcessedEmail } from "../types/workflow";

interface WebhookTest {
  id: string;
  name: string;
  endpoint: string;
  status: "success" | "error" | "pending";
  lastResponse?: string;
  timestamp?: string;
}

interface IntegrationPanelProps {
  processedEmails?: ProcessedEmail[];
  routingResults?: any[];
}

const IntegrationPanel: React.FC<IntegrationPanelProps> = ({
  processedEmails = [],
  routingResults = []
}) => {
  const [activeTests, setActiveTests] = useState<WebhookTest[]>([]);
  const [isTestingWebhooks, setIsTestingWebhooks] = useState(false);
  const [integrationMetrics, setIntegrationMetrics] = useState({
    totalRouted: 0,
    successRate: 0,
    avgResponseTime: 0,
    crmRecordsCreated: 0
  });

  // Update integration metrics when processed emails change
  useEffect(() => {
    if (processedEmails.length > 0) {
      const totalRouted = processedEmails.length;
      const successfulRoutes = processedEmails.filter(email => 
        email.analysis?.structured_output?.crm_ready
      ).length;
      const successRate = (successfulRoutes / totalRouted) * 100;
      const avgResponseTime = processedEmails.reduce((sum, email) => 
        sum + email.processingTime, 0) / totalRouted;

      setIntegrationMetrics({
        totalRouted,
        successRate,
        avgResponseTime,
        crmRecordsCreated: successfulRoutes
      });
    }
  }, [processedEmails]);

  const simulateWebhookTest = async (endpoint: string, name: string) => {
    const testId = `test_${Date.now()}`;
    const newTest: WebhookTest = {
      id: testId,
      name,
      endpoint,
      status: "pending",
      timestamp: new Date().toISOString()
    };

    setActiveTests(prev => [...prev, newTest]);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    setActiveTests(prev => prev.map(test => 
      test.id === testId 
        ? {
            ...test,
            status: Math.random() > 0.2 ? "success" : "error",
            lastResponse: Math.random() > 0.2 
              ? '{"status": "accepted", "id": "wh_12345", "processed": true}'
              : '{"error": "timeout", "message": "Endpoint not responding"}'
          }
        : test
    ));
  };

  const testAllWebhooks = async () => {
    setIsTestingWebhooks(true);
    setActiveTests([]);

    const webhooks = [
      { name: "Salesforce Lead Creation", endpoint: "https://customer.salesforce.com/webhook/leads" },
      { name: "SharePoint Document Archive", endpoint: "https://customer.sharepoint.com/webhook/archive" },
      { name: "HubSpot Contact Sync", endpoint: "https://api.hubapi.com/webhooks/email-router" },
      { name: "Teams Notification", endpoint: "https://outlook.office.com/webhook/teams-notify" }
    ];

    for (const webhook of webhooks) {
      await simulateWebhookTest(webhook.endpoint, webhook.name);
      await new Promise(resolve => setTimeout(resolve, 500)); // Slight delay between tests
    }

    setIsTestingWebhooks(false);
  };

  const simulateOutlookConnection = () => {
    // Simulate OAuth flow
    const popup = window.open(
      'data:text/html,<div style="padding:20px;font-family:Arial"><h2>Microsoft OAuth Simulation</h2><p>In production, this would redirect to:<br><code>https://login.microsoftonline.com/oauth2/v2.0/authorize</code></p><p><strong>Scope:</strong> Mail.Read, Sites.ReadWrite.All</p><p style="color:green;margin-top:20px;">✓ Authentication successful</p><script>setTimeout(() => window.close(), 3000)</script></div>',
      'popup',
      'width=500,height=400'
    );
    
    setTimeout(() => {
      if (popup) popup.close();
      alert("Outlook integration connected! In production, this would establish a live connection to read incoming emails.");
    }, 3500);
  };

  const simulateSharePointUpload = () => {
    alert("SharePoint integration test: Would upload processed email and analysis to configured document library with proper metadata tagging.");
  };

  return (
    <div className="space-y-6">
      {/* Cross-Tab Integration Metrics */}
      {processedEmails.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Integration Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-900">{integrationMetrics.totalRouted}</div>
                  <div className="text-sm text-blue-700">Emails Routed</div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                <div>
                  <div className="text-2xl font-bold text-emerald-900">{integrationMetrics.successRate.toFixed(1)}%</div>
                  <div className="text-sm text-emerald-700">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Activity className="w-6 h-6 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-900">{(integrationMetrics.avgResponseTime / 1000).toFixed(1)}s</div>
                  <div className="text-sm text-purple-700">Avg Response Time</div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Database className="w-6 h-6 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-orange-900">{integrationMetrics.crmRecordsCreated}</div>
                  <div className="text-sm text-orange-700">CRM Records Created</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Integration Testing */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Zap className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-slate-900">Live Integration Testing</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Outlook Connection */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Mail className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-medium text-slate-900">Outlook 365 Connection</h4>
                <p className="text-sm text-slate-600">Real-time email monitoring</p>
              </div>
            </div>
            <button
              onClick={simulateOutlookConnection}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Connect via OAuth
            </button>
          </div>

          {/* SharePoint Testing */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Share className="w-6 h-6 text-emerald-600" />
              <div>
                <h4 className="font-medium text-slate-900">SharePoint Upload</h4>
                <p className="text-sm text-slate-600">Document archiving test</p>
              </div>
            </div>
            <button
              onClick={simulateSharePointUpload}
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Test Upload
            </button>
          </div>
        </div>
      </div>

      {/* Webhook Testing */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Webhook className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-slate-900">Webhook Testing</h3>
          </div>
          <button
            onClick={testAllWebhooks}
            disabled={isTestingWebhooks}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-300 transition-colors"
          >
            <Activity className="w-4 h-4" />
            <span>{isTestingWebhooks ? "Testing..." : "Test All Webhooks"}</span>
          </button>
        </div>

        {activeTests.length > 0 && (
          <div className="space-y-3">
            {activeTests.map((test) => (
              <div key={test.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {test.status === "success" ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : test.status === "error" ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    <div>
                      <div className="font-medium text-slate-900">{test.name}</div>
                      <div className="text-sm text-slate-600 flex items-center space-x-2">
                        <code className="text-xs">{test.endpoint}</code>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    test.status === "success" ? "bg-emerald-100 text-emerald-800" :
                    test.status === "error" ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {test.status}
                  </div>
                </div>
                
                {test.lastResponse && (
                  <div className="mt-3">
                    <div className="text-sm font-medium text-slate-700 mb-1">Response:</div>
                    <code className="block text-xs bg-slate-100 p-2 rounded text-slate-700">
                      {test.lastResponse}
                    </code>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!isTestingWebhooks && activeTests.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Webhook className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>Click "Test All Webhooks" to simulate integration endpoints</p>
          </div>
        )}
      </div>

      {/* Processed Emails Integration Status */}
      {processedEmails.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Email Integration Status</h3>
          <div className="space-y-3">
            {processedEmails.slice(-5).map((email) => (
              <div key={email.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-slate-900">{email.company}</div>
                  <div className="flex items-center space-x-2">
                    {email.analysis?.structured_output?.crm_ready ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                    <span className={`text-sm ${
                      email.analysis?.structured_output?.crm_ready 
                        ? 'text-emerald-600' 
                        : 'text-yellow-600'
                    }`}>
                      {email.analysis?.structured_output?.crm_ready ? 'Ready for CRM' : 'Processing'}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-slate-600 mb-2">
                  Intent: {email.analysis?.intent} • Department: {email.analysis?.routing_tags?.department}
                </div>
                {email.analysis?.structured_output?.sharepoint_path && (
                  <div className="text-xs text-slate-500">
                    SharePoint: {email.analysis.structured_output.sharepoint_path}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Email Signature Parsing Demo */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Mail className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-900">Email Signature Parsing</h3>
        </div>
        
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h4 className="font-medium text-indigo-900 mb-2">Extracted Contact Information:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-indigo-800">Name:</strong> Sarah Chen<br />
              <strong className="text-indigo-800">Company:</strong> Chen Manufacturing<br />
              <strong className="text-indigo-800">Title:</strong> Project Manager
            </div>
            <div>
              <strong className="text-indigo-800">Phone:</strong> (555) 987-6543<br />
              <strong className="text-indigo-800">Email:</strong> s.chen@chenmanufacturing.com<br />
              <strong className="text-indigo-800">Industry:</strong> Manufacturing
            </div>
          </div>
          <div className="mt-3 text-xs text-indigo-700">
            ✓ Automatically parsed from email signature and added to CRM contact record
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationPanel;