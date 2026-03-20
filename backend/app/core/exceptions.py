from fastapi import status


class AppException(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)


def not_found(detail: str) -> AppException:
    return AppException(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


def conflict(detail: str) -> AppException:
    return AppException(status_code=status.HTTP_409_CONFLICT, detail=detail)


def unauthorized(detail: str) -> AppException:
    return AppException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)


def unprocessable(detail: str) -> AppException:
    return AppException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)
