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

    //cargar los posts
    const postsContainer = document.getElementById('posts-container');
    const wantCategory = postsContainer ? postsContainer.getAttribute('data-category') : null;

    loadPosts(wantCategory);
    loadDetailPost();
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

            if (filteredPosts.length === 0) {
                container.innerHTML = '<p style="text-align: center; width: 100%;">No hay publicaciones en esta sección.</p>';
                return;
            }

            filteredPosts.forEach(item => {
                const article = document.createElement('article');
                article.className = 'post-article';
                article.innerHTML = `
                    <a href="new.html?id=${item.id}" style="text-decoration: none; color: inherit;">
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
