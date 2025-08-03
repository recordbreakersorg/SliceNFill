package img

import (
	"fmt"
	"image"
	"io"
	"path/filepath"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type ImageFormat struct {
	Name      string
	Extension string
	MimeType  string
	CanRead   bool
	CanWrite  bool
}

// FORMATS Static array of supported formats
var FORMATS = []ImageFormat{
	{
		Name:      "JPEG",
		Extension: ".jpg",
		MimeType:  "image/jpeg",
		CanRead:   true,
		CanWrite:  true,
	},
	{
		Name:      "JPEG",
		Extension: ".jpeg",
		MimeType:  "image/jpeg",
		CanRead:   true,
		CanWrite:  true,
	},
	{
		Name:      "PNG",
		Extension: ".png",
		MimeType:  "image/png",
		CanRead:   true,
		CanWrite:  true,
	},
	{
		Name:      "GIF",
		Extension: ".gif",
		MimeType:  "image/gif",
		CanRead:   true,
		CanWrite:  true,
	},
	{
		Name:      "BMP",
		Extension: ".bmp",
		MimeType:  "image/bmp",
		CanRead:   true,
		CanWrite:  true,
	},
	{
		Name:      "TIFF",
		Extension: ".tiff",
		MimeType:  "image/tiff",
		CanRead:   true,
		CanWrite:  true,
	},
	{
		Name:      "TIFF",
		Extension: ".tif",
		MimeType:  "image/tiff",
		CanRead:   true,
		CanWrite:  true,
	},
	{
		Name:      "WebP",
		Extension: ".webp",
		MimeType:  "image/webp",
		CanRead:   true,
		CanWrite:  false, // webp encoding requires special handling
	},
	{
		Name:      "AVIF",
		Extension: ".avif",
		MimeType:  "image/avif",
		CanRead:   true,
		CanWrite:  false, // avif encoding requires special handling
	},
	{
		Name:      "ICO",
		Extension: ".ico",
		MimeType:  "image/x-icon",
		CanRead:   true,
		CanWrite:  false,
	},
	{
		Name:      "SVG",
		Extension: ".svg",
		MimeType:  "image/svg+xml",
		CanRead:   true,
		CanWrite:  false, // SVG is vector, would need special handling
	},
}

func GetReadImageFileFilters() []runtime.FileFilter {
	var filters []runtime.FileFilter
	var allReadablePatterns []string

	for _, format := range FORMATS {
		if format.CanRead {
			displayName := fmt.Sprintf("%s (*%s)", format.Name, format.Extension)
			filters = append(filters, runtime.FileFilter{
				DisplayName: displayName,
				Pattern:     "*" + format.Extension,
			})
			allReadablePatterns = append(allReadablePatterns, "*"+format.Extension)
		}
	}

	// Add an "All supported" filter at the beginning
	allFilter := runtime.FileFilter{
		DisplayName: "All Supported Images",
		Pattern:     strings.Join(allReadablePatterns, ";"),
	}

	return append([]runtime.FileFilter{allFilter}, filters...)
}

// GetFormatByExtension finds format by file extension
func GetFormatByExtension(path string) (*ImageFormat, error) {
	ext := strings.ToLower(filepath.Ext(path))
	for i := range FORMATS {
		if FORMATS[i].Extension == ext {
			return &FORMATS[i], nil
		}
	}
	return nil, fmt.Errorf("unsupported format: %s", ext)
}

// GetFormatByName finds format by name
func GetFormatByName(name string) (*ImageFormat, error) {
	name = strings.ToUpper(name)
	for i := range FORMATS {
		if strings.ToUpper(FORMATS[i].Name) == name {
			return &FORMATS[i], nil
		}
	}
	return nil, fmt.Errorf("format not found: %s", name)
}

// GetReadableFormats returns all formats that can be read
func GetReadableFormats() []ImageFormat {
	var readable []ImageFormat
	for _, format := range FORMATS {
		if format.CanRead {
			readable = append(readable, format)
		}
	}
	return readable
}

// GetWritableFormats returns all formats that can be written
func GetWritableFormats() []ImageFormat {
	var writable []ImageFormat
	for _, format := range FORMATS {
		if format.CanWrite {
			writable = append(writable, format)
		}
	}
	return writable
}

// IsFormatSupported checks if a format is supported for the given operation
func IsFormatSupported(format ImageFormat, operation string) bool {
	switch strings.ToLower(operation) {
	case "read":
		return format.CanRead
	case "write":
		return format.CanWrite
	default:
		return false
	}
}

// DetectFormatFromReader detects image format from reader by reading magic bytes
func DetectFormatFromReader(reader io.Reader) (string, error) {
	// Use Go's built-in format detection
	_, format, err := image.DecodeConfig(reader)
	return format, err
}

// ListSupportedExtensions returns all supported file extensions
func ListSupportedExtensions() []string {
	var extensions []string
	for _, format := range FORMATS {
		extensions = append(extensions, format.Extension)
	}
	return extensions
}

// IsExtensionSupported checks if a file extension is supported
func IsExtensionSupported(path string) bool {
	_, err := GetFormatByExtension(path)
	return err == nil
}

// GetFormatInfo returns detailed information about a format
func GetFormatInfo(formatName string) (map[string]interface{}, error) {
	format, err := GetFormatByName(formatName)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"name":      format.Name,
		"extension": format.Extension,
		"mimeType":  format.MimeType,
		"canRead":   format.CanRead,
		"canWrite":  format.CanWrite,
	}, nil
}
