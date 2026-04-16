<img width="2260" height="3060" alt="Route-Monitoring-App" src="https://github.com/user-attachments/assets/7bb1918d-fc5a-4610-8872-65f84a1f2cb5" />

# Route Monitoring App

A mobile app for real-time route tracking, background location recording and offline sync — built with Expo, React Native and TypeScript.

---

## Features

- Real-time location tracking with live map update
- Background location recording (works with screen off or app minimized)
- Offline-first: all points saved locally, synced to server when online
- Interactive map with route polyline drawn as you move
- Dark/light theme support
- Custom design system (Inter font, orange brand color `#ff5300`)

---

## Architecture

The project follows **Feature Sliced Design (FSD)** — code is organized by domain, not by file type. Each layer has a clear responsibility.

```
app/                        # Expo Router entry points (screens)
src/
  core/
    database/               # SQLite setup (Drizzle ORM + WAL mode)
    providers/              # DatabaseProvider (initializes DB on mount)
  entities/
    location/
      api/                  # DB queries (insert, select, update, delete)
      model/                # Schema (Drizzle), Zod validation, types
  features/
    tracking/
      model/                # useTracking hook, background task definition
      ui/                   # TrackingToggle, LocationInfo components
  pages/
    home/                   # HomeScreen + useHomeScreen hook
    settings/               # SettingsScreen + useSettingsScreen hook
    welcome/                # WelcomeScreen + useWelcomeScreen hook
  shared/
    assets/                 # Icons (SVG), images
    config/                 # Theme (colors, typography, spacing, radius)
    lib/                    # useTheme, useNetworkStatus, useUserName
    types/                  # Global TypeScript declarations (svg.d.ts, png.d.ts)
    ui/                     # Shared components (Text, Button, Toggle, LeafletMap...)
```

### Key architectural decisions

| Decision | Choice | Why |
|---|---|---|
| Navigation | Expo Router (file-based) | Simple, no boilerplate, deep linking built-in |
| Local DB | Expo SQLite + Drizzle ORM | Type-safe queries, migrations, no raw SQL in components |
| Validation | Zod + drizzle-zod | Runtime validation at DB insert boundary |
| State | React hooks + Zustand | Simple state stays local, global state via Zustand |
| Forms | react-hook-form | Controlled inputs without re-renders |
| Map | Leaflet (via WebView) | See section below |

---

## The Map: Why Leaflet via WebView?

The app uses **Leaflet.js** running inside a `react-native-webview`, not `react-native-maps`.

**Why?**
- `react-native-maps` uses Google Maps (Android) and Apple Maps (iOS) — both require API keys, billing, and native module linking
- Leaflet uses **OpenStreetMap** tiles — completely free, no API key, no account required
- The WebView bridge is fast enough for real-time location updates (injecting JavaScript to move the marker and update the polyline)

**How it works:**

```
useTracking (watchPositionAsync)
  → updates currentLocation state
    → useHomeScreen reloads route from SQLite
      → LeafletMap receives new coords
        → injectJavaScript sends updateLocation + updateRoute messages to Leaflet
          → marker moves, polyline grows
```

The map HTML is built once, injected as a `source={{ html }}` string, and then receives messages via `window.dispatchEvent` to update the view without reloading.

---

## Background Tracking

Two mechanisms work together:

| Mechanism | When active | What it does |
|---|---|---|
| `watchPositionAsync` | App in foreground | Updates UI marker + inserts points to SQLite every 5m |
| `startLocationUpdatesAsync` (TaskManager) | App in background / screen off | Inserts points to SQLite via registered background task |

The background task (`background-location-task`) is registered at app startup in `_layout.tsx` before any component renders.

---

## Offline Sync

Every recorded location is saved to SQLite with a status flag:

| Status | Value | Meaning |
|---|---|---|
| `UNSENT` | 0 | Saved locally, not sent |
| `PENDING` | 1 | In the process of being sent |
| `SENT` | 2 | Successfully synced to server |

When the user taps **SYNC** (or automatically every 60s during tracking), unsent records are marked `PENDING`, sent to the API, then marked `SENT`. If the request fails, they revert to `UNSENT`.

---

## Main Packages

