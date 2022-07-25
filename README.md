# PhotoSurfer-Server

# 서비스 핵심 기능 소개

![KakaoTalk_Photo_2022-07-22-18-43-14](https://user-images.githubusercontent.com/91375028/180412682-11e91ec2-b12b-4094-be14-25b0121313d1.png)

# ERD

<img width="527" alt="스크린샷 2022-07-22 오후 6 51 13" src="https://user-images.githubusercontent.com/91375028/180414095-6eb66ae8-b99b-4820-8586-2fcbbe7c9a86.png">

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

</br>

# Dependencies module ( package.json )

```
{
  "name": "node-typescript-init",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon",
    "build": "tsc && node dist",
    "test": "mocha test/*/* --timeout 10000 -exit -r ts-node/register",
    "prepare": "husky install"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/express": "^4.17.13",
    "@types/jsonwebtoken": "^8.5.8",
    "@types/mocha": "^9.1.1",
    "@types/multer": "^1.4.7",
    "@types/multer-s3": "^2.7.12",
    "@types/mysql": "^2.15.21",
    "@types/node": "^18.0.1",
    "@typescript-eslint/eslint-plugin": "^5.30.5",
    "@typescript-eslint/parser": "^5.30.5",
    "chai": "^4.3.6",
    "eslint": "^8.19.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-config-airbnb-typescript": "^17.0.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-import": "^2.26.0",
    "eslint-plugin-prettier": "^4.2.1",
    "husky": "^8.0.1",
    "mocha": "^10.0.0",
    "nodemon": "^2.0.18",
    "supertest": "^6.2.4",
    "ts-node": "^10.7.0",
    "typescript": "^4.6.3"
  },
  "dependencies": {
    "aws-sdk": "^2.1171.0",
    "axios": "^0.27.2",
    "dayjs": "^1.11.3",
    "dotenv": "^16.0.0",
    "express": "^4.18.1",
    "express-validator": "^6.14.0",
    "firebase-admin": "^11.0.0",
    "jsonwebtoken": "^8.5.1",
    "lodash": "^4.17.21",
    "logger": "^0.0.1",
    "multer": "^1.4.4",
    "multer-s3": "^2.10.0",
    "mysql": "^2.18.1",
    "mysql2": "^2.3.3",
    "node-schedule": "^2.1.0",
    "pg": "^8.7.3",
    "reflect-metadata": "^0.1.13",
    "typeorm": "^0.2",
    "typeorm-naming-strategies": "^2.0.0"
  }
}

```

# Server Architecture

<img width="563" alt="스크린샷 2022-07-22 오후 6 26 51" src="https://user-images.githubusercontent.com/91375028/180409581-65c2da16-e0a0-4dce-9b2c-9de323354e8e.png">

</br>
