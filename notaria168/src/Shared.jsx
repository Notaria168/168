import React, { useState, useRef, useEffect } from "react";
import { AREAS, AREAS_CON_AGENDA, AREA_EDITA_AGENDA, ESTATUSES, DICTAMINADORES_ROTACION, ABOGADOS, BANCOS_MEXICO, BIMESTRES, DOCUMENTOS_EXPEDIENTE, OPERACIONES_NOTARIALES, PROTOCOLISTAS, REVISORES, TIPOS_PROYECTO } from "./constants";
import { IN, BTNP, BTNR, TD, LBL, IN0, BTNAC } from "./AreasB";
// ─── AVISOS (Área 17 — Pendientes del usuario) ───────────────────────────────
export function Avisos({ sesion, expedientes, previos, proyectos, pasesFolio, pasesFolio2, traslados, onBack, onLogout, logoUrl, hs, searchProps }) {
  const calcularPendientes = () => {
    const perms = sesion?.permisos || [];
    const pendientes = [];
    if (perms.includes(1)) {
      expedientes.forEach(e => {
        if (!previos.find(p => p.expediente === e.expediente))
          pendientes.push({ tipo: "Expediente sin previos", expediente: e.expediente, descripcion: `${e.nombreCliente || "Sin nombre"} · ${e.operacion || ""}`, urgencia: "media", area: 1 });
      });
    }
    if (perms.includes(2)) {
      previos.forEach(p => {
        const certs = ["catastro","mejoras","predial","agua","zonificacion"];
        const pend = certs.filter(c => { const v = p[`${c}Entrega`]||""; return !v || v.toUpperCase()==="PENDIENTE"; }).length;
        if (pend >= 3) pendientes.push({ tipo: "Previos incompletos (urgente)", expediente: p.expediente, descripcion: `Sin entrega: ${pend} certificaciones`, urgencia: "alta", area: 2 });
        else if (pend > 0) pendientes.push({ tipo: "Previos incompletos", expediente: p.expediente, descripcion: `Sin entrega: ${pend} certificación(es)`, urgencia: "media", area: 2 });
      });
    }
    if (perms.includes(4)) {
      proyectos.forEach(p => {
        if (!p.revisor1) pendientes.push({ tipo: "Proyecto sin Revisor 1°", expediente: p.expediente, descripcion: `Dictamina: ${p.dictamina} · Prot: ${p.protocolista}`, urgencia: "alta", area: 4 });
        else if (!p.revisor2) pendientes.push({ tipo: "Proyecto sin Revisor 2°", expediente: p.expediente, descripcion: `Rev1: ${p.revisor1}`, urgencia: "media", area: 4 });
        if (p.revisor2 && !p.documentoNombre) pendientes.push({ tipo: "Proyecto sin documento Word", expediente: p.expediente, descripcion: `Rev2: ${p.revisor2} · Falta .docx`, urgencia: "alta", area: 4 });
      });
    }
    if (perms.includes(8)) {
      pasesFolio.forEach(p => {
        if (!p.fechaDepositoBanco) pendientes.push({ tipo: "Sin fecha de depósito", expediente: p.expediente, descripcion: `Escritura ${p.escritura||"s/n"}`, urgencia: "alta", area: 8 });
        else if (!p.totalEscritura || p.totalEscritura==="0") pendientes.push({ tipo: "Pase Folio 1 sin total", expediente: p.expediente, descripcion: `Escritura ${p.escritura||"s/n"}`, urgencia: "media", area: 8 });
      });
    }
    if (perms.includes(9)) {
      pasesFolio2.forEach(p => { if (!p.escritura) pendientes.push({ tipo: "Pase Folio 2 sin escritura", expediente: p.expediente, descripcion: `Folio ${p.folio||"—"}`, urgencia: "alta", area: 9 }); });
    }
    if (perms.includes(12)) {
      traslados.filter(t => t.estatus==="pendiente"||t.estatus==="en_proceso"||t.estatus==="devuelto").forEach(t =>
        pendientes.push({ tipo: t.estatus==="devuelto"?"Traslado devuelto":t.estatus==="pendiente"?"Traslado pendiente":"Traslado en proceso", expediente: t.expediente, descripcion: `Escritura ${t.escritura} · ${t.municipio} · ${t.abogado}`, urgencia: t.estatus==="en_proceso"?"media":"alta", area: 12 })
      );
    }
    return pendientes;
  };
  const pendientes = calcularPendientes();
  const altas = pendientes.filter(p => p.urgencia==="alta");
  const medias = pendientes.filter(p => p.urgencia==="media");
  const colorU = (u) => u==="alta" ? { bg:"#fff0f0", borde:"#e74c3c", color:"#c0392b" } : { bg:"#fef9ec", borde:"#f0d98c", color:"#8a6d1a" };
  const areaNombre = (id) => AREAS.find(a => a.id===id)?.nombre || `Área ${id}`;
  const areaIcono  = (id) => AREAS.find(a => a.id===id)?.icono || "📌";
  return (
    <div style={hs.wrap}>
      <header style={hs.header}>
        <img src={logoUrl} alt="Notaría 168" style={hs.logoImg} onError={e => e.target.style.display="none"} />
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <span style={hs.areaBadge}>{sesion.nombre} — {sesion.area}</span>
          <button style={hs.logoutBtn} onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>
      {searchProps?.menuProps && <MenuLateral {...searchProps.menuProps} />}
      {searchProps && <BuscadorGlobal {...searchProps} />}
      <div style={hs.content}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:24 }}>
          <button onClick={onBack} style={BTNR}>← Menú principal</button>
          <span style={{ color:"#9aa3be" }}>/</span>
          <span style={{ fontSize:14, fontWeight:600, color:"#0D1B4B" }}>🔔 Avisos — Mis pendientes</span>
        </div>
        <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
          {[{n:altas.length,label:"Urgencia alta",c:"#c0392b",bg:"#fff0f0",borde:"#e74c3c"},{n:medias.length,label:"Urgencia media",c:"#8a6d1a",bg:"#fef9ec",borde:"#f0d98c"},{n:pendientes.length,label:"Total pendientes",c:"#0D1B4B",bg:"#f4f6fb",borde:"#dde2ef"}].map(({n,label,c,bg,borde})=>(
            <div key={label} style={{ background:bg, border:`1.5px solid ${borde}`, borderRadius:12, padding:"14px 22px", minWidth:120, textAlign:"center" }}>
              <div style={{ fontSize:32, fontWeight:800, color:c }}>{n}</div>
              <div style={{ fontSize:12, fontWeight:600, color:c, marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>
        {pendientes.length===0 ? (
          <div style={{ background:"#eafaf1", border:"1.5px solid #b8e8cf", borderRadius:16, padding:"40px 20px", textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
            <div style={{ fontSize:18, fontWeight:700, color:"#16a085", marginBottom:6 }}>¡Sin pendientes!</div>
            <div style={{ fontSize:14, color:"#5fae8c" }}>Todas tus áreas están al día.</div>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[...altas,...medias].map((p,idx)=>{
              const col=colorU(p.urgencia);
              return (
                <div key={idx} style={{ background:col.bg, border:`1.5px solid ${col.borde}`, borderRadius:14, padding:"14px 18px", display:"flex", alignItems:"flex-start", gap:14 }}>
                  <div style={{ fontSize:24, flexShrink:0 }}>{areaIcono(p.area)}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:8, alignItems:"center", marginBottom:4 }}>
                      <span style={{ fontWeight:700, color:col.color, fontSize:14 }}>{p.tipo}</span>
                      <span style={{ fontFamily:"monospace", fontWeight:700, background:"#fff", border:`1px solid ${col.borde}`, color:col.color, borderRadius:6, padding:"1px 8px", fontSize:12 }}>{p.expediente}</span>
                      <span style={{ fontSize:11, background:"#fff", border:"1px solid #e0e6f0", borderRadius:6, padding:"1px 8px", color:"#6b7a9d" }}>{areaIcono(p.area)} {areaNombre(p.area)}</span>
                    </div>
                    <div style={{ fontSize:13, color:"#2d3a5e" }}>{p.descripcion}</div>
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, background:col.borde, color:"#fff", borderRadius:6, padding:"3px 8px", whiteSpace:"nowrap", flexShrink:0 }}>{p.urgencia.toUpperCase()}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── VISTA DE CONSULTA (solo lectura) ────────────────────────────────────────
export function VistaConsulta({ area, sesion, datos, onBack, onLogout, logoUrl, hs, menuProps, searchProps }) {
  const [q, setQ] = useState("");
  const [resultados, setResultados] = useState([]);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    if (q.trim().length < 2) { setResultados([]); return; }
    const term = q.trim().toLowerCase();
    const res = [];
    const { expedientes=[], pasesFolio=[], pasesFolio2=[], traslados=[], previos=[], proyectos=[] } = datos;
    expedientes.filter(e => [e.expediente,e.nombre,e.abogado,e.operacion,e.banco,e.fechaApertura].some(v => v?.toLowerCase().includes(term))).forEach(e => res.push({ tipo:"Expediente",icono:"📁",areaId:1, titulo:e.expediente, subtitulo:e.nombre||"Sin nombre", chips:[e.abogado,e.operacion,e.banco,e.fechaApertura].filter(Boolean) }));
    previos.filter(p => [p.expediente,p.nombreCliente,p.abogado,p.municipio,p.operacion].some(v => v?.toLowerCase().includes(term))).forEach(p => res.push({ tipo:"Previos",icono:"🔍",areaId:2, titulo:p.expediente, subtitulo:p.nombreCliente||"Sin nombre", chips:[p.abogado,p.operacion,p.municipio].filter(Boolean) }));
    proyectos.filter(p => [p.expediente,p.dictamina,p.protocolista,p.revisor1].some(v => v?.toLowerCase().includes(term))).forEach(p => res.push({ tipo:"Proyectos",icono:"📐",areaId:4, titulo:p.expediente, subtitulo:`${p.dictamina} · ${p.protocolista}`, chips:[p.revisor1&&`Rev1: ${p.revisor1}`,p.escritura&&`Esc: ${p.escritura}`].filter(Boolean) }));
    pasesFolio.filter(p => [p.expediente,p.escritura,p.abogado,p.nombreCliente,p.banco].some(v => v?.toLowerCase().includes(term))).forEach(p => res.push({ tipo:"Pase a Folio 1",icono:"📄",areaId:8, titulo:p.expediente, subtitulo:p.nombreCliente||"Sin nombre", chips:[p.abogado,`Escritura: ${p.escritura||"s/n"}`,p.fechaPase].filter(Boolean) }));
    pasesFolio2.filter(p => [p.expediente,p.escritura,p.abogado,p.municipio].some(v => v?.toLowerCase().includes(term))).forEach(p => res.push({ tipo:"Pase a Folio 2",icono:"📑",areaId:9, titulo:p.expediente, subtitulo:`Escritura ${p.escritura}`, chips:[p.abogado,p.banco,p.municipio].filter(Boolean) }));
    traslados.filter(t => [t.expediente,t.escritura?.toString(),t.abogado,t.municipio,t.estatus].some(v => v?.toLowerCase().includes(term))).forEach(t => res.push({ tipo:"Traslado de Dominio",icono:"🏠",areaId:12, titulo:t.expediente, subtitulo:`Escritura ${t.escritura} · ${t.municipio}`, chips:[t.abogado,t.estatus,t.fechaIngreso].filter(Boolean) }));
    setResultados(res.slice(0,50));
  }, [q, datos]);
  const grupos = resultados.reduce((acc,r) => { if (!acc[r.tipo]) acc[r.tipo]=[]; acc[r.tipo].push(r); return acc; }, {});
  const areaNombre = (id) => AREAS.find(a => a.id===id)?.nombre||`Área ${id}`;
  return (
    <div style={hs.wrap}>
      <header style={hs.header}>
        <img src={logoUrl} alt="Notaría 168" style={hs.logoImg} onError={e => e.target.style.display="none"} />
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <span style={hs.areaBadge}>{sesion.nombre} — {sesion.area}</span>
          <button style={hs.logoutBtn} onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>
      {menuProps && <MenuLateral {...menuProps} />}
      {searchProps && <BuscadorGlobal {...searchProps} />}
      <div style={hs.content}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:28 }}>
          <button onClick={onBack} style={BTNR}>← Menú principal</button>
          <span style={{ color:"#9aa3be" }}>/</span>
          <span style={{ fontSize:14, fontWeight:600, color:"#0D1B4B" }}>{area?.icono} {area?.nombre}</span>
        </div>
        <div style={{ background:"#fff", borderRadius:20, padding:"32px 36px", boxShadow:"0 4px 24px rgba(13,27,75,0.08)", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
            <div style={{ fontSize:44 }}>{area?.icono}</div>
            <div>
              <h2 style={{ fontSize:20, fontWeight:700, color:"#0D1B4B", margin:"0 0 4px" }}>{area?.nombre}</h2>
              <span style={{ fontSize:12, background:"#f4f6fb", color:"#9aa3be", borderRadius:6, padding:"2px 10px" }}>👁 Solo lectura</span>
            </div>
          </div>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:18, color:"#9aa3be", pointerEvents:"none" }}>🔍</span>
            <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por expediente, escritura, nombre, abogado, banco, municipio, fecha..."
              style={{ width:"100%", padding:"14px 16px 14px 48px", borderRadius:14, border:"2px solid #0D1B4B", fontSize:15, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
            {q && <button onClick={() => setQ("")} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9aa3be", fontSize:18 }}>✕</button>}
          </div>
          {q.length>0 && q.length<2 && <p style={{ fontSize:12, color:"#9aa3be", marginTop:8 }}>Escribe al menos 2 caracteres.</p>}
        </div>
        {q.length>=2 && (resultados.length===0 ? (
          <div style={{ background:"#fff", borderRadius:16, padding:"48px 20px", textAlign:"center", boxShadow:"0 2px 12px rgba(13,27,75,0.06)" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🔎</div>
            <div style={{ fontSize:16, fontWeight:600, color:"#0D1B4B" }}>Sin resultados para "{q}"</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize:13, color:"#6b7a9d", marginBottom:12 }}><strong>{resultados.length}</strong> resultado(s) para <strong>"{q}"</strong></div>
            {Object.entries(grupos).map(([tipo,items]) => (
              <div key={tipo} style={{ marginBottom:20 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#6b7a9d", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>{items[0].icono} {tipo} — {items.length}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {items.map((r,idx) => (
                    <div key={idx} style={{ background:"#fff", border:"1.5px solid #e8ecf4", borderRadius:12, padding:"14px 18px", display:"flex", alignItems:"flex-start", gap:14 }}>
                      <span style={{ fontSize:22, flexShrink:0 }}>{r.icono}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:4, flexWrap:"wrap" }}>
                          <span style={{ fontFamily:"monospace", fontWeight:700, color:"#0D1B4B", fontSize:15 }}>{r.titulo}</span>
                          <span style={{ fontSize:13, color:"#2d3a5e" }}>{r.subtitulo}</span>
                        </div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                          {r.chips.map((chip,ci) => <span key={ci} style={{ fontSize:11, background:"#eef2fb", color:"#3a4f8a", borderRadius:6, padding:"2px 8px" }}>{chip}</span>)}
                        </div>
                      </div>
                      <span style={{ fontSize:11, color:"#9aa3be", background:"#f4f6fb", borderRadius:6, padding:"2px 8px", whiteSpace:"nowrap" }}>{areaNombre(r.areaId)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
        {q.length<2 && (
          <div style={{ background:"#fff", borderRadius:16, padding:"40px 20px", textAlign:"center", boxShadow:"0 2px 12px rgba(13,27,75,0.06)", color:"#9aa3be" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
            <div style={{ fontSize:15, fontWeight:600, color:"#6b7a9d" }}>Buscador de consulta</div>
            <div style={{ fontSize:13, marginTop:6 }}>Consulta expedientes, escrituras, abogados, clientes, bancos y más.</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MENÚ LATERAL (Hamburguesa) ──────────────────────────────────────────────
export function MenuLateral({ areaActual, onNavegar, onMenu, onMiArea, sesion }) {
  const [abierto, setAbierto] = useState(false);
  const toggle = () => setAbierto(a => !a);
  const ir = (area) => { setAbierto(false); onNavegar(area); };
  return (
    <>
      <button onClick={toggle} title="Menú de áreas" style={{ position:"fixed", top:14, left:14, zIndex:300, background:abierto?"#fff":"#0D1B4B", border:abierto?"1.5px solid #dde2ef":"none", borderRadius:10, width:40, height:40, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5, boxShadow:"0 2px 10px rgba(0,0,0,0.18)", transition:"all 0.2s" }}>
        {abierto ? <span style={{ fontSize:18, color:"#0D1B4B", lineHeight:1 }}>✕</span> : <>
          <span style={{ display:"block", width:18, height:2, background:"#fff", borderRadius:2 }} />
          <span style={{ display:"block", width:18, height:2, background:"#fff", borderRadius:2 }} />
          <span style={{ display:"block", width:18, height:2, background:"#fff", borderRadius:2 }} />
        </>}
      </button>
      {abierto && <div onClick={() => setAbierto(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:200 }} />}
      <div style={{ position:"fixed", top:0, left:0, bottom:0, zIndex:250, width:280, background:"#0D1B4B", transform:abierto?"translateX(0)":"translateX(-100%)", transition:"transform 0.25s cubic-bezier(0.4,0,0.2,1)", display:"flex", flexDirection:"column", boxShadow:abierto?"4px 0 24px rgba(0,0,0,0.25)":"none", overflowY:"auto" }}>
        <div style={{ padding:"20px 20px 14px", borderBottom:"1px solid rgba(255,255,255,0.10)" }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Sistema Notarial 168</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)", fontWeight:500 }}>{sesion?.nombre}</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{sesion?.area}</div>
        </div>
        <button onClick={() => { setAbierto(false); onMenu(); }} style={{ margin:"12px 14px 4px", background:"rgba(255,255,255,0.10)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"9px 14px", color:"#fff", fontSize:13, cursor:"pointer", textAlign:"left", fontWeight:500, display:"flex", alignItems:"center", gap:8 }}>🏠 Menú principal</button>
        <div style={{ padding:"8px 0 20px" }}>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontWeight:700, textTransform:"uppercase", letterSpacing:1, padding:"8px 20px 4px" }}>Áreas del sistema</div>
          <button onClick={() => { setAbierto(false); onMiArea&&onMiArea(); }} style={{ width:"100%", background:!areaActual?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.05)", border:"none", borderLeft:!areaActual?"3px solid #fff":"3px solid rgba(255,255,255,0.20)", padding:"10px 16px 10px 17px", cursor:"pointer", display:"flex", alignItems:"center", gap:10, textAlign:"left", marginBottom:4 }} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.12)"} onMouseLeave={e=>e.currentTarget.style.background=!areaActual?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.05)"}>
            <span style={{ fontSize:14, width:20, textAlign:"center" }}>👤</span>
            <span style={{ flex:1, fontSize:12.5, color:"#fff", fontWeight:!areaActual?700:500 }}>Mi área</span>
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.45)", background:"rgba(255,255,255,0.10)", borderRadius:4, padding:"1px 6px" }}>Solo edición</span>
          </button>
          <div style={{ height:1, background:"rgba(255,255,255,0.08)", margin:"4px 14px 8px" }} />
          {AREAS.map(area => {
            const esActual = areaActual?.id===area.id;
            const tienePerm = sesion?.rol==="admin" || (sesion?.permisos||[]).includes(area.id);
            return (
              <button key={area.id} onClick={() => ir(area)} style={{ width:"100%", background:esActual?"rgba(255,255,255,0.15)":"none", border:"none", borderLeft:esActual?"3px solid #fff":"3px solid transparent", padding:"9px 16px 9px 17px", cursor:"pointer", display:"flex", alignItems:"center", gap:10, textAlign:"left", transition:"background 0.15s" }} onMouseEnter={e=>{if(!esActual)e.currentTarget.style.background="rgba(255,255,255,0.07)"}} onMouseLeave={e=>{if(!esActual)e.currentTarget.style.background="none"}}>
                <span style={{ fontSize:14, width:20, textAlign:"center" }}>{area.icono}</span>
                <span style={{ flex:1, fontSize:12.5, color:esActual?"#fff":"rgba(255,255,255,0.72)", fontWeight:esActual?700:400, lineHeight:1.3 }}>{area.nombre}</span>
                <span style={{ fontSize:10, color:tienePerm?"rgba(255,255,255,0.35)":"rgba(255,255,255,0.18)", background:tienePerm?"rgba(255,255,255,0.10)":"none", borderRadius:4, padding:"1px 5px" }}>{tienePerm?"✏":"👁"}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── BUSCADOR GLOBAL ──────────────────────────────────────────────────────────
export function BuscadorGlobal({ datos, busqueda, setBusqueda, mostrar, setMostrar, onNavegar }) {
  const { expedientes=[], pasesFolio=[], pasesFolio2=[], traslados=[], previos=[], proyectos=[] } = datos;
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setMostrar(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setMostrar]);
  const q = busqueda.trim().toLowerCase();
  const resultados = q.length < 2 ? [] : (() => {
    const res = [];
    expedientes.filter(e => [e.expediente,e.nombre,e.abogado,e.operacion,e.banco,e.fechaApertura].some(v=>v?.toLowerCase().includes(q))).forEach(e => res.push({ tipo:"Expediente",areaId:1,icono:"📁", titulo:`${e.expediente} — ${e.nombre||"Sin nombre"}`, detalle:[e.abogado,e.operacion,e.fechaApertura].filter(Boolean).join(" · ") }));
    pasesFolio.filter(p => [p.expediente,p.escritura,p.abogado,p.nombreCliente,p.banco,p.municipio,p.fechaPase].some(v=>v?.toLowerCase().includes(q))).forEach(p => res.push({ tipo:"Pase a Folio 1",areaId:8,icono:"📄", titulo:`Exp. ${p.expediente} — Esc. ${p.escritura||"s/n"}`, detalle:[p.nombreCliente,p.abogado,p.fechaPase].filter(Boolean).join(" · ") }));
    pasesFolio2.filter(p => [p.expediente,p.escritura,p.abogado,p.banco,p.municipio].some(v=>v?.toLowerCase().includes(q))).forEach(p => res.push({ tipo:"Pase a Folio 2",areaId:9,icono:"📑", titulo:`Escritura ${p.escritura} — Exp. ${p.expediente}`, detalle:[p.abogado,p.banco,p.municipio].filter(Boolean).join(" · ") }));
    traslados.filter(t => [t.expediente,t.escritura?.toString(),t.abogado,t.municipio,t.estatus].some(v=>v?.toLowerCase().includes(q))).forEach(t => res.push({ tipo:"Traslado de Dominio",areaId:12,icono:"🏠", titulo:`Escritura ${t.escritura} — Exp. ${t.expediente}`, detalle:[t.abogado,t.municipio,t.estatus].filter(Boolean).join(" · ") }));
    previos.filter(p => [p.expediente,p.nombreCliente,p.abogado,p.operacion,p.municipio].some(v=>v?.toLowerCase().includes(q))).forEach(p => res.push({ tipo:"Previos",areaId:2,icono:"🔍", titulo:`Exp. ${p.expediente} — ${p.nombreCliente||"Sin nombre"}`, detalle:[p.abogado,p.operacion,p.municipio].filter(Boolean).join(" · ") }));
    proyectos.filter(p => [p.expediente,p.operacion,p.dictamina,p.protocolista,p.revisor1].some(v=>v?.toLowerCase().includes(q))).forEach(p => res.push({ tipo:"Proyectos",areaId:4,icono:"📐", titulo:`Exp. ${p.expediente} · ${p.dictamina} · ${p.protocolista}`, detalle:[p.operacion,p.revisor1&&`Rev1: ${p.revisor1}`].filter(Boolean).join(" · ") }));
    return res.slice(0,40);
  })();
  const grupos = {};
  resultados.forEach(r => { if (!grupos[r.tipo]) grupos[r.tipo]=[]; grupos[r.tipo].push(r); });
  return (
    <div ref={ref} style={{ background:"#0a1640", borderBottom:"1px solid rgba(255,255,255,0.08)", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 12px rgba(0,0,0,0.25)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"10px 24px", display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ color:"rgba(255,255,255,0.5)", fontSize:18 }}>🔍</span>
        <input placeholder="Buscar por expediente, escritura, abogado, cliente, fecha, banco, municipio..." value={busqueda} onChange={e => { setBusqueda(e.target.value); setMostrar(true); }} onFocus={() => setMostrar(true)}
          style={{ flex:1, background:"rgba(255,255,255,0.1)", border:"1.5px solid rgba(255,255,255,0.2)", borderRadius:10, padding:"9px 16px", color:"#fff", fontSize:14, outline:"none", fontFamily:"inherit" }} />
        {busqueda && <button onClick={() => { setBusqueda(""); setMostrar(false); }} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:18 }}>✕</button>}
        {busqueda.length>=2 && <span style={{ color:"rgba(255,255,255,0.4)", fontSize:12, whiteSpace:"nowrap" }}>{resultados.length} resultado(s)</span>}
      </div>
      {mostrar && busqueda.length>=2 && (
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px 16px", maxHeight:"70vh", overflowY:"auto" }}>
          {resultados.length===0 ? (
            <div style={{ textAlign:"center", padding:"24px 0", color:"rgba(255,255,255,0.4)", fontSize:14 }}>Sin resultados para "{busqueda}"</div>
          ) : Object.entries(grupos).map(([tipo,items]) => (
            <div key={tipo} style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>{items[0].icono} {tipo} — {items.length}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {items.map((r,idx) => (
                  <button key={idx} onClick={() => onNavegar(r.areaId)} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"10px 16px", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:14 }} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.14)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.07)"}>
                    <span style={{ fontSize:20 }}>{r.icono}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ color:"#fff", fontWeight:600, fontSize:14, marginBottom:2 }}>{r.titulo}</div>
                      <div style={{ color:"rgba(255,255,255,0.5)", fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.detalle}</div>
                    </div>
                    <span style={{ color:"rgba(255,255,255,0.25)", fontSize:12 }}>Ir →</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MENÚ PRINCIPAL ────────────────────────────────────────────────────────────
export function MenuPrincipal({ sesion, puedeEditar, onAreaClick, datos, vistaInicial }) {
  const [vistaMenu, setVistaMenu] = useState(vistaInicial||"todas");
  const AVISOS_ID = 17;
  const prevVistaRef = useRef(vistaInicial);
  useEffect(() => {
    if (vistaInicial && vistaInicial !== prevVistaRef.current) { setVistaMenu(vistaInicial); prevVistaRef.current = vistaInicial; }
  }, [vistaInicial]);
  const misAreas = AREAS.filter(a => puedeEditar(a.id) || a.id===AVISOS_ID);
  const areasVisibles = vistaMenu==="mis" ? misAreas : AREAS;
  const calcSemaforo = () => {
    const { expedientes=[],previos=[],proyectos=[],pasesFolio=[],pasesFolio2=[],traslados=[] } = datos||{};
    const perms = sesion?.permisos||[];
    let alta=0,media=0,info=0;
    if (perms.includes(1)) expedientes.forEach(e => { if (!previos.find(p=>p.expediente===e.expediente)) media++; });
    if (perms.includes(2)) previos.forEach(p => { const pend=["catastro","mejoras","predial","agua","zonificacion"].filter(c=>{const v=p[`${c}Entrega`]||"";return !v||v.toUpperCase()==="PENDIENTE";}).length; if(pend>=3)alta++;else if(pend>0)media++; });
    if (perms.includes(4)) proyectos.forEach(p => { if(!p.revisor1)alta++;else if(!p.revisor2)media++;if(p.revisor2&&!p.documentoNombre)alta++; });
    if (perms.includes(8)) pasesFolio.forEach(p => { if(!p.fechaDepositoBanco)alta++;else if(!p.totalEscritura||p.totalEscritura==="0")media++; });
    if (perms.includes(9)) pasesFolio2.forEach(p => { if(!p.escritura)alta++; });
    if (perms.includes(12)) traslados.forEach(t => { if(t.estatus==="pendiente"||t.estatus==="devuelto")alta++;else if(t.estatus==="en_proceso")media++; });
    const hace3 = new Date(Date.now()-3*24*60*60*1000).toISOString().slice(0,10);
    info = expedientes.filter(e=>e.fechaApertura>=hace3).length;
    return {alta,media,info};
  };
  const sem = calcSemaforo();
  const TarjetaArea = ({ area }) => {
    const ed = puedeEditar(area.id);
    const esAv = area.id===AVISOS_ID;
    const total = sem.alta+sem.media;
    return (
      <button onClick={() => onAreaClick(area)} style={{ background:"#fff", border:`1.5px solid ${ed?"#0D1B4B":esAv?"#e67e22":"#dde2ef"}`, borderRadius:16, padding:"22px 14px 18px", cursor:"pointer", textAlign:"center", position:"relative", overflow:"hidden", transition:"all 0.18s", boxShadow:ed?"0 2px 12px rgba(13,27,75,0.10)":esAv?"0 4px 16px rgba(230,126,34,0.20)":"none", opacity:vistaMenu==="todas"&&!ed&&!esAv?0.65:1 }} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(13,27,75,0.16)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=ed?"0 2px 12px rgba(13,27,75,0.10)":esAv?"0 4px 16px rgba(230,126,34,0.20)":"none";}}>
        <div style={{ position:"absolute", right:8, top:2, fontSize:52, opacity:0.05, fontWeight:900, color:"#0D1B4B", lineHeight:1, userSelect:"none" }}>{String(area.id).padStart(2,"0")}</div>
        <div style={{ fontSize:34, marginBottom:esAv?6:8 }}>{area.icono}</div>
        <div style={{ fontSize:12, fontWeight:600, color:"#0D1B4B", lineHeight:1.3, marginBottom:8 }}>{area.nombre}</div>
        {esAv ? (
          <div style={{ marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"center", gap:10, marginBottom:8 }}>
              {[{n:sem.alta,c:"#e74c3c",pc:"#c0392b",label:"Alta"},{n:sem.media,c:"#f39c12",pc:"#d68910",label:"Media"},{n:sem.info,c:"#27ae60",pc:"#1e8449",label:"Nuevos"}].map(({n,c,pc,label})=>(
                <div key={label} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:n>0?c:`${c}44`, border:`2px solid ${n>0?pc:`${c}66`}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:n>9?11:13, color:"#fff", boxShadow:n>0?`0 0 8px ${c}99`:"none" }}>{n}</div>
                  <span style={{ fontSize:9, color:pc, fontWeight:600, textTransform:"uppercase", letterSpacing:0.3 }}>{label}</span>
                </div>
              ))}
            </div>
            {total>0 ? <span style={{ fontSize:10, background:"#e74c3c", color:"#fff", borderRadius:20, padding:"2px 10px", fontWeight:700 }}>{total} pendiente(s)</span> : <span style={{ fontSize:10, background:"#eafaf1", color:"#16a085", borderRadius:20, padding:"2px 10px", fontWeight:600, border:"1px solid #b8e8cf" }}>✓ Al día</span>}
          </div>
        ) : (
          <span style={{ fontSize:11, background:ed?"#eaf3fb":"#f4f6fb", color:ed?"#1a5fa3":"#9aa3be", borderRadius:6, padding:"2px 8px", fontWeight:500 }}>{ed?"✏ Edición":"👁 Lectura"}</span>
        )}
      </button>
    );
  };
  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"28px 20px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:600, color:"#0D1B4B", margin:"0 0 4px" }}>{vistaMenu==="mis"?`Mi área — ${sesion?.nombre}`:"Menú principal — Todas las áreas"}</h2>
          <p style={{ color:"#6b7a9d", fontSize:14, margin:0 }}>{vistaMenu==="mis"?`${misAreas.length} área(s) con permiso de edición + Avisos`:`${AREAS.length} áreas en total`}</p>
        </div>
        <div style={{ display:"flex", background:"#f0f2f8", borderRadius:12, padding:4, gap:4 }}>
          {[{key:"todas",label:"Menú principal",icono:"🏠"},{key:"mis",label:"Mi área",icono:"👤"}].map(({key,label,icono})=>(
            <button key={key} onClick={() => setVistaMenu(key)} style={{ background:vistaMenu===key?"#0D1B4B":"none", color:vistaMenu===key?"#fff":"#6b7a9d", border:"none", borderRadius:9, padding:"8px 18px", cursor:"pointer", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:6, transition:"all 0.15s" }}>{icono} {label}</button>
          ))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(190px, 1fr))", gap:16 }}>
        {areasVisibles.map(area => <TarjetaArea key={area.id} area={area} />)}
      </div>
      {vistaMenu==="todas" && <div style={{ marginTop:16, fontSize:12, color:"#9aa3be", textAlign:"center" }}>Borde azul = edición · Atenuadas = lectura · 🔔 Avisos siempre visible</div>}
    </div>
  );
}

// ─── HEADER COMPARTIDO ────────────────────────────────────────────────────────
export function Header({ sesion, onLogout, onAdmin, logoUrl, hs }) {
  return (
    <header style={hs.header}>
      <img src={logoUrl} alt="Notaría 168" style={hs.logoImg} onError={e => e.target.style.display="none"} />
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <span style={hs.areaBadge}>{sesion.nombre} — {sesion.area}</span>
        {sesion.rol==="admin" && <button style={{ ...hs.logoutBtn, background:"rgba(255,215,0,0.18)", borderColor:"rgba(255,215,0,0.4)" }} onClick={onAdmin}>⚙ Administrador</button>}
        <button style={hs.logoutBtn} onClick={onLogout}>Cerrar sesión</button>
      </div>
    </header>
  );
}



// ─── PROYECTOS (Área 4) ───────────────────────────────────────────────────────