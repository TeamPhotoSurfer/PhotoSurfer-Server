# PhotoSurfer-Server


# ERD

![스크린샷 2022-07-13 오후 6.12.59.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c49a44fd-bbb1-4b36-a7fe-d2e044604dfb/스크린샷_2022-07-13_오후_6.12.59.png)

# 팀 별 역할 분담

<aside>
📌 민욱 - 로그인, API 구현

지원 - 푸시알림 , API 구현

지윤 - S3 리사이징, API 구현

</aside>

# commit, coding convention, branch 전략

### Commit

[✨ 커밋 규칙](https://www.notion.so/f3513f110d8c46c68ec45b7dee2f72f3)

## Coding Convention

### naming rule

|  | 명명법 | 기타 설명 |
| --- | --- | --- |
| DB이름 | snakeCase | 8자 이내 |
| 테이블 | 소문자 | 3단어, 26자 이내 |
| 컬럼 | snake 표기법 | 접미사로 컬럼 성질을 나타냄 |
| 파일명 | 카멜케이스 |  |
| 함수명 | 카멜케이스 | 동사로 시작 |
| 변수명 | 카멜케이스 | 상수의 경우 대문자+_ |
| 타입 | 파스칼케이스 | interface 이름에 I를 붙이지 않기 |
|  |  |  |

### 약속한 변수 name

| 한국어 | 영어 | 축약어 |
| --- | --- | --- |
| 사진 | photo |  |
| 유저 | user |  |
| 태그 | tag |  |
| ~인지 아닌지 | is~ |  |
| 배열을 담은 경우 | ~s (복수형) |  |
| 상태 | xxxStatus, status |  |
| 등 | createdAt, updatedAt |  |

## 브랜치 전략

- main: 배포를 위한 브랜치 (`최최최최종본`)
- develop: 기능 개발이 완료된 코드들이 모이는 곳(`검증된 곳이자 검증할 곳`)
- feature: 기능 개발을 위한 브랜치, 깃헙 이슈 사용 (ex. `feature/#12`)

# 프로젝트 폴더 구조

```
.
├── tsconfig.json
├── nodemone.json
├── package.json
└── src
    ├── config
    ├── controllers
    ├── component
    ├── Loaders
    ├── modules
    ├── routes
    ├── service
    └──  index.ts
```

# API

[BASEURL : http://3.35.27.148:8000](https://www.notion.so/e7faaf18bf9e47b081e6d1077fe36609)
