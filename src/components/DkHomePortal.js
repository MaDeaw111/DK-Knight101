import { store, calculateTitle } from '../store.js';

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
    const students = store.getStudents();
    const totalKnights = students.length;
    
    // Calculate total logged training sessions dynamically
    const totalSessions = students.reduce((acc, s) => acc + s.logs.length, 0);
    const top3 = store.getTop3();

    this.innerHTML = `
      <div class="home-portal-gaming">
        
        <!-- Hero Welcome Banner -->
        <section class="gaming-hero">
          <div class="hud-scanline"></div>
          <div class="hero-glow-back"></div>
          <div class="hero-main-content">
            <div class="lobby-badge">
              <span class="pulse-indicator"></span>
              <span>CYBER-SPORT GUILD HALL ACTIVE</span>
            </div>
            <h1 class="gaming-title">DK KNIGHT <span class="text-glow-blue">PORTAL</span></h1>
            <p class="gaming-subtitle">เปลี่ยนการฝึกซ้อมสู่สเตตัสอัศวินระดับโลก</p>
          </div>
        </section>

        <!-- Global Analytics Grid -->
        <section class="analytics-hud">
          <div class="hud-box info-blue">
            <div class="hud-icon-shell">🥋</div>
            <div class="hud-box-content">
              <div class="hud-box-lbl">อัศวินในระบบ</div>
              <div class="hud-box-val text-glow-blue" id="stat-active-knights">${totalKnights}</div>
              <div class="hud-box-sub">Registered Active Profiles</div>
            </div>
            <div class="hud-deco-bar"></div>
          </div>
          
          <div class="hud-box info-gold">
            <div class="hud-icon-shell">⚡</div>
            <div class="hud-box-content">
              <div class="hud-box-lbl">บันทึกชั่วโมงซ้อม</div>
              <div class="hud-box-val text-glow-gold" id="stat-logged-sessions">${totalSessions}</div>
              <div class="hud-box-sub">Logged Sessions Active</div>
            </div>
            <div class="hud-deco-bar gold"></div>
          </div>
        </section>

        <!-- Mission Portal Grid (Interactive 3-Column Navigation) -->
        <section class="mission-grid">
          
          <!-- Card 1: Neon Blue Border -->
          <div class="mission-card border-blue" data-route="profile">
            <div class="mission-icon blue-glow">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h2 class="mission-title text-glow-blue">KNIGHT PROFILE</h2>
            <p class="mission-desc">ส่องการ์ดตัวละคร แต่งตัว Lego และเช็กสเตตัสกราฟ 9 เหลี่ยม</p>
            <div class="mission-action text-glow-blue">ENTER ROOM →</div>
            <div class="corner-trim tr"></div>
            <div class="corner-trim bl"></div>
          </div>

          <!-- Card 2: Off-White Border -->
          <div class="mission-card border-white" data-route="attendance">
            <div class="mission-icon white-glow">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <h2 class="mission-title">ATTENDANCE FORM</h2>
            <p class="mission-desc">ห้องพักโค้ช: เช็กชื่อรายวัน เลือกดริลส์ฝึก และคอมเมนต์พัฒนาการ</p>
            <div class="mission-action">OPEN TERMINAL →</div>
            <div class="corner-trim tr"></div>
            <div class="corner-trim bl"></div>
          </div>

          <!-- Card 3: Metallic Gold Border -->
          <div class="mission-card border-gold" data-route="assessment">
            <div class="mission-icon gold-glow">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h2 class="mission-title text-glow-gold">PHYSICAL ASSESSMENT</h2>
            <p class="mission-desc">ลานประเมินร่างกาย: อัปเดตแต้มสรีรวิทยาและกลไกเคลื่อนไหว 9 ด้าน</p>
            <div class="mission-action text-glow-gold">ENGAGE MATRIX →</div>
            <div class="corner-trim tr"></div>
            <div class="corner-trim bl"></div>
          </div>

        </section>

        <!-- Leaderboard (Hall of Fame Footer) -->
        <section class="guild-leaderboard">
          <div class="leaderboard-header">
            <h2 class="leaderboard-title">🏆 HALL OF FAME <span class="text-glow-gold">MVP KNIGHTS</span></h2>
            <p class="leaderboard-subtitle">Monthly top ranking cadets based on physical calibrations</p>
          </div>
          
          <div class="leaderboard-ranks">
            ${top3.map((player, index) => {
              const rank = index + 1;
              let tierClass = 'tier-bronze';
              let badge = '🥉';
              if (rank === 1) {
                tierClass = 'tier-gold';
                badge = '👑';
              } else if (rank === 2) {
                tierClass = 'tier-silver';
                badge = '🥈';
              }

              const sum = Object.values(player.skills).reduce((acc, v) => acc + v, 0);
              const avg = Math.round(sum / 9);
              const title = calculateTitle(player.skills);

              return `
                <div class="rank-strip ${tierClass}" data-student-id="${player.id}">
                  <div class="rank-num">${badge} Rank ${rank}</div>
                  <div class="rank-player-details">
                    <span class="rank-name">${player.name}</span>
                    <span class="rank-alias">"${player.nickname}"</span>
                    <div class="rank-class-badge">${title}</div>
                  </div>
                  <div class="rank-score">
                    <span class="score-lbl">Combat Rating</span>
                    <span class="score-num">${avg}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>

      </div>

      <style>
        /* Gaming HUD / Guild Hall Layout */
        .home-portal-gaming {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          font-family: var(--font-body);
        }

        /* Hero Banner Cyber-Sport styling */
        .gaming-hero {
          position: relative;
          background: #161c22;
          border: 1px solid rgba(0, 210, 255, 0.15);
          border-radius: var(--radius-lg);
          padding: 2.5rem 2rem;
          text-align: center;
          overflow: hidden;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        .hud-scanline {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(rgba(18, 22, 26, 0) 95%, rgba(0, 210, 255, 0.08) 98%);
          background-size: 100% 6px;
          pointer-events: none;
          animation: scanline 8s linear infinite;
        }

        .hero-glow-back {
          position: absolute;
          top: -40%;
          left: 30%;
          width: 40%;
          height: 180%;
          background: radial-gradient(circle, rgba(0, 210, 255, 0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
        }

        .hero-main-content {
          position: relative;
          z-index: 2;
        }

        .lobby-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0, 210, 255, 0.08);
          border: 1px solid rgba(0, 210, 255, 0.2);
          border-radius: 100px;
          padding: 0.4rem 1rem;
          font-family: var(--font-display);
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--neon-blue);
          letter-spacing: 0.06em;
          margin-bottom: 1rem;
        }

        .pulse-indicator {
          width: 8px;
          height: 8px;
          background: var(--neon-blue);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--neon-blue);
          animation: cyber-pulse 2s infinite;
        }

        .gaming-title {
          font-family: var(--font-display);
          font-size: 2.75rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          text-shadow: 0 0 10px rgba(255,255,255,0.08);
        }

        .gaming-subtitle {
          color: var(--text-secondary);
          font-size: 1.1rem;
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        /* Analytics HUD Section */
        .analytics-hud {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 600px) {
          .analytics-hud {
            grid-template-columns: 1fr;
          }
        }

        .hud-box {
          background: rgba(22, 28, 34, 0.75);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1.75rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .hud-icon-shell {
          font-size: 2.25rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-md);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .hud-box-content {
          flex-grow: 1;
        }

        .hud-box-lbl {
          font-family: var(--font-body);
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .hud-box-val {
          font-family: var(--font-display);
          font-size: 2.25rem;
          font-weight: 800;
          line-height: 1;
          margin: 0.2rem 0;
        }

        .hud-box-sub {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 500;
          letter-spacing: 0.04em;
        }

        .hud-deco-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: var(--neon-blue);
          box-shadow: 0 0 10px var(--neon-blue);
        }

        .hud-deco-bar.gold {
          background: var(--metallic-gold);
          box-shadow: 0 0 10px var(--metallic-gold);
        }

        /* Mission Portals */
        .mission-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .mission-card {
          background: rgba(22, 28, 34, 0.75);
          backdrop-filter: blur(10px);
          border-radius: var(--radius-lg);
          padding: 2rem 1.5rem;
          position: relative;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        /* Border specific rules */
        .border-blue {
          border: 1px solid rgba(0, 210, 255, 0.2);
        }
        .border-white {
          border: 1px solid rgba(248, 249, 250, 0.15);
        }
        .border-gold {
          border: 1px solid rgba(255, 215, 0, 0.2);
        }

        /* Hover animations and 3D translation */
        .mission-card:hover {
          transform: translateY(-8px);
        }

        .border-blue:hover {
          border-color: var(--neon-blue);
          box-shadow: 0 12px 25px rgba(0, 210, 255, 0.15), 0 0 15px var(--neon-blue-glow);
        }

        .border-white:hover {
          border-color: var(--text-primary);
          box-shadow: 0 12px 25px rgba(248, 249, 250, 0.1), 0 0 15px rgba(248, 249, 250, 0.15);
        }

        .border-gold:hover {
          border-color: var(--metallic-gold);
          box-shadow: 0 12px 25px rgba(255, 215, 0, 0.15), 0 0 15px var(--gold-glow);
        }

        .mission-icon {
          width: 54px;
          height: 54px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: transform 0.3s ease;
        }

        /* Icon glows matching tiers */
        .blue-glow {
          color: var(--neon-blue);
          border-color: rgba(0, 210, 255, 0.25);
          background: rgba(0, 210, 255, 0.06);
        }
        .white-glow {
          color: var(--text-primary);
          border-color: rgba(248, 249, 250, 0.15);
          background: rgba(248, 249, 250, 0.04);
        }
        .gold-glow {
          color: var(--metallic-gold);
          border-color: rgba(255, 215, 0, 0.25);
          background: rgba(255, 215, 0, 0.06);
        }

        /* Interactive icon scale & rotate */
        .mission-card:hover .mission-icon {
          transform: scale(1.2) rotate(-5deg);
        }

        .mission-title {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .mission-desc {
          color: var(--text-secondary);
          font-size: 0.88rem;
          line-height: 1.5;
          flex-grow: 1;
        }

        .mission-action {
          font-family: var(--font-display);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          margin-top: 0.5rem;
          color: var(--text-secondary);
        }

        .mission-card:hover .mission-action {
          color: var(--text-primary);
          text-decoration: underline;
        }

        /* Decorative Corners */
        .corner-trim {
          position: absolute;
          width: 8px;
          height: 8px;
          border: 1.5px solid transparent;
          pointer-events: none;
        }
        .border-blue .corner-trim { border-color: var(--neon-blue); }
        .border-white .corner-trim { border-color: var(--text-secondary); }
        .border-gold .corner-trim { border-color: var(--metallic-gold); }

        .corner-trim.tr { top: 6px; right: 6px; border-bottom: 0; border-left: 0; }
        .corner-trim.bl { bottom: 6px; left: 6px; border-top: 0; border-right: 0; }

        /* Leaderboard Footer */
        .guild-leaderboard {
          background: rgba(22, 28, 34, 0.6);
          border: 1px solid rgba(255, 215, 0, 0.15);
          border-radius: var(--radius-lg);
          padding: 1.75rem 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .leaderboard-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .leaderboard-title {
          font-size: 1.35rem;
          font-family: var(--font-display);
          font-weight: 800;
          color: var(--text-primary);
        }

        .leaderboard-subtitle {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }

        .leaderboard-ranks {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .rank-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.9rem 1.5rem;
          background: rgba(18, 22, 26, 0.5);
          border-radius: var(--radius-md);
          border-left: 4px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .rank-strip:hover {
          transform: translateX(6px);
          background: rgba(26, 32, 40, 0.7);
        }

        .rank-strip.tier-gold {
          border-left-color: var(--metallic-gold);
          background: linear-gradient(90deg, rgba(255, 215, 0, 0.03) 0%, rgba(18, 22, 26, 0.5) 100%);
        }
        .rank-strip.tier-gold:hover {
          box-shadow: inset 0 0 10px rgba(255, 215, 0, 0.05), 0 0 8px rgba(255, 215, 0, 0.1);
        }

        .rank-strip.tier-silver {
          border-left-color: var(--metallic-silver);
        }

        .rank-strip.tier-bronze {
          border-left-color: #cd7f32;
        }

        .rank-num {
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          width: 120px;
        }

        .rank-player-details {
          flex-grow: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .rank-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .rank-alias {
          font-style: italic;
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .rank-class-badge {
          font-family: var(--font-display);
          font-size: 0.68rem;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          padding: 0.15rem 0.4rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-secondary);
        }

        .tier-gold .rank-class-badge {
          color: var(--metallic-gold);
          border-color: rgba(255, 215, 0, 0.2);
          background: rgba(255, 215, 0, 0.04);
        }

        .rank-score {
          text-align: right;
          display: flex;
          flex-direction: column;
        }

        .score-lbl {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }

        .score-num {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--neon-blue);
        }

        .tier-gold .score-num {
          color: var(--metallic-gold);
        }
      </style>
    `;

    // Hook up routing navigation clicks
    this.querySelectorAll('.mission-card').forEach(card => {
      card.addEventListener('click', () => {
        const route = card.getAttribute('data-route');
        this.dispatchEvent(new CustomEvent('navigate', {
          bubbles: true,
          composed: true,
          detail: route
        }));
      });
    });

    // Hook up leaderboard player clicks to open their profile
    this.querySelectorAll('.rank-strip').forEach(card => {
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
