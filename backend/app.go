package backend

// laufey

import (
	"context"
	"embed"
	"fmt"
	"slicenfill/backend/editor"
	"slicenfill/backend/img"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx    context.Context
	assets embed.FS
}

// NewApp creates a new App application struct
func NewApp(assets embed.FS) *App {
	return &App{
		assets: assets,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (app *App) startup(ctx context.Context) {
	app.ctx = ctx
}

func (app *App) shutdown(ctx context.Context) {
}

func (app *App) onsecondlaunch(info options.SecondInstanceData) {
}

func (app *App) Run() error {
	return wails.Run(&options.App{
		Title:  "slicenfill",
		Width:  800,
		Height: 600,
		AssetServer: &assetserver.Options{
			Assets: app.assets,
		},
		BackgroundColour: &options.RGBA{R: 10, G: 20, B: 30, A: 0},
		OnStartup:        app.startup,
		OnShutdown:       app.shutdown,
		SingleInstanceLock: &options.SingleInstanceLock{
			UniqueId:               "cm.rbs.slicenfill",
			OnSecondInstanceLaunch: app.onsecondlaunch,
		},
		MinWidth:  500,
		MinHeight: 400,
		Bind: []any{
			app,
		},
	})
}

func (app *App) AskOpenImages() ([]editor.EditorInfo, error) {
	files, err := runtime.OpenMultipleFilesDialog(app.ctx, runtime.OpenDialogOptions{
		Title: "Open image file(s)",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Portable network graphics file",
				Pattern:     "*.png",
			},
			{
				DisplayName: "Bitmap Image",
				Pattern:     "*.bmp",
			},
			{
				DisplayName: "Scalabe Vector Graphics",
				Pattern:     "*.svg",
			},
		},
	})
	if err != nil {
		return nil, err
	}
	var infos []editor.EditorInfo
	for _, file := range files {
		editor, err := editor.CreateEditor(file)
		infos = append(infos, editor.GetInfo())
		if err != nil {
			return infos, err
		}
	}
	return infos, nil
}

func (app *App) GetEditors() []editor.EditorInfo {
	return editor.GetEditorsInfos()
}

func (app *App) GetImageData(id uint64) []uint8 {
	rawImage, exists := img.GetImage(id)
	fmt.Println("Getting image data")
	if exists {
		data := rawImage.GetData()
		fmt.Println("Sent data, first btes: ", string(data[:16]))
		return data
	} else {
		fmt.Println("Data does not exist")
		return nil
	}
}

// ReplaceColor clones an image, replaces all pixels of a certain color with
// another color on the clone, and returns the new image's ID.
func (app *App) ReplaceColor(id uint64, from options.RGBA, to options.RGBA, tolerance float64) (img.ImageInfo, error) {
	image, exists := img.GetImage(id)
	if !exists {
		return img.ImageInfo{}, fmt.Errorf("image with ID %d not found", id)
	}
	clonedImage := image.Clone()
	clonedImage.ReplaceColor(from, to, tolerance)
	return clonedImage.GetInfo(), nil
}

// FloodFill clones an image, fills an area of continuous color with a new
// color on the clone, and returns the new image's ID.
func (app *App) FloodFill(id uint64, x int, y int, to options.RGBA, tolerance float64) (img.ImageInfo, error) {
	image, exists := img.GetImage(id)
	if !exists {
		return img.ImageInfo{}, fmt.Errorf("image with ID %d not found", id)
	}
	clonedImage := image.Clone()
	clonedImage.FloodFill(x, y, to, tolerance)
	return clonedImage.GetInfo(), nil
}

func (app *App) SaveEditor(edit editor.Editor) bool {
	return editor.SaveEditor(edit)
}

