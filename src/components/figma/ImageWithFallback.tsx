import React, { useState } from 'react'
import { getGradientForRecipe } from '../../lib/gradients'

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  recipeTitle?: string;
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, recipeTitle, ...rest } = props

  // Show gradient if no src provided or if image failed to load
  if (!src || didError) {
    const gradient = getGradientForRecipe(recipeTitle || alt || '')
    return (
      <div
        className={`inline-block text-center align-middle ${className ?? ''}`}
        style={{
          background: gradient,
          ...style
        }}
      >
        <div className="flex items-center justify-center w-full h-full">
          {/* Optional: Add a subtle icon or text overlay */}
        </div>
      </div>
    )
  }

  return (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
}
