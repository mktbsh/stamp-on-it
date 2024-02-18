import imageCompression, { Options } from "browser-image-compression";

type CompressImageOptions = Options & {
  image: File;
};

export async function compressImage({
  image,
  ...options
}: CompressImageOptions) {
  const compressed = await imageCompression(image, options);

  console.log('compressImage:result', {
    original: image.size,
    compressed: compressed.size,
  })

  return compressed;
}
