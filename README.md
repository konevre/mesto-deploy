# Деплой приложения на сервер с использованием PM2

Проект монорепой: фронтенд и бэкенд деплоятся через `pm2 deploy`.

## Доступы

- Публичный IP: `89.169.181.88`
- Фронтенд: `https://konevre.nomorepartiessbs.ru` (HTTP редиректит на HTTPS)
- Бэкенд (API): `https://api.konevre.nomorepartiessbs.ru` (HTTP редиректит на HTTPS)

## Деплой

Требуется на локальной машине создать `.env.deploy` в папках `backend/` и `frontend/` по примеру из `.env.deploy.example`.

### Backend

```bash
cd backend
pm2 deploy production setup   # однократно
pm2 deploy production         # деплой
```

### Frontend

```bash
cd frontend
pm2 deploy production setup   # однократно
pm2 deploy production         # деплой
```

## Примечания

- Эндпоинт краштеста: `GET https://api.konevre.nomorepartiessbs.ru/crash-test` — PM2 перезапускает процесс автоматически.
- Nginx настроен: SPA-роутинг (`try_files $uri $uri/ /index.html`) и CORS/OPTIONS для API-домена.