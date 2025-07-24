package engine

import (
	"C"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png" // Register the PNG, JPEG, and GIF decoders
)

type Image struct {
	ID uint8
}

func LoadImage(path string) (Image, error) {
	data, err := LoadImageData(path)
	if err != nil {
		return Image{}, err
	}
	imageID := createImage(string(data.Data), data.Width, data.Height)
	return Image{ID: uint8(imageID)}, nil
}
