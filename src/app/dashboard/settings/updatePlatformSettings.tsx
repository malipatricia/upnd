'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { fetcher } from '@/services/fetcher';
import { updateSettings } from '@/server/server.actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function SettingsForm() {
  const { data: settings, mutate } = useSWR('/api/settings/platform', fetcher);

  const [form, setForm] = useState({
    platformName: '',
    partyName: '',
    partyMotto: '',
    supportEmail: '',
    supportPhone: '',
  });

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateSettings(form);
      toast.success('Settings updated!');
      mutate(); // refresh SWR cache
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 max-w-5xl">
      {/* --- Left: Editable Form --- */}
      <Card className="space-y-4 p-6">
        <h2 className="text-lg font-semibold">Update Settings</h2>
        <div className="space-y-4">
          <div>
            <Label>Platform Name</Label>
            <Input
              className="w-full h-12"
              placeholder="Platform Name"
              value={form.platformName}
              onChange={e => handleChange('platformName', e.target.value)}
            />
          </div>
          <div>
            <Label>Party Name</Label>
            <Input
              className="w-full h-12"
              placeholder="Party Name"
              value={form.partyName}
              onChange={e => handleChange('partyName', e.target.value)}
            />
          </div>
          <div>
            <Label>Party Motto</Label>
            <Input
              className="w-full h-12"
              placeholder="Party Motto"
              value={form.partyMotto}
              onChange={e => handleChange('partyMotto', e.target.value)}
            />
          </div>
          <div>
            <Label>Support Email</Label>
            <Input
              className="w-full h-12"
              placeholder="Support Email"
              value={form.supportEmail}
              onChange={e => handleChange('supportEmail', e.target.value)}
            />
          </div>
          <div>
            <Label>Support Phone</Label>
            <Input
              className="w-full h-12"
              placeholder="Support Phone"
              value={form.supportPhone}
              onChange={e => handleChange('supportPhone', e.target.value)}
            />
          </div>
          <Button className="mt-2 w-full" onClick={handleSubmit}>
            Save Settings
          </Button>
        </div>
      </Card>

      {/* --- Right: Defaults --- */}
      <Card className="space-y-4 p-6 bg-red-100/20">
        <h2 className="text-lg font-semibold">Current Settings</h2>
        {settings ? (
          <div className="space-y-4">
            <div>
              <Label>Platform Name</Label>
              <p className="p-2 border rounded bg-white">{settings[0].platformName}</p>
            </div>
            <div>
              <Label>Party Name</Label>
              <p className="p-2 border rounded bg-white">{settings[0].partyName}</p>
            </div>
            <div>
              <Label>Party Motto</Label>
              <p className="p-2 border rounded bg-white">{settings[0].partyMotto}</p>
            </div>
            <div>
              <Label>Support Email</Label>
              <p className="p-2 border rounded bg-white">{settings[0].supportEmail}</p>
            </div>
            <div>
              <Label>Support Phone</Label>
              <p className="p-2 border rounded bg-white">{settings[0].supportPhone}</p>
            </div>
          </div>
        ) : (
          <p>Loading defaults...</p>
        )}
      </Card>
    </div>
  );
}
