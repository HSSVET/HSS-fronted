# 📁 Dosya Yapısı Kılavuzu

Bu proje **feature-based** dosya organizasyonu kullanmaktadır. Her özellik (feature) kendi klasöründe organize edilmiştir.

## 🏗️ Ana Yapı

```
src/
├── features/           # Feature-based modüller
├── shared/            # Paylaşılan component'ler
├── constants/         # Uygulama sabitleri
├── context/          # React Context API
├── hooks/            # Custom React hooks
├── services/         # API servisleri
├── types/            # TypeScript türleri
├── utils/            # Yardımcı fonksiyonlar
└── styles/           # Global stiller
```

## 🎯 Features Klasörü

Her feature aşağıdaki yapıda organize edilmiştir:

```
features/
├── animals/
│   ├── components/    # Hayvan ile ilgili component'ler
│   ├── types/        # Hayvan türleri (Animal, Owner, etc.)
│   ├── services/     # API servisleri (AnimalService)
│   ├── styles/       # Feature-specific CSS
│   ├── hooks/        # Custom hooks (isteğe bağlı)
│   └── index.ts      # Tüm export'lar
│
├── appointments/
│   ├── components/    # Randevu component'leri
│   ├── types/        # Randevu türleri
│   ├── services/     # AppointmentService
│   ├── styles/       # CSS dosyaları
│   └── index.ts
│
├── laboratory/
│   ├── components/    # Lab component'leri
│   ├── types/        # Lab türleri
│   ├── services/     # LaboratoryService
│   ├── styles/       # CSS dosyaları
│   └── index.ts
│
└── dashboard/
    ├── components/    # Dashboard component'leri
    ├── styles/       # CSS dosyaları
    └── index.ts
```

## 🔗 Import Örnekleri

### Feature'dan import:
\`\`\`typescript
// Direkt feature'dan
import { AnimalList, AnimalService, Animal } from '../features/animals';

// Component'i import et
import { AppointmentForm } from '../features/appointments';
\`\`\`

### Shared component'lerden:
\`\`\`typescript
import { Layout, Sidebar } from '../shared';
\`\`\`

### Services'den:
\`\`\`typescript
import { AnimalService, AppointmentService } from '../services';
\`\`\`

## 🎨 CSS Organization

CSS dosyaları feature'larında organize edilmiştir:

- **Feature CSS**: `features/{feature}/styles/`
- **Shared CSS**: `shared/styles/`
- **Global CSS**: `styles/`

## 🔧 Custom Hooks

Her feature kendi hook'larını barındırabilir:

\`\`\`typescript
// Feature-specific hook
features/animals/hooks/useAnimals.ts

// Global hook
hooks/useLocalStorage.ts
\`\`\`

## 📦 Export Strategy

Her feature'ın `index.ts` dosyası tüm export'ları yönetir:

\`\`\`typescript
// features/animals/index.ts
export * from './components/AnimalList';
export * from './types/animal';
export * from './services/animalService';
\`\`\`

## 🎯 Faydalar

1. **Modülerlik**: Her feature bağımsız çalışabilir
2. **Ölçeklenebilirlik**: Yeni feature'lar kolayca eklenebilir
3. **Maintainability**: Kod bakımı daha kolay
4. **Team Work**: Farklı team'ler farklı feature'larda çalışabilir
5. **Reusability**: Component'ler kolayca tekrar kullanılabilir

## 🚀 Yeni Feature Ekleme

Yeni bir feature eklemek için:

1. `features/` altında yeni klasör oluştur
2. İhtiyacına göre alt klasörleri ekle: `components/`, `types/`, `services/`, `styles/`
3. `index.ts` dosyası oluştur ve export'ları yönet
4. Ana `features/index.ts`'e yeni feature'ı ekle

## 💡 Best Practices

- Feature'lar arası doğrudan import yapmaktan kaçın
- Shared component'leri genel amaçlı tut
- Type'ları feature'lar içinde tanımla
- Her feature'ın kendi service'i olsun
- CSS'i feature'lar içinde lokalize et 