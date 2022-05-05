import React, { useEffect, useRef, useState } from 'react';
import './Image.scss';
import ReactCrop, { Crop } from 'react-image-crop';

import {
  Image,
  randomHash,
  GlobalState,
  Image as ImageProps,
  PrivateRequestKeys,
} from '@platonist/library';

import { useSelector } from 'react-redux';
import { Image as Img } from './Image';

export interface ImageCropReaderProps {
  image?: File;
  originalImage?: Image | null | undefined;
  handleImageCrop?: (file: File) => void;
  showDropZone?: boolean;
}

const initializeCrop = () => {
  const obj: Crop = {
    height: 50,
    width: 50,
    x: 50,
    y: 50,
    unit: '%',
  };
  return obj;
};

/**
 * UI element that shows the uploaded avatar on the panel.
 * @param props | ImageCropReaderProps
 * @returns
 */
export const ImageCropReader: React.FunctionComponent<ImageCropReaderProps> = (
  props,
) => {
  const { result: user } = useSelector<
    GlobalState,
    GlobalState[PrivateRequestKeys.User]
  >((state) => state.user);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const didMount = useRef(false);
  const [src, setSrc] = useState<string>();
  const [crop, setCrop] = useState<Crop>(initializeCrop());
  const [fileName] = useState<string>(randomHash(32));

  /**
   * Re-renders, reads the image data from the <img /> tag
   */
  useEffect(() => {
    readImageFromFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.image]);

  /**
   * Changes the passed property by calling the passed function "handleImageCrop",
   * if the internal state of this UI "src" changes!
   */
  useEffect(() => {
    if (!didMount.current) {
        didMount.current = true;
        return;
    }
    handleOnComplete(crop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  /**
   * Reads the image data from the <img /> tag
   */
  const readImageFromFile = () => {
    if (props.image) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setSrc(result);
      };
      reader.readAsDataURL(props.image);
    }
  };

  /**
   * Helper function for React-Crop
   * @param obj Crop
   */
  const handleOnChange = (obj: Crop) => {
    setCrop(obj);
  };

  /**
   * Helper function for React-Crop
   * @param obj Crop
   */
  const handleOnComplete = (obj: Crop) => {
    makeClientCrop(obj);
  };

  /**
   * Copied from Daniel's Code
   * Reads the image data and passed the file meta data to the parent UI, by calling the passed
   * function "handleImageCrop".
   * @param obj - Crop
   */
  const makeClientCrop = async (obj: Crop) => {
    const { handleImageCrop } = props;

    if (imageRef.current) {
      const img = await getCroppedImage(imageRef.current, obj, fileName);
      console.log(img);

      if (img && img.blob && handleImageCrop) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(img.blob);
        reader.onloadend = (e: ProgressEvent) => {
          const arrayBuffer = (e.target as any).result as ArrayBuffer;
          const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
          const file = new File([blob], randomHash(32), { type: 'image/jpeg' });
          handleImageCrop(file);
        };
      }
    }
  };

  /**
   * Copied from Daniel's Code.
   * Returns the image meta data and blob.
   */
  const getCroppedImage = async (
    image: HTMLImageElement,
    crop: any,
    fileName: string,
  ): Promise<{ url: string; blob: Blob } | undefined> => {
    if (!image || !crop) {
      return;
    }

    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width || 300;
    canvas.height = crop.height || 300;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    ctx.drawImage(
      image,
      (crop.x || 0) * scaleX,
      (crop.y || 0) * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is Empty');
          return;
        }
        (blob as Blob & { name: string }).name = fileName;

        window.URL.revokeObjectURL(fileName || '');
        const fileUrl = URL.createObjectURL(blob);

        resolve({
          url: fileUrl,
          blob,
        });
      }, 'image/jpeg');
    });
  };

  return (
    <>
      {!props.showDropZone && props.image && src ? (
        <div>
          <ReactCrop
            crop={crop}
            onChange={handleOnChange}
            onComplete={handleOnComplete}
            ruleOfThirds={true}
            minHeight={300}
            minWidth={300}
            circularCrop={false}
          >
            <img
              ref={imageRef}
              className="cropped-image-responsive"
              src={src}
              alt="Avatar"
            />
          </ReactCrop>
        </div>
      ) : (
        user?.avatar && !props.showDropZone && !src && <Img {...user.avatar} />
      )}
    </>
  );
};
