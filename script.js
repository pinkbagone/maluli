let currentLang = 'ka';
let menuData = null;

fetch('menu.json')
  .then(response => response.json())
  .then(data => {
    menuData = data;
    renderPage();
  });

function setLang(lang) {
  currentLang = lang;

  // Update active button
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // Update html lang attribute
  document.documentElement.lang = lang;

  renderPage();
}

function renderPage() {
  const ui = menuData.ui;

  // Update static UI text
  document.getElementById('tagline').textContent        = ui.tagline[currentLang];
  document.getElementById('menu-title').textContent     = ui.menuTitle[currentLang];
  document.getElementById('find-us-title').textContent  = ui.findUs[currentLang];
  document.getElementById('footer-address').textContent = ui.address[currentLang];
  document.getElementById('footer-hours').textContent   = ui.hours[currentLang];

  // Rebuild nav and menu
  buildMenu();
}

function buildMenu() {
  const container = document.getElementById('menu-container');
  const navBar    = document.getElementById('category-nav');

  container.innerHTML = '';
  navBar.innerHTML    = '';

  // "All" button
  const allBtn = document.createElement('button');
  allBtn.textContent = menuData.ui.all[currentLang];
  allBtn.classList.add('cat-btn', 'active');
  allBtn.addEventListener('click', () => {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
  });
  navBar.appendChild(allBtn);

  menuData.categories.forEach(category => {
    const categoryName = category.name[currentLang];
    const sectionId    = 'cat-' + category.name['en'].toLowerCase().replace(/\s+/g, '-');

    // Nav button
    const btn = document.createElement('button');
    btn.textContent = categoryName;
    btn.classList.add('cat-btn');
    btn.addEventListener('click', () => {
      document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    });
    navBar.appendChild(btn);

    // Category block
    const categoryBlock = document.createElement('div');
    categoryBlock.classList.add('category');
    categoryBlock.id = sectionId;

    const heading = document.createElement('h3');
    heading.textContent = categoryName;
    categoryBlock.appendChild(heading);

    category.items.forEach(item => {
      const row = document.createElement('div');
      row.classList.add('menu-item');

      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name[currentLang];
      img.classList.add('item-img');

      const textBlock = document.createElement('div');
      textBlock.classList.add('item-text');

      const itemName = document.createElement('span');
      itemName.classList.add('item-name');
      itemName.textContent = item.name[currentLang];

      const itemPrice = document.createElement('span');
      itemPrice.classList.add('item-price');
      itemPrice.textContent = '₾' + item.price;

      textBlock.appendChild(itemName);
      textBlock.appendChild(itemPrice);
      row.appendChild(img);
      row.appendChild(textBlock);
      categoryBlock.appendChild(row);
    });

    container.appendChild(categoryBlock);
  });

  // Scroll spy
  const sections = document.querySelectorAll('.category');
  const buttons  = document.querySelectorAll('.cat-btn');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 80) {
        current = section.id;
      }
    });
    buttons.forEach(btn => {
      btn.classList.remove('active');
      const id = 'cat-' + btn.textContent.toLowerCase().replace(/\s+/g, '-');
      if (id === current) btn.classList.add('active');
    });
  });
}