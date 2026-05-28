# Next.js 표준 보일러플레이트 설계

**작성일:** 2026-05-28  
**목표:** Tailwind, shadcn, Auth0 (Google login), MongoDB가 통합된 일반적인 웹 앱 보일러플레이트 제공

---

## 1. 프로젝트 개요

일반적인 웹 애플리케이션을 빠르게 시작할 수 있는 Next.js 보일러플레이트입니다.

**핵심 기능:**
- Google 로그인 (Auth0 통합)
- 사용자 인증 및 세션 관리
- 보호된 대시보드 페이지
- MongoDB 데이터베이스 연결
- 재사용 가능한 폴더 구조

**기술 스택:**
- Next.js 13+ (Pages Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Auth0
- Prisma + MongoDB
- ESLint + Prettier

---

## 2. 폴더 구조

```
nextjs-boilerplate/
├── pages/
│   ├── index.tsx              # 홈/로그인 페이지
│   ├── dashboard.tsx          # 보호된 대시보드
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...auth0].ts  # Auth0 콜백 처리
│   │   └── user.ts            # 사용자 정보 API
│   ├── _app.tsx               # Next.js 앱 설정
│   └── _document.tsx          # HTML 구조
├── components/
│   ├── Layout.tsx             # 페이지 레이아웃
│   ├── Navbar.tsx             # 네비게이션 바
│   ├── ProtectedRoute.tsx      # 인증 필수 래퍼
│   └── (shadcn 컴포넌트)
├── lib/
│   ├── auth.ts                # Auth0 설정 및 헬퍼
│   ├── db.ts                  # Prisma 클라이언트
│   ├── api.ts                 # API 요청 헬퍼
│   └── types.ts               # 공용 TypeScript 타입
├── prisma/
│   └── schema.prisma          # Prisma 데이터 모델
├── public/                    # 정적 파일 (이미지, 폰트 등)
├── styles/                    # 전역 CSS
├── .env.example               # 환경 변수 템플릿
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

---

## 3. 데이터 모델

### Prisma Schema

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String?
  picture   String?
  auth0Id   String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**User 모델:**
- `id`: MongoDB ObjectId (기본 키)
- `email`: 고유한 이메일 주소
- `name`: 사용자 이름 (선택사항)
- `picture`: 프로필 사진 URL (선택사항)
- `auth0Id`: Auth0에서 제공하는 고유 사용자 ID
- `createdAt`: 계정 생성 시간
- `updatedAt`: 마지막 업데이트 시간

---

## 4. 인증 플로우

### 로그인 프로세스

1. 사용자가 홈페이지(`/`) 접속
2. "Google로 로그인" 버튼 클릭
3. Auth0 로그인 페이지로 리다이렉트
4. Google 계정으로 인증
5. Auth0 콜백 처리 (`/api/auth/[...auth0].ts`)
   - Auth0에서 사용자 정보 수신
   - MongoDB에 User 레코드 생성 또는 업데이트
   - 세션 토큰 생성 및 쿠키에 저장
6. `/dashboard`로 자동 리다이렉트

### 로그아웃 프로세스

1. 대시보드의 로그아웃 버튼 클릭
2. Auth0 로그아웃 엔드포인트 호출
3. 세션 쿠키 삭제
4. 홈(`/`)으로 리다이렉트

### 페이지 보호

`ProtectedRoute` 컴포넌트로 대시보드를 래핑합니다:
- 세션 확인
- 없으면 홈으로 리다이렉트
- 있으면 페이지 렌더링

---

## 5. API 엔드포인트

### `/api/auth/[...auth0]`

Auth0 라이브러리에서 자동으로 처리됩니다.
- 로그인, 콜백, 로그아웃 처리
- 세션 관리

### `GET /api/user`

현재 로그인한 사용자의 정보를 반환합니다.

**요청:**
```javascript
GET /api/user
```

**응답 (200):**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "picture": "https://..."
}
```

**응답 (401):**
```json
{
  "error": "Unauthorized"
}
```

**구현:**
- 쿠키에서 세션 토큰 확인
- Auth0에서 토큰 검증
- auth0Id로 DB에서 사용자 조회
- 정보 반환

---

## 6. 페이지 구조

### `/pages/index.tsx` (홈/로그인)

**목적:** 로그인하지 않은 사용자의 진입점

**구성:**
- 로그인 상태 확인
- 로그인된 경우 `/dashboard`로 자동 리다이렉트
- 로그인 안 된 경우:
  - "환영합니다" 메시지
  - "Google로 로그인" 버튼 (shadcn Button)
  - 심플하고 깔끔한 디자인

**스타일:** Tailwind + shadcn

### `/pages/dashboard.tsx` (보호된 대시보드)

**목적:** 로그인한 사용자의 메인 페이지

**구성:**
- `ProtectedRoute`로 감싸기
- Layout 컴포넌트로 Navbar 포함
- 헤더:
  - 사용자 이름 표시
  - 로그아웃 버튼
- 본문:
  - "환영합니다, [사용자 이름]" 메시지
  - 사용자 정보 표시 (이메일, 프로필 사진)
  - Card 컴포넌트 사용

### `/pages/_app.tsx`

**목적:** Next.js 전역 설정

**구성:**
- Tailwind 스타일 import
- shadcn 프로바이더 설정
- Layout 감싸기 (모든 페이지에 Navbar 포함)
- Auth0 세션 체크

### `/pages/_document.tsx`

**목적:** HTML 기본 구조

**구성:**
- `<!DOCTYPE html>`
- 언어 설정 (`lang="ko"`)
- 메타 태그 (viewport, charset)
- 폰트 링크

---

## 7. 핵심 컴포넌트

### `components/Layout.tsx`

페이지를 감싸는 레이아웃 컴포넌트

```tsx
export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <main className="p-4">
        {children}
      </main>
    </div>
  );
}
```

### `components/Navbar.tsx`

상단 네비게이션 바

```tsx
// 로그인 상태에 따라:
// - 로그인 안 됨: 홈 링크만
// - 로그인 됨: 사용자 이름 + 로그아웃 버튼
```

### `components/ProtectedRoute.tsx`

로그인 필수 페이지 래퍼

```tsx
// 세션 확인
// - 없으면 `/`로 리다이렉트
// - 있으면 children 렌더링
```

### shadcn 컴포넌트

초기 필요:
- `Button` - 로그인/로그아웃 버튼
- `Card` - 사용자 정보 표시
- `Input` (필요시 추가)

---

## 8. 라이브러리 설정

### 환경 변수 (`.env.example`)

```
# Auth0
AUTH0_SECRET=
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=

# MongoDB
DATABASE_URL=mongodb://...
```

### package.json (주요 의존성)

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "@auth0/nextjs-auth0": "^3.0.0",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "tailwindcss": "^3.3.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

### tsconfig.json

- `strict: true` (타입 안전성)
- `jsx: "preserve"` (Next.js)
- `paths` 설정 (선택사항)

### tailwind.config.js

- shadcn 테마 통합
- 커스텀 컬러 (필요시)

---

## 9. 개발 워크플로우

### 초기 셋업

1. 저장소 클론
2. `.env.local` 작성 (`.env.example` 기반)
3. `npm install` 실행
4. `npm run db:push` (Prisma 마이그레이션)
5. `npm run dev` 시작

### 개발 명령어

```bash
npm run dev      # 개발 서버 시작
npm run build    # 빌드
npm run start    # 프로덕션 시작
npm run lint     # 린트 체크
npm run format   # Prettier 포맷
```

### Prisma 명령어

```bash
npx prisma db push      # 스키마 마이그레이션
npx prisma studio      # 데이터베이스 시각화
```

---

## 10. 확장성

이 보일러플레이트는 다음을 쉽게 추가할 수 있도록 설계되었습니다:

- **새로운 모델**: `prisma/schema.prisma`에 추가
- **새로운 API**: `/pages/api/`에 추가
- **새로운 페이지**: `/pages/`에 추가
- **새로운 컴포넌트**: `/components/`에 추가

---

## 11. 배포

### Vercel 배포

1. GitHub에 푸시
2. Vercel에 연결
3. 환경 변수 설정 (`.env.local`)
4. 배포

Auth0 및 MongoDB 연결 문자열을 Vercel 환경 변수에 추가해야 합니다.

---

## 요약

이 설계는 최소한의 기능으로 빠르게 시작할 수 있으면서도, 나중에 확장 가능한 구조를 제공합니다. Auth0, Prisma, Tailwind, shadcn의 모범 사례를 따릅니다.
