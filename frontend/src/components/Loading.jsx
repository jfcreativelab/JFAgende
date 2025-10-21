import LogoLoading from './LogoLoading'

const Loading = ({ size = 'md', fullScreen = false, useLogo = false, message = 'Carregando...' }) => {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4',
  }
  
  const spinner = (
    <div className={`animate-spin rounded-full ${sizes[size]} border-primary-600 border-t-transparent`} />
  )
  
  if (useLogo) {
    if (fullScreen) {
      return (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
          <LogoLoading size={size} message={message} />
        </div>
      )
    }
    
    return (
      <div className="flex items-center justify-center p-8">
        <LogoLoading size={size} message={message} />
      </div>
    )
  }
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center p-8">
      {spinner}
    </div>
  )
}

export default Loading

