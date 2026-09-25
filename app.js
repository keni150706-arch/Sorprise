/* =============================================================
   JARDÍN DE CUMPLEAÑOS · Sin dependencias · Todo editable ✿
   Personaliza tus contenidos desde datos.js o desde el editor.
   Los mensajes del formulario solo se guardan en ESTE navegador.
   ============================================================= */
(() => {
  'use strict';
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const STORE = 'jardin-cumpleanos-config-v1';
  const GUEST_STORE = 'jardin-cumpleanos-notas-v1';
  const DEFAULTS = structuredClone(window.BIRTHDAY_DATA);
  const copy = object => structuredClone(object);
  const safeImage = path => typeof path === 'string' && (/^(?:assets\/|\.\/?|https?:\/\/|data:image\/(?:png|jpeg|webp|gif|svg\+xml);base64,)/i.test(path)) ? path : 'assets/ilustraciones/foto1.svg';
  const safeAudio = path => typeof path === 'string' && /^(?:assets\/|\.\/?|https?:\/\/)/i.test(path) ? path : '';
  const normalize = raw => {
    const obj = raw && typeof raw === 'object' ? raw : {};
    const result = copy(DEFAULTS);
    for (const group of ['general', 'tema']) {
      if (obj[group] && typeof obj[group] === 'object' && !Array.isArray(obj[group])) {
        for (const key of Object.keys(result[group])) {
          if (typeof obj[group][key] === 'string') result[group][key] = obj[group][key].slice(0, 20000);
        }
      }
    }
    for (const group of ['historia', 'fotos', 'amigas', 'confesiones', 'cartas', 'deseos', 'canciones', 'preguntas']) {
      if (Array.isArray(obj[group]) && obj[group].length <= 80) result[group] = copy(obj[group]);
    }
    return result;
  };
  // Algunos navegadores restringen localStorage al abrir una web local.
  // La página seguirá funcionando y se podrá exportar datos.js igualmente.
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } },
    remove(key) { try { localStorage.removeItem(key); } catch { /* modo privado */ } }
  };
  const savedConfig = storage.get(STORE);
  let data;
  try { data = savedConfig ? normalize(JSON.parse(savedConfig)) : copy(DEFAULTS); } catch { data = copy(DEFAULTS); }
  let guestNotes = [];
  try { const parsed = JSON.parse(storage.get(GUEST_STORE) || '[]'); guestNotes = Array.isArray(parsed) ? parsed.filter(s => typeof s === 'string').slice(0, 30) : []; } catch { /* clean default */ }
  let toastTimer;
  function toast(message) {
    const el = $('#toast'); el.textContent = message; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
  }
  const el = (tag, cls, txt) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (txt !== undefined) node.textContent = String(txt);
    return node;
  };
  function applyTheme() {
    const style = document.documentElement.style;
    for (const [key, variable] of [['crema','--cream'],['rosa','--rose'],['vino','--wine'],['verde','--sage']]) {
      if (/^#[0-9a-fA-F]{6}$/.test(data.tema[key])) style.setProperty(variable, data.tema[key]);
    }
  }
  function renderGeneral() {
    $$('[data-bind]').forEach(node => {
      const [, key] = node.dataset.bind.split('.');
      if (typeof data.general[key] === 'string') node.textContent = data.general[key];
    });
    $('#recipientName').textContent = data.general.para;
    $('#heroImage').src = safeImage(data.general.portada);
    document.title = `${data.general.titulo} · Para ${data.general.para} ✿`;
  }
  function renderStory() {
    const target = $('#timeline'); target.replaceChildren();
    for (const item of data.historia) {
      const entry = el('article', 'timeline-item');
      entry.append(el('span', 'timeline-date', item.fecha || ''), el('h3', '', item.titulo || ''), el('p', '', item.texto || ''));
      target.append(entry);
    }
  }
  let photoIndex = 0;
  function showPhoto(index) {
    const gallery = data.fotos;
    if (!gallery.length) return;
    photoIndex = (index + gallery.length) % gallery.length;
    const item = gallery[photoIndex];
    $('#lightboxImg').src = safeImage(item.imagen);
    $('#lightboxImg').alt = item.titulo || 'Fotografía del álbum';
    $('#lightboxTitle').textContent = item.titulo || '';
    $('#lightboxCaption').textContent = item.nota || '';
    if (!$('#photoLightbox').open) $('#photoLightbox').showModal();
  }
  function renderPhotos() {
    const target = $('#photoGrid'); target.replaceChildren();
    data.fotos.forEach((item, index) => {
      const card = el('button', 'polaroid'); card.type = 'button';
      card.style.setProperty('--rotation', ['-3deg','2deg','-2deg','3deg','-1deg','2deg'][index % 6]);
      const img = el('img'); img.src = safeImage(item.imagen); img.alt = item.titulo || 'Recuerdo'; img.loading = 'lazy';
      card.append(img, el('h3', '', item.titulo || 'Nuestro recuerdo'), el('p', '', item.nota || ''));
      card.addEventListener('click', () => showPhoto(index)); target.append(card);
    });
  }
  function renderFriends() {
    const target = $('#friendsGrid'); target.replaceChildren();
    data.amigas.forEach((item) => {
      const button = el('button', 'friend-card'); button.type = 'button'; button.setAttribute('aria-pressed', 'false'); button.setAttribute('aria-label', `Leer mensaje de ${item.nombre || 'una amiga'}`);
      const inner = el('div', 'friend-card-inner'), front = el('div', 'friend-face friend-front'), back = el('div', 'friend-face friend-back');
      const img = el('img'); img.src = safeImage(item.foto); img.loading = 'lazy'; img.alt = `Foto de ${item.nombre || 'amiga'}`;
      front.append(img, el('h3', '', item.nombre || 'Mi amiga'), el('p', '', item.apodo || ''), el('div', 'flip-hint', 'TÓCAME PARA VER EL MENSAJE ↗'));
      back.append(el('span', 'friend-icon', '♡'), el('h3', '', item.nombre || 'Con cariño'), el('p', '', item.mensaje || ''));
      inner.append(front, back); button.append(inner);
      button.addEventListener('click', () => { const flipped = button.classList.toggle('is-flipped'); button.setAttribute('aria-pressed', String(flipped)); });
      target.append(button);
    });
  }
  function renderConfessions() {
    const target = $('#confessionsGrid'); target.replaceChildren();
    const notes = [...data.confesiones, ...guestNotes.map((text, i) => ({ titulo: `Nota especial ${i + 1}`, texto: text }))];
    notes.forEach((item, index) => {
      const note = el('article', 'confession-note'); note.style.setProperty('--rotation', ['-2deg','1.5deg','-1deg','1deg'][index % 4]);
      note.append(el('h3', '', item.titulo || 'Confesión'), el('p', '', item.texto || '')); target.append(note);
    });
  }
  let activeLetter = null;
  function renderLetters() {
    const target = $('#lettersGrid'); target.replaceChildren();
    data.cartas.forEach((item) => {
      const button = el('button', 'envelope'); button.type = 'button'; button.setAttribute('aria-label', `Abrir carta: ${item.titulo}`);
      button.append(el('span','seal','♡'), el('span','envelope-title',item.titulo || 'Una carta para ti'));
      button.addEventListener('click', () => openLetter(item)); target.append(button);
    });
  }
  function openLetter(item) {
    closeLetter();
    const overlay = el('div', 'letter-modal'); overlay.setAttribute('role', 'presentation');
    const paper = el('article', 'letter-paper'); paper.setAttribute('role','dialog'); paper.setAttribute('aria-modal','true'); paper.setAttribute('aria-label',item.titulo || 'Carta');
    const close = el('button','close-letter','×'); close.type='button'; close.setAttribute('aria-label','Cerrar carta');
    close.addEventListener('click',closeLetter);
    paper.append(close,el('div','letter-flower','✿'),el('h3','',item.titulo || 'Una carta para ti'),el('p','',item.texto || ''),el('small','',item.remitente || 'Con cariño'));
    overlay.append(paper); overlay.addEventListener('click',event => { if (event.target === overlay) closeLetter(); });
    document.body.append(overlay); activeLetter = overlay; close.focus();
  }
  function closeLetter() { if (activeLetter) { activeLetter.remove(); activeLetter = null; } }
  const flowerShapes = ['✿','❀','✾','✻','✽','✿','❋'];
  const flowerColors = ['#cc9298','#deb384','#9aae90','#bd9fbb','#daabb0','#e3b6a4','#acbda2'];
  function renderWishes() {
    const target = $('#wishGarden'); target.replaceChildren();
    data.deseos.forEach((message, i) => {
      const b = el('button','wish-flower'); b.type = 'button'; b.title = 'Descubrir un deseo'; b.setAttribute('aria-label',`Abrir deseo ${i+1}`);
      b.style.setProperty('--flower-color', flowerColors[i % flowerColors.length]);
      b.append(el('span','flower-head',flowerShapes[i % flowerShapes.length]),el('span','flower-stem'));
      b.addEventListener('click', () => {
        $$('.wish-flower').forEach(x => x.classList.remove('active')); b.classList.add('active');
        $('#wishDisplay').replaceChildren(el('span','','✧'),el('p','',typeof message === 'string' ? message : String(message)),el('span','','✧'));
      });
      target.append(b);
    });
  }
  function nextOccurrence(iso) {
    const parts = /^\d{4}-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!parts) return null;
    const m = +parts[1], day = +parts[2], now = new Date();
    if (!m || !day || m > 12 || day > 31) return null;
    let year = now.getFullYear(), date = new Date(year,m-1,day);
    if (date.getMonth() !== m-1 || date.getDate() !== day) return null;
    date.setHours(0,0,0,0);
    if (date.getTime() < new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime()) {
      year++; date = new Date(year,m-1,day);
      // Para 29 de febrero, se celebrará el 1 de marzo en años no bisiestos.
    }
    return date;
  }
  function renderCountdown() {
    const date = nextOccurrence(data.general.fecha);
    const numbers = $('#countdownNumbers');
    if (!date) { numbers.hidden = true; $('#countdownTitle').textContent='Cuenta regresiva'; $('#countdownDescription').textContent='Cada día puede tener un poquito de la magia de hoy. Si quieres, añade la fecha desde Personalizar para activar la cuenta regresiva.'; return; }
    const now = new Date(), target = date.getTime(), today = target - now.getTime();
    $('#countdownTitle').textContent = today <= 0 || (date.toDateString() === now.toDateString()) ? '¡Hoy es el gran día! 🎉' : `Falta poquito para el ${date.toLocaleDateString('es-PE',{day:'numeric',month:'long'})}`;
    $('#countdownDescription').textContent = date.toDateString() === now.toDateString() ? '¡Que comience la celebración!' : 'Cada día falta menos para celebrar.';
    if (date.toDateString() === now.toDateString()) { numbers.hidden = true; return; }
    numbers.hidden = false;
    const diff = Math.max(0,target-now.getTime());
    $('#countDays').textContent=String(Math.floor(diff/86400000)).padStart(2,'0');
    $('#countHours').textContent=String(Math.floor(diff%86400000/3600000)).padStart(2,'0');
    $('#countMinutes').textContent=String(Math.floor(diff%3600000/60000)).padStart(2,'0');
  }
  function renderPlaylist() {
    const target = $('#tracks'); target.replaceChildren();
    $('#audioPlayer').hidden = true; $('#audioPlayer').pause(); $('#audioPlayer').removeAttribute('src');
    data.canciones.forEach((item,i) => {
      const track=el('div','track'), details=el('div','track-details'), action=el('button','track-action','▶');
      details.append(el('strong','',item.titulo || `Canción ${i+1}`),el('span','',item.artista || 'Tu artista favorito'));
      const url = safeAudio(item.url);
      action.type='button'; action.disabled=!url;
      action.setAttribute('aria-label',`Reproducir ${item.titulo || 'canción'}`);
      action.title=url ? 'Escuchar canción' : 'Personaliza la URL de esta canción';
      action.addEventListener('click', () => {
        if (/\.(mp3|wav|ogg|m4a)(?:\?.*)?$/i.test(url)) { const player=$('#audioPlayer'); player.hidden=false; player.src=url; player.play().catch(()=>toast('No se encontró el audio. Revisa su ruta o pulsa reproducir en el reproductor.')); }
        else if (/^https?:\/\//i.test(url)) window.open(url,'_blank','noopener,noreferrer');
      });
      track.append(el('span','track-number',String(i+1).padStart(2,'0')),details,action);target.append(track);
    });
  }
  let quizIndex=0, quizScore=0, quizAnswered=false;
  function renderQuiz() {
    const q = data.preguntas[quizIndex]; const panel=$('#quizOptions'); panel.replaceChildren();
    if (!q) {
      $('#quizCounter').textContent='¡JUEGO COMPLETADO!'; $('#quizQuestion').textContent=`¡${quizScore} de ${data.preguntas.length} respuestas!`;
      $('#quizFeedback').textContent='Lo importante es compartir más momentos bonitos. ♡';
      $('#quizNext').textContent='Volver a jugar ↻'; $('#quizNext').hidden=false;return;
    }
    quizAnswered=false; $('#quizCounter').textContent=`PREGUNTA ${quizIndex+1} / ${data.preguntas.length}`;
    $('#quizQuestion').textContent=q.pregunta || 'Una preguntita'; $('#quizFeedback').textContent=''; $('#quizNext').hidden=true;
    const options=Array.isArray(q.opciones)?q.opciones:[];
    options.forEach((opt,i)=>{
      const button=el('button','quiz-option',`${String.fromCharCode(65+i)}. ${opt}`);button.type='button';
      button.addEventListener('click',()=>{
        if (quizAnswered) return;quizAnswered=true;
        const correct=Number(q.correcta)===i;if(correct) quizScore++;
        $$('.quiz-option',panel).forEach((b,j)=>{b.disabled=true;if(j===Number(q.correcta))b.classList.add('correct');else if(j===i)b.classList.add('incorrect');});
        $('#quizFeedback').textContent=`${correct?'¡Acertaste! ♡':'¡Casi! ♡'} ${q.explicacion || ''}`;
        $('#quizNext').hidden=false;$('#quizNext').textContent=quizIndex===data.preguntas.length-1?'Ver resultado →':'Siguiente pregunta →';
      });panel.append(button);
    });
    if (!options.length) $('#quizFeedback').textContent='Agrega respuestas desde el editor.';
  }
  function renderAll() {
    applyTheme(); renderGeneral(); renderStory(); renderPhotos(); renderFriends(); renderConfessions(); renderLetters(); renderWishes(); renderCountdown(); renderPlaylist(); quizIndex=0;quizScore=0;renderQuiz();
  }
  // Interacciones de la vela: tres soplidos con botón, también accesible con teclado.
  let blows=0;
  function confetti() {
    const target=$('#confettiLayer');target.replaceChildren();
    const colors=['#d58b9a','#e7c4a0','#8b9e7d','#f8dbe1','#b89eaf','#f0e6c6'];
    for(let i=0;i<75;i++){
      const part=el('span','confetti');
      part.style.setProperty('--x',`${(i*61.8)%100}%`);
      part.style.setProperty('--s',`${5+(i*7)%9}px`);
      part.style.setProperty('--c',colors[i%colors.length]);
      part.style.setProperty('--dur',`${2+(i*11)%18/10}s`);
      part.style.setProperty('--r',`${(i*37)%360}deg`);
      part.style.setProperty('--drift',`${(i%2?-1:1)*(30+(i*7)%170)}px`);
      part.style.setProperty('--round',i%3===0?'50%':'2px');
      part.style.animationDelay=`${(i*13)%40/100}s`;target.append(part);
    }
    setTimeout(()=>target.replaceChildren(),4700);
  }
  function blow() {
    if (blows>=3) return;
    blows++;$('#blowProgress').style.width=`${blows/3*100}%`;
    if(blows===3){
      $('.candle-wrapper').classList.add('extinguished');
      $('#candleStatus').textContent='¡Yujuuu! ¡Sorpresa! ✨';
      $('#blowButton').hidden=true;$('#relightButton').hidden=false;$('#candleSurprise').hidden=false;confetti();
    }else $('#candleStatus').textContent=blows===1?'¡Muy bien! ¡Faltan dos soplidos! 🌬️':'¡Una vez más! ¡Ya casi! ♡';
  }
  function relight() {blows=0;$('.candle-wrapper').classList.remove('extinguished');$('#blowProgress').style.width='0';$('#candleStatus').textContent='Cierra los ojos y piensa en tu deseo…';$('#blowButton').hidden=false;$('#relightButton').hidden=true;$('#candleSurprise').hidden=true;}

  // Editor visual. Se trabaja en un borrador hasta pulsar «Guardar cambios».
  let draft = copy(data), currentTab='general';
  const labels={
    general:{para:['¿Para quién es?','Ej.: Valeria'],de:['¿De parte de quién?','Ej.: Tu mejor amiga'],titulo:['Título principal','¡Feliz cumpleaños!'],subtitulo:['Frase de bienvenida','Un deseo bonito'],dedicatoria:['Texto de nuestra historia','Una dedicatoria especial'],fecha:['Fecha del cumpleaños','AAAA-MM-DD'],etiqueta:['Pequeño texto de portada','Un rinconcito hecho con amor'],portada:['Imagen de portada','Ruta a imagen o URL'],historiaTitulo:['Título de historia','Las cosas bonitas que nos unen'],historiaTexto:['Introducción a la historia','Su historia empieza aquí'],mensajeFinal:['Mensaje de despedida','Un hermoso deseo final'],sorpresaSecreta:['Mensaje oculto de la vela','¡Tu sorpresa!']},
    historia:{fecha:'Momento / Fecha',titulo:'Título del recuerdo',texto:'¿Qué pasó?'},
    fotos:{titulo:'Título de la foto',nota:'Pie de foto',imagen:'Imagen / ruta'},
    amigas:{nombre:'Nombre de la amiga',apodo:'Apodo especial',mensaje:'Mensaje al girar la tarjeta',foto:'Fotografía / ruta'},
    confesiones:{titulo:'Título de confesión',texto:'Confesión'},
    cartas:{titulo:'Título de la carta',remitente:'Firma',texto:'Texto completo de la carta'},
    canciones:{titulo:'Nombre de la canción',artista:'Artista o dedicatoria',url:'URL musical o ruta al archivo MP3'},
    preguntas:{pregunta:'Pregunta',opciones:'Respuestas (una por línea)',correcta:'Número de la respuesta correcta (1, 2, 3...)',explicacion:'Mensaje que aparece al responder'}
  };
  const tabTitles={general:'El mensaje principal',historia:'Su historia',fotos:'El álbum de fotos',amigas:'Las tarjetas de amigas',confesiones:'Las confesiones',cartas:'Las cartitas',deseos:'Los deseos secretos',canciones:'La playlist',preguntas:'El mini juego',tema:'Los colores de tu jardín'};
  const tabHelp={general:'Cambia cada detalle de la portada, la fecha, la dedicatoria y el mensaje secreto de la vela. Puedes subir una imagen propia para reemplazar al gatito.',historia:'Cuenta su historia en tarjetas cronológicas. Añade tantos recuerdos como quieras.',fotos:'Sube fotos directamente desde tu computadora: se comprimen y quedan guardadas en la configuración exportada.',amigas:'Crea una tarjeta para cada amiga, con fotografía, apodo y mensaje sorpresa al tocar.',confesiones:'Estas confesiones se verán en todos los dispositivos cuando compartas tu web personalizada. Las escritas por visitantes solo se guardan localmente.',cartas:'Cada carta será un sobre interactivo que se abre al tocarlo.',deseos:'Una flor aparecerá por cada deseo escrito.',canciones:'Coloca enlaces de YouTube, Spotify u otros (se abrirán en otra pestaña), o la ruta de un MP3 local dentro de assets/musica/.',preguntas:'Edita las preguntas, tres opciones y la respuesta correcta. Usa 1 para la primera opción.',tema:'Elige cuatro colores. El diseño cambiará al guardar; los tonos pastel de base quedan en estilos.css.'};
  const sample={historia:{fecha:'Un día especial',titulo:'Nuestro recuerdo',texto:'Aquí va una anécdota.'},fotos:{titulo:'Un momento bonito',nota:'Una frase sobre esta foto',imagen:'assets/ilustraciones/foto1.svg'},amigas:{nombre:'Mi amiga',apodo:'La compañera de aventuras',mensaje:'Un mensaje de cariño',foto:'assets/ilustraciones/foto2.svg'},confesiones:{titulo:'Una confesión',texto:'Hay algo que siempre quise decir…'},cartas:{titulo:'Para ti',remitente:'Con cariño',texto:'Esta es una carta llena de buenos deseos.'},deseos:'Que este año esté lleno de flores y sonrisas.',canciones:{titulo:'Una canción especial',artista:'Nuestra playlist',url:''},preguntas:{pregunta:'¿Cuál es nuestro plan favorito?',opciones:['Un café','Una salida','Una película'],correcta:0,explicacion:'¡Qué bonitos recuerdos!'}};
  function field(label,key,value,onInput,options={}){
    const wrap=el('div',`field${options.full?' full':''}`);
    const id=`field-${currentTab}-${key}-${Math.random().toString(36).slice(2,8)}`;
    const lab=el('label','',label);lab.htmlFor=id;
    let input;
    if(options.select){input=el('select');options.select.forEach((text,i)=>{const opt=el('option','',text);opt.value=String(i);input.append(opt)});input.value=String(value ?? 0);}
    else if(options.area){input=el('textarea');input.rows=options.rows||3;input.value=value??'';}
    else {input=el('input');input.type=options.type||'text';input.value=value??'';if(options.type==='color')input.classList.add('editor-swatch');if(options.placeholder)input.placeholder=options.placeholder;}
    input.id=id;input.addEventListener('input',()=>{onInput(input.value);$('#saveState').textContent='Cambios sin guardar';});
    wrap.append(lab,input);
    if(options.help)wrap.append(el('small','',options.help));
    return wrap;
  }
  async function compressImage(file) {
    if(!file.type.startsWith('image/'))throw new Error('Selecciona una imagen JPG, PNG o WEBP.');
    if(file.size>25*1024*1024)throw new Error('La imagen pesa demasiado (máximo 25 MB).');
    const url=URL.createObjectURL(file);
    try {
      const picture=new Image();picture.src=url;await picture.decode();
      const scale=Math.min(1,1000/Math.max(picture.naturalWidth,picture.naturalHeight));
      const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(picture.naturalWidth*scale));canvas.height=Math.max(1,Math.round(picture.naturalHeight*scale));
      const ctx=canvas.getContext('2d');ctx.fillStyle='#fffaf5';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(picture,0,0,canvas.width,canvas.height);
      return canvas.toDataURL('image/jpeg',0.74);
    }finally{URL.revokeObjectURL(url);}
  }
  function addImageUpload(parent,onImage) {
    const wrap=el('div','field full');const label=el('label','','O sube una fotografía de tu equipo');
    const input=el('input');input.type='file';input.accept='image/jpeg,image/png,image/webp';
    input.addEventListener('change',async()=>{
      if(!input.files?.[0])return;
      try {const src=await compressImage(input.files[0]);onImage(src);toast('Fotografía cargada y optimizada ♡');renderEditor();}
      catch(error){toast(error.message || 'No se pudo leer la imagen.');}
    });wrap.append(label,input,el('small','','La imagen se comprime antes de guardarse. Exporta datos.js para llevarla contigo.'));parent.append(wrap);
  }
  function renderEditor() {
    const panel=$('#editorPanel');panel.replaceChildren(el('h3','',tabTitles[currentTab]),el('p','editor-help',tabHelp[currentTab]));
    $$('.editor-tabs button').forEach(btn=>btn.classList.toggle('selected',btn.dataset.tab===currentTab));
    if(currentTab==='general') {
      const fields=el('div','editor-fields');
      for(const [key,[label,placeholder]]of Object.entries(labels.general)){
        const big=['subtitulo','dedicatoria','historiaTexto','mensajeFinal','sorpresaSecreta'].includes(key);
        fields.append(field(label,key,draft.general[key],val=>draft.general[key]=val,{area:big,full:big||['portada'].includes(key),type:key==='fecha'?'date':'text',placeholder}));
        if(key==='portada')addImageUpload(fields,src=>draft.general.portada=src);
      }
      panel.append(fields);return;
    }
    if(currentTab==='tema'){
      const fields=el('div','editor-fields');
      for(const [key,label]of [['crema','Color crema / fondo'],['rosa','Rosa floral'],['vino','Color principal'],['verde','Verde salvia']])fields.append(field(label,key,draft.tema[key],val=>draft.tema[key]=val,{type:'color'}));
      panel.append(fields);return;
    }
    if(currentTab==='deseos'){
      const list=el('div','editor-list');
      draft.deseos.forEach((item,i)=>{
        const entry=el('div','editor-item'),head=el('div','editor-item-head');head.append(el('strong','',`Flor ${i+1}`),deleteItem('deseos',i));
        const fields=el('div','editor-fields');fields.append(field('Texto del deseo',String(i),item,val=>draft.deseos[i]=val,{full:true,area:true}));
        entry.append(head,fields);list.append(entry);
      });panel.append(list,addItem('deseos'));return;
    }
    const list=el('div','editor-list'),fieldsFor=labels[currentTab];
    draft[currentTab].forEach((item,i)=>{
      const entry=el('div','editor-item'),head=el('div','editor-item-head');head.append(el('strong','',`${{historia:'Recuerdo',fotos:'Foto',amigas:'Amiga',confesiones:'Confesión',cartas:'Carta',canciones:'Canción',preguntas:'Pregunta'}[currentTab]} ${i+1}`),deleteItem(currentTab,i));
      const fields=el('div','editor-fields');
      for(const [key,label] of Object.entries(fieldsFor)) {
        if(key==='correcta'){
          fields.append(field(label,key,Number(item[key]||0),val=>item[key]=Number(val),{select:['1. Primera','2. Segunda','3. Tercera']}));
          continue;
        }
        const multi=['texto','mensaje','explicacion'].includes(key)||key==='opciones';
        const value=key==='opciones'?(Array.isArray(item.opciones)?item.opciones.join('\n'):''):item[key];
        fields.append(field(label,key,value,val=>{if(key==='opciones')item.opciones=val.split('\n').slice(0,6);else item[key]=val;},{full:multi||['imagen','foto','url'].includes(key),area:multi,rows:key==='texto'?4:3}));
        if(['imagen','foto'].includes(key)){
          if(item[key]){const preview=el('img','editor-thumb');preview.src=safeImage(item[key]);preview.alt='Vista previa de la foto';fields.append(preview);}
          addImageUpload(fields,src=>item[key]=src);
        }
      }
      entry.append(head,fields);list.append(entry);
    });panel.append(list,addItem(currentTab));
  }
  function deleteItem(group,index){const b=el('button','small-button danger','Eliminar');b.type='button';b.addEventListener('click',()=>{draft[group].splice(index,1);renderEditor();$('#saveState').textContent='Cambios sin guardar';});return b;}
  function addItem(group){const b=el('button','add-button',`＋ Añadir ${group==='fotos'?'foto':group==='amigas'?'amiga':group==='preguntas'?'pregunta':group==='cartas'?'carta':group==='deseos'?'deseo':'elemento'}`);b.type='button';b.addEventListener('click',()=>{draft[group].push(copy(sample[group]));renderEditor();$('#saveState').textContent='Cambios sin guardar';$('#editorPanel').scrollTop=$('#editorPanel').scrollHeight;});return b;}
  function openEditor(){draft=copy(data);currentTab='general';$('#saveState').textContent='Listo para personalizar';renderEditor();$('#editorDialog').showModal();}
  function saveEditor(){
    const prepared=normalize(draft);
    data=prepared;renderAll();
    const saved=storage.set(STORE,JSON.stringify(prepared));
    storage.set(GUEST_STORE,JSON.stringify(guestNotes));
    $('#saveState').textContent=saved?'¡Guardado! ♡':'Exporta tus datos para conservarlos';
    toast(saved?'¡Tu jardín ha sido personalizado! ✿':'Tu navegador no puede guardar estos cambios. Descarga datos.js antes de cerrar.');
    if(saved)$('#editorDialog').close();
  }
  function downloadFile(name,content,mime){
    const blob=new Blob([content],{type:mime}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
  }
  function exportJSON(){downloadFile('mi-cumpleanos-personalizado.json',JSON.stringify({config:draft,mensajesDeInvitados:guestNotes},null,2),'application/json;charset=utf-8');toast('¡Archivo JSON descargado! ♡');}
  function exportJS(){downloadFile('datos.js','/* Archivo personalizado. Reemplaza datos.js en tu carpeta para compartir el sitio. */\nwindow.BIRTHDAY_DATA = '+JSON.stringify(draft,null,2)+';\n','text/javascript;charset=utf-8');toast('¡datos.js personalizado descargado! Reemplázalo en la carpeta del proyecto.');}
  async function importJSON(file){
    if(!file)return;
    if(file.size>15*1024*1024){toast('El archivo es demasiado grande.');return;}
    try{const parsed=JSON.parse(await file.text());draft=normalize(parsed.config||parsed);if(Array.isArray(parsed.mensajesDeInvitados))guestNotes=parsed.mensajesDeInvitados.filter(x=>typeof x==='string').slice(0,30);renderEditor();$('#saveState').textContent='Importado: pulsa Guardar cambios';toast('¡Configuración importada! Pulsa Guardar cambios.');}
    catch{toast('Este archivo no contiene una configuración JSON válida.');}
    $('#importInput').value='';
  }
  function setupEvents() {
    $('#menuToggle').addEventListener('click',()=>{const nav=$('#mobileNav');nav.hidden=!nav.hidden;$('#menuToggle').setAttribute('aria-expanded',String(!nav.hidden));});
    $$('#mobileNav a').forEach(link=>link.addEventListener('click',()=>{$('#mobileNav').hidden=true;$('#menuToggle').setAttribute('aria-expanded','false');}));
    ['#editTop','#editMobile','#editFooter'].forEach(id=>$(id).addEventListener('click',()=>{$('#mobileNav').hidden=true;openEditor();}));
    $('#closeLightbox').addEventListener('click',()=>$('#photoLightbox').close());
    $('#photoLightbox').addEventListener('click',event=>{if(event.target===$('#photoLightbox'))$('#photoLightbox').close();});
    $('#prevPhoto').addEventListener('click',()=>showPhoto(photoIndex-1));$('#nextPhoto').addEventListener('click',()=>showPhoto(photoIndex+1));
    document.addEventListener('keydown',event=>{if(event.key==='Escape')closeLetter();if($('#photoLightbox').open){if(event.key==='ArrowLeft')showPhoto(photoIndex-1);if(event.key==='ArrowRight')showPhoto(photoIndex+1);}});
    $('#confessionForm').addEventListener('submit',event=>{
      event.preventDefault();const input=$('#confessionInput'),value=input.value.trim();if(value.length<3)return;
      if(guestNotes.length>=30){toast('Llegaste al máximo de 30 mensajes locales.');return;}
      guestNotes.push(value);if(!storage.set(GUEST_STORE,JSON.stringify(guestNotes)))toast('Tu navegador no pudo guardar este mensaje; puedes exportar el JSON.');
      input.value='';renderConfessions();toast('¡Tu confesión quedó en este navegador! ♡');
    });
    $('#blowButton').addEventListener('click',blow);$('#relightButton').addEventListener('click',relight);
    $('#quizNext').addEventListener('click',()=>{if(quizIndex>=data.preguntas.length){quizIndex=0;quizScore=0;}else quizIndex++;renderQuiz();});
    $('#giftButton').addEventListener('click',()=>{const reveal=$('#giftReveal');reveal.hidden=!reveal.hidden;if(!reveal.hidden)confetti();});
    $('#closeEditor').addEventListener('click',()=>$('#editorDialog').close());
    $('#editorTabs').addEventListener('click',event=>{const btn=event.target.closest('button[data-tab]');if(btn){currentTab=btn.dataset.tab;renderEditor();$('#editorPanel').scrollTop=0;}});
    $('#saveButton').addEventListener('click',saveEditor);
    $('#exportButton').addEventListener('click',exportJSON);$('#exportJSButton').addEventListener('click',exportJS);
    $('#importButton').addEventListener('click',()=>$('#importInput').click());$('#importInput').addEventListener('change',event=>importJSON(event.target.files[0]));
    $('#resetButton').addEventListener('click',()=>{if(window.confirm('¿Restaurar todos los textos, fotos y colores de ejemplo? Esta acción elimina la personalización guardada en este navegador.')){storage.remove(STORE);storage.remove(GUEST_STORE);guestNotes=[];draft=copy(DEFAULTS);data=copy(DEFAULTS);renderAll();renderEditor();$('#saveState').textContent='Ejemplo restaurado';toast('Ejemplo restaurado.');}});
    // Una barra de navegación activa sin interrumpir al usuario.
    if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){$$('.desktop-nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));}});},{rootMargin:'-25% 0px -65% 0px'});$$('main > section[id]').forEach(section=>observer.observe(section));}
  }
  renderAll();setupEvents();setInterval(renderCountdown,30000);
})();
