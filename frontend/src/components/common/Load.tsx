const Load = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8 animate-pulse"></div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 h-64 rounded-lg mb-3"></div>
          <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
          <div className="bg-gray-200 h-4 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  </div>
);

export default Load;
