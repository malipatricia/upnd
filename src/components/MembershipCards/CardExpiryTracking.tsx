import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, AlertTriangle, CheckCircle, Clock, RefreshCw, Send } from 'lucide-react';

interface CardExpiry {
  id: string;
  member_id: string;
  card_type: string;
  issue_date: string;
  expiry_date: string;
  status: string;
  renewal_reminder_sent: boolean;
  member: {
    full_name: string;
    membership_id: string;
    email: string;
    phone: string;
  };
}

export function CardExpiryTracking() {
  const [cards, setCards] = useState<CardExpiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'expiring' | 'expired'>('all');

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('membership_cards')
        .select(`
          id,
          member_id,
          card_type,
          issue_date,
          expiry_date,
          status,
          renewal_reminder_sent,
          members!inner(
            full_name,
            membership_id,
            email,
            phone
          )
        `)
        .order('expiry_date', { ascending: true });

      if (error) throw error;

      const formattedCards = (data || []).map(card => ({
        ...card,
        member: Array.isArray(card.members) ? card.members[0] : card.members
      }));

      setCards(formattedCards);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilExpiry = (expiryDate: string): number => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryStatus = (expiryDate: string) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0) return 'expired';
    if (days <= 30) return 'expiring';
    return 'active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expired':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'expiring':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'expired':
        return <AlertTriangle className="w-4 h-4" />;
      case 'expiring':
        return <Clock className="w-4 h-4" />;
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleSendReminder = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from('membership_cards')
        .update({
          renewal_reminder_sent: true,
          renewal_reminder_sent_at: new Date().toISOString()
        })
        .eq('id', cardId);

      if (error) throw error;

      alert('Renewal reminder sent successfully');
      loadCards();
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('Failed to send reminder');
    }
  };

  const handleRenewCard = async (cardId: string) => {
    try {
      const newExpiryDate = new Date();
      newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);

      const { error } = await supabase
        .from('membership_cards')
        .update({
          expiry_date: newExpiryDate.toISOString().split('T')[0],
          status: 'Active',
          renewal_reminder_sent: false,
          last_renewed_at: new Date().toISOString()
        })
        .eq('id', cardId);

      if (error) throw error;

      alert('Card renewed successfully');
      loadCards();
    } catch (error) {
      console.error('Error renewing card:', error);
      alert('Failed to renew card');
    }
  };

  const filteredCards = cards.filter(card => {
    const status = getExpiryStatus(card.expiry_date);
    if (filter === 'all') return true;
    if (filter === 'expiring') return status === 'expiring';
    if (filter === 'expired') return status === 'expired';
    return true;
  });

  const expiredCount = cards.filter(c => getExpiryStatus(c.expiry_date) === 'expired').length;
  const expiringCount = cards.filter(c => getExpiryStatus(c.expiry_date) === 'expiring').length;
  const activeCount = cards.filter(c => getExpiryStatus(c.expiry_date) === 'active').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading card expiry data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Card Expiry Tracking</h2>
          <p className="text-gray-600 mt-1">Monitor and manage membership card renewals</p>
        </div>
        <button
          onClick={loadCards}
          className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cards</p>
              <p className="text-2xl font-bold text-gray-900">{cards.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-yellow-600">{expiringCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-red-600">{expiredCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Cards
            </button>
            <button
              onClick={() => setFilter('expiring')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'expiring'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Expiring Soon ({expiringCount})
            </button>
            <button
              onClick={() => setFilter('expired')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'expired'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Expired ({expiredCount})
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredCards.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No cards found</p>
            </div>
          ) : (
            filteredCards.map((card) => {
              const daysUntilExpiry = getDaysUntilExpiry(card.expiry_date);
              const status = getExpiryStatus(card.expiry_date);

              return (
                <div key={card.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{card.member.full_name}</h3>
                          <p className="text-sm text-gray-600">{card.member.membership_id}</p>
                        </div>
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                          {getStatusIcon(status)}
                          <span className="capitalize">{status}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                        <span>Card Type: {card.card_type}</span>
                        <span>•</span>
                        <span>Issued: {new Date(card.issue_date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Expires: {new Date(card.expiry_date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className={daysUntilExpiry < 0 ? 'text-red-600 font-medium' : ''}>
                          {daysUntilExpiry < 0
                            ? `Expired ${Math.abs(daysUntilExpiry)} days ago`
                            : `${daysUntilExpiry} days remaining`
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!card.renewal_reminder_sent && (status === 'expiring' || status === 'expired') && (
                        <button
                          onClick={() => handleSendReminder(card.id)}
                          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Send className="w-4 h-4" />
                          <span>Send Reminder</span>
                        </button>
                      )}
                      {card.renewal_reminder_sent && (
                        <span className="text-xs text-green-600 font-medium">Reminder Sent</span>
                      )}
                      <button
                        onClick={() => handleRenewCard(card.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Renew Card
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
