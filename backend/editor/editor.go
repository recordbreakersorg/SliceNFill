package editor

import (
	"slicenfill/backend/img"
	"sync/atomic"
)

var (
	editorIDCounter uint64
	editors         []Editor
)

type Editor struct {
	ID         uint64
	File       string
	Stack      []img.Image
	StackIndex uint
}

func CreateEditor(path string) (Editor, error) {
	image, err := img.OpenImage(path)
	if err != nil {
		return Editor{}, err
	}
	edit := Editor{
		ID:         atomic.AddUint64(&editorIDCounter, 1),
		File:       path,
		Stack:      []img.Image{image},
		StackIndex: 0,
	}
	editors = append(editors, edit)
	return edit, nil
}
