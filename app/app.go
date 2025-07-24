// Package app provides the application logic for the app
package app

import (
	"context"
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx    context.Context
	assets embed.FS
}

// OpenFile opens a file dialog and returns the selected file path.
func (app *App) OpenFile() string {
	filePath, err := runtime.OpenFileDialog(app.ctx, runtime.OpenDialogOptions{
		Title: "Select File",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Bitmap Image files",
				Pattern:     "*.png;*.jpg;*.jpeg;*.gif;*.bmp;*.tiff",
			},
		},
	})
	if err != nil {
		return ""
	}
	return filePath
}

func NewApp(assets embed.FS) *App {
	return &App{assets: assets}
}

func (app *App) Startup(ctx context.Context) {
	app.ctx = ctx
}

func (app *App) Run() error {
	return wails.Run(&options.App{
		Title:  "Slice & Fill",
		Width:  600,
		Height: 400,
		AssetServer: &assetserver.Options{
			Assets: app.assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.Startup,
		Bind: []any{
			app,
		},
	})
}

func (app *App) CreateEngine() {}
