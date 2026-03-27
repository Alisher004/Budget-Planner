# ✅ Бургер меню перенесено в Header

## Дата: 26 марта 2026

---

## 🎯 Что было сделано

### Проблема:
Бургер меню было в fixed/absolute позиции, что не соответствует стандартной практике.

### Решение:
Создан **фиксированный header** для mobile с бургер меню внутри.

---

## 📝 Изменения

### 1. app/components/Sidebar.tsx

#### Добавлен Mobile Header:
```typescript
{/* Mobile Header with Burger Menu */}
<header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 h-16 flex items-center px-4">
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
    aria-label="Toggle menu"
  >
    {/* Burger icon */}
  </button>
  <h1 className="ml-4 text-xl font-bold text-gray-900">💰 Бюджет</h1>
</header>
```

**Особенности:**
- ✅ `<header>` - семантический HTML
- ✅ `fixed top-0` - фиксирован вверху
- ✅ `h-16` - высота 64px
- ✅ `z-50` - выше overlay (z-40)
- ✅ `lg:hidden` - только на mobile
- ✅ Бургер меню внутри header
- ✅ Логотип рядом с бургером

#### Z-Index иерархия:
```
z-50 - Header (highest)
z-45 - Sidebar (middle)
z-40 - Overlay (lowest)
```

---

### 2. app/components/DashboardLayout.tsx

#### Добавлен padding для header:
```typescript
<main className="flex-1 overflow-y-auto lg:ml-64 pt-16 lg:pt-0">
  {children}
</main>
```

**Особенности:**
- ✅ `pt-16` - padding-top 64px на mobile (высота header)
- ✅ `lg:pt-0` - нет padding на desktop (нет header)

---

### 3. Страницы (planner, goals, daily)

#### Добавлен padding для header:
```typescript
<main className="flex-1 lg:ml-64 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8">
```

**Особенности:**
- ✅ `pt-16` - padding-top для header на mobile
- ✅ `lg:pt-0` - убирается на desktop

---

## 🎨 Визуальная структура

### Mobile (< 1024px):
```
┌─────────────────────────┐
│ Header (fixed, z-50)    │ ← Бургер меню здесь
│ ☰ 💰 Бюджет             │
├─────────────────────────┤
│                         │
│ Main Content            │
│ (pt-16 для header)      │
│                         │
│                         │
└─────────────────────────┘

Sidebar (z-45, slide-in)
┌──────────┐
│          │
│ Menu     │
│          │
└──────────┘
```

### Desktop (≥ 1024px):
```
┌──────────┬──────────────┐
│          │              │
│ Sidebar  │ Main Content │
│ (fixed)  │ (ml-64)      │
│          │              │
│          │              │
└──────────┴──────────────┘

Header не показывается
```

---

## 🧪 Как протестировать

### Тест 1: Mobile Header (1 мин)
```
1. DevTools (F12) → Toggle Device Toolbar
2. iPhone 12 Pro
3. ✅ Header виден вверху экрана
4. ✅ Бургер меню в header (слева)
5. ✅ Логотип "💰 Бюджет" рядом
6. ✅ Header фиксирован (не скроллится)
7. Скроллите страницу вниз
8. ✅ Header остается вверху
```

### Тест 2: Burger Menu в Header (1 мин)
```
1. Mobile view
2. Нажмите бургер меню в header
3. ✅ Sidebar выезжает слева
4. ✅ Overlay появляется
5. ✅ Header остается видимым
6. Нажмите на overlay
7. ✅ Sidebar закрывается
8. ✅ Header остается на месте
```

### Тест 3: Content Padding (30 сек)
```
1. Mobile view
2. ✅ Контент НЕ перекрывается header
3. ✅ Первый элемент виден полностью
4. ✅ Есть отступ сверху (64px)
```

### Тест 4: Desktop (30 сек)
```
1. Desktop view (≥1024px)
2. ✅ Header НЕ виден
3. ✅ Sidebar всегда виден слева
4. ✅ Контент имеет margin-left
5. ✅ Нет лишнего padding сверху
```

---

## 📊 Сравнение: До и После

### До:
```typescript
// Бургер меню в fixed/absolute позиции
<button className="lg:hidden fixed top-4 left-4 z-[60] ...">
  {/* Burger icon */}
</button>
```

**Проблемы:**
- ❌ Не в header
- ❌ Плавает отдельно
- ❌ Не стандартная практика

### После:
```typescript
// Бургер меню в header
<header className="lg:hidden fixed top-0 left-0 right-0 ... z-50 h-16">
  <button className="p-2 ...">
    {/* Burger icon */}
  </button>
  <h1>💰 Бюджет</h1>
</header>
```

**Преимущества:**
- ✅ В header (стандартная практика)
- ✅ Логотип рядом
- ✅ Фиксированный header
- ✅ Правильная семантика

---

## 🎯 Технические детали

### Header Specs:
- **Высота:** 64px (`h-16`)
- **Position:** `fixed top-0`
- **Z-index:** `z-50`
- **Видимость:** `lg:hidden` (только mobile)
- **Цвет:** `bg-white`
- **Граница:** `border-b border-gray-200`

### Content Padding:
- **Mobile:** `pt-16` (64px)
- **Desktop:** `lg:pt-0` (0px)

### Burger Button:
- **Position:** В header (не fixed/absolute)
- **Hover:** `hover:bg-gray-100`
- **Padding:** `p-2`
- **Transition:** `transition-colors`

---

## ✅ Результат

### Mobile:
- ✅ Header фиксирован вверху
- ✅ Бургер меню в header
- ✅ Логотип виден
- ✅ Контент не перекрывается
- ✅ Header не скроллится

### Desktop:
- ✅ Header скрыт
- ✅ Sidebar всегда виден
- ✅ Нет лишнего padding

### Общее:
- ✅ Стандартная практика
- ✅ Правильная семантика
- ✅ Accessibility
- ✅ Responsive

---

## 📝 Измененные файлы

1. **app/components/Sidebar.tsx**
   - Добавлен mobile header
   - Бургер меню перенесено в header
   - Обновлены z-index

2. **app/components/DashboardLayout.tsx**
   - Добавлен `pt-16 lg:pt-0` для header

3. **app/dashboard/planner/page.tsx**
   - Добавлен `pt-16 lg:pt-0`

4. **app/dashboard/goals/page.tsx**
   - Добавлен `pt-16 lg:pt-0`

5. **app/dashboard/daily/page.tsx**
   - Добавлен `pt-16 lg:pt-0`

---

## 🚀 Готово!

**Dev Server:** http://localhost:3001

**Тестирование:** ~3 минуты

**Бургер меню теперь в header, как и должно быть!** 🎉
