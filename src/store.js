// DK Knight Badminton Cyber-Sport Portal State Manager
// Handles interaction with Google Apps Script API & implements highly detailed fallback mock data

const API_URL = 'https://script.google.com/macros/s/AKfycbxMnG3ymRRAO_2hTO7RE5CxrbSSSF_4824PhFccndzr8rrM2JdJO0LmnVlgT4JlLDU/exec';

// 9 Specific physical parameters
const SKILL_KEYS = [
  'power',
  'speed',
  'endurance',
  'flexibility',
  'bodyComposition',
  'quickness',
  'agility',
  'balance',
  'coordination'
];

// Helper to calculate RPG club level by training hours
// Gold accent level milestones could be every 15 hours, level capping at 50 or similar.
export function calculateLevel(hours) {
  return Math.floor(hours / 12) + 1;
}

// Helper to determine Athlete Development class (based on LTAD)
export function getLTADClass(level) {
  if (level >= 25) return 'Train to Win (Elite)';
  if (level >= 18) return 'Train to Compete';
  if (level >= 12) return 'Train to Train';
  if (level >= 6) return 'Learn to Train';
  return 'FUNdamentals';
}

// Helper to get character title banner based on highest stats
export function calculateTitle(skills) {
  const maxSkill = Object.keys(skills).reduce((a, b) => skills[a] > skills[b] ? a : b);
  const maxValue = skills[maxSkill];

  if (maxValue < 65) return 'Rookie Squire';

  switch (maxSkill) {
    case 'power':
      return maxValue > 80 ? 'Destructive DK Knight' : 'Heavy Vanguard';
    case 'speed':
      return maxValue > 80 ? 'Flash Speedster' : 'Sonic Vanguard';
    case 'endurance':
      return maxValue > 80 ? 'Unstoppable Engine' : 'Relentless Scout';
    case 'flexibility':
      return maxValue > 80 ? 'Liquid Serpent' : 'Agile Striker';
    case 'bodyComposition':
      return maxValue > 80 ? 'Iron Goliath' : 'Steadfast Defender';
    case 'quickness':
      return maxValue > 80 ? 'Lightning Striker' : 'Swift Assassin';
    case 'agility':
      return maxValue > 80 ? 'Ghost Dancer' : 'Phantom Ninja';
    case 'balance':
      return maxValue > 80 ? 'Steadfast Bastion' : 'Unshakable Guard';
    case 'coordination':
      return maxValue > 80 ? 'Master Tactician' : 'Strategic Blade';
    default:
      return 'DK Squire';
  }
}

