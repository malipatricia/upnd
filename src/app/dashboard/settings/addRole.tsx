'use client';

import useSWR from 'swr';
import { addRoleAction } from '@/server/server.actions';
import { useState } from 'react';
import { toast } from 'sonner';

interface Permission {
  id: string;
  name: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function AddRoleForm() {
  const { data: permissions, error } = useSWR<Permission[]>('/api/permissions', fetcher);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  if (error) return <p className="text-red-600">Failed to load permissions</p>;
  if (!permissions) return <p>Loading permissions...</p>;

  const handleCheckboxChange = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Role name is required');

    setLoading(true);
    try {
      const result = await addRoleAction(name, description, selectedPermissions);

      if ('error' in result) {
        toast.error(result.error);
      } else {
        toast.success(`Role "${name}" added successfully!`);
        setName('');
        setDescription('');
        setSelectedPermissions([]);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to add role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
      <h5 className="font-semibold text-upnd-black">Add New Role</h5>

      <input
        type="text"
        placeholder="Role Name"
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
        <p className="text-sm font-medium text-upnd-black">Assign Permissions</p>
        {permissions.map(permission => (
          <label key={permission.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedPermissions.includes(permission.id)}
              onChange={() => handleCheckboxChange(permission.id)}
              className="w-4 h-4 text-upnd-red border-gray-300 rounded focus:ring-upnd-red"
            />
            <span className="text-gray-700">{permission.name}</span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-upnd-red text-white rounded-md hover:bg-upnd-red-dark disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Role'}
      </button>
    </form>
  );
}
