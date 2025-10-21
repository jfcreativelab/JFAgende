import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-lg transition-all duration-200
        hover:bg-gray-100 dark:hover:bg-gray-800
        ${className}
      `}
      aria-label="Alternar tema"
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-gray-600 dark:text-gray-400" />
      ) : (
        <Sun size={20} className="text-yellow-500" />
      )}
    </button>
  )
}

export default ThemeToggle


