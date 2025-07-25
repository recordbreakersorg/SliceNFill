package engine

import (
	"image"
	"os"
)

type ImageData struct {
	Data   []uint8
	Width  int
	Height int
}

func LoadImageData(path string) (ImageData, error) {
	file, err := os.Open(path)
	if err != nil {
		return ImageData{}, err
	}
	defer file.Close()

	img, format, err := image.Decode(file)
	_ = format // We don't need the format for this function, but we can log it if needed
	if err != nil {
		return ImageData{}, err
	}

	bounds := img.Bounds()
	width, height := bounds.Dx(), bounds.Dy()

	data := make([]uint8, width*height*4)
	idx := 0
	for y := 0; y < height; y++ {
		for x := 0; x < width; x++ {
			pix := img.At(x, y)
			r, g, b, a := pix.RGBA()
			data[idx+0] = uint8(r >> 8)
			data[idx+1] = uint8(g >> 8)
			data[idx+2] = uint8(b >> 8)
			data[idx+3] = uint8(a >> 8)
			idx += 4
		}
	}

	return ImageData{
		Data:   data,
		Width:  width,
		Height: height,
	}, nil
}
