interface PlaceholderImageProps {
  name: string
  width: number
  height: number
  className?: string
}

export function PlaceholderImage({ name, width, height, className = "" }: PlaceholderImageProps) {
  // Generate a consistent color based on the name
  const getColor = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = hash % 360
    return `hsl(${hue}, 70%, 80%)`
  }

  const bgColor = getColor(name)
  const textColor = "black"

  // Get initials from name (up to 2 characters)
  const getInitials = (str: string) => {
    const words = str.split(" ")
    if (words.length === 1) {
      return str.substring(0, 2).toUpperCase()
    }
    return (words[0][0] + words[1][0]).toUpperCase()
  }

  const initials = getInitials(name)

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        width,
        height,
        backgroundColor: bgColor,
        color: textColor,
        fontSize: Math.min(width, height) / 3,
        fontWeight: "bold",
      }}
    >
      {initials}
    </div>
  )
}
