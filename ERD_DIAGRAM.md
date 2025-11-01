# 데이터베이스 모델 관계 다이어그램

## 전체 ERD 다이어그램

```
┌─────────────────┐
│     Admin       │
│  (독립 모델)    │
└─────────────────┘

┌─────────────────┐
│EmailVerification│
│  (독립 모델)    │
└─────────────────┘

┌─────────────────┐
│InstitutionConfig│
│  (독립 모델)    │
└─────────────────┘

                    ┌─────────────────────────────────────┐
                    │            User                     │
                    │  (사용자 - 핵심 엔티티)            │
                    └─────────────────────────────────────┘
                              │
                              │ 1:N (승인 관계)
                              │◄────────────────────┐
                              │                     │
                    ┌─────────┴─────────┐          │
                    │                   │          │
                    │ 1:1               │ 1:N      │
                    │                   │          │
        ┌───────────▼───────────┐   ┌───▼──────────┐
        │   DiseaseHistory     │   │ HealthCheckup│
        │  (질병 이력)         │   │ (건강검진)   │
        └──────────────────────┘   └──────────────┘
                    │
                    │ 1:1
                    │
        ┌───────────▼───────────┐
        │  UserInterestGroup    │
        │  (사용자 관심 그룹)   │
        └───────────────────────┘
                    │
                    │ N:1
                    │
        ┌───────────▼───────────────────────────┐
        │    LearningContentGroup               │
        │    (학습 콘텐츠 그룹)                │
        └───────────────────────────────────────┘
                    │
                    │ 1:N
                    │
        ┌───────────▼───────────┐
        │       Topic           │
        │    (주제/토픽)        │
        └───────────────────────┘
                    │
                    │ 1:N
                    │
        ┌───────────▼───────────┐
        │      Content          │
        │    (콘텐츠 단위)      │
        └───────────────────────┘
                    │
                    │ 1:N
                    │
        ┌───────────▼───────────┐
        │        Step           │
        │    (학습 단계)        │
        └───────────────────────┘
                    │
                    │ 1:N
                    │
        ┌───────────▼───────────┐
        │   StepContentItem     │
        │  (단계별 콘텐츠 항목) │
        └───────────────────────┘


                    ┌─────────────────────────────────────┐
                    │            User                     │
                    └─────────────────────────────────────┘
                              │
                              │ 1:N
                              │
        ┌─────────────────────▼─────────────────────┐
        │     UserLearningProgress                   │
        │     (사용자 학습 진행도)                  │
        └───────────────────────────────────────────┘
                    │         │         │
                    │         │         │
                    │ N:1     │ N:1     │ N:1
                    │         │         │
        ┌───────────┴──────────┴─────────┴──────────┐
        │           │         │         │           │
        │           │         │         │           │
┌───────▼──────┐ ┌──▼────┐ ┌─▼────┐ ┌─▼────┐ ┌───▼──────────┐
│LearningContent│ │ Topic │ │Content│ │ Step │ │DailyLearning │
│    Group      │ │       │ │       │ │      │ │   Session    │
└───────────────┘ └───────┘ └───────┘ └──────┘ └──────────────┘
                    │                                      │
                    │                                      │
                    │ 1:N                                  │ N:1
                    │                                      │
                    └──────────────────────────────────────┘
```

## 모델 설명

### 1. 독립 모델 (관계 없음)

#### Admin (관리자)

- 관리자 계정 정보
- 독립적으로 존재하며 다른 모델과 직접적인 관계 없음

#### EmailVerification (이메일 인증)

- 이메일 인증 코드 관리
- 독립적으로 존재

#### InstitutionConfig (기관 설정)

- 기관별 설정 정보 (포인트 풀, 이메일 형식 등)
- 독립적으로 존재

### 2. 사용자 관련 모델

#### User (사용자) - 핵심 엔티티

- 모든 사용자 정보를 관리하는 중심 모델
- **관계:**
  - **자기 참조 (Self-relation)**:
    - `approvedBy` / `approvedUsers`: 사용자가 다른 사용자를 승인하는 관계 (관리자 기능)
  - **1:1 관계:**
    - `DiseaseHistory`: 사용자당 1개의 질병 이력
    - `UserInterestGroup`: 사용자당 1개의 관심 그룹
  - **1:N 관계:**
    - `HealthCheckups`: 사용자당 여러 개의 건강검진 기록
    - `learningProgress`: 사용자당 여러 개의 학습 진행도 (그룹별)
    - `dailyLearningSessions`: 사용자당 여러 개의 일일 학습 세션

