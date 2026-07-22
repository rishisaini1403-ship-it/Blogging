const SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'HTML/CSS',
  'Git', 'Linux', 'PostgreSQL'
];

const POSTS = [
  {
    id: 'harish-first-blog',
    title: 'My First Blog Post',
    date: 'July 22, 2026',
    excerpt: 'Welcome to my blog. A quick intro to why I write and what to expect.',
    file: 'posts/Harish_first_blog.md'
  }
];

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const skillsGrid = $('#skills-grid');
const postList = $('#post-list');
const postView = $('#post-view');

// === THREE.JS 3D BACKGROUND ===

(function initThree() {
  const isMobile = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  if (isMobile || prefersReducedMotion || saveData) return;

  (async () => {
    try {
      const THREE = await import('three');

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x0a0a0a, 0);

      const canvas = renderer.domElement;
      Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '0',
        pointerEvents: 'none'
      });
      document.body.prepend(canvas);

      const sphereGeo = new THREE.IcosahedronGeometry(1.8, 1);
      const sphereMat = new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0x6366f1,
        transparent: true,
        opacity: 0.2
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(sphere);

      const particleCount = 1500;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 30;
      }
      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.025,
        color: 0x6366f1,
        transparent: true,
        opacity: 0.4
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      camera.position.z = 4.5;

      let mouseX = 0, mouseY = 0;
      let targetX = 0, targetY = 0;

      document.addEventListener('mousemove', e => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      });

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      function animate() {
        requestAnimationFrame(animate);

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        sphere.rotation.x += 0.003 + targetY * 0.01;
        sphere.rotation.y += 0.005 + targetX * 0.01;

        particles.rotation.y += 0.0003;
        particles.rotation.x += 0.0001;

        renderer.render(scene, camera);
      }
      animate();
    } catch {
      // Three.js unavailable — background stays solid
    }
  })();
})();

// === CURSOR GLOW ===

(function initCursor() {
  const glow = $('#cursor-glow');
  if (!glow) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;
    glow.style.left = currentX + 'px';
    glow.style.top = currentY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
})();

// === MAGNETIC BUTTONS ===

(function initMagnetic() {
  $$('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

// === SCROLL-TRIGGERED ANIMATIONS ===

(function initScrollAnimations() {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  $$('.section').forEach(s => sectionObserver.observe(s));

  const staggerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.skill, .blog-card');
        items.forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 50);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const skillsSection = $('#skills');
  const blogSection = $('#blog');
  if (skillsSection) staggerObserver.observe(skillsSection);
  if (blogSection) staggerObserver.observe(blogSection);
})();

// === RENDER SKILLS ===

function renderSkills() {
  if (!skillsGrid) return;
  skillsGrid.innerHTML = SKILLS.map(s => '<span class="skill">' + s + '</span>').join('');
}

// === BLOG ===

function renderBlog() {
  if (!postList) return;
  postList.innerHTML = POSTS.map(p =>
    '<a href="#/post/' + p.id + '" class="blog-card">' +
      '<h3>' + p.title + '</h3>' +
      '<div class="blog-date">' + p.date + '</div>' +
      '<div class="blog-excerpt">' + p.excerpt + '</div>' +
    '</a>'
  ).join('');
}

async function showPost(id) {
  const post = POSTS.find(p => p.id === id);
  if (!post) { showBlogList(); return; }
  postList.hidden = true;
  postView.hidden = false;
  document.title = post.title + ' — Harish';

  if (!window.marked) {
    postView.innerHTML = '<p>Markdown renderer unavailable. Try refreshing.</p>';
    return;
  }

  try {
    const res = await fetch(post.file);
    if (!res.ok) throw new Error('Post not found');
    const md = await res.text();
    postView.innerHTML =
      '<a href="#/" class="back-link">&larr; Back to posts</a><hr>' +
      window.marked.parse(md);
  } catch (e) {
    postView.innerHTML = '<p>Error: ' + e.message + '</p><a href="#/" class="back-link">Go back</a>';
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showBlogList() {
  postList.hidden = false;
  postView.hidden = true;
  document.title = 'Harish — Developer';
}

// === ROUTER ===

function router() {
  const hash = location.hash.slice(1) || '/';
  if (hash === '/' || hash === '/blog') {
    showBlogList();
  } else if (hash.startsWith('/post/')) {
    showPost(hash.replace('/post/', ''));
  } else {
    showBlogList();
  }
}

window.addEventListener('hashchange', router);

// === INIT ===

renderSkills();
renderBlog();
router();
