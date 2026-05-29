import { store, calculateLevel, getLTADClass, calculateTitle } from '../store.js';
import { Chart } from 'chart.js/auto';

// Helper to translate LTAD classes into Thai
function translateLTAD(ltadClass) {
  if (ltadClass.includes('FUNdamentals')) return 'พื้นฐานทักษะแสนสนุก (FUNdamentals)';
  if (ltadClass.includes('Learn to Train')) return 'เรียนรู้เพื่อฝึกซ้อม (Learn to Train)';
  if (ltadClass.includes('Train to Train')) return 'ฝึกซ้อมเพื่อการฝึกฝน (Train to Train)';
  if (ltadClass.includes('Train to Compete')) return 'ฝึกซ้อมเพื่อการแข่งขัน (Train to Compete)';
  if (ltadClass.includes('Train to Win')) return 'ฝึกซ้อมเพื่อชัยชนะ (Train to Win)';
  return ltadClass;
}

// Helper to translate Character Titles to Thai
function translateTitle(title) {
  switch (title) {
    case 'Rookie Squire': return 'อัศวินฝึกหัดสไควร์';
    case 'Heavy Vanguard': return 'ทัพหน้าพลังช้างศึก';
    case 'Destructive DK Knight': return 'อัศวินจอมทำลายล้าง 💥';
    case 'Sonic Vanguard': return 'ทหารเสือความเร็วเสียง';
    case 'Flash Speedster': return 'ผู้พิทักษ์ความเร็วแสง 🚀';
    case 'Relentless Scout': return 'หน่วยลาดตระเวนอึดเหล็ก';
    case 'Unstoppable Engine': return 'จอมพลังเครื่องจักรไร้ขีดจำกัด 🫁';
    case 'Agile Striker': return 'ตัวตบยืดหยุ่นไร้ขอบเขต';
    case 'Liquid Serpent': return 'อสรพิษลื่นไหลไร้โครงกระดูก 🧘';
    case 'Steadfast Defender': return 'กองหลังเหล็กไหลหนาแน่น';
    case 'Iron Goliath': return 'ยักษ์ใหญ่โกไลแอทเหล็กกล้า ⚖️';
    case 'Swift Assassin': return 'นักฆ่าสังหารเงียบตอบสนองไว';
    case 'Lightning Striker': return 'ผู้จู่โจมสายฟ้าแลบ ⚡';
    case 'Phantom Ninja': return 'นินจาเงาข้ามมิติ';
    case 'Ghost Dancer': return 'แดนเซอร์เงาไร้เสียง 👣';
    case 'Unshakable Guard': return 'ทหารยามกำแพงศิลา';
    case 'Steadfast Bastion': return 'ปราการปราสาทไม่มีวันล้ม 🤸';
    case 'Strategic Blade': return 'ดาบกลยุทธ์ควบคุมสนาม';
    case 'Master Tactician': return 'สุดยอดเสนาธิการทหารไร้พ่าย 🎯';
    default: return 'อัศวินฝึกหัด';
  }
}