// Initial highly detailed fallback mock data
const INITIAL_MOCK_DATA = {
  activeKnights: 48,
  trainingHours: 1840,
  monthlyMvp: 'Jirayu "Aero" Tanawin',
  students: [
    {
      id: 'DK-001',
      name: 'Jirayu Tanawin',
      nickname: 'Aero',
      gripHand: 'Right',
      playStyle: 'Singles',
      trainingHours: 280,
      avatar: {
        gender: 'male',
        skinColor: 'medium',
        hairStyle: 'undercut',
        shirt: 'neon-blue',
        racket: 'blue'
      },
      skills: {
        power: 85,
        speed: 92,
        endurance: 88,
        flexibility: 78,
        bodyComposition: 82,
        quickness: 94,
        agility: 90,
        balance: 85,
        coordination: 91
      },
      logs: [
        {
          date: '2026-05-25',
          drills: ['Power Jumps to Smash', 'Shadow Multi-Stroke'],
          feedback: 'Outstanding smash speed. Showed highly responsive recovery steps.',
          coach: 'Coach Satir'
        },
        {
          date: '2026-05-10',
          drills: ['Half-Court Net-Tape Game', 'Shadow Multi-Stroke'],
          feedback: 'Excellent net tumbling control. Continue relaxing the grip on deceptive drops.',
          coach: 'Coach Satir'
        },
        {
          date: '2026-04-18',
          drills: ['Shadow Multi-Stroke'],
          feedback: 'Footwork patterns are fluid. Focus on stabilizing the landing post-jump.',
          coach: 'Coach Satir'
        }
      ]
    },
    {
      id: 'DK-002',
      name: 'Patsara Ruangdit',
      nickname: 'Pat',
      gripHand: 'Left',
      playStyle: 'Doubles',
      trainingHours: 195,
      avatar: {
        gender: 'female',
        skinColor: 'light',
        hairStyle: 'ponytail',
        shirt: 'gold',
        racket: 'gold'
      },
      skills: {
        power: 65,
        speed: 84,
        endurance: 82,
        flexibility: 90,
        bodyComposition: 72,
        quickness: 86,
        agility: 88,
        balance: 89,
        coordination: 92
      },
      logs: [
        {
          date: '2026-05-24',
          drills: ['Half-Court Net-Tape Game'],
          feedback: 'Incredible speed at the front court! Intercepted 4 tape-rolling shots.',
          coach: 'Coach Satir'
        },
        {
          date: '2026-05-08',
          drills: ['Shadow Multi-Stroke', 'Power Jumps to Smash'],
          feedback: 'Backcourt attack is improving, but grip change from forehand to backhand needs slight acceleration.',
          coach: 'Coach Satir'
        }
      ]
    },
    {
      id: 'DK-003',
      name: 'Nattapong Kiat',
      nickname: 'Nat',
      gripHand: 'Right',
      playStyle: 'Singles',
      trainingHours: 140,
      avatar: {
        gender: 'male',
        skinColor: 'dark',
        hairStyle: 'spiky',
        shirt: 'charcoal',
        racket: 'silver'
      },
      skills: {
        power: 94,
        speed: 72,
        endurance: 76,
        flexibility: 65,
        bodyComposition: 86,
        quickness: 74,
        agility: 76,
        balance: 80,
        coordination: 82
      },
      logs: [
        {
          date: '2026-05-20',
          drills: ['Power Jumps to Smash'],
          feedback: 'Unrivaled smash velocity! The sound of the racket compression is deep. Needs stamina drills.',
          coach: 'Coach Satir'
        },
        {
          date: '2026-05-02',
          drills: ['Shadow Multi-Stroke'],
          feedback: 'Practiced defensive lunges. Focus on keeping the non-racket arm raised for perfect balancing.',
          coach: 'Coach Satir'
        }
      ]
    },
    {
      id: 'DK-004',
      name: 'Alisa Promsri',
      nickname: 'Alice',
      gripHand: 'Right',
      playStyle: 'Doubles',
      trainingHours: 320,
      avatar: {
        gender: 'female',
        skinColor: 'tan',
        hairStyle: 'curly',
        shirt: 'neon-blue',
        racket: 'blue'
      },
      skills: {
        power: 76,
        speed: 95,
        endurance: 91,
        flexibility: 82,
        bodyComposition: 75,
        quickness: 93,
        agility: 96,
        balance: 87,
        coordination: 94
      },
      logs: [
        {
          date: '2026-05-26',
          drills: ['Shadow Multi-Stroke', 'Half-Court Net-Tape Game'],
          feedback: 'Flawless side-to-side defensive transitions. Dominating flat drive exchanges in doubles.',
          coach: 'Coach Satir'
        },
        {
          date: '2026-05-15',
          drills: ['Power Jumps to Smash'],
          feedback: 'Good placement on stick smashes. Practice angled drops from the back corners next.',
          coach: 'Coach Satir'
        }
      ]
    },
    {
      id: 'DK-005',
      name: 'Chatchai Boonmee',
      nickname: 'Chai',
      gripHand: 'Right',
      playStyle: 'Singles',
      trainingHours: 72,
      avatar: {
        gender: 'male',
        skinColor: 'medium',
        hairStyle: 'bald',
        shirt: 'charcoal',
        racket: 'blue'
      },
      skills: {
        power: 60,
        speed: 62,
        endurance: 68,
        flexibility: 65,
        bodyComposition: 63,
        quickness: 64,
        agility: 65,
        balance: 74,
        coordination: 70
      },
      logs: [
        {
          date: '2026-05-18',
          drills: ['Shadow Multi-Stroke'],
          feedback: 'Shows great dedication in shuttle footwork. Core balance during overhead swings has stabilized.',
          coach: 'Coach Satir'
        }
      ]
    }
  ]
};

