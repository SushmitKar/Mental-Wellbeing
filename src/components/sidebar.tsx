import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64 bg-gray-800 text-white h-full fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-indigo-400">Therapist Dashboard</h2>
      </div>
      <nav>
        <ul className="space-y-4 px-6">
          <li>
            <Link 
              href="/dashboard/therapist" 
              className={`text-lg block py-2 px-4 rounded-lg transition-colors ${
                isActive("/dashboard/therapist") 
                  ? "bg-indigo-600 text-white" 
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard/therapist/appointments" 
              className={`text-lg block py-2 px-4 rounded-lg transition-colors ${
                isActive("/dashboard/therapist/appointments") 
                  ? "bg-indigo-600 text-white" 
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              Appointments
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard/therapist/therapist-settings" 
              className={`text-lg block py-2 px-4 rounded-lg transition-colors ${
                isActive("/dashboard/therapist/therapist-settings") 
                  ? "bg-indigo-600 text-white" 
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
