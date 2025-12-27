# HSS-Frontend Project

Veteriner kliniği yönetim sistemi frontend uygulaması.

## 🚀 Quick Start

```bash
npm install
npm start
```

## ⚠️ IMPORTANT: State Management Migration

**Bu proje React Query + Zustand kullanır. Context API deprecated!**

### Yeni Kod Yazarken:

✅ **Server State (API):** React Query hooks kullan
```typescript
import { useAnimals } from './features/animals/hooks/useAnimalQueries';
const { data, isLoading } = useAnimals();
```

✅ **Client State (UI):** Zustand uiStore kullan
```typescript
import { useUIStore } from './stores';
const { sidebarOpen, toggleSidebar } = useUIStore();
```

✅ **Notifications:** useNotifications kullan
```typescript
import { useNotifications } from './hooks/useNotifications';
const { showSuccess, showError } = useNotifications();
```

❌ **KULLANMA:**
- `useError` from ErrorContext (deprecated)
- `useApp` from AppContext (deprecated)
- Context API providers

### 📚 Detaylı Döküman

Tüm migration detayları ve örnekler için:
👉 **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** 👈

## 📦 Tech Stack

- **React** 18.x
- **TypeScript** 4.x
- **React Query** (TanStack Query) - Server state
- **Zustand** - Client state
- **Material-UI** - Components
- **React Router** - Routing

## 🏗️ Project Structure

```
src/
├── features/          # Feature modules
│   ├── animals/
│   │   ├── hooks/     # ✅ useAnimalQueries.ts (React Query)
│   │   ├── components/
│   │   └── services/
│   ├── appointments/
│   ├── billing/
│   └── ...
├── stores/            # ✅ Zustand stores
│   └── uiStore.ts
├── lib/
│   └── react-query/   # ✅ Query client config
├── hooks/             # ✅ Shared hooks
│   └── useNotifications.ts
└── context/           # ⚠️ DEPRECATED
    ├── AppContext.tsx      # ❌ Don't use
    └── ErrorContext.tsx    # ❌ Don't use
```

## 🛠️ Development

```bash
# Development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 📊 State Management

- **Server State:** React Query (109 hooks across 10 modules)
- **Client State:** Zustand (uiStore)
- **Cache:** IndexedDB (offline support)
- **DevTools:** React Query DevTools + Zustand DevTools

## 🐛 Debugging

### React Query DevTools
Browser'da otomatik açılır (development mode)

### Zustand DevTools
Redux DevTools extension ile kullanılır

## ⚠️ Migration Status

- ✅ Phase 1: Infrastructure (Complete)
- ✅ Phase 2: React Query (109 hooks, Complete)
- ✅ Phase 3: Zustand UI State (Complete)
- ✅ Phase 4: Component Migration (Partial - ongoing)
- ✅ Phase 5: Advanced Features (Infrastructure ready)

**Build Status:** ✅ 0 errors, Production ready

## 📝 Contributing

Yeni kod yazarken:
1. **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** oku
2. React Query hooks kullan (server state için)
3. Zustand uiStore kullan (client state için)
4. Deprecated Context API kullanma

## 📄 License

MIT
