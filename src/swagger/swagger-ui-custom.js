(function () {
  'use strict';

  // 로그인 API 호출 후 자동 토큰 설정
  var originalFetch = window.fetch;
  window.fetch = function () {
    var args = Array.prototype.slice.call(arguments);
    var url = args[0];

    return originalFetch.apply(this, args).then(function (response) {
      // 로그인 엔드포인트 호출 확인
      if (
        typeof url === 'string' &&
        url.includes('/auth/login') &&
        response.ok
      ) {
        response
          .clone()
          .json()
          .then(function (data) {
            if (data && data.accessToken) {
              // Swagger UI에 토큰 자동 설정
              if (window.ui) {
                try {
                  window.ui.preauthorizeApiKey('bearer', data.accessToken);
                  // localStorage에 저장
                  localStorage.setItem(
                    'swagger-ui-auth-token',
                    data.accessToken,
                  );
                  console.log('JWT 토큰이 자동으로 설정되었습니다.');
                } catch (e) {
                  console.error('토큰 설정 오류:', e);
                }
              }
            }
          })
          .catch(function (e) {
            console.error('로그인 응답 파싱 오류:', e);
          });
      }

      return response;
    });
  };
})();
