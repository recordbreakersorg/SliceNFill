package engine

/*
#cgo LDFLAGS: -L.. -Wl,-rpath,$ORIGIN -lengine
#include <stdlib.h>

unsigned int createImage(void* data, size_t len, unsigned int width, unsigned int height);
char* listImages();
void* getImageData(unsigned int id);
int setImageData(unsigned int id, void* data, size_t len);
int initEngine();
*/
import "C"

import (
	"fmt"
	"unsafe"
)

// CreateImage wraps the C-callable createImage function from the Julia library.
// It takes a Go string and dimensions, and returns the new image ID.
func createImage(data []uint8, width, height int) uint {
	cWidth := C.uint(width)
	cHeight := C.uint(height)

	imageID := C.createImage(unsafe.Pointer(&data[0]), C.size_t(len(data)), cWidth, cHeight)
	return uint(imageID)
}

// -#cgo LDFLAGS: -L/home/engon/rbo/slicenfill -Wl,-rpath,/home/engon/rbo/slicenfill -lengine
//
// -#-cgo LDFLAGS: -L/home/engon/rbo/slicenfill/ -lengine
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
func getImageData(id uint, size int) []byte {
	cID := C.uint(id)
	cPtr := C.getImageData(cID)
	// The pointer is to the raw image data, so we need to know the size.
	// This is a simplification; in a real application, you'd need a way
	// to get the size of the data.
	// For now, we'll assume a fixed size based on the image dimensions.
	// This is not safe and should be improved.
	return C.GoBytes(cPtr, C.int(size)) // Unsafe: assumes a fixed size
}

func setImageData(id uint, data []byte) int {
	cID := C.uint(id)
	cPtr := unsafe.Pointer(&data[0])
	cLen := C.size_t(len(data))
	return int(C.setImageData(cID, cPtr, cLen))
}

func init() {
	fmt.Println("[bridge] Initializing engine bindings")
	C.initEngine() // Call the C function to initialize the engine.
}
