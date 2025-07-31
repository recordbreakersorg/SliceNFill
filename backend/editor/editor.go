// Package editor: Base editor interfaces, structures and functions
package editor

import (
	"slicenfill/backend/img"
	"sync/atomic"

	"github.com/wailsapp/wails/v2/pkg/options"
)

var (
	editorIDCounter uint64
	editors         []Editor
)

type EditorParamsColors struct {
	Primary   []options.RGBA
	Secondary []options.RGBA
}

type EditorParams struct {
	Colors EditorParamsColors
}

type Editor struct {
	ID         uint64
	File       string
	Stack      []img.Image
	StackIndex uint
	Params     EditorParams
}

func GetEditors() []Editor {
	return editors
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
