
## Краткий обзор
**vue-nest-campaign** — это приложение для создания маркетинговых кампаний в различных платформах обмена сообщениями, таких как ВКонтакте, Telegram, WhatsApp и прочие. Разработано с использованием Vue 3 и NestJS.


## 📦 Технологии

-   **Frontend**: TypeScript + Vue 3 + Pinia + Tailwind CSS
-   **Backend**: NestJS + Prisma + PostgreSQL

## 📦 Требования
- Node.js
- Bun
- Docker

## 🚀 Как запустить

### Dev

1. Клонируйте репозиторий и перейдите в корневую папку:
	```bash
   git clone https://github.com/your-username/vue-nest-campaign.git
   cd vue-nest-campaign
   ```
2. Установите зависимости:
	```bash
   bun install
   ```
3. Запустите проект в dev режиме:
	```bash
   npm run dev # Запуск api и client
   npm run dev:api #Запуск api
   npm run dev:client # Запуск client
   ```

### Docker

1. Клонируйте репозиторий и перейдите в корневую папку:
   ```bash
   git clone https://github.com/your-username/vue-nest-campaign.git
   cd vue-nest-campaign
   ```

2. Запустите сервисы с помощью docker-compose:
   ```bash
   docker-compose up -d
   ```

-   API-сервер будет доступен по адресу http://localhost:3000
-  Клиент будет доступен по адресу http://localhost:8080
