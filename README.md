# DeliveryApp (Expo)

App de delivery com lista de produtos, detalhes e carrinho.

## Scripts
- `npm start` – abre o Expo Dev Tools
- `npm run android` – build/run Android (dev build)
- `npm run ios` – build/run iOS (macOS)
- `npm run web` – roda no navegador

## Estrutura
- `App.js` – Navegação (Tabs + Stack)
- `src/context/CartContext.js` – Estado global do carrinho
- `src/screens/HomeScreen.js` – Lista de itens
- `src/screens/DetailsScreen.js` – Detalhes do item
- `src/screens/CartScreen.js` – Carrinho e total

## Deploy (resumo)
- OTA/preview com EAS Update:
  1. `npx eas login` (faça login na conta Expo)
  2. `npx eas init` (associa o projeto)
  3. `npx eas update --branch preview --message "primeira release"`
  4. Compartilhe o link do update (aparece no terminal)
- Build para lojas (APK/AAB/IPA):
  1. `npx eas build --platform android` (ou `ios`)
  2. Acompanhe o link no terminal; baixe o artefato

## Web (estático)
- `npx expo export --platform web` → gera `dist/` com site estático
- Publique em Vercel/Netlify/GitHub Pages apontando para `dist/`

