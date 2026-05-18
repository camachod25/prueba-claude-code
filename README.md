# prueba-claude-code

Proyecto fullstack con React en el frontend y FastAPI (Python) en el backend.

## Estructura del proyecto

```
prueba-claude-code/
├── frontend/   # Aplicación React
└── backend/    # API REST con FastAPI (Python)
```

## Requisitos previos

- Node.js >= 18
- Python >= 3.10
- npm o yarn

## Instalación

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Desarrollo

- Backend corre en: `http://localhost:8000`
- Frontend corre en: `http://localhost:5173`
- Documentación de la API: `http://localhost:8000/docs`
