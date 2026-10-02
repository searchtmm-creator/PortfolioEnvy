# Guía de diseño y efectos para el portafolio de Sergio Alzate

Esta guía propone una dirección para competir en Awwwards y ayudar a reclutadores a conocer el trabajo de Sergio Alzate. El objetivo es una experiencia reconocible, con campañas que se puedan explorar con facilidad y una ejecución visual cuidada en escritorio y móvil. Ganar depende de la evaluación del jurado y de los sitios que compitan; esta guía no garantiza un premio.

El reproductor cinematográfico descrito aquí ya está implementado en el sitio actual. El resto constituye una propuesta para las siguientes iteraciones, no una lista de cambios ya realizados. Sergio prefirió conservar el diseño actual y solicitó incorporar CREATIVE PORTFOLIO en partículas; ese efecto también está implementado. La propuesta editorial de esta guía permanece como referencia. Se conservan los nueve casos, el contenido aprobado, los reconocimientos y la estrategia SEO por nombre. No se añaden roles ni resultados de campañas sin información del autor.

## 1 Cómo orientar la candidatura

Awwwards pondera diseño con 40 %, usabilidad con 30 %, creatividad con 20 % y contenido con 10 %. La siguiente columna traduce esos criterios en prioridades específicas de este portafolio. [Evaluación oficial de Awwwards](https://www.awwwards.com/about-evaluation/).

| Criterio | Peso | Aplicación propuesta |
| --- | --- | --- |
| Diseño | 40 % | Tipografía, composición, dirección de portadas y una identidad consistente en todas las pantallas. |
| Usabilidad | 30 % | Encontrar proyectos, reproducir films, volver al listado y contactar a Sergio con facilidad. |
| Creatividad | 20 % | Una interacción propia vinculada a Search y a la envidia, integrada en el recorrido. |
| Contenido | 10 % | Casos claros, medios completos y reconocimientos precisos y fáciles de consultar. |

La prioridad inicial será resolver la composición y la navegación. Después se añadirá la interacción distintiva y se pulirá el movimiento. Los efectos deben acompañar una dirección de arte sólida.

## 2 Concepto y recorrido

Dirección propuesta: **Search. Find. Feel envy.** Un archivo creativo con composición editorial y momentos cinematográficos. Es un concepto de diseño sujeto a revisión del texto final, inspirado en la identidad Search y el Envy Meter existentes.

El visitante primero reconoce a Sergio y su trabajo, después encuentra una campaña y finalmente puede experimentar con el medidor. La cámara será una invitación opcional, activada por el usuario. El recorrido hacia los proyectos y el contacto debe funcionar sin utilizarla.

La firma visual combina negro, verde lima, titulares amplios y campañas en color. El medidor será el momento memorable: una lectura visual localizada, con una breve exploración de la imagen y una reacción del indicador. Su lenguaje debe dejar claro que es una experiencia creativa; no presentar sus resultados como una evaluación científica de emociones.

## 3 Qué necesita mejorar la presentación actual

El panel flotante del escáner ocupa espacio sobre las campañas. El grano, los textos técnicos y el cursor grande compiten con las imágenes. La repetición de rótulos reduce la diferenciación entre casos y la combinación de mayúsculas y monoespaciada necesita una jerarquía más clara.

La propuesta es compactar el escáner en un acceso visible, abrir su experiencia al solicitarla y dar más espacio a la composición. Cada portada debe mostrar una imagen elegida de su campaña, con un recorte revisado individualmente. El color del trabajo debe permanecer visible antes de interactuar.

## 4 Sistema visual

### Color y textura

| Uso | Valor propuesto | Regla |
| --- | --- | --- |
| Fondo general | `#121212` | Base del recorrido. |
| Fondo de films | `#090909` | Continuidad con el reproductor. |
| Superficies | `#202020` | Paneles y estados secundarios. |
| Acento | `#CEFE46` | Acciones principales, selección y detalles del medidor. |
| Texto principal | `#ECECEC` | Titulares y lectura. |
| Texto secundario | `#A3A3A3` | Fechas y metadatos, comprobando contraste en su fondo real. |
| Bordes | `#2C2C2C` | Separación decorativa; los controles requieren una distinción suficiente por sí mismos. |

Usar grano estático de muy baja opacidad, inicialmente entre 2 % y 4 %, solo sobre fondos. Revisarlo con las imágenes reales y retirarlo si empeora la lectura. No superponerlo a films, fotografías o texto pequeño. Concentrar el lima en unos pocos puntos de atención por pantalla.

### Tipografía

Mantener dos familias como máximo: una sans serif expresiva para titulares y lectura, y una monoespaciada para índices, fechas y datos breves. Seleccionar las fuentes definitivas comprobando licencia, caracteres en español, legibilidad y coste de carga.

| Elemento | Escritorio | Móvil | Tratamiento |
| --- | --- | --- | --- |
| Titular inicial | 80 a 144 px | 44 a 64 px | Escala fluida con `clamp`, salto de línea diseñado. |
| Títulos de sección | 48 a 80 px | 32 a 44 px | Pocas palabras y separación generosa. |
| Título de campaña | 28 a 40 px | 24 a 32 px | Prioridad sobre los metadatos. |
| Texto de lectura | 16 a 18 px | 16 a 18 px | Interlineado de 1,5 a 1,65 y ancho de 55 a 70 caracteres. |
| Metadatos | 12 a 14 px | 12 a 14 px | Monoespaciada; evitar párrafos completos en mayúsculas. |

Estos rangos son puntos de partida. Ajustarlos según la fuente y el espacio disponible, sin recortes ni desbordamiento al ampliar el texto.

### Composición

Proponer una retícula de 12 columnas en escritorio, 6 en tablet y 4 en móvil. Usar márgenes fluidos de 24 a 80 px, reducidos a 16 px en pantallas muy estrechas, y separaciones de 16 a 24 px. Construir el ritmo con una unidad de 8 px.

La portada tendrá una introducción breve y tres campañas destacadas, elegidas por calidad de presentación y diversidad del trabajo. El listado completo seguirá accesible. Alternar piezas grandes con parejas de tarjetas cuando la composición lo justifique; evitar una sucesión de bloques idénticos.

En los casos, separar con claridad introducción, film y piezas gráficas. Las imágenes que contienen texto necesitan espacio para leerse. Apilar las columnas de Cheetos cuando su ancho impida entender las piezas, manteniendo el orden de contenido. Terminar cada caso con navegación al siguiente proyecto. El contacto permanece en la navegación y el cierre general, sin recuperar el enlace eliminado dentro de los casos.

## 5 Lenguaje de movimiento

La animación debe explicar un cambio, dar respuesta a una acción o dirigir brevemente la atención. Esta es también la recomendación de Nielsen Norman Group para evitar movimiento que distraiga de la tarea. [Animation for a Purpose](https://www.nngroup.com/articles/animation-purpose-ux/).

| Token propuesto | Duración | Uso |
| --- | --- | --- |
| Respuesta | 120 ms | Cambio de color y estado al pulsar. |
| Interacción | 180 ms | Hover, controles y pequeños desplazamientos. |
| Transición | 320 ms | Portadas, paneles y capas. |
| Entrada principal | 550 ms máximo | Un momento inicial de identidad. |

Curva de salida sugerida: `cubic-bezier(.22, 1, .36, 1)`. Desplazamientos habituales de 8 a 12 px; botones de 2 a 4 px; ampliación de imágenes hasta 1,025. Si varios elementos entran juntos, separación de 40 a 60 ms y duración total breve.

Mantener scroll nativo. El texto y los enlaces del HTML inicial deben ser legibles aunque falle JavaScript. Con movimiento reducido, mostrar el estado final de las entradas y usar cambios instantáneos o fundidos mínimos; conservar todas las funciones. Evitar animación continua en varios puntos de la misma pantalla.

## 6 Catálogo de efectos

Salvo el reproductor, todas las filas son propuestas pendientes de implementación. Los tiempos describen objetivos de diseño que deben validarse con el contenido real.

| Zona | Disparador y efecto | Duración | Móvil y movimiento reducido | Prioridad |
| --- | --- | --- | --- | --- |
| Introducción | Una alineación breve de Search y el titular, sin retrasar la lectura ni añadir una pantalla de carga. | Hasta 550 ms | Composición estática con todo el texto visible. | P2 |
| Tarjeta de campaña | Hover o foco: leve ampliación de imagen y desplazamiento de la flecha. Imagen en color desde el inicio. | 180 ms | Pulsación y foco con respuesta de color; sin depender de hover. | P1 |
| Apertura de caso | Continuidad entre portada y cabecera del caso, preservando ruta, historial y regreso al listado. | 320 ms | Fundido sencillo; apertura inmediata con movimiento reducido. | P2 |
| Envy Meter | Al activarlo: exploración breve y localizada de la imagen, seguida de respuesta del indicador. Cámara solicitada después de una acción explícita. | 320 a 550 ms | Experiencia contenida; respuesta estática equivalente. | P2 |
| Reconocimientos | Al desplegar: transición corta del contenido y cambio claro del indicador. | 180 a 240 ms | Mismo acceso por toque y teclado; instantáneo con movimiento reducido. | P1 |
| Contacto general | Hover o foco: desplazamiento pequeño de flecha y cambio de color. | 180 ms | Acción táctil clara; enlace usable sin animación. | P1 |
| Films de Vimeo | Portada hasta el evento `playing`, fundido al film y controles que se ocultan por inactividad. | 320 ms de portada; 180 ms de controles | Toque revela controles; foco de teclado los mantiene visibles. | Implementado |

El cursor personalizado debería reducirse a un indicador discreto en dispositivos con puntero preciso. No debe cubrir texto, controles o la imagen principal. En móvil, campos y controles de reproducción, utilizar el comportamiento nativo. Los efectos de tarjeta deben funcionar también mediante foco.

## 7 Especificación del reproductor implementado

La portada de cada campaña permanece durante la carga y se desvanece cuando el SDK de Vimeo confirma reproducción mediante `playing`. El iframe ocupa todo el encuadre. Los controles se superponen con un degradado, sin reservar una franja permanente debajo del film.

Durante reproducción, los controles se ocultan tras 2,2 segundos de inactividad. Reaparecen al mover el cursor, tocar el video o usar el teclado. Permanecen visibles en pausa, carga, error, con foco de teclado dentro del reproductor y durante el ajuste de un deslizador. La pantalla completa conserva la interfaz propia cuando la plataforma la permite.

El primer Play solicita sonido activado y volumen completo; después se respetan los ajustes del visitante. Si el navegador requiere otra acción para reproducir, se muestra una indicación. Las limitaciones del volumen en algunos móviles dependen del dispositivo.

Los clips MP4 del layout continúan como piezas automáticas silenciadas en bucle, sin controles individuales. Spotify carga su iframe original directamente. Solo Vimeo utiliza este reproductor.

Las pruebas de integración utilizan el SDK oficial de Vimeo con un iframe de protocolo simulado. Esta conexión restringe el acceso a los films remotos: será necesario comprobar su reproducción desde una conexión normal antes de publicar la versión candidata. Una simulación de integración no certifica la disponibilidad de los films del proveedor.

## 8 Comportamiento y accesibilidad

Diseñar áreas táctiles de al menos 44 por 44 px para acciones importantes como cierre, menú y reproducción. Es un objetivo de este proyecto. WCAG 2.2 establece un mínimo de 24 por 24 px para el criterio 2.5.8, con excepciones y alternativas de espaciado que deben evaluarse en contexto. [Explicación del criterio de tamaño mínimo](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

Proponer un control global para pausar el movimiento del layout, manteniendo los clips sin reproductor individual. La preferencia del sistema para reducir movimiento seguirá respetándose. El movimiento automático prolongado junto a otro contenido requiere revisar los mecanismos de pausa, parada u ocultación; la preferencia del sistema por sí sola no demuestra cumplimiento. [Explicación de Pause Stop Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).

Todo el recorrido debe tener foco visible y orden predecible. Al cerrar un caso desde el listado, devolver el foco a su tarjeta y conservar la posición de lectura. Una visita directa a la URL del caso debe tener una salida clara al listado. Escape cierra la capa correspondiente, respetando primero la salida de pantalla completa.

El escáner compacto abrirá un panel con explicación breve, acción de inicio y cierre. Debe liberar la cámara al cerrar y mostrar estados claros de permiso, carga y error. No cubrirá campañas mientras esté inactivo. Los mensajes de carga reflejarán estados reales, sin porcentajes ficticios ni demoras artificiales.

## 9 Rendimiento y SEO

Los objetivos de Core Web Vitals son LCP de hasta 2,5 s, INP de hasta 200 ms y CLS de hasta 0,1, evaluados al percentil 75 y separados por dispositivo. Deben medirse con usuarios reales en la versión publicada; las pruebas locales no sustituyen esos datos. [Definición y umbrales de Core Web Vitals](https://web.dev/articles/vitals).

Presupuesto propuesto: mantener el JavaScript inicial por debajo de 500 KB minificados, reduciéndolo cuando la dirección visual permita simplificar código. Es un límite interno del proyecto, no un criterio oficial de Awwwards. Mantener el motor de visión y el SDK de Vimeo diferidos. No cargar modelos o films antes de que el visitante los solicite.

Animar principalmente `transform` y `opacity`. Usar 60 fps como objetivo en dispositivos adecuados y comprobar fluidez en un móvil de gama media real. Reducir efectos si generan bloqueos. No incorporar WebGL sin un prototipo que demuestre una mejora visual clara y una alternativa ligera.

Conservar rutas propias de los casos, HTML prerenderizado, títulos, descripción, canonical, imágenes sociales, sitemap y datos estructurados. Las nuevas transiciones deben funcionar sobre esta estructura. Revisar que nombres de campañas, cliente y descripción sigan disponibles sin JavaScript y que los enlaces no dependan exclusivamente de eventos de animación.

## 10 Referencias y criterio propio

[Ochi Design](https://www.awwwards.com/sites/ochi-design) es una referencia de identidad y una interacción memorable, como sus ojos que siguen al puntero. La lectura propuesta para este proyecto es concentrar personalidad en un gesto que pertenezca al concepto. No copiar su recurso gráfico ni su composición.

Usar el [portafolio de Dennis Snellenberg](https://www.awwwards.com/sites/dennis-snellenberg) como referencia de estudio para el recorrido de un portafolio. Comparar jerarquía, entrada a proyectos y continuidad de navegación con el prototipo de Sergio; las decisiones deben justificarse por el contenido de este sitio.

## 11 Plan de implementación

| Fase | Entregable | Condición para avanzar |
| --- | --- | --- |
| 1 Dirección de arte | Tipografía, retícula, tratamiento de portadas, grano reducido y escáner compacto. | Portada, un caso y reconocimientos coherentes en escritorio y móvil. |
| 2 Sistema de interacción | Tarjetas, regreso al listado, foco, contacto, pausa global de movimiento y catálogo aplicado. | Recorrido completo por mouse, tacto y teclado, sin contenido tapado. |
| 3 Firma del sitio | Un prototipo del momento Envy Meter y continuidad de apertura de casos. | El efecto se entiende, tiene alternativa estática y no empeora la navegación. |
| 4 Versión candidata | Ajuste de los nueve casos, rendimiento, pruebas reales y revisión editorial final. | Films disponibles, enlaces y medios completos, sin fallos conocidos que impidan consultar el trabajo. |

Mapa técnico: `src/index.css` concentra estilos y tokens; `src/App.tsx`, composición y navegación; `src/components/VideoPlayer.tsx`, films de Vimeo; `src/components/ProjectMedia.tsx`, clips e imágenes; `src/components/ScannerLauncher.tsx` y `EnvyMeterWidget.tsx`, experiencia del medidor; `src/data/portfolio.ts`, contenido aprobado.

## 12 Revisión de la versión candidata

- Revisar 320, 390, 768, 1440 y 1920 px: cortes de texto, encuadres, capas y desplazamiento horizontal.
- Completar el recorrido con teclado y movimiento reducido, incluidos diálogos, deslizadores y regreso al listado.
- Probar Safari y Chrome, un iPhone y un Android reales; separar estos resultados de los de Chrome automatizado.
- Reproducir los films de Vimeo desde una conexión normal; comprobar sonido inicial, pausa, avance, reintento y pantalla completa según plataforma.
- Comprobar Spotify directo y clips sin controles; verificar pausa global cuando se implemente.
- Revisar legibilidad de todas las piezas, nombres, años y premios. Mantener Best Ads on TV y los reconocimientos repetidos enviados por Sergio.
- Ejecutar build, lint y verificación del build; comprobar páginas sin JavaScript y rutas públicas tras publicar.
- Medir rendimiento y recoger datos reales cuando haya tráfico suficiente, documentando la falta de datos si la muestra es pequeña.
- Hacer una revisión independiente con las cuatro dimensiones de Awwwards. Registrar problemas concretos antes de presentar la candidatura.

La primera implementación recomendada tras esta guía es la fase 1: composición editorial, portadas cuidadas y escáner compacto. Permitirá evaluar el carácter visual del sitio antes de invertir en la interacción distintiva.
