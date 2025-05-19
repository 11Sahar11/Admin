// טיפול בטפסי הרשמה והתחברות
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const registerMsg = document.getElementById('register-message');
const loginMsg = document.getElementById('login-message');
const userArea = document.getElementById('user-area');
const userNameSpan = document.getElementById('user-name');
const userCoursesDiv = document.getElementById('user-courses');
const logoutBtn = document.getElementById('logout-btn');

const API = '/api';

// --- ולידציה לסיסמה חזקה ---
function isStrongPassword(password) {
    return password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password);
}

function showUserArea(user) {
    userArea.style.display = 'block';
    userNameSpan.textContent = user.email || user.name || '';
    registerForm.style.display = 'none';
    loginForm.style.display = 'none';
    showUserMenu(user);
    // טען קורסים של המשתמש
    fetch(`${API}/courses`, {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
    .then(res => res.json())
    .then(courses => {
        userCoursesDiv.innerHTML = '<h3>הקורסים שלך:</h3>' +
            courses.filter(c => (user.courses || []).includes(c._id)).map(c =>
                `<div class="user-course-card">
                    <b>${c.name}</b><br>
                    <span>${c.description || ''}</span><br>
                    ${c.downloadUrl ? `<a href="${c.downloadUrl}" class="download-btn" download>הורד קובץ</a>` : ''}
                </div>`
            ).join('') || '<div>אין לך קורסים כרגע.</div>';
    });
}

function hideUserArea() {
    userArea.style.display = 'none';
    registerForm.style.display = '';
    loginForm.style.display = '';
    userCoursesDiv.innerHTML = '';
    hideUserMenu();
}

// --- תפריט משתמש (dropdown) ---
const userMenu = document.getElementById('user-menu');
const userMenuBtn = document.getElementById('user-menu-btn');
const userMenuName = document.getElementById('user-menu-name');
const userDropdown = document.getElementById('user-dropdown');
const myCoursesLink = document.getElementById('my-courses-link');
const logoutLink = document.getElementById('logout-link');

function showUserMenu(user) {
    userMenu.style.display = 'flex';
    userMenuName.textContent = user.email || user.name || '';
}
function hideUserMenu() {
    userMenu.style.display = 'none';
    userMenuName.textContent = '';
}
userMenuBtn && userMenuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
    userMenuBtn.classList.toggle('active');
});
document.addEventListener('click', function(e) {
    if (userDropdown && userDropdown.style.display === 'block') {
        userDropdown.style.display = 'none';
        userMenuBtn.classList.remove('active');
    }
});
myCoursesLink && myCoursesLink.addEventListener('click', function(e) {
    e.preventDefault();
    userArea.scrollIntoView({behavior: 'smooth'});
    userDropdown.style.display = 'none';
    userMenuBtn.classList.remove('active');
});
logoutLink && logoutLink.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    hideUserArea();
    hideUserMenu();
});

registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    registerMsg.textContent = '';
    const data = Object.fromEntries(new FormData(registerForm));
    if (!isStrongPassword(data.password)) {
        registerMsg.style.color = '#e11d48';
        registerMsg.textContent = 'הסיסמה חייבת להיות לפחות 8 תווים, לכלול אות גדולה, אות קטנה, מספר ותו מיוחד.';
        return;
    }
    fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json().then(j => ({ok: res.ok, ...j})))
    .then(res => {
        if (res.ok) {
            registerMsg.style.color = 'green';
            registerMsg.textContent = 'נרשמת בהצלחה! אפשר להתחבר.';
            registerForm.reset();
        } else {
            registerMsg.style.color = '#e11d48';
            registerMsg.textContent = res.message || 'שגיאה בהרשמה';
        }
    });
});

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    loginMsg.textContent = '';
    const data = Object.fromEntries(new FormData(loginForm));
    fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json().then(j => ({ok: res.ok, ...j})))
    .then(res => {
        if (res.ok && res.token) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            loginMsg.style.color = 'green';
            loginMsg.textContent = 'התחברת בהצלחה!';
            showUserArea(res.user);
        } else {
            loginMsg.style.color = '#e11d48';
            loginMsg.textContent = res.message || 'שגיאה בהתחברות';
        }
    });
});

logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    hideUserArea();
});

// בדוק אם המשתמש כבר מחובר
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
        showUserArea(JSON.parse(user));
    }
}); 