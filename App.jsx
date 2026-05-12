import { useState, useRef, useEffect } from "react";

// ============================================================
// DATOS: NORMATIVA POR CCAA
// ============================================================
const CCAA_DATA = {
  "Andalucía": { decreto: "Decreto 101/2023", boe: "BOJA 2023", especial: "Plan de Mejora de Oportunidades Educativas" },
  "Aragón": { decreto: "Orden ECD/800/2022", boe: "BOA 2022", especial: "Marco Aragonés de Educación Inclusiva" },
  "Asturias": { decreto: "Decreto 59/2022", boe: "BOPA 2022", especial: "Plan de Atención a la Diversidad" },
  "Baleares": { decreto: "Decret 32/2023", boe: "BOIB 2023", especial: "Marc curricular balear, bilingüisme" },
  "Canarias": { decreto: "Decreto 82/2022", boe: "BOC 2022", especial: "Proyecto Educativo de Centro Canario" },
  "Cantabria": { decreto: "Decreto 73/2022", boe: "BOC 2022", especial: "Plan de Atención Temprana" },
  "Castilla-La Mancha": { decreto: "Decreto 82/2022 y Resolución 2023", boe: "DOCM 2022-2023", especial: "Decreto curricular CLM, Instrucciones IRPF docente, Resolución orientaciones EF Primaria CLM" },
  "Castilla y León": { decreto: "Orden EDU/362/2015 adaptada LOMLOE", boe: "BOCYL 2022", especial: "Plan de Lectura y Biblioteca Escolar" },
  "Cataluña": { decreto: "Decret 175/2022", boe: "DOGC 2022", especial: "Currículum competencial català, immersió lingüística" },
  "Extremadura": { decreto: "Decreto 66/2022", boe: "DOE 2022", especial: "Plan Integral de Convivencia" },
  "Galicia": { decreto: "Decreto 150/2022", boe: "DOG 2022", especial: "Marco galego de educación inclusiva, lingua galega" },
  "La Rioja": { decreto: "Decreto 4/2023", boe: "BOR 2023", especial: "Plan de Formación Permanente del Profesorado" },
  "Madrid": { decreto: "Decreto 65/2022", boe: "BOCM 2022", especial: "Plan de Éxito Educativo de la Comunidad de Madrid" },
  "Murcia": { decreto: "Decreto 254/2022", boe: "BORM 2022", especial: "Plan de Orientación y Acción Tutorial" },
  "Navarra": { decreto: "Decreto Foral 60/2014 actualizado", boe: "BON 2022", especial: "Marco navarro bilingüe y plurilingüe" },
  "País Vasco": { decreto: "Decreto 237/2015 adaptado", boe: "BOPV 2022", especial: "Marco pedagógico vasco, euskera" },
  "Valencia": { decreto: "Decret 59/2022", boe: "DOGV 2022", especial: "Marc Valencià, plurilingüisme, valenciano" },
  "Ceuta": { decreto: "Normativa MECD adaptada", boe: "BOE 2022", especial: "Plan de Compensación Educativa Ceuta" },
  "Melilla": { decreto: "Normativa MECD adaptada", boe: "BOE 2022", especial: "Plan de Compensación Educativa Melilla" },
};

const ESPECIALIDADES = [
  "Educación Primaria (Tutor/a)",
  "Educación Física",
  "Música",
  "Inglés / Lengua Extranjera",
  "Educación Infantil",
  "Pedagogía Terapéutica (PT)",
  "Audición y Lenguaje (AL)",
  "Religión",
  "Francés",
  "Orientación Educativa",
];

const ETAPAS = {
  "Educación Infantil": ["1º Infantil (3 años)", "2º Infantil (4 años)", "3º Infantil (5 años)"],
  "Educación Primaria": ["1º Primaria", "2º Primaria", "3º Primaria", "4º Primaria", "5º Primaria", "6º Primaria"],
  "Educación Secundaria": ["1º ESO", "2º ESO", "3º ESO", "4º ESO"],
  "Bachillerato": ["1º Bachillerato", "2º Bachillerato"],
};

const TIPOS_DOCUMENTO = [
  {
    id: "situacion",
    nombre: "Situación de Aprendizaje",
    icono: "✦",
    color: "#2563EB",
    bg: "#EFF6FF",
    descripcion: "Competencias específicas, saberes básicos LOMLOE, secuencia didáctica, DUA y evaluación",
    incluye: ["Competencias específicas y criterios", "Saberes básicos LOMLOE", "Secuencia de actividades", "DUA y atención a la diversidad", "Evaluación e instrumentos"],
  },
  {
    id: "rubrica",
    nombre: "Rúbrica de Evaluación",
    icono: "◉",
    color: "#059669",
    bg: "#ECFDF5",
    descripcion: "Tabla con 4 niveles, 5-7 indicadores observables, calificación numérica y cualitativa",
    incluye: ["Tabla con 4 niveles de desempeño", "5-7 indicadores observables", "Vinculada a criterios oficiales", "Calificación numérica y cualitativa"],
  },
  {
    id: "informe",
    nombre: "Informe de Evaluación",
    icono: "▣",
    color: "#7C3AED",
    bg: "#F5F3FF",
    descripcion: "Informes de evaluación, tutoría, individualizados, PT/AL con datos del alumno",
    incluye: ["Datos identificativos", "Evaluación por competencias", "Aspectos personales y sociales", "Propuestas de mejora"],
  },
  {
    id: "acta",
    nombre: "Acta de Reunión",
    icono: "❋",
    color: "#DC2626",
    bg: "#FEF2F2",
    descripcion: "Actas de reuniones de equipo docente, evaluación o claustro con formato oficial",
    incluye: ["Identificación y asistentes", "Orden del día y desarrollo", "Acuerdos adoptados", "Formato administrativo oficial"],
  },
  {
    id: "programacion",
    nombre: "Programación Didáctica",
    icono: "⊞",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    descripcion: "Programación completa para un curso escolar con marco normativo y unidades didácticas",
    incluye: ["Marco normativo LOMLOE + CCAA", "Competencias y saberes básicos", "10+ unidades didácticas", "Metodología, evaluación, atención diversidad"],
  },
  {
    id: "sesion",
    nombre: "Sesión / Unidad Didáctica",
    icono: "⬡",
    color: "#D97706",
    bg: "#FFFBEB",
    descripcion: "Desarrollo completo de una sesión o unidad didáctica con inicio, desarrollo y cierre",
    incluye: ["Inicio, desarrollo y cierre", "Recursos y agrupamientos", "DUA", "Evaluación de la sesión"],
  },
];

