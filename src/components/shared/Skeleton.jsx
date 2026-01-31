/**
 * Skeleton Loading Component
 *
 * Reusable skeleton loader for content placeholders.
 * Uses shimmer animation defined in index.css.
 */

/**
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.width - Width (e.g., 'w-full', 'w-32')
 * @param {string} props.height - Height (e.g., 'h-4', 'h-8')
 * @param {boolean} props.rounded - Use rounded corners (pill shape)
 * @param {boolean} props.circle - Make it a circle
 */
function Skeleton({
  className = '',
  width = 'w-full',
  height = 'h-4',
  rounded = false,
  circle = false,
}) {
  return (
    <div
      className={`
        skeleton
        ${width}
        ${height}
        ${circle ? 'rounded-full' : rounded ? 'rounded-full' : 'rounded'}
        ${className}
      `}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton Text - Multiple lines of skeleton text
 * @param {Object} props
 * @param {number} props.lines - Number of lines
 * @param {string} props.className - Additional CSS classes
 */
export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="h-4"
          width={i === lines - 1 ? 'w-3/4' : 'w-full'}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton Card - Card-shaped skeleton
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 */
export function SkeletonCard({ className = '' }) {
  return (
    <div className={`p-4 bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <Skeleton width="w-10" height="h-10" circle />
        <div className="flex-1">
          <Skeleton width="w-1/2" height="h-4" className="mb-2" />
          <Skeleton width="w-1/3" height="h-3" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

/**
 * Skeleton Image - Image placeholder skeleton
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.aspectRatio - Aspect ratio class (e.g., 'aspect-video')
 */
export function SkeletonImage({ className = '', aspectRatio = 'aspect-video' }) {
  return (
    <Skeleton
      width="w-full"
      height="h-auto"
      className={`${aspectRatio} ${className}`}
    />
  );
}

export default Skeleton;
