import Link from "next/link"
import { Home, FileText, UserCircle, LayoutDashboard } from "lucide-react"

export function Sidebar() {
  return (
    <div className="bg-primary text-primary-foreground w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <nav>
        <Link
          href="/"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-primary/80 hover:text-primary-foreground"
        >
          <Home className="inline-block mr-2" size={20} />
          Home
        </Link>
        <Link
          href="/app"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-primary/80 hover:text-primary-foreground"
        >
          <LayoutDashboard className="inline-block mr-2" size={20} />
          Dashboard
        </Link>
        <Link
          href="/app/prompts"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-primary/80 hover:text-primary-foreground"
        >
          <FileText className="inline-block mr-2" size={20} />
          My Prompts
        </Link>
        <Link
          href="/app/profile"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-primary/80 hover:text-primary-foreground"
        >
          <UserCircle className="inline-block mr-2" size={20} />
          Profile
        </Link>
      </nav>
    </div>
  )
}
