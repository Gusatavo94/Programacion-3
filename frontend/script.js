document.addEventListener('DOMContentLoaded', () => {
    loadHeader();

    //cargamos los posts
    const postsContainer = document.getElementById('posts-container');
    const wantCategory = postsContainer ? postsContainer.getAttribute('data-category') : null;

    loadPosts(wantCategory);
    loadDetailPost();
});

async function loadHeader() {
    const container = document.getElementById('header-container');
    if (!container) return;

    try {
        const response = await fetch('/components/header.html');
        if (!response.ok) return;

        //inyectamos el header
        container.innerHTML = await response.text();

        //verificamos si hay usuario logueado
        const user = getCurrentUser();
        const authGroup = document.getElementById('auth-buttons-group');
        if (user && authGroup) {
            authGroup.innerHTML = `
                <div class="user-profile-menu">
                    <span class="user-icon">
                        <img src="/assets/user-icon.svg">
                    </span>
                    <span class="user-name">${user.username}</span>
                    <button onclick="logout()" class="logout-btn">Salir</button>
                </div>
            `;
        }
    } catch (err) {
        console.error('Error cargando el header:', err);
    }
}

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
            saveSession(data.token, data.user);
            window.location.href = '/index.html';
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
            saveSession(data.token, data.user);
            window.location.href = '/index.html';
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
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    }
};

// crear posts
async function createPost(event){
    event.preventDefault();

    //validaciones:
    const user = getCurrentUser();
    const token = getToken();

    if (!user || !token) {
        alert("Primero Logeate");
        return;
    }

    //datos del post | trim es para evitar espacios vacios
    const title = document.getElementById('title').value.trim();
    const imageUrl = document.getElementById('image-url').value.trim();
    const content = document.getElementById('content').value.trim();
    const category = document.getElementById('category').value.trim();

    //validaciones
    if (!title || !imageUrl || !content || !category) {
        alert("Todos los campos son obligatorios");
        return;
    }

    //hacemos el fetch
    const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            user_id: user.id,
            title: title,
            content: content,
            image: imageUrl,
            category: category
        })
    });

    const data = await response.json();

    if (response.ok) {
        alert("Post creado exitosamente");
        window.location.href = '/index.html';
    }
    else if (response.status === 400) { //validacion de mensaje
        alert(data.message);
    }
    else {
        alert("Error al crear el post");
    }
}

//buscar post
window.search = () => {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    if (!query) return;
    const articles = document.querySelectorAll('.post-article');
    articles.forEach(article => {
        const title = article.querySelector('h2').textContent.toLowerCase();
        article.style.display = title.includes(query) ? 'block' : 'none';
    });
};

//cargar posts
async function loadPosts(category = null) {
    const container = document.getElementById('posts-container');
    if (!container) return;

    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();

        if (response.ok) {
            container.innerHTML = '';

            if (posts.length === 0) {
                container.innerHTML = '<p style="text-align: center; width: 100%;">No hay publicaciones registradas.</p>';
                return;
            }

            //filtrado:
            let filteredPosts = posts;

            if (category === 'Novedad') {
                filteredPosts = posts.filter(item => item.category === 'Novedad');
            }
            else if (category === 'Aplicacion') {
                filteredPosts = posts.filter(item => item.category === 'Tecnologia' || item.category === 'Programas');
            }
            else if (category === 'Tus Posts') {
                const user = getCurrentUser();
                if (!user) {
                    container.innerHTML = '<p style="text-align: center; width: 100%;">Debes <a href="/pages/auth/login.html">iniciar sesión</a> para ver tus publicaciones.</p>';
                    return;
                }
                filteredPosts = posts.filter(item => Number(item.user_id) === Number(user.id));
            }

            if (filteredPosts.length === 0) {
                container.innerHTML = '<p style="text-align: center; width: 100%;">No hay publicaciones en esta sección.</p>';
                return;
            }

            filteredPosts.forEach(item => {
                const article = document.createElement('article');
                article.className = 'post-article';
                article.innerHTML = `
                    <a href="/pages/new.html?id=${item.id}" style="text-decoration: none; color: inherit;">
                        <img src="${item.image}" alt="${item.title}">
                        <span class="category-badge">${item.category}</span>
                        <h2>${item.title}</h2>
                        <p>Por usuario #${item.user_id}</p>
                    </a>
                `;
                container.appendChild(article);
            });
        }
    } catch (err) {
        console.error('Error al cargar posts:', err);
    }
}

//cargar detalle de post
async function loadDetailPost() {
    const titleEl = document.getElementById('new-title');
    if (!titleEl) return;

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        titleEl.textContent = 'Post no especificado';
        return;
    }

    try {
        const response = await fetch(`/api/posts/${id}`);
        const item = await response.json();
        if (response.ok) {
            document.getElementById('new-title').textContent = item.title;
            document.getElementById('new-author').textContent = `Usuario #${item.user_id}`;
            document.getElementById('new-category').textContent = item.category;
            document.getElementById('new-image').src = item.image;
            document.getElementById('new-image').alt = item.title;
            document.getElementById('new-description').textContent = item.content;
            
            const fecha = new Date(item.created_at);
            document.getElementById('new-date').textContent = fecha.toLocaleDateString('es-ES');
        }
        else {
            titleEl.textContent = 'Error: Post no encontrado';
        }
    }
    catch (err) {
        console.error('Error al cargar el post:', err);
        titleEl.textContent = 'Error al conectar con el servidor';
    }
}

//helpers:
function saveSession(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

function getToken() {
    return localStorage.getItem('token');
}

function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function isAuthenticated() {
    return !!getToken();
}
