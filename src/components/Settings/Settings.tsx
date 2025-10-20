import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Settings as SettingsIcon, 
  Shield, 
  User, 
  Bell, 
  Palette, 
  Database,
  Lock,
  Globe,
  Save,
  RefreshCw
} from 'lucide-react';

export function Settings() {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'UPND Membership Platform',
      partyName: 'United Party for National Development',
      partyMotto: 'Unity, Work, Progress',
      supportEmail: 'membership@upnd.zm',
      supportPhone: '+260 211 123 456'
    },
    branding: {
      primaryColor: '#DC2626',
      secondaryColor: '#F59E0B',
      logoUrl: '',
      enableCustomBranding: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: false,
      membershipUpdates: true,
      systemAlerts: true
    },
    security: {
      sessionTimeout: 30,
      passwordExpiry: 90,
      twoFactorAuth: false,
      auditLogging: true,
      ipWhitelist: ''
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      cacheEnabled: true,
      backupFrequency: 'daily'
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'branding', label: 'UPND Branding', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'system', label: 'System', icon: Database }
  ];

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    // Save settings logic
    console.log('Saving UPND settings:', settings);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-upnd-black mb-2">
          Platform Name
        </label>
        <input
          type="text"
          value={settings.general.siteName}
          onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-upnd-black mb-2">
          Party Name
        </label>
        <input
          type="text"
          value={settings.general.partyName}
          onChange={(e) => handleSettingChange('general', 'partyName', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-upnd-black mb-2">
          Party Motto
        </label>
        <input
          type="text"
          value={settings.general.partyMotto}
          onChange={(e) => handleSettingChange('general', 'partyMotto', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-upnd-black mb-2">
            Support Email
          </label>
          <input
            type="email"
            value={settings.general.supportEmail}
            onChange={(e) => handleSettingChange('general', 'supportEmail', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-upnd-black mb-2">
            Support Phone
          </label>
          <input
            type="tel"
            value={settings.general.supportPhone}
            onChange={(e) => handleSettingChange('general', 'supportPhone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderBrandingSettings = () => (
    <div className="space-y-6">
      <div className="bg-upnd-red/5 border border-upnd-red/20 rounded-lg p-4">
        <h4 className="font-semibold text-upnd-black mb-2">UPND Brand Colors</h4>
        <p className="text-sm text-gray-600 mb-4">
          Maintain consistency with official UPND branding guidelines
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-upnd-black mb-2">
              Primary Color (UPND Red)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.branding.primaryColor}
                onChange={(e) => handleSettingChange('branding', 'primaryColor', e.target.value)}
                className="w-12 h-12 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                value={settings.branding.primaryColor}
                onChange={(e) => handleSettingChange('branding', 'primaryColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-upnd-black mb-2">
              Secondary Color (UPND Yellow)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.branding.secondaryColor}
                onChange={(e) => handleSettingChange('branding', 'secondaryColor', e.target.value)}
                className="w-12 h-12 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                value={settings.branding.secondaryColor}
                onChange={(e) => handleSettingChange('branding', 'secondaryColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-upnd-black mb-2">
          UPND Logo URL
        </label>
        <input
          type="url"
          value={settings.branding.logoUrl}
          onChange={(e) => handleSettingChange('branding', 'logoUrl', e.target.value)}
          placeholder="https://upnd.zm/logo.png"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
        />
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="customBranding"
          checked={settings.branding.enableCustomBranding}
          onChange={(e) => handleSettingChange('branding', 'enableCustomBranding', e.target.checked)}
          className="w-4 h-4 text-upnd-red border-gray-300 rounded focus:ring-upnd-red"
        />
        <label htmlFor="customBranding" className="text-sm font-medium text-upnd-black">
          Enable UPND Custom Branding
        </label>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-upnd-black">Email Notifications</h4>
            <p className="text-sm text-gray-600">Send UPND updates via email</p>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications.emailNotifications}
            onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
            className="w-4 h-4 text-upnd-red border-gray-300 rounded focus:ring-upnd-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-upnd-black">SMS Notifications</h4>
            <p className="text-sm text-gray-600">Send UPND alerts via SMS</p>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications.smsNotifications}
            onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
            className="w-4 h-4 text-upnd-red border-gray-300 rounded focus:ring-upnd-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-upnd-black">Membership Updates</h4>
            <p className="text-sm text-gray-600">Notify about UPND membership changes</p>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications.membershipUpdates}
            onChange={(e) => handleSettingChange('notifications', 'membershipUpdates', e.target.checked)}
            className="w-4 h-4 text-upnd-red border-gray-300 rounded focus:ring-upnd-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-upnd-black">System Alerts</h4>
            <p className="text-sm text-gray-600">Critical UPND platform notifications</p>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications.systemAlerts}
            onChange={(e) => handleSettingChange('notifications', 'systemAlerts', e.target.checked)}
            className="w-4 h-4 text-upnd-red border-gray-300 rounded focus:ring-upnd-red"
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-upnd-black mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-upnd-black mb-2">
            Password Expiry (days)
          </label>
          <input
            type="number"
            value={settings.security.passwordExpiry}
            onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-upnd-black">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-600">Enhanced security for UPND admin accounts</p>
          </div>
          <input
            type="checkbox"
            checked={settings.security.twoFactorAuth}
            onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
            className="w-4 h-4 text-upnd-red border-gray-300 rounded focus:ring-upnd-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-upnd-black">Audit Logging</h4>
            <p className="text-sm text-gray-600">Log all UPND administrative actions</p>
          </div>
          <input
            type="checkbox"
            checked={settings.security.auditLogging}
            onChange={(e) => handleSettingChange('security', 'auditLogging', e.target.checked)}
            className="w-4 h-4 text-upnd-red border-gray-300 rounded focus:ring-upnd-red"
          />
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-upnd-black">Maintenance Mode</h4>
            <p className="text-sm text-gray-600">Temporarily disable UPND platform access</p>
          </div>
          <input
            type="checkbox"
            checked={settings.system.maintenanceMode}
            onChange={(e) => handleSettingChange('system', 'maintenanceMode', e.target.checked)}
            className="w-4 h-4 text-upnd-red border-gray-300 rounded focus:ring-upnd-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-upnd-black">Cache Enabled</h4>
            <p className="text-sm text-gray-600">Improve UPND platform performance</p>
          </div>
          <input
            type="checkbox"
            checked={settings.system.cacheEnabled}
            onChange={(e) => handleSettingChange('system', 'cacheEnabled', e.target.checked)}
            className="w-4 h-4 text-upnd-red border-gray-300 rounded focus:ring-upnd-red"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-upnd-black mb-2">
          Backup Frequency
        </label>
        <select
          value={settings.system.backupFrequency}
          onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
        >
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
    </div>
  );

  if (!hasPermission('system_settings')) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">Access Restricted</h3>
          <p className="text-gray-400">You don't have permission to access UPND system settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-upnd-black">UPND Platform Settings</h1>
          <p className="text-upnd-yellow font-medium">Unity, Work, Progress - System Configuration</p>
        </div>
        <div className="flex items-center space-x-3 bg-gradient-to-r from-upnd-red to-upnd-yellow px-4 py-2 rounded-lg">
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
            alt="UPND Logo"
            className="w-6 h-6 object-contain"
          />
          <span className="text-white font-semibold">Admin Settings</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-upnd-red text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-upnd-red'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-upnd-black">
                {tabs.find(tab => tab.id === activeTab)?.label} Settings
              </h2>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-gradient-to-r from-upnd-red to-upnd-yellow text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>

            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'branding' && renderBrandingSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'system' && renderSystemSettings()}
          </div>
        </div>
      </div>

      {/* UPND Values Section */}
      <div className="bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-xl p-8 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">UPND Platform Management</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Unity</h3>
              <p className="text-white/90 text-sm">Unified platform settings for consistent UPND experience</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Work</h3>
              <p className="text-white/90 text-sm">Efficient configuration tools for optimal platform performance</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Progress</h3>
              <p className="text-white/90 text-sm">Advanced settings to drive UPND digital transformation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}