# ✿ JARDÍN DE CUMPLEAÑOS

Una página de cumpleaños COMPLETA e interactiva, completamente editable, en **español**, con colores **crema, rosa empolvado y verde salvia**, ilustraciones originales de un gatito y flores. **Funciona sin instalar nada y sin internet.** Esta edición viene llena de mensajes, cartas, juego y tres melodías originales listas para escuchar; las fotos se presentan como postales ilustradas hasta que incorpores tus fotografías reales.

## 1. Cómo abrirla

1. Descomprime el ZIP completo.
2. Haz doble clic en **index.html** (Chrome, Edge, Firefox...).
3. Explora los menús y disfruta de los contenidos ya incluidos. Más adelante, si deseas hacer cambios, toca **Personalizar** arriba a la derecha.

## 2. Menús incluidos

- **Inicio:** portada con gatito, nombre y felicitación editable.
- **Historia:** línea del tiempo con recuerdos.
- **Fotos:** álbum tipo Polaroid con visor ampliado y fotos cambiables.
- **Amigas:** tarjetas interactivas que se dan vuelta para mostrar un mensaje.
- **Confesiones:** mensajes configurables y un formulario de notas locales.
- **Cartitas:** sobres que se abren para revelar cartas.
- **Vela:** sopla tres veces con el botón y aparece una sorpresa con confeti.
- **Deseos:** flores interactivas; toca una para recibir un buen deseo y personaliza la fecha del contador.
- **Música:** tres melodías originales ya incluidas y listas para escuchar; también puedes reemplazarlas con tus archivos o enlaces.
- **Juego:** preguntas de amistad, con respuestas y resultados editables.
- **Final:** despedida con un regalito secreto.

## 3. Cómo editarlo TODO, sin programar

1. Abre la página y pulsa **Personalizar**.
2. Usa las pestañas para cambiar textos, fechas, historias, amigas, fotos, cartas, canciones, colores y preguntas.
3. Pulsa **Guardar cambios**: quedan guardados en el navegador **de tu computadora**.
4. Pulsa **Descargar datos.js** en el editor. Copia ese archivo descargado encima del `datos.js` original de esta carpeta (reemplazándolo).
5. Abre de nuevo `index.html` para comprobarlo. **Importante:** el navegador donde editaste conserva una configuración local y la usa antes que el archivo. Puedes probarlo en una ventana privada, en otro navegador o en otra computadora. Si quieres que tu navegador también use lo guardado en `datos.js`, pulsa «Restaurar ejemplo» tras haber hecho copia de seguridad: primero cierra el editor y comprueba los datos fuera del navegador habitual.
6. Para compartir el regalo, **comprime toda la carpeta** y envíala o súbela a tu hosting preferido. La persona destinataria verá tus cambios sin tener que importar nada.

**También puedes** usar **Exportar JSON** para guardar una copia de respaldo y **Importar JSON** para recuperar una edición. Este método exporta datos e imágenes subidas, pero el JSON por sí solo **no** modifica automáticamente otros navegadores; para compartir la página lista, usa **Descargar datos.js** y reemplázalo como en el paso 4.

## 4. Edición directamente en el código

| Archivo | Qué contiene |
|---|---|
| `index.html` | Estructura y secciones de la página. |
| `estilos.css` | Colores, tipografías, diseño, animaciones y versión móvil. |
| `datos.js` | Todos los nombres, textos, tarjetas, deseos, imágenes, canciones y preguntas. |
| `app.js` | Interacciones, editor visual, vela, galería, contador, quiz, exportación e importación. |
| `assets/ilustraciones/` | Gatito, favicon y seis ilustraciones de muestra. |
| `assets/fotos/` | Coloca aquí tus fotos; consulta su LEEME. |
| `assets/musica/` | Coloca aquí tus MP3; consulta su LEEME. |

Los colores principales también se definen al principio de `estilos.css`. El archivo `datos.js` es la forma más sencilla de hacer cambios permanentes sin abrir el editor. Puedes usar Visual Studio Code.

## 5. Fotos, música y privacidad

- Las fotos subidas por el editor se comprimen para ahorrar espacio, pero demasiadas fotos pueden alcanzar el límite de almacenamiento de tu navegador. Si ocurre, usa archivos JPG en `assets/fotos/` y configura sus rutas en `datos.js`.
- Para evitar enlaces rotos, no se incluye música comercial. Añade un MP3 propio o permitido y configura `assets/musica/tu-cancion.mp3`, o un enlace externo.
- **Las confesiones escritas por visitantes desde el formulario NO se envían a nadie**: quedan en el almacenamiento local del navegador donde se escribieron. Para recoger mensajes entre varios móviles necesitas un servicio de base de datos, que no viene incluido. Las confesiones configuradas en el editor sí van dentro de `datos.js` cuando lo descargas.
- La página no necesita cuentas, contraseñas, APIs ni herramientas de terceros. El editor no está protegido por contraseña: no incluyas información que no quieras compartir con quien reciba la web.

## 6. Opcional: publicarlo en internet

Puedes subir **toda la carpeta** a GitHub Pages, Netlify o un hosting estático. Usa `index.html` como página inicial. El editor funciona incluso si la web está publicada, pero los cambios editados por los visitantes se guardan solo en sus navegadores; para actualizar el sitio para todos tienes que subir el nuevo `datos.js` al hosting.

## 7. Consejos para el regalito

Si quieres convertir la demostración en un regalo personal, reemplaza el nombre, la fecha, el mensaje oculto de la vela, las cartitas y las postales con fotografías reales. Mantén el gatito si le gustan los animales, o reemplaza la portada con una foto especial. ¡Y no te olvides de probarlo en el celular!

Diseño y SVG originales incluidos en esta carpeta. Libre para personalizar y regalar.
