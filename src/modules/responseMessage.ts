const message = {
  NULL_VALUE: "필요한 값이 없습니다.",
  NOT_FOUND: "존재하지 않는 자원",
  BAD_REQUEST: "잘못된 요청",
  INTERNAL_SERVER_ERROR: "서버 내부 오류",
  SUCCESS: "성공",
  CREATE_PUSH_SUCCESS: "푸시 알림 생성 성공",

  NULL_VALUE_TOKEN: "토큰만료",

  GET_COME_PUSH: "다가오는 알림 생성 성공",
  GET_TODAY_PUSH: "임박한 알림 조회",
  GET_LAST_PUSH: "지난 알림목록 조회",

  DELETE_BOOKMARK_SUCCESS: "즐겨찾기 취소 성공",
  UPDATE_BOOKMARK_SUCCESS: "즐겨찾기 추가 성공",

  BOOKMARK_ADD_ERROR: "북마크 추가 실패",
  BOOKMARK_DELETE_ERROR: "북마크 삭제 실패",

  PUSH_DATE_ERROR: "푸시알림 설정 날짜는 오늘 날짜 이후여야 합니다.",
  PUSH_TAG_ERROR: "푸시알림 대표 태그는 1개 이상 3개 이하여야 합니다.",
  BAD_REQUEST_UPDATE_TAG:
    "태그 업데이트는 일반 태그만 가능합니다. (플랫폼 태그 불가)",
  INVALID_TOKEN: "유효하지 않은 토큰",

  SUCCESS_GET_MAIN_TAG: "최근 추가한 태그, 자주 추가한 태그, 플랫폼 유형 태그 조회 성공",
  SUCCESS_GET_OFTEN_TAG: "자주 검색한 태그 조회 성공",
  SUCCESS_GET_TAGS: "태그앨범 조회 성공",
  SUCCESS_CHANGE_TAG: "태그명 수정 성공",


  ERROR_GET_MAIN_TAG: "최근 추가한 태그, 자주 추가한 태그, 플랫폼 유형 태그 조회 실패",
  ERROR_GET_OFTEN_TAG: "자주 검색한 태그 조회 실패",
  ERROR_GET_TAGS: "태그앨범 조회 실패",
  ERROR_CHANGE_TAG: "태그앨범 수정 실패",

};

export default message;