| Package | Purpose |
|---|---|
| `expo-location` | GPS access (foreground + background) |
| `expo-task-manager` | Register and run background tasks |
| `expo-sqlite` | Local SQLite database |
| `drizzle-orm` + `drizzle-zod` | Type-safe ORM + auto-generated Zod schemas |
| `react-native-webview` | WebView container for Leaflet map |
| `react-native-svg` + `react-native-svg-transformer` | SVG files as React components |
| `react-hook-form` + `zod` | Form handling with schema validation |
| `zustand` | Lightweight global state |
| `@react-native-community/netinfo` | Network status (online/offline detection) |
| `expo-secure-store` | Secure key-value storage |
| `expo-router` | File-based navigation |
| `@expo-google-fonts/inter` | Inter typeface (all weights) |
| `axios` | HTTP client for server sync |

---

## Getting Started

### Prerequisites
- Node.js
- pnpm
- Expo CLI
- iOS Simulator or physical device (Android/iOS)

### Installation

```bash
# 1. Clone
git clone https://github.com/EdmirSoares/route-monitoring-app.git
cd route-monitoring-app

# 2. Install dependencies
pnpm install

# 3. Prebuild (generates native folders)
npx expo prebuild

# 4. Run
pnpm ios      # or pnpm android
```

### Development (Expo Dev Client)

```bash
pnpm start          # Start Metro bundler
pnpm start --clear  # Start with cleared cache (required after metro.config.js changes)
```

> **Note:** Background location and TaskManager require a development build (`expo-dev-client`). They do not work in Expo Go.

---

## What's coming

- Push notifications for real-time route alerts
- Route history screen with timeline
- Server sync implementation (API integration)
- Advanced analytics dashboard

---
---

# Route Monitoring App (pt-BR)

Aplicativo móvel para rastreamento de rota em tempo real, gravação de localização em segundo plano e sincronização offline — construído com Expo, React Native e TypeScript.

---

## Funcionalidades

- Rastreamento de localização em tempo real com atualização ao vivo no mapa
- Gravação de localização em segundo plano (funciona com tela apagada ou app minimizado)
- Offline-first: todos os pontos salvos localmente, sincronizados com o servidor quando online
- Mapa interativo com polyline de rota desenhada enquanto você se move
- Suporte a tema escuro/claro
- Sistema de design customizado (fonte Inter, cor laranja `#ff5300`)

---

## Arquitetura

O projeto segue o **Feature Sliced Design (FSD)** — o código é organizado por domínio, não por tipo de arquivo. Cada camada tem uma responsabilidade clara.

```
app/                        # Entry points do Expo Router (telas)
src/
  core/
    database/               # Setup do SQLite (Drizzle ORM + modo WAL)
    providers/              # DatabaseProvider (inicializa o banco no mount)
  entities/
    location/
      api/                  # Queries do banco (insert, select, update, delete)
      model/                # Schema (Drizzle), validação Zod, tipos
  features/
    tracking/
      model/                # Hook useTracking, definição da tarefa em background
      ui/                   # Componentes TrackingToggle, LocationInfo
  pages/
    home/                   # HomeScreen + hook useHomeScreen
    settings/               # SettingsScreen + hook useSettingsScreen
    welcome/                # WelcomeScreen + hook useWelcomeScreen
  shared/
    assets/                 # Ícones (SVG), imagens
    config/                 # Tema (cores, tipografia, espaçamento, radius)
    lib/                    # useTheme, useNetworkStatus, useUserName
    types/                  # Declarações TypeScript globais (svg.d.ts, png.d.ts)
    ui/                     # Componentes compartilhados (Text, Button, Toggle, LeafletMap...)
```

### Principais decisões de arquitetura

| Decisão | Escolha | Por quê |
|---|---|---|
| Navegação | Expo Router (baseado em arquivos) | Simples, sem boilerplate, deep linking nativo |
| Banco local | Expo SQLite + Drizzle ORM | Queries tipadas, migrações, sem SQL raw nos componentes |
| Validação | Zod + drizzle-zod | Validação em runtime na fronteira de inserção no banco |
| Estado | Hooks React + Zustand | Estado simples fica local, estado global via Zustand |
| Formulários | react-hook-form | Inputs controlados sem re-renders desnecessários |
| Mapa | Leaflet (via WebView) | Veja a seção abaixo |

---

## O Mapa: Por que Leaflet via WebView?

