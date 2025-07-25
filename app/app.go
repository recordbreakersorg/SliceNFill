// Package app provides the application logic for the app
package app

import (
	"context"
	"embed"
	"fmt"
	"slicenfill/engine"

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
		Width:  800,
		Height: 600,
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

type CreateEngineResponse struct {
	Engine EngineInfo `json:"engine"`
	Error  string     `json:"error,omitempty"`
}

func (app *App) CreateEngine(path string) CreateEngineResponse {
	fmt.Println("[go] CreateEngine")
	newEngine, err := engine.NewEngine(path)
	if err != nil {
		return CreateEngineResponse{
			Error: err.Error(),
		}
	} else {
		EngineID := AddEngine(newEngine)
		return CreateEngineResponse{
			Engine: EngineInfo{
				Engine: *newEngine,
				ID:     EngineID,
			},
			Error: "",
		}
	}
}

func (app *App) GetEngines() []EngineInfo {
	var infos []EngineInfo
	for id, engine := range engines {
		infos = append(infos, EngineInfo{
			Engine: engine,
			ID:     id,
		})
	}
	return infos
}

func (app *App) GetEngineByFileName(fileName string) *int {
	for id, engine := range engines {
		if engine.FilePath == fileName {
			return &id
		}
	}
	return nil
}

type EngineInfo struct {
	Engine engine.Engine `json:"engine"`
	ID     int           `json:"id"`
	Exists bool          `json:"exists"`
}

func (app *App) GetEngineByID(id int) EngineInfo {
	engine, exists := engines[id]
	if !exists {
		return EngineInfo{Exists: false}
	}
	return EngineInfo{
		Engine: engine,
		ID:     id,
		Exists: true,
	}
}

type ImageInfo struct {
	ID   int     `json:"id"`
	Data []uint8 `json:"data"`
}

type ImageDataResponse struct {
	Image engine.Image `json:"image"`
	Data  []uint8      `json:"data"`
	Error string       `json:"error,omitempty"`
}

func (app *App) GetImageData(image engine.Image) ImageDataResponse {
	fmt.Println("[go] getting image data... for ", image)
	data, err := image.GetData()
	fmt.Println("Got data: [", data, "]")
	var msg string
	if err != nil {
		msg = fmt.Sprintf("Error getting image data: %s", err.Error())
	}
	return ImageDataResponse{
		Data:  data.Data,
		Image: image,
		Error: msg,
	}
}
