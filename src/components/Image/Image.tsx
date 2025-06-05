"use client";
import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { isExternalImageUrl, normalizeImageUrl, getPlaceholderImageUrl } from "@/lib/imageUtils";

interface EnhancedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
  showPlaceholderOnError?: boolean;
}

const ImageWithHideOnError = (props: ImageProps) => {
  const [hideImage, setHideImage] = useState(false);

  return (
    !hideImage && (
      <Image
        {...props}
        alt="Error loading image"
        onError={() => {
          setHideImage(true);
        }}
      />
    )
  );
};

/**
 * Enhanced image component that handles both local and external images
 * with fallback support and error handling
 */
export const EnhancedImage: React.FC<EnhancedImageProps> = ({
  src,
  fallbackSrc,
  showPlaceholderOnError = true,
  alt,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(normalizeImageUrl(src));
  const [hideImage, setHideImage] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (fallbackSrc && !hasError) {
      // Try fallback image first
      setCurrentSrc(normalizeImageUrl(fallbackSrc));
      setHasError(true);
    } else if (showPlaceholderOnError && !hasError) {
      // Try placeholder image
      setCurrentSrc(getPlaceholderImageUrl());
      setHasError(true);
    } else {
      // Hide image completely
      setHideImage(true);
    }
  };

  // If image should be hidden, return null
  if (hideImage) {
    return null;
  }

  // For external images, we need to handle them differently in Next.js
  if (isExternalImageUrl(currentSrc)) {
    return (
      <Image
        {...props}
        src={currentSrc}
        alt={alt}
        onError={handleError}
        // External images need these properties for Next.js optimization
        width={props.width || 500}
        height={props.height || 300}
      />
    );
  }

  // For local images
  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={handleError}
    />
  );
};

// Keep the original component for backward compatibility
export default ImageWithHideOnError;
