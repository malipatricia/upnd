'use client';

import useSWR from 'swr';
import { addPermissionAction } from '@/server/server.actions';
import { useState } from 'react';
import { toast } from 'sonner';

interface Role {
  id: string;
  name: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function AddPermissionForm() {
  const { data: roles, error } = useSWR<Role[]>('/api/roles', fetcher);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  if (error) return <p className="text-red-600">Failed to load roles</p>;
  if (!roles) return <p>Loading roles...</p>;

  const handleCheckboxChange = (roleId: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Permission name is required');

    setLoading(true);
    try {
      const result = await addPermissionAction(name, description, selectedRoles);

      if ('error' in result) {
        toast.error(result.error);
      } else {
        toast.success(`Permission "${name}" added successfully!`);
        setName('');
        setDescription('');
        setSelectedRoles([]);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to add permission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
      <h5 className="font-semibold text-upnd-black">Add New Permission</h5>

      <input
        type="text"
        placeholder="Permission Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
      />

      <input
        type="text"
        placeholder="Optional description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
      />

      <div className="space-y-2">
        <p className="text-sm font-medium text-upnd-black">Assign to Roles</p>
        {roles.map(role => (
          <label key={role.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedRoles.includes(role.id)}
              onChange={() => handleCheckboxChange(role.id)}
              className="w-4 h-4 text-upnd-red border-gray-300 rounded focus:ring-upnd-red"
            />
            <span className="text-gray-700">{role.name}</span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-upnd-red text-white rounded-md hover:bg-upnd-red-dark disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Permission'}
      </button>
    </form>
  );
}
