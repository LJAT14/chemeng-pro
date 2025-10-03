import React, { useState } from 'react';
import { Mail, Copy, Check } from 'lucide-react';
import Card from '../shared/Card';

const EmailTemplates = () => {
  const [copied, setCopied] = useState(null);

  const templates = [
    {
      id: 'inquiry',
      title: 'Business Inquiry',
      subject: 'Inquiry Regarding [Product/Service]',
      body: 'Dear [Recipient],\n\nI am writing to inquire about [specific topic].\n\nBest regards,\n[Your Name]'
    },
    {
      id: 'follow-up',
      title: 'Follow-up Email',
      subject: 'Following up on [Topic]',
      body: 'Dear [Recipient],\n\nI wanted to follow up on my previous email.\n\nThank you,\n[Your Name]'
    }
  ];

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {templates.map((template) => (
        <Card key={template.id} hover={false}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold">{template.title}</h3>
            </div>
            <button
              onClick={() => copyToClipboard(template.body, template.id)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {copied === template.id ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Subject:</p>
              <p className="font-semibold">{template.subject}</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">
                {template.body}
              </pre>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EmailTemplates;