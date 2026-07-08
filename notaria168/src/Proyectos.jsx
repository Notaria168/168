import React, { useState, useRef, useEffect } from "react";
import { AREAS, DICTAMINADORES_ROTACION, ABOGADOS, PROTOCOLISTAS, REVISORES, TIPOS_PROYECTO, DOCUMENTOS_EXPEDIENTE, BANCOS_MEXICO, DOC_PREVIEW, PROYECTOS_INICIALES } from "./constants";
import { MenuLateral, BuscadorGlobal } from "./Shared";
import { IN, BTNP, BTNR, TD, LBL, IN0, BTNAC } from "./AreasB";

// Rotación automática de dictaminadores (siempre LSS → KRD → HVR → LSS...)

// Protocolistas disponibles

// Revisores (todos los abogados del catálogo)



export function Proyectos({ proyectos, setProyectos, expedientes, pasesFolio2, sesion, editable, onBack, onLogout, logoUrl, hs, searchProps }) {
  const [vista, setVista] = useState("inicio"); // "inicio"|"ruleta"|"elegir"|"documentos"
  const [busqueda, setBusqueda] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [expedienteGenerar, setExpedienteGenerar] = useState(null);

  // ── helpers ──────────────────────────────────────────────────────────────────
  const ahora = () => {
    const n = new Date();
    return {
      fecha: n.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" }),
      hora:  n.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
  };

  const siguienteDictaminador = () => {
    const conteos = DICTAMINADORES_ROTACION.map(d => proyectos.filter(p => p.dictamina === d).length);
    const minimo  = Math.min(...conteos);
    return DICTAMINADORES_ROTACION[conteos.indexOf(minimo)];
  };

  const crearProyecto = (datos) => {
    const ts = ahora();
    const nuevo = {
      id: (proyectos.reduce((m, p) => Math.max(m, p.id), 0)) + 1,
      fechaCreacion: ts.fecha, horaCreacion: ts.hora,
      expediente:  datos.expediente,
      dictamina:   datos.dictamina,
      operacion:   datos.operacion,
      banco:       datos.banco,
      protocolista: datos.protocolista,
      tipoProyecto: datos.tipoProyecto || "",
      fechaProtocolista: ts.fecha, horaProtocolista: ts.hora,
      revisor1: "", fechaRevisor1: "", horaRevisor1: "",
      subsana1: "", fechaSubsana1: "", horaSubsana1: "",
      revisor2: "", fechaRevisor2: "", horaRevisor2: "",
      escritura: "",
      registradoPor: sesion.nombre,
    };
    setProyectos(ps => [...ps, nuevo]);
    setVista("inicio");
    setTipoSeleccionado(null);
    setExpedienteGenerar(null);
  };

  const asignar = (id, campo, valor) => {
    const ts = ahora();
    setProyectos(ps => ps.map(p => {
      if (p.id !== id) return p;
      const upd = { ...p, [campo]: valor };
      if (campo === "revisor1") { upd.fechaRevisor1 = ts.fecha; upd.horaRevisor1 = ts.hora; }
      if (campo === "subsana1") { upd.fechaSubsana1 = ts.fecha; upd.horaSubsana1 = ts.hora; }
      if (campo === "revisor2") { upd.fechaRevisor2 = ts.fecha; upd.horaRevisor2 = ts.hora; }
      return upd;
    }));
  };

  const escrituraDe = (expediente) => {
    const match = pasesFolio2.find(p => p.expediente === expediente);
    return match ? match.escritura : "";
  };

  const proyectosConEscritura = proyectos.map(p => ({
    ...p, escritura: p.escritura || escrituraDe(p.expediente),
  }));

  const filtrados = proyectosConEscritura.filter(p => {
    const q = busqueda.toLowerCase();
    return !q || p.expediente?.toLowerCase().includes(q) || p.operacion?.toLowerCase().includes(q) || p.dictamina?.toLowerCase().includes(q) || p.protocolista?.toLowerCase().includes(q) || p.revisor1?.toLowerCase().includes(q);
  }).sort((a, b) => b.id - a.id);

  const conteoDict = DICTAMINADORES_ROTACION.reduce((acc, d) => {
    acc[d] = proyectos.filter(p => p.dictamina === d).length;
    return acc;
  }, {});

  const Header = () => (
    <header style={hs.header}>
      <img src={logoUrl} alt="Notaría 168" style={hs.logoImg} onError={e => e.target.style.display = "none"} />
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={hs.areaBadge}>{sesion.nombre} — {sesion.area}</span>
        <button style={hs.logoutBtn} onClick={onLogout}>Cerrar sesión</button>
      </div>
    </header>
  );

  // ── VISTA PRINCIPAL ───────────────────────────────────────────────────────────
  if (vista === "inicio") return (
    <div style={hs.wrap}>
      <Header />
      {searchProps?.menuProps && <MenuLateral {...searchProps.menuProps} />}
      {searchProps && <BuscadorGlobal {...searchProps} />}
      <div style={hs.content}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <button onClick={onBack} style={BTNR}>← Menú principal</button>
          <span style={{ color: "#9aa3be" }}>/</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#0D1B4B" }}>📐 Proyectos</span>
        </div>

        {/* BOTONES PRINCIPALES */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
          {/* RULETA */}
          <button onClick={() => setVista("ruleta")} style={{
            background: "#fff", border: "1.5px solid #0D1B4B", borderRadius: 20, padding: "32px 24px",
            cursor: "pointer", textAlign: "center", transition: "all 0.18s",
            boxShadow: "0 2px 12px rgba(13,27,75,0.10)",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(13,27,75,0.18)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(13,27,75,0.10)"; }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎡</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0D1B4B", marginBottom: 6 }}>Ruleta</div>
            <div style={{ fontSize: 13, color: "#6b7a9d" }}>Control de proyectos, asignación de revisores y seguimiento</div>
            <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 10 }}>
              {DICTAMINADORES_ROTACION.map(d => (
                <span key={d} style={{ background: "#eef2fb", color: "#3a4f8a", borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
                  {d}: {conteoDict[d] || 0}
                </span>
              ))}
            </div>
          </button>

          {/* GENERAR PROYECTO */}
          <button onClick={() => setVista("elegir")} style={{
            background: "#0D1B4B", border: "none", borderRadius: 20, padding: "32px 24px",
            cursor: "pointer", textAlign: "center", transition: "all 0.18s",
            boxShadow: "0 4px 20px rgba(13,27,75,0.25)",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(13,27,75,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(13,27,75,0.25)"; }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✨</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Generar Proyecto</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>Selecciona el tipo de escritura y revisa los documentos del cliente</div>
          </button>
        </div>

        {/* RESUMEN RÁPIDO */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", boxShadow: "0 2px 10px rgba(13,27,75,0.06)", display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ fontSize: 13, color: "#6b7a9d" }}>
            <strong style={{ color: "#0D1B4B", fontSize: 22 }}>{proyectos.length}</strong> proyectos registrados
          </div>
          <div style={{ fontSize: 13, color: "#6b7a9d" }}>
            <strong style={{ color: "#0D1B4B" }}>{proyectos.filter(p => p.revisor2).length}</strong> con revisión completa
          </div>
          <div style={{ fontSize: 13, color: "#6b7a9d" }}>
            Próximo dictaminador: <strong style={{ color: "#0D1B4B", fontSize: 15 }}>{siguienteDictaminador()}</strong>
          </div>
        </div>
      </div>
    </div>
  );

  // ── VISTA RULETA (control de proyectos existente) ─────────────────────────────
  if (vista === "ruleta") return (
    <div style={hs.wrap}>
      <Header />
      {searchProps?.menuProps && <MenuLateral {...searchProps.menuProps} />}
      {searchProps && <BuscadorGlobal {...searchProps} />}
      <div style={hs.content}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <button onClick={() => setVista("inicio")} style={BTNR}>← Proyectos</button>
          <span style={{ color: "#9aa3be" }}>/</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#0D1B4B" }}>🎡 Ruleta</span>
        </div>

        {/* CONTADORES */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          {DICTAMINADORES_ROTACION.map(d => (
            <div key={d} style={{ background: "#fff", border: "1.5px solid #0D1B4B", borderRadius: 12, padding: "10px 22px", textAlign: "center", minWidth: 100 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#0D1B4B" }}>{conteoDict[d] || 0}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0D1B4B" }}>{d}</div>
              <div style={{ fontSize: 10, opacity: 0.65, color: "#0D1B4B" }}>asignaciones</div>
            </div>
          ))}
          <div style={{ background: "#f4f6fb", border: "1.5px solid #dde2ef", borderRadius: 12, padding: "10px 22px", textAlign: "center", minWidth: 100 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#0D1B4B" }}>{proyectos.length}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#6b7a9d" }}>Total</div>
          </div>
          {editable && (
            <div style={{ marginLeft: "auto", background: "#eaf3fb", border: "1px solid #b8d4ef", borderRadius: 10, padding: "10px 16px", fontSize: 12, color: "#1a5fa3" }}>
              Próximo dictaminador: <strong style={{ fontSize: 15 }}>{siguienteDictaminador()}</strong>
            </div>
          )}
        </div>

        {/* BARRA BÚSQUEDA */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "14px 20px", boxShadow: "0 2px 10px rgba(13,27,75,0.06)", marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input placeholder="🔍 Buscar expediente, operación, dictaminador, protocolista o revisor..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ ...IN, flex: 1, minWidth: 200, marginTop: 0 }} />
        </div>

        {/* TABLA RULETA */}
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(13,27,75,0.07)", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0f2f8", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600, color: "#0D1B4B", fontSize: 15 }}>Control de Proyectos 2026</span>
            <span style={{ fontSize: 13, color: "#9aa3be" }}>{filtrados.length} de {proyectos.length} registros</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {[
                    ["A/B · Fecha · Hora", "#f0f4ff"], ["C · Expediente", "#fff"],
                    ["D · Dictamina", "#f0f4ff"], ["E · Operación", "#fff"],
                    ["F · Banco", "#f0f4ff"], ["G · Protocolista", "#fff"],
                    ["H/I · Fecha Prot.", "#f0f4ff"], ["J · Revisor 1°", "#fef9ec"],
                    ["K · Fecha Rev. 1°", "#fef9ec"], ["L · Subsana 1°", "#f5eefb"],
                    ["M · Fecha Sub. 1°", "#f5eefb"], ["N · Revisor 2°", "#fff0f0"],
                    ["O · Fecha Rev. 2°", "#fff0f0"], ["P · Escritura", "#e8f8f3"],
                    ["Q · Documento", "#f0fff4"],
                  ].map(([label, bg]) => (
                    <th key={label} style={{ padding: "10px 12px", color: "#6b7a9d", fontWeight: 600, fontSize: 11, borderBottom: "1.5px solid #e8ecf4", textAlign: "left", background: bg, whiteSpace: "nowrap" }}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map(p => (
                  <FilaProyecto key={p.id} p={p} editable={editable} onAsignar={(campo, val) => asignar(p.id, campo, val)}
                    onSubirDoc={(archivo) => {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setProyectos(ps => ps.map(pr => pr.id === p.id ? { ...pr, documentoNombre: archivo.name, documentoData: e.target.result, documentoFecha: new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" }), documentoHora: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }) } : pr));
                      };
                      reader.readAsDataURL(archivo);
                    }}
                  />
                ))}
                {filtrados.length === 0 && (
                  <tr><td colSpan={15} style={{ textAlign: "center", padding: 48, color: "#9aa3be" }}>
                    {proyectos.length === 0 ? "Aún no se ha registrado ningún proyecto." : "Sin coincidencias."}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // ── VISTA ELEGIR PROYECTO ─────────────────────────────────────────────────────
  if (vista === "elegir") return (
    <ElegirProyecto
      expedientes={expedientes}
      dictaminadorSugerido={siguienteDictaminador()}
      tipoSeleccionado={tipoSeleccionado}
      setTipoSeleccionado={setTipoSeleccionado}
      expedienteGenerar={expedienteGenerar}
      setExpedienteGenerar={setExpedienteGenerar}
      onSiguiente={() => setVista("documentos")}
      onBack={() => { setVista("inicio"); setTipoSeleccionado(null); setExpedienteGenerar(null); }}
    />
  );

  // ── VISTA DOCUMENTOS DEL CLIENTE ─────────────────────────────────────────────
  if (vista === "documentos") return (
    <DocumentosCliente
      expediente={expedienteGenerar}
      expedientes={expedientes}
      tipoSeleccionado={tipoSeleccionado}
      dictaminadorSugerido={siguienteDictaminador()}
      onCrear={crearProyecto}
      onBack={() => setVista("elegir")}
      sesion={sesion}
    />
  );

  return null;
}


// ── ELEGIR PROYECTO ────────────────────────────────────────────────────────────
export function ElegirProyecto({ expedientes, dictaminadorSugerido, tipoSeleccionado, setTipoSeleccionado, expedienteGenerar, setExpedienteGenerar, onSiguiente, onBack }) {
  const [expTexto, setExpTexto] = useState(expedienteGenerar?.expediente || "");

  const buscarExp = (valor) => {
    setExpTexto(valor);
    const match = expedientes.find(e => e.expediente === valor.trim());
    setExpedienteGenerar(match || null);
  };

  const listo = tipoSeleccionado && expedienteGenerar;

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f4f6fb", color: "#0D1B4B" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "28px 20px" }}>
        {/* BREADCRUMB */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <button onClick={onBack} style={BTNR}>← Proyectos</button>
          <span style={{ color: "#9aa3be" }}>/</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0D1B4B" }}>✨ Elige tu proyecto</span>
        </div>

        {/* CAMPO EXPEDIENTE */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", boxShadow: "0 2px 10px rgba(13,27,75,0.06)", marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#0D1B4B", whiteSpace: "nowrap" }}>Número de expediente:</label>
          <input value={expTexto} onChange={e => buscarExp(e.target.value)} placeholder="Ej. 1-2026"
            style={{ ...IN0, marginTop: 0, maxWidth: 200 }} />
          {expedienteGenerar && (
            <span style={{ fontSize: 13, color: "#16a085", fontWeight: 600 }}>
              ✓ {expedienteGenerar.nombre || "Sin nombre"} · {expedienteGenerar.abogado} · {expedienteGenerar.operacion}
            </span>
          )}
          {expTexto.length > 2 && !expedienteGenerar && (
            <span style={{ fontSize: 13, color: "#c0392b" }}>⚠ Expediente no encontrado</span>
          )}
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          {/* LISTA DE TIPOS DE PROYECTO */}
          <div style={{ width: 320, flexShrink: 0 }}>
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(13,27,75,0.07)", overflow: "hidden" }}>
              <div style={{ background: "#0D1B4B", color: "#fff", padding: "14px 18px", fontWeight: 600, fontSize: 14 }}>
                Selecciona el tipo de proyecto
              </div>
              {TIPOS_PROYECTO.map(tp => {
                const sel = tipoSeleccionado?.id === tp.id;
                return (
                  <button key={tp.id} onClick={() => setTipoSeleccionado(tp)}
                    style={{
                      width: "100%", background: sel ? "#eaf3fb" : "#fff",
                      border: "none", borderLeft: sel ? "4px solid #0D1B4B" : "4px solid transparent",
                      borderBottom: "1px solid #f0f2f8",
                      padding: "14px 16px", cursor: "pointer", textAlign: "left",
                      fontSize: 13, fontWeight: sel ? 700 : 400,
                      color: sel ? "#0D1B4B" : "#2d3a5e",
                      display: "flex", alignItems: "center", gap: 10,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { if (!sel) e.currentTarget.style.background = "#f8f9fc"; }}
                    onMouseLeave={e => { if (!sel) e.currentTarget.style.background = "#fff"; }}>
                    <span style={{ fontSize: 16 }}>📄</span>
                    <span style={{ lineHeight: 1.4 }}>{tp.nombre}</span>
                    {sel && <span style={{ marginLeft: "auto", color: "#1a5fa3", fontSize: 16 }}>✓</span>}
                  </button>
                );
              })}
            </div>

            {/* BOTÓN SIGUIENTE */}
            <button onClick={onSiguiente} disabled={!listo}
              style={{ ...BTNP, marginTop: 16, opacity: listo ? 1 : 0.4, cursor: listo ? "pointer" : "not-allowed", borderRadius: 12, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              Siguiente — Documentos del cliente →
            </button>
            {!listo && (
              <p style={{ fontSize: 11, color: "#9aa3be", textAlign: "center", marginTop: 6 }}>
                {!expedienteGenerar ? "Ingresa el número de expediente" : "Selecciona un tipo de proyecto"}
              </p>
            )}
          </div>

          {/* VISTA PREVIA DEL DOCUMENTO */}
          <div style={{ flex: 1, minWidth: 0, background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(13,27,75,0.07)", overflow: "hidden" }}>
            <div style={{ background: "#f8f9fc", borderBottom: "1.5px solid #e8ecf4", padding: "12px 18px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 14 }}>📄</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0D1B4B" }}>
                {tipoSeleccionado ? `Modelo: ${tipoSeleccionado.nombre}` : "Vista previa del modelo de escritura"}
              </span>
              {tipoSeleccionado && (
                <span style={{ marginLeft: "auto", fontSize: 11, background: "#eaf3fb", color: "#1a5fa3", borderRadius: 6, padding: "2px 8px" }}>
                  ESC_24001_831.doc
                </span>
              )}
            </div>
            <div style={{ height: 520, overflowY: "auto", padding: tipoSeleccionado ? "24px 28px" : "60px 28px" }}>
              {tipoSeleccionado ? (
                <pre style={{
                  fontFamily: "'Times New Roman', Georgia, serif", fontSize: 13.5, lineHeight: 1.8,
                  color: "#1a1a2e", whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0,
                }}>
                  {DOC_PREVIEW}
                </pre>
              ) : (
                <div style={{ textAlign: "center", color: "#9aa3be" }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>📄</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Sin modelo seleccionado</div>
                  <div style={{ fontSize: 13 }}>Selecciona un tipo de proyecto para ver el modelo de escritura</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ── DOCUMENTOS DEL CLIENTE ─────────────────────────────────────────────────────
export function DocumentosCliente({ expediente, expedientes, tipoSeleccionado, dictaminadorSugerido, onCrear, onBack, sesion }) {
  const [protocolista, setProtocolista] = useState("");
  const [dictamina, setDictamina] = useState(dictaminadorSugerido);

  // Obtener expediente COMPLETO (con documentos) desde la lista maestra
  const expCompleto = expedientes.find(e => e.expediente === expediente?.expediente) || expediente || {};
  const docsExpediente = expCompleto?.documentos || {};
  const docsSubidos = Object.keys(docsExpediente).length;
  const totalDocs = DOCUMENTOS_EXPEDIENTE.length;
  const pctCompleto = Math.round(docsSubidos / totalDocs * 100);

  const handleCrear = () => {
    if (!protocolista) return;
    onCrear({
      expediente: expediente.expediente,
      dictamina,
      operacion: expCompleto.operacion || expediente.operacion,
      banco: expCompleto.banco || expediente.banco,
      protocolista,
      tipoProyecto: tipoSeleccionado?.nombre || "",
    });
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f4f6fb", color: "#0D1B4B" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px" }}>

        {/* BREADCRUMB */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <button onClick={onBack} style={BTNR}>← Elige tu proyecto</button>
          <span style={{ color: "#9aa3be" }}>/</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0D1B4B" }}>📂 Documentos del cliente</span>
        </div>

        {/* INFO EXPEDIENTE */}
        <div style={{ background: "#0D1B4B", borderRadius: 14, padding: "18px 24px", marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Expediente</div>
            <div style={{ fontFamily: "monospace", fontWeight: 800, color: "#fff", fontSize: 18 }}>{expCompleto.expediente}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Cliente</div>
            <div style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>{expCompleto.nombre || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Tipo de proyecto</div>
            <div style={{ fontWeight: 600, color: "#7fb3e8", fontSize: 13 }}>{tipoSeleccionado?.nombre}</div>
          </div>
          {/* BARRA DE PROGRESO DOCS */}
          <div style={{ marginLeft: "auto", textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: docsSubidos === totalDocs ? "#2ecc71" : "#fff" }}>
              {docsSubidos}/{totalDocs}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>documentos cargados</div>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 99, height: 6, width: 120, marginTop: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pctCompleto}%`, background: docsSubidos === totalDocs ? "#2ecc71" : "#7fb3e8", borderRadius: 99, transition: "width 0.4s" }} />
            </div>
          </div>
        </div>

        {/* ASIGNACIÓN DICTAMINA Y PROTOCOLISTA */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "18px 22px", boxShadow: "0 2px 10px rgba(13,27,75,0.06)", marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Campo label="D · Dictamina">
            <select value={dictamina} onChange={e => setDictamina(e.target.value)} style={IN0}>
              {[...DICTAMINADORES_ROTACION, ...ABOGADOS.filter(a => !DICTAMINADORES_ROTACION.includes(a))].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </Campo>
          <Campo label="G · Protocolista *">
            <select value={protocolista} onChange={e => setProtocolista(e.target.value)} style={IN0}>
              <option value="">Seleccionar...</option>
              {PROTOCOLISTAS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Campo>
        </div>

        {/* LISTA DE DOCUMENTOS */}
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(13,27,75,0.07)", overflow: "hidden", marginBottom: 20 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0f2f8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 600, color: "#0D1B4B", fontSize: 15 }}>Documentos requeridos</span>
            <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
              <span style={{ color: "#27ae60", fontWeight: 600 }}>✅ {docsSubidos} cargados</span>
              <span style={{ color: "#e74c3c", fontWeight: 600 }}>🔴 {totalDocs - docsSubidos} faltantes</span>
            </div>
          </div>
          <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {DOCUMENTOS_EXPEDIENTE.map(nombreDoc => {
              const doc = docsExpediente[nombreDoc];
              const tieneDoc = Boolean(doc);
              return (
                <div key={nombreDoc} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: tieneDoc ? "#f0fff4" : "#fff5f5",
                  border: `2px solid ${tieneDoc ? "#27ae60" : "#e74c3c"}`,
                  borderRadius: 10, padding: "11px 16px",
                  transition: "all 0.15s",
                }}>
                  {/* INDICADOR */}
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: tieneDoc ? "#27ae60" : "#e74c3c",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16,
                  }}>
                    {tieneDoc ? "✓" : "✗"}
                  </div>

                  {/* NOMBRE */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: tieneDoc ? 600 : 500, color: tieneDoc ? "#1a7a3d" : "#c0392b" }}>
                      {nombreDoc}
                    </div>
                    {tieneDoc && (
                      <div style={{ fontSize: 11, color: "#6b7a9d", marginTop: 2 }}>
                        {doc.nombre} · Subido el {doc.fecha} a las {doc.hora} por {doc.subidoPor}
                      </div>
                    )}
                  </div>

                  {/* ACCIÓN */}
                  {tieneDoc ? (
                    <a href={doc.data} download={doc.nombre} target="_blank" rel="noreferrer"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0,
                        background: "#27ae60", border: "none", borderRadius: 8,
                        padding: "7px 16px", color: "#fff", fontWeight: 700, fontSize: 12,
                        textDecoration: "none", cursor: "pointer",
                      }}>
                      ⬇ Descargar
                    </a>
                  ) : (
                    <span style={{
                      fontSize: 11, color: "#e74c3c", background: "#fff0f0",
                      border: "1px solid #f5b7b1", borderRadius: 6,
                      padding: "4px 10px", fontWeight: 600, flexShrink: 0,
                    }}>
                      No cargado
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* AVISO SI FALTAN DOCS */}
        {docsSubidos < totalDocs && (
          <div style={{ background: "#fef9ec", border: "1.5px solid #f0d98c", borderRadius: 12, padding: "12px 18px", marginBottom: 16, fontSize: 13, color: "#8a6d1a", display: "flex", alignItems: "center", gap: 10 }}>
            ⚠ Faltan {totalDocs - docsSubidos} documento(s). Puede crear el proyecto de todas formas o volver al expediente a cargarlos.
          </div>
        )}

        {/* BOTÓN CREAR PROYECTO */}
        <button onClick={handleCrear} disabled={!protocolista}
          style={{ ...BTNP, marginTop: 0, fontSize: 15, opacity: protocolista ? 1 : 0.5, cursor: protocolista ? "pointer" : "not-allowed", borderRadius: 14, padding: "14px" }}>
          ✨ Crear proyecto — {tipoSeleccionado?.nombre}
        </button>
        {!protocolista && (
          <p style={{ fontSize: 12, color: "#c0392b", marginTop: 8, textAlign: "center" }}>
            ⚠ Selecciona una protocolista para continuar.
          </p>
        )}
      </div>
    </div>
  );
}




// ─── PREVIOS (Área 2) ─────────────────────────────────────────────────────────
