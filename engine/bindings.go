package engine

/*
#cgo LDFLAGS: -L/home/engon/rbo/slicenfill -Wl,-rpath,/home/engon/rbo/slicenfill -lengine
#include <stdlib.h>

unsigned int createImage(char* data, unsigned int width, unsigned int height);
char* listImages();
char* getImageData(unsigned int id);
*/
import "C"
import "unsafe"

// CreateImage wraps the C-callable createImage function from the Julia library.
// It takes a Go string and dimensions, and returns the new image ID.
func createImage(data string, width, height int) uint {
	cData := C.CString(data)
	defer C.free(unsafe.Pointer(cData)) // Ensure the C string is freed to avoid memory leaks

	cWidth := C.uint(width)
	cHeight := C.uint(height)

	imageID := C.createImage(cData, cWidth, cHeight)
	return uint(imageID)
}

// ListImages wraps the C-callable listImages function.
// It returns a string containing the list of available image IDs.
func listImages() string {
	cStr := C.listImages()
	// The string is allocated by Julia's runtime; we copy it into Go's memory.
	// We assume Julia's garbage collector will handle the original C-string.
	goStr := C.GoString(cStr)
	return goStr
}

// GetImageData wraps the C-callable getImageData function.
// It takes an image ID and returns the image data as a string.
func getImageData(id uint) string {
	cID := C.uint(id)
	cStr := C.getImageData(cID)
	// Same as above, we copy the C string to a Go-managed string.
	goStr := C.GoString(cStr)
	return goStr
}
