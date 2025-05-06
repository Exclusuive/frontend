# Vegin Web Frontend

## 기술 스택

- **프레임워크/라이브러리:**
  - React.js
  - TypeScript
  - Vite (빌드 도구)
- **UI & 스타일링:**
  - TailwindCSS
  - Shadcn UI
  - Radix UI (Shadcn UI의 기반)
- **상태 관리:**
  - Zustand
- **라우팅:**
  - React Router Dom

## 프로젝트 구조

```
vegin-web/
├── public/              # 정적 에셋 (이미지, 폰트 등)
├── src/
│   ├── assets/          # 이미지, 폰트 등 에셋 파일
│   ├── components/      # 재사용 가능한 UI 컴포넌트
│   │   └── ui/          # Shadcn UI 기반 컴포넌트
│   ├── config/          # 애플리케이션 설정 관련 파일
│   ├── constants/       # 상수 값 정의
│   ├── layouts/         # 페이지 레이아웃 컴포넌트
│   ├── lib/             # 유틸리티, API 클라이언트 등 라이브러리 코드
│   ├── pages/           # 페이지 레벨 컴포넌트
│   ├── stores/          # Zustand 상태 관리 스토어
│   ├── index.css        # 전역 CSS 스타일
│   ├── main.tsx         # 애플리케이션 진입점
│   ├── route.tsx        # React Router 설정
│   └── vite-env.d.ts    # Vite 타입 정의
├── .gitignore           # Git 추적 제외 파일 목록
├── components.json      # Shadcn UI 설정 파일
├── eslint.config.js     # ESLint 설정 파일
├── index.html           # 메인 HTML 파일
├── package.json         # 프로젝트 의존성 및 스크립트
├── tsconfig.app.json    # 애플리케이션 TypeScript 설정
├── tsconfig.json        # 기본 TypeScript 설정
├── tsconfig.node.json   # Node.js 환경 TypeScript 설정
├── vite.config.ts       # Vite 설정
├── .prettierrc.json     # Prettier 설정 파일
└── README.md            # 프로젝트 문서
```

- `public`: 빌드 과정에 포함되지 않고 그대로 제공될 정적 파일들을 위치시킵니다.
- `src`: 애플리케이션의 주요 소스 코드가 위치합니다.
  - `assets`: 이미지, 폰트 등 프로젝트에서 사용되는 에셋 파일들을 관리합니다.
  - `components`: 버튼, 입력 필드, 카드 등 재사용 가능한 UI 조각들을 관리합니다. `ui` 하위 디렉토리는 일반적으로 Shadcn UI 컴포넌트를 포함합니다.
  - `config`: API 엔드포인트, 환경 변수 등 애플리케이션 설정을 관리합니다.
  - `constants`: 프로젝트 전반에서 사용되는 상수 값들을 정의합니다.
  - `layouts`: 페이지 컴포넌트들을 감싸는 공통 레이아웃 구조를 정의합니다.
  - `lib`: 외부 라이브러리 설정, 유틸리티 함수, API 클라이언트 등 재사용 가능한 로직을 관리합니다.
  - `pages`: 애플리케이션의 각 페이지를 나타내는 컴포넌트들을 관리합니다.
  - `stores`: Zustand를 사용한 상태 관리 스토어들을 관리합니다.
  - `index.css`: TailwindCSS 지시문 및 전역 스타일을 포함합니다.
  - `main.tsx`: React 애플리케이션을 DOM에 렌더링하는 진입점 파일입니다.
  - `route.tsx`: React Router를 사용하여 애플리케이션의 라우팅 규칙을 정의합니다.

## 실행 방법

1.  **의존성 설치:**
    \`\`\`bash
    npm install
    \`\`\`
    또는
    \`\`\`bash
    yarn install
    \`\`\`

2.  **개발 서버 실행:**
    \`\`\`bash
    npm run dev
    \`\`\`
    또는
    \`\`\`bash
    yarn dev
    \`\`\`

    개발 서버는 기본적으로 \`http://localhost:5173\` 에서 실행됩니다.

## 빌드

프로덕션용으로 애플리케이션을 빌드하려면 다음 명령어를 실행합니다:

\`\`\`bash
npm run build
\`\`\`
또는
\`\`\`bash
yarn build
\`\`\`

빌드 결과물은 \`dist\` 디렉토리에 생성됩니다.
