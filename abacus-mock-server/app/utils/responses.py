import json
from datetime import datetime, date
from fastapi.responses import JSONResponse


class _DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        return super().default(obj)


def success_response(data, status_code: int = 200) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content=json.loads(
            json.dumps({"success": True, "data": data}, cls=_DateTimeEncoder)
        ),
    )
