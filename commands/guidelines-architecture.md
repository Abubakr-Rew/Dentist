# Architecture & Tech Stack Guidelines

## 1. Tech Stack
- **Framework:** React 19 + Vite.
- **Language:** TypeScript (Strict mode enabled).
- **Styling:** Tailwind CSS v4.
- **UI Components:** Кастомные компоненты на базе Tailwind (в папке `src/components/ui`).
- **Icons:** Исключительно `@phosphor-icons/react` (библиотека lucide-react ЗАПРЕЩЕНА для сохранения единого стиля).
- **State Management & Fetching:** React state, Context API для Auth. (В будущем интеграция React Query).
- **Routing:** React Router DOM.

## 2. File Structure
Проект должен придерживаться следующей структуры:
- `/src/components/ui` - переиспользуемые dumb-компоненты (Кнопки, Карточки, Инпуты).
- `/src/components/layout` - элементы каркаса (Навигация, Футер, Sidebar).
- `/src/pages` - страницы приложения (умные компоненты).
- `/src/mocks` - фиктивные данные (отделены от бизнес-логики).
- `/src/services` - файлы для вызовов API (например, `api.ts`).
- `/src/types` - глобальные описания интерфейсов (User, Appointment, Clinic).

## 3. General Architecture Rules
- Проект должен работать полноценно в автономном режиме на основе Mock-данных, пока не подключен реальный бэкенд (Node.js/Express).
- Вызовы бэкенда проксируются через `/api/*` (настроено в `vite.config.js` -> `http://localhost:4000`).
