const SizeSelector = ({
  sizes,
  selectedSize,
  onSizeSelect,
}: {
  sizes: string[];
  selectedSize: string;
  onSizeSelect: (size: string) => void;
}) => (
  <div className="mt-4">
    <h2 className="text-md font-sans text-black font-bold mb-2">
      Kích thước | <span className="text-gray-600">{selectedSize}</span>
    </h2>
    <div className="mt-2 flex flex-wrap gap-3">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onSizeSelect(size)}
          className={`w-16 h-10 font-medium rounded-full border-2 transition-all duration-200 ${
            selectedSize === size
              ? "text-white bg-black border-black"
              : "border-gray-300 hover:border-gray-400"
          }`}
          title={size}
        >
          {size}
        </button>
      ))}
    </div>
  </div>
);

export default SizeSelector;
