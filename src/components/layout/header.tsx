import { Flame, Moon, Sun } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"

export function Header() {
  const { theme, toggle } = useTheme()
  const location = useLocation()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg no-underline text-foreground">
          <Flame className="h-5 w-5 text-primary" />
          SkillBoiler
        </Link>

        <nav className="flex items-center gap-2">
          {location.pathname !== "/" && (
            <Link to="/">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </nav>
      </div>
    </header>
  )
}
