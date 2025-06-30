import React, { useState } from "react";
import { Key, Mail, Folder, Database, Cloud, CheckCircle, AlertCircle, Eye, EyeOff, TestTube } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: "connected" | "disconnected" | "testing";
  apiKey?: string;
  endpoints?: string[];
}

const AdminIntegrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "outlook",
      name: "Outlook 365",
      description: "Read incoming emails and extract metadata",
      icon: Mail,
      status: "disconnected",
      endpoints: ["https://graph.microsoft.com/v1.0/me/messages"]
    },
    {
      id: "sharepoint",
      name: "SharePoint",
      description: "Archive emails and attachments to document libraries",
      icon: Folder,
      status: "disconnected",
      endpoints: ["https://graph.microsoft.com/v1.0/sites/"]
    },
    {
      id: "salesforce",
      name: "Salesforce",
      description: "Create leads and contacts from email analysis",
      icon: Database,
      status: "connected",
      apiKey: "****************************************",
      endpoints: ["https://na1.salesforce.com/services/data/v58.0/"]
    },
    {
      id: "hubspot",
      name: "HubSpot",
      description: "Sync contacts and engagement data",
      icon: Database,
      status: "disconnected",
      endpoints: ["https://api.hubapi.com/contacts/v1/"]
    },
    {
      id: "storage",
      name: "Azure Blob Storage",
      description: "Export structured data and email archives",
      icon: Cloud,
      status: "disconnected",
      endpoints: ["https://youraccount.blob.core.windows.net/"]
    }
  ]);

  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [tempKey, setTempKey] = useState("");

  const handleApiKeyToggle = (id: string) => {
    setShowApiKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEditKey = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    setEditingKey(id);
    setTempKey(integration?.apiKey || "");
  };

  const handleSaveKey = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, apiKey: tempKey, status: tempKey ? "connected" : "disconnected" }
        : integration
    ));
    setEditingKey(null);
    setTempKey("");
  };

  const handleTestConnection = async (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id ? { ...integration, status: "testing" } : integration
    ));
    
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIntegrations(prev => prev.map(integration => 
      integration.id === id ? { ...integration, status: "connected" } : integration
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "testing":
        return <TestTube className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case "disconnected":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-emerald-100 text-emerald-800";
      case "testing":
        return "bg-yellow-100 text-yellow-800";
      case "disconnected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Key className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">Integration Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              {integrations.filter(i => i.status === "connected").length}
            </div>
            <div className="text-sm text-emerald-700">Active Integrations</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {integrations.filter(i => i.status === "testing").length}
            </div>
            <div className="text-sm text-yellow-700">Testing</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {integrations.filter(i => i.status === "disconnected").length}
            </div>
            <div className="text-sm text-red-700">Disconnected</div>
          </div>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="space-y-4">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const isEditing = editingKey === integration.id;
          const shouldShowKey = showApiKey[integration.id];
          
          return (
            <div key={integration.id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                    <Icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">{integration.name}</h4>
                    <p className="text-sm text-slate-600">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(integration.status)}`}>
                    {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                  </div>
                  {getStatusIcon(integration.status)}
                </div>
              </div>

              {/* API Key Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    API Key / Token
                  </label>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <>
                        <input
                          type={shouldShowKey ? "text" : "password"}
                          value={tempKey}
                          onChange={(e) => setTempKey(e.target.value)}
                          placeholder="Enter API key..."
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          onClick={() => handleSaveKey(integration.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingKey(null)}
                          className="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <input
                          type={shouldShowKey ? "text" : "password"}
                          value={integration.apiKey || ""}
                          readOnly
                          placeholder="No API key configured"
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                        />
                        <button
                          onClick={() => handleApiKeyToggle(integration.id)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          {shouldShowKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEditKey(integration.id)}
                          className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Endpoints */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    API Endpoints
                  </label>
                  <div className="space-y-2">
                    {integration.endpoints?.map((endpoint, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <code className="flex-1 px-3 py-2 bg-slate-100 text-slate-800 rounded-lg text-sm">
                          {endpoint}
                        </code>
                        <button
                          onClick={() => handleTestConnection(integration.id)}
                          disabled={!integration.apiKey || integration.status === "testing"}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                          {integration.status === "testing" ? "Testing..." : "Test"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Guide */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Integration Setup Guide</h3>
        <div className="space-y-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">📧 Outlook 365 Setup:</h4>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Register app in Azure AD with Mail.Read permissions</li>
              <li>Generate application secret or certificate</li>
              <li>Configure redirect URLs for OAuth flow</li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">📁 SharePoint Setup:</h4>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Use same Azure AD app with Sites.ReadWrite.All</li>
              <li>Configure site collection permissions</li>
              <li>Test document library access</li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">🔗 CRM Integration:</h4>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Generate API tokens from Salesforce/HubSpot admin</li>
              <li>Configure webhook endpoints for real-time sync</li>
              <li>Map email entities to CRM fields</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminIntegrations;