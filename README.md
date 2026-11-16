# PDF Editor 

A professional, modular PDF editor built with React that allows users to view, annotate, and export PDF documents with various drawing tools.

## Features

- 📄 **PDF Viewing**: Load and navigate through PDF documents
- ✏️ **Annotations**: Draw, highlight, add text, shapes, and arrows
- 🎨 **Customization**: Adjust colors, stroke width, font size, and opacity
- ↩️ **Undo/Redo**: Full history management
- 💾 **Export**: Download as PNG images or annotated PDFs
- 🎯 **Selection**: Select and delete annotations
- ⌨️ **Keyboard Shortcuts**: Delete, Undo (Ctrl+Z), Redo (Ctrl+Y)

## Architecture

This project follows a modular architecture with clear separation of concerns:

```
src/
├── components/          # React components
│   ├── layout/         # Header, Toolbar, PropertiesPanel
│   ├── canvas/         # Canvas, TextInput
│   └── ui/             # ColorPicker, Slider, PageNavigator
├── hooks/              # Custom React hooks
│   ├── usePDF.js           # PDF document management
│   ├── useAnnotations.js   # Annotation state management
│   ├── useHistory.js       # Undo/redo functionality
│   └── useCanvasInteraction.js  # Canvas event handling
├── utils/              # Utility functions
│   ├── geometry.js         # Geometric calculations
│   ├── pdf.js             # PDF operations
│   └── rendering.js        # Canvas rendering
├── constants/          # Configuration and constants
└── App.jsx             # Main application component
```

## Module Descriptions

### Components

#### Layout Components
- **Header**: Top navigation bar with zoom controls and export buttons
- **Toolbar**: Left sidebar with tool selection and undo/redo buttons
- **PropertiesPanel**: Right sidebar with style controls and page navigation

#### Canvas Components
- **Canvas**: Main drawing area that handles PDF rendering and user interactions
- **TextInput**: Inline text input for text annotations

#### UI Components
- **ColorPicker**: Color selection with presets and custom color picker
- **Slider**: Reusable range input component
- **PageNavigator**: PDF page navigation controls

### Custom Hooks

- **usePDF**: Manages PDF document state, loading, rendering, and navigation
- **useAnnotations**: Handles annotation CRUD operations and selection
- **useHistory**: Implements undo/redo functionality with state snapshots
- **useCanvasInteraction**: Manages canvas references and hit detection

### Utilities

- **geometry.js**: Geometric calculations (hit detection, distances, etc.)
- **pdf.js**: PDF loading, rendering, and export operations
- **rendering.js**: Canvas rendering for annotations and previews

### Constants

Centralized configuration for:
- Tool definitions
- Color palettes
- Scale/size limits
- External library URLs

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Usage

### Basic Workflow

1. **Upload PDF**: Click or drag-and-drop a PDF file
2. **Select Tool**: Choose from select, text, draw, highlight, rectangle, circle, or arrow
3. **Customize Style**: Adjust color, stroke width, font size, and opacity in the properties panel
4. **Draw/Annotate**: Use the selected tool on the PDF canvas
5. **Export**: Download as image or PDF with annotations

### Keyboard Shortcuts

- `Delete/Backspace`: Delete selected annotation
- `Ctrl+Z`: Undo last action
- `Ctrl+Y`: Redo last undone action
