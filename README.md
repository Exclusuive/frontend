# Exclusuive Frontend

Exclusuive는 Sui 기반 NFT 컬렉션을 만들고 관리하는 프론트엔드입니다. 사용자는 지갑을 연결해 컬렉션을 생성하고, 컬렉션 상세 화면에서 민팅 규칙과 아이템 레이어를 관리하며, 대시보드에서 보유 컬렉션을 확인할 수 있습니다.

## 주요 기능

- Sui 지갑 연결 및 사용자 컬렉션 조회
- NFT 컬렉션 생성 플로우
- 컬렉션 상세 정보, 민팅 베이스, 아이템, 레이어 관리
- S3 presigned URL 기반 이미지 업로드
- Exclusuive TypeScript SDK를 통한 트랜잭션 구성
- 개발/프리뷰용 SDK 테스트 화면

## 기술 스택

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS 4
- TanStack Query
- Mysten dApp Kit
- Axios
- Radix UI, lucide-react
- exclusuive-typescript-sdk

## 프로젝트 구조

```txt
src/
  api/                      백엔드 API 클라이언트
  components/               공통 UI와 컬렉션 생성/상세 컴포넌트
  hooks/                    Sui transaction, query 관련 훅
  lib/                      트랜잭션 빌더, S3 업로드, 폼 유틸
  pages/                    Dashboard, MakeCollection, CollectionDetail, SDK_TEST
  types/                    API와 도메인 타입
  Layout.tsx                사이드바/헤더 레이아웃
  Routers.tsx               라우트 정의
```

## 라우트

| Path | 설명 |
| --- | --- |
| `/` | 컬렉션 대시보드 |
| `/makecollection` | 새 컬렉션 생성 |
| `/collection/:id/:capId` | 컬렉션 상세 및 관리 |
| `/dev` | SDK 테스트 화면 |
| `/preview/:id` | 프리뷰/SDK 테스트 화면 |

## 시작하기

### 1. 의존성 설치

```bash
yarn install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 만들고 값을 채웁니다.

```env
VITE_BACKEND_URL=
VITE_PACKAGE_ID=
VITE_MODULE=
```

| 변수 | 설명 |
| --- | --- |
| `VITE_BACKEND_URL` | 컬렉션 API와 S3 presigned URL을 제공하는 백엔드 주소 |
| `VITE_PACKAGE_ID` | Sui Move package id |
| `VITE_MODULE` | 트랜잭션 target에 사용할 Move module 이름 |

### 3. 개발 서버 실행

```bash
yarn dev
```

기본 Vite 개발 서버는 `http://localhost:5173`에서 실행됩니다.

## 사용 가능한 스크립트

| 명령어 | 설명 |
| --- | --- |
| `yarn dev` | 개발 서버 실행 |
| `yarn build` | TypeScript 빌드와 Vite 프로덕션 빌드 |
| `yarn preview` | 빌드 결과 미리보기 |
| `yarn lint` | ESLint 검사 |
| `yarn format` | Prettier 포맷팅 |

## 참고 사항

- 온체인 트랜잭션은 `VITE_PACKAGE_ID`, `VITE_MODULE`이 없으면 실행되지 않습니다.
- 이미지 업로드는 백엔드의 `/s3/requestS3Permission` 엔드포인트가 필요합니다.
- 백엔드 컬렉션 API는 `${VITE_BACKEND_URL}/collections/collections` 경로를 기준으로 호출됩니다.
