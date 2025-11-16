# ductify backend
an userside alternative

made with <3 on telehack 2025, volna na svyazi

# requirements
straight arms & nodejs
```
git clone https://github.com/decmbrs/duct-backend.git
cd duct-backend

npm i -D

npx prisma migrate dev --name data

* and then ba-dum-tss 🥁 *
node ./src/index.js
```

# api
## `/cables`
| method  | URL | desc | auth |
| ------ | ------------- | ----------------------------------------------------- | ----------- |
| GET | `/cables` | получить все кабели или фильтровать по `connectionId` | ❌ |
| GET | `/cables/:id` | получить кабель по ID, включая сварки  | ❌ |
| POST | `/cables` | создать кабель  | ✅ |
| DELETE | `/cables/:id` | удалить кабель и его сварки | ✅ |

## `/connections`
| method  | URL | desc | auth |
| ------ | ------------------ | ----------------------- | ----------- |
| GET | `/connections` | получить все соединения | ❌ |
| POST | `/connections` | создать соединение      | ✅ |
| DELETE | `/connections/:id` | удалить соединение      | ✅ |

## `/objects`

| method  | URL | desc | auth |
| ------ | -------------- | ------------------------------- | ----------- |
| GET | `/objects` | получить все объекты | ❌ |
| POST | `/objects` | создать объект | ✅ |
| DELETE | `/objects/:id` | удалить объект и его соединения | ✅ |

## `/splices`

| method  | URL | desc | auth |
| ------ | -------------------------------- | --------------------------- | ----------- |
| GET    | `/splices?cableId=abc123` | получить все сварки кабеля | ❌ |
| POST   | `/splices` | создать или обновить сварку | ✅ |
| DELETE | `/splices/:cableId/:fiberNumber` | удалить конкретное волокно | ✅ |
| DELETE | `/splices/cable/:cableId` | удалить все сварки кабеля | ✅ |

# frontend
use [this](https://github.com/decmbrs/ductify) repo to obtain this
