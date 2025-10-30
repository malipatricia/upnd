'use client';

import useSWR from 'swr';
import { updateRolePermissionsAction } from '@/server/server.actions';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Permission {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ManageRolesPermissionsForm() {
  const { data: roles, error: rolesError } = useSWR<Role[]>('/api/roles', fetcher);
  const { data: permissions, error: permissionsError } = useSWR<Permission[]>('/api/permissions', fetcher);

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // When selectedRoleId changes, populate permissions checkboxes
useEffect(() => {
  if (roles && selectedRoleId) {
    const role = roles.find(r => r.id === selectedRoleId);
    setSelectedPermissions(role?.permissions?.map(p => p.id) ?? []); // <-- use ?? []
  }
}, [selectedRoleId, roles]);


  if (rolesError) return <p className="text-red-600">Failed to load roles</p>;
  if (permissionsError) return <p className="text-red-600">Failed to load permissions</p>;
  if (!roles || !permissions) return <p>Loading...</p>;

  const handleCheckboxChange = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId) return toast.error('Please select a role');

    setLoading(true);
    try {
      const result = await updateRolePermissionsAction(selectedRoleId, selectedPermissions);

      if ('error' in result) {
        toast.error(result.error);
      } else {
        toast.success(`Permissions updated successfully!`);
        setSelectedRoleId("");           // clear selected role
        setSelectedPermissions([]);   
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update permissions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
      <h5 className="font-semibold text-upnd-black">Manage Role Permissions</h5>

      {/* Role Selector */}
      <select
        value={selectedRoleId || ''}
        onChange={(e) => setSelectedRoleId(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent"
      >
        <option value="" disabled>Select a role...</option>
        {roles.map(role => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
      </select>

      {/* Permissions Checkboxes */}
      {selectedRoleId && (
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
      )}

      <button
        type="submit"
        disabled={loading || !selectedRoleId}
        className="w-full py-2 bg-upnd-red text-white rounded-md hover:bg-upnd-red-dark disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update Permissions'}
      </button>
    </form>
  );
}
