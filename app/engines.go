package app

import (
	"fmt"
	"slicenfill/engine"
)

var (
	engines     = make(map[int]engine.Engine)
	counter int = 0
)

func AddEngine(engine *engine.Engine) int {
	counter++
	engines[counter] = *engine
	fmt.Println("Engines: ", engines)
	return counter
}