O app usa **Leaflet.js** rodando dentro de um `react-native-webview`, não `react-native-maps`.

**Por quê?**
- O `react-native-maps` usa Google Maps (Android) e Apple Maps (iOS) — ambos exigem chaves de API, faturamento e linking de módulos nativos
- O Leaflet usa tiles do **OpenStreetMap** — completamente gratuito, sem chave de API, sem necessidade de conta
- A ponte via WebView é rápida o suficiente para atualizações de localização em tempo real (injetando JavaScript para mover o marcador e atualizar a polyline)

**Como funciona:**

```
useTracking (watchPositionAsync)
  → atualiza o estado currentLocation
    → useHomeScreen recarrega a rota do SQLite
      → LeafletMap recebe as novas coordenadas
        → injectJavaScript envia mensagens updateLocation + updateRoute para o Leaflet
          → marcador se move, polyline cresce
```

O HTML do mapa é construído uma vez, injetado como string `source={{ html }}`, e depois recebe mensagens via `window.dispatchEvent` para atualizar a visualização sem recarregar.

---

## Rastreamento em Segundo Plano

Dois mecanismos trabalham juntos:

| Mecanismo | Quando ativo | O que faz |
|---|---|---|
| `watchPositionAsync` | App em primeiro plano | Atualiza marcador na UI + insere pontos no SQLite a cada 5m |
| `startLocationUpdatesAsync` (TaskManager) | App em background / tela apagada | Insere pontos no SQLite via tarefa registrada em background |

A tarefa em background (`background-location-task`) é registrada na inicialização do app em `_layout.tsx` antes de qualquer componente renderizar.

---

## Sincronização Offline

Cada localização gravada é salva no SQLite com um flag de status:

| Status | Valor | Significado |
|---|---|---|
| `UNSENT` | 0 | Salvo localmente, não enviado |
| `PENDING` | 1 | Em processo de envio |
| `SENT` | 2 | Sincronizado com sucesso no servidor |

Quando o usuário toca em **SYNC** (ou automaticamente a cada 60s durante o rastreamento), registros não enviados são marcados como `PENDING`, enviados para a API e então marcados como `SENT`. Se a requisição falhar, voltam para `UNSENT`.

---

## Principais Pacotes

| Pacote | Função |
|---|---|
| `expo-location` | Acesso ao GPS (foreground + background) |
| `expo-task-manager` | Registro e execução de tarefas em background |
| `expo-sqlite` | Banco de dados SQLite local |
| `drizzle-orm` + `drizzle-zod` | ORM tipado + schemas Zod gerados automaticamente |
| `react-native-webview` | Container WebView para o mapa Leaflet |
| `react-native-svg` + `react-native-svg-transformer` | Arquivos SVG como componentes React |
| `react-hook-form` + `zod` | Formulários com validação por schema |
| `zustand` | Estado global leve |
| `@react-native-community/netinfo` | Status de rede (detecção online/offline) |
| `expo-secure-store` | Armazenamento seguro de chave-valor |
| `expo-router` | Navegação baseada em arquivos |
| `@expo-google-fonts/inter` | Fonte Inter (todos os pesos) |
| `axios` | Cliente HTTP para sincronização com o servidor |

---

## Primeiros Passos

### Pré-requisitos
- Node.js
- pnpm
- Expo CLI
- Simulador iOS ou dispositivo físico (Android/iOS)

### Instalação

```bash
# 1. Clone
git clone https://github.com/EdmirSoares/route-monitoring-app.git
cd route-monitoring-app

# 2. Instale as dependências
pnpm install

# 3. Prebuild (gera as pastas nativas)
npx expo prebuild

# 4. Execute
pnpm ios      # ou pnpm android
```

### Desenvolvimento (Expo Dev Client)

```bash
pnpm start          # Inicia o bundler Metro
pnpm start --clear  # Inicia com cache limpo (necessário após mudanças no metro.config.js)
```

> **Atenção:** Localização em background e TaskManager requerem uma build de desenvolvimento (`expo-dev-client`). Não funcionam no Expo Go.

---

## O que está por vir

- Notificações push para alertas de rota em tempo real
- Tela de histórico de rotas com linha do tempo
- Implementação da sincronização com servidor (integração de API)
- Dashboard analítico avançado
