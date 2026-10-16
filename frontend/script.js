document.addEventListener('DOMContentLoaded', () => {
    //fecha actual
    const date = document.getElementById('fecha-actual');
    const today = new Date();
    const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    const day = today.getDate();
    const mounth = months[today.getMonth()];
    const year = today.getFullYear();
    const dateText = `${day} ${mounth}, ${year}`;
    if (date) {
        date.textContent = dateText;
    }

    const token = localStorage.getItem('token');
    const authGroup = document.getElementById('auth-buttons-group');

    if (token && authGroup) {
        const username = localStorage.getItem('username') || localStorage.getItem('userEmail');
        
        //oculatamos botones y mostramos al username
        authGroup.innerHTML = `
            <div class="user-profile-menu">
                <span class="user-icon">
                    <img src="assets/user-icon.svg">
                </span>
                <span class="user-name">${username}</span>
                <button onclick="logout()" class="logout-btn">Salir</button>
            </div>
        `;
    }

    //cargar las noticas
    const newsContainer = document.getElementById('news-container');
    const wantCategory = newsContainer ? newsContainer.getAttribute('data-category') : null;

    loadNews(wantCategory);
    loadDetailNews();
});

//login
async function login(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('pw').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', data.user.email);
            localStorage.setItem('username', data.user.username);
            window.location.href = '../index.html';
        } 
        else {
            alert(data.message || 'Error al iniciar sesión');
        }
    } 
    catch (err) {
        console.error('Error:', err);
        alert('Error al conectar con el servidor backend.');
    }
}

//register
async function register(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('pw').value;
    const confirmPassword = document.getElementById('pw-confirm').value;
    
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, username })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Registro exitoso! Iniciando sesión...');
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', data.user.email);
            localStorage.setItem('username', data.user.username);
            window.location.href = '../index.html';
        } 
        else {
            alert(data.message || 'Error al registrar el usuario');
        }
    } 
    catch (err) {
        console.error('Error:', err);
        alert('Error al conectar con el servidor backend.');
    }
}

//logout
window.logout = () => {
    if (window.confirm("¿Seguro que desea cerrar sesión?")) {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('username');
        window.location.reload();
    }
};

//buscar noticias
window.search = () => {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    if (!query) return;
    const articles = document.querySelectorAll('.news-article');
    articles.forEach(article => {
        const title = article.querySelector('h2').textContent.toLowerCase();
        article.style.display = title.includes(query) ? 'block' : 'none';
    });
};

//load the news:
async function loadNews(category = null) {
    const container = document.getElementById('news-container');
    if (!container) return;

    try {
        const response = await fetch('/api/news');
        const newsList = await response.json();

        if (response.ok) {
            container.innerHTML = '';

            if (newsList.length === 0) {
                container.innerHTML = '<p style="text-align: center; width: 100%;">No hay novedades registradas.</p>';
                return;
            }

            //filtrado:
            let filteredNews = newsList;

            if (category === 'Novedad') {
                filteredNews = newsList.filter(item => item.categoria === 'Novedad');
            }
            else if (category === 'Aplicacion') {
                filteredNews = newsList.filter(item => item.categoria === 'Tecnologia' || item.categoria === 'Programas');
            }
            if (filteredNews.length === 0) {
                container.innerHTML = '<p style="text-align: center; width: 100%;">No hay novedades en esta sección.</p>';
                return;
            }

            filteredNews.forEach(item => {
                const article = document.createElement('article');
                article.className = 'news-article';
                article.innerHTML = `
                    <a href="new.html?id=${item._id}" style="text-decoration: none; color: inherit;">
                        <img src="${item.img}" alt="${item.titulo}">
                        <span class="category-badge">${item.categoria}</span>
                        <h2>${item.titulo}</h2>
                        <p>Por ${item.autor}</p>
                    </a>
                `;
                container.appendChild(article);
            });
        }
    } catch (err) {
        console.error('Error al cargar noticias:', err);
    }
}

//cargar detalle de noticia
async function loadDetailNews() {
    const titleEl = document.getElementById('new-title');
    if (!titleEl) return;

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        titleEl.textContent = 'Noticia no especificada';
        return;
    }

    try {
        const response = await fetch(`/api/news/${id}`);
        const item = await response.json();

        if (response.ok) {
            document.getElementById('new-title').textContent = item.titulo;
            document.getElementById('new-author').textContent = item.autor;
            document.getElementById('new-category').textContent = item.categoria;
            document.getElementById('new-image').src = item.img;
            document.getElementById('new-image').alt = item.titulo;
            document.getElementById('new-description').textContent = item.descripcion;
            
            const fecha = new Date(item.createdAt);
            document.getElementById('new-date').textContent = fecha.toLocaleDateString('es-ES');
        } else {
            titleEl.textContent = 'Error: Noticia no encontrada';
        }
    } catch (err) {
        console.error('Error al cargar la noticia:', err);
        titleEl.textContent = 'Error al conectar con el servidor';
    }
}
