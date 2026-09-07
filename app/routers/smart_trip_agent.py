from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.agents.smart_trip import AgentChatRequest, AgentChatResponse, SmartTripAgent
from app.database import get_db

router = APIRouter(prefix="/api/agent", tags=["Smart Trip Agent"])


def get_smart_trip_agent() -> SmartTripAgent:
    return SmartTripAgent()


@router.post("/chat", response_model=AgentChatResponse)
async def agent_chat(
    payload: AgentChatRequest,
    db: Session = Depends(get_db),
    agent: SmartTripAgent = Depends(get_smart_trip_agent),
) -> AgentChatResponse:
    return await agent.run(payload, db)

