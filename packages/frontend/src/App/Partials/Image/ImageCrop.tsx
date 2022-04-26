// import 'react-image-crop/lib/ReactCrop.scss';

import React, { useEffect, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import './Image.scss';

import {
  Image,
  randomHash,
  withConfig,
  WithConfigProps,
} from '@platonist/library';

export interface ImageCropProps extends WithConfigProps {
  file?: File;
  image?: Image | null;
  onCrop?: (file: File) => void;
  reset: boolean;
}

export interface ImageCropState {
  crop: Crop;
  croppedImageUrl?: string;
  fileName: string;
  src?: string | null;
}

export class ImageCropBase extends React.Component<
  ImageCropProps,
  ImageCropState
> {
  fileUrl: string | undefined;
  imageRef: HTMLImageElement | undefined;
  reader = new FileReader();

  constructor(props: ImageCropProps) {
    super(props);

    this.state = {
      crop: {
        // aspect: '1 / 1',
        height: 50,
        unit: '%',
        width: 50,
        x: 50,
        y: 50,
      },
      fileName: randomHash(32),
    };
  }

  public componentDidMount() {
    this.setSrcFromImage();

    const _self = this;
    this.reader.addEventListener('load', function (event: ProgressEvent) {
      _self.handleFileReaderLoading(this, event);
    });
  }

  public componentDidUpdate(prevProps: ImageCropProps) {
    const { file, reset } = this.props;

    const prevFile = prevProps.file;
    const prevReset = prevProps.reset;

    if (
      file &&
      (prevFile?.name !== file?.name || file?.size !== prevFile?.size)
    ) {
      this.reader.readAsDataURL(file);
      this.makeClientCrop(this.state.crop);
    }

    if (!file && !prevReset && reset) {
      this.setSrcFromImage();
    }
  }

  private getCroppedImage = async (
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

        window.URL.revokeObjectURL(this.fileUrl || '');
        this.fileUrl = URL.createObjectURL(blob);

        resolve({
          url: this.fileUrl,
          blob,
        });
      }, 'image/jpeg');
    });
  };

  private handleFileReaderLoading = (
    reader: FileReader,
    event: ProgressEvent,
  ) => {
    this.setState({
      src: reader.result?.toString(),
      fileName: randomHash(32),
    });
  };

  private makeClientCrop = async (crop: Crop) => {
    const { onCrop } = this.props;

    const { fileName } = this.state;

    if (this.imageRef && crop.width && crop.height) {
      const croppedImage = await this.getCroppedImage(
        this.imageRef,
        crop,
        fileName,
      );

      if (croppedImage && croppedImage.blob && onCrop) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(croppedImage?.blob);
        reader.addEventListener('loadend', (e: ProgressEvent) => {
          const arrayBuffer = (e.target as any).result as ArrayBuffer;
          const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
          const file = new File([blob], randomHash(32), { type: 'image/jpeg' });
          onCrop(file);
        });
      }
      this.setState({ croppedImageUrl: croppedImage?.url });
    }
  };

  onCropChange = (crop: Crop) => {
    this.setState({ crop });
  };

  private onCropComplete = (crop: Crop) => {
    this.makeClientCrop(crop);
  };

  private onImageLoaded = (image: HTMLImageElement) => {
    this.imageRef = image;
  };

  private setSrcFromImage = () => {
    const { config, image } = this.props;

    if (config) {
      const apiUrl = config.api.createApiUrl(config.api.config);
      apiUrl.pathname = (image && image.url) || '';

      this.setState({
        src: apiUrl.href,
        fileName: randomHash(32),
      });
    }
  };

  public render() {
    const { crop, src } = this.state;
    const { image } = this.props;

    console.log(image);

    return (
      <>
        {src && (
          <ReactCrop
            circularCrop={false}
            crop={crop}
            // crossorigin="anonymous"
            minHeight={300}
            minWidth={300}
            onChange={this.onCropChange}
            onComplete={this.onCropComplete}
            // onImageLoaded={this.onImageLoaded}
            ruleOfThirds={true}
            // src={src}
          >
            {image && <img src={src} className="cropped-image-responsive" alt={`Avatar`}/>}
          </ReactCrop>
        )}
      </>
    );
  }
}

export const ImageCropFunctionalComponent: React.FunctionComponent<ImageCropProps> = (props) => {
  const [state, setState] = useState<ImageCropState>();
  
  useEffect(() => {
    setSrcFromImage();

    const _self = this;
  }, [])

  const setSrcFromImage = () => {
    const { config, image } = props;

    if (config) {
      const apiUrl = config.api.createApiUrl(config.api.config);
      apiUrl.pathname = (image && image.url) || '';

      const obj: ImageCropState = {
        src: apiUrl.href,
        fileName: randomHash(32),
        crop: {
          // aspect: '1 / 1',
          height: 50,
          unit: '%',
          width: 50,
          x: 50,
          y: 50,
        }
      }

      setState(obj);
    }    
  }

  return (
    <>

    </>
  );
}

export const ImageCrop = withConfig(ImageCropBase);
