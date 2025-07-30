package main

import (
	"embed"
	"slicenfill/backend"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := backend.NewApp(assets)

	err := app.Run()
	if err != nil {
		println("Error:", err.Error())
	}
}