// ============================================================
// PROMPTS POR TIPO DE DOCUMENTO
// ============================================================
function buildPrompt(tipo, datos) {
  const ccaaInfo = CCAA_DATA[datos.ccaa] || {};
  const normativa = `LOMLOE (Ley Orgánica 3/2020) + ${ccaaInfo.decreto || "normativa autonómica"} (${ccaaInfo.boe || ""}) + ${ccaaInfo.especial || ""}`;

  const base = `Eres un experto en legislación educativa española y pedagogía. Genera el siguiente documento pedagógico en español, aplicando AUTOMÁTICAMENTE la normativa vigente:

NORMATIVA APLICABLE: ${normativa}
COMUNIDAD AUTÓNOMA: ${datos.ccaa}
ESPECIALIDAD: ${datos.especialidad}
ETAPA: ${datos.etapa}
CURSO: ${datos.curso}
${datos.materia ? `MATERIA/ÁREA: ${datos.materia}` : ""}
${datos.duracion ? `DURACIÓN: ${datos.duracion}` : ""}
${datos.tema ? `TEMA/FOCO: ${datos.tema}` : ""}
${datos.titulo ? `TÍTULO DEL DOCUMENTO: ${datos.titulo}` : ""}
${datos.contexto ? `CONTEXTO DEL AULA: ${datos.contexto}` : ""}
${datos.detalles ? `INSTRUCCIONES ADICIONALES: ${datos.detalles}` : ""}

Usa formato Markdown con títulos claros (##, ###), tablas cuando sea necesario, y listas organizadas. El documento debe ser completo, profesional y listo para usar. Cita los artículos y decretos específicos cuando corresponda.`;

  const prompts = {
    situacion: `${base}

GENERA UNA SITUACIÓN DE APRENDIZAJE COMPLETA con estas secciones obligatorias:

## 1. IDENTIFICACIÓN
- Título, curso, área, temporalización, número de sesiones

## 2. JUSTIFICACIÓN Y CONTEXTUALIZACIÓN
- Conexión con el Proyecto Educativo de Centro
- Relevancia para el alumnado

## 3. OBJETIVOS Y COMPETENCIAS ESPECÍFICAS
- Competencias específicas del área según ${ccaaInfo.decreto || "decreto autonómico"}
- Competencias clave LOMLOE relacionadas

## 4. CRITERIOS DE EVALUACIÓN
- Criterios oficiales del decreto curricular (numerados y textuales)
- Indicadores de logro para cada criterio

## 5. SABERES BÁSICOS
- Contenidos organizados por bloques según normativa CLM/LOMLOE

## 6. SECUENCIA DIDÁCTICA (mínimo 5 sesiones detalladas)
Para cada sesión: objetivos, actividades (inicio/desarrollo/cierre), recursos, tiempo, agrupamiento

## 7. DISEÑO UNIVERSAL DE APRENDIZAJE (DUA)
- Medidas de acceso y participación
- Múltiples formas de representación, acción y motivación
- Atención al alumnado con NEAE

## 8. EVALUACIÓN
- Instrumentos de evaluación
- Criterios de calificación
- Rúbrica sintética

## 9. RECURSOS Y MATERIALES
- Materiales, espacios, recursos digitales

## 10. INTERDISCIPLINARIEDAD
- Conexiones con otras áreas`,

    rubrica: `${base}

GENERA UNA RÚBRICA DE EVALUACIÓN COMPLETA:

## RÚBRICA: ${datos.titulo || datos.tema || "Evaluación"}

### Información general
- Área, curso, criterios de evaluación vinculados (cita los oficiales del decreto)

### TABLA DE RÚBRICA
Crea una tabla Markdown detallada con:
- 6-8 indicadores/criterios en las filas
- 4 niveles de desempeño en columnas: Iniciado (1-4), En proceso (5-6), Conseguido (7-8), Excelente (9-10)
- Descripción específica y observable para cada celda
- Vinculación a criterios de evaluación oficiales

### Calificación
- Sistema de puntuación: cómo se obtiene la nota final
- Correspondencia numérica y cualitativa (Insuficiente, Suficiente, Bien, Notable, Sobresaliente)

### Notas de aplicación
- Cómo usar la rúbrica en el aula
- Autoevaluación y coevaluación del alumnado`,

    informe: `${base}

GENERA UN INFORME DE EVALUACIÓN INDIVIDUALIZADO completo:

## INFORME DE EVALUACIÓN - ${datos.titulo || "Alumno/a"}

### 1. DATOS IDENTIFICATIVOS
- Centro, curso, área/especialidad, fecha, docente responsable
- (Nota: el nombre del alumno/a se completará manualmente)

### 2. EVALUACIÓN POR ÁREAS/COMPETENCIAS
Para cada competencia o área relevante:
- Nivel de adquisición (Iniciado/En proceso/Conseguido/Excelente)
- Descripción narrativa del progreso
- Logros destacados

### 3. ASPECTOS PERSONALES Y SOCIALES
- Actitud y motivación
- Relaciones con compañeros/as
- Autonomía y responsabilidad
- Hábitos de trabajo

### 4. ATENCIÓN A LA DIVERSIDAD
${datos.especialidad.includes("PT") || datos.especialidad.includes("AL") ? `
- Informe específico PT/AL
- Medidas de apoyo implementadas
- Progreso en objetivos del ACI/ACIE
- Coordinación con familia y equipo docente` : `
- Medidas ordinarias aplicadas
- Respuesta del alumno/a`}

### 5. PROPUESTAS DE MEJORA Y RECOMENDACIONES
- Para el alumno/a
- Para la familia
- Para el próximo período

### 6. FIRMA Y CONFORMIDAD
- Espacios para firmas (docente, familia, dirección)`,

    acta: `${base}

GENERA UN ACTA DE REUNIÓN con formato administrativo oficial:

## ACTA DE REUNIÓN - ${datos.titulo || "Equipo Docente"}

---

**ACTA Nº:** _______
**TIPO DE REUNIÓN:** ${datos.tema || "Reunión de Equipo Docente"}
**FECHA:** _______
**HORA DE INICIO:** _______ | **HORA DE FINALIZACIÓN:** _______
**LUGAR:** _______

---

### ASISTENTES
| Nombre | Cargo/Especialidad | Firma |
|--------|-------------------|-------|
| | | |
| | | |

**AUSENTES JUSTIFICADOS:** _______

### ORDEN DEL DÍA
1. Aprobación del acta anterior
2. ${datos.tema || "Asuntos del equipo"}
3. Ruegos y preguntas

### DESARROLLO DE LA REUNIÓN

**Punto 1. Lectura y aprobación del acta anterior**
_Descripción del desarrollo_

**Punto 2. ${datos.tema || "Asuntos principales"}**
_Desarrollo completo con los temas tratados, intervenciones relevantes y conclusiones_

**Punto 3. Ruegos y preguntas**
_Intervenciones y preguntas_

### ACUERDOS ADOPTADOS
| Nº | Acuerdo | Responsable | Plazo |
|----|---------|-------------|-------|
| 1 | | | |
| 2 | | | |

### PRÓXIMA REUNIÓN
**Fecha prevista:** _______ | **Hora:** _______ | **Lugar:** _______

---
**La Secretaria/El Secretario** _________________ **V.º B.º La Directora/El Director** _________________`,

    programacion: `${base}

GENERA UNA PROGRAMACIÓN DIDÁCTICA ANUAL COMPLETA:

## PROGRAMACIÓN DIDÁCTICA ANUAL
### ${datos.especialidad} - ${datos.curso} - ${datos.ccaa}
### Curso escolar: ____/____

---

## 1. MARCO NORMATIVO Y LEGAL
- LOMLOE y RD 157/2022 (Primaria) / RD 217/2022 (ESO)
- ${ccaaInfo.decreto || "Decreto autonómico"} - ${ccaaInfo.boe || ""}
- ${ccaaInfo.especial || ""}
- Proyecto Educativo de Centro

## 2. CONTEXTUALIZACIÓN
- Características del centro y entorno
- Características del grupo-clase
- Recursos disponibles

## 3. COMPETENCIAS ESPECÍFICAS
(Todas las competencias específicas del área según decreto, numeradas y con sus descriptores operativos)

## 4. CRITERIOS DE EVALUACIÓN
(Todos los criterios oficiales del decreto, organizados por competencia)

## 5. SABERES BÁSICOS
Organizados por bloques según normativa vigente con todos los contenidos del curso

## 6. UNIDADES DIDÁCTICAS / SITUACIONES DE APRENDIZAJE
Tabla de temporalización con las 10-12 unidades del curso:

| UD | Título | Temporalización | Competencias | Saberes básicos |
|----|--------|-----------------|--------------|-----------------|
| 1 | | Sept-Oct | | |
| 2 | | Oct-Nov | | |
[continuar hasta 10-12 UDs]

### Desarrollo sintético de cada UD (título, objetivos, actividades clave, evaluación)

## 7. METODOLOGÍA
- Principios metodológicos (aprendizaje activo, cooperativo, ABP, gamificación...)
- Organización del espacio y tiempo
- Agrupamientos

## 8. ATENCIÓN A LA DIVERSIDAD (DUA)
- Medidas ordinarias y específicas
- Coordinación con PT, AL y orientación
- Alumnado con NEAE

## 9. EVALUACIÓN
- Criterios de calificación y ponderación
- Instrumentos de evaluación
- Recuperación y refuerzo
- Evaluación de la propia programación

## 10. RECURSOS Y MATERIALES
## 11. INTERDISCIPLINARIEDAD Y PROYECTOS DE CENTRO
## 12. ACTIVIDADES COMPLEMENTARIAS Y EXTRAESCOLARES`,

    sesion: `${base}

GENERA EL DESARROLLO COMPLETO DE UNA SESIÓN/UNIDAD DIDÁCTICA:

## ${datos.titulo || "SESIÓN / UNIDAD DIDÁCTICA"}
### ${datos.especialidad} | ${datos.curso} | ${datos.materia || "Área"}

---

## IDENTIFICACIÓN
- **Duración:** ${datos.duracion || "1 sesión (45-60 min)"}
- **Agrupamiento principal:** Gran grupo / Pequeño grupo / Individual
- **Espacios:** Aula / Gimnasio / Patio / Exterior
- **Materiales:** (listado completo)

## OBJETIVOS DE LA SESIÓN
- Competencias específicas trabajadas
- Criterios de evaluación vinculados

## DESARROLLO DE LA SESIÓN

### 🟡 INICIO (10-15 min)
**Actividad de motivación/enganche:**
- Descripción detallada
- Rol del docente y del alumnado
- Recursos necesarios

**Evaluación inicial/diagnóstica:**
- Preguntas activadoras
- Conexión con conocimientos previos

### 🟢 DESARROLLO (25-35 min)
**Actividad principal:**
- Descripción paso a paso
- Variantes y progresiones
- Gestión del grupo

**Actividades de refuerzo y ampliación:**
- Para alumnado con dificultades
- Para alumnado que termina antes

### 🔴 CIERRE (10 min)
**Actividad de síntesis:**
- Puesta en común
- Reflexión metacognitiva
- Conexión con próximas sesiones

## DUA - ATENCIÓN A LA DIVERSIDAD
- Adaptaciones para alumnado con NEAE
- Múltiples formas de participación
- Apoyos y andamiajes

## EVALUACIÓN DE LA SESIÓN
- Qué se evalúa y cómo
- Instrumento de evaluación utilizado
- Criterios de observación

## REFLEXIÓN DOCENTE (para completar tras la sesión)
- ¿Se han conseguido los objetivos?
- ¿Qué cambiaría?
- Próximos pasos`,
  };

  return prompts[tipo] || prompts.situacion;
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function DocentesES() {
  const [vista, setVista] = useState("dashboard");
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [usuario, setUsuario] = useState({ nombre: "VALENTÍN", ccaa: "Castilla-La Mancha", especialidad: "Educación Física", etapa: "Educación Primaria" });
  const [formulario, setFormulario] = useState({});
  const [documentoGenerado, setDocumentoGenerado] = useState(null);
  const [generando, setGenerando] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [error, setError] = useState(null);
  const [biblioteca, setBiblioteca] = useState([]);
  const [docSeleccionado, setDocSeleccionado] = useState(null);
  const streamRef = useRef(null);

  const etapaActual = usuario.etapa;
  const cursosDisponibles = ETAPAS[etapaActual] || ETAPAS["Educación Primaria"];

  // Inicializar formulario cuando se selecciona tipo
  useEffect(() => {
    if (tipoSeleccionado) {
      setFormulario({
        ccaa: usuario.ccaa,
        especialidad: usuario.especialidad,
        etapa: usuario.etapa,
        curso: cursosDisponibles[0],
        titulo: "",
        materia: "",
        duracion: "",
        tema: "",
        contexto: "",
        detalles: "",
      });
    }
  }, [tipoSeleccionado]);

  async function generarDocumento() {
    if (!formulario.titulo && !formulario.tema) {
      setError("Por favor, indica un título o tema para el documento.");
      return;
    }
    setGenerando(true);
    setStreamText("");
    setError(null);
    setVista("generando");

    const prompt = buildPrompt(tipoSeleccionado.id, formulario);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": "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", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          stream: true,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                fullText += parsed.delta.text;
                setStreamText(fullText);
              }
            } catch {}
          }
        }
      }

      const nuevo = {
        id: Date.now(),
        tipo: tipoSeleccionado,
        formulario: { ...formulario },
        contenido: fullText,
        fecha: new Date().toLocaleDateString("es-ES"),
        titulo: formulario.titulo || formulario.tema || tipoSeleccionado.nombre,
      };
      setDocumentoGenerado(nuevo);
      setBiblioteca((prev) => [nuevo, ...prev]);
      setVista("documento");
    } catch (e) {
      setError("Error al generar el documento: " + e.message);
      setVista("formulario");
    } finally {
      setGenerando(false);
    }
  }

  function copiarContenido() {
    if (docSeleccionado || documentoGenerado) {
      navigator.clipboard.writeText((docSeleccionado || documentoGenerado).contenido);
    }
  }

  function imprimirDocumento() {
    const contenido = (docSeleccionado || documentoGenerado)?.contenido;
    if (!contenido) return;
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head><title>DocentesES</title><style>
      body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6;color:#111}
      h1{font-size:28px;border-bottom:3px solid #111;padding-bottom:8px}
      h2{font-size:22px;margin-top:32px;border-bottom:1px solid #ccc;padding-bottom:4px}
      h3{font-size:18px;margin-top:24px}
      table{width:100%;border-collapse:collapse;margin:16px 0}
      th,td{border:1px solid #333;padding:8px;text-align:left;font-size:13px}
      th{background:#f0f0f0;font-weight:bold}
      ul,ol{padding-left:20px}
      @media print{body{margin:20px}}
    </style></head><body>${markdownToHTML(contenido)}</body></html>`);
    win.document.close();
    win.print();
  }

  function markdownToHTML(md) {
    return md
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
      .replace(/^\|(.+)\|$/gm, (m) => {
        const cells = m.split("|").filter(Boolean);
        return "<tr>" + cells.map((c) => `<td>${c.trim()}</td>`).join("") + "</tr>";
      })
      .replace(/(<tr>.*<\/tr>\n?)+/g, "<table>$&</table>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/^(?!<[htuol])/gm, "");
  }

  // ============================================================
  // RENDER: MARKDOWN SIMPLE
  // ============================================================
  function renderMarkdown(text) {
    if (!text) return null;
    const lines = text.split("\n");
    const elements = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith("### ")) {
        elements.push(<h3 key={i} style={{ fontSize: "16px", fontWeight: "700", marginTop: "20px", marginBottom: "6px", color: "#111", fontFamily: "'Cabinet Grotesk', sans-serif" }}>{line.slice(4)}</h3>);
      } else if (line.startsWith("## ")) {
        elements.push(<h2 key={i} style={{ fontSize: "20px", fontWeight: "800", marginTop: "28px", marginBottom: "8px", color: "#000", borderBottom: "2px solid #000", paddingBottom: "4px", fontFamily: "'Cabinet Grotesk', sans-serif" }}>{line.slice(3)}</h2>);
      } else if (line.startsWith("# ")) {
        elements.push(<h1 key={i} style={{ fontSize: "26px", fontWeight: "900", marginTop: "0", marginBottom: "16px", color: "#000", fontFamily: "'Cabinet Grotesk', sans-serif" }}>{line.slice(2)}</h1>);
      } else if (line.startsWith("| ") || line.startsWith("|--")) {
        // Tabla
        const tableLines = [];
        while (i < lines.length && (lines[i].startsWith("| ") || lines[i].startsWith("|--"))) {
          tableLines.push(lines[i]);
          i++;
        }
        const rows = tableLines.filter((l) => !l.startsWith("|--"));
        elements.push(
          <div key={i} style={{ overflowX: "auto", margin: "16px 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              {rows.map((row, ri) => {
                const cells = row.split("|").filter((c) => c.trim());
                return (
                  <tr key={ri}>
                    {cells.map((cell, ci) => ri === 0 ? (
                      <th key={ci} style={{ border: "1px solid #333", padding: "8px", background: "#111", color: "#fff", fontWeight: "700", textAlign: "left" }}>{cell.trim()}</th>
                    ) : (
                      <td key={ci} style={{ border: "1px solid #ddd", padding: "8px", verticalAlign: "top" }}>{cell.trim()}</td>
                    ))}
                  </tr>
                );
              })}
            </table>
          </div>
        );
        continue;
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        const items = [];
        while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
          items.push(<li key={i} style={{ marginBottom: "4px" }}>{lines[i].slice(2)}</li>);
          i++;
        }
        elements.push(<ul key={`ul-${i}`} style={{ paddingLeft: "20px", margin: "8px 0" }}>{items}</ul>);
        continue;
      } else if (line.trim() === "") {
        elements.push(<br key={i} />);
      } else if (line.startsWith("---")) {
        elements.push(<hr key={i} style={{ border: "none", borderTop: "2px solid #eee", margin: "16px 0" }} />);
      } else if (line.trim()) {
        const formatted = line
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.+?)\*/g, "<em>$1</em>")
          .replace(/_(.+?)_/g, "<em>$1</em>");
        elements.push(<p key={i} style={{ margin: "4px 0", lineHeight: "1.7" }} dangerouslySetInnerHTML={{ __html: formatted }} />);
      }
      i++;
    }
    return elements;
  }

  // ============================================================
  // ESTILOS BASE
  // ============================================================
  const styles = {
    app: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, sans-serif",
      background: "#FAFAFA",
      color: "#111",
    },
    sidebar: {
      width: "240px",
      minWidth: "240px",
      background: "#0A0A0A",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      padding: "0",
      position: "sticky",
      top: 0,
      height: "100vh",
    },
    logo: {
      padding: "24px 20px",
      borderBottom: "1px solid #222",
    },
    logoIcon: {
      width: "36px",
      height: "36px",
      background: "#fff",
      color: "#000",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "900",
      fontSize: "16px",
      marginBottom: "8px",
    },
    logoTitle: { fontSize: "17px", fontWeight: "800", letterSpacing: "-0.5px", fontFamily: "'Cabinet Grotesk', sans-serif" },
    logoSub: { fontSize: "11px", color: "#666", marginTop: "2px" },
    nav: { flex: 1, padding: "12px 0" },
    navItem: (activo) => ({
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 20px",
      cursor: "pointer",
      background: activo ? "#fff" : "transparent",
      color: activo ? "#000" : "#999",
      fontSize: "13px",
      fontWeight: activo ? "700" : "500",
      transition: "all 0.15s",
      borderRadius: activo ? "0" : "0",
    }),
    navIcon: { fontSize: "14px", width: "18px", textAlign: "center" },
    userBox: {
      padding: "16px 20px",
      borderTop: "1px solid #222",
      fontSize: "12px",
    },
    userEmail: { color: "#666", fontSize: "11px" },
    userName: { fontWeight: "700", fontSize: "13px", marginTop: "2px" },
    main: { flex: 1, padding: "40px", overflowY: "auto" },
    pageTitle: { fontSize: "13px", fontWeight: "600", color: "#888", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" },
    heading: { fontSize: "40px", fontWeight: "900", letterSpacing: "-2px", marginBottom: "8px", fontFamily: "'Cabinet Grotesk', sans-serif", lineHeight: 1 },
    subheading: { color: "#666", fontSize: "14px", marginBottom: "32px" },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "40px" },
    statCard: { background: "#fff", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px" },
    statLabel: { fontSize: "11px", fontWeight: "600", color: "#888", letterSpacing: "1px", textTransform: "uppercase" },
    statNum: { fontSize: "36px", fontWeight: "900", marginTop: "4px", fontFamily: "'Cabinet Grotesk', sans-serif" },
    sectionTitle: { fontSize: "11px", fontWeight: "700", color: "#888", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px" },
    docGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
    docCard: (color, bg) => ({
      background: "#fff",
      border: "1px solid #E5E5E5",
      borderRadius: "12px",
      padding: "24px",
      cursor: "pointer",
      transition: "all 0.2s",
      position: "relative",
      overflow: "hidden",
    }),
    docCardIcon: (color) => ({
      width: "44px",
      height: "44px",
      borderRadius: "10px",
      background: color,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      marginBottom: "14px",
    }),
    docCardName: { fontSize: "15px", fontWeight: "700", marginBottom: "6px" },
    docCardDesc: { fontSize: "12px", color: "#888", lineHeight: "1.5" },
    arrow: { position: "absolute", top: "20px", right: "20px", fontSize: "16px", color: "#ccc" },
    btn: (variant = "primary") => ({
      padding: "12px 24px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "700",
      fontSize: "14px",
      fontFamily: "inherit",
      background: variant === "primary" ? "#000" : variant === "outline" ? "transparent" : "#F5F5F5",
      color: variant === "primary" ? "#fff" : variant === "outline" ? "#000" : "#000",
      border: variant === "outline" ? "1px solid #ddd" : "none",
      transition: "all 0.15s",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
    }),
  };

  const navItems = [
    { id: "dashboard", label: "Panel", icon: "⊞" },
    { id: "situacion", label: "Situaciones", icon: "✦" },
    { id: "rubrica", label: "Rúbricas", icon: "◉" },
    { id: "programacion", label: "Programaciones", icon: "⊟" },
    { id: "sesion", label: "Sesiones / UD", icon: "⬡" },
    { id: "informe", label: "Informes", icon: "▣" },
    { id: "acta", label: "Actas", icon: "❋" },
    { id: "biblioteca", label: "Mi Biblioteca", icon: "◫" },
    { id: "ajustes", label: "Ajustes", icon: "⚙" },
  ];

  function navegarATipo(id) {
    const tipo = TIPOS_DOCUMENTO.find((t) => t.id === id);
    if (tipo) {
      setTipoSeleccionado(tipo);
      setDocumentoGenerado(null);
      setError(null);
      setVista("formulario");
    }
  }

  // ============================================================
  // RENDER VISTAS
  // ============================================================
  function renderDashboard() {
    return (
      <div>
        <p style={styles.pageTitle}>PANEL</p>
        <h1 style={styles.heading}>Hola, {usuario.nombre}.</h1>
        <p style={styles.subheading}>Genera documentos pedagógicos alineados con LOMLOE y la normativa de {usuario.ccaa}.</p>

        <div style={styles.statsGrid}>
          {[
            { label: "Documentos Creados", val: biblioteca.length },
            { label: "Situaciones", val: biblioteca.filter((d) => d.tipo.id === "situacion").length },
            { label: "Rúbricas", val: biblioteca.filter((d) => d.tipo.id === "rubrica").length },
            { label: "Programaciones", val: biblioteca.filter((d) => d.tipo.id === "programacion").length },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={styles.statLabel}>{s.label}</div>
              <div style={styles.statNum}>{s.val}</div>
            </div>
          ))}
        </div>

        <p style={styles.sectionTitle}>CREAR NUEVO</p>
        <div style={styles.docGrid}>
          {TIPOS_DOCUMENTO.map((tipo) => (
            <div
              key={tipo.id}
              style={styles.docCard(tipo.color, tipo.bg)}
              onClick={() => navegarATipo(tipo.id)}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = tipo.color; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${tipo.color}22`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5E5E5"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <span style={styles.arrow}>↗</span>
              <div style={styles.docCardIcon(tipo.color)}>{tipo.icono}</div>
              <div style={styles.docCardName}>{tipo.nombre}</div>
              <div style={styles.docCardDesc}>{tipo.descripcion}</div>
            </div>
          ))}
        </div>

        {biblioteca.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <p style={styles.sectionTitle}>RECIENTES</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {biblioteca.slice(0, 5).map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => { setDocSeleccionado(doc); setVista("documento"); }}
                  style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: "10px", padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "14px" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#000"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "#E5E5E5"}
                >
                  <div style={{ ...styles.docCardIcon(doc.tipo.color), width: "32px", height: "32px", fontSize: "14px", marginBottom: 0, flexShrink: 0 }}>{doc.tipo.icono}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "700", fontSize: "14px" }}>{doc.titulo}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>{doc.tipo.nombre} · {doc.fecha}</div>
                  </div>
                  <span style={{ color: "#ccc" }}>→</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderFormulario() {
    if (!tipoSeleccionado) return null;
    return (
      <div>
        <button onClick={() => setVista("dashboard")} style={{ ...styles.btn("outline"), marginBottom: "24px", fontSize: "13px" }}>← Volver</button>
        <p style={styles.pageTitle}>NUEVO DOCUMENTO</p>
        <h1 style={{ ...styles.heading, fontSize: "32px" }}>{tipoSeleccionado.nombre}</h1>
        <p style={styles.subheading}>La IA aplicará la normativa LOMLOE y de tu comunidad autónoma automáticamente.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px", alignItems: "start" }}>
          <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "28px" }}>
            {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#DC2626", fontSize: "13px" }}>{error}</div>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#444" }}>TÍTULO DEL DOCUMENTO *</label>
                <input
                  value={formulario.titulo || ""}
                  onChange={(e) => setFormulario((f) => ({ ...f, titulo: e.target.value }))}
                  placeholder="Ej: Los ecosistemas de mi entorno"
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
                  onFocus={(e) => e.target.style.borderColor = "#000"}
                  onBlur={(e) => e.target.style.borderColor = "#ddd"}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#444" }}>COMUNIDAD AUTÓNOMA *</label>
                  <select
                    value={formulario.ccaa || ""}
                    onChange={(e) => setFormulario((f) => ({ ...f, ccaa: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" }}
                  >
                    {Object.keys(CCAA_DATA).map((ccaa) => <option key={ccaa} value={ccaa}>{ccaa}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#444" }}>ESPECIALIDAD *</label>
                  <select
                    value={formulario.especialidad || ""}
                    onChange={(e) => setFormulario((f) => ({ ...f, especialidad: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" }}
                  >
                    {ESPECIALIDADES.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#444" }}>ETAPA *</label>
                  <select
                    value={formulario.etapa || ""}
                    onChange={(e) => { const et = e.target.value; setFormulario((f) => ({ ...f, etapa: et, curso: ETAPAS[et]?.[0] || "" })); }}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" }}
                  >
                    {Object.keys(ETAPAS).map((et) => <option key={et} value={et}>{et}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#444" }}>CURSO *</label>
                  <select
                    value={formulario.curso || ""}
                    onChange={(e) => setFormulario((f) => ({ ...f, curso: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" }}
                  >
                    {(ETAPAS[formulario.etapa] || ETAPAS["Educación Primaria"]).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#444" }}>MATERIA / ÁREA</label>
                  <input value={formulario.materia || ""} onChange={(e) => setFormulario((f) => ({ ...f, materia: e.target.value }))} placeholder="Ej: Ciencias de la Naturaleza" style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#444" }}>DURACIÓN / TEMPORALIZACIÓN</label>
                  <input value={formulario.duracion || ""} onChange={(e) => setFormulario((f) => ({ ...f, duracion: e.target.value }))} placeholder="Ej: 6 sesiones de 45 min" style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#444" }}>TEMA / FOCO</label>
                <input value={formulario.tema || ""} onChange={(e) => setFormulario((f) => ({ ...f, tema: e.target.value }))} placeholder="Ej: Los ecosistemas locales" style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#444" }}>CONTEXTO DEL AULA</label>
                <textarea value={formulario.contexto || ""} onChange={(e) => setFormulario((f) => ({ ...f, contexto: e.target.value }))} placeholder="Ej: 22 alumnos, 2 con NEE, aula con pizarra digital..." rows={3} style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#444" }}>DETALLES ADICIONALES / INSTRUCCIONES</label>
                <textarea value={formulario.detalles || ""} onChange={(e) => setFormulario((f) => ({ ...f, detalles: e.target.value }))} placeholder="Cualquier requisito específico que quieras incluir..." rows={3} style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
              </div>
            </div>

            <button
              onClick={generarDocumento}
              disabled={generando}
              style={{ ...styles.btn("primary"), width: "100%", marginTop: "24px", padding: "16px", fontSize: "15px", justifyContent: "center", opacity: generando ? 0.6 : 1 }}
            >
              ✦ Generar documento con IA
            </button>
          </div>

          <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={styles.docCardIcon(tipoSeleccionado.color)}>{tipoSeleccionado.icono}</div>
              <div style={{ fontWeight: "700", fontSize: "14px" }}>Qué incluye</div>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {tipoSeleccionado.incluye.map((item, i) => (
                <li key={i} style={{ fontSize: "13px", color: "#555", padding: "6px 0", borderBottom: i < tipoSeleccionado.incluye.length - 1 ? "1px solid #F5F5F5" : "none", display: "flex", gap: "8px" }}>
                  <span style={{ color: tipoSeleccionado.color }}>·</span> {item}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: "20px", background: "#F9F9F9", borderRadius: "8px", padding: "12px", fontSize: "12px", color: "#666", lineHeight: "1.5" }}>
              La IA aplica automáticamente la normativa nacional (LOMLOE) y el decreto curricular de tu comunidad autónoma.
            </div>
            {formulario.ccaa && CCAA_DATA[formulario.ccaa] && (
              <div style={{ marginTop: "12px", background: "#F0F9FF", borderRadius: "8px", padding: "12px", fontSize: "11px", color: "#0369A1" }}>
                <strong>{formulario.ccaa}:</strong><br />
                {CCAA_DATA[formulario.ccaa].decreto}<br />
                {CCAA_DATA[formulario.ccaa].boe}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function renderGenerando() {
    return (
      <div style={{ maxWidth: "800px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <div style={{ width: "10px", height: "10px", background: "#000", borderRadius: "50%", animation: "pulse 1s infinite" }} />
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#888" }}>Generando documento con IA...</span>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>

        <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "32px", minHeight: "400px" }}>
          {streamText ? (
            <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
              {renderMarkdown(streamText)}
              <span style={{ display: "inline-block", width: "2px", height: "16px", background: "#000", marginLeft: "2px", animation: "pulse 0.8s infinite" }} />
            </div>
          ) : (
            <div style={{ color: "#999", fontSize: "14px" }}>Preparando la generación...</div>
          )}
        </div>
      </div>
    );
  }

  function renderDocumento() {
    const doc = docSeleccionado || documentoGenerado;
    if (!doc) return null;
    return (
      <div>
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button onClick={() => { setVista("dashboard"); setDocSeleccionado(null); }} style={styles.btn("outline")}>← Volver</button>
          <button onClick={copiarContenido} style={styles.btn("secondary")}>⎘ Copiar Markdown</button>
          <button onClick={imprimirDocumento} style={styles.btn("secondary")}>⎙ Imprimir / PDF</button>
          <button onClick={() => { setTipoSeleccionado(doc.tipo); setFormulario(doc.formulario); setVista("formulario"); setDocSeleccionado(null); }} style={styles.btn("secondary")}>↻ Regenerar</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div style={{ ...styles.docCardIcon(doc.tipo.color), width: "36px", height: "36px", fontSize: "16px", marginBottom: 0 }}>{doc.tipo.icono}</div>
          <div>
            <div style={{ fontSize: "11px", color: "#888", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>{doc.tipo.nombre}</div>
            <div style={{ fontSize: "20px", fontWeight: "800", fontFamily: "'Cabinet Grotesk', sans-serif" }}>{doc.titulo}</div>
          </div>
        </div>
        <div style={{ fontSize: "12px", color: "#aaa", marginBottom: "24px" }}>
          {doc.formulario.ccaa} · {doc.formulario.especialidad} · {doc.formulario.curso} · {doc.fecha}
        </div>

        <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "40px", maxWidth: "800px", fontSize: "14px", lineHeight: "1.8" }}>
          {renderMarkdown(doc.contenido)}
        </div>
      </div>
    );
  }

  function renderBiblioteca() {
    return (
      <div>
        <p style={styles.pageTitle}>MI BIBLIOTECA</p>
        <h1 style={{ ...styles.heading, fontSize: "32px", marginBottom: "24px" }}>Documentos guardados</h1>
        {biblioteca.length === 0 ? (
          <div style={{ background: "#fff", border: "1px dashed #ddd", borderRadius: "12px", padding: "60px", textAlign: "center", color: "#aaa" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>◫</div>
            <div style={{ fontSize: "15px" }}>Aún no has generado ningún documento</div>
            <button onClick={() => setVista("dashboard")} style={{ ...styles.btn("primary"), marginTop: "20px" }}>Crear primer documento</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {biblioteca.map((doc) => (
              <div
                key={doc.id}
                onClick={() => { setDocSeleccionado(doc); setVista("documento"); }}
                style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: "10px", padding: "18px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "14px" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#000"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5E5E5"; }}
              >
                <div style={{ ...styles.docCardIcon(doc.tipo.color), width: "36px", height: "36px", fontSize: "16px", marginBottom: 0, flexShrink: 0 }}>{doc.tipo.icono}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "700", fontSize: "15px" }}>{doc.titulo}</div>
                  <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{doc.tipo.nombre} · {doc.formulario.ccaa} · {doc.formulario.curso} · {doc.fecha}</div>
                </div>
                <span style={{ color: "#ccc", fontSize: "18px" }}>→</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function renderAjustes() {
    return (
      <div style={{ maxWidth: "500px" }}>
        <p style={styles.pageTitle}>AJUSTES</p>
        <h1 style={{ ...styles.heading, fontSize: "32px", marginBottom: "24px" }}>Mi perfil</h1>
        <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {[
            { label: "NOMBRE", key: "nombre", placeholder: "Tu nombre" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#444" }}>{label}</label>
              <input value={usuario[key] || ""} onChange={(e) => setUsuario((u) => ({ ...u, [key]: e.target.value }))} placeholder={placeholder} style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
          ))}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#444" }}>COMUNIDAD AUTÓNOMA</label>
            <select value={usuario.ccaa || ""} onChange={(e) => setUsuario((u) => ({ ...u, ccaa: e.target.value }))} style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" }}>
              {Object.keys(CCAA_DATA).map((ccaa) => <option key={ccaa} value={ccaa}>{ccaa}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#444" }}>ESPECIALIDAD</label>
            <select value={usuario.especialidad || ""} onChange={(e) => setUsuario((u) => ({ ...u, especialidad: e.target.value }))} style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" }}>
              {ESPECIALIDADES.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#444" }}>ETAPA</label>
            <select value={usuario.etapa || ""} onChange={(e) => setUsuario((u) => ({ ...u, etapa: e.target.value }))} style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" }}>
              {Object.keys(ETAPAS).map((et) => <option key={et} value={et}>{et}</option>)}
            </select>
          </div>
          <button onClick={() => alert("Perfil actualizado ✓")} style={{ ...styles.btn("primary"), justifyContent: "center" }}>Guardar cambios</button>
        </div>
      </div>
    );
  }

  function handleNav(id) {
    if (["situacion", "rubrica", "programacion", "sesion", "informe", "acta"].includes(id)) {
      navegarATipo(id);
    } else {
      setVista(id);
      setDocSeleccionado(null);
    }
  }

  const vistaActiva = vista === "formulario" || vista === "generando" || vista === "documento"
    ? tipoSeleccionado?.id || "dashboard"
    : vista;

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>D</div>
          <div style={styles.logoTitle}>DocentesES</div>
          <div style={styles.logoSub}>LOMLOE · Plataforma</div>
        </div>
        <nav style={styles.nav}>
          {navItems.map((item) => (
            <div key={item.id} style={styles.navItem(vistaActiva === item.id)} onClick={() => handleNav(item.id)}>
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
        <div style={styles.userBox}>
          <div style={styles.userEmail}>{usuario.nombre?.toLowerCase()}@docentes.es</div>
          <div style={styles.userName}>{usuario.nombre}</div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>
        {vista === "dashboard" && renderDashboard()}
        {vista === "formulario" && renderFormulario()}
        {vista === "generando" && renderGenerando()}
        {vista === "documento" && renderDocumento()}
        {vista === "biblioteca" && renderBiblioteca()}
        {vista === "ajustes" && renderAjustes()}
      </main>
    </div>
  );
}
