# README

## Creation steps

- Create wails project with `wails init -n slicenfill -t svelte`(view <https://wails.io/docs/guides/sveltekit>)
- Remove the frontend and replace with `npx sv create frontend/`
- Update the wails.json to use the new `"wailsjsdir": "./frontend/src/lib"`
- The first comment //go:embed all:frontend/dist needs to be changed to //go:embed all:frontend/build
