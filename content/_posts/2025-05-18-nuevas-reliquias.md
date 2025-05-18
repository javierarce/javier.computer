---
layout: post
title: "Nuevas Reliquias"
date: "2025-05-18 14:00:00 +0100"
---

50 días sin pasar por aquí, ni para poner en hora los relojes.
Regresé de Berlín con un trabajo bajo el brazo (esto quizá ya lo sabías, pero
en octubre abandoné la factoría de blogs y sueños en la que trabajaba, por
razones que puedes leer en la [prensa
local](https://www.theverge.com/2024/9/27/24256361/wordpress-wp-engine-drama-explained-matt-mullenweg)),
sin apenas energía para alimentar a mi yo digital. El proceso de búsqueda de
empleo y el sentirme sobrepasado por toda la atención recibida por los
<a href="/projects">proyectos</a> que publiqué en los últimos meses me
agotaron. Pero ya estoy de vuelta, con ganas de retomar este blog. Y son las <current-time>18:00:00</current-time>.

<script>
class CurrentTime extends HTMLElement {
    constructor() {
        super();
        this.textContent = '…';
        this.timer = setInterval(() => this.updateTime(), 1000);
        this.updateTime();
    }

    updateTime() {
        const now = new Date();

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        this.textContent = `${hours}:${minutes}:${seconds}`;
    }

    disconnectedCallback() {
        clearInterval(this.timer);
    }
}
customElements.define('current-time', CurrentTime);
</script>

