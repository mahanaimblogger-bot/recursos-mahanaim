# 📜 Guía Paso a Paso: VS Code + GitHub para el Asistente de Recursos Bíblicos

## Índice
1. [Instalar VS Code](#1-instalar-vs-code)
2. [Instalar Git](#2-instalar-git)
3. [Configurar GitHub](#3-configurar-github)
4. [Clonar tu repositorio](#4-clonar-tu-repositorio)
5. [Abrir el proyecto en VS Code](#5-abrir-el-proyecto-en-vs-code)
6. [Estructura del proyecto](#6-estructura-del-proyecto)
7. [Editar y agregar recursos](#7-editar-y-agregar-recursos)
8. [Hacer commit y push](#8-hacer-commit-y-push)
9. [Flujo de trabajo completo](#9-flujo-de-trabajo-completo)
10. [Consejos y solución de problemas](#10-consejos-y-solución-de-problemas)

---

## 1. Instalar VS Code

1. Ir a **https://code.visualstudio.com/**
2. Hacer clic en el botón azul "Download" (se detecta tu sistema operativo automáticamente)
3. Ejecutar el instalador que se descarga
4. Durante la instalación, marcar estas opciones:
   - ✅ "Agregar a PATH"
   - ✅ "Abrir con Code" (para carpetas)
   - ✅ "Abrir con Code" (para archivos)

---

## 2. Instalar Git

### Windows:
1. Ir a **https://git-scm.com/download/win**
2. Descargar e instalar
3. Usar las opciones por defecto en el instalador

### Mac:
```bash
# Abrir Terminal y ejecutar:
xcode-select --install
```

### Linux:
```bash
sudo apt install git
```

### Verificar instalación:
Abrir una terminal y escribir:
```bash
git --version
```
Deberías ver algo como: `git version 2.43.0`

---

## 3. Configurar GitHub

### 3a. Crear cuenta en GitHub (si no tenés)
1. Ir a **https://github.com/signup**
2. Seguir los pasos para crear tu cuenta

### 3b. Configurar Git con tu usuario
Abrir una terminal en VS Code (menú: Terminal > Nueva Terminal) y escribir:
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```
⚠️ Usá el mismo email que tu cuenta de GitHub.

### 3c. Generar token de acceso personal
1. Ir a GitHub.com > Settings (tu foto de perfil) > Developer settings
2. Personal access tokens > Tokens (classic) > "Generate new token"
3. Marcar: ✅ repo (acceso completo a repositorios)
4. Click "Generate token"
5. ⚠️ **Copiar el token** (no se vuelve a mostrar)

---

## 4. Clonar tu repositorio

1. Ir a tu repositorio en GitHub: `https://github.com/mahanaimblogger-bot/recursos-biblicos`
2. Hacer clic en el botón verde **"Code"**
3. Copiar la URL (HTTPS)
4. Abrir VS Code
5. Presionar `Ctrl+Shift+P` (o `Cmd+Shift+P` en Mac)
6. Escribir: `Git: Clone`
7. Pegar la URL del repositorio
8. Elegir una carpeta en tu computadora donde guardar el proyecto
9. VS Code preguntará si querés abrir la carpeta → hacer clic en **"Open"**

---

## 5. Abrir el proyecto en VS Code

Si ya clonaste el repo, abrilo así:

1. Abrir VS Code
2. Menú: **File > Open Folder...**
3. Navegar hasta la carpeta donde clonaste el repositorio
4. Seleccionar la carpeta y hacer clic en **"Open"**

Deberías ver la estructura de archivos en el panel izquierdo (Explorer).

---

## 6. Estructura del proyecto

Tu repositorio tiene esta estructura:

```
recursos-biblicos/
├── data/                          ← Carpeta principal de datos
│   ├── index.json                 ← Índice general de libros
│   ├── genesis/                   ← Una carpeta por cada libro
│   │   ├── capitulos.json         ← Lista de capítulos disponibles
│   │   ├── cap-1.json             ← Recursos del capítulo 1
│   │   ├── cap-2.json             ← Recursos del capítulo 2
│   │   └── ...
│   ├── exodo/
│   │   ├── capitulos.json
│   │   ├── cap-1.json
│   │   └── ...
│   └── ... (más libros)
├── estudios/                      ← Archivos HTML de estudios y exégesis
│   ├── genesis/
│   │   ├── cap-1-estudio.html
│   │   └── ...
│   └── ...
└── index.html                     ← Página principal del sitio
```

### ¿Qué es cada archivo?

| Archivo | ¿Para qué sirve? |
|---------|-------------------|
| `data/index.json` | Lista de todos los libros con sus slugs |
| `data/[libro]/capitulos.json` | Lista de capítulos disponibles de ese libro |
| `data/[libro]/cap-[N].json` | Todos los recursos del capítulo N |
| `estudios/[libro]/cap-[N]-estudio.html` | Contenido HTML del estudio bíblico |
| `estudios/[libro]/cap-[N]-exegesis.html` | Contenido HTML del comentario exegético |

---

## 7. Editar y agregar recursos

### Usar el Asistente de Recursos Bíblicos

La herramienta web que creamos te guía paso a paso:

1. **Paso 1**: Elegís el libro y capítulo
2. **Paso 2**: Elegís el tipo de recurso (línea de tiempo, sermón, video, etc.)
3. **Paso 3**: Completás los datos (la IA genera los recursos automáticos)
4. **Paso 4**: Copiás el JSON generado y seguís las instrucciones

### Ejemplo: Agregar una Línea de Tiempo a Génesis 16

1. En el asistente web, seleccionar:
   - Libro: **Génesis**
   - Capítulo: **16**
   - Tipo: **⏳ Línea de Tiempo** (✨ AUTO)

2. La IA genera un JSON como este:
```json
{
  "tipo": "cronologia",
  "titulo": "Línea de tiempo: Génesis 16",
  "linea_capitulo": {
    "titulo": "Eventos del Capítulo 16",
    "eventos": [
      {"posicion": 1, "titulo": "Sarai ofrece a Agar", "descripcion": "Sarai da su sierva Agar a Abram", "versiculos": "1-3"},
      {"posicion": 2, "titulo": "Agar huye", "descripcion": "Agar desprecia a Sarai y huye al desierto", "versiculos": "4-6"},
      {"posicion": 3, "titulo": "El Ángel del Señor", "descripcion": "El Ángel encuentra a Agar junto a la fuente", "versiculos": "7-12"},
      {"posicion": 4, "titulo": "Nacimiento de Ismael", "descripcion": "Agar da a luz a Ismael", "versiculos": "15-16"}
    ]
  },
  "linea_libro": {
    "titulo": "Panorama de Génesis",
    "capitulo_marcado": 16,
    "total_capitulos": 50,
    "eventos": [
      {"capitulo_inicio": 1, "capitulo_fin": 11, "titulo": "Orígenes de la humanidad", "descripcion": "Creación, pecado, diluvio, Babel"},
      {"capitulo_inicio": 12, "capitulo_fin": 25, "titulo": "Patriarcas: Abraham", "descripcion": "El llamado de Abraham y sus descendientes"},
      {"capitulo_inicio": 26, "capitulo_fin": 36, "titulo": "Patriarcas: Isaac y Jacob", "descripcion": "Las generaciones siguientes"},
      {"capitulo_inicio": 37, "capitulo_fin": 50, "titulo": "José en Egipto", "descripcion": "De la cárcel al trono"}
    ]
  },
  "contenido_html": "..."
}
```

3. En VS Code, abrir el archivo `data/genesis/cap-16.json`

4. Si el archivo ya existe, buscar el array `"recursos": [...]` y agregar el JSON como un nuevo elemento:

```json
{
  "capitulo": "16",
  "libro": "genesis",
  "recursos": [
    // ... recursos existentes ...
    ,
    {
      "tipo": "cronologia",
      "titulo": "Línea de tiempo: Génesis 16",
      "linea_capitulo": { ... },
      "linea_libro": { ... },
      "contenido_html": "..."
    }
  ]
}
```

5. Guardar el archivo (`Ctrl+S`)

---

## 8. Hacer commit y push

### Desde VS Code (más fácil):

1. Hacer clic en el ícono de **Git** en la barra lateral izquierda (o `Ctrl+Shift+G`)
2. Verás los archivos modificados en la lista "Changes"
3. Hacer clic en el **+** junto a cada archivo para agregarlos (o "Stage All Changes")
4. Escribir un mensaje de commit en la caja de texto arriba, por ejemplo:
   ```
   Agregar línea de tiempo a Génesis 16
   ```
5. Hacer clic en **✓ Commit** (o `Ctrl+Enter`)
6. Hacer clic en **⬆ Sync Changes** (o `Push`) para subir a GitHub
7. Si es la primera vez, te pedirá tu usuario y token de GitHub

### Desde la terminal:

```bash
# Ver qué archivos cambiaron
git status

# Agregar todos los cambios
git add .

# Crear el commit con un mensaje
git commit -m "Agregar línea de tiempo a Génesis 16"

# Subir a GitHub
git push origin main
```

---

## 9. Flujo de trabajo completo

### Para cada recurso nuevo, seguís este ciclo:

```
┌─────────────────────────────┐
│ 1. Abrir el Asistente Web   │
│    (la app que creamos)     │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 2. Seleccionar libro y cap. │
│    Ver la línea de tiempo   │
│    con posición del capítulo│
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 3. Elegir tipo de recurso   │
│    y completar los datos    │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 4. Copiar el JSON generado  │
│    (botón 📋 Copiar)        │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 5. Ir a VS Code             │
│    Abrir cap-[N].json       │
│    Pegar el JSON en recursos│
│    Guardar (Ctrl+S)         │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 6. Commit + Push a GitHub   │
│    "Agregar [recurso] a     │
│     [Libro] cap [N]"        │
└─────────────────────────────┘
```

### Si es un capítulo nuevo:

Además de lo anterior, también tenés que:

1. **Actualizar `capitulos.json`**: Agregar el capítulo al array
2. **Verificar `index.json`**: Si el libro no existe, agregarlo

---

## 10. Consejos y solución de problemas

### Extensiones recomendadas para VS Code:

1. Abrir Extensiones (`Ctrl+Shift+X`)
2. Buscar e instalar:
   - **JSON** (para validar archivos JSON)
   - **Prettier** (para formatear código)
   - **GitLens** (para ver historial de cambios)

### Formatear JSON automáticamente:

1. Abrir un archivo .json
2. Hacer clic derecho > "Format Document"
3. O presionar `Shift+Alt+F`

### Error: "git push" falla

```bash
# Primero traer los cambios remotos
git pull origin main

# Luego intentar push de nuevo
git push origin main
```

### Error: "archivo JSON inválido"

1. Ir a **https://jsonlint.com/**
2. Pegar el contenido de tu archivo
3. Te muestra dónde está el error

### Ver los cambios en la web:

Después de hacer push, los cambios aparecen en:
**https://mahanaimblogger-bot.github.io/recursos-biblicos**

⚠️ Puede tardar unos minutos en actualizarse (GitHub Pages tiene un pequeño delay).

### Atajos útiles de VS Code:

| Atajo | Acción |
|-------|--------|
| `Ctrl+S` | Guardar archivo |
| `Ctrl+Shift+G` | Abrir panel de Git |
| `Ctrl+P` | Buscar archivo por nombre |
| `Ctrl+Shift+F` | Buscar texto en todos los archivos |
| `Ctrl+`` ` | Abrir/cerrar terminal |
| `Ctrl+Z` | Deshacer |
| `Ctrl+Shift+Z` | Rehacer |

---

*Guía creada para el proyecto Mahanaim - Centro de Recursos Bíblicos*
