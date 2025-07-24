package main

import (
	"embed"
	"slicenfill/app"
)

//go:embed all:frontend/build
var assets embed.FS

func main() {
	// Create an instance of the app structure
	application := app.NewApp(assets)

	err := application.Run()
	if err != nil {
		println("Error:", err.Error())
	}
}
