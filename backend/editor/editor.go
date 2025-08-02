// Package editor: Base editor interfaces, structures and functions
package editor

import (
	"fmt"
	"slicenfill/backend/img"
	"sync/atomic"

	"github.com/wailsapp/wails/v2/pkg/options"
)

var (
	editorIDCounter uint64
	editors         []Editor
)

type EditorInfo struct {
	ID         uint64
	File       string
	Stack      []img.ImageInfo
	StackIndex uint
	Params     EditorParams
}

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

func (edit *Editor) GetInfo() EditorInfo {
	var imageInfo []img.ImageInfo
	for _, image := range edit.Stack {
		imageInfo = append(imageInfo, image.GetInfo())
	}
	return EditorInfo{
		ID:         edit.ID,
		File:       edit.File,
		Stack:      imageInfo,
		StackIndex: edit.StackIndex,
		Params:     edit.Params,
	}
}

func GetEditors() []Editor {
	return editors
}

func GetEditorsInfos() []EditorInfo {
	var infos []EditorInfo
	for _, edit := range editors {
		infos = append(infos, edit.GetInfo())
	}
	return infos
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
		Params: EditorParams{
			Colors: EditorParamsColors{
				Primary: []options.RGBA{
					{R: 0, G: 0, B: 0, A: 1},
					{R: 10, G: 20, B: 30, A: 1},
				},
				Secondary: []options.RGBA{
					{R: 10, G: 20, B: 30, A: 1},
					{R: 0, G: 0, B: 0, A: 1},
				},
			},
		},
	}
	fmt.Println("EDitor created", edit)
	editors = append(editors, edit)
	return edit, nil
}

func SaveEditor(edit Editor) bool {
	index := -1
	for idx, ledit := range editors {
		if edit.ID == ledit.ID {
			index = idx
		}
	}
	if index >= 0 {
		editors[index] = edit
		return true
	} else {
		return false
	}
}
