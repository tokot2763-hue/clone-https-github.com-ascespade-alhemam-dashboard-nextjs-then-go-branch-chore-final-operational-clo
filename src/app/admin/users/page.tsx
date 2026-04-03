'use client';

import { useState, useEffect } from 'react';
import { Users, Shield, Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role_id: string | null;
  tenant_id: string | null;
  created_at: string;
  role?: {
    id: string;
    role_key: string;
    name: string;
    role_level: number;
  };
}

interface Role {
  id: string;
  role_key: string;
  name: string;
  role_level: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/users');
      const data = await res.json();
      if (data.users) setUsers(data.users);
      if (data.roles) setRoles(data.roles);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function updateRole(userId: string, roleId: string | null) {
    try {
      await fetch('/api/v1/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateRole', userId, roleId }),
      });
      setEditingUser(null);
      loadData();
    } catch (e) {
      console.error(e);
    }
  }

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Users Management</h1>
            <p className="text-neutral-400">{users.length} users</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Level</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Created</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-700/30">
                  <td className="px-4 py-3">
                    <div className="text-white">{user.full_name || 'N/A'}</div>
                    <div className="text-sm text-neutral-400">{user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    {editingUser === user.id ? (
                      <select
                        value={user.role_id || ''}
                        onChange={(e) => updateRole(user.id, e.target.value || null)}
                        onBlur={() => setEditingUser(null)}
                        className="bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-white"
                        autoFocus
                      >
                        <option value="">No Role</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded text-sm ${
                        (user.role?.role_level || 0) >= 100 ? 'bg-red-500/20 text-red-400' :
                        (user.role?.role_level || 0) >= 50 ? 'bg-blue-500/20 text-blue-400' :
                        'bg-neutral-700 text-neutral-300'
                      }`}>
                        {user.role?.name || 'No Role'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-300">
                    {user.role?.role_level ?? '-'}
                  </td>
                  <td className="px-4 py-3 text-neutral-400 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditingUser(user.id)}
                      className="p-1 hover:bg-neutral-700 rounded"
                    >
                      <Edit className="w-4 h-4 text-neutral-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}