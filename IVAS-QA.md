# IVAS QA Fixture (Redis Source)

이 레포는 IVAS 취약점 분석 QA용으로 [redis-qa](https://github.com/hrkim-bit/redis-qa) 소스를 기반으로 구성되었습니다.

## IVAS 검출 대상

| 유형 | 예시 |
|------|------|
| **파일 매칭** | `src/*.c`, `deps/hiredis/*.c`, `modules/*/` |
| **함수 매칭** | C 명명 함수 (`zmalloc`, `redisCommand` 등) |
| **컴포넌트 매칭** | `deps/` (hiredis, jemalloc, lua, xxhash 등) |

> 커스텀 node/php/python 픽스처 대신 IVAS에서 검출이 확인된 Redis 코드베이스를 사용합니다.
