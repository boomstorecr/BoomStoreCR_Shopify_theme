class CountdownTimer {
  constructor(section) {
    this.section = section;
    this.deadline = section.dataset.deadline;
    this.isHidden = section.dataset.hidden === 'true';
    
    if (!this.deadline || this.isHidden) return;
    
    this.timerElement = section.querySelector('.countdown__timer');
    if (!this.timerElement) return;
    
    this.valueElements = {
      days: section.querySelector('[data-unit="days"]'),
      hours: section.querySelector('[data-unit="hours"]'),
      minutes: section.querySelector('[data-unit="minutes"]'),
      seconds: section.querySelector('[data-unit="seconds"]')
    };
    
    this.srElement = section.querySelector('.countdown__timer-sr');
    this.lastSrUpdate = 0;
    
    // Parse deadline as ISO 8601 with explicit offset
    this.deadlineDate = new Date(this.deadline);
    
    if (isNaN(this.deadlineDate.getTime())) {
      this.hideSection();
      return;
    }
    
    this.updateTimer();
    this.interval = setInterval(() => this.updateTimer(), 1000);
  }
  
  updateTimer() {
    const now = new Date();
    const diff = this.deadlineDate - now;
    
    if (diff <= 0) {
      this.hideSection();
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (this.valueElements.days) this.valueElements.days.textContent = days;
    if (this.valueElements.hours) this.valueElements.hours.textContent = String(hours).padStart(2, '0');
    if (this.valueElements.minutes) this.valueElements.minutes.textContent = String(minutes).padStart(2, '0');
    if (this.valueElements.seconds) this.valueElements.seconds.textContent = String(seconds).padStart(2, '0');
    
    // Update screen reader announcement at most once per minute
    const currentMinute = Math.floor(Date.now() / 60000);
    if (this.srElement && currentMinute !== this.lastSrUpdate) {
      this.lastSrUpdate = currentMinute;
      const parts = [];
      if (days > 0) parts.push(`${days} ${this.getUnitLabel('days', days)}`);
      if (hours > 0) parts.push(`${hours} ${this.getUnitLabel('hours', hours)}`);
      if (minutes > 0) parts.push(`${minutes} ${this.getUnitLabel('minutes', minutes)}`);
      
      if (parts.length > 0) {
        this.srElement.textContent = parts.join(', ');
      }
    }
  }
  
  getUnitLabel(unit, value) {
    const labels = {
      days: { singular: 'day', plural: 'days' },
      hours: { singular: 'hour', plural: 'hours' },
      minutes: { singular: 'minute', plural: 'minutes' }
    };
    
    return value === 1 ? labels[unit].singular : labels[unit].plural;
  }
  
  hideSection() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    
    this.section.dataset.hidden = 'true';
  }
  
  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

// Initialize all countdown sections
document.addEventListener('DOMContentLoaded', () => {
  const countdownSections = document.querySelectorAll('[data-section-type="countdown"]');
  const instances = new Map();
  
  countdownSections.forEach(section => {
    const instance = new CountdownTimer(section);
    instances.set(section.dataset.sectionId, instance);
  });
  
  // Handle theme editor section events
  if (window.Shopify?.designMode) {
    document.addEventListener('shopify:section:load', (event) => {
      if (event.detail.sectionId && event.target.dataset.sectionType === 'countdown') {
        const instance = new CountdownTimer(event.target);
        instances.set(event.detail.sectionId, instance);
      }
    });
    
    document.addEventListener('shopify:section:unload', (event) => {
      const instance = instances.get(event.detail.sectionId);
      if (instance) {
        instance.destroy();
        instances.delete(event.detail.sectionId);
      }
    });
    
    document.addEventListener('shopify:section:reorder', () => {
      // Timers continue running; no action needed
    });
  }
});
