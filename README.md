# Қазақ CRM - Customer Relationship Management Жүйесі

![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?logo=tailwind-css)

## 📋 Жоба туралы

**Қазақ CRM** — казахстандық бизнеске арналған тұтынушылармен қарым-қатынасты басқару жүйесі. Жүйе клиенттерді, тапсырыстарды, транзакцияларды және компания деректерін тиімді басқаруға мүмкіндік береді.

## ✨ Мүмкіндіктер

- 👥 **Клиенттерді басқару** — тұтынушылардың толық профилін жүргізу
- 📦 **Тапсырыстарды бақылау** — тапсырыс мәртебелерін нақты уақытта бақылау
- 💰 **Транзакциялар** — қаржылық операцияларды есепке алу
- 🏢 **Компания деректері** — ұйым ақпаратын орталықтандырылған сақтау
- 📊 **Аналитика** — бизнес нәтижелерін бақылауға арналған бақылау тақтасы
- 🔐 **JWT аутентификация** — қауіпсіз кіру және сессияларды басқару
- 📱 **Адаптивті дизайн** — барлық құрылғыларда жұмыс істейді

## 🛠 Технологиялар

### Backend
| Технология | Нұсқасы |
|------------|---------|
| Node.js    | 20.x    |
| Express    | 4.x     |
| TypeScript | 5.x     |
| MongoDB    | 7.0     |
| Mongoose   | 8.x     |
| JWT        | 9.x     |
| Zod        | 3.x     |

### Frontend
| Технология   | Нұсқасы |
|--------------|---------|
| React        | 18.x    |
| Vite         | 5.x     |
| TypeScript   | 5.x     |
| Tailwind CSS | 3.x     |
| React Router | 6.x     |
| Recharts     | 2.x     |

## 🚀 Орнату нұсқаулығы

### Docker арқылы (ұсынылады)

**Алдын ала талаптар:** Docker және Docker Compose орнатылған болуы керек.

```bash
# Репозиторийді клондау
git clone https://github.com/your-org/kaz_crm.git
cd kaz_crm

# Орта айнымалыларын орнату
cp .env.example .env
# .env файлын өңдеп, JWT_SECRET мәнін өзгертіңіз

# Контейнерлерді іске қосу
docker compose up -d

# Журналдарды тексеру
docker compose logs -f
```

Қызметтер іске қосылғаннан кейін:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Swagger UI: http://localhost:5000/api-docs

### Қолмен орнату

#### Backend

```bash
cd backend
npm ci
cp ../.env.example .env
# .env файлын толтырыңыз

# Даму режимі
npm run dev

# Өндіріс режимі
npm run build
npm start
```

#### Frontend

```bash
cd frontend
npm ci

# Даму режимі
npm run dev

# Өндіріс режимі
npm run build
npm run preview
```

## 🔧 Орта айнымалылары

`.env.example` файлын `.env` ретінде көшіріп, мәндерді толтырыңыз:

| Айнымалы       | Сипаттама                              | Үлгі мәні                    |
|----------------|----------------------------------------|------------------------------|
| NODE_ENV       | Орта түрі                              | development / production     |
| PORT           | Backend порты                          | 5000                         |
| MONGODB_URI    | MongoDB қосылым жолы                   | mongodb://localhost:27017/... |
| JWT_SECRET     | JWT қол қою кілті (күшті болуы керек) | your_secure_key_here         |
| JWT_EXPIRES_IN | JWT мерзімі                            | 7d                           |
| CORS_ORIGIN    | Рұқсат берілген CORS шығу тегі         | http://localhost:3000        |
| VITE_API_URL   | Frontend API URL                       | http://localhost:5000/api    |

## 📚 API Құжаттамасы

Backend іске қосылғаннан кейін Swagger UI арқылы API-ді зерттеуге болады:

```
http://localhost:5000/api-docs
```

Негізгі эндпойнттар:
- `POST /api/auth/register` — тіркелу
- `POST /api/auth/login` — жүйеге кіру
- `GET /api/clients` — клиенттер тізімі
- `GET /api/orders` — тапсырыстар тізімі
- `GET /api/transactions` — транзакциялар тізімі

## 🖼 Скриншоттар

> _Скриншоттар қосылатын болады_

## 🗂 Жоба құрылымы

```
kaz_crm/
├── backend/                # Node.js + Express API
│   ├── src/
│   │   ├── controllers/    # Маршрут өңдеушілері
│   │   ├── models/         # Mongoose үлгілері
│   │   ├── routes/         # API маршруттары
│   │   ├── middleware/     # Express аралық бағдарлама
│   │   └── server.ts       # Негізгі сервер файлы
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React + Vite қолданбасы
│   ├── src/
│   │   ├── components/     # React компоненттері
│   │   ├── pages/          # Бет компоненттері
│   │   ├── services/       # API қызметтері
│   │   └── App.tsx
│   └── package.json
├── docker-compose.yml      # Docker Compose конфигурациясы
├── Dockerfile.backend      # Backend Docker файлы
├── Dockerfile.frontend     # Frontend Docker файлы
├── nginx.conf              # Nginx конфигурациясы
├── .env.example            # Орта айнымалылары үлгісі
└── README.md
```

## 📄 Лицензия

MIT License © 2024 Қазақ CRM
