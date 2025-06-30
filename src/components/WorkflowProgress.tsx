import React from 'react';
import { CheckCircle, Circle, ArrowRight, Zap, Database, Share, Target } from 'lucide-react';
import { WorkflowState } from '../types/workflow';

interface WorkflowProgressProps {
  currentStep: WorkflowState['currentStep'];
  emailsProcessed: number;
  onStepClick: (step: WorkflowState['currentStep']) => void;
}

const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ 
  currentStep, 
  emailsProcessed, 
  onStepClick 
}) => {
  const steps = [
    {
      id: 'analysis' as const,
      name: 'Email Analysis',
      icon: Zap,
      description: 'Semantic parsing & entity extraction'
    },
    {
      id: 'knowledge' as const,
      name: 'Knowledge Lookup',
      icon: Database,
      description: 'Document grounding & retrieval'
    },
    {
      id: 'routing' as const,
      name: 'Smart Routing',
      icon: Share,
      description: 'Integration & workflow automation'
    },
    {
      id: 'complete' as const,
      name: 'Results',
      icon: Target,
      description: 'Structured output & insights'
    }
  ];

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    
    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Workflow Pipeline</h3>
        {emailsProcessed > 0 && (
          <div className="text-sm text-slate-600">
            {emailsProcessed} email{emailsProcessed !== 1 ? 's' : ''} processed
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const status = getStepStatus(step.id);
          
          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => onStepClick(step.id)}
                className="flex flex-col items-center space-y-2 p-4 rounded-lg transition-colors hover:bg-slate-50 text-center min-w-0 flex-1"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                  status === 'complete' 
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-600'
                    : status === 'current'
                    ? 'bg-blue-100 border-blue-500 text-blue-600'
                    : 'bg-slate-100 border-slate-300 text-slate-400'
                }`}>
                  {status === 'complete' ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className={`font-medium text-sm ${
                    status === 'current' ? 'text-blue-900' : 
                    status === 'complete' ? 'text-emerald-900' : 'text-slate-600'
                  }`}>
                    {step.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {step.description}
                  </div>
                </div>
              </button>
              
              {index < steps.length - 1 && (
                <ArrowRight className={`w-5 h-5 mx-2 flex-shrink-0 ${
                  getStepStatus(steps[index + 1].id) !== 'pending' 
                    ? 'text-emerald-500' 
                    : 'text-slate-300'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowProgress;