import { Star } from 'lucide-react'

const StarRating = ({ rating = 0, maxRating = 5, size = 20, onRate, readOnly = false, showNumber = true }) => {
  const handleClick = (value) => {
    if (!readOnly && onRate) {
      onRate(value)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const value = index + 1
        const isFilled = value <= rating
        const isHalf = value === Math.ceil(rating) && rating % 1 !== 0

        return (
          <button
            key={index}
            onClick={() => handleClick(value)}
            disabled={readOnly}
            className={`
              ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
              transition-transform duration-200
              ${!readOnly && 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded'}
            `}
            type="button"
          >
            <Star
              size={size}
              className={`
                ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                ${!readOnly && 'hover:text-yellow-400'}
              `}
            />
          </button>
        )
      })}
      {showNumber && (
        <span className="ml-1 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export default StarRating


