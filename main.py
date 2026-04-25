from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel
import random
import string
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./shortlink.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)

class LinkDB(Base):
    __tablename__ = "links"
    id = Column(Integer, primary_key=True, index=True)
    original_url = Column(String)
    short_hash = Column(String, unique=True, index=True)
    clicks = Column(Integer, default=0)
    date_created = Column(String, default=lambda: datetime.now().strftime("%d.%m.%Y"))
    user_id = Column(Integer, ForeignKey("users.id"))

Base.metadata.create_all(bind=engine)

class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class LinkCreate(BaseModel):
    original_url: str
    user_id: int

app = FastAPI(title="ShortLink API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/auth/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email вже зареєстровано")
    
    new_user = UserDB(name=user.name, email=user.email, password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Реєстрація успішна", "user_id": new_user.id}

@app.post("/auth/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.email == user.email, UserDB.password == user.password).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Невірна пошта або пароль")
    return {"message": "Вхід успішний", "user_id": db_user.id, "name": db_user.name}

@app.post("/links/")
def create_link(link: LinkCreate, db: Session = Depends(get_db)):
    short_hash = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
    
    new_link = LinkDB(
        original_url=link.original_url, 
        short_hash=short_hash, 
        user_id=link.user_id
    )
    db.add(new_link)
    db.commit()
    db.refresh(new_link)
    return {
        "id": new_link.id,
        "original_url": new_link.original_url,
        "short_url": f"http://127.0.0.1:8000/{short_hash}",
        "clicks": new_link.clicks,
        "date_created": new_link.date_created
    }

@app.get("/links/{user_id}")
def get_links(user_id: int, db: Session = Depends(get_db)):
    links = db.query(LinkDB).filter(LinkDB.user_id == user_id).all()
    for link in links:
        link.short_url = f"http://127.0.0.1:8000/{link.short_hash}"
    return links

@app.delete("/links/{link_id}")
def delete_link(link_id: int, db: Session = Depends(get_db)):
    db_link = db.query(LinkDB).filter(LinkDB.id == link_id).first()
    if not db_link:
        raise HTTPException(status_code=404, detail="Посилання не знайдено")
    db.delete(db_link)
    db.commit()
    return {"message": "Видалено успішно"}

@app.get("/{short_hash}")
def redirect_to_original(short_hash: str, db: Session = Depends(get_db)):
    db_link = db.query(LinkDB).filter(LinkDB.short_hash == short_hash).first()
    if not db_link:
        raise HTTPException(status_code=404, detail="Посилання не знайдено")

    db_link.clicks += 1
    db.commit()

    return RedirectResponse(url=db_link.original_url)