import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, Stethoscope, Clipboard } from 'lucide-react';
import { templates } from '../data/templates';

const iconMap = {
  Mail: Mail,
  AlertCircle: AlertCircle,
  Stethoscope: Stethoscope,
  Clipboard: Clipboard
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose the document you want to create
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Select a document template below to begin creating your legal document.
          </p>
        </div>
        <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => {
            const Icon = iconMap[template.icon] || Mail;
            return (
              <Link
                key={template.id}
                to={`/template/${template.id}`}
                className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                <div className="flex-1 p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-gray-900">
                    {template.title}
                  </h3>
                  <p className="mt-4 text-base text-gray-500">
                    {template.description}
                  </p>
                </div>
                <div className="bg-gray-50 px-6 py-4">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Use this template &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
