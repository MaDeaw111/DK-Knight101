// DK Knight Badminton Cyber-Sport Portal Orchestrator
import './style.css';
import { store } from './store.js';

// Import all native web components
import './components/DkHomePortal.js';
import './components/DkStudentCard.js';
import './components/DkAttendanceForm.js';
import './components/DkAssessmentForm.js';

class AppOrchestrator {
  constructor() {
    this.appElement = document.getElementById('app');
    this.currentView = 'home'; // 'home', 'profile', 'attendance', 'assessment'
  }

  async init() {
    // 1. Initialize State Store (Check API and sync local storage fallback)
    await store.init();

    // 2. Render Main Shell Layout
    this.renderShell();

    // 3. Mount initial view
    this.mountView();

    // 4. Hook up global event handlers
    this.setupGlobalEvents();
  }

  renderShell() {
    const isOffline = store.apiOffline;

    this.appElement.innerHTML = `
      <!-- Top Persistent Cyber HUD Header -->
      <header class="app-header">
        ${isOffline ? `
          <div class="offline-banner">
            <span class="offline-dot"></span>
            <span>CYBER-ATHLETE OFFLINE DEMO ACTIVE - SAVING TO SECURE LOCAL SANDBOX</span>
          </div>
        ` : ''}
        <div class="container header-inner">
          <div class="logo-section" id="nav-brand-home">
            <div class="logo-icon">
              <!-- Cyber Rackets Silhouette SVG -->
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" stroke-width="2">
                <circle cx="9" cy="9" r="6" stroke-dasharray="2" />
                <line x1="13.2" y1="13.2" x2="20" y2="20" />
                
                <circle cx="15" cy="9" r="6" stroke="#ffd700" />
                <line x1="15" y1="15" x2="22" y2="22" stroke="#ffd700" />
              </svg>
            </div>
            <div class="logo-text">DK KNIGHT PORTAL</div>
          </div>
          
          <nav class="nav-links">
            <div class="nav-link ${this.currentView === 'home' ? 'active' : ''}" data-target="home">Home</div>
            <div class="nav-link ${this.currentView === 'profile' ? 'active' : ''}" data-target="profile">Knight Profile</div>
            <div class="nav-link ${this.currentView === 'attendance' ? 'active' : ''}" data-target="attendance">Attendance Form</div>
            <div class="nav-link ${this.currentView === 'assessment' ? 'active' : ''}" data-target="assessment">Physical Assessment</div>
          </nav>
        </div>
      </header>

      <!-- Main Dynamic Content Chassis -->
      <main class="container py-2" id="main-content-chassis">
        <!-- Components will be dynamically injected here -->
      </main>

      <!-- Global floating cyber Toast notification container -->
      <div class="toast-container" id="global-toast-container"></div>
    `;
  }

  mountView() {
    const chassis = document.getElementById('main-content-chassis');
    if (!chassis) return;

    // Reset container contents
    chassis.innerHTML = '';

    // Create the appropriate native web component
    let viewNode;
    switch (this.currentView) {
      case 'home':
        viewNode = document.createElement('dk-home-portal');
        break;
      case 'profile':
        viewNode = document.createElement('dk-student-card');
        break;
      case 'attendance':
        viewNode = document.createElement('dk-attendance-form');
        break;
      case 'assessment':
        viewNode = document.createElement('dk-assessment-form');
        break;
      default:
        viewNode = document.createElement('dk-home-portal');
    }

    chassis.appendChild(viewNode);

    // Update active nav-link highlighting
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-target') === this.currentView) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  setupGlobalEvents() {
    // 1. Navigation clicks inside Header
    document.addEventListener('click', (e) => {
      const link = e.target.closest('.nav-link');
      if (link) {
        this.currentView = link.getAttribute('data-target');
        this.mountView();
      }
      
      const brand = e.target.closest('#nav-brand-home');
      if (brand) {
        this.currentView = 'home';
        this.mountView();
      }
    });

    // 2. Listen to decoupled custom elements events for SPA navigation
    document.addEventListener('navigate', (e) => {
      this.currentView = e.detail;
      this.mountView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 3. Catch custom toast dispatch
    document.addEventListener('show-toast', (e) => {
      this.triggerToast(e.detail.message, e.detail.type);
    });
  }

  triggerToast(message, type = 'success') {
    const toastContainer = document.getElementById('global-toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
    
    const icon = type === 'success' ? '⚡' : '⚠️';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-msg">${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Trigger sliding animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    // Remove toast after duration
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 350);
    }, 3500);
  }
}

// Instantiate and Boot App Orchestrator on content load
document.addEventListener('DOMContentLoaded', () => {
  const portal = new AppOrchestrator();
  portal.init();
});
