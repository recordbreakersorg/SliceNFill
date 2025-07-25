# Slice'n'Fill Project Overview

This document outlines the architecture and data flow of the Slice'n'Fill application.

## 1. Core Technologies

*   **Application Framework:** [Wails](https://wails.io/) (v2)
*   **Backend Logic:** Go
*   **Image Processing Core:** Julia
*   **Frontend UI:** SvelteKit

## 2. Project Structure

The project is organized into several key directories:

-   `app/`: Contains the core Go application logic that is bound to the frontend.
-   `engine/`: A Go package that acts as a bridge between the main Go application and the Julia image processing library.
-   `Engine/`: The Julia project containing the image processing logic. This is compiled into a shared library (`libengine.so`).
-   `frontend/`: The SvelteKit frontend application.
-   `build/`: Contains build artifacts and platform-specific configuration.
-   `libengine.so`: The compiled Julia shared library, which is the output of the `Engine/` project.
-   `main.go`: The main entry point for the Wails application.
-   `manage.fish`: A utility script for managing project tasks, such as compiling the Julia engine.

## 3. Architecture and Data Flow

Slice'n'Fill uses a multi-language architecture where the UI (SvelteKit) communicates with a Go backend, which in turn offloads heavy image processing tasks to a high-performance Julia library.

### Building the Engine

The Julia code in `Engine/src/` is compiled into a C-style shared library (`libengine.so`). This is done by running the `./manage.fish build-engine` command. The `Engine/src/lib.jl` file uses `Base.@ccallable` to define functions that can be called from other languages (in this case, Go).

### Image Loading and Processing Workflow

The typical data flow for opening and displaying an image is as follows:

1.  **Frontend Request:** A user action in the SvelteKit UI (e.g., clicking an "Open File" button) triggers a call to a Go method exposed by Wails.

2.  **Go Backend (File Loading):** The Go backend receives the file path. The `engine/imagedata.go:LoadImageData` function opens the image file, decodes it, and converts it into a raw `[]uint8` slice of RGBA pixel data.

3.  **Go-to-Julia Bridge (Create Image):**
    *   The raw pixel data is passed to `engine/bindings.go:createImage`.
    *   This function uses CGo to call the `createImage` function exported from the `libengine.so` shared library.
    *   The image dimensions (width, height) and the byte slice are passed from Go's memory space to the Julia runtime.

4.  **Julia Engine (Image Storage):**
    *   Inside `Engine/src/lib.jl`, the `createImage` function receives the pixel data.
    *   It creates an `Engine.Image` struct (defined in `Engine/src/image.jl`) to hold the pixel data in a Julia-native format (`Matrix{Pix}`).
    *   This new Julia `Image` object is stored in a global `Dict` (a hash map) keyed by a unique integer ID.
    *   This ID is returned back through the CGo bridge to the Go backend.

5.  **Go Backend (Image Handle):** The Go backend now holds a handle to the image, which is just the integer ID. It does not hold the pixel data itself anymore.

6.  **Frontend Display Request:**
    *   To display the image, the frontend (`frontend/src/routes/editor/EmptyView.svelte`) requests the pixel data from the Go backend, providing the image ID.
    *   The Go backend calls `engine/bindings.go:getImageData`, passing the ID.

7.  **Go-to-Julia Bridge (Retrieve Data):**
    *   The `getImageData` CGo function calls the corresponding `getImageData` function in the Julia library.
    *   Julia retrieves the `Image` object from the global `Dict` using the ID and returns a raw pointer to the underlying pixel data matrix.

8.  **Data Transfer to Frontend:**
    *   The pointer is returned to Go. `C.GoBytes` is used to safely copy the data from Julia's memory into a new Go byte slice (`[]uint8`).
    *   This byte slice is then sent to the SvelteKit frontend as a JSON `Uint8Array`.

9.  **Frontend Rendering:**
    *   In `EmptyView.svelte`, the component receives the `Uint8Array`.
    *   It gets the 2D rendering context of an HTML `<canvas>` element.
    *   It creates a `ImageData` object, copies the received pixel data into it, and uses `putImageData()` to render the image on the canvas.

This architecture allows the application to leverage the strengths of each language: SvelteKit for a reactive user interface, Go for robust application logic and system interaction, and Julia for computationally intensive image manipulation tasks.
