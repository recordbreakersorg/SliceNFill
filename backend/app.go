// Package backend provides the application logic for the app
package backend

import (
	"C"
	"context"
	"embed"
	"fmt"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (app *App) AddEngine(engine *Engine) int {
	app.enginesCounter++
	app.Engines[app.enginesCounter] = *engine
	fmt.Println("Engines: ", app.Engines)
	return app.enginesCounter
}

type App struct {
	ctx            context.Context
	assets         embed.FS
	Engines        map[int]Engine
	enginesCounter int
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
	newEngine, err := NewEngine(path)
	if err != nil {
		return CreateEngineResponse{
			Error: err.Error(),
		}
	} else {
		EngineID := app.AddEngine(newEngine)
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
	for id, engine := range app.Engines {
		infos = append(infos, EngineInfo{
			Engine: engine,
			ID:     id,
		})
	}
	return infos
}

func (app *App) GetEngineByFileName(fileName string) *int {
	for id, engine := range app.Engines {
		if engine.FilePath == fileName {
			return &id
		}
	}
	return nil
}

type EngineInfo struct {
	Engine Engine `json:"engine"`
	ID     int    `json:"id"`
	Exists bool   `json:"exists"`
}

func (app *App) GetEngineByID(id int) EngineInfo {
	engine, exists := app.Engines[id]
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
	Image Image   `json:"image"`
	Data  []uint8 `json:"data"`
	Error string  `json:"error,omitempty"`
}

func (app *App) GetImageData(image Image) ImageDataResponse {
	data, err := image.GetData()
	var msg string
	if err != nil {
		msg = fmt.Sprintf("Error getting image data: %s", err.Error())
	}
	fmt.Printf("[go:app] Sending to frontend. First 16 bytes: %v\n", data.Data[:16])
	return ImageDataResponse{
		Data:  data.Data,
		Image: image,
		Error: msg,
	}
}

func (app *App) DestroyEngine(id int) {
	engine, exists := app.Engines[id]
	if exists {
		engine.Destroy()
		delete(app.Engines, id)
	}
}
