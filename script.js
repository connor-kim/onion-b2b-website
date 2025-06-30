/* ==========================================
   깐깐 농산물 - JavaScript
   ========================================== */

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 모든 기능 초기화
    initNavigation();
    initHeroSlider();
    initStatsAnimation();
    initMarketPrice();
    initConsultationForm();
    initScrollAnimations();
    initSmoothScroll();
});

/* ==========================================
   네비게이션 기능
   ========================================== */

function initNavigation() {
    // 스크롤시 헤더 스타일 변경
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }
    });
}

/* ==========================================
   히어로 슬라이더 기능
   ========================================== */

function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const slideButtons = document.querySelectorAll('.slide-btn');
    let currentSlide = 0;
    const slideInterval = 5000; // 5초
    
    if (slides.length === 0) return;
    
    // 슬라이드 변경 함수
    function changeSlide(index) {
        // 현재 활성 슬라이드 비활성화
        slides[currentSlide].classList.remove('active');
        if (slideButtons[currentSlide]) {
            slideButtons[currentSlide].classList.remove('active');
        }
        
        // 새 슬라이드 활성화
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        if (slideButtons[currentSlide]) {
            slideButtons[currentSlide].classList.add('active');
        }
    }
    
    // 다음 슬라이드로 자동 진행
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        changeSlide(next);
    }
    
    // 슬라이드 버튼 클릭 이벤트
    slideButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => changeSlide(index));
    });
    
    // 자동 슬라이드 시작
    setInterval(nextSlide, slideInterval);
}

/* ==========================================
   통계 애니메이션
   ========================================== */

function initStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;
    
    function animateStats() {
        if (animated) return;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const increment = target / 50; // 50단계로 나누어 애니메이션
            let current = 0;
            
            stat.classList.add('counting');
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // 숫자 포맷팅 (1000 단위 콤마)
                stat.textContent = Math.floor(current).toLocaleString();
            }, 40);
        });
        
        animated = true;
    }
    
    // 스크롤시 통계 섹션이 보이면 애니메이션 시작
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
            }
        });
    });
    
    const statsSection = document.getElementById('partners-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

/* ==========================================
   시세 정보 & 차트
   ========================================== */

function initMarketPrice() {
    // 더미 시세 데이터
    const priceData = {
        current: {
            special: 45000,
            high: 42000,
            medium: 38000,
            updateTime: new Date().toLocaleString('ko-KR')
        },
        weekly: [
            { date: '06-24', special: 43000, high: 40000, medium: 36000 },
            { date: '06-25', special: 44000, high: 41000, medium: 37000 },
            { date: '06-26', special: 42000, high: 39000, medium: 35000 },
            { date: '06-27', special: 45000, high: 42000, medium: 38000 },
            { date: '06-28', special: 46000, high: 43000, medium: 39000 },
            { date: '06-29', special: 45000, high: 42000, medium: 38000 },
            { date: '06-30', special: 45000, high: 42000, medium: 38000 }
        ]
    };
    
    // 현재 시세 업데이트
    updateCurrentPrice(priceData.current);
    
    // 차트 생성
    createPriceChart(priceData.weekly);
}

function updateCurrentPrice(data) {
    const specialPrice = document.getElementById('price-special');
    const highPrice = document.getElementById('price-high');
    const mediumPrice = document.getElementById('price-medium');
    const updateTime = document.getElementById('update-time');
    
    if (specialPrice) specialPrice.textContent = data.special.toLocaleString();
    if (highPrice) highPrice.textContent = data.high.toLocaleString();
    if (mediumPrice) mediumPrice.textContent = data.medium.toLocaleString();
    if (updateTime) updateTime.textContent = data.updateTime;
}

function createPriceChart(data) {
    const ctx = document.getElementById('priceChart');
    if (!ctx || !window.Chart) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.date),
            datasets: [
                {
                    label: '특급',
                    data: data.map(item => item.special),
                    borderColor: '#2E7D32',
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: '상급',
                    data: data.map(item => item.high),
                    borderColor: '#FF8F00',
                    backgroundColor: 'rgba(255, 143, 0, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: '중급',
                    data: data.map(item => item.medium),
                    borderColor: '#757575',
                    backgroundColor: 'rgba(117, 117, 117, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2.5,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + '원';
                        }
                    }
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            }
        }
    });
}

/* ==========================================
   상담 신청 폼
   ========================================== */

function initConsultationForm() {
    const form = document.getElementById('consultation-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // 유효성 검사
        if (!validateForm(data)) {
            return;
        }
        
        // 로딩 상태 표시
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> 처리중...';
        submitBtn.disabled = true;
        
        // 서버 전송 시뮬레이션
        setTimeout(() => {
            // 성공 메시지 표시
            showMessage('상담 신청이 완료되었습니다. 24시간 내에 연락드리겠습니다.', 'success');
            
            // 폼 초기화
            form.reset();
            
            // 버튼 복원
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
        }, 2000);
    });
}

function validateForm(data) {
    const required = ['company', 'name', 'phone', 'business-type'];
    const errors = [];
    
    // 필수 필드 검사
    required.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors.push(`${getFieldLabel(field)}는 필수 입력 항목입니다.`);
        }
    });
    
    // 전화번호 형식 검사
    if (data.phone && !isValidPhone(data.phone)) {
        errors.push('올바른 전화번호 형식을 입력해주세요.');
    }
    
    // 이메일 형식 검사
    if (data.email && !isValidEmail(data.email)) {
        errors.push('올바른 이메일 형식을 입력해주세요.');
    }
    
    if (errors.length > 0) {
        showMessage(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

function getFieldLabel(field) {
    const labels = {
        'company': '회사명',
        'name': '담당자명',
        'phone': '연락처',
        'business-type': '업종'
    };
    return labels[field] || field;
}

function isValidPhone(phone) {
    const phoneRegex = /^[\d-+().\s]+$/;
    return phoneRegex.test(phone) && phone.length >= 10;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(message, type) {
    // 기존 메시지 제거
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 새 메시지 생성
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = message;
    
    // 폼 위에 삽입
    const form = document.getElementById('consultation-form');
    if (form) {
        form.insertBefore(messageDiv, form.firstChild);
    }
    
    // 3초 후 자동 제거
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
    
    // 메시지 위치로 스크롤
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ==========================================
   스크롤 애니메이션
   ========================================== */

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
            }
        });
    }, observerOptions);
    
    // 애니메이션 대상 요소들
    const animateElements = document.querySelectorAll('.stat-item, .solution-item, .consultation-form');
    animateElements.forEach(el => observer.observe(el));
}

/* ==========================================
   부드러운 스크롤
   ========================================== */

function initSmoothScroll() {
    // 앵커 링크 클릭시 부드러운 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ==========================================
   유틸리티 함수들
   ========================================== */

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}