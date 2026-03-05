# Tech Nova API - Backend

AI-powered cultural recipe documentation and guided cooking platform API built with FastAPI and Supabase.

## Features

- **User Authentication**: Sign up, login, logout, JWT token management
- **User Profiles**: View and update user profiles
- **Recipe Management**: Full CRUD operations for recipes
  - Create, read, update, delete recipes
  - Public/private recipe visibility
  - Search and filter by cuisine, category, difficulty
- **Security**: Row Level Security (RLS) in Supabase
- **Admin Panel**: Admin users can manage all recipes and users

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration settings
│   ├── database.py             # Supabase database connection
│   ├── models/                 # Database models
│   │   ├── user_model.py
│   │   └── recipe_model.py
│   ├── schemas/                # Pydantic schemas
│   │   ├── user_schema.py
│   │   └── recipe_schema.py
│   ├── routes/                 # API endpoints
│   │   ├── auth_routes.py
│   │   └── recipe_routes.py
│   ├── services/               # Business logic
│   │   ├── auth_service.py
│   │   └── recipe_service.py
│   └── utils/                  # Utilities
│       └── security.py         # JWT and password utilities
├── database_setup.sql          # Supabase database setup
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables (template)
└── README.md
```

## Setup

### 1. Prerequisites

- Python 3.9+
- Supabase account

### 2. Clone and Setup Virtual Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Copy `.env` file and update with your Supabase credentials:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
SECRET_KEY=your_super_secret_key_change_this_in_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
APP_NAME=Tech Nova API
APP_VERSION=1.0.0
DEBUG=True
```

### 5. Setup Supabase Database

1. Go to your Supabase project
2. Open the SQL Editor
3. Run the contents of `database_setup.sql`

### 6. Run the Server

```bash
# Development
uvicorn app.main:app --reload

# Or run directly
python -m app.main
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/me` | Update current user |

### Recipes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/recipes` | Create recipe |
| GET | `/api/recipes` | Get public recipes |
| GET | `/api/recipes/my-recipes` | Get user's recipes |
| GET | `/api/recipes/{id}` | Get recipe by ID |
| PUT | `/api/recipes/{id}` | Update recipe |
| DELETE | `/api/recipes/{id}` | Delete recipe |
| PATCH | `/api/recipes/{id}/toggle-visibility` | Toggle public/private |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/users` | Get all users |
| GET | `/api/auth/users/{id}` | Get user by ID |
| PUT | `/api/auth/users/{id}` | Update user |
| DELETE | `/api/auth/users/{id}` | Delete user |
| GET | `/api/recipes/admin/all` | Get all recipes |

## User Roles

- **user**: Default role, can create and manage own recipes
- **admin**: Can view/manage all users and recipes

## Security

- JWT-based authentication
- Row Level Security (RLS) in Supabase
- Passwords hashed with bcrypt
- CORS enabled for all origins (configure for production)

## Technologies

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Pydantic](https://pydantic.dev/) - Data validation
- [Python-JOSE](https://pyjwt.readthedocs.io/) - JWT tokens
- [Passlib](https://passlib.readthedocs.io/) - Password hashing

## License

MIT
