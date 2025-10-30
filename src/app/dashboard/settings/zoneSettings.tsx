'use client';

import { useState, startTransition } from 'react';
import useSWR from 'swr';
import { z } from 'zod';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetcher } from '@/services/fetcher';
import { addDistrictAction, addProvinceAction, deleteDistrictAction, deleteProvinceAction } from '@/server/server.actions';

// Zod schemas (optional, server actions should re-validate)
const provinceSchema = z.object({ name: z.string().min(1) });
const districtSchema = z.object({ name: z.string().min(1), provinceId: z.string().uuid() });

export default function ZoneSettings() {
  const [provinceName, setProvinceName] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [districtProvinceId, setDistrictProvinceId] = useState('');

  const { data: provinces, mutate: mutateProvinces } = useSWR('/api/provinces', fetcher);
  const { data: districts, mutate: mutateDistricts } = useSWR('/api/districts', fetcher);

  // --- Server Actions ---
  const handleAddProvince = async () => {
    try {
      provinceSchema.parse({ name: provinceName });
      await addProvinceAction(provinceName);
      setProvinceName('');
      startTransition(() => {
        mutateProvinces();
      });
      toast.success('Province added!');
    } catch (e: any) {
      toast.error(e.message || 'Invalid input');
    }
  };

  const handleDeleteProvince = async (id: string) => {
    if (!confirm('Delete this province?')) return;
    await deleteProvinceAction(id);
    startTransition(() => {
      mutateProvinces();
      mutateDistricts();
    });
    toast.success('Province deleted!');
  };

  const handleAddDistrict = async () => {
    try {
      districtSchema.parse({ name: districtName, provinceId: districtProvinceId });
      await addDistrictAction(districtName, districtProvinceId);
      setDistrictName('');
      setDistrictProvinceId('');
      startTransition(() => mutateDistricts());
      toast.success('District added!');
    } catch (e: any) {
      toast.error(e.message || 'Invalid input');
    }
  };

  const handleDeleteDistrict = async (id: string) => {
    if (!confirm('Delete this district?')) return;
    await deleteDistrictAction(id);
    startTransition(() => mutateDistricts());
    toast.success('District deleted!');
  };

  return (
    <Tabs defaultValue="provinces" className="space-y-4">
      <TabsList>
        <TabsTrigger value="provinces">Provinces</TabsTrigger>
        <TabsTrigger value="districts">Districts</TabsTrigger>
      </TabsList>

      <TabsContent value="provinces" className="space-y-4">
        <div className="flex space-x-2">
          <Input placeholder="New province" value={provinceName} onChange={e => setProvinceName(e.target.value)} />
          <Button onClick={handleAddProvince}>Add Province</Button>
        </div>
        <div className="space-y-2">
          {provinces?.map((p: any) => (
            <div key={p.id} className="flex justify-between items-center p-2 border rounded">
              <span>{p.name}</span>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteProvince(p.id)}>Delete</Button>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="districts" className="space-y-4">
        <div className="flex space-x-2">
          <Input placeholder="New district" value={districtName} onChange={e => setDistrictName(e.target.value)} />
          <select
            value={districtProvinceId}
            onChange={e => setDistrictProvinceId(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Select Province</option>
            {provinces?.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <Button onClick={handleAddDistrict}>Add District</Button>
        </div>
        <div className="space-y-2">
          {districts?.map((d: any) => (
            <div key={d.id} className="flex justify-between items-center p-2 border rounded">
              <span>{d.name} ({provinces?.find((p: any) => p.id === d.provinceId)?.name})</span>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteDistrict(d.id)}>Delete</Button>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