// 2D Lego SVG Customizer Generator
function generateLegoSvg(avatar, gripHand = 'Right') {
  // Color mappings
  const skins = {
    light: '#ffd1a9',
    medium: '#f9d38c',
    tan: '#c68642',
    dark: '#8d5524'
  };

  const shirts = {
    'neon-blue': {
      base: '#161c22',
      accent: '#00d2ff',
      shadow: '#0d1115',
      trim: '#ffd700',
      logo: `
        <!-- Shield and Racket Logo -->
        <polygon points="120,135 132,135 126,152 120,135" fill="#ffd700" />
        <circle cx="120" cy="140" r="6" stroke="#00d2ff" stroke-width="1.5" fill="none" />
        <line x1="116" y1="144" x2="110" y2="152" stroke="#00d2ff" stroke-width="1.5" />
      `
    },
    'gold': {
      base: '#ffd700',
      accent: '#ffffff',
      shadow: '#b39500',
      trim: '#161c22',
      logo: `
        <!-- Crown and Wings Logo -->
        <path d="M 112 142 L 115 135 L 120 140 L 125 135 L 128 142 Z" fill="#161c22" />
        <path d="M 108 144 C 114 148, 126 148, 132 144" stroke="#161c22" stroke-width="2" fill="none" />
      `
    },
    'charcoal': {
      base: '#1a1f24',
      accent: '#ff0055',
      shadow: '#0d0f11',
      trim: '#ffffff',
      logo: `
        <!-- Dual Laser Blades Logo -->
        <line x1="114" y1="135" x2="126" y2="147" stroke="#ff0055" stroke-width="2.5" />
        <line x1="126" y1="135" x2="114" y2="147" stroke="#ff0055" stroke-width="2.5" />
        <circle cx="120" cy="141" r="3" fill="#ffffff" />
      `
    }
  };

  const rackets = {
    blue: { ring: '#00d2ff', glow: 'rgba(0, 210, 255, 0.4)', handle: '#1c232b' },
    gold: { ring: '#ffd700', glow: 'rgba(255, 215, 0, 0.4)', handle: '#2b2216' },
    silver: { ring: '#c0c0c0', glow: 'rgba(192, 192, 192, 0.4)', handle: '#242424' }
  };

  const skin = skins[avatar.skinColor] || skins.medium;
  const shirt = shirts[avatar.shirt] || shirts['neon-blue'];
  const racket = rackets[avatar.racket] || rackets.blue;
  const hair = avatar.hairStyle;

  // Compute racket holding positions based on Left/Right grip
  const isRight = gripHand === 'Right';
  const racketX = isRight ? 185 : 55;
  const racketY = isRight ? 130 : 130;
  const racketRotation = isRight ? 25 : -25;

  // Dynamic SVG assembly
  let hairPath = '';
  if (hair === 'spiky') {
    hairPath = `
      <!-- Spiky Hair -->
      <path d="M 92,60 C 85,55 88,40 98,42 C 104,30 114,35 118,44 C 124,32 136,36 138,44 C 146,38 152,50 148,60 C 153,68 144,70 144,70 L 96,70 C 96,70 90,65 92,60 Z" fill="#2d3748" />
      <path d="M 94,52 L 102,48 L 108,52 L 116,46 L 122,50 L 132,44 L 138,50 L 144,48" stroke="#1a202c" stroke-width="1.5" fill="none" />
    `;
  } else if (hair === 'ponytail') {
    hairPath = `
      <!-- Ponytail Hair -->
      <path d="M 93,60 C 92,48 100,42 120,42 C 140,42 148,48 147,60 C 152,55 155,62 153,68 L 151,75 L 140,75 L 142,65 Q 120,55 98,65 L 100,75 L 89,75 C 87,66 91,55 93,60 Z" fill="#92400e" />
      <path d="M 132,48 C 142,48 150,56 150,68 C 150,85 162,90 164,105 C 166,115 155,120 152,110 C 150,96 142,88 138,84 Z" fill="#92400e" /> <!-- Tail -->
      <circle cx="138" cy="74" r="5" fill="#ff0055" /> <!-- Hairband -->
    `;
  } else if (hair === 'afro') {
    hairPath = `
      <!-- Afro Curly Hair -->
      <path d="M 95,65 
               C 80,62 78,45 90,38 
               C 85,24 105,15 115,28 
               C 120,15 140,18 145,30 
               C 158,25 162,45 150,55 
               C 160,65 150,80 142,75 
               C 138,82 102,82 98,75 
               C 88,78 84,70 95,65 Z" fill="#1a1105" />
    `;
  } else if (hair === 'undercut') {
    hairPath = `
      <!-- Undercut -->
      <path d="M 94,62 C 94,52 102,44 120,44 C 138,44 146,52 146,62 L 146,70 L 140,70 L 140,65 Q 120,54 100,65 L 100,70 L 94,70 Z" fill="#2d3748" opacity="0.3" /> <!-- Shaved sides -->
      <path d="M 95,58 C 95,45 105,38 120,38 C 138,36 148,46 144,56 C 134,50 120,48 102,56 Z" fill="#dd6b20" /> <!-- Swept Top -->
    `;
  } else {
    // Bald: Shiny Reflection Vector
    hairPath = `
      <!-- Bald Head Highlights -->
      <path d="M 102,58 A 20,20 0 0,1 125,52" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.5" />
    `;
  }

  // Draw face - either confident smile + cyber visor or lego cute face
  const faceHtml = avatar.gender === 'female' ? `
    <!-- Female Face Details -->
    <ellipse cx="110" cy="74" rx="3.5" ry="4.5" fill="#161c22" />
    <ellipse cx="130" cy="74" rx="3.5" ry="4.5" fill="#161c22" />
    <path d="M 106,67 Q 110,64 114,67" stroke="#161c22" stroke-width="1.5" fill="none" /> <!-- Lashes -->
    <path d="M 126,67 Q 130,64 134,67" stroke="#161c22" stroke-width="1.5" fill="none" />
    <ellipse cx="108" cy="78" rx="3" ry="1.5" fill="#ff708d" opacity="0.6" /> <!-- Blush -->
    <ellipse cx="132" cy="78" rx="3" ry="1.5" fill="#ff708d" opacity="0.6" />
    <path d="M 115,82 Q 120,87 125,82" stroke="#161c22" stroke-width="2" fill="none" stroke-linecap="round" />
  ` : `
    <!-- Male/Neutral Visor Face Details -->
    <circle cx="110" cy="73" r="3.5" fill="#161c22" />
    <circle cx="130" cy="73" r="3.5" fill="#161c22" />
    <path d="M 105,66 Q 110,63 115,67" stroke="#161c22" stroke-width="2" fill="none" /> <!-- Eyebrows -->
    <path d="M 125,66 Q 130,63 135,67" stroke="#161c22" stroke-width="2" fill="none" />
    <!-- Slick Cyber Visor overlay (Semi-transparent HUD) -->
    <path d="M 100,70 L 140,70 L 136,80 L 104,80 Z" fill="rgba(0, 210, 255, 0.4)" stroke="#00d2ff" stroke-width="1" />
    <path d="M 114,84 Q 120,91 126,84" stroke="#161c22" stroke-width="2" fill="none" stroke-linecap="round" />
  `;

  return `
    <svg width="100%" height="100%" viewBox="0 0 240 320" xmlns="http://www.w3.org/2000/svg" class="lego-minifig-svg">
      <!-- Glow background grid -->
      <defs>
        <radialGradient id="cyberGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${racket.ring}" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#12161a" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="240" height="320" rx="16" fill="#12161a" stroke="rgba(0, 210, 255, 0.1)" stroke-width="1.5" />
      <circle cx="120" cy="150" r="100" fill="url(#cyberGlow)" />
      
      <!-- Lego Neck Stud -->
      <rect x="112" y="50" width="16" height="6" rx="2" fill="${skin}" />
      
      <!-- Lego Head Base -->
      <rect x="95" y="55" width="50" height="44" rx="12" fill="${skin}" stroke="#12161a" stroke-width="1" />
      
      <!-- Face details -->
      ${faceHtml}
      
      <!-- Hair Overlay -->
      ${hairPath}
      
      <!-- Neck -->
      <rect x="112" y="98" width="16" height="12" fill="${skin}" />
      
      <!-- Torso / Shirt -->
      <path d="M 85,188 L 155,188 L 145,110 L 95,110 Z" fill="${shirt.base}" stroke="${shirt.shadow}" stroke-width="1" />
      <!-- Torso Decals/Design -->
      <path d="M 95,110 L 105,140 L 135,140 L 145,110" fill="none" stroke="${shirt.accent}" stroke-width="3" opacity="0.8" />
      <line x1="90" y1="188" x2="150" y2="188" stroke="${shirt.accent}" stroke-width="2" opacity="0.6" />
      <path d="M 115,110 L 120,122 L 125,110" fill="${skin}" /> <!-- Collar V-neck -->
      ${shirt.logo}

      <!-- Arms -->
      <!-- Left Arm -->
      <path d="M 93,110 L 76,148 Q 72,156 79,160 L 88,142 L 95,122 Z" fill="${shirt.base}" />
      <rect x="74" y="152" width="10" height="8" rx="2" fill="${skin}" transform="rotate(-20 74 152)" /> <!-- Left wrist -->
      
      <!-- Right Arm -->
      <path d="M 147,110 L 164,148 Q 168,156 161,160 L 152,142 L 145,122 Z" fill="${shirt.base}" />
      <rect x="156" y="152" width="10" height="8" rx="2" fill="${skin}" transform="rotate(20 156 152)" /> <!-- Right wrist -->

      <!-- Hands (Hook hands!) -->
      <!-- Left Hook Hand -->
      <path d="M 68,155 C 62,156 58,164 62,170 C 66,176 74,174 74,166 L 70,161" stroke="${skin}" stroke-width="4.5" fill="none" stroke-linecap="round" />
      
      <!-- Right Hook Hand -->
      <path d="M 172,155 C 178,156 182,164 178,170 C 174,176 166,174 166,166 L 170,161" stroke="${skin}" stroke-width="4.5" fill="none" stroke-linecap="round" />

      <!-- Racket Assembly -->
      <g transform="translate(${racketX}, ${racketY}) rotate(${racketRotation})">
        <!-- Shaft/Handle -->
        <line x1="0" y1="20" x2="0" y2="-55" stroke="#718096" stroke-width="2" />
        <rect x="-2.5" y="12" width="5" height="15" fill="${racket.handle}" rx="1" /> <!-- Grip Tape -->
        <!-- Racket Ring -->
        <ellipse cx="0" cy="-75" rx="18" ry="24" stroke="${racket.ring}" stroke-width="3" fill="none" />
        <!-- Mesh details -->
        <ellipse cx="0" cy="-75" rx="16" ry="22" stroke="rgba(255,255,255,0.08)" stroke-width="1" fill="none" />
        <line x1="-12" y1="-75" x2="12" y2="-75" stroke="rgba(255,255,255,0.2)" stroke-width="0.5" />
        <line x1="-10" y1="-85" x2="10" y2="-85" stroke="rgba(255,255,255,0.2)" stroke-width="0.5" />
        <line x1="-10" y1="-65" x2="10" y2="-65" stroke="rgba(255,255,255,0.2)" stroke-width="0.5" />
        <line x1="-17" y1="-75" x2="17" y2="-75" stroke="rgba(255,255,255,0.15)" stroke-width="0.5" />
        
        <line x1="0" y1="-98" x2="0" y2="-52" stroke="rgba(255,255,255,0.2)" stroke-width="0.5" />
        <line x1="-8" y1="-94" x2="-8" y2="-56" stroke="rgba(255,255,255,0.2)" stroke-width="0.5" />
        <line x1="8" y1="-94" x2="8" y2="-56" stroke="rgba(255,255,255,0.2)" stroke-width="0.5" />
        
        <!-- Glowing Core Spot -->
        <ellipse cx="0" cy="-75" rx="6" ry="8" fill="${racket.ring}" opacity="0.25" />
      </g>

      <!-- Hips & Legs -->
      <rect x="86" y="190" width="68" height="12" rx="2" fill="#2d3748" /> <!-- Belt -->
      <rect x="114" y="190" width="12" height="12" fill="${shirt.accent}" /> <!-- Buckle -->
      
      <!-- Left Leg -->
      <rect x="86" y="204" width="31" height="42" rx="3" fill="${shirt.base}" stroke="${shirt.shadow}" stroke-width="1" />
      <rect x="86" y="234" width="31" height="12" fill="#0d1115" rx="2" /> <!-- Left Boot -->
      <line x1="90" y1="216" x2="112" y2="216" stroke="${shirt.accent}" stroke-width="1.5" opacity="0.6" />
      
      <!-- Right Leg -->
      <rect x="123" y="204" width="31" height="42" rx="3" fill="${shirt.base}" stroke="${shirt.shadow}" stroke-width="1" />
      <rect x="123" y="234" width="31" height="12" fill="#0d1115" rx="2" /> <!-- Right Boot -->
      <line x1="127" y1="216" x2="149" y2="216" stroke="${shirt.accent}" stroke-width="1.5" opacity="0.6" />
    </svg>
  `;
}

