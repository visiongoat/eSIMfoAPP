export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
      {/* Flag and country name skeleton */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-6 bg-gray-200 rounded-sm"></div>
        <div className="h-4 bg-gray-200 rounded flex-1"></div>
      </div>
      
      {/* Plan count skeleton */}
      <div className="mb-3">
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
      
      {/* Price skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-6 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  );
}