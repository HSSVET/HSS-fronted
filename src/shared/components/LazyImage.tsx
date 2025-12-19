import React, { useState, useRef, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Lazy loading image component using Intersection Observer API
 * Falls back to native loading="lazy" for browsers that don't support Intersection Observer
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  style,
  placeholder,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before image enters viewport
        }
      );

      observer.observe(img);

      return () => {
        observer.disconnect();
      };
    } else {
      // Fallback: load immediately if Intersection Observer is not supported
      setIsInView(true);
    }
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad();
    }
  };

  const handleError = () => {
    setHasError(true);
    if (onError) {
      onError();
    }
  };

  return (
    <Box
      ref={imgRef}
      component="div"
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        ...style,
      }}
    >
      {!isLoaded && !hasError && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
          }}
        >
          {placeholder ? (
            <img
              src={placeholder}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
            />
          ) : (
            <CircularProgress size={24} />
          )}
        </Box>
      )}
      
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      )}
      
      {hasError && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            color: '#999',
            fontSize: '14px',
          }}
        >
          Görsel yüklenemedi
        </Box>
      )}
    </Box>
  );
};

export default LazyImage;

