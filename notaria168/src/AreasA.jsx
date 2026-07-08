import React, { useState, useRef, useEffect } from "react";
import { AREAS, ABOGADOS, BANCOS_MEXICO, BIMESTRES, DOCUMENTOS_EXPEDIENTE, OPERACIONES_NOTARIALES, ESTATUS_EXPEDIENTE, METODOS_PAGO_FOLIO, FORMAS_PAGO_FOLIO, estatusInfo } from "./constants";
import { MenuLateral, BuscadorGlobal } from "./Shared";
import { IN, BTNP, BTNR, TD, LBL, IN0, BTNAC } from "./AreasB";
export function Previos({ previos, setPrevios, expedientes, sesion, editable, onBack, onLogout, logoUrl, hs, searchProps }) {
  const [vista, setVista] = useState("lista");
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const crearPrevio = (datos) => {
    const nuevo = {
      id: (previos.reduce((m, p) => Math.max(m, p.id), 0)) + 1,
      ...datos,
      registradoPor: sesion.nombre,
      fechaCreacion: new Date().toISOString().slice(0, 10),
    };
    setPrevios(ps => [...ps, nuevo]);
    setVista("lista");
  };

  const actualizarCertificaciones = (id, campo, valor) => {
    setPrevios(ps => ps.map(p => p.id === id ? { ...p, [campo]: valor } : p));
  };

  const filtrados = previos.filter(p => {
    const q = busqueda.toLowerCase();
    return !q || p.expediente?.toLowerCase().includes(q) || p.nombreCliente?.toLowerCase().includes(q) || p.abogado?.toLowerCase().includes(q) || p.municipio?.toLowerCase().includes(q) || p.operacion?.toLowerCase().includes(q);
  }).sort((a, b) => b.id - a.id);

  const certCampos = [
    { clave: "catastro",     label: "Catastro",     subCampos: ["ingreso", "entrega"], tieneBimestre: false },
    { clave: "mejoras",      label: "Mejoras",      subCampos: ["ingreso", "entrega"], tieneBimestre: false },
    { clave: "predial",      label: "Predial",      subCampos: ["ingreso", "entrega"], tieneBimestre: false },
    { clave: "agua",         label: "Agua",         subCampos: ["bimestre", "ingreso", "entrega"], tieneBimestre: true },
    { clave: "zonificacion", label: "Zonificación", subCampos: ["bimestre", "ingreso", "entrega"], tieneBimestre: true },
  ];

  const subirPdfCertificacion = (id, clave, pdf) => {
    setPrevios(ps => ps.map(p => p.id === id ? {
      ...p,
      [`${clave}PdfNombre`]: pdf.nombre,
      [`${clave}PdfData`]:   pdf.data,
      [`${clave}PdfFecha`]:  pdf.fecha,
      [`${clave}PdfHora`]:   pdf.hora,
    } : p));
  };

  return (
    <div style={hs.wrap}>
      <header style={hs.header}>
        <img src={logoUrl} alt="Notaría 168" style={hs.logoImg} onError={e => e.target.style.display = "none"} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={hs.areaBadge}>{sesion.nombre} — {sesion.area}</span>
          <button style={hs.logoutBtn} onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>
      {searchProps?.menuProps && <MenuLateral {...searchProps.menuProps} />}
      {searchProps && <BuscadorGlobal {...searchProps} />}

      <div style={hs.content}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <button onClick={onBack} style={BTNR}>← Menú principal</button>
          <span style={{ color: "#9aa3be", fontSize: 14 }}>/</span>
          <span onClick={() => setVista("lista")} style={{ fontSize: 14, fontWeight: 600, color: "#0D1B4B", cursor: "pointer" }}>
            🔍 Previos
          </span>
          {vista === "nuevo" && (<><span style={{ color: "#9aa3be", fontSize: 14 }}>/</span><span style={{ fontSize: 14, fontWeight: 600, color: "#0D1B4B" }}>nuevo</span></>)}
        </div>

        {/* BARRA DE HERRAMIENTAS */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", boxShadow: "0 2px 10px rgba(13,27,75,0.06)", marginBottom: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input placeholder="🔍 Buscar por expediente, nombre, abogado, operación o municipio..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ ...IN, flex: 1, minWidth: 200, marginTop: 0 }} />
          {editable && (
            <button onClick={() => setVista("nuevo")} style={{ ...BTNP, width: "auto", marginTop: 0, padding: "10px 22px", fontSize: 14 }}>+ Nuevo previo</button>
          )}
        </div>

        {/* FORMULARIO NUEVO */}
        {vista === "nuevo" && editable && (
          <FormularioPrevio expedientes={expedientes} onCrear={crearPrevio} onCancelar={() => setVista("lista")} />
        )}

        {/* VISTA LISTA */}
        {vista === "lista" && (
          <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(13,27,75,0.07)", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0f2f8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: "#0D1B4B", fontSize: 15 }}>Registro de Previos — Certificaciones</span>
              <span style={{ fontSize: 13, color: "#9aa3be" }}>{filtrados.length} de {previos.length} registros</span>
            </div>

            {filtrados.length === 0 ? (
              <div style={{ textAlign: "center", padding: 56, color: "#9aa3be", fontSize: 15 }}>
                {previos.length === 0 ? "Aún no se ha registrado ningún previo." : "No hay registros que coincidan con la búsqueda."}
              </div>
            ) : (
              <div>
                {filtrados.map(p => (
                  <TarjetaPrevio
                    key={p.id}
                    previo={p}
                    editable={editable}
                    certCampos={certCampos}
                    onActualizar={(campo, valor) => actualizarCertificaciones(p.id, campo, valor)}
                    onSubirPdf={(clave, pdf) => subirPdfCertificacion(p.id, clave, pdf)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function TarjetaPrevio({ previo: p, editable, certCampos, onActualizar, onSubirPdf }) {
  const [expandido, setExpandido] = useState(false);
  const fileRefs = useRef({});

  const colorCert = (clave) => {
    const ing = p[`${clave}Ingreso`];
    const ent = p[`${clave}Entrega`];
    const doc = p[`${clave}PdfNombre`];
    if (!ing && !ent) return { bg: "#f8f9fc", borde: "#e8ecf4" };
    if (ing && !ent) return { bg: "#fef9ec", borde: "#f0d98c" };
    if (ing && ent && !doc) return { bg: "#eafaf1", borde: "#b8e8cf" };
    return { bg: "#eaf3fb", borde: "#7fb3e8" }; // completo con doc
  };

  const handlePdf = (clave, e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    if (!archivo.name.toLowerCase().endsWith(".pdf")) {
      alert("Solo se permiten archivos PDF.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      onSubirPdf(clave, {
        nombre: archivo.name,
        data: ev.target.result,
        fecha: new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" }),
        hora: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }),
      });
    };
    reader.readAsDataURL(archivo);
    e.target.value = "";
  };

  return (
    <div style={{ borderBottom: "1px solid #f0f2f8" }}>
      {/* CABECERA */}
      <div
        onClick={() => setExpandido(e => !e)}
        style={{ padding: "14px 20px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 16 }}
        onMouseEnter={e => e.currentTarget.style.background = "#f8f9fc"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#0D1B4B", fontSize: 15 }}>{p.expediente}</span>
            <span style={{ background: "#eef2fb", color: "#3a4f8a", borderRadius: 6, padding: "2px 10px", fontWeight: 600, fontSize: 12 }}>{p.abogado}</span>
            <span style={{ fontSize: 13, color: "#6b7a9d" }}>{p.operacion}</span>
          </div>
          <div style={{ fontSize: 13, color: "#2d3a5e", marginBottom: 4 }}>{p.nombreCliente}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {certCampos.map(c => {
              const col = colorCert(c.clave);
              const tieneDoc = Boolean(p[`${c.clave}PdfNombre`]);
              return (
                <span key={c.clave} style={{ fontSize: 11, background: col.bg, border: `1px solid ${col.borde}`, borderRadius: 6, padding: "2px 8px", color: "#5a6a8a", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                  {c.label}
                  {tieneDoc && <span title="PDF adjunto" style={{ color: "#c0392b" }}>📎</span>}
                </span>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {p.municipio && <span style={{ fontSize: 12, color: "#9aa3be" }}>{p.municipio}</span>}
          <span style={{ color: "#9aa3be", fontSize: 18, transition: "transform 0.2s", transform: expandido ? "rotate(90deg)" : "none" }}>›</span>
        </div>
      </div>

      {/* DETALLE EXPANDIDO */}
      {expandido && (
        <div style={{ padding: "16px 20px 20px", background: "#fafbfd", borderTop: "1px solid #f0f2f8" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {certCampos.map(c => {
              const pdfNombre = p[`${c.clave}PdfNombre`];
              const pdfData   = p[`${c.clave}PdfData`];
              const pdfFecha  = p[`${c.clave}PdfFecha`];
              const pdfHora   = p[`${c.clave}PdfHora`];
              return (
                <div key={c.clave} style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #e8ecf4", padding: "14px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0D1B4B", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.4 }}>
                    {c.label}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {c.tieneBimestre && (
                      <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontSize: 11, color: "#6b7a9d", fontWeight: 600 }}>Bimestre</span>
                        {editable ? (
                          <select value={p[`${c.clave}Bimestre`] || ""} onChange={e => onActualizar(`${c.clave}Bimestre`, e.target.value)} style={{ ...IN0, fontSize: 12, padding: "6px 10px" }}>
                            <option value="">—</option>
                            {BIMESTRES.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                        ) : (
                          <span style={{ fontSize: 13, color: "#2d3a5e" }}>{p[`${c.clave}Bimestre`] || "—"}</span>
                        )}
                      </label>
                    )}
                    {["Ingreso", "Entrega"].map(sub => {
                      const campo = `${c.clave}${sub}`;
                      const valor = p[campo] || "";
                      return (
                        <label key={sub} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ fontSize: 11, color: "#6b7a9d", fontWeight: 600 }}>Fecha de {sub.toLowerCase()}</span>
                          {editable ? (
                            <input
                              value={valor}
                              onChange={e => onActualizar(campo, e.target.value)}
                              placeholder="Fecha o nota (ej: PENDIENTE, N/A...)"
                              style={{ ...IN0, fontSize: 12, padding: "6px 10px" }}
                            />
                          ) : (
                            <span style={{ fontSize: 13, color: valor ? "#2d3a5e" : "#c8d0e4" }}>{valor || "—"}</span>
                          )}
                        </label>
                      );
                    })}

                    {/* ── SECCIÓN PDF ─────────────────────────────────── */}
                    <div style={{ marginTop: 4, paddingTop: 10, borderTop: "1px dashed #e8ecf4" }}>
                      <span style={{ fontSize: 11, color: "#6b7a9d", fontWeight: 600, display: "block", marginBottom: 6 }}>
                        Documento PDF
                      </span>
                      {pdfNombre ? (
                        <div>
                          <a href={pdfData} download={pdfNombre} target="_blank" rel="noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#fff0f0", border: "1px solid #e74c3c", borderRadius: 7, padding: "5px 10px", color: "#c0392b", fontWeight: 600, fontSize: 12, textDecoration: "none", marginBottom: 4 }}>
                            📄 {pdfNombre.length > 22 ? pdfNombre.slice(0, 19) + "..." : pdfNombre}
                          </a>
                          <div style={{ fontSize: 10, color: "#9aa3be", marginBottom: 4 }}>
                            {pdfFecha} {pdfHora}
                          </div>
                          {editable && (
                            <button onClick={() => fileRefs.current[c.clave]?.click()}
                              style={{ fontSize: 11, color: "#9aa3be", background: "none", border: "1px solid #e0e6f0", borderRadius: 5, padding: "2px 8px", cursor: "pointer" }}>
                              Reemplazar PDF
                            </button>
                          )}
                        </div>
                      ) : editable ? (
                        <button onClick={() => fileRefs.current[c.clave]?.click()}
                          style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#fff5f5", border: "1.5px dashed #e74c3c", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#c0392b", fontSize: 12, fontWeight: 600 }}>
                          ⬆ Subir PDF
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: "#c8d0e4" }}>Sin documento</span>
                      )}
                      <input
                        ref={el => fileRefs.current[c.clave] = el}
                        type="file" accept=".pdf"
                        onChange={e => handlePdf(c.clave, e)}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {p.observaciones && (
            <div style={{ marginTop: 14, padding: "10px 14px", background: "#fff", borderRadius: 10, border: "1px solid #e8ecf4", fontSize: 13, color: "#2d3a5e" }}>
              📝 {p.observaciones}
            </div>
          )}
          <div style={{ marginTop: 10, fontSize: 12, color: "#c8d0e4" }}>
            Registrado por {p.registradoPor} · {p.fechaCreacion}
          </div>
        </div>
      )}
    </div>
  );
}

export function FormularioPrevio({ expedientes, onCrear, onCancelar }) {
  const [form, setForm] = useState({
    expediente: "", fecha: "", abogado: "", nombreCliente: "", operacion: "",
    banco: "", noCreditoInfonavit: "", municipio: "", observaciones: "",
  });
  const [expSugerido, setExpSugerido] = useState(null);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const buscarExpediente = (valor) => {
    const match = expedientes.find(e => e.expediente === valor.trim());
    if (match) {
      setExpSugerido(match);
      setForm(f => ({ ...f, expediente: valor, abogado: match.abogado, nombreCliente: match.nombre, operacion: match.operacion, banco: match.banco }));
    } else {
      setExpSugerido(null);
      setForm(f => ({ ...f, expediente: valor }));
    }
  };

  const handleSubmit = () => {
    if (!form.expediente) return;
    onCrear(form);
  };

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "32px 36px", boxShadow: "0 4px 24px rgba(13,27,75,0.08)", marginBottom: 20 }}>
      <h2 style={{ fontSize: 19, fontWeight: 700, color: "#0D1B4B", margin: "0 0 20px" }}>Nuevo previo</h2>
      <p style={{ fontSize: 13, color: "#6b7a9d", marginBottom: 20, marginTop: -12 }}>
        Ingresa el expediente para cargar los datos automáticamente. Las certificaciones se llenarán en la tarjeta de la lista.
      </p>

      <Grid2>
        <Campo label="Expediente">
          <input value={form.expediente} onChange={e => buscarExpediente(e.target.value)} placeholder="Ej. 12-2026" style={IN0} />
        </Campo>
        <Campo label="Fecha">
          <input type="date" value={form.fecha} onChange={set("fecha")} style={IN0} />
        </Campo>
        <Campo label="Abogado"><input value={form.abogado} onChange={set("abogado")} style={IN0} /></Campo>
        <Campo label="Nombre del cliente"><input value={form.nombreCliente} onChange={set("nombreCliente")} style={IN0} /></Campo>
        <Campo label="Operación"><input value={form.operacion} onChange={set("operacion")} style={IN0} /></Campo>
        <Campo label="Banco">
          <select value={form.banco} onChange={set("banco")} style={IN0}>
            <option value="">-----------</option>
            {BANCOS_MEXICO.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </Campo>
        <Campo label="No. crédito Infonavit"><input value={form.noCreditoInfonavit} onChange={set("noCreditoInfonavit")} style={IN0} /></Campo>
        <Campo label="Estado o municipio"><input value={form.municipio} onChange={set("municipio")} style={IN0} /></Campo>
      </Grid2>

      {expSugerido && (
        <div style={{ marginTop: 12, fontSize: 12, color: "#16a085", background: "#e8f8f3", padding: "6px 12px", borderRadius: 8, display: "inline-block" }}>
          ✓ Datos cargados del expediente {expSugerido.expediente}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <label style={{ fontSize: 12, color: "#6b7a9d", fontWeight: 600, display: "block", marginBottom: 4 }}>Observaciones generales</label>
        <textarea value={form.observaciones} onChange={set("observaciones")} rows={2} style={{ ...IN0, resize: "vertical" }} />
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button onClick={handleSubmit} disabled={!form.expediente}
          style={{ ...BTNP, width: "auto", marginTop: 0, padding: "11px 28px", fontSize: 14, opacity: form.expediente ? 1 : 0.5, cursor: form.expediente ? "pointer" : "not-allowed" }}>
          Crear previo
        </button>
        <button onClick={onCancelar} style={{ ...BTNP, width: "auto", marginTop: 0, padding: "11px 28px", fontSize: 14, background: "#fff", color: "#0D1B4B", border: "1.5px solid #dde2ef" }}>
          Cancelar
        </button>
      </div>
      {!form.expediente && <p style={{ fontSize: 12, color: "#c0392b", marginTop: 10 }}>⚠ El número de expediente es obligatorio.</p>}
    </div>
  );
}


// ─── REGISTRO DE EXPEDIENTES (Área 1) ────────────────────────────────────────
export function RegistroExpedientes({ expedientes, setExpedientes, todosLosDatos, sesion, editable, onBack, onLogout, logoUrl, hs, searchProps }) {
  const [vista, setVista] = useState("lista"); // "lista" | "nuevo" | "detalle"
  const [busqueda, setBusqueda] = useState("");
  const [detalleId, setDetalleId] = useState(null);

  const anioActual = new Date().getFullYear();

  const siguienteConsecutivo = () => {
    const delAnio = expedientes.filter(e => e.anio === anioActual);
    const max = delAnio.reduce((m, e) => Math.max(m, e.consecutivo), 0);
    return max + 1;
  };

  const crearExpediente = (datos) => {
    const consecutivo = siguienteConsecutivo();
    const hoy = new Date();
    const fechaApertura = hoy.toISOString().slice(0, 10);
    const ahora = {
      fecha: hoy.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" }),
      hora:  hoy.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
    const nuevo = {
      id: (expedientes.reduce((m, e) => Math.max(m, e.id), 0)) + 1,
      consecutivo,
      anio: anioActual,
      expediente: `${consecutivo}-${anioActual}`,
      abogado: datos.abogado,
      nombre: datos.nombre,
      operacion: datos.operacion,
      montoUIF: datos.montoUIF,
      banco: datos.banco,
      estatus: "apertura",
      fechaApertura,
      registradoPor: sesion.nombre,
      comentarios: [],
      historial: [
        { campo: "Creación", valorAnterior: "—", valorNuevo: "Apertura de expediente", usuario: sesion.nombre, fecha: ahora.fecha, hora: ahora.hora },
      ],
    };
    setExpedientes(es => [...es, nuevo]);
    setVista("lista");
  };

  const filtrados = expedientes.filter(e => {
    const q = busqueda.toLowerCase();
    return !q || e.expediente.toLowerCase().includes(q) || e.nombre.toLowerCase().includes(q) || e.abogado.toLowerCase().includes(q);
  }).sort((a, b) => b.id - a.id);

  return (
    <div style={hs.wrap}>
      <header style={hs.header}>
        <img src={logoUrl} alt="Notaría 168" style={hs.logoImg} onError={e => e.target.style.display = "none"} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={hs.areaBadge}>{sesion.nombre} — {sesion.area}</span>
          <button style={hs.logoutBtn} onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>

      <div style={hs.content}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <button onClick={onBack} style={BTNR}>← Menú principal</button>
          <span style={{ color: "#9aa3be", fontSize: 14 }}>/</span>
          <span
            onClick={() => setVista("lista")}
            style={{ fontSize: 14, fontWeight: 600, color: vista === "lista" ? "#0D1B4B" : "#6b7a9d", cursor: "pointer" }}>
            📁 Expedientes
          </span>
          {vista === "nuevo" && (<><span style={{ color: "#9aa3be", fontSize: 14 }}>/</span><span style={{ fontSize: 14, fontWeight: 600, color: "#0D1B4B" }}>nuevo</span></>)}
        </div>

        {vista === "lista" && (
          <>
            <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", boxShadow: "0 2px 10px rgba(13,27,75,0.06)", marginBottom: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <input
                placeholder="🔍 Buscar por expediente, nombre o abogado..."
                value={busqueda} onChange={e => setBusqueda(e.target.value)}
                style={{ ...IN, flex: 1, minWidth: 200, marginTop: 0 }}
              />
              {editable && (
                <button onClick={() => setVista("nuevo")} style={{ ...BTNP, width: "auto", marginTop: 0, padding: "10px 22px", fontSize: 14 }}>
                  + Nuevo expediente
                </button>
              )}
            </div>

            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(13,27,75,0.07)", overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0f2f8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, color: "#0D1B4B", fontSize: 15 }}>Expedientes registrados — {anioActual}</span>
                <span style={{ fontSize: 13, color: "#9aa3be" }}>{filtrados.length} de {expedientes.length} registros</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "#f8f9fc" }}>
                      {["Expediente", "Nombre", "Abogado", "Operación", "Monto UIF", "Banco", "Estatus", "Apertura", ""].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "11px 14px", color: "#6b7a9d", fontWeight: 600, fontSize: 12, borderBottom: "1.5px solid #e8ecf4", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.map(e => {
                      const est = ESTATUS_EXPEDIENTE.find(s => s.valor === e.estatus) || ESTATUS_EXPEDIENTE[0];
                      const numComentarios = (e.comentarios || []).length;
                      return (
                        <tr key={e.id} style={{ borderBottom: "1px solid #f4f6fb", cursor: "pointer" }}
                          onClick={() => { setDetalleId(e.id); setVista("detalle"); }}
                          onMouseEnter={ev => ev.currentTarget.style.background = "#f8f9fc"}
                          onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                          <td style={{ ...TD, fontWeight: 700, color: "#0D1B4B", fontFamily: "monospace" }}>{e.expediente}</td>
                          <td style={TD}>{e.nombre || <span style={{ color: "#c8d0e4" }}>—</span>}</td>
                          <td style={TD}><span style={{ background: "#eef2fb", color: "#3a4f8a", borderRadius: 6, padding: "2px 10px", fontWeight: 600, fontSize: 12 }}>{e.abogado || "—"}</span></td>
                          <td style={TD}>{e.operacion || <span style={{ color: "#c8d0e4" }}>—</span>}</td>
                          <td style={TD}>{e.montoUIF ? `$${Number(e.montoUIF).toLocaleString("es-MX")}` : "$0"}</td>
                          <td style={TD}>{e.banco || <span style={{ color: "#c8d0e4" }}>—</span>}</td>
                          <td style={TD}><span style={{ background: est.bg, color: est.color, borderRadius: 8, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>{est.label}</span></td>
                          <td style={{ ...TD, fontSize: 13 }}>{e.fechaApertura}</td>
                          <td style={TD} onClick={ev => ev.stopPropagation()}>
                            <button onClick={() => { setDetalleId(e.id); setVista("detalle"); }}
                              style={{ display: "inline-flex", alignItems: "center", gap: 4, background: numComentarios > 0 ? "#eaf3fb" : "#f4f6fb", border: `1px solid ${numComentarios > 0 ? "#b8d4ef" : "#dde2ef"}`, borderRadius: 8, padding: "4px 10px", cursor: "pointer", color: numComentarios > 0 ? "#1a5fa3" : "#9aa3be", fontSize: 12, fontWeight: 500 }}>
                              💬 {numComentarios > 0 ? numComentarios : ""}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filtrados.length === 0 && (
                      <tr><td colSpan={9} style={{ textAlign: "center", padding: 48, color: "#9aa3be" }}>
                        {expedientes.length === 0 ? "Aún no se ha registrado ningún expediente." : "No hay expedientes que coincidan con la búsqueda."}
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {vista === "nuevo" && editable && (
          <FormularioNuevoExpediente
            siguienteExpediente={`${siguienteConsecutivo()}-${anioActual}`}
            onCrear={crearExpediente}
            onCancelar={() => setVista("lista")}
          />
        )}

        {vista === "detalle" && (
          <DetalleExpediente
            expediente={expedientes.find(e => e.id === detalleId)}
            todosLosDatos={todosLosDatos || {}}
            sesion={sesion}
            setExpedientes={setExpedientes}
            canVerHistorial={sesion?.rol === "admin" || sesion?.verHistorial === true}
            onVolver={() => setVista("lista")}
          />
        )}
      </div>
    </div>
  );
}

export function FormularioNuevoExpediente({ siguienteExpediente, onCrear, onCancelar }) {
  const [form, setForm] = useState({
    abogado: "", nombre: "", operacion: "", montoUIF: "", banco: "",
  });

  const hoy = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" });

  const handleSubmit = () => {
    if (!form.abogado) return;
    onCrear(form);
  };

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "32px 36px", boxShadow: "0 4px 24px rgba(13,27,75,0.08)" }}>
      <h2 style={{ fontSize: 19, fontWeight: 700, color: "#0D1B4B", margin: "0 0 24px" }}>Nuevo expediente</h2>

      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", rowGap: 16, columnGap: 16, alignItems: "center", maxWidth: 560 }}>

        <label style={LBL}>Abogado:</label>
        <select value={form.abogado} onChange={e => setForm(f => ({ ...f, abogado: e.target.value }))} style={IN0}>
          <option value="">---- (0)</option>
          {ABOGADOS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <label style={LBL}>Expediente:</label>
        <div style={{ background: "#eafaf1", border: "1.5px solid #b8e8cf", borderRadius: 10, padding: "10px 14px", color: "#16a085", fontWeight: 700, fontFamily: "monospace", fontSize: 15 }}>
          {siguienteExpediente} <span style={{ fontWeight: 400, fontSize: 12, color: "#5fae8c" }}>(automático)</span>
        </div>

        <label style={LBL}>Nombre:</label>
        <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Nombre del cliente / solicitante" style={IN0} />

        <label style={LBL}>Operación:</label>
        <select value={form.operacion} onChange={e => setForm(f => ({ ...f, operacion: e.target.value }))} style={IN0}>
          <option value="">Seleccionar operación...</option>
          {OPERACIONES_NOTARIALES.map(op => <option key={op} value={op}>{op}</option>)}
        </select>

        <label style={LBL}>Monto UIF:</label>
        <input type="number" value={form.montoUIF} onChange={e => setForm(f => ({ ...f, montoUIF: e.target.value }))} placeholder="0" style={IN0} />

        <label style={LBL}>Banco:</label>
        <select value={form.banco} onChange={e => setForm(f => ({ ...f, banco: e.target.value }))} style={IN0}>
          <option value="">-----------</option>
          {BANCOS_MEXICO.map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        <label style={LBL}>Estatus:</label>
        <div style={{ background: "#e8f8f3", border: "1.5px solid #b8e8cf", borderRadius: 10, padding: "9px 14px", color: "#16a085", fontWeight: 600, fontSize: 14, width: "fit-content" }}>
          Apertura de expediente
        </div>

        <label style={{ ...LBL, color: "#d35400" }}>Apertura:</label>
        <div style={{ color: "#d35400", fontWeight: 600, fontSize: 14 }}>
          📅 {hoy} <span style={{ fontWeight: 400, fontSize: 12, color: "#c89a7a" }}>(fecha de hoy)</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
        <button onClick={handleSubmit} disabled={!form.abogado} style={{ ...BTNP, width: "auto", marginTop: 0, padding: "11px 28px", fontSize: 14, opacity: form.abogado ? 1 : 0.5, cursor: form.abogado ? "pointer" : "not-allowed" }}>
          Crear expediente
        </button>
        <button onClick={onCancelar} style={{ ...BTNP, width: "auto", marginTop: 0, padding: "11px 28px", fontSize: 14, background: "#fff", color: "#0D1B4B", border: "1.5px solid #dde2ef" }}>
          Cancelar
        </button>
      </div>
      {!form.abogado && (
        <p style={{ fontSize: 12, color: "#c0392b", marginTop: 10 }}>⚠ Debe seleccionar un abogado para crear el expediente.</p>
      )}
    </div>
  );
}

// ─── CATÁLOGO DE DOCUMENTOS NOTARIALES ───────────────────────────────────────

export function DetalleExpediente({ expediente, todosLosDatos, sesion, setExpedientes, canVerHistorial, onVolver }) {
  const [tabActiva, setTabActiva] = useState("datos");
  const [nuevoComentario, setNuevoComentario] = useState("");
  const docRefs = useRef({});

  if (!expediente) return (
    <div style={{ background: "#fff", borderRadius: 20, padding: 40, textAlign: "center", color: "#9aa3be" }}>
      Expediente no encontrado.
      <div style={{ marginTop: 16 }}><button onClick={onVolver} style={BTNR}>← Volver a la lista</button></div>
    </div>
  );

  const agregarComentario = () => {
    if (!nuevoComentario.trim()) return;
    const ahora = new Date();
    const comentario = {
      id: ((expediente.comentarios || []).length + 1),
      texto: nuevoComentario.trim(),
      usuario: sesion?.nombre || "Usuario",
      fecha: ahora.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" }),
      hora: ahora.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
    setExpedientes(es => es.map(e => e.id === expediente.id
      ? { ...e, comentarios: [...(e.comentarios || []), comentario] }
      : e
    ));
    setNuevoComentario("");
  };

  const subirDocumento = (nombreDoc, archivo) => {
    const esValido = archivo.name.toLowerCase().endsWith(".pdf") ||
                     archivo.name.toLowerCase().endsWith(".doc") ||
                     archivo.name.toLowerCase().endsWith(".docx");
    if (!esValido) { alert("Solo se permiten archivos PDF, DOC o DOCX."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ahora = new Date();
      const docNuevo = {
        nombre: archivo.name,
        data: ev.target.result,
        tipo: archivo.name.toLowerCase().endsWith(".pdf") ? "pdf" : "word",
        fecha: ahora.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" }),
        hora: ahora.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }),
        subidoPor: sesion?.nombre || "Usuario",
      };
      setExpedientes(es => es.map(e => {
        if (e.id !== expediente.id) return e;
        const docsActuales = e.documentos || {};
        return { ...e, documentos: { ...docsActuales, [nombreDoc]: docNuevo } };
      }));
    };
    reader.readAsDataURL(archivo);
    if (docRefs.current[nombreDoc]) docRefs.current[nombreDoc].value = "";
  };

  const documentos = expediente.documentos || {};

  const { previos = [], pasesFolio = [], pasesFolio2 = [], proyectos = [], traslados = [] } = todosLosDatos;
  const exp = expediente.expediente;
  const est = ESTATUS_EXPEDIENTE.find(s => s.valor === expediente.estatus) || ESTATUS_EXPEDIENTE[0];
  const comentarios = expediente.comentarios || [];
  const historial   = expediente.historial   || [];

  // ─── Cálculos de avance ───
  const calcPrevios = () => {
    const p = previos.find(p => p.expediente === exp);
    if (!p) return { pct: 0, detalle: "Sin registro", estado: "pendiente" };
    const certs = ["catastro", "mejoras", "predial", "agua", "zonificacion"];
    const completas = certs.filter(c => p[`${c}Ingreso`] && p[`${c}Entrega`]).length;
    const conDoc    = certs.filter(c => p[`${c}PdfNombre`]).length;
    const pct = Math.round((completas / certs.length) * 100);
    const docTxt = conDoc > 0 ? ` · ${conDoc} PDF${conDoc > 1 ? "s" : ""} adjunto${conDoc > 1 ? "s" : ""}` : "";
    return { pct, detalle: `${completas}/5 certificaciones entregadas${docTxt}`, estado: pct === 100 ? "ok" : pct > 0 ? "parcial" : "pendiente" };
  };
  const calcProyectos = () => {
    const p = proyectos.find(p => p.expediente === exp);
    if (!p) return { pct: 0, detalle: "Sin registro en Proyectos", estado: "pendiente" };
    const pasos = [p.dictamina, p.protocolista, p.revisor1, p.subsana1, p.revisor2, p.documentoNombre];
    const completados = pasos.filter(Boolean).length;
    const pct = Math.round((completados / pasos.length) * 100);
    const detalles = [p.revisor1 && `Rev1: ${p.revisor1}`, p.subsana1 && `Sub1: ${p.subsana1}`, p.revisor2 && `Rev2: ${p.revisor2}`, p.documentoNombre && "Documento ✓"].filter(Boolean);
    return { pct, detalle: detalles.length ? detalles.join(" · ") : `Dictamina: ${p.dictamina} · Prot: ${p.protocolista}`, estado: pct === 100 ? "ok" : pct > 0 ? "parcial" : "pendiente" };
  };
  const calcPaseFolio2 = () => {
    const p = pasesFolio2.find(p => p.expediente === exp);
    if (!p) return { pct: 0, detalle: "Sin escritura asignada", estado: "pendiente" };
    return { pct: 100, detalle: `Escritura ${p.escritura} · Vol. ${p.volumen || "—"}`, estado: "ok" };
  };
  const calcPaseFolio1 = () => {
    const p = pasesFolio.find(p => p.expediente === exp);
    if (!p) return { pct: 0, detalle: "Sin registro en Pase a Folio 1", estado: "pendiente" };
    const campos = [p.honorarios, p.traslado, p.drpp, p.totalEscritura, p.formaPago, p.fechaDepositoBanco];
    const completados = campos.filter(c => c && c !== "0" && c !== "").length;
    const pct = Math.round((completados / campos.length) * 100);
    return { pct, detalle: p.totalEscritura ? `Total escritura: $${Number(p.totalEscritura).toLocaleString("es-MX")}` : "En proceso", estado: pct === 100 ? "ok" : pct > 0 ? "parcial" : "pendiente" };
  };
  const calcTraslado = () => {
    const t = traslados.find(t => t.expediente === exp);
    if (!t) return { pct: 0, detalle: "Sin registro en Traslado de Dominio", estado: "pendiente" };
    const mapa = { pendiente: 0, en_proceso: 35, ingresado: 70, completado: 100, devuelto: 20 };
    const label = { pendiente: "Pendiente", en_proceso: "En proceso", ingresado: "Ingresado al RPP", completado: "Completado", devuelto: "Devuelto" };
    const pct = mapa[t.estatus] ?? 0;
    return { pct, detalle: label[t.estatus] || t.estatus, estado: pct === 100 ? "ok" : pct > 0 ? "parcial" : "pendiente" };
  };

  const areas = [
    { id: 1,  icono: "📁", nombre: "Registro de Expedientes",    ...{ pct: 100, detalle: `Apertura: ${expediente.fechaApertura}`, estado: "ok" } },
    { id: 2,  icono: "🔍", nombre: "Previos",                    ...calcPrevios() },
    { id: 3,  icono: "📋", nombre: "Gestoría",                   pct: 0, detalle: "Área en desarrollo", estado: "pendiente" },
    { id: 4,  icono: "📐", nombre: "Proyectos",                  ...calcProyectos() },
    { id: 5,  icono: "✏️", nombre: "Revisores 1",               pct: 0, detalle: "Área en desarrollo", estado: "pendiente" },
    { id: 6,  icono: "✅", nombre: "Revisores 2",               pct: 0, detalle: "Área en desarrollo", estado: "pendiente" },
    { id: 7,  icono: "💰", nombre: "Cotización Escritura",       pct: 0, detalle: "Área en desarrollo", estado: "pendiente" },
    { id: 8,  icono: "📄", nombre: "Pase a Folio 1",             ...calcPaseFolio1() },
    { id: 9,  icono: "📑", nombre: "Pase a Folio 2",             ...calcPaseFolio2() },
    { id: 10, icono: "🖊️", nombre: "Firma de la Escritura",     pct: 0, detalle: "Área en desarrollo", estado: "pendiente" },
    { id: 11, icono: "🔒", nombre: "Cierre de Folio",            pct: 0, detalle: "Área en desarrollo", estado: "pendiente" },
    { id: 12, icono: "🏠", nombre: "Traslado de Dominio",        ...calcTraslado() },
    { id: 13, icono: "📦", nombre: "Cierre de Apéndice Completo",pct: 0, detalle: "Área en desarrollo", estado: "pendiente" },
    { id: 14, icono: "📮", nombre: "Expedición",                 pct: 0, detalle: "Área en desarrollo", estado: "pendiente" },
    { id: 15, icono: "🏛️", nombre: "Registro Público",          pct: 0, detalle: "Área en desarrollo", estado: "pendiente" },
    { id: 16, icono: "🤝", nombre: "Entrega al Cliente",         pct: 0, detalle: "Área en desarrollo", estado: "pendiente" },
    { id: 17, icono: "🔔", nombre: "Avisos",                     pct: 0, detalle: "Área en desarrollo", estado: "pendiente" },
  ];
  const totalPct = Math.round(areas.reduce((s, a) => s + a.pct, 0) / areas.length);
  const colorEstado = (e) => e === "ok" ? "#16a085" : e === "parcial" ? "#e67e22" : "#c8d0e4";
  const bgEstado    = (e) => e === "ok" ? "#eafaf1" : e === "parcial" ? "#fef9ec" : "#f8f9fc";

  const docsSubidos = Object.keys(documentos).length;
  const tabs = [
    { key: "datos",       label: "📋 Datos",        siempre: true },
    { key: "avance",      label: "📊 Avance",        siempre: true },
    { key: "comentarios", label: `💬 Comentarios${comentarios.length > 0 ? ` (${comentarios.length})` : ""}`, siempre: true },
    { key: "documentos",  label: `📎 Documentos${docsSubidos > 0 ? ` (${docsSubidos}/${DOCUMENTOS_EXPEDIENTE.length})` : ""}`, siempre: true },
    { key: "historial",   label: "🕓 Historial",     siempre: canVerHistorial },
  ].filter(t => t.siempre);

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "32px 36px", boxShadow: "0 4px 24px rgba(13,27,75,0.08)" }}>
      {/* CABECERA */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0D1B4B", margin: "0 0 4px", fontFamily: "monospace" }}>{expediente.expediente}</h2>
          <span style={{ background: est.bg, color: est.color, borderRadius: 8, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>{est.label}</span>
        </div>
        <button onClick={onVolver} style={BTNR}>← Volver a la lista</button>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, borderBottom: "1.5px solid #f0f2f8", paddingBottom: 0 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTabActiva(t.key)} style={{
            background: "none", border: "none", borderBottom: tabActiva === t.key ? "2.5px solid #0D1B4B" : "2.5px solid transparent",
            padding: "8px 14px", fontSize: 13, fontWeight: tabActiva === t.key ? 700 : 500,
            color: tabActiva === t.key ? "#0D1B4B" : "#6b7a9d", cursor: "pointer",
            marginBottom: -1.5, transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── TAB DATOS ── */}
      {tabActiva === "datos" && (
        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", rowGap: 14, columnGap: 16, maxWidth: 560 }}>
          <span style={LBL}>Nombre:</span>        <span style={{ color: "#2d3a5e" }}>{expediente.nombre || "—"}</span>
          <span style={LBL}>Abogado:</span>       <span><span style={{ background: "#eef2fb", color: "#3a4f8a", borderRadius: 6, padding: "2px 10px", fontWeight: 600, fontSize: 13 }}>{expediente.abogado}</span></span>
          <span style={LBL}>Operación:</span>     <span style={{ color: "#2d3a5e" }}>{expediente.operacion || "—"}</span>
          <span style={LBL}>Monto UIF:</span>     <span style={{ color: "#2d3a5e" }}>${Number(expediente.montoUIF || 0).toLocaleString("es-MX")}</span>
          <span style={LBL}>Banco:</span>         <span style={{ color: "#2d3a5e" }}>{expediente.banco || "—"}</span>
          <span style={LBL}>Apertura:</span>      <span style={{ color: "#2d3a5e" }}>{expediente.fechaApertura}</span>
          <span style={LBL}>Registrado por:</span><span style={{ color: "#2d3a5e" }}>{expediente.registradoPor}</span>
        </div>
      )}

      {/* ── TAB AVANCE ── */}
      {tabActiva === "avance" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#0D1B4B" }}>Avance general del expediente</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: totalPct === 100 ? "#16a085" : "#0D1B4B" }}>{totalPct}%</span>
          </div>
          <div style={{ background: "#f0f2f8", borderRadius: 99, height: 10, marginBottom: 24, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${totalPct}%`, background: totalPct === 100 ? "#16a085" : totalPct > 50 ? "#2980b9" : "#e67e22", borderRadius: 99, transition: "width 0.5s ease" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {areas.map(a => (
              <div key={a.id} style={{ background: bgEstado(a.estado), border: `1.5px solid ${colorEstado(a.estado)}33`, borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0D1B4B" }}>{a.icono} {a.nombre}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: colorEstado(a.estado) }}>{a.pct}%</span>
                </div>
                <div style={{ background: "#fff", borderRadius: 99, height: 6, marginBottom: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${a.pct}%`, background: colorEstado(a.estado), borderRadius: 99, transition: "width 0.4s ease" }} />
                </div>
                <div style={{ fontSize: 11, color: "#6b7a9d", lineHeight: 1.3 }}>{a.detalle}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── TAB COMENTARIOS ── */}
      {tabActiva === "comentarios" && (
        <div>
          {/* Formulario nuevo comentario */}
          <div style={{ background: "#f8f9fc", border: "1.5px solid #e0e6f0", borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0D1B4B", marginBottom: 10 }}>
              💬 Nuevo comentario — <span style={{ color: "#6b7a9d", fontWeight: 400 }}>{sesion?.nombre}</span>
            </div>
            <textarea
              value={nuevoComentario}
              onChange={e => setNuevoComentario(e.target.value)}
              placeholder="Escribe un comentario sobre este expediente..."
              rows={3}
              style={{ ...IN0, resize: "vertical", marginBottom: 10 }}
              onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) agregarComentario(); }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#9aa3be" }}>Ctrl+Enter para enviar</span>
              <button onClick={agregarComentario} disabled={!nuevoComentario.trim()}
                style={{ ...BTNP, width: "auto", marginTop: 0, padding: "8px 20px", fontSize: 13, opacity: nuevoComentario.trim() ? 1 : 0.5, cursor: nuevoComentario.trim() ? "pointer" : "not-allowed" }}>
                Agregar comentario
              </button>
            </div>
          </div>

          {/* Lista de comentarios */}
          {comentarios.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#9aa3be", fontSize: 14 }}>
              Aún no hay comentarios en este expediente.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[...comentarios].reverse().map(c => (
                <div key={c.id} style={{ background: "#fff", border: "1.5px solid #e8ecf4", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ background: "#0D1B4B", color: "#fff", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                        {c.usuario.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0D1B4B" }}>{c.usuario}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "#9aa3be" }}>{c.fecha} — {c.hora}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: "#2d3a5e", lineHeight: 1.5 }}>{c.texto}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB DOCUMENTOS ── */}
      {tabActiva === "documentos" && (
        <div>
          {/* Barra de progreso de documentos */}
          <div style={{ background: "#f8f9fc", border: "1.5px solid #e0e6f0", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0D1B4B" }}>Documentos del expediente</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: docsSubidos === DOCUMENTOS_EXPEDIENTE.length ? "#16a085" : "#0D1B4B" }}>
                  {docsSubidos} / {DOCUMENTOS_EXPEDIENTE.length}
                </span>
              </div>
              <div style={{ background: "#e8ecf4", borderRadius: 99, height: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.round(docsSubidos / DOCUMENTOS_EXPEDIENTE.length * 100)}%`, background: docsSubidos === DOCUMENTOS_EXPEDIENTE.length ? "#16a085" : "#0D1B4B", borderRadius: 99, transition: "width 0.4s ease" }} />
              </div>
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: docsSubidos === DOCUMENTOS_EXPEDIENTE.length ? "#16a085" : "#0D1B4B" }}>
              {Math.round(docsSubidos / DOCUMENTOS_EXPEDIENTE.length * 100)}%
            </span>
          </div>

          {/* Lista de documentos */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DOCUMENTOS_EXPEDIENTE.map((nombreDoc) => {
              const doc = documentos[nombreDoc];
              const icono = doc?.tipo === "pdf" ? "📄" : doc ? "📝" : "📋";
              const colorBorde = doc ? "#b8e8cf" : "#e0e6f0";
              const colorFondo = doc ? "#f0fff4" : "#f8f9fc";
              return (
                <div key={nombreDoc} style={{ background: colorFondo, border: `1.5px solid ${colorBorde}`, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{icono}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0D1B4B", marginBottom: doc ? 3 : 0 }}>{nombreDoc}</div>
                    {doc && (
                      <div style={{ fontSize: 11, color: "#6b7a9d" }}>
                        {doc.nombre} · Subido el {doc.fecha} a las {doc.hora} por {doc.subidoPor}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                    {doc ? (
                      <>
                        <a href={doc.data} download={doc.nombre} target="_blank" rel="noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#fff", border: "1.5px solid #27ae60", borderRadius: 8, padding: "5px 12px", color: "#1a7a3d", fontWeight: 600, fontSize: 12, textDecoration: "none" }}>
                          ⬇ Descargar
                        </a>
                        <button onClick={() => docRefs.current[nombreDoc]?.click()}
                          style={{ background: "none", border: "1px solid #dde2ef", borderRadius: 8, padding: "5px 10px", color: "#9aa3be", fontSize: 11, cursor: "pointer" }}>
                          Reemplazar
                        </button>
                      </>
                    ) : (
                      <button onClick={() => docRefs.current[nombreDoc]?.click()}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: "1.5px dashed #0D1B4B", borderRadius: 8, padding: "6px 14px", color: "#0D1B4B", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                        ⬆ Subir
                      </button>
                    )}
                    <input
                      ref={el => docRefs.current[nombreDoc] = el}
                      type="file" accept=".pdf,.doc,.docx"
                      onChange={e => { const f = e.target.files[0]; if (f) subirDocumento(nombreDoc, f); }}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB HISTORIAL (solo admins / autorizados) ── */}
      {tabActiva === "historial" && canVerHistorial && (
        <div>
          <div style={{ fontSize: 13, color: "#6b7a9d", marginBottom: 16 }}>
            Registro cronológico de todas las modificaciones realizadas a este expediente.
          </div>
          {historial.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#9aa3be", fontSize: 14 }}>
              Sin modificaciones registradas.
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              {/* Línea de tiempo */}
              <div style={{ position: "absolute", left: 15, top: 0, bottom: 0, width: 2, background: "#e8ecf4" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[...historial].reverse().map((h, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 16, paddingLeft: 0, paddingBottom: 18, position: "relative" }}>
                    <div style={{ flexShrink: 0, width: 30, height: 30, background: "#fff", border: "2px solid #0D1B4B", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, zIndex: 1, marginTop: 2 }}>
                      🕓
                    </div>
                    <div style={{ background: "#f8f9fc", border: "1.5px solid #e8ecf4", borderRadius: 12, padding: "12px 16px", flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#0D1B4B" }}>{h.campo}</span>
                        <span style={{ fontSize: 11, color: "#9aa3be" }}>{h.fecha} — {h.hora}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, flexWrap: "wrap" }}>
                        <span style={{ background: "#fff0f0", color: "#c0392b", borderRadius: 6, padding: "2px 8px", textDecoration: "line-through" }}>{h.valorAnterior}</span>
                        <span style={{ color: "#9aa3be" }}>→</span>
                        <span style={{ background: "#eafaf1", color: "#16a085", borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>{h.valorNuevo}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#9aa3be", marginTop: 6 }}>por {h.usuario}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PASE A FOLIO (Áreas 8 y 9) ───────────────────────────────────────────────
