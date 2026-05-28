# Next.js 표준 보일러플레이트

Tailwind CSS, shadcn/ui, Auth0 (Google login), MongoDB가 통합된 Next.js 보일러플레이트입니다.

## 기술 스택

- **Framework:** Next.js 14 (Pages Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Authentication:** Auth0
- **Database:** MongoDB + Prisma
- **Language:** TypeScript

## 빠른 시작

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수를 설정합니다:

```bash
# Auth0
AUTH0_SECRET=your-secret-here
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# MongoDB
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 데이터베이스 설정

```bash
npx prisma db push
```

### 4. 개발 서버 시작

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어보세요.

## 프로젝트 구조

```
nextjs-boilerplate/
├── pages/              # Next.js 페이지
├── components/         # React 컴포넌트
├── lib/               # 유틸리티 및 헬퍼 함수
├── prisma/            # Prisma 스키마
├── public/            # 정적 파일
├── styles/            # 전역 CSS
└── docs/              # 문서
```

## 주요 페이지

- **홈 (/)**
  - 로그인하지 않은 사용자를 위한 진입점
  - "Google로 로그인" 버튼
  - 로그인 후 자동으로 대시보드로 리다이렉트

- **대시보드 (/dashboard)**
  - 로그인한 사용자만 접근 가능
  - 사용자 프로필 정보 표시

## API 엔드포인트

- **GET /api/user**
  - 현재 로그인한 사용자의 정보 반환
  - 응답: `{ id, email, name, picture }`

- **GET/POST /api/auth/[...auth0]**
  - Auth0 통합 엔드포인트
  - 로그인, 로그아웃, 콜백 처리

## 개발 명령어

```bash
npm run dev       # 개발 서버 시작
npm run build     # 프로덕션 빌드
npm run start     # 프로덕션 서버 시작
npm run lint      # ESLint 실행
npm run format    # Prettier 포맷

# Prisma
npx prisma db push    # 스키마 변경 적용
npx prisma studio    # 데이터베이스 시각화
```

## 배포

### Vercel 배포

1. GitHub에 코드를 푸시합니다
2. [Vercel](https://vercel.com)에 로그인하고 프로젝트를 연결합니다
3. 환경 변수를 Vercel 대시보드에서 설정합니다
4. 배포합니다

## Auth0 설정

### Auth0 애플리케이션 생성

1. [Auth0 Dashboard](https://manage.auth0.com)에서 로그인합니다
2. "Create Application"을 클릭합니다
3. 애플리케이션 이름을 입력합니다 (예: "Next.js Boilerplate")
4. "Single Page Web Applications"를 선택합니다
5. 생성합니다

### Google 소셜 로그인 설정

1. Auth0 Dashboard의 "Connections" > "Social"로 이동합니다
2. "Google"을 클릭하고 설정합니다
3. Google OAuth 자격증명을 입력합니다
4. 애플리케이션에서 Google을 활성화합니다

### Auth0 변수 설정

생성한 애플리케이션에서 다음 정보를 복사합니다:

- **Domain:** `AUTH0_ISSUER_BASE_URL`
- **Client ID:** `AUTH0_CLIENT_ID`
- **Client Secret:** `AUTH0_CLIENT_SECRET`
- **Secret:** `AUTH0_SECRET` (무작위 문자열 생성)

## 다음 단계

이 보일러플레이트는 다음을 쉽게 확장할 수 있습니다:

- 새로운 데이터 모델 추가 (Prisma schema)
- 새로운 API 엔드포인트 추가 (pages/api/)
- 새로운 페이지 추가 (pages/)
- 새로운 컴포넌트 추가 (components/)

## 라이선스

MIT
