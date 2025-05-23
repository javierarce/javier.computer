---
layout: post
title: "Nuevas Reliquias"
date: "2025-05-18 14:00:00 +0100"
---

50 días sin pasar por aquí, ni siquiera para poner en hora los relojes (ahora mismo son las <current-time>18:00:00</current-time>).
Regresé de Berlín con un trabajo bajo el brazo (esto quizá ya lo sabías, pero
en octubre abandoné la factoría de blogs y sueños en la que trabajaba, por
razones que puedes leer en la [prensa
local](https://www.theverge.com/2024/9/27/24256361/wordpress-wp-engine-drama-explained-matt-mullenweg)),
y sin apenas energía para alimentar a mi yo digital. El incierto proceso de búsqueda de
empleo, y el sentirme sobrepasado por la fenomenal acogida de los
[proyectos](/projects) que publiqué en los últimos meses, me
agotaron. Pero ya estoy de vuelta, con muchas ganas de retomar este blog.

Ah, y aunque a partir de ahora dispondré de menos tiempo libre, sigo ofreciendo
[office hours](/office-hours), aunque en un horario algo más restringido.
Esta fue una de las cosas que más disfruté durante mis meses de
descanso y relajación, y me encantaría seguir conectando (o reconectando) con
personas creativas del otro lado de la pantalla.

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
