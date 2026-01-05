const ProductGallery = ({
  thumbnails,
  mainImage,
  onThumbnailClick,
}: {
  thumbnails: string[];
  mainImage: string;
  onThumbnailClick: (src: string) => void;
}) => (
  <div className="flex gap-4">
    <div className="flex flex-col gap-2">
      {thumbnails.map((src, index) => (
        <img
          key={index}
          onClick={() => onThumbnailClick(src)}
          src={src}
          alt={`Thumbnail ${index + 1}`}
          className="w-20 h-20 object-cover border-2 border-gray-200 hover:border-red-600 cursor-pointer rounded transition-all"
        />
      ))}
    </div>
    <div className="flex-1">
      <img
        src={mainImage}
        alt="Product"
        className="w-full h-auto object-cover rounded-lg"
      />
    </div>
  </div>
);

export default ProductGallery;
