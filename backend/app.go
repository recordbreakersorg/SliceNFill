package backend

import (
	"context"
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
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
		Width:  600,
		Height: 400,
		AssetServer: &assetserver.Options{
			Assets: app.assets,
		},
		BackgroundColour: &options.RGBA{R: 10, G: 20, B: 30, A: 1},
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
