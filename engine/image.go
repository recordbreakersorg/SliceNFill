package engine

import (
	"C"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png" // Register the PNG, JPEG, and GIF decoders
)
import "fmt"

type Image struct {
	ID            uint
	Width, Height int
}

func OpenImage(path string) (Image, error) {
	fmt.Println("Loading image from path:", path)
	data, err := LoadImageData(path)
	if err != nil {
		return Image{}, err
	}
	imageID := createImage(data.Data, data.Width, data.Height)
	return Image{
		ID:     imageID,
		Width:  data.Width,
		Height: data.Height,
	}, nil
}

func (img *Image) GetData() (ImageData, error) {
	data := getImageData(img.ID, img.Height*img.Width*4)
	if data == nil {
		return ImageData{}, fmt.Errorf("image data not found for ID %d", img.ID)
	}
	fmt.Printf("[go:image] Received from Julia. First 16 bytes: %v\n", data[:16])
	return ImageData{
		Data:   data,
		Width:  img.Width,
		Height: img.Height,
	}, nil
}

func (img *Image) Destroy() bool {
	return destroyImage(img.ID)
}
