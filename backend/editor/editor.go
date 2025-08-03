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

type EditorView struct {
	ScaleX       float64
	ScaleY       float64
	TranslationX float64
	TranslationY float64
	RotationX    float64
	RotationY    float64
	RotationZ    float64
}

type EditorParamsColors struct {
	Primary   []options.RGBA
	Secondary []options.RGBA
}

type EditorParams struct {
	Colors    EditorParamsColors
	Tolerance uint
}

type Editor struct {
	ID         uint64
	File       string
	Stack      []img.ImageInfo
	StackIndex uint
	Params     EditorParams
	View       EditorView
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
		Stack:      []img.ImageInfo{image.GetInfo()},
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
			Tolerance: 1,
		},
		View: EditorView{
			TranslationX: 0,
			TranslationY: 0,
			RotationX:    0,
			RotationY:    0,
			RotationZ:    0,
			ScaleX:       1,
			ScaleY:       1,
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

func DeleteEditor(id uint64) bool {
	var newList []Editor
	found := false
	for _, ledit := range editors {
		if id != ledit.ID {
			newList = append(newList, ledit)
		} else {
			found = true
			for _, image := range ledit.Stack {
				img.DeleteImage(image.ID)
			}
		}
	}
	editors = newList
	return found
}
