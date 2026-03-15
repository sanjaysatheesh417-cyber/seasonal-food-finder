# 🌾 பருவ உணவு கண்டுபிடிப்பான்
## Seasonal Food Finder — Tamil Nadu

> Discover 160+ traditional Tamil seasonal foods with nutrition info, health benefits, and recipes — all in Tamil!

---

## 📁 Project Structure

```
seasonal-food-finder/
│
├── backend/                     # FastAPI Python backend
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── models/
│   │   │   ├── models.py        # SQLAlchemy ORM models
│   │   │   └── schemas.py       # Pydantic response schemas
│   │   ├── routes/
│   │   │   └── foods.py         # All API route handlers
│   │   ├── database/
│   │   │   └── db.py            # MySQL connection setup
│   │   └── data/
│   │       └── seed.py          # 160+ Tamil food seed data
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                    # HTML + CSS + JS frontend
│   ├── index.html               # Main app page (100% Tamil UI)
│   ├── styles/
│   │   └── main.css             # Vibrant Tamil-themed styles
│   ├── js/
│   │   └── app.js               # All frontend logic
│   ├── nginx.conf               # Nginx reverse proxy config
│   └── Dockerfile
│
├── docker/
│   └── mysql-init.sql           # Database initialization
│
├── docker-compose.yml           # Orchestrates all 3 services
└── README.md
```

---

## 🏗️ Technology Stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Backend    | Python 3.11, FastAPI 0.110     |
| ORM        | SQLAlchemy 2.0                 |
| Database   | MySQL 8.0                      |
| Frontend   | HTML5, CSS3, Vanilla JavaScript|
| Web Server | Nginx (Alpine)                 |
| Container  | Docker + Docker Compose        |
| Dev OS     | WSL2 (Ubuntu) + VS Code        |

---

## 🗄️ Database Schema

```
categories          seasons            food_season (M2M)
──────────          ───────            ─────────────────
id PK               id PK              food_id FK
name_tamil          month_number       season_id FK
name_english        month_tamil
icon                month_english
color

foods               nutrition          health_benefits
─────               ─────────          ───────────────
id PK               id PK              id PK
name_tamil          food_id FK(unique) food_id FK
name_english        calories           benefit_tamil
category_id FK      protein
description_tamil   carbohydrates      recipes
image_url           fat                ───────
                    fiber              id PK
                    vitamins           food_id FK
                    minerals           title_tamil
                                       ingredients_tamil
                                       instructions_tamil
                                       prep_time
                                       cook_time
```

---

## 🚀 API Endpoints

| Method | Endpoint                      | Description                        |
|--------|-------------------------------|------------------------------------|
| GET    | `/api/foods`                  | Get all foods (paginated)          |
| GET    | `/api/foods/{id}`             | Full food detail with all data     |
| GET    | `/api/foods/month/{1-12}`     | Foods available in a month         |
| GET    | `/api/foods/category/{id}`    | Foods filtered by category         |
| GET    | `/api/recipes/{food_id}`      | Recipes for a food                 |
| GET    | `/api/nutrition/{food_id}`    | Nutrition info for a food          |
| GET    | `/api/search?name=மாம்பழம்`   | Search by Tamil or English name    |
| GET    | `/api/categories`             | All food categories                |
| GET    | `/api/seasons`                | All months                         |
| GET    | `/docs`                       | Swagger UI (interactive API docs)  |

### Example Response — `GET /api/foods/1`

```json
{
  "id": 1,
  "name_tamil": "மாம்பழம்",
  "name_english": "Mango",
  "description_tamil": "தமிழ்நாட்டின் அரசன் என்று அழைக்கப்படும் மாம்பழம்...",
  "image_url": "https://images.unsplash.com/...",
  "category": {
    "id": 1,
    "name_tamil": "பழங்கள்",
    "name_english": "Fruits",
    "icon": "🍎",
    "color": "#FF6B6B"
  },
  "seasons": [
    { "month_number": 3, "month_tamil": "மார்ச்", "month_english": "March" },
    { "month_number": 4, "month_tamil": "ஏப்ரல்", "month_english": "April" }
  ],
  "nutrition": {
    "calories": 60,
    "protein": 0.8,
    "carbohydrates": 15,
    "fat": 0.4,
    "fiber": 1.6,
    "vitamins": "வைட்டமின் C, வைட்டமின் A",
    "minerals": "இரும்பு, பொட்டாசியம்"
  },
  "benefits": [
    { "benefit_tamil": "நோய் எதிர்ப்பு சக்தியை அதிகரிக்கிறது" }
  ],
  "recipes": [
    {
      "title_tamil": "மாம்பழம் லஸ்ஸி",
      "ingredients_tamil": "மாம்பழம் 2, தயிர் 1 கப்...",
      "instructions_tamil": "1. மாம்பழம் தோலுரித்து...",
      "prep_time": "10 நிமிடம்",
      "cook_time": "0 நிமிடம்"
    }
  ]
}
```

---

## ⚙️ WSL + VS Code Setup Instructions

### Step 1 — Install WSL2 (if not already installed)

Open **PowerShell as Administrator** on Windows:
```powershell
wsl --install
# Restart your PC after installation
# Default distro is Ubuntu
```

### Step 2 — Install Docker in WSL2

Open your WSL Ubuntu terminal:
```bash
# Update packages
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (no sudo needed)
sudo usermod -aG docker $USER

# Start Docker service
sudo service docker start

# Verify Docker works
docker --version
docker compose version
```

