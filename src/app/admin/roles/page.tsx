'use client';

import { useState, useEffect } from 'react';
import { Shield, Plus, Edit, Trash2, Loader2, AlertTriangle } from 'lucide-react';

interface Role {
  id: string;
  role_key: string;
  name: string;
  role_level: number;
  created_at: string;
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', role_key: '', role_level: 50 });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    setInitialized(true);
    
    fetch('/api/v1/admin/users')
      .then(res => res.json())
      .then(data => {
        if (data.roles) setRoles(data.roles);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [initialized]);

  const loading = isLoading;

  function reloadData() {
    setIsLoading(true);
    fetch('/api/v1/admin/users')
      .then(res => res.json())
      .then(data => {
        if (data.roles) setRoles(data.roles);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }

  async function createRole() {
    if (!newRole.name || !newRole.role_key) return;
    
    try {
      await fetch('/api/v1/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createRole', ...newRole }),
      });
      setShowCreate(false);
      setNewRole({ name: '', role_key: '', role_level: 50 });
      reloadData();
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Roles & Permissions</h1>
            <p className="text-neutral-400">{roles.length} roles defined</p>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Role
          </button>
        </div>

        {showCreate && (
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Create New Role</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Role Name (e.g., Doctor)"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                className="px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="Role Key (e.g., doctor)"
                value={newRole.role_key}
                onChange={(e) => setNewRole({ ...newRole, role_key: e.target.value })}
                className="px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="number"
                placeholder="Role Level"
                value={newRole.role_level}
                onChange={(e) => setNewRole({ ...newRole, role_level: parseInt(e.target.value) || 0 })}
                className="px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={createRole}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Key</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Level</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-neutral-700/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span className="text-white font-medium">{role.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-neutral-400 font-mono text-sm">{role.role_key}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      role.role_level >= 100 ? 'bg-red-500/20 text-red-400' :
                      role.role_level >= 50 ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      Level {role.role_level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-400 text-sm">
                    {role.role_level >= 100 && 'Full Admin Access'}
                    {role.role_level >= 50 && role.role_level < 100 && 'Medical Staff'}
                    {role.role_level >= 30 && role.role_level < 50 && 'Operations'}
                    {role.role_level >= 10 && role.role_level < 30 && 'Patient/Guardian'}
                    {role.role_level < 10 && 'Limited'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-neutral-800 rounded-xl border border-neutral-700 p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Role Level Reference</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-neutral-300">100: <span className="text-red-400">Admin</span></div>
            <div className="text-neutral-300">60: <span className="text-blue-400">Super Doctor</span></div>
            <div className="text-neutral-300">50: <span className="text-blue-400">Doctor</span></div>
            <div className="text-neutral-300">40: <span className="text-cyan-400">Nurse</span></div>
            <div className="text-neutral-300">30: <span className="text-yellow-400">Receptionist</span></div>
            <div className="text-neutral-300">20: <span className="text-purple-400">Guardian</span></div>
            <div className="text-neutral-300">10: <span className="text-green-400">Patient</span></div>
            <div className="text-neutral-300">0: <span className="text-neutral-500">Guest</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}