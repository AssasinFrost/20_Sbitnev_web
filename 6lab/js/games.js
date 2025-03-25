class GamesManager {
    constructor() {
      this.container = document.getElementById('games-container');
      this.fetchAndRender();
    }
  
    async fetchAndRender() {
      this.container.innerHTML = 'Загрузка игр...';
  
      try {
        const res = await fetch('http://localhost:3000/api/giveaways?platform=steam&type=game');
        const data = await res.json();
  
        this.renderGames(data);
      } catch (err) {
        console.error('Ошибка загрузки игр:', err);
        this.container.innerHTML = `<p style='color:red;'>Не удалось загрузить список игр 😥</p>`;
      }
    }
  
    renderGames(games) {
      this.container.innerHTML = '';
      const fragment = document.createDocumentFragment();
  
      games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
          <img src='${game.thumbnail}' alt='${game.title}'>
          <h3>${game.title}</h3>
          <p><strong>Стоимость:</strong> ${game.worth}</p>
          <a href="${game.gamerpower_url}" target="_blank">Перейти к раздаче</a>
          <div class='note-block'>
            <textarea data-id='${game.id}' placeholder='Заметка об игре...'></textarea>
          </div>
        `;
  
        fragment.appendChild(card);
      });
  
      this.container.appendChild(fragment);
    }
  }
  
  new GamesManager();
  