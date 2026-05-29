import { store } from '../store.js';

export class DkAssessmentForm extends HTMLElement {
  constructor() {
    super();
    this.skills = {};
  }

  connectedCallback() {
    this.render();
    
    this._studentListener = () => this.render();
    store.addEventListener('student-changed', this._studentListener);
  }

  disconnectedCallback() {
    if (this._studentListener) {
      store.removeEventListener('student-changed', this._studentListener);
    }
  }

  render() {
    const students = store.getStudents();
    const student = store.getActiveStudent();

    if (!student) {
      this.innerHTML = `<div class="cyber-card"><h2 class="text-glow-blue">No student selected for physical assessment.</h2></div>`;
      return;
    }

    // Initialize local skill values from active student
    this.skills = { ...student.skills };

    const skillLabels = {
      power: { name: 'Power 💥', desc: 'Explosive jump smashes and raw muscular force.' },
      speed: { name: 'Speed ⚡', desc: 'Sprinting pace and single-stroke acceleration.' },
      endurance: { name: 'Endurance 🫁', desc: 'Aerobic stamina for grinding 3-set rallies.' },
      flexibility: { name: 'Flexibility 🧘', desc: 'Lunging extension range and joint durability.' },
      bodyComposition: { name: 'Body Composition ⚖️', desc: 'Ratio of lean athletic mass to fat composition.' },
      quickness: { name: 'Quickness 🚀', desc: 'Split-second reaction speed and fast racket work.' },
      agility: { name: 'Agility 👣', desc: 'Multi-directional court transitions and cuts.' },
      balance: { name: 'Balance 🤸', desc: 'Core equilibrium post-smash landing.' },
      coordination: { name: 'Coordination 🎯', desc: 'Racket-face contact precision and timing.' }
    };

    this.innerHTML = `
      <div class="assessment-container cyber-card">
        <h2 class="form-title"><span class="text-glow-blue">🔬 Neural Calibration</span> Physical Matrix</h2>
        <p class="form-subtitle">Calibrate the 9 biometrics during monthly assessment days to recalculate titles and classes.</p>

        <div class="student-load-panel">
          <label class="form-label">Calibrate Target</label>
          <select class="form-select" id="assessment-student-select">
            ${students.map(s => `
              <option value="${s.id}" ${s.id === student.id ? 'selected' : ''}>
                ${s.id} - ${s.name} (${s.nickname})
              </option>
            `).join('')}
          </select>
        </div>

        <form id="assessment-matrix-form" class="hud-form">
          <div class="matrix-grid">
            ${Object.keys(skillLabels).map(key => {
              const val = this.skills[key] || 50;
              let ratingClass = 'rating-normal';
              if (val >= 80) ratingClass = 'rating-milestone';
              else if (val < 50) ratingClass = 'rating-under';

              return `
                <div class="skill-control-node cyber-card">
                  <div class="node-header">
                    <span class="node-title">${skillLabels[key].name}</span>
                    <span class="node-value ${ratingClass}" id="val-display-${key}">${val}</span>
                  </div>
                  <p class="node-desc">${skillLabels[key].desc}</p>
                  <div class="slider-wrapper">
                    <input type="range" class="skill-slider" id="slider-${key}" min="0" max="100" value="${val}" data-skill="${key}" />
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="form-actions mt-2">
            <button type="submit" class="btn-cyber w-100" id="btn-submit-assessment">
              CALIBRATE BIOMETRIC DATA
            </button>
          </div>
        </form>
      </div>

      <style>
        .assessment-container {
          max-width: 900px;
          margin: 0 auto;
          border-color: rgba(0, 210, 255, 0.25);
        }

        .form-title {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }

        .form-subtitle {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.75rem;
        }

        .student-load-panel {
          margin-bottom: 1.5rem;
          max-width: 400px;
        }

        .matrix-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.25rem;
        }

        .skill-control-node {
          background: rgba(18, 22, 26, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.03);
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          transition: border-color 0.2s ease;
        }

        .skill-control-node:hover {
          border-color: rgba(0, 210, 255, 0.15);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .node-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .node-title {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-primary);
        }

        .node-value {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 800;
        }

        .rating-normal {
          color: var(--neon-blue);
          text-shadow: 0 0 6px var(--neon-blue-glow);
        }

        .rating-milestone {
          color: var(--metallic-gold);
          text-shadow: 0 0 10px var(--gold-glow);
        }

        .rating-under {
          color: var(--neon-pink);
          text-shadow: 0 0 6px var(--neon-pink-glow);
        }

        .node-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.3;
          flex-grow: 1;
        }

        .slider-wrapper {
          margin-top: 0.5rem;
        }

        /* Custom range styling for cyberpunk HUD sliders */
        .skill-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          outline: none;
          transition: background 0.15s ease;
        }

        .skill-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--neon-blue);
          border: 2px stroke #fff;
          cursor: pointer;
          box-shadow: 0 0 8px var(--neon-blue-glow);
          transition: transform 0.1s ease;
        }

        .skill-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        /* Milestone slider thumb color-shift styling */
        .skill-control-node:has(.rating-milestone) .skill-slider::-webkit-slider-thumb {
          background: var(--metallic-gold);
          box-shadow: 0 0 10px var(--gold-glow);
        }

        .skill-control-node:has(.rating-under) .skill-slider::-webkit-slider-thumb {
          background: var(--neon-pink);
          box-shadow: 0 0 8px var(--neon-pink-glow);
        }

        .mt-2 {
          margin-top: 2rem;
        }
      </style>
    `;

    this.initMatrixEvents(student);
  }

  initMatrixEvents(student) {
    const studentSelect = this.querySelector('#assessment-student-select');
    if (studentSelect) {
      studentSelect.addEventListener('change', (e) => {
        store.setActiveStudent(e.target.value);
      });
    }

    const sliders = this.querySelectorAll('.skill-slider');
    sliders.forEach(slider => {
      slider.addEventListener('input', (e) => {
        const key = slider.getAttribute('data-skill');
        const val = parseInt(e.target.value);
        
        // Update local skills state
        this.skills[key] = val;

        // Update value display
        const display = this.querySelector(`#val-display-${key}`);
        if (display) {
          display.textContent = val;

          // Shift classes dynamically
          display.className = 'node-value';
          if (val >= 80) display.classList.add('rating-milestone');
          else if (val < 50) display.classList.add('rating-under');
          else display.classList.add('rating-normal');
        }
      });
    });

    const form = this.querySelector('#assessment-matrix-form');
    const submitBtn = this.querySelector('#btn-submit-assessment');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // Perform update to store & api
      const success = await store.saveAssessment(student.id, this.skills);

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';

        if (success) {
          // Toast Notification
          this.dispatchEvent(new CustomEvent('show-toast', {
            bubbles: true,
            composed: true,
            detail: {
              type: 'success',
              message: `Physical biometrics calibrated for ${student.name}!`
            }
          }));

          // Redirect back to profile to witness the growing animation of updated chart!
          setTimeout(() => {
            this.dispatchEvent(new CustomEvent('navigate', {
              bubbles: true,
              composed: true,
              detail: 'profile'
            }));
          }, 800);
        } else {
          alert('Error: Biometric matrix failed to calibrate.');
        }
      }, 600);
    });
  }
}

customElements.define('dk-assessment-form', DkAssessmentForm);
