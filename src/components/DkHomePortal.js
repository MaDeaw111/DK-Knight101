import { store } from '../store.js';

export class DkHomePortal extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    
    // Listen for state changes to update stats dynamically
    this._stateListener = () => this.render();
    store.addEventListener('state-changed', this._stateListener);
  }

  disconnectedCallback() {
    if (this._stateListener) {
      store.removeEventListener('state-changed', this._stateListener);
    }
  }

  render() {
    const stats = store.getStats();
    const top3 = store.getTop3();

    this.innerHTML = `
      <div class="home-portal">
        <!-- Hero Section -->
        <section class="hero-banner cyber-card">
          <div class="hero-bg-effect"></div>
          <div class="hero-content">
            <div class="badge-status">
              <span class="offline-dot"></span>
              <span>CYBER-ATHLETE LOG ACTIVE</span>
            </div>
            <h1 class="hero-title">DK Knight Badminton</h1>
            <p class="hero-subtitle">Ascend the leaderboard. Build your avatar. Master the court.</p>
          </div>
          
          <!-- Live HUD Statistics Section -->
          <div class="hud-stats-grid">
            <div class="hud-stat-box">
              <div class="hud-stat-label">Active Knights</div>
              <div class="hud-stat-value text-glow-blue">${stats.activeKnights}</div>
              <div class="hud-stat-indicator">
                <div class="hud-stat-bar" style="width: 85%"></div>
              </div>
            </div>
            
            <div class="hud-stat-box gold-theme">
              <div class="hud-stat-label">Total Training Hours</div>
              <div class="hud-stat-value text-glow-gold">${stats.trainingHours}h</div>
              <div class="hud-stat-indicator">
                <div class="hud-stat-bar gold" style="width: 95%"></div>
              </div>
            </div>
            
            <div class="hud-stat-box mvp-theme">
              <div class="hud-stat-label">Monthly MVP</div>
              <div class="hud-stat-value mvp-name">${stats.monthlyMvp}</div>
              <div class="hud-stat-subtitle">Ranked #1 Combatant</div>
            </div>
          </div>
        </section>

        <!-- Interactive Navigation Cards -->
        <section class="nav-grid">
          <div class="nav-card cyber-card" data-route="profile">
            <div class="nav-card-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h2 class="nav-card-title">Student Profile</h2>
            <p class="nav-card-desc">Customize your Lego 2D Avatar, inspect RPG attributes, view LTAD classification, and track your 9-Axis Skill Radar.</p>
            <div class="nav-card-action text-glow-blue">Enter Profile →</div>
          </div>

          <div class="nav-card cyber-card" data-route="attendance">
            <div class="nav-card-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h2 class="nav-card-title">Coach Attendance Log</h2>
            <p class="nav-card-desc">For coaches to register lesson logs, schedule date/time, select official BWF drills, and submit customized feedback.</p>
            <div class="nav-card-action text-glow-blue">Open Form →</div>
          </div>

          <div class="nav-card cyber-card" data-route="assessment">
            <div class="nav-card-icon gold">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h2 class="nav-card-title">Physical Assessment</h2>
            <p class="nav-card-desc">Log monthly fitness evaluations and adjust the 9 physical components to observe fluid graph updates.</p>
            <div class="nav-card-action text-glow-blue">Calibrate Matrix →</div>
          </div>
        </section>

        <!-- Leaderboard (Hall of Fame) Section -->
        <section class="leaderboard-section">
          <h2 class="section-title"><span class="text-glow-gold">🏆 Hall of Fame</span> Leaderboard</h2>
          <div class="leaderboard-podium">
            ${top3.map((player, idx) => {
              const rank = idx + 1;
              let medalClass = 'rank-bronze';
              let trophy = '🥉';
              if (rank === 1) {
                medalClass = 'rank-gold';
                trophy = '👑';
              } else if (rank === 2) {
                medalClass = 'rank-silver';
                trophy = '🥈';
              }

              const sum = Object.values(player.skills).reduce((acc, v) => acc + v, 0);
              const avg = Math.round(sum / 9);

              return `
                <div class="leaderboard-card cyber-card ${medalClass}" data-student-id="${player.id}">
                  <div class="leaderboard-rank-badge">${trophy} Rank ${rank}</div>
                  <div class="leaderboard-player-info">
                    <h3 class="leaderboard-player-name">${player.name}</h3>
                    <div class="leaderboard-player-title">${player.nickname} • <span class="text-glow-gold">${store.getStudent(player.id) ? store.getStudent(player.id).avatar.shirt.toUpperCase() : ''}</span></div>
                    <div class="leaderboard-player-sub">${store.getStudent(player.id) ? calculateTitle(player.skills) : ''}</div>
                  </div>
                  <div class="leaderboard-rating-box">
                    <div class="leaderboard-rating-label">Combat Rating</div>
                    <div class="leaderboard-rating-value">${avg}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>
      </div>

      <style>
        .home-portal {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        /* Hero Banner */
        .hero-banner {
          padding: 3rem 2rem;
          background: linear-gradient(135deg, rgba(22, 28, 34, 0.9) 0%, rgba(14, 18, 22, 0.95) 100%);
          border: 1px solid rgba(0, 210, 255, 0.2);
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          box-shadow: 0 0 30px rgba(0, 210, 255, 0.05);
        }

        .hero-bg-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(rgba(0, 210, 255, 0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0, 210, 255, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .badge-status {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0, 210, 255, 0.1);
          border: 1px solid rgba(0, 210, 255, 0.3);
          border-radius: 100px;
          padding: 0.3rem 0.8rem;
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--neon-blue);
          margin-bottom: 1rem;
          letter-spacing: 0.05em;
        }

        .hero-title {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #ffffff 40%, var(--neon-blue) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 15px rgba(0,210,255,0.2);
        }

        .hero-subtitle {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        /* Live HUD Stats */
        .hud-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          position: relative;
          z-index: 2;
        }

        .hud-stat-box {
          background: rgba(18, 22, 26, 0.6);
          border: 1px solid rgba(0, 210, 255, 0.15);
          border-left: 3px solid var(--neon-blue);
          border-radius: var(--radius-md);
          padding: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .hud-stat-box.gold-theme {
          border-left-color: var(--metallic-gold);
          border-color: rgba(255, 215, 0, 0.15);
        }

        .hud-stat-box.mvp-theme {
          border-left-color: var(--neon-pink);
          border-color: rgba(255, 0, 85, 0.15);
          background: radial-gradient(circle at 100% 0%, rgba(255, 0, 85, 0.1) 0%, transparent 60%), rgba(18, 22, 26, 0.6);
        }

        .hud-stat-label {
          font-family: var(--font-display);
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .hud-stat-value {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 800;
          line-height: 1;
        }

        .mvp-name {
          color: var(--text-primary);
          text-shadow: 0 0 8px rgba(255,255,255,0.4);
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .hud-stat-subtitle {
          font-size: 0.75rem;
          color: var(--neon-pink);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .hud-stat-indicator {
          height: 4px;
          background: rgba(255,255,255,0.05);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 0.2rem;
        }

        .hud-stat-bar {
          height: 100%;
          background: var(--neon-blue);
          box-shadow: 0 0 8px var(--neon-blue);
        }

        .hud-stat-bar.gold {
          background: var(--metallic-gold);
          box-shadow: 0 0 8px var(--metallic-gold);
        }

        /* Nav Grid */
        .nav-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .nav-card {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          background: rgba(22, 28, 34, 0.7);
          border: 1px solid rgba(0, 210, 255, 0.15);
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .nav-card:hover {
          border-color: var(--neon-blue);
          box-shadow: 0 0 20px rgba(0, 210, 255, 0.15), inset 0 0 8px rgba(0, 210, 255, 0.05);
        }

        .nav-card-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: rgba(0, 210, 255, 0.1);
          color: var(--neon-blue);
          border: 1px solid rgba(0, 210, 255, 0.25);
          margin-bottom: 0.2rem;
        }

        .nav-card-icon.green {
          color: var(--success-green);
          background: rgba(57, 255, 20, 0.08);
          border-color: rgba(57, 255, 20, 0.2);
        }

        .nav-card-icon.gold {
          color: var(--metallic-gold);
          background: rgba(255, 215, 0, 0.08);
          border-color: rgba(255, 215, 0, 0.2);
        }

        .nav-card-title {
          font-size: 1.25rem;
          color: var(--text-primary);
          letter-spacing: 0.02em;
        }

        .nav-card-desc {
          color: var(--text-secondary);
          font-size: 0.88rem;
          line-height: 1.5;
          flex-grow: 1;
        }

        .nav-card-action {
          font-family: var(--font-display);
          font-size: 0.8rem;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-top: 0.5rem;
        }

        /* Leaderboard section */
        .leaderboard-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .section-title {
          font-size: 1.5rem;
          border-left: 3px solid var(--metallic-gold);
          padding-left: 0.75rem;
        }

        .leaderboard-podium {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .leaderboard-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem 1.8rem;
          cursor: pointer;
          border-left: 4px solid rgba(0, 210, 255, 0.3);
          transition: all 0.25s ease;
        }

        .leaderboard-card:hover {
          transform: translateX(6px);
        }

        .leaderboard-card.rank-gold {
          border-color: var(--metallic-gold);
          border-left-width: 6px;
          background: linear-gradient(90deg, rgba(255, 215, 0, 0.04) 0%, rgba(22, 28, 34, 0.7) 100%);
        }

        .leaderboard-card.rank-gold:hover {
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.15), 0 0 10px var(--gold-glow);
          border-color: var(--metallic-gold);
        }

        .leaderboard-card.rank-silver {
          border-color: var(--metallic-silver);
          border-left-width: 5px;
          background: linear-gradient(90deg, rgba(192, 192, 192, 0.03) 0%, rgba(22, 28, 34, 0.7) 100%);
        }

        .leaderboard-card.rank-silver:hover {
          box-shadow: 0 0 15px rgba(192, 192, 192, 0.12);
        }

        .leaderboard-rank-badge {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 140px;
        }

        .leaderboard-player-info {
          flex-grow: 1;
        }

        .leaderboard-player-name {
          font-size: 1.15rem;
          color: var(--text-primary);
        }

        .leaderboard-player-title {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 0.1rem;
        }

        .leaderboard-player-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 500;
          letter-spacing: 0.04em;
        }

        .leaderboard-rating-box {
          text-align: right;
        }

        .leaderboard-rating-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }

        .leaderboard-rating-value {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 900;
          color: var(--neon-blue);
          text-shadow: 0 0 8px rgba(0, 210, 255, 0.3);
          line-height: 1;
          margin-top: 0.1rem;
        }

        .rank-gold .leaderboard-rating-value {
          color: var(--metallic-gold);
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
        }
      </style>
    `;

    // Hook up routing navigation clicks
    this.querySelectorAll('.nav-card').forEach(card => {
      card.addEventListener('click', () => {
        const route = card.getAttribute('data-route');
        this.dispatchEvent(new CustomEvent('navigate', {
          bubbles: true,
          composed: true,
          detail: route
        }));
      });
    });

    // Hook up leaderboard player clicks
    this.querySelectorAll('.leaderboard-card').forEach(card => {
      card.addEventListener('click', () => {
        const studentId = card.getAttribute('data-student-id');
        store.setActiveStudent(studentId);
        this.dispatchEvent(new CustomEvent('navigate', {
          bubbles: true,
          composed: true,
          detail: 'profile'
        }));
      });
    });
  }
}

customElements.define('dk-home-portal', DkHomePortal);
