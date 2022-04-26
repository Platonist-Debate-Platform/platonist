import React, { useEffect, useRef, useState } from 'react';
import './Image.scss';
import ReactCrop, { Crop } from 'react-image-crop';

import {
    Image,
    randomHash,
    withConfig,
    WithConfigProps,
    encodeLink,
  GlobalState,
  Image as ImageProps,
  PrivateRequestKeys,
  PublicRequestKeys,
  } from '@platonist/library';

  import { useSelector } from 'react-redux';

export interface ImageCropReaderProps {
    image: File
    originalImage: Image
    handleImageCrop?: (file: File) => void
}

const initializeCrop = () => {
    const obj: Crop = {
        height: 50,
        width: 50,
        x: 50,
        y: 50,
        unit: '%'
    }
    return obj;
}

export const ImageCropReader: React.FunctionComponent<ImageCropReaderProps> = (props) => {
    const { result: user, status } = useSelector<
        GlobalState,
        GlobalState[PrivateRequestKeys.User]
    >((state) => state.user);

    
    
    const imageRef= useRef<HTMLImageElement | null>(null);
    const [src,setSrc] = useState<string>();
    const [crop,setCrop] = useState<Crop>(initializeCrop());
    const [fileName,setFilename] = useState<string>(randomHash(32));
    const [imageUrl,setImageUrl] = useState<string>();

    useEffect(() => {
        readImageFromFile();
        console.log(user, status)
    }, []);

    useEffect(() => {
        handleOnComplete(crop);
    }, [props])

    const readImageFromFile = () => {
        if (props.image) {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                setSrc(result);
            }
            reader.readAsDataURL(props.image);
        }
    }

    const handleOnChange = (obj: Crop) => {
        setCrop(obj);
    }

    const handleOnComplete = (obj: Crop) => {
        makeClientCrop(obj);
    }

    const makeClientCrop = async(obj: Crop) => {
        const { handleImageCrop } = props;

        if (imageRef.current) {
            const img = await getCroppedImage(imageRef.current, obj, fileName);

            if (img && img.blob && handleImageCrop) {
                const reader = new FileReader();
                reader.readAsArrayBuffer(img.blob);
                reader.onloadend = (e: ProgressEvent) => {
                    const arrayBuffer = (e.target as any).result as ArrayBuffer;
                    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
                    const file = new File([blob], randomHash(32), { type: 'image/jpeg' });

                    console.log(file);
                    handleImageCrop(file);
                }
            }
            setImageUrl(img?.url);
        }
    }

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
            // fileUrl = URL.createObjectURL(blob);
    
            resolve({
              url:'',
              blob,
            });
          }, 'image/jpeg');
        });
      };

    return (
        <>
            {
                src && <div>
                    <ReactCrop
                        crop={crop}
                        onChange={handleOnChange}
                        onComplete={handleOnComplete}
                        ruleOfThirds={true}
                        minHeight={300}
                        minWidth={300}
                        circularCrop={false}
                    >
                        <img ref={imageRef} className="cropped-image-responsive" src={src} alt="Avatar" />
                    </ReactCrop>
                </div> 
            }
        </>
    );

}