// Package img handles image files opening, saving, conversion
package img

import (
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"image/gif"
	"image/jpeg"
	"image/png"
	"io"
	"os"
	"strings"
	"sync/atomic"

	_ "github.com/srwiley/oksvg"   // svg
	_ "github.com/srwiley/rasterx" // svg
	"github.com/wailsapp/wails/v2/pkg/options"
	_ "golang.org/x/image/bmp"  // bmp
	_ "golang.org/x/image/tiff" // tiff
	_ "golang.org/x/image/webp" // webp
)

var (
	imageIDCounter uint64
	images         []Image
)

type Image struct {
	ID     uint64
	Raw    image.Image
	Width  uint
	Height uint
	Format ImageFormat
}

type ImageInfo struct {
	ID     uint64
	Width  uint
	Height uint
	Format ImageFormat
}

func (info *ImageInfo) GetImage() (Image, bool) {
	for _, image := range images {
		if image.ID == info.ID {
			return image, true
		}
	}
	return Image{}, false
}

// OpenImage opens an image from file path
func OpenImage(path string) (Image, error) {
	// Check if format is supported
	format, err := GetFormatByExtension(path)
	if err != nil {
		return Image{}, err
	}

	if !format.CanRead {
		return Image{}, fmt.Errorf("format %s is not readable", format.Name)
	}

	// Open file
	file, err := os.Open(path)
	if err != nil {
		return Image{}, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	return OpenImageFromReader(file, *format)
}

// OpenImageFromReader opens an image from io.Reader with specified format
func OpenImageFromReader(reader io.Reader, format ImageFormat) (Image, error) {
	if !format.CanRead {
		return Image{}, fmt.Errorf("format %s is not readable", format.Name)
	}

	// Decode image
	img, detectedFormat, err := image.Decode(reader)
	if err != nil {
		return Image{}, fmt.Errorf("failed to decode image: %w", err)
	}

	// Verify format matches (optional warning)
	expectedFormat := strings.ToLower(format.Name)
	if detectedFormat != expectedFormat &&
		(expectedFormat != "jpeg" || detectedFormat != "jpeg") {
		fmt.Printf("Warning: Expected %s but detected %s\n", expectedFormat, detectedFormat)
	}

	bounds := img.Bounds()

	// Generate unique ID
	id := atomic.AddUint64(&imageIDCounter, 1)

	newImage := Image{
		ID:     id,
		Raw:    img,
		Width:  uint(bounds.Dx()),
		Height: uint(bounds.Dy()),
		Format: format,
	}
	images = append(images, newImage)
	return newImage, nil
}

// SaveImage saves an image to file with specified format and quality
func (img *Image) SaveImage(path string, format ImageFormat, quality int) error {
	if !format.CanWrite {
		return fmt.Errorf("format %s is not writable", format.Name)
	}

	file, err := os.Create(path)
	if err != nil {
		return fmt.Errorf("failed to create file: %w", err)
	}
	defer file.Close()

	return img.SaveImageToWriter(file, format, quality)
}

// SaveImageToWriter saves an image to io.Writer with specified format and quality
func (img *Image) SaveImageToWriter(writer io.Writer, format ImageFormat, quality int) error {
	if !format.CanWrite {
		return fmt.Errorf("format %s is not writable", format.Name)
	}

	switch strings.ToUpper(format.Name) {
	case "JPEG":
		options := &jpeg.Options{Quality: quality}
		if quality <= 0 || quality > 100 {
			options.Quality = 95 // Default quality
		}
		return jpeg.Encode(writer, img.Raw, options)

	case "PNG":
		encoder := &png.Encoder{CompressionLevel: png.BestCompression}
		return encoder.Encode(writer, img.Raw)

	case "GIF":
		return gif.Encode(writer, img.Raw, nil)

	default:
		return fmt.Errorf("encoding for format %s not implemented", format.Name)
	}
}

// ensureMutable checks if the image is a draw.Image, and if not, converts it.
// This is necessary for any functions that need to modify pixel data.
func (img *Image) ensureMutable() draw.Image {
	if mutable, ok := img.Raw.(draw.Image); ok {
		return mutable
	}

	bounds := img.Raw.Bounds()
	mutableImg := image.NewNRGBA(bounds)
	draw.Draw(mutableImg, bounds, img.Raw, bounds.Min, draw.Src)
	img.Raw = mutableImg
	return mutableImg
}

// Clone creates a deep copy of the image with a new ID.
func (img *Image) Clone() Image {
	id := atomic.AddUint64(&imageIDCounter, 1)

	// Create a new backing image and copy the pixels over
	bounds := img.Raw.Bounds()
	newRawImg := image.NewNRGBA(bounds)
	draw.Draw(newRawImg, bounds, img.Raw, bounds.Min, draw.Src)

	newImage := Image{
		ID:     id,
		Raw:    newRawImg,
		Width:  img.Width,
		Height: img.Height,
		Format: img.Format,
	}
	images = append(images, newImage)
	return newImage
}

// GetInfo returns basic information about the image
func (img *Image) GetInfo() ImageInfo {
	return ImageInfo{
		ID:     img.ID,
		Width:  img.Width,
		Height: img.Height,
		Format: img.Format,
	}
}

func (img *Image) GetData() []uint8 {
	bounds := img.Raw.Bounds()
	width, height := bounds.Dx(), bounds.Dy()
	data := make([]uint8, width*height*4)
	idx := 0
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			pix := img.Raw.At(x, y)
			r, g, b, a := pix.RGBA()
			data[idx+0] = uint8(r >> 8)
			data[idx+1] = uint8(g >> 8)
			data[idx+2] = uint8(b >> 8)
			data[idx+3] = uint8(a >> 8)
			idx += 4
		}
	}
	return data
}

// Resize resizes the image (placeholder - you'd implement actual resizing logic)
func (img *Image) Resize(newWidth, newHeight uint) error {
	// This is a placeholder - you'd implement actual image resizing here
	// You might use libraries like "github.com/disintegration/imaging"
	img.Width = newWidth
	img.Height = newHeight
	return nil
}

// ConvertFormat converts the image to a new format
func (img *Image) ConvertFormat(newFormat ImageFormat) error {
	if !newFormat.CanRead {
		return fmt.Errorf("target format %s is not supported", newFormat.Name)
	}

	img.Format = newFormat
	return nil
}

func GetImage(id uint64) (Image, bool) {
	for _, image := range images {
		if id == image.ID {
			return image, true
		}
	}
	return Image{}, false
}

// ReplaceColor finds all pixels of a given color and replaces them with another.
func (img *Image) ReplaceColor(from options.RGBA, to options.RGBA) {
	mutableImg := img.ensureMutable()
	bounds := mutableImg.Bounds()

	// Convert the input colors to the standard library's color.RGBA type.
	targetColor := color.RGBA{R: from.R, G: from.G, B: from.B, A: from.A}
	replacementColor := color.RGBA{R: to.R, G: to.G, B: to.B, A: to.A}

	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			// Convert the pixel at (x,y) to the RGBA color model for accurate comparison.
			// This correctly handles any underlying image type (e.g., NRGBA, YCbCr).
			if color.RGBAModel.Convert(mutableImg.At(x, y)) == targetColor {
				mutableImg.Set(x, y, replacementColor)
			}
		}
	}
}

// FloodFill fills an area of continuous color with a new color.
func (img *Image) FloodFill(x, y int, to options.RGBA) {
	mutableImg := img.ensureMutable()
	bounds := mutableImg.Bounds()

	// Check if the starting point is within the image bounds
	if !image.Pt(x, y).In(bounds) {
		return
	}

	targetColor := mutableImg.At(x, y)
	replacementColor := color.RGBA{R: to.R, G: to.G, B: to.B, A: to.A}

	// If the target color is already the replacement color, there's nothing to do.
	if color.RGBAModel.Convert(targetColor) == replacementColor {
		return
	}

	// Queue for the flood fill algorithm
	queue := make([]image.Point, 0)
	queue = append(queue, image.Pt(x, y))

	// A map to keep track of visited pixels to avoid reprocessing
	visited := make(map[image.Point]bool)

	for len(queue) > 0 {
		// Dequeue the next point
		p := queue[0]
		queue = queue[1:]

		// Skip if out of bounds or already visited
		if !p.In(bounds) || visited[p] {
			continue
		}

		// If the color at the current point matches the target color, replace it
		if color.RGBAModel.Convert(mutableImg.At(p.X, p.Y)) == color.RGBAModel.Convert(targetColor) {
			mutableImg.Set(p.X, p.Y, replacementColor)
			visited[p] = true

			// Enqueue neighbors
			queue = append(queue, image.Pt(p.X+1, p.Y))
			queue = append(queue, image.Pt(p.X-1, p.Y))
			queue = append(queue, image.Pt(p.X, p.Y+1))
			queue = append(queue, image.Pt(p.X, p.Y-1))
		}
	}
}

