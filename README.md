<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1n5joFCgjzko_upTbvNcwbet5tZ961sxA

## VS Code Extensions

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run lint`: Run ESLint to check for code quality issues.
- `npm run preview`: Preview the production build locally.

## CI/CD

This project is configured with GitHub Actions:

- **CI (`.github/workflows/ci.yml`)**: Runs on Pull Requests to `main`. Installs dependencies and verifies the build.
- **Deploy (`.github/workflows/deploy.yml`)**: Runs on pushes to `main`. Builds the project and includes a placeholder for deployment commands.


## Project Structure

- `src/`: Source code.
  - `components/`: UI components.
  - `services/`: API services.
  - `utils/`: Utility functions.
- `public/`: Static assets.

## Run Locally

**Prerequisites:**  Node.js (v18+)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key.
3. Run the app:
   ```bash
   npm run dev
   ```
