# Stagewise Dev Toolbar

This directory contains development tools that are only loaded in development mode.

## StagewiseProvider Component

The `StagewiseProvider.tsx` component integrates the stagewise dev toolbar into the application.

### Features
- **Development-only**: The toolbar only renders when `NODE_ENV === 'development'`
- **Browser toolbar**: Allows developers to select UI elements and leave comments for AI agents
- **Code editor integration**: Comments are sent to your code editor where AI can make changes

### Configuration
The stagewise configuration is defined in the component:

```typescript
const stagewiseConfig = {
  plugins: []  // Add plugins here as needed
};
```

### Usage
The component is automatically loaded in `app/layout.tsx` and requires no additional setup.

To use the toolbar:
1. Run the app in development mode (`npm run dev`)
2. The stagewise toolbar will appear in your browser
3. Select elements and leave comments for AI-powered code changes

### Production Safety
The toolbar is excluded from production builds through:
1. Runtime check: `process.env.NODE_ENV !== 'development'`
2. Dev dependency: Package is installed as `devDependency`

For more information, visit: https://stagewise.dev 