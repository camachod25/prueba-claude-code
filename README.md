# prueba-claude-code

Proyecto fullstack con React en el frontend y FastAPI (Python) en el backend.

## Estructura del proyecto

```
prueba-claude-code/
├── frontend/   # Aplicación React
└── backend/    # API REST con FastAPI (Python)
```

## Requisitos previos

- Python >= 3.12
- Node.js no requerido — el frontend es un prototipo estático sin bundler

## Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Tests

```bash
pytest                    # todos los tests
pytest tests/unit         # solo unitarios
pytest tests/integration  # solo integración
```

## Frontend

El frontend no tiene build step. Sirve la carpeta con cualquier servidor estático:

```bash
cd frontend
python3 -m http.server 8080
```

## URLs

| Servicio | URL |
|---|---|
| Frontend | http://localhost:8080 |
| Backend | http://localhost:8000 |
| Docs API (Swagger) | http://localhost:8000/docs |
| Docs API (ReDoc) | http://localhost:8000/redoc |