#### DiseaseHistory (질병 이력)

- 사용자의 만성질환, 호흡기질환, 관절염, 암 이력 등
- User와 1:1 관계 (사용자당 1개)

#### HealthCheckup (건강검진)

- 체격, 혈압, 콜레스테롤, 간 기능 등 건강검진 데이터
- User와 N:1 관계 (사용자당 여러 기록)

### 3. 학습 콘텐츠 계층 구조

#### LearningContentGroup (학습 콘텐츠 그룹)

- 학습 콘텐츠의 최상위 단위
- **관계:**
  - `topics`: 그룹 내 여러 주제들 (1:N)
  - `userInterestGroups`: 관심 그룹으로 선택한 사용자들 (1:N)
  - `learningProgress`: 이 그룹의 학습 진행도 (1:N)
  - `dailyLearningSessions`: 이 그룹의 일일 학습 세션 (1:N)

#### Topic (주제)

- LearningContentGroup 내의 주제
- **관계:**
  - `learningContentGroup`: 속한 그룹 (N:1)
  - `contents`: 주제 내 여러 콘텐츠들 (1:N)
  - `userProgressAsCurrent`: 현재 이 주제를 학습 중인 진행도 (N:1)

#### Content (콘텐츠)

- Topic 내의 콘텐츠 단위
- **관계:**
  - `topic`: 속한 주제 (N:1)
  - `steps`: 콘텐츠 내 여러 단계들 (1:N)
  - `userProgressAsCurrent`: 현재 이 콘텐츠를 학습 중인 진행도 (N:1)

#### Step (학습 단계)

- Content 내의 세부 학습 단계
- **관계:**
  - `content`: 속한 콘텐츠 (N:1)
  - `contentItems`: 단계 내 여러 콘텐츠 항목들 (1:N)
  - `userProgressAsCurrent`: 현재 이 단계를 학습 중인 진행도 (N:1)

#### StepContentItem (단계별 콘텐츠 항목)

- Step 내의 실제 콘텐츠 아이템 (텍스트, 이미지, 입력 필드 등)
- ContentItemType enum으로 타입 구분 (SPEECH_BUBBLE, TEXT, IMAGE, DATE, LABEL_TEXT_FIELD, CHECKBOX, QNA)
- Step과 N:1 관계

**계층 구조: LearningContentGroup → Topic → Content → Step → StepContentItem**

### 4. 사용자 학습 진행 관리

#### UserInterestGroup (사용자 관심 그룹)

- 사용자가 선택한 관심 학습 그룹
- User와 LearningContentGroup을 연결하는 중간 테이블
- User와 1:1, LearningContentGroup과 N:1 관계

#### UserLearningProgress (사용자 학습 진행도)

- 사용자가 특정 학습 그룹에서 어디까지 학습했는지 추적
- **관계:**
  - `user`: 학습하는 사용자 (N:1)
  - `learningContentGroup`: 학습 중인 그룹 (N:1)
  - `currentTopic`: 현재 학습 중인 주제 (N:1, optional)
  - `currentContent`: 현재 학습 중인 콘텐츠 (N:1, optional)
  - `currentStep`: 현재 학습 중인 단계 (N:1, optional)
  - `dailyLearningSessions`: 이 진행도에 대한 일일 학습 세션들 (1:N)
- **제약:** (userId, learningContentGroupId) 유니크 제약

#### DailyLearningSession (일일 학습 세션)

- 사용자가 특정 그룹에서 하루 동안의 학습 활동 기록
- **관계:**
  - `user`: 학습한 사용자 (N:1)
  - `learningContentGroup`: 학습한 그룹 (N:1)
  - `userProgress`: 연결된 학습 진행도 (N:1)
- **제약:** (userId, learningContentGroupId, sessionDate) 유니크 제약

## 주요 특징

1. **계층적 학습 구조**: LearningContentGroup → Topic → Content → Step → StepContentItem으로 5단계 계층 구조
2. **사용자 중심 설계**: User 모델이 모든 사용자 관련 데이터의 중심
3. **학습 진행도 추적**: UserLearningProgress로 현재 학습 위치를 Topic/Content/Step 단위로 추적
4. **일일 학습 기록**: DailyLearningSession으로 매일의 학습 활동을 기록
5. **소프트 삭제**: 주요 모델(User, LearningContentGroup, Topic, Content, Step, StepContentItem)에 deletedAt 필드로 소프트 삭제 지원
6. **Cascade 삭제**: 대부분의 관계에서 부모 삭제 시 자식도 함께 삭제되도록 설정
