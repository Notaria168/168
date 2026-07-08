import React, { useState, useRef, useEffect } from "react";
import { AREAS, AREAS_CON_AGENDA, AREA_EDITA_AGENDA, LOGO_URL, USUARIOS_INICIALES, TRASLADOS_INICIALES, EXPEDIENTES_INICIALES, PASES_FOLIO_INICIALES, PASES_FOLIO2_INICIALES, PREVIOS_INICIALES, PROYECTOS_INICIALES } from "./constants";
import { Avisos, VistaConsulta, MenuLateral, BuscadorGlobal, MenuPrincipal, Header } from "./Shared";
import { BTNP, BTNR, IN, IN0, LBL, TD, BTNAC } from "./AreasB";
import { Proyectos } from "./Proyectos";
import { Previos, RegistroExpedientes, DetalleExpediente } from "./AreasA";
import { PaseFolio, PaseFolio2, TrasladoDominio, PanelAgenda, AdminPanel } from "./AreasB";
// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [usuarios, setUsuarios]     = useState(USUARIOS_INICIALES);
  const [traslados, setTraslados]   = useState(TRASLADOS_INICIALES);
  const [expedientes, setExpedientes] = useState(EXPEDIENTES_INICIALES);
  const [pasesFolio, setPasesFolio] = useState(PASES_FOLIO_INICIALES);
  const [pasesFolio2, setPasesFolio2] = useState(PASES_FOLIO2_INICIALES);
  const [previos, setPrevios]       = useState(PREVIOS_INICIALES);
  const [proyectos, setProyectos]   = useState(PROYECTOS_INICIALES);
  const [sesion, setSesion]         = useState(null);
  const [pantalla, setPantalla]     = useState("login");
  const [areaActual, setAreaActual] = useState(null);
  const [loginUser, setLoginUser]   = useState("");
  const [loginPass, setLoginPass]   = useState("");
  const [loginError, setLoginError] = useState("");
  const [busquedaGlobal, setBusquedaGlobal] = useState("");
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const [vistaMenuInicial, setVistaMenuInicial] = useState("todas");

  const handleLogin = () => {
    const u = usuarios.find(u => u.usuario === loginUser && u.password === loginPass);
    if (u) { setSesion(u); setPantalla("menu"); setLoginError(""); }
    else setLoginError("Usuario o contraseña incorrectos.");
  };

  const handleLogout = () => {
    setSesion(null); setPantalla("login");
    setLoginUser(""); setLoginPass(""); setAreaActual(null);
  };

  const puedeEditar = (areaId) => sesion?.rol === "admin" || (sesion?.permisos || []).includes(areaId);

  const hs = {
    wrap: { minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f4f6fb", color: "#0D1B4B" },
    header: { background: "#0D1B4B", color: "#fff", padding: "10px 24px 10px 72px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(13,27,75,0.18)" },
    logoImg: { height: 52, objectFit: "contain" },
    areaBadge: { background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "4px 14px", fontSize: 14, fontWeight: 600 },
    logoutBtn: { background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 8, padding: "6px 16px", cursor: "pointer", fontSize: 13, fontWeight: 500 },
    content: { maxWidth: 1200, margin: "0 auto", padding: "28px 20px" },
  };

  const datosBusqueda = { expedientes, pasesFolio, pasesFolio2, traslados, previos, proyectos };

  const menuProps = {
    areaActual,
    onNavegar: (area) => { setAreaActual(area); setPantalla("area"); setMostrarBusqueda(false); setBusquedaGlobal(""); },
    onMenu: () => { setPantalla("menu"); setAreaActual(null); setVistaMenuInicial("todas"); },
    onMiArea: () => { setPantalla("menu"); setAreaActual(null); setVistaMenuInicial("mis"); },
    sesion,
  };

  const searchProps = {
    datos: datosBusqueda, busqueda: busquedaGlobal, setBusqueda: setBusquedaGlobal,
    mostrar: mostrarBusqueda, setMostrar: setMostrarBusqueda,
    onNavegar: (areaId) => { setAreaActual(AREAS.find(a => a.id === areaId)); setPantalla("area"); setMostrarBusqueda(false); setBusquedaGlobal(""); },
    menuProps,
  };

  const vistaConsultaProps = (areaId) => ({
    area: AREAS.find(a => a.id === areaId),
    sesion, datos: datosBusqueda,
    onBack: () => { setPantalla("menu"); setVistaMenuInicial("todas"); }, onLogout: handleLogout,
    logoUrl: LOGO_URL, hs, menuProps, searchProps,
  });

  // LOGIN
  if (pantalla === "login") return (
    <div style={{ ...hs.wrap, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 8px 40px rgba(13,27,75,0.13)", padding: "48px 44px", width: "100%", maxWidth: 420, textAlign: "center" }}>
        <img src={LOGO_URL} alt="Notaría 168" style={{ maxWidth: 300, width: "100%", marginBottom: 24 }} onError={e => e.target.style.display = "none"} />
        <div style={{ width: 50, height: 3, background: "#0D1B4B", borderRadius: 2, margin: "0 auto 24px", opacity: 0.15 }} />
        <p style={{ color: "#6b7a9d", fontSize: 14, marginBottom: 24 }}>Ingrese sus credenciales para acceder al sistema</p>
        <input placeholder="Usuario" value={loginUser} onChange={e => setLoginUser(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} style={IN} />
        <input placeholder="Contraseña" type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ ...IN, marginTop: 12 }} />
        {loginError && <div style={{ color: "#c0392b", fontSize: 13, marginTop: 10, textAlign: "left" }}>⚠ {loginError}</div>}
        <button onClick={handleLogin} style={BTNP}>Ingresar al sistema</button>
        <p style={{ fontSize: 12, color: "#aab", marginTop: 20 }}>Notaría 168 · Estado de México</p>
      </div>
    </div>
  );

  // ADMIN
  if (pantalla === "admin") return (
    <AdminPanel usuarios={usuarios} setUsuarios={setUsuarios} sesion={sesion}
      onBack={() => { setPantalla("menu"); setVistaMenuInicial("todas"); }} onLogout={handleLogout} logoUrl={LOGO_URL} hs={hs} />
  );

  // ÁREA REGISTRO DE EXPEDIENTES
  if (pantalla === "area" && areaActual?.id === 1) {
    if (!puedeEditar(1)) return <VistaConsulta {...vistaConsultaProps(1)} />;
    return (
      <RegistroExpedientes
        expedientes={expedientes} setExpedientes={setExpedientes}
        todosLosDatos={{ previos, pasesFolio, pasesFolio2, proyectos, traslados }}
        sesion={sesion} editable={true}
        onBack={() => { setPantalla("menu"); setVistaMenuInicial("todas"); }} onLogout={handleLogout}
        logoUrl={LOGO_URL} hs={hs} searchProps={searchProps}
      />
    );
  }

  // ÁREA PREVIOS
  if (pantalla === "area" && areaActual?.id === 2) {
    if (!puedeEditar(2)) return <VistaConsulta {...vistaConsultaProps(2)} />;
    return (
      <Previos previos={previos} setPrevios={setPrevios} expedientes={expedientes}
        sesion={sesion} editable={true}
        onBack={() => { setPantalla("menu"); setVistaMenuInicial("todas"); }} onLogout={handleLogout}
        logoUrl={LOGO_URL} hs={hs} searchProps={searchProps}
      />
    );
  }

  // ÁREA PROYECTOS
  if (pantalla === "area" && areaActual?.id === 4) {
    if (!puedeEditar(4)) return <VistaConsulta {...vistaConsultaProps(4)} />;
    return (
      <Proyectos proyectos={proyectos} setProyectos={setProyectos}
        expedientes={expedientes} pasesFolio2={pasesFolio2}
        sesion={sesion} editable={true}
        onBack={() => { setPantalla("menu"); setVistaMenuInicial("todas"); }} onLogout={handleLogout}
        logoUrl={LOGO_URL} hs={hs} searchProps={searchProps}
      />
    );
  }

  // ÁREA PASE A FOLIO 1
  if (pantalla === "area" && areaActual?.id === 8) {
    if (!puedeEditar(8)) return <VistaConsulta {...vistaConsultaProps(8)} />;
    return (
      <PaseFolio pasesFolio={pasesFolio} setPasesFolio={setPasesFolio}
        expedientes={expedientes} pasesFolio2={pasesFolio2}
        sesion={sesion} editable={true}
        onBack={() => { setPantalla("menu"); setVistaMenuInicial("todas"); }} onLogout={handleLogout}
        logoUrl={LOGO_URL} hs={hs} searchProps={searchProps} nombreArea="Pase a Folio 1"
      />
    );
  }

  // ÁREA PASE A FOLIO 2
  if (pantalla === "area" && areaActual?.id === 9) {
    if (!puedeEditar(9)) return <VistaConsulta {...vistaConsultaProps(9)} />;
    return (
      <PaseFolio2 pasesFolio2={pasesFolio2} setPasesFolio2={setPasesFolio2}
        expedientes={expedientes} proyectos={proyectos}
        sesion={sesion} editable={true}
        onBack={() => { setPantalla("menu"); setVistaMenuInicial("todas"); }} onLogout={handleLogout}
        logoUrl={LOGO_URL} hs={hs} searchProps={searchProps}
      />
    );
  }

  // ÁREA TRASLADO DE DOMINIO
  if (pantalla === "area" && areaActual?.id === 12) {
    if (!puedeEditar(12)) return <VistaConsulta {...vistaConsultaProps(12)} />;
    return (
      <TrasladoDominio traslados={traslados} setTraslados={setTraslados}
        sesion={sesion} editable={true}
        onBack={() => { setPantalla("menu"); setVistaMenuInicial("todas"); }} onLogout={handleLogout}
        logoUrl={LOGO_URL} hs={hs} searchProps={searchProps}
      />
    );
  }

  // ÁREA AVISOS
  if (pantalla === "area" && areaActual?.id === 17) return (
    <Avisos sesion={sesion}
      expedientes={expedientes} previos={previos} proyectos={proyectos}
      pasesFolio={pasesFolio} pasesFolio2={pasesFolio2} traslados={traslados}
      onBack={() => { setPantalla("menu"); setVistaMenuInicial("todas"); }} onLogout={handleLogout}
      logoUrl={LOGO_URL} hs={hs} searchProps={searchProps}
    />
  );

  // ÁREA GENÉRICA
  if (pantalla === "area" && areaActual) {
    const editable = puedeEditar(areaActual.id);
    const conAgenda = AREAS_CON_AGENDA.includes(areaActual.id);
    const puedeEditarAgenda = puedeEditar(AREA_EDITA_AGENDA);
    if (!editable) return <VistaConsulta {...vistaConsultaProps(areaActual.id)} />;
    return (
      <div style={hs.wrap}>
        <MenuLateral {...menuProps} />
        <Header sesion={sesion} onLogout={handleLogout} onAdmin={() => setPantalla("admin")} logoUrl={LOGO_URL} hs={hs} />
        <BuscadorGlobal datos={datosBusqueda} busqueda={busquedaGlobal} setBusqueda={setBusquedaGlobal} mostrar={mostrarBusqueda} setMostrar={setMostrarBusqueda} onNavegar={(areaId) => { setAreaActual(AREAS.find(a => a.id === areaId)); setPantalla("area"); setMostrarBusqueda(false); setBusquedaGlobal(""); }} />
        <div style={hs.content}>
          <button onClick={() => { setPantalla("menu"); setVistaMenuInicial("todas"); }} style={BTNR}>← Regresar al menú</button>
          <div style={{ display: "flex", gap: 20, marginTop: 24, alignItems: "flex-start" }}>
            {conAgenda && <PanelAgenda traslados={traslados} setTraslados={setTraslados} editable={puedeEditarAgenda} />}
            <div style={{ flex: 1, background: "#fff", borderRadius: 20, padding: "48px 40px", boxShadow: "0 4px 24px rgba(13,27,75,0.08)", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: 24, top: 10, fontSize: 140, opacity: 0.04, fontWeight: 900, color: "#0D1B4B", lineHeight: 1, userSelect: "none" }}>{String(areaActual.id).padStart(2, "0")}</div>
              <div style={{ fontSize: 64, marginBottom: 16 }}>{areaActual.icono}</div>
              <h1 style={{ fontSize: 32, fontWeight: 700, color: "#0D1B4B", margin: 0 }}>{areaActual.nombre}</h1>
              <p style={{ color: "#6b7a9d", fontSize: 15, marginTop: 12 }}>Área {areaActual.id} de 17 · Notaría 168 del Estado de México</p>
              <div style={{ marginTop: 40, padding: 24, background: "#f8f9fc", borderRadius: 14, border: "1px dashed #c8d0e4", color: "#8a93b0", fontSize: 14 }}>
                El contenido de esta sección se desarrollará en las siguientes etapas del sistema.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MENÚ PRINCIPAL
  return (
    <div style={hs.wrap}>
      <MenuLateral {...menuProps} />
      <Header sesion={sesion} onLogout={handleLogout} onAdmin={() => setPantalla("admin")} logoUrl={LOGO_URL} hs={hs} />
      <BuscadorGlobal
        datos={datosBusqueda} busqueda={busquedaGlobal} setBusqueda={setBusquedaGlobal}
        mostrar={mostrarBusqueda} setMostrar={setMostrarBusqueda}
        onNavegar={(areaId) => { setAreaActual(AREAS.find(a => a.id === areaId)); setPantalla("area"); setMostrarBusqueda(false); setBusquedaGlobal(""); }}
      />
      <MenuPrincipal
        sesion={sesion} puedeEditar={puedeEditar}
        onAreaClick={(area) => { setAreaActual(area); setPantalla("area"); }}
        datos={datosBusqueda} vistaInicial={vistaMenuInicial}
      />
    </div>
  );
}



