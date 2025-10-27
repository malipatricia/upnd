"use client"

import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Send, Users, Filter, History, CheckCircle, XCircle, Clock } from 'lucide-react';
import { NewCommunicationModal } from './NewCommunicationModal';

interface Communication {
  id: string;
  type: string;
  subject: string;
  message: string;
  recipients_count: number;
  sent_count: number;
  failed_count: number;
  status: string;
  sent_by: string;
  sent_at: string;
  created_at: string;
}

export default function Communications() {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadCommunications();
  }, []);

  const loadCommunications = async () => {

  };

  const getFilteredCommunications = () => {
    return communications.filter(comm => {
      if (filterType !== 'all' && comm.type !== filterType) return false;
      if (filterStatus !== 'all' && comm.status !== filterStatus) return false;
      return true;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent':
        return 'text-green-600 bg-green-50';
      case 'Sending':
        return 'text-blue-600 bg-blue-50';
      case 'Failed':
        return 'text-red-600 bg-red-50';
      case 'Draft':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Sent':
        return <CheckCircle className="w-4 h-4" />;
      case 'Sending':
        return <Clock className="w-4 h-4" />;
      case 'Failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const totalSent = communications.reduce((sum, c) => sum + (c.sent_count || 0), 0);
  const totalFailed = communications.reduce((sum, c) => sum + (c.failed_count || 0), 0);
  const filteredComms = getFilteredCommunications();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading communications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communication Center</h1>
          <p className="text-gray-600 mt-1">Send SMS and email messages to members</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <Send className="w-5 h-5" />
          <span>New Message</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{communications.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Successfully Sent</p>
              <p className="text-2xl font-bold text-green-600">{totalSent}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{totalFailed}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Recipients</p>
              <p className="text-2xl font-bold text-gray-900">
                {communications.reduce((sum, c) => sum + (c.recipients_count || 0), 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="flex space-x-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="SMS">SMS</option>
              <option value="Email">Email</option>
              <option value="Both">Both</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Sending">Sending</option>
              <option value="Sent">Sent</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredComms.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No communications found</p>
              <button
                onClick={() => setShowNewModal(true)}
                className="mt-4 text-red-600 hover:text-red-700 font-medium"
              >
                Send your first message
              </button>
            </div>
          ) : (
            filteredComms.map((comm) => (
              <div key={comm.id} className="border border-gray-200 rounded-lg p-4 hover:border-red-200 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        {comm.type === 'SMS' ? (
                          <MessageSquare className="w-5 h-5 text-red-600" />
                        ) : (
                          <Mail className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {comm.subject || 'SMS Message'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {comm.type} • Sent by {comm.sent_by || 'Admin'}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{comm.message}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Recipients: {comm.recipients_count}</span>
                      <span>•</span>
                      <span className="text-green-600">Sent: {comm.sent_count}</span>
                      {comm.failed_count > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-red-600">Failed: {comm.failed_count}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{new Date(comm.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(comm.status)}`}>
                    {getStatusIcon(comm.status)}
                    <span>{comm.status}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showNewModal && (
        <NewCommunicationModal
          onClose={() => setShowNewModal(false)}
          onSuccess={() => {
            setShowNewModal(false);
            loadCommunications();
          }}
        />
      )}
    </div>
  );
}
