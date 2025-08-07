import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const ImageGallery = ({ images, title }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="relative">
        <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-xl">
          <img
            src={images[currentImage]}
            alt={`${title} - Image ${currentImage + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation buttons */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
          >
            <ApperIcon name="ChevronLeft" size={20} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
          >
            <ApperIcon name="ChevronRight" size={20} />
          </button>

          {/* Fullscreen button */}
          <button
            onClick={() => setShowFullscreen(true)}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
          >
            <ApperIcon name="Maximize" size={20} />
          </button>

          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImage + 1} of {images.length}
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                currentImage === index ? 'border-primary' : 'border-gray-200'
              }`}
            >
              <img
                src={image}
                alt={`${title} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <ApperIcon name="X" size={32} />
            </button>
            
            <img
              src={images[currentImage]}
              alt={`${title} - Fullscreen`}
              className="max-w-full max-h-full object-contain"
            />
            
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
            >
              <ApperIcon name="ChevronLeft" size={32} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
            >
              <ApperIcon name="ChevronRight" size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;