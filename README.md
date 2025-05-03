# figma-svelte-plugin-boilerplate

A boilerplate project to kickstart building Figma plugins using Svelte.

## Getting Started
1. Clone the repository:
   ```bash
   git clone
    cd figma-svelte-plugin-boilerplate
    ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```
4. Open Figma and load the plugin:
   - Go to `Plugins` > `Development` > `New Plugin...`
   - Select the `manifest.json` file in the root of the project.
5. Open the plugin in Figma:
   - Go to `Plugins` > `Development` > `Your Plugin Name`
   - The plugin will open in a new window.
6. Make changes to the Svelte components in the `src` directory.
7. The development server will automatically rebuild the plugin when you save changes.
8. To build the plugin for production, run:
   ```bash
   pnpm build
   ```

## Project Structure
- `src/`: Contains the Svelte components and styles.
- `public/`: Contains the static assets and the `manifest.json` file.

- `UI.svelte`: The main Svelte component that serves as the entry point for the plugin UI.
- `code.ts`: The main TypeScript file that handles the plugin's entry point and communication with Figma.