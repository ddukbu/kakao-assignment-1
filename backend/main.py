from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, select
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel

# DB 설정
DATABASE_URL = "sqlite:///./todos.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# DB 모델 (테이블 구조 정의)
class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    # 나머지 필드를 직접 추가해보세요
    
    text = Column(String)
    isCompleted = Column(Boolean, nullable=False)
    date = Column(String)

# Pydantic 스키마 (요청/응답 데이터 구조 정의)
class TodoCreate(BaseModel):
    # 생성 시 필요한 필드를 직접 추가해보세요
    
    # id 기본키는 백엔드에서 자동 생성
    text: str
    isCompleted: bool
    date: str
    
class TodoResponse(BaseModel):
    id: int
    text: str
    isCompleted: bool
    date: str
    
class TodoUpdate(BaseModel):
    text: str
    isCompleted: bool
    date: str
    

# 테이블 생성
Base.metadata.create_all(bind=engine)

# FastAPI 앱 생성
app = FastAPI(title="Todo API")

# FastAPI 앱 미들웨어 및 CORS 설정
app.add_middleware(
    # 필요한 부분을 직접 작성해보세요.
    
    CORSMiddleware,
    allow_origins=["*"], #우선 *로 처리
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB 세션 의존성
def get_db():
    # 필요한 부분을 직접 작성해보세요.
    db = SessionLocal()  # Session 활성화
    try:
        yield db         # 엔드포인트에 Session 주입
    finally:
        db.close()       # 요청 처리가 종료되면 확실하게 세션 반환 및 종료


# id로 조회하여 데이터가 있으면 Todo 객체를, 없으면 None을 반환하는 함수
def _get_todo_or_none(db: Session, id: int) -> Todo | None:
    return db.scalar(select(Todo).where(Todo.id == id))

# 엔드포인트 구현
# API 목록에 해당되는 부분을 직접 구현해보세요.

# 전체 Todo 목록 조회
@app.get("/todos", response_model=list[TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    # 데이터베이스에서 모든 Todo를 조회하여 리스트로 반환합니다
    return db.scalars(select(Todo)).all()

# 새 Todo 생성
@app.post("/todos", response_model=TodoResponse, status_code=201)
def create_todo(data: TodoCreate, db: Session = Depends(get_db)):
    try:
        todo = Todo(text=data.text, isCompleted=data.isCompleted, date=data.date)
        db.add(todo)      # 트랜잭션에 추가 (아직 DB에 기록되지 않음)
        db.commit()       # DB에 영구 반영
        db.refresh(todo)  # DB 자동 생성 값 재조회(id)
        return todo
    except Exception as e:
        db.rollback()     # 실패 시 변경사항 전체 취소
        raise HTTPException(status_code=500, detail=f"Todo 생성 실패: {str(e)}")

# Todo 수정    
@app.put("/todos/{id}", response_model=TodoResponse)
def update_todo(id: int, data: TodoUpdate, db: Session = Depends(get_db)):
    todo = _get_todo_or_none(db, id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo를 찾을 수 없습니다")
    try:
        if data.text is not None:
            todo.text = data.text
        if data.isCompleted is not None:
            todo.isCompleted = data.isCompleted
        db.commit()
        db.refresh(todo)
        return todo
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Todo 수정 실패: {str(e)}")

# Todo 삭제    
@app.delete("/todos/{id}", status_code=204)
def delete_todo(id: int, db: Session = Depends(get_db)):
    todo = _get_todo_or_none(db, id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo를 찾을 수 없습니다")
    try:
        db.delete(todo)  # 삭제 대상으로 표시
        db.commit()      # DB에서 영구 삭제
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Todo 삭제 실패: {str(e)}")