package backend

/*
#cgo LDFLAGS: -L.. -Wl,-rpath,$ORIGIN -lengine
#include <stdlib.h>
#include "../Engine/src/engine.h"
*/
import "C"

import (
	"fmt"
	"log"
	"unsafe"
)

func createImage(data []uint8, width, height int) uint {
	cWidth := C.uint(width)
	cHeight := C.uint(height)
	fmt.Printf("[go:bridge] Sending to Julia. First 16 bytes: %v\n", data[:16])
	imageID := C.createImage(unsafe.Pointer(&data[0]),
		C.uint(len(data)), C.uint(cWidth), C.uint(cHeight))
	return uint(imageID)
}

func listImages() []uint {
	log.Fatalln("[go:bridge] Not implimented listimages")
	return nil
}

func getImageData(id uint, size int) []byte {
	cPtr := C.getImageData(C.uint(id))
	return C.GoBytes(cPtr, C.int(size)) // Unsafe: assumes a fixed size
}

func setImageData(id uint, data []byte) int {
	cPtr := unsafe.Pointer(&data[0])
	return int(C.setImageData(C.uint(id), cPtr, C.uint(len(data))))
}

func destroyImage(id uint) bool {
	return C.destroyImage(C.uint(id)) == 1
}

func init() {
	fmt.Println("[go:bridge] Initializing engine bindings")
	C.initEngine() // Call the C function to initialize the engine.
}
