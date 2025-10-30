(function() {
  'use strict';

  // 로그인 모달 HTML 생성
  function createLoginModal() {
    var modal = document.createElement('div');
    modal.id = 'swagger-login-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    `;

    var modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 30px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    modalContent.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #333; font-size: 24px;">로그인</h2>
        <button id="swagger-login-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
      </div>
      <form id="swagger-login-form">
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">이메일</label>
          <input type="email" id="swagger-login-email" required 
            style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;"
            placeholder="user@example.com">
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">비밀번호</label>
          <input type="password" id="swagger-login-password" required 
            style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;"
            placeholder="비밀번호를 입력하세요">
        </div>
        <div id="swagger-login-error" style="color: #d32f2f; font-size: 14px; margin-bottom: 15px; display: none;"></div>
        <div style="display: flex; gap: 10px;">
          <button type="submit" id="swagger-login-submit" 
            style="flex: 1; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: 500; cursor: pointer;">
            로그인
          </button>
          <button type="button" id="swagger-login-cancel" 
            style="flex: 1; padding: 12px; background: #f5f5f5; color: #333; border: none; border-radius: 4px; font-size: 16px; font-weight: 500; cursor: pointer;">
            취소
          </button>
        </div>
      </form>
    `;

    modal.appendChild(modalContent);
    return modal;
  }

  // 로그인 모달 표시
  function showLoginModal() {
    // 이미 모달이 있으면 표시만
    var existingModal = document.getElementById('swagger-login-modal');
    if (existingModal) {
      existingModal.style.display = 'flex';
      return;
    }

    var modal = createLoginModal();
    document.body.appendChild(modal);

    var form = document.getElementById('swagger-login-form');
    var emailInput = document.getElementById('swagger-login-email');
    var passwordInput = document.getElementById('swagger-login-password');
    var errorDiv = document.getElementById('swagger-login-error');
    var submitBtn = document.getElementById('swagger-login-submit');
    var closeBtn = document.getElementById('swagger-login-close');
    var cancelBtn = document.getElementById('swagger-login-cancel');

    // 폼 제출 처리
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      var email = emailInput.value.trim();
      var password = passwordInput.value;

      if (!email || !password) {
        showError('이메일과 비밀번호를 입력해주세요.');
        return;
      }

      // 로딩 상태
      submitBtn.disabled = true;
      submitBtn.textContent = '로그인 중...';
      errorDiv.style.display = 'none';

      // 로그인 API 호출
      fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      .then(function(response) {
        return response.json().then(function(data) {
          return { ok: response.ok, status: response.status, data: data };
        });
      })
      .then(function(result) {
        if (result.ok && result.data && result.data.accessToken) {
          // 성공: 토큰을 Swagger UI에 저장
          if (window.ui) {
            try {
              window.ui.preauthorizeApiKey('bearer', result.data.accessToken);
              localStorage.setItem('swagger-ui-auth-token', result.data.accessToken);
              console.log('로그인 성공! JWT 토큰이 자동으로 설정되었습니다.');
              
              // 모달 닫기
              hideLoginModal();
              
              // 성공 메시지 표시 (선택사항)
              showSuccessMessage('로그인이 성공적으로 완료되었습니다!');
            } catch (e) {
              console.error('토큰 설정 오류:', e);
              showError('토큰 설정 중 오류가 발생했습니다: ' + e.message);
            }
          } else {
            showError('Swagger UI가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
          }
        } else {
          // 실패: 에러 메시지 표시
          var errorMsg = result.data?.message || result.data?.error || '로그인에 실패했습니다.';
          if (result.status === 401) {
            errorMsg = '이메일 또는 비밀번호가 올바르지 않습니다.';
          } else if (result.status === 404) {
            errorMsg = '사용자를 찾을 수 없습니다.';
          }
          showError(errorMsg);
        }
      })
      .catch(function(error) {
        console.error('로그인 오류:', error);
        showError('로그인 중 오류가 발생했습니다: ' + error.message);
      })
      .finally(function() {
        submitBtn.disabled = false;
        submitBtn.textContent = '로그인';
      });
    });

    // 닫기 버튼
    function hideModal() {
      hideLoginModal();
    }
    
    closeBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);
    
    // 모달 외부 클릭 시 닫기
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        hideModal();
      }
    });

    // ESC 키로 닫기
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape' && document.getElementById('swagger-login-modal')) {
        hideModal();
        document.removeEventListener('keydown', escHandler);
      }
    });

    // 포커스 설정
    setTimeout(function() {
      emailInput.focus();
    }, 100);
  }

  function hideLoginModal() {
    var modal = document.getElementById('swagger-login-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  function showError(message) {
    var errorDiv = document.getElementById('swagger-login-error');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  }

  function showSuccessMessage(message) {
    // 간단한 성공 메시지 표시
    var successDiv = document.createElement('div');
    successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 15px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      z-index: 10001;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(function() {
      successDiv.remove();
    }, 3000);
  }

  // Swagger UI 로드 완료 후 자동으로 로그인 모달 표시
  function initAutoLogin() {
    // 토큰이 이미 있는지 확인
    var storedToken = localStorage.getItem('swagger-ui-auth-token');
    
    // Swagger UI 인스턴스 확인
    if (window.ui && typeof window.ui.getSystem === 'function') {
      try {
        var system = window.ui.getSystem();
        if (system && system.authSelectors) {
          var auth = system.authSelectors.authorized();
          var bearerAuth = auth && auth.bearer;
          
          // 토큰이 없으면 로그인 모달 표시
          if (!bearerAuth || !bearerAuth.value) {
            if (!storedToken) {
              setTimeout(showLoginModal, 500);
              return;
            }
          }
        }
      } catch (e) {
        console.log('Swagger UI auth check failed:', e);
      }
    }
    
    // Swagger UI가 아직 없어도 localStorage에 토큰이 없으면 모달 표시
    if (!storedToken) {
      setTimeout(showLoginModal, 1000);
    }
  }

  // 페이지 로드 완료 후 실행
  if (document.readyState === 'complete') {
    setTimeout(initAutoLogin, 1000);
  } else {
    window.addEventListener('load', function() {
      setTimeout(initAutoLogin, 1000);
    });
  }

  // Swagger UI가 동적으로 로드되는 경우를 대비
  var observer = new MutationObserver(function(mutations) {
    var authorizeBtn = document.querySelector('.btn.authorize');
    if (authorizeBtn) {
      var storedToken = localStorage.getItem('swagger-ui-auth-token');
      if (!storedToken && !document.getElementById('swagger-login-modal')) {
        setTimeout(initAutoLogin, 500);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // 401 에러 처리 (토큰 만료)
  var originalFetch = window.fetch;
  window.fetch = function() {
    var args = Array.prototype.slice.call(arguments);
    var url = args[0];
    
    return originalFetch.apply(this, args).then(function(response) {
      // 401 에러 처리 (토큰 만료)
      if (response.status === 401 && !url.includes('/auth/login')) {
        localStorage.removeItem('swagger-ui-auth-token');
        // 로그인 모달 재표시
        setTimeout(function() {
          showLoginModal();
        }, 500);
      }
      
      return response;
    });
  };
})();
