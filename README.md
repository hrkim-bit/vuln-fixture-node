# vuln-fixture-node

Node.js/Express vulnerable fixture for IVAS QA.

> ⚠️ 의도적으로 취약하게 작성된 테스트 픽스처입니다. 절대 운영 환경에 사용하지 마세요.
> 모든 시크릿/키는 형식만 진짜 같은 **가짜 값**입니다.

## 의도된 취약점 (9종 — php 픽스처보다 많게 구성)

### JavaScript (`app.js`, `src/utils.js`)
- Command Injection — `child_process.exec(user_input)`
- SQL Injection — 문자열 연결 쿼리 조립
- NoSQL Injection — 검증 없는 `$where` / 사용자 객체 그대로 사용
- Path Traversal — 검증 없는 `fs.readFile()`
- SSRF — `axios.get(user_url)`
- 코드 인젝션 — `eval(user_input)`
- Prototype Pollution — 재귀 merge
- 약한 해시 — `crypto.createHash('md5')`
- 하드코딩 시크릿 / JWT 시크릿
- `jwt.verify` `algorithms` 미지정

### 의존성
- `package.json` — 알려진 CVE 보유 npm 패키지 구버전 (lodash, minimist, express, jsonwebtoken 등)

### Docker
- `Dockerfile` — root 실행, `latest` 태그, ENV 시크릿 노출
