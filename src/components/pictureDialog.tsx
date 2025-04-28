import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

interface ImageDialogProps {
  imageUrls: string[];
}

const ImageDialog = ({ imageUrls }: ImageDialogProps) => {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState(imageUrls);

  const handleThumbnailClick = (index: number) => {
    const newImages = [...images];
    const temp = newImages[0];
    newImages[0] = newImages[index];
    newImages[index] = temp;
    setImages(newImages);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <img
          src={images[0]}
          className="max-w-16 max-h-16 object-cover cursor-pointer rounded-md"
          onClick={() => setOpen(true)}
        />
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-4">
          <img
            src={images[0]}
            alt="Main Asset"
            className="w-[500px] h-[500px] object-cover rounded-md"
          />

          <div className="flex gap-4 flex-wrap justify-center">
            {images.slice(1).map((url, index) => (
              <img
                key={index + 1}
                src={url}
                alt={`Asset ${index + 1}`}
                className="w-[50px] h-[50px] object-cover rounded-md cursor-pointer"
                onClick={() => handleThumbnailClick(index + 1)}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;