> 💡 **Tip:** Alternatively install **Docker Desktop for Windows** and enable WSL2 integration in Settings → Resources → WSL Integration.

### Step 3 — Open Project in VS Code

```bash
# Clone or copy the project into WSL filesystem
cd ~
mkdir projects && cd projects

# If copying from Windows:
cp -r /mnt/c/Users/YourName/seasonal-food-finder .

# Open in VS Code (install "Remote - WSL" extension first)
cd seasonal-food-finder
code .
```

VS Code will reopen with the WSL Remote connection. Install these extensions:
- **Remote - WSL** (ms-vscode-remote.remote-wsl)
- **Python** (ms-python.python)
- **Docker** (ms-azuretools.vscode-docker)
- **REST Client** (for testing APIs)

### Step 4 — Build and Run the Project

```bash
# Make sure you're in the project root
cd ~/projects/seasonal-food-finder

# Build all Docker images and start services
docker compose up --build

# Or run in background (detached mode)
docker compose up --build -d
```

First run takes 3–5 minutes to:
1. Build Python/Nginx Docker images
2. Start MySQL and wait for it to be healthy
3. FastAPI auto-creates tables and seeds 160+ foods

### Step 5 — Access the Application

| Service      | URL                                    |
|-------------|----------------------------------------|
| 🌐 Frontend  | http://localhost:3000                  |
| ⚙️ API       | http://localhost:8000                  |
| 📖 API Docs  | http://localhost:8000/docs             |
| 🗄️ MySQL     | localhost:3307 (host port)             |

### Step 6 — Useful Docker Commands

```bash
# View running containers
docker compose ps

# View live logs
docker compose logs -f

# View only backend logs
docker compose logs -f backend

# Stop all services
docker compose down

# Stop and remove volumes (fresh database)
docker compose down -v

# Restart a single service
docker compose restart backend

# Open a shell inside the backend container
docker compose exec backend bash

# Open MySQL CLI
docker compose exec mysql mysql -u fooduser -pfoodpass seasonal_foods
```

---

## 🛠️ Development Tips

### Testing API Directly

```bash
# Test from WSL terminal
curl http://localhost:8000/api/foods | python3 -m json.tool
curl http://localhost:8000/api/foods/month/4
curl "http://localhost:8000/api/search?name=மாம்பழம்"
```

### Modify Seed Data

Edit `backend/app/data/seed.py` and restart:
```bash
docker compose down -v          # Remove old database
docker compose up --build       # Fresh rebuild with new data
```

### Adding New Foods

Use the `add_food()` helper in `seed.py`:
```python
add_food(db, cats, seasons,
    "புதிய பழம்",              # Tamil name
    "New Fruit",               # English name
    "Fruits",                  # Category key
    [3, 4, 5],                 # Available months (1-12)
    "https://image-url.jpg",   # Image URL
    "விளக்கம் தமிழில்...",      # Description in Tamil
    50,                        # Calories per 100g
    1.0,                       # Protein (g)
    12.0,                      # Carbs (g)
    0.3,                       # Fat (g)
    2.0,                       # Fiber (g)
    "வைட்டமின் C",              # Vitamins
    "இரும்பு",                  # Minerals
    ["நன்மை 1", "நன்மை 2"],    # Health benefits in Tamil
    [{"title": "...", "ing": "...", "steps": "..."}]  # Recipes
)
```

---

## 📊 Food Categories Included

| Tamil          | English               | Count  |
|----------------|-----------------------|--------|
| பழங்கள்         | Fruits                | 14+    |
| காய்கறிகள்      | Vegetables            | 16+    |
| சிறுதானியங்கள்  | Millets               | 7+     |
| தானியங்கள்      | Grains                | 5+     |
| பருப்பு வகைகள் | Pulses                | 7+     |
| பாரம்பரிய உணவு | Traditional TN Foods  | 20+    |
| கீரை வகைகள்   | Greens (Keerai)       | 11+    |
| **மொத்தம்**    | **Total**             | **80+**|

> The seed file contains 160+ entries. Many foods appear in multiple months.

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `docker: command not found` | Run `sudo service docker start` |
| MySQL connection refused | Wait 30 seconds, check `docker compose logs mysql` |
| Port 3000 already in use | Change `"3000:80"` to `"3001:80"` in docker-compose.yml |
| Port 8000 already in use | Change `"8000:8000"` to `"8001:8000"` |
| Tamil text not showing | Ensure Noto Sans Tamil font is loaded (internet required) |
| Seed data not loading | Run `docker compose down -v && docker compose up --build` |

---

## 📱 Features Summary

- ✅ **100% Tamil UI** — All labels, descriptions, buttons in Tamil
- ✅ **160+ Foods** — Fruits, Vegetables, Millets, Grains, Pulses, Traditional, Greens
- ✅ **Live Tamil Search** — Search as you type in Tamil or English
- ✅ **Month Filter** — See what's available this month
- ✅ **Category Filter** — Browse by food type
- ✅ **Food Detail Modal** — Full info with nutrition card
- ✅ **Recipe Tabs** — 2 Tamil recipes per food
- ✅ **Health Benefits** — Tamil health benefit cards
- ✅ **Responsive** — Works on mobile and desktop
- ✅ **REST API** — FastAPI with Swagger docs
- ✅ **Dockerized** — One command to run everything

---

*Built with ❤️ for Tamil Nadu's rich food heritage*
*🌾 தமிழ்நாட்டின் பாரம்பரிய உணவு கலைக்கு அர்ப்பணம்*