export class DkStudentCard extends HTMLElement {
  constructor() {
    super();
    this.chart = null;
  }

  connectedCallback() {
    this.render();

    // Hook up active student changes
    this._studentListener = () => {
      this.render();
    };
    store.addEventListener('student-changed', this._studentListener);
    store.addEventListener('state-changed', this._studentListener);
  }

  disconnectedCallback() {
    if (this._studentListener) {
      store.removeEventListener('student-changed', this._studentListener);
      store.removeEventListener('state-changed', this._studentListener);
    }
    if (this.chart) {
      this.chart.destroy();
    }
  }

  render() {
    const student = store.getActiveStudent();
    if (!student) {
      this.innerHTML = `<div class="cyber-card"><h2 class="text-glow-blue">ยังไม่ได้โหลดข้อมูลโปรไฟล์อัศวิน</h2></div>`;
      return;
    }

    const level = calculateLevel(student.trainingHours);
    const ltad = translateLTAD(getLTADClass(level));
    const title = translateTitle(calculateTitle(student.skills));
    const studentsList = store.getStudents();

    this.innerHTML = `
      <div class="student-profile-container">
        
        <!-- Top Toolbar for student selection (Thai Localized) -->
        <div class="profile-toolbar cyber-card">
          <div class="form-group mb-0 flex-grow-1">
            <label class="form-label">เลือกโปรไฟล์อัศวิน</label>
            <select class="form-select" id="student-selector">
              ${studentsList.map(s => `
                <option value="${s.id}" ${s.id === student.id ? 'selected' : ''}>
                  ${s.id} - ${s.name} (${s.nickname})
                </option>
              `).join('')}
            </select>
          </div>
          <div class="toolbar-stats-box">
            <span class="toolbar-stat-lbl">มือที่ถนัด:</span>
            <span class="toolbar-stat-val text-glow-blue">${student.gripHand === 'Right' ? 'ขวา' : 'ซ้าย'}</span>
            <span class="toolbar-separator">|</span>
            <span class="toolbar-stat-lbl">สไตล์การเล่น:</span>
            <span class="toolbar-stat-val text-glow-gold">${student.playStyle === 'Singles' ? 'ประเภทเดี่ยว' : 'ประเภทคู่'}</span>
          </div>
        </div>

        <!-- Main Split Screen Panel -->
        <div class="profile-grid">
          
          <!-- LEFT SIDE: Lego Avatar Customizer (Thai Localized) -->
          <div class="avatar-customizer-panel cyber-card">
            <h3 class="panel-header-title"><span class="text-glow-blue">🤖 ห้องวิจัยสกิน</span> อวาตาร์เลโก้ 2D</h3>
            
            <!-- Dynamic Lego Container -->
            <div class="avatar-render-box" id="lego-avatar-container">
              ${generateLegoSvg(student.avatar, student.gripHand)}
            </div>

            <!-- Customizer controls -->
            <div class="customizer-controls">
              <div class="control-row">
                <label class="control-label">เพศตัวละคร</label>
                <div class="btn-group">
                  <button class="btn-ctrl-toggle ${student.avatar.gender === 'male' ? 'active' : ''}" data-avatar-prop="gender" data-avatar-val="male">ชาย</button>
                  <button class="btn-ctrl-toggle ${student.avatar.gender === 'female' ? 'active' : ''}" data-avatar-prop="gender" data-avatar-val="female">หญิง</button>
                </div>
              </div>

              <div class="control-row">
                <label class="control-label">สีผิวอวาตาร์</label>
                <select class="form-select sm" id="skin-selector">
                  <option value="light" ${student.avatar.skinColor === 'light' ? 'selected' : ''}>ขาวชมพู (Light Peach)</option>
                  <option value="medium" ${student.avatar.skinColor === 'medium' ? 'selected' : ''}>เหลือง (Medium Yellow)</option>
                  <option value="tan" ${student.avatar.skinColor === 'tan' ? 'selected' : ''}>สองสี (Tan Honey)</option>
                  <option value="dark" ${student.avatar.skinColor === 'dark' ? 'selected' : ''}>ผิวคล้ำ (Dark Chocolate)</option>
                </select>
              </div>

              <div class="control-row">
                <label class="control-label">ทรงผมเท่</label>
                <select class="form-select sm" id="hair-selector">
                  <option value="spiky" ${student.avatar.hairStyle === 'spiky' ? 'selected' : ''}>ชี้สแลต (Spiky)</option>
                  <option value="ponytail" ${student.avatar.hairStyle === 'ponytail' ? 'selected' : ''}>หางม้า (Ponytail)</option>
                  <option value="afro" ${student.avatar.hairStyle === 'afro' ? 'selected' : ''}>ฟูแอฟโฟร (Afro)</option>
                  <option value="undercut" ${student.avatar.hairStyle === 'undercut' ? 'selected' : ''}>เปิดข้างส้ม (Undercut)</option>
                  <option value="bald" ${student.avatar.hairStyle === 'bald' ? 'selected' : ''}>หัวโล้นเงา (Shiny Bald)</option>
                </select>
              </div>

              <div class="control-row">
                <label class="control-label">เสื้อผ้ากิลด์</label>
                <select class="form-select sm" id="shirt-selector">
                  <option value="neon-blue" ${student.avatar.shirt === 'neon-blue' ? 'selected' : ''}>อัศวินนีออน (Neon Blue)</option>
                  <option value="gold" ${student.avatar.shirt === 'gold' ? 'selected' : ''}>แชมเปี้ยนทอง (Gold Champ)</option>
                  <option value="charcoal" ${student.avatar.shirt === 'charcoal' ? 'selected' : ''}>สเตลธ์ออนิกซ์ (Stealth Onyx)</option>
                </select>
              </div>

              <div class="control-row">
                <label class="control-label">แร็กเก็ตคู่ใจ</label>
                <select class="form-select sm" id="racket-selector">
                  <option value="blue" ${student.avatar.racket === 'blue' ? 'selected' : ''}>บลูแอโรฟอร์ซ (Aero Blue)</option>
                  <option value="gold" ${student.avatar.racket === 'gold' ? 'selected' : ''}>โกลด์โวลต์สไตรค์ (Volt Gold)</option>
                  <option value="silver" ${student.avatar.racket === 'silver' ? 'selected' : ''}>ซิลเวอร์นาโนสปีด (Nano Silver)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- RIGHT SIDE: RPG character info & Radar Chart -->
          <div class="rpg-details-panel">
            
            <!-- Character Header Info Card -->
            <div class="character-identity-card cyber-card-gold">
              <div class="identity-header">
                <div>
                  <h2 class="identity-name">${student.name}</h2>
                  <div class="identity-nickname">ชื่อรหัสสนาม: <span class="text-glow-blue">"${student.nickname}"</span></div>
                </div>
                <div class="level-badge-box">
                  <div class="level-lbl">เลเวล</div>
                  <div class="level-val">${level}</div>
                </div>
              </div>

              <!-- Title Banner -->
              <div class="title-banner text-glow-gold">
                🛡️ ฉายา: ${title}
              </div>

              <div class="identity-stats-grid">
                <div class="id-stat-node">
                  <div class="id-stat-lbl">คลาสพัฒนาการ (LTAD)</div>
                  <div class="id-stat-val text-glow-blue" style="font-size:0.8rem;">${ltad}</div>
                </div>
                <div class="id-stat-node">
                  <div class="id-stat-lbl">ชั่วโมงซ้อมสะสม</div>
                  <div class="id-stat-val text-glow-gold">${student.trainingHours} ชั่วโมง</div>
                </div>
                <div class="id-stat-node">
                  <div class="id-stat-lbl">คะแนนประเมินรวม</div>
                  <div class="id-stat-val" id="combat-rating-val">--</div>
                </div>
              </div>
            </div>

            <!-- 9-Axis Skill Chart Card -->
            <div class="radar-chart-card cyber-card">
              <h3 class="panel-header-title"><span class="text-glow-blue">📊 วงแหวนวิเคราะห์</span> ประเมินร่างกายสรีรวิทยา 9 ด้าน</h3>
              <div class="canvas-wrapper">
                <canvas id="skills-radar-chart"></canvas>
              </div>
            </div>

          </div>
        </div>

        <!-- BOTTOM PANEL: Interactive Lesson Logs Timeline -->
        <div class="timeline-panel cyber-card">
          <h3 class="panel-header-title"><span class="text-glow-gold">📜 ประวัติศาสตร์ขุมพลัง</span> บันทึกชั่วโมงซ้อมและคอมเมนต์พัฒนาการ</h3>
          
          <div class="timeline-wrapper">
            ${student.logs.length === 0 ? `
              <div class="no-logs">ไม่พบบันทึกการซ้อม กรุณาเพิ่มประวัติการเข้าฝึกซ้อมที่หน้าฟอร์มโค้ช</div>
            ` : student.logs.map(log => {
              // Convert drills names to Thai dynamically
              const drillMap = {
                'Power Jumps to Smash': 'ตบกระโดดทรงพลัง (Power Smash) 💥',
                'Half-Court Net-Tape Game': 'เกมหยอดหน้าเน็ตครึ่งสนาม (Net Play) 🏸',
                'Shadow Multi-Stroke': 'วิ่งเงาจัดท่าตีต่อเนื่อง (Shadow Footwork) 👣',
                'Forehand Clears Mastery': 'ตีดึงเซฟหลังคอร์ท (Forehand Clear) 🎯',
                'Backhand Drop Shot Precision': 'ตัดหยอดโฟร์แฮนด์/แบ็คแฮนด์แม่นยำ 🧘',
                'Footwork Grid Speedrun': 'วิ่งทดสอบความไวตาราง 9 ช่อง 🚀'
              };
              const thDrills = log.drills.map(d => drillMap[d] || d);

              return `
                <div class="timeline-item">
                  <div class="timeline-marker">
                    <div class="marker-dot"></div>
                    <div class="marker-line"></div>
                  </div>
                  <div class="timeline-content-card">
                    <div class="timeline-header">
                      <span class="timeline-date">วันที่ซ้อม: ${log.date}</span>
                      <span class="timeline-coach">โค้ชผู้คุม: ${log.coach}</span>
                    </div>
                    <div class="timeline-drills">
                      ${thDrills.map(drill => `<span class="drill-tag">${drill}</span>`).join('')}
                    </div>
                    <p class="timeline-feedback">"${log.feedback}"</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <style>
        .student-profile-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* Profile Selection Bar */
        .profile-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          padding: 1rem 1.5rem;
          background: rgba(22, 28, 34, 0.9);
          border: 1px solid rgba(0, 210, 255, 0.25);
        }

