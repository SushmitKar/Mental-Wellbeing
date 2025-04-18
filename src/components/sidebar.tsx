import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white h-full fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-indigo-400">Therapist Dashboard</h2>
      </div>
      <nav>
        <ul className="space-y-4 px-6">
          <li>
            <Link href="/dashboard/therapist" className="text-lg hover:text-indigo-400">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/dashboard/therapist/therapist-settings" className="sidebar-item">
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
