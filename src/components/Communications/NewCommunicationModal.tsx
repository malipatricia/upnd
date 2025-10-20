import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Send, Users, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NewCommunicationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function NewCommunicationModal({ onClose, onSuccess }: NewCommunicationModalProps) {
  const { user } = useAuth();
  const [type, setType] = useState<string>('SMS');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [filterProvince, setFilterProvince] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMembershipLevel, setFilterMembershipLevel] = useState('all');
  const [recipientCount, setRecipientCount] = useState(0);
  const [sending, setSending] = useState(false);

  const provinces = ['Central', 'Copperbelt', 'Eastern', 'Luapula', 'Lusaka', 'Muchinga', 'Northern', 'North-Western', 'Southern', 'Western'];

  useEffect(() => {
    calculateRecipients();
  }, [filterProvince, filterStatus, filterMembershipLevel]);

  const calculateRecipients = async () => {
    try {
      let query = supabase.from('members').select('id', { count: 'exact', head: true });

      if (filterProvince !== 'all') {
        query = query.eq('province', filterProvince);
      }
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }
      if (filterMembershipLevel !== 'all') {
        query = query.eq('membership_level', filterMembershipLevel);
      }

      const { count, error } = await query;
      if (error) throw error;
      setRecipientCount(count || 0);
    } catch (error) {
      console.error('Error calculating recipients:', error);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    if (recipientCount === 0) {
      alert('No recipients match your filters');
      return;
    }

    try {
      setSending(true);

      const recipientFilter = {
        province: filterProvince !== 'all' ? filterProvince : null,
        status: filterStatus !== 'all' ? filterStatus : null,
        membershipLevel: filterMembershipLevel !== 'all' ? filterMembershipLevel : null
      };

      const { data: commData, error: commError } = await supabase
        .from('communications')
        .insert({
          type,
          subject: type === 'Email' || type === 'Both' ? subject : null,
          message,
          recipient_filter: recipientFilter,
          recipients_count: recipientCount,
          sent_count: recipientCount,
          failed_count: 0,
          status: 'Sent',
          sent_by: user?.name || 'Admin',
          sent_at: new Date().toISOString()
        })
        .select()
        .single();

      if (commError) throw commError;

      let query = supabase.from('members').select('id');
      if (filterProvince !== 'all') query = query.eq('province', filterProvince);
      if (filterStatus !== 'all') query = query.eq('status', filterStatus);
      if (filterMembershipLevel !== 'all') query = query.eq('membership_level', filterMembershipLevel);

      const { data: members, error: membersError } = await query;
      if (membersError) throw membersError;

      const recipients = (members || []).map(member => ({
        communication_id: commData.id,
        member_id: member.id,
        status: 'Sent',
        sent_at: new Date().toISOString()
      }));

      if (recipients.length > 0) {
        const { error: recipientsError } = await supabase
          .from('communication_recipients')
          .insert(recipients);

        if (recipientsError) throw recipientsError;
      }

      onSuccess();
    } catch (error) {
      console.error('Error sending communication:', error);
      alert('Failed to send communication');
    } finally {
      setSending(false);
    }
  };

  const characterCount = message.length;
  const smsCount = Math.ceil(characterCount / 160);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">New Communication</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Communication Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setType('SMS')}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  type === 'SMS'
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                SMS Only
              </button>
              <button
                onClick={() => setType('Email')}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  type === 'Email'
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                Email Only
              </button>
              <button
                onClick={() => setType('Both')}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  type === 'Both'
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                SMS & Email
              </button>
            </div>
          </div>

          {(type === 'Email' || type === 'Both') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter email subject"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              placeholder="Enter your message here..."
            />
            <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
              <span>{characterCount} characters</span>
              {type !== 'Email' && (
                <span>{smsCount} SMS message{smsCount !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Recipient Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Province
                </label>
                <select
                  value={filterProvince}
                  onChange={(e) => setFilterProvince(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Provinces</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending Section Review">Pending Section Review</option>
                  <option value="Pending Branch Review">Pending Branch Review</option>
                  <option value="Pending Ward Review">Pending Ward Review</option>
                  <option value="Pending District Review">Pending District Review</option>
                  <option value="Pending Provincial Review">Pending Provincial Review</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Membership Level
                </label>
                <select
                  value={filterMembershipLevel}
                  onChange={(e) => setFilterMembershipLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="General">General</option>
                  <option value="Youth Wing">Youth Wing</option>
                  <option value="Women's Wing">Women's Wing</option>
                  <option value="Veterans">Veterans</option>
                </select>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-3">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {recipientCount} member{recipientCount !== 1 ? 's' : ''} will receive this message
                </p>
                <p className="text-xs text-blue-700">Based on your selected filters</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !message.trim() || recipientCount === 0}
            className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            <span>{sending ? 'Sending...' : 'Send Message'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
