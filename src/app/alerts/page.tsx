'use client';

import { useState, useEffect } from 'react';
import { AlertConfig } from '@/types/alerts';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState<Partial<AlertConfig>>({
    name: '',
    description: '',
    enabled: true,
    filters: {
      categories: [],
      locations: [],
      keywords: [],
      exclude_keywords: []
    },
    notification_channels: {
      email: {
        enabled: false,
        addresses: [],
        template: 'detailed'
      }
    },
    frequency: {
      type: 'immediate'
    }
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/alerts?user_id=demo-user');
      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async () => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'demo-user', ...newAlert })
      });
      
      if (response.ok) {
        setShowCreateForm(false);
        fetchAlerts();
        setNewAlert({
          name: '',
          description: '',
          enabled: true,
          filters: {
            categories: [],
            locations: [],
            keywords: [],
            exclude_keywords: []
          },
          notification_channels: {
            email: {
              enabled: false,
              addresses: [],
              template: 'detailed'
            }
          },
          frequency: {
            type: 'immediate'
          }
        });
      }
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  const toggleAlert = async (alertId: string, enabled: boolean) => {
    try {
      await fetch('/api/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: alertId, 
          user_id: 'demo-user',
          enabled 
        })
      });
      fetchAlerts();
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      await fetch(`/api/alerts?id=${alertId}&user_id=demo-user`, {
        method: 'DELETE'
      });
      fetchAlerts();
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento alert...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎯 Gestione Alert</h1>
              <p className="mt-2 text-gray-600">
                Configura alert personalizzati per eventi, concerti, sagre e molto altro in Toscana
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              + Nuovo Alert
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🔔</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Alert Attivi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alerts.filter(a => a.enabled).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">📧</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Alert Email</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alerts.filter(a => a.notification_channels.email?.enabled).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Alert Immediati</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alerts.filter(a => a.frequency.type === 'immediate').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tot. Inviati</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alerts.reduce((sum, a) => sum + a.total_alerts_sent, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alert List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">I tuoi Alert</h2>
          </div>
          
          {alerts.length === 0 ? (
            <div className="p-12 text-center">
              <span className="text-6xl mb-4 block">🔍</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun alert configurato</h3>
              <p className="text-gray-600 mb-6">Crea il tuo primo alert per iniziare a ricevere notifiche personalizzate</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Crea il primo Alert
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{alert.name}</h3>
                        <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                          alert.enabled 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {alert.enabled ? 'Attivo' : 'Disattivo'}
                        </span>
                      </div>
                      
                      {alert.description && (
                        <p className="mt-1 text-sm text-gray-600">{alert.description}</p>
                      )}
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                        {alert.filters.categories.map((cat) => (
                          <span key={cat} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {cat}
                          </span>
                        ))}
                        {alert.filters.locations.map((loc) => (
                          <span key={loc} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            📍 {loc}
                          </span>
                        ))}
                        {alert.filters.keywords.map((keyword) => (
                          <span key={keyword} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            🔍 {keyword}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-500">
                        <span>Frequenza: {alert.frequency.type}</span>
                        <span className="mx-2">•</span>
                        <span>Alert inviati: {alert.total_alerts_sent}</span>
                        {alert.last_triggered && (
                          <>
                            <span className="mx-2">•</span>
                            <span>Ultimo: {new Date(alert.last_triggered).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleAlert(alert.id, !alert.enabled)}
                        className={`px-3 py-1 text-sm font-medium rounded ${
                          alert.enabled
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {alert.enabled ? 'Disattiva' : 'Attiva'}
                      </button>
                      
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded hover:bg-red-200"
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Alert Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Crea Nuovo Alert</h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Alert *
                  </label>
                  <input
                    type="text"
                    value={newAlert.name || ''}
                    onChange={(e) => setNewAlert({...newAlert, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="es. Eventi Jazz a Firenze"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrizione
                  </label>
                  <textarea
                    value={newAlert.description || ''}
                    onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Descrizione opzionale dell'alert"
                  />
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categorie di Interesse
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['eventi', 'concerti', 'sagre', 'festival', 'mercatini', 'aperture'].map((cat) => (
                      <label key={cat} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newAlert.filters?.categories?.includes(cat) || false}
                          onChange={(e) => {
                            const filters = newAlert.filters || { categories: [], locations: [], keywords: [], exclude_keywords: [] };
                            const categories = filters.categories || [];
                            const updated = e.target.checked
                              ? [...categories, cat]
                              : categories.filter(c => c !== cat);
                            setNewAlert({
                              ...newAlert,
                              filters: {
                                categories: updated,
                                locations: filters.locations || [],
                                keywords: filters.keywords || [],
                                exclude_keywords: filters.exclude_keywords || []
                              }
                            });
                          }}
                          className="mr-2"
                        />
                        <span className="capitalize">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parole Chiave (separate da virgola)
                  </label>
                  <input
                    type="text"
                    placeholder="jazz, musica, concerto, festival"
                    onChange={(e) => {
                      const filters = newAlert.filters || { categories: [], locations: [], keywords: [], exclude_keywords: [] };
                      const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
                      setNewAlert({
                        ...newAlert,
                        filters: {
                          categories: filters.categories || [],
                          locations: filters.locations || [],
                          keywords: keywords,
                          exclude_keywords: filters.exclude_keywords || []
                        }
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email Configuration */}
                <div>
                  <label className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={newAlert.notification_channels?.email?.enabled || false}
                      onChange={(e) => setNewAlert({
                        ...newAlert,
                        notification_channels: {
                          ...newAlert.notification_channels,
                          email: {
                            ...newAlert.notification_channels?.email,
                            enabled: e.target.checked,
                            addresses: ['admin@eventi-toscana.com'],
                            template: 'detailed'
                          }
                        }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Notifiche Email</span>
                  </label>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Annulla
                </button>
                <button
                  onClick={createAlert}
                  disabled={!newAlert.name}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Crea Alert
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
