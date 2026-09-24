class RiseCountdown {
  constructor(section) {
    this.section = section;
    this.deadline = new Date(section.dataset.deadline);
    this.timer = section.querySelector('.countdown__timer');
    if (!this.timer || Number.isNaN(this.deadline.getTime())) return;
    this.values = Object.fromEntries(
      [...section.querySelectorAll('[data-unit]')].map((element) => [element.dataset.unit, element])
    );
    this.update = this.update.bind(this);
    this.update();
    this.interval = window.setInterval(this.update, 1000);
  }

  update() {
    const remaining = this.deadline.getTime() - Date.now();
    if (remaining <= 0) {
      this.section.dataset.hidden = 'true';
      window.clearInterval(this.interval);
      return;
    }
    const seconds = Math.floor(remaining / 1000);
    const values = {
      days: Math.floor(seconds / 86400),
      hours: Math.floor((seconds % 86400) / 3600),
      minutes: Math.floor((seconds % 3600) / 60),
      seconds: seconds % 60,
    };
    Object.entries(values).forEach(([unit, value]) => {
      if (this.values[unit]) this.values[unit].textContent = unit === 'days' ? value : String(value).padStart(2, '0');
    });
  }

  destroy() {
    window.clearInterval(this.interval);
  }
}

const initializeRiseCountdowns = (root = document) => {
  root.querySelectorAll('[data-section-type="countdown"]').forEach((section) => {
    if (!section.riseCountdown) section.riseCountdown = new RiseCountdown(section);
  });
};

document.addEventListener('DOMContentLoaded', () => initializeRiseCountdowns());
document.addEventListener('shopify:section:load', (event) => initializeRiseCountdowns(event.target));
document.addEventListener('shopify:section:unload', (event) => event.target.riseCountdown?.destroy());