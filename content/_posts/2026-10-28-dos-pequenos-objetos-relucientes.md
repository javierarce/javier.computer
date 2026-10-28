---
layout: post
title: "Dos pequeños objetos relucientes"
date: "2026-10-28 10:26:43 +0100"
tags:
  - newsletter
---

<div class="is-hidden-from-home">Publicado en la <a href="https://javier.computer/newsletter">newsletter</a> el 25 de Octubre de 2026</div>

¡Hola! Hoy llego a tu buzón como un zorrito del desierto (*Vulpes zerda*) o quizá
mejor como un cuervo común (*Corvus corax*) para traerte dos pequeños objetos
relucientes encontrados en alguno de mis vuelos recreativos por tu barrio, en
señal de nuestro vínculo de amistad informal.

<!-- more -->

El primero es este botón de nácar un poco roto por un lado, pero que podrías
perfectamente coser en esa camisa que compraste hace años y ya no te pones: el
segundo volumen de [Mundo Mendo](https://mundomendo.com), publicado por mi *ojiisan* Luis Mendo, ilustrador
excepcional donde los haya.

Me siento muy honrado de haber escrito el prólogo, en el que explico la
historia de cómo nos conocimos y lo que aprendí de él observándole de cerca
durante varios años, y de ser así una pequeña parte de su libro.

{% photo newsletter mundo-mendo 733 / 545 caption: "test" %}

Portada de Mundo Mendo. Book Two.

El libro [lo puedes conseguir aquí](https://www.mundomendo.com/books). Y si no tienes el volumen anterior, aún hay
algunos ejemplares disponibles.

El segundo objeto que te traigo es este trozo de vidrio verde, desgastado por
el paso del tiempo pero que aún está un poquito afilado por uno de los bordes y
que podría cortarte si te despistas: una app de dibujo vectorial llamada
[Superlinea](https://superlinea.app), en la que llevo varios meses trabajando.

Te dejo aquí un texto que envié hace unos días a los suscriptores de su
newsletter (a la que puedes suscribirte desde la web) y me voy volando, porque
al girar la cabeza acabo de ver algo brillante junto a ese árbol de allí y
quiero investigar. Creo que podría ser una moneda.

El ordenador en el que uso Superlinea

Hola, ¡bienvenido/a a la newsletter de Superlinea! Este es el primer mensaje
que envío y lo recibes porque te picó la curiosidad y te suscribiste para
recibir novedades y enterarte de cuándo publicaré la app.

Aunque todavía no estoy preparado para eso último, en este primer número de la
newsletter me gustaría contarte algunas cosas sobre este proyecto:
principalmente, qué me ha llevado a trabajar en él y cuál es mi objetivo.

¿Por qué hago esto?

La razón principal es que me encanta el dibujo vectorial y no he conseguido
encontrar una app que funcione como yo quiero.

Llevo muchos años usando Illustrator y, aunque me gustan muchas cosas de esta
app (la herramienta de pluma y selección, el modo de aislamiento que te permite
centrarte en un grupo de capas y evitar modificar las otras por accidente), la
experiencia de uso en general no es buena. Tampoco me gusta nada su modelo de
precios. Me encantaría pagar una sola vez por una app que me guste y que sea
mía, como hacíamos en los viejos tiempos.

La herramienta de corte en acción Una de las tres formas de cortar en
Superlinea ¿Y qué pasa con las otras herramientas vectoriales? Hay muchas y he
probado la mayoría, si no todas, pero ninguna me funciona bien. Affinity, que
probablemente sea la alternativa más completa que existe, tiene la ventaja de
ser gratuita (al menos mientras escribo estas líneas), y de hecho he editado
varios fanzines con ella. Pero en lo que respecta al dibujo vectorial y a la
facilidad de uso en general, no me convence: la interfaz me resulta compleja y
los atajos de teclado no se comportan como yo esperaría.

Lo mismo me pasa con Inkscape, que la última vez que la probé me pareció
bastante inestable.

Puede que al final el problema sea mío, que quizá sea demasiado exigente o
demasiado mayor (ay, no) para aprender una app nueva, o que incluso esté tan
acostumbrado a cómo funcionan Illustrator y Figma que nada más me parece bien
(Figma, por cierto, hace muchas cosas bien en cuanto a interfaz, pero por
desgracia no está pensada para la ilustración).

### Cómo empezó todo

Hace unos meses, inspirado por lo que [Aphera](https://aphera.co) estaba haciendo con su fantástica
app de edición de fotos, decidí investigar un poco para entender qué tendría
que hacer para crear mi propia aplicación de dibujo vectorial. Eché un vistazo
a motores de renderizado como Skia y a proyectos de código abierto como
Paper.js, y decidí trabajar en un pequeño prototipo durante un tiempo.

Al principio solo quería crear una app vectorial para el tipo de dibujos que
hago yo, que son sencillos y geométricos (por si quieres echarle un ojo, aquí
tienes mi antiguo [portfolio interactivo](https://javierarce.com)). Como ahora mismo dibujo solo por
diversión y no trato con clientes ni imprentas, no necesito funciones como
colores CMYK o exportación a PDF. Y como mi estilo es esencialmente plano,
tampoco necesito cosas como pinceles, texturas o imágenes. Gracias a esas
limitaciones, tras unos pocos días de trabajo acabé teniendo un prototipo que
me acercaba bastante a mi humilde objetivo. El prototipo tenía un conjunto de
funciones muy reducido y no era muy rápido, pero funcionaba. Como suele pasar,
este pequeño éxito me animó y decidí continuar construyendo la app, hacerla más
rápida y ampliar sus funciones.

La herramienta Ghost path en acción La herramienta de Ghost path en acción Y
llegamos hasta hoy: mi objetivo actual es construir una herramienta fácil de
usar, que sirva para distintos estilos (no solo para el tipo de ilustraciones
que hago yo) y que no solo te permita dibujar en el ordenador, sino también
llevar tus dibujos hasta la imprenta. Sé que el camino para construir una
herramienta así es muy largo y muy duro, y puede que no lo consiga, pero voy a
intentarlo y ver hasta dónde llego.

Y sí, soy plenamente consciente de la avalancha actual de apps *vibecodeadas* que
están intentando hacer exactamente lo mismo. He probado algunas y, a pesar de
lo que prometen, todavía no están a la altura, al menos desde mi punto de
vista.

### ¿Dónde está Superlinea ahora mismo?

La app está lo bastante avanzada como para permitirme dibujar con ella con
regularidad. Si dejara de trabajar en ella ahora mismo, podría seguir usándola
para dibujar en mi estilo. Lo único que echaría de menos sería una forma de
enviar mi trabajo a una imprenta (para eso tendría que generar el PDF con
Affinity).

Pero, como decía antes, mi objetivo es completar el proyecto para que no me
sirva solo a mí.

Esto es lo que falta a día de hoy:

- Imágenes de mapa de bits 
- Colores CMYK 
- Importación y exportación de PDF 
- Pinceles

También hay una larga lista de cosas pequeñas que quiero añadir, pero esas
cuatro son las más grandes.

### ¿Y qué pintas tú en todo esto?

Si te suscribiste hace poco, quizá hayas visto que añadí un formulario
preguntando con qué apps dibujas. Tengo pensado usar esas respuestas para
invitar a gente a probar la app. Si no quieres esperar a que te seleccione
mágicamente y te apetece probarla mientras sigue en desarrollo, responde a este
correo y dímelo. Lo único que pido a cambio es que la uses de verdad y me
envíes feedback: errores, cosas que echas en falta o que no funcionan como
esperabas, mensajes de ánimo o incluso dibujos que hayas creado con ella.

Una última cosa antes de despedirme: he abierto un [blog](https://superlinea.app/blog) donde comparto
novedades sobre las funcionalidades que añado y el progreso de desarrollo en
general. 

Bueno, eso es todo por ahora. Muchas gracias por seguir el proyecto, ¡y hasta
pronto!

Un saludo, Javier Arce
