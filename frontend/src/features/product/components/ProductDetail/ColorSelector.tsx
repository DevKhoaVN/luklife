const ColorSelector = ({
  colors,
  selectedColor,
  onColorSelect,
}: {
  colors: Array<{ name: string; hex: string }>;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}) => (
  <div className="mt-4">
    <h2 className="text-md font-sans text-black font-bold mb-2">
      Màu sắc | <span className="text-gray-600">{selectedColor}</span>
    </h2>
    <div className="mt-2 flex flex-wrap gap-3">
      {colors.map((color) => (
        <button
          key={color.name}
          onClick={() => onColorSelect(color.name)}
          className={`px-4 py-2 rounded-full border-2 transition-all duration-200 ${
            selectedColor === color.name
              ? "border-black bg-black text-white"
              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
          }`}
          title={color.name}
        >
          {color.name}
        </button>
      ))}
    </div>
  </div>
);

export default ColorSelector;
