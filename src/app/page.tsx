import Link from "next/link";
import { Shield, Users, Stethoscope, Activity, Lock, Database } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-800">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-neutral-700">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-emerald-400" />
          <span className="text-xl font-bold text-white">Alhemam</span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-neutral-300 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="px-8 py-24 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Schema-Driven Healthcare Platform
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-12">
          Dynamic platform powered by database-driven navigation, roles, and permissions.
          Every page, role, and permission is configurable from the database.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            Login to Dashboard
          </Link>
        </div>
      </section>

      <section className="px-8 py-16 bg-neutral-800/50">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 bg-neutral-800 rounded-xl border border-neutral-700">
            <Database className="w-12 h-12 text-emerald-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Schema-Driven</h3>
            <p className="text-neutral-400">
              All pages, sections, and navigation are read from the database. Add new pages without deploying code.
            </p>
          </div>
          <div className="p-6 bg-neutral-800 rounded-xl border border-neutral-700">
            <Shield className="w-12 h-12 text-emerald-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Role-Based Access</h3>
            <p className="text-neutral-400">
              11 predefined roles with granular permissions. Access control is dynamic and configurable.
            </p>
          </div>
          <div className="p-6 bg-neutral-800 rounded-xl border border-neutral-700">
            <Activity className="w-12 h-12 text-emerald-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Multi-Tenant</h3>
            <p className="text-neutral-400">
              Built for healthcare organizations with multi-tenant architecture support.
            </p>
          </div>
        </div>
      </section>

      <section className="px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Available Roles</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { name: "Admin", icon: Shield, desc: "Full system access" },
            { name: "Doctor", icon: Stethoscope, desc: "Medical records" },
            { name: "Nurse", icon: Users, desc: "Patient care" },
            { name: "Patient", icon: Activity, desc: "Self-service" },
            { name: "Pharmacist", icon: Shield, desc: "Pharmacy access" },
            { name: "Lab Tech", icon: Activity, desc: "Lab results" },
            { name: "Receptionist", icon: Users, desc: "Front desk" },
            { name: "Accountant", icon: Shield, desc: "Finance" },
          ].map((role) => (
            <div key={role.name} className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
              <role.icon className="w-8 h-8 text-emerald-400 mb-2" />
              <h3 className="font-semibold text-white">{role.name}</h3>
              <p className="text-sm text-neutral-400">{role.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-8 py-8 border-t border-neutral-700 text-center">
        <p className="text-neutral-500">
          Powered by Next.js 16 + Supabase + Tailwind CSS 4
        </p>
      </footer>
    </main>
  );
}
