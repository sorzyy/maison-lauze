import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  primaryColor?: string
}

export function TubelightNavbar({ items, className, primaryColor = '#c4402a' }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  useEffect(() => {
    const handleResize = () => {}
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className={cn("fixed bottom-6 sm:bottom-auto sm:top-6 left-1/2 -translate-x-1/2 z-50", className)}>
      <div className="flex items-center gap-1 backdrop-blur-md py-1 px-1.5 rounded-full shadow-xl"
        style={{ background: 'rgba(8,1,1,0.75)', border: '1px solid rgba(255,255,255,0.1)' }}>
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name
          return (
            <a
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-xs font-medium px-5 py-2.5 rounded-full transition-colors duration-200",
                "tracking-[0.12em] uppercase",
                isActive ? "text-white" : "text-white/45 hover:text-white/75"
              )}
            >
              <span className="hidden sm:inline">{item.name}</span>
              <span className="sm:hidden">
                <Icon size={16} strokeWidth={2} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="tubelight"
                  className="absolute inset-0 rounded-full -z-10"
                  style={{ background: `rgba(122,26,26,0.5)` }}
                  initial={false}
                  transition={{ type: "spring", stiffness: 350, damping: 32 }}
                >
                  {/* The tubelight glow at top */}
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full"
                    style={{ background: primaryColor }}>
                    <div className="absolute w-10 h-5 rounded-full blur-lg -top-1.5 -left-2"
                      style={{ background: primaryColor, opacity: 0.4 }} />
                    <div className="absolute w-6 h-4 rounded-full blur-md -top-1 left-0"
                      style={{ background: primaryColor, opacity: 0.5 }} />
                    <div className="absolute w-3 h-3 rounded-full blur-sm top-0 left-1.5"
                      style={{ background: primaryColor, opacity: 0.6 }} />
                  </div>
                </motion.div>
              )}
            </a>
          )
        })}
      </div>
    </div>
  )
}
