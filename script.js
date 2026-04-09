const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');


themeToggle.addEventListener('click', () => {
    body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
    themeToggle.textContent = body.dataset.theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', body.dataset.theme);
    
    // 🎨 ANIMAÇÃO NOVA
    themeToggle.style.transform = 'scale(0.95)';
    setTimeout(() => themeToggle.style.transform = 'scale(1)', 150);
});

// Carrega tema salvo
const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
body.dataset.theme = savedTheme;
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';


hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});


const quoteBtn = document.getElementById('quote-btn');
const quoteContainer = document.getElementById('daily-quote');
const loadingSpinner = document.getElementById('loading-spinner');

quoteBtn?.addEventListener('click', getNewQuote);

async function getNewQuote() {
    showLoading();
    
    try {
        const response = await fetch('https://api.quotable.io/random?tags=programming');
        
        if (!response.ok) throw new Error('API falhou');
        
        const data = await response.json();
        displayQuote(data.content, data.author);
        
    } catch (error) {
        console.error('❌ Erro API:', error);
        // 🔧 TRATAMENTO DE ERRO
        displayQuote(
            'O melhor código é aquele que nunca é executado.',
            'Andrés Abreu'
        );
    } finally {
        hideLoading();
    }
}

function displayQuote(text, author) {
    quoteContainer.innerHTML = `
        <blockquote>"${text}"</blockquote>
        <cite>— ${author}</cite>
    `;
    
    quoteContainer.style.opacity = '0';
    quoteContainer.style.transform = 'translateY(20px)';
    setTimeout(() => {
        quoteContainer.style.transition = 'all 0.5s ease';
        quoteContainer.style.opacity = '1';
        quoteContainer.style.transform = 'translateY(0)';
    }, 100);
}


const searchInput = document.getElementById('project-search');
const projects = document.querySelectorAll('.project-card');
const searchFeedback = document.getElementById('search-feedback');

searchInput?.addEventListener('input', filterProjects);

function filterProjects() {
    const term = searchInput.value.toLowerCase();
    let count = 0;

    projects.forEach(project => {
        const title = project.querySelector('h3').textContent.toLowerCase();
        const desc = project.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(term) || desc.includes(term) || term === '') {
            project.style.display = 'block';
            project.style.opacity = '0';
            setTimeout(() => {
                project.style.transition = 'opacity 0.3s ease';
                project.style.opacity = '1';
            }, 10);
            count++;
        } else {
            project.style.opacity = '0';
            setTimeout(() => project.style.display = 'none', 300);
        }
    });

    // 📊 FEEDBACK VISUAL
    searchFeedback.textContent = count === 1 
        ? '1 projeto encontrado' 
        : `${count} projetos encontrados`;
}


function showLoading() {
    loadingSpinner.style.display = 'flex';
    quoteBtn.style.opacity = '0.6';
    quoteBtn.disabled = true;
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
    quoteBtn.style.opacity = '1';
    quoteBtn.disabled = false;
}


const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s ease';
    observer.observe(section);
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Portfolio carregado!');
    
    getNewQuote();
    
    filterProjects();
});