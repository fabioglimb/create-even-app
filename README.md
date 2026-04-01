# @even-toolkit/create-even-app

Scaffold a new [Even Realities G2](https://www.evenrealities.com) smart glasses app from a template gallery.

## Usage

```bash
npx @even-toolkit/create-even-app my-app
```

Or via the toolkit shortcut:

```bash
npx even-toolkit my-app
```

## Templates

| Template | Description |
|----------|------------|
| **minimal** | Clean starter with AppShell and NavHeader |
| **dashboard** | Analytics dashboard with charts, stats, and timeline |
| **notes** | Notes app with search, categories, and CRUD |
| **chat** | AI chat interface with voice input |
| **tracker** | Activity tracker with calendar, timer, and progress |
| **media** | Media gallery with audio player and file uploads |

Every template includes:

- React 19 + React Router 7 + Tailwind CSS v4
- [even-toolkit](https://www.npmjs.com/package/even-toolkit) components and design tokens
- G2 glasses SDK integration (splash screen, display rendering, gestures)
- `app.json` manifest ready for `.ehpk` packaging
- TypeScript, Vite, and hot reload

## After scaffolding

```bash
cd my-app
npm install
npm run dev
```

Test with the G2 simulator:

```bash
npx @evenrealities/evenhub-simulator@latest http://localhost:5173
```

Build and package for the Even Hub:

```bash
npm run build
npx @evenrealities/evenhub-cli pack app.json dist
```

## Contributing templates

1. Create a new directory under `templates/`
2. Add a `template.json` manifest:
   ```json
   {
     "name": "my-template",
     "displayName": "My Template",
     "description": "Short description of the template",
     "tags": ["tag1", "tag2"],
     "components": ["Button", "Card"]
   }
   ```
3. Add your app files — use `{{APP_NAME}}`, `{{DISPLAY_NAME}}`, `{{DISPLAY_NAME_UPPER}}`, `{{PACKAGE_ID}}` as placeholders
4. The CLI auto-discovers templates from the `templates/` directory

## Links

- [even-toolkit](https://www.npmjs.com/package/even-toolkit) — component library
- [Live component demo](https://even-demo.vercel.app)
- [Even Hub SDK](https://www.npmjs.com/package/@evenrealities/even_hub_sdk)
- [Even Hub CLI](https://www.npmjs.com/package/@evenrealities/evenhub-cli)

## License

MIT
