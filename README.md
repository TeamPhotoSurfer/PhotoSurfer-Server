# PhotoSurfer-Server

# ERD

<img width="465" alt="스크린샷 2022-07-13 오후 6 12 59" src="https://user-images.githubusercontent.com/49470328/178700118-7c939d67-e917-4918-892e-91c232a4e66b.png">

# 팀 별 역할 분담

<aside>
    
📌 민욱 - 로그인, API 구현.

📌 지원 - 푸시알림 , API 구현

📌 지윤 - S3, API 구현

</aside>

# commit, coding convention, branch 전략

### Commit

| type       | 설명                                                          |
| ---------- | ------------------------------------------------------------- |
| [INIT]     | 작업 세팅 커밋                                                |
| [FEAT]     | 새로운 기능에 대한 커밋                                       |
| [STYLE]    | 기능에 영향을 주지 않는 커밋, 코드 순서 등의 포맷에 관한 커밋 |
| [FIX]      | 버그 수정에 대한 커밋                                         |
| [REFACTOR] | 코드 리팩토링에 대한 커밋                                     |
| [CHORE]    | 그 외 자잘한 수정에 대한 커밋                                 |
| [DOCS]     | 문서 수정                                                     |
| [ADD]      | 파일 추가                                                     |
| [CONFIG]   | 환경 설정                                                     |

## Coding Convention

### naming rule

|        | 명명법       | 기타 설명                        |
| ------ | ------------ | -------------------------------- |
| DB이름 | snakeCase    | 8자 이내                         |
| 테이블 | 소문자       | 3단어, 26자 이내                 |
| 컬럼   | snake 표기법 | 접미사로 컬럼 성질을 나타냄      |
| 파일명 | 카멜케이스   |                                  |
| 함수명 | 카멜케이스   | 동사로 시작                      |
| 변수명 | 카멜케이스   | 상수의 경우 대문자+\_            |
| 타입   | 파스칼케이스 | interface 이름에 I를 붙이지 않기 |
|        |              |                                  |

### 약속한 변수 name

| 한국어           | 영어                 |
| ---------------- | -------------------- |
| 사진             | photo                |
| 유저             | user                 |
| 태그             | tag                  |
| ~인지 아닌지     | is~                  |
| 배열을 담은 경우 | ~s (복수형)          |
| 상태             | xxxStatus, status    |
| 등               | createdAt, updatedAt |

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
└── test
```

# API

[BASEURL : http://3.35.27.148:8000](https://go-photosurfer.notion.site/API-a4b228282bcb49399413efc03552c1d1)

### API 문서 및 로직 구현 진척도

https://documenter.getpostman.com/view/15709068/UzR1J1yU

https://go-photosurfer.notion.site/API-a4b228282bcb49399413efc03552c1d1
