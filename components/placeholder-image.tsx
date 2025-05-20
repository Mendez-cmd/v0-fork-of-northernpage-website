import { cn } from "@/lib/utils"

interface PlaceholderImageProps {
  name?: string
  width?: number
  height?: number
  className?: string
}

export function PlaceholderImage({ name = "Product", width = 300, height = 300, className }: PlaceholderImageProps) {
  // Generate a random pastel color based on the name
  const getColorFromName = (name: string) => {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    // Generate pastel color (lighter shade)
    const h = hash % 360
    return `hsl(${h}, 70%, 85%)`
  }

  const bgColor = getColorFromName(name)
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  return (
    <div
      className={cn("flex items-center justify-center text-center overflow-hidden", className)}
      style={{
        backgroundColor: bgColor,
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "100%",
      }}
    >
      <div className="flex flex-col items-center justify-center p-4">
        <span className="text-4xl font-bold text-gray-700 mb-2">{initials}</span>
        <span className="text-sm text-gray-600 max-w-[80%] line-clamp-2">{name}</span>
        <div className="mt-2 text-xs text-gray-500">Image coming soon</div>
      </div>
    </div>
  )
}
