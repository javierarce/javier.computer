---
layout: about
title: Newsletter
description: >
  Únete a las 84 personas que están confundidas y suscritas a mi lista de
  correo de bajísima intensidad, y recibe avisos cuando publique un nuevo
  proyecto o haga algo extremadamente gracioso.
permalink: newsletter
className: About
---

{% assign subscribers_count = site.data.subscribers -%}

Únete a las {{ subscribers_count }} personas que están confundidas y suscritas a mi lista de correo de bajísima intensidad, y recibe avisos cuando publique un nuevo proyecto o haga algo extremadamente gracioso

[Consulta el archivo](/tags/newsletter).

<hr />

<div class="Contact">
<form class="form is-visible" method="post" action="https://mailer.javier.computer/subscription/form">
<input type="hidden" name="nonce" />
<input type="hidden" name="l" value="10546b54-985f-41ab-836c-eac7e11477ef"/>

<label class="label" for="name">Nombre <span class="is-optional">(opcional)</span></label>

<div class="input__field">
<input class="input" type="text" name="name" placeholder="Oedipa Maas" />
</div>

<label class="label" for="email">Email</label>

<div class="input__field">
<input class="input" type="email" name="email" placeholder="oedipa.maas@waste.email" required />
</div>

<div class="input__captcha">
    <div class="h-captcha" data-sitekey="187a1b9c-4094-4270-b22e-24d4dede90ee"></div>
    <script src="https://js.hcaptcha.com/1/api.js" async defer></script>
 </div>

<div class="form__actions"><input class="button" type="submit" value="Suscríbeme" /></div>
</form>
</div>
