package engine

import (
	"image"
	"os"
)

type ImageData struct {
	Data   []uint8 // RGBA data in 8-bit per channel format
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
	for y := range height {
		for x := range width {
			pix := img.At(x, y)
			r, g, b, a := pix.RGBA()
			data[y*width*4+x*4+0] = uint8(r >> 8) // Convert to 8-bit
			data[y*width*4+x*4+1] = uint8(g >> 8)
			data[y*width*4+x*4+2] = uint8(b >> 8)
			data[y*width*4+x*4+3] = uint8(a >> 8)
		}
	}

	return ImageData{
		Data:   data,
		Width:  width,
		Height: height,
	}, nil
}