class Store extends EventTarget {
  constructor() {
    super();
    // Load from LocalStorage or fallback to INITIAL_MOCK_DATA
    const saved = localStorage.getItem('dk_knight_store_data');
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        this.data = INITIAL_MOCK_DATA;
      }
    } else {
      this.data = INITIAL_MOCK_DATA;
    }
    
    this.activeStudentId = this.data.students[0]?.id || 'DK-001';
    this.apiOffline = true; // Flag for showing fallback banner
  }

  saveToLocalStorage() {
    localStorage.setItem('dk_knight_store_data', JSON.stringify(this.data));
    this.dispatchEvent(new CustomEvent('state-changed', { detail: this.data }));
  }

  async init() {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const payload = await response.json();
        if (payload && payload.students && payload.students.length > 0) {
          // Merge API data with avatar structures
          this.data.students = payload.students.map(s => {
            const existing = this.data.students.find(e => e.id === s.id);
            return {
              ...s,
              avatar: s.avatar || existing?.avatar || {
                gender: 'male',
                skinColor: 'medium',
                hairStyle: 'spiky',
                shirt: 'neon-blue',
                racket: 'blue'
              }
            };
          });
          if (payload.activeKnights) this.data.activeKnights = payload.activeKnights;
          if (payload.trainingHours) this.data.trainingHours = payload.trainingHours;
          if (payload.monthlyMvp) this.data.monthlyMvp = payload.monthlyMvp;
          this.apiOffline = false;
          this.saveToLocalStorage();
        }
      }
    } catch (error) {
      console.warn('Google Apps Script fetch failed/blocked. Running in engaging offline/sandbox demo mode.', error);
      this.apiOffline = true;
    }
  }

  getStudents() {
    return this.data.students;
  }

  getStudent(id) {
    return this.data.students.find(s => s.id === id) || null;
  }

  getActiveStudent() {
    return this.getStudent(this.activeStudentId);
  }

  setActiveStudent(id) {
    if (this.data.students.some(s => s.id === id)) {
      this.activeStudentId = id;
      this.dispatchEvent(new CustomEvent('student-changed', { detail: id }));
    }
  }

  getStats() {
    return {
      activeKnights: this.data.activeKnights,
      trainingHours: this.data.trainingHours,
      monthlyMvp: this.data.monthlyMvp
    };
  }

  getTop3() {
    // Rank students by their combined 9 skill parameters
    return [...this.data.students]
      .map(s => {
        const sum = Object.values(s.skills).reduce((sum, v) => sum + v, 0);
        const avg = Math.round(sum / 9);
        return { ...s, rating: avg };
      })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }

  // Update student avatar customization
  updateAvatar(studentId, newAvatar) {
    const student = this.getStudent(studentId);
    if (student) {
      student.avatar = { ...student.avatar, ...newAvatar };
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  // Save new coach attendance log (POST to API, fallback to local storage)
  async saveAttendance(attendance) {
    const { studentId, date, drills, feedback, coach = 'Coach Satir' } = attendance;
    const student = this.getStudent(studentId);

    if (!student) return false;

    // 1. Add log locally immediately for instant responsive UX
    const newLog = { date, drills, feedback, coach };
    student.logs.unshift(newLog); // Prepend to show first in timeline
    
    // Add 2 training hours per log session and update total stats
    student.trainingHours += 2;
    this.data.trainingHours += 2;

    this.saveToLocalStorage();

    // 2. Perform API POST request asynchronously
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors', // standard workaround for simple Google Apps Script redirects
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'saveAttendance',
          studentId,
          date,
          drills,
          feedback,
          coach
        })
      });
      console.log('Post attendance payload forwarded successfully to Apps Script API.');
    } catch (e) {
      console.error('API Post failed, attendance persisted to local sandboxed memory.', e);
    }

    return true;
  }

  // Save updated physical assessment metrics (POST to API, fallback to local storage)
  async saveAssessment(studentId, newSkills) {
    const student = this.getStudent(studentId);
    if (!student) return false;

    // 1. Update skills locally for instant responsive radar chart
    student.skills = { ...student.skills, ...newSkills };
    this.saveToLocalStorage();

    // 2. Perform API POST request asynchronously
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'saveAssessment',
          studentId,
          skills: newSkills
        })
      });
      console.log('Post assessment payload forwarded successfully to Apps Script API.');
    } catch (e) {
      console.error('API Post failed, physical assessment persisted to local sandboxed memory.', e);
    }

    return true;
  }
}

export const store = new Store();