        .toolbar-stats-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-display);
          font-size: 0.85rem;
          white-space: nowrap;
        }

        .toolbar-stat-lbl {
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .toolbar-stat-val {
          font-weight: 700;
        }

        .toolbar-separator {
          color: rgba(255, 255, 255, 0.15);
        }

        .mb-0 {
          margin-bottom: 0 !important;
        }

        .flex-grow-1 {
          flex-grow: 1;
        }

        /* Profile Layout Grid */
        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 2rem;
        }

        @media (max-width: 900px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Left Side: Avatar Customizer */
        .avatar-customizer-panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: stretch;
          border-color: rgba(0, 210, 255, 0.2);
        }

        .panel-header-title {
          font-size: 1.2rem;
          border-bottom: 1px stroke rgba(255, 255, 255, 0.08);
          padding-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .avatar-render-box {
          aspect-ratio: 3/4;
          max-height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(18, 22, 26, 0.6);
          border-radius: var(--radius-md);
          border: 1px solid rgba(0, 210, 255, 0.1);
          padding: 1rem;
          box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.6);
        }

        .lego-minifig-svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5));
        }

        .customizer-controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .control-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .control-label {
          font-family: var(--font-body);
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        .form-select.sm {
          padding: 0.4rem 0.8rem;
          font-size: 0.85rem;
          width: 170px;
        }

        .btn-group {
          display: flex;
          border: 1px solid rgba(0, 210, 255, 0.2);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        .btn-ctrl-toggle {
          background: rgba(18, 22, 26, 0.8);
          color: var(--text-secondary);
          border: none;
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 500;
          padding: 0.4rem 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-ctrl-toggle.active {
          background: var(--neon-blue);
          color: #12161a;
          box-shadow: 0 0 8px var(--neon-blue-glow);
        }

        /* Right Side: RPG details */
        .rpg-details-panel {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* Identity Card */
        .character-identity-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          position: relative;
        }

        .identity-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .identity-name {
          font-size: 1.75rem;
          background: linear-gradient(to right, #ffffff 50%, var(--metallic-gold) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .identity-nickname {
          font-family: var(--font-body);
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: 0.2rem;
        }

        .level-badge-box {
          background: linear-gradient(135deg, #cc9900 0%, #ffd700 100%);
          border-radius: var(--radius-md);
          padding: 0.6rem 0.9rem;
          text-align: center;
          box-shadow: 0 0 15px var(--gold-glow);
          color: #12161a;
          min-width: 70px;
        }

        .level-lbl {
          font-family: var(--font-body);
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          opacity: 0.8;
          line-height: 1;
        }

        .level-val {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 900;
          line-height: 1;
          margin-top: 0.15rem;
        }

        .title-banner {
          font-family: var(--font-body);
          font-size: 1.05rem;
          font-weight: 700;
          background: rgba(255, 215, 0, 0.08);
          border: 1px dashed rgba(255, 215, 0, 0.4);
          padding: 0.6rem 1rem;
          text-align: center;
          letter-spacing: 0.05em;
          border-radius: var(--radius-sm);
        }

        .identity-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          background: rgba(18, 22, 26, 0.4);
          border-radius: var(--radius-md);
          padding: 0.85rem;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .id-stat-node {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .id-stat-lbl {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }

        .id-stat-val {
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 700;
          word-break: break-word;
        }

        #combat-rating-val {
          color: var(--neon-pink);
          text-shadow: 0 0 6px var(--neon-pink-glow);
        }

        /* Radar Chart */
        .radar-chart-card {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .canvas-wrapper {
          position: relative;
          width: 100%;
          min-height: 300px;
          max-height: 380px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Bottom Timeline Panel */
        .timeline-panel {
          border-color: rgba(255, 215, 0, 0.15);
        }

        .timeline-wrapper {
          display: flex;
          flex-direction: column;
          padding: 1rem 0;
          gap: 0.5rem;
        }

        .no-logs {
          text-align: center;
          color: var(--text-muted);
          padding: 2rem;
          font-size: 0.95rem;
        }

        .timeline-item {
          display: flex;
          gap: 1.5rem;
        }

        .timeline-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 20px;
        }

        .marker-dot {
          width: 10px;
          height: 10px;
          background: var(--metallic-gold);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--gold-glow);
          margin-top: 0.6rem;
        }

        .marker-line {
          width: 2px;
          flex-grow: 1;
          background: linear-gradient(180deg, rgba(255, 215, 0, 0.3) 0%, transparent 100%);
          margin-top: 0.4rem;
        }

        .timeline-item:last-child .marker-line {
          display: none;
        }

        .timeline-content-card {
          flex-grow: 1;
          background: rgba(18, 22, 26, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: var(--radius-md);
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .timeline-header {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-body);
          font-size: 0.8rem;
        }

        .timeline-date {
          color: var(--metallic-gold);
        }

        .timeline-coach {
          color: var(--text-muted);
        }

        .timeline-drills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .drill-tag {
          font-family: var(--font-body);
          font-size: 0.72rem;
          background: rgba(0, 210, 255, 0.1);
          color: var(--neon-blue);
          border: 1px solid rgba(0, 210, 255, 0.25);
          border-radius: 4px;
          padding: 0.2rem 0.5rem;
          font-weight: 500;
        }

        .timeline-feedback {
          font-style: italic;
          color: var(--text-secondary);
          font-size: 0.92rem;
          line-height: 1.4;
        }
      </style>
    `;

    this.initCustomizerEvents(student);
    this.initChart(student);
  }

  initCustomizerEvents(student) {
    const handleAvatarUpdate = (prop, val) => {
      const updated = { ...student.avatar, [prop]: val };
      store.updateAvatar(student.id, updated);
      
      // Instantly update local render box SVG
      const container = this.querySelector('#lego-avatar-container');
      if (container) {
        container.innerHTML = generateLegoSvg(updated, student.gripHand);
      }
    };

    // Grip/Gender Selectors
    this.querySelectorAll('.btn-ctrl-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const prop = btn.getAttribute('data-avatar-prop');
        const val = btn.getAttribute('data-avatar-val');
        
        btn.parentNode.querySelectorAll('.btn-ctrl-toggle').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        handleAvatarUpdate(prop, val);
      });
    });

    // Dropdowns
    const skinSelect = this.querySelector('#skin-selector');
    if (skinSelect) {
      skinSelect.addEventListener('change', (e) => handleAvatarUpdate('skinColor', e.target.value));
    }

    const hairSelect = this.querySelector('#hair-selector');
    if (hairSelect) {
      hairSelect.addEventListener('change', (e) => handleAvatarUpdate('hairStyle', e.target.value));
    }

    const shirtSelect = this.querySelector('#shirt-selector');
    if (shirtSelect) {
      shirtSelect.addEventListener('change', (e) => handleAvatarUpdate('shirt', e.target.value));
    }

    const racketSelect = this.querySelector('#racket-selector');
    if (racketSelect) {
      racketSelect.addEventListener('change', (e) => handleAvatarUpdate('racket', e.target.value));
    }

    // Student profile selector
    const studentSelect = this.querySelector('#student-selector');
    if (studentSelect) {
      studentSelect.addEventListener('change', (e) => {
        store.setActiveStudent(e.target.value);
      });
    }
  }

  initChart(student) {
    const canvas = this.querySelector('#skills-radar-chart');
    if (!canvas) return;

    // Map 9 physical parameters with strict Thai requirements
    const labels = [
      'Power (พละกำลัง) 💥',
      'Speed (ความเร็ว) ⚡',
      'Endurance (ความอดทน) 🫁',
      'Flexibility (ความอ่อนตัว) 🧘',
      'Body Composition (องค์ประกอบร่างกาย) ⚖️',
      'Quickness (การตอบสนอง) 🚀',
      'Agility (ความคล่องตัว) 👣',
      'Balance (การทรงตัว) 🤸',
      'Coordination (ความแม่นยำ) 🎯'
    ];

    const dataValues = [
      student.skills.power,
      student.skills.speed,
      student.skills.endurance,
      student.skills.flexibility,
      student.skills.bodyComposition,
      student.skills.quickness,
      student.skills.agility,
      student.skills.balance,
      student.skills.coordination
    ];

    // Compute average combat rating
    const avg = Math.round(dataValues.reduce((sum, v) => sum + v, 0) / 9);
    const crNode = this.querySelector('#combat-rating-val');
    if (crNode) {
      crNode.textContent = `${avg} / 100`;
    }

    // Chart.js Configuration
    const config = {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'ความสามารถทางกายภาพ',
          data: dataValues,
          backgroundColor: 'rgba(0, 210, 255, 0.18)',
          borderColor: '#00d2ff',
          borderWidth: 2,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#00d2ff',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: '#00d2ff',
          pointHoverBorderColor: '#ffffff',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: {
              color: 'rgba(0, 210, 255, 0.2)'
            },
            grid: {
              color: 'rgba(0, 210, 255, 0.15)'
            },
            pointLabels: {
              color: '#f8f9fa',
              font: {
                family: "'Prompt', 'Orbitron', sans-serif",
                size: 9,
                weight: '600'
              }
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.4)',
              backdropColor: 'transparent',
              font: {
                size: 8
              },
              stepSize: 20
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `แต้มเฉลี่ย: ${context.raw}/100`;
              }
            }
          }
        },
        animation: {
          duration: 1200,
          easing: 'easeOutElastic'
        }
      }
    };

    if (this.chart) {
      this.chart.destroy();
    }
    
    this.chart = new Chart(canvas, config);
  }
}

customElements.define('dk-student-card', DkStudentCard);
