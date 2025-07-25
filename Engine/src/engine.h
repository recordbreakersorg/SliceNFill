// typedef unsigned int *ImageData;
#define ImageData void *
void initEngine();
unsigned int createImage(ImageData data, unsigned int size, unsigned int width,
                         unsigned int height);
int destroyImage(unsigned int imageID);
unsigned int *listImages();
ImageData getImageData(unsigned int id);
unsigned int setImageData(unsigned int id, ImageData data, unsigned int len);
