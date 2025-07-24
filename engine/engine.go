// Package engine provides the core functionality for the application.
package engine

type Engine struct {
	FilePath []string
	Image    Image
}

func NewEngine(path string) (*Engine, error) {
	image, err := LoadImage(path)
	if err != nil {
		return nil, err
	}
	return &Engine{FilePath: []string{path}, Image: image}, nil
}
