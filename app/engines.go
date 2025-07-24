package app

import "slicenfill/engine"

var (
	engines     = make(map[int]engine.Engine)
	counter int = 0
)

func AddEngine(engine *engine.Engine) int {
	counter++
	engines[counter] = *engine
	return counter
}
