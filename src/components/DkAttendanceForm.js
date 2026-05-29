import { store } from '../store.js';

export class DkAttendanceForm extends HTMLElement {
  constructor() {
    super();
    this.selectedDrills = new Set();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const students = store.getStudents();
    const activeStudent = store.getActiveStudent();
    const today = new Date().toISOString().split('T')[0];

    const predefinedDrills = [
      'Power Jumps to Smash',
      'Half-Court Net-Tape Game',
      'Shadow Multi-Stroke',
      'Forehand Clears Mastery',
      'Backhand Drop Shot Precision',
      'Footwork Grid Speedrun'
    ];

    const quickFeedbacks = [
      'Showed outstanding explosive power on smash angles today.',
      'Excellent tumbling net shots. Net tape play was highly precise.',
      'Improved lateral movement response. Focus on recovery balance next session.',
      'Grip transitions from backhand to forehand are showing great agility.',
      'Core stability during rapid flat drive exchanges is exceptionally high.'
    ];

    this.innerHTML = `
      <div class="attendance-form-container cyber-card">
        <h2 class="form-title"><span class="text-glow-blue">📝 Lesson Terminal</span> Coach Logging Log</h2>
        <p class="form-subtitle">Register badminton drills completed and inject training hours into student profiles.</p>
        
        <form id="attendance-log-form" class="hud-form">
          
          <div class="form-row">
            <!-- Student Select -->
            <div class="form-group flex-grow-1">
              <label class="form-label">Select Student Knight</label>
              <select class="form-select" id="student-search-select" required>
                <option value="" disabled>-- Search Student ID --</option>
                ${students.map(s => `
                  <option value="${s.id}" ${activeStudent && activeStudent.id === s.id ? 'selected' : ''}>
                    ${s.id} - ${s.name} (${s.nickname})
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Date Picker -->
            <div class="form-group min-w-200">
              <label class="form-label">Training Date</label>
              <input type="date" class="form-input" id="training-date" value="${today}" required />
            </div>
          </div>

          <!-- BWF Drills selector -->
          <div class="form-group">
            <label class="form-label">BWF Drills Mastered Today <span class="drill-count-badge" id="drill-count">(0 Selected)</span></label>
            <div class="drills-grid">
              ${predefinedDrills.map(drill => `
                <div class="drill-chip-btn" data-drill="${drill}">
                  <span class="chip-plus">+</span>
                  <span class="chip-text">${drill}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Coach Feedback text -->
          <div class="form-group">
            <label class="form-label">Coach Tactical Feedback</label>
            <textarea class="form-textarea" id="coach-feedback" rows="4" placeholder="Enter tactical, physical, or psychological feedback observations..." required></textarea>
            
            <!-- Quick Suggestion Templates -->
            <div class="templates-section">
              <span class="templates-lbl">Quick-Fill Templates:</span>
              <div class="templates-list">
                ${quickFeedbacks.map((fb, idx) => `
                  <button type="button" class="btn-template-tag" data-fb-text="${fb}">Draft ${idx + 1}</button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="form-actions">
            <button type="submit" class="btn-cyber w-100" id="btn-save-attendance">
              <span class="btn-loading-dot"></span>
              SAVE ATTENDANCE & INJECT EXP
            </button>
          </div>

        </form>
      </div>

      <style>
        .attendance-form-container {
          max-width: 800px;
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
          margin-bottom: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.75rem;
        }

        .hud-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .min-w-200 {
          min-width: 200px;
        }

        .w-100 {
          width: 100%;
        }

        /* Drills grid chips */
        .drills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .drill-chip-btn {
          background: rgba(18, 22, 26, 0.6);
          border: 1px solid rgba(0, 210, 255, 0.15);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--text-secondary);
          font-family: var(--font-display);
          font-size: 0.8rem;
          text-transform: uppercase;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
        }

        .drill-chip-btn:hover {
          background: rgba(22, 28, 34, 0.9);
          border-color: rgba(0, 210, 255, 0.4);
          color: var(--text-primary);
        }

        .drill-chip-btn.active {
          background: rgba(0, 210, 255, 0.1);
          border-color: var(--neon-blue);
          color: var(--neon-blue);
          box-shadow: 0 0 10px rgba(0, 210, 255, 0.25);
        }

        .chip-plus {
          font-size: 1rem;
          font-weight: 700;
          line-height: 1;
        }

        .drill-chip-btn.active .chip-plus {
          content: '✓';
          transform: rotate(45deg);
          color: var(--neon-blue);
        }

        .drill-count-badge {
          color: var(--neon-blue);
          font-size: 0.75rem;
          font-weight: 700;
          margin-left: 0.5rem;
        }

        /* Quick-fill template styling */
        .templates-section {
          margin-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .templates-lbl {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }

        .templates-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .btn-template-tag {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          color: var(--text-secondary);
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 0.75rem;
          padding: 0.25rem 0.6rem;
          transition: all 0.15s ease;
        }

        .btn-template-tag:hover {
          background: rgba(0, 210, 255, 0.08);
          border-color: rgba(0, 210, 255, 0.3);
          color: var(--neon-blue);
        }

        /* Loading effects on button */
        .btn-loading-dot {
          display: none;
          width: 8px;
          height: 8px;
          background: #fff;
          border-radius: 50%;
          margin-right: 8px;
          animation: cyber-pulse 1s infinite alternate;
        }

        button:disabled .btn-loading-dot {
          display: inline-block;
        }
      </style>
    `;

    this.initFormEvents();
  }

  initFormEvents() {
    const chips = this.querySelectorAll('.drill-chip-btn');
    const countBadge = this.querySelector('#drill-count');

    // Toggle drill chips active state
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const drill = chip.getAttribute('data-drill');
        if (this.selectedDrills.has(drill)) {
          this.selectedDrills.delete(drill);
          chip.classList.remove('active');
        } else {
          this.selectedDrills.add(drill);
          chip.classList.add('active');
        }
        countBadge.textContent = `(${this.selectedDrills.size} Selected)`;
      });
    });

    // Quick-Fill templates
    const feedbackTextarea = this.querySelector('#coach-feedback');
    this.querySelectorAll('.btn-template-tag').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-fb-text');
        feedbackTextarea.value = text;
        feedbackTextarea.focus();
      });
    });

    // Form Submission
    const form = this.querySelector('#attendance-log-form');
    const saveBtn = this.querySelector('#btn-save-attendance');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const studentId = this.querySelector('#student-search-select').value;
      const date = this.querySelector('#training-date').value;
      const feedback = feedbackTextarea.value.trim();

      if (!studentId) {
        alert('Please select a Student Knight.');
        return;
      }

      if (this.selectedDrills.size === 0) {
        alert('Please select at least one BWF Drill.');
        return;
      }

      // Enter loading state
      saveBtn.disabled = true;
      saveBtn.style.opacity = '0.7';

      // Perform save
      const drillsArr = Array.from(this.selectedDrills);
      const success = await store.saveAttendance({
        studentId,
        date,
        drills: drillsArr,
        feedback
      });

      // Artificial short delay to show futuristic dashboard processing
      setTimeout(() => {
        saveBtn.disabled = false;
        saveBtn.style.opacity = '1';

        if (success) {
          // Reset drills
          this.selectedDrills.clear();
          chips.forEach(c => c.classList.remove('active'));
          countBadge.textContent = `(0 Selected)`;
          form.reset();
          
          // Re-populate date default
          this.querySelector('#training-date').value = new Date().toISOString().split('T')[0];

          // Trigger dynamic success Toast notification
          this.dispatchEvent(new CustomEvent('show-toast', {
            bubbles: true,
            composed: true,
            detail: {
              type: 'success',
              message: 'Attendance log saved. +2 Training Hours injected!'
            }
          }));

          // Automatically navigate back to student profile to witness changes!
          setTimeout(() => {
            this.dispatchEvent(new CustomEvent('navigate', {
              bubbles: true,
              composed: true,
              detail: 'profile'
            }));
          }, 800);
        } else {
          alert('Error: Student profile could not be logged.');
        }
      }, 600);
    });
  }
}

customElements.define('dk-attendance-form', DkAttendanceForm);
