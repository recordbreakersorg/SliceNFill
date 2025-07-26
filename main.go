package main

import (
	"embed"
	"slicenfill/backend"
)

//go:embed all:frontend/build
var assets embed.FS

func main() {
	// Create an instance of the app structure
	application := backend.NewApp(assets)

	err := application.Run()
	if err != nil {
		println("Error:", err.Error())
	}
}
