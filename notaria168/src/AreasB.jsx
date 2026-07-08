import React, { useState, useRef, useEffect } from "react";
import { AREAS, BANCOS_MEXICO, ESTATUSES, ABOGADOS, REVISORES, PROTOCOLISTAS } from "./constants";
import { MenuLateral, BuscadorGlobal } from "./Shared";
function PaseFolio({ pasesFolio, setPasesFolio, expedientes, pasesFolio2, sesion, editable, onBack, onLogout, logoUrl, hs, nombreArea, searchProps }) {
  const [vista, setVista] = useState("lista"); // "lista" | "nuevo" | "detalle"
  const [busqueda, setBusqueda] = useState("");
  const [detalleId, setDetalleId] = useState(null);

  const crearPase = (datos) => {
    const nuevo = {
      id: (pasesFolio.reduce((m, p) => Math.max(m, p.id), 0)) + 1,
      ...datos,
      registradoPor: sesion.nombre,
    };
    setPasesFolio(ps => [...ps, nuevo]);
    setVista("lista");
  };

  const filtrados = pasesFolio.filter(p => {
    const q = busqueda.toLowerCase();
    return !q || p.expediente.toLowerCase().includes(q) || p.nombreCliente.toLowerCase().includes(q) || p.abogado.toLowerCase().includes(q) || p.escritura.toLowerCase().includes(q);
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
      {searchProps?.menuProps && <MenuLateral {...searchProps.menuProps} />}
      {searchProps && <BuscadorGlobal {...searchProps} />}

      <div style={hs.content}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <button onClick={onBack} style={BTNR}>← Menú principal</button>
          <span style={{ color: "#9aa3be", fontSize: 14 }}>/</span>
          <span onClick={() => setVista("lista")} style={{ fontSize: 14, fontWeight: 600, color: vista === "lista" ? "#0D1B4B" : "#6b7a9d", cursor: "pointer" }}>
            📄 {nombreArea}
          </span>
          {vista === "nuevo" && (<><span style={{ color: "#9aa3be", fontSize: 14 }}>/</span><span style={{ fontSize: 14, fontWeight: 600, color: "#0D1B4B" }}>nuevo</span></>)}
        </div>

        {vista === "lista" && (
          <>
            <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", boxShadow: "0 2px 10px rgba(13,27,75,0.06)", marginBottom: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <input placeholder="🔍 Buscar por expediente, escritura, nombre o abogado..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ ...IN, flex: 1, minWidth: 200, marginTop: 0 }} />
              {editable && (
                <button onClick={() => setVista("nuevo")} style={{ ...BTNP, width: "auto", marginTop: 0, padding: "10px 22px", fontSize: 14 }}>+ Nuevo pase a folio</button>
              )}
            </div>

            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(13,27,75,0.07)", overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0f2f8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, color: "#0D1B4B", fontSize: 15 }}>Registros de {nombreArea.toLowerCase()}</span>
                <span style={{ fontSize: 13, color: "#9aa3be" }}>{filtrados.length} de {pasesFolio.length} registros</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "#f8f9fc" }}>
                      {["Fecha pase", "Expediente", "Escritura", "Abogado", "Cliente", "Operación", "Total honorarios"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "11px 14px", color: "#6b7a9d", fontWeight: 600, fontSize: 12, borderBottom: "1.5px solid #e8ecf4", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.map(p => (
                      <tr key={p.id} style={{ borderBottom: "1px solid #f4f6fb", cursor: "pointer" }}
                        onClick={() => { setDetalleId(p.id); setVista("detalle"); }}
                        onMouseEnter={ev => ev.currentTarget.style.background = "#f8f9fc"}
                        onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                        <td style={{ ...TD, fontSize: 13 }}>{p.fechaPase || "—"}</td>
                        <td style={{ ...TD, fontWeight: 700, color: "#0D1B4B", fontFamily: "monospace" }}>{p.expediente}</td>
                        <td style={{ ...TD, fontFamily: "monospace" }}>{p.escritura || "—"}</td>
                        <td style={TD}><span style={{ background: "#eef2fb", color: "#3a4f8a", borderRadius: 6, padding: "2px 10px", fontWeight: 600, fontSize: 12 }}>{p.abogado}</span></td>
                        <td style={TD}>{p.nombreCliente}</td>
                        <td style={TD}>{p.operacion}</td>
                        <td style={{ ...TD, fontWeight: 600 }}>${Number(p.totalHonorarios || 0).toLocaleString("es-MX")}</td>
                      </tr>
                    ))}
                    {filtrados.length === 0 && (
                      <tr><td colSpan={7} style={{ textAlign: "center", padding: 48, color: "#9aa3be" }}>
                        {pasesFolio.length === 0 ? "Aún no se ha registrado ningún pase a folio." : "No hay registros que coincidan con la búsqueda."}
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {vista === "nuevo" && editable && (
          <FormularioPaseFolio expedientes={expedientes} pasesFolio2={pasesFolio2} onCrear={crearPase} onCancelar={() => setVista("lista")} />
        )}

        {vista === "detalle" && (
          <DetallePaseFolio pase={pasesFolio.find(p => p.id === detalleId)} onVolver={() => setVista("lista")} />
        )}
      </div>
    </div>
  );
}

function formVacioFolio() {
  return {
    fechaPase: "", expediente: "", escritura: "", abogado: "", nombreCliente: "", operacion: "", banco: "",
    noCreditoInfonavit: "", municipio: "",
    montoOperacion: "", honorarios: "", ivaHonorarios: "", totalHonorarios: "",
    gastosTotales: "",
    traslado: "", fechaPagoTraslado: "", montoPagadoTraslado: "", noChequeTraslado: "",
    dictamenImpuestos: "", drpp: "", fechaPagoDerechos: "", lineaCaptura: "", montoPagadoRPP: "", dictamenesRPP: "",
    isr: "", montoPagadoISR: "", fechaPagoISR: "",
    iva: "", montoPagadoIVA: "",
    nombreBroker: "", montoBroker: "", pagoBroker: "", fechaPagoBroker: "",
    totalEscritura: "",
    facturaExpediente: "", metodoPago: "PUE", complementoPago: "", formaPago: "",
    efectivos: "", fechaPagoEfectivo: "", fechaDepositoBanco: "", montoDepositado: "", bancoDeposito: "",
    observaciones: "",
  };
}

function FormularioPaseFolio({ expedientes, pasesFolio2, onCrear, onCancelar }) {
  const [form, setForm] = useState(formVacioFolio());
  const [expSugerido, setExpSugerido] = useState(null);
  const [escrituraAuto, setEscrituraAuto] = useState(false);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const buscarExpediente = (valor) => {
    const match = expedientes.find(e => e.expediente === valor.trim());
    const pase2 = (pasesFolio2 || []).find(p => p.expediente === valor.trim());
    if (match) {
      setExpSugerido(match);
      setForm(f => ({
        ...f, expediente: valor, abogado: match.abogado, nombreCliente: match.nombre,
        operacion: match.operacion, banco: match.banco,
        escritura: pase2 ? pase2.escritura : f.escritura,
      }));
      setEscrituraAuto(Boolean(pase2));
    } else {
      setExpSugerido(null);
      setEscrituraAuto(false);
      setForm(f => ({ ...f, expediente: valor }));
    }
  };

  const recalcularHonorarios = (honorarios) => {
    const h = parseFloat(honorarios) || 0;
    const iva = Math.round(h * 0.16 * 100) / 100;
    const total = Math.round((h + iva) * 100) / 100;
    setForm(f => ({ ...f, honorarios, ivaHonorarios: iva.toString(), totalHonorarios: total.toString() }));
  };

  const handleSubmit = () => {
    if (!form.expediente || !form.abogado) return;
    onCrear(form);
  };

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "32px 36px", boxShadow: "0 4px 24px rgba(13,27,75,0.08)" }}>
      <h2 style={{ fontSize: 19, fontWeight: 700, color: "#0D1B4B", margin: "0 0 24px" }}>Nuevo pase a folio</h2>

      <FieldsetTitulo>Datos generales</FieldsetTitulo>
      <Grid2>
        <Campo label="Fecha pase a folio"><input type="date" value={form.fechaPase} onChange={set("fechaPase")} style={IN0} /></Campo>
        <Campo label="Expediente"><input value={form.expediente} onChange={e => buscarExpediente(e.target.value)} placeholder="Ej. 12-2026" style={IN0} /></Campo>
        <Campo label="Escritura">
          <input
            value={form.escritura} onChange={set("escritura")}
            readOnly={escrituraAuto}
            style={{ ...IN0, background: escrituraAuto ? "#e8f8f3" : IN0.background }}
            placeholder={escrituraAuto ? "" : "Aún no asignada en Pase a Folio 2"}
          />
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
        <Campo label="Monto de la operación"><input type="number" value={form.montoOperacion} onChange={set("montoOperacion")} style={IN0} /></Campo>
      </Grid2>
      {expSugerido && (
        <div style={{ marginTop: 10, fontSize: 12, color: "#16a085", background: "#e8f8f3", padding: "6px 12px", borderRadius: 8, display: "inline-block" }}>
          ✓ Datos cargados automáticamente del expediente {expSugerido.expediente}
          {escrituraAuto && " (incluye escritura de Pase a Folio 2)"}
        </div>
      )}

      <FieldsetTitulo>Honorarios</FieldsetTitulo>
      <Grid2>
        <Campo label="Honorarios"><input type="number" value={form.honorarios} onChange={e => recalcularHonorarios(e.target.value)} style={IN0} /></Campo>
        <Campo label="IVA 16% honorarios"><input type="number" value={form.ivaHonorarios} onChange={set("ivaHonorarios")} style={IN0} /></Campo>
        <Campo label="Total honorarios"><input type="number" value={form.totalHonorarios} onChange={set("totalHonorarios")} style={IN0} /></Campo>
        <Campo label="Gastos totales"><input type="number" value={form.gastosTotales} onChange={set("gastosTotales")} style={IN0} /></Campo>
      </Grid2>

      <FieldsetTitulo>Traslado de dominio</FieldsetTitulo>
      <Grid2>
        <Campo label="Traslado"><input type="number" value={form.traslado} onChange={set("traslado")} style={IN0} /></Campo>
        <Campo label="Fecha de pago traslado"><input type="date" value={form.fechaPagoTraslado} onChange={set("fechaPagoTraslado")} style={IN0} /></Campo>
        <Campo label="Monto pagado traslado"><input type="number" value={form.montoPagadoTraslado} onChange={set("montoPagadoTraslado")} style={IN0} /></Campo>
        <Campo label="No. de cheque traslado"><input value={form.noChequeTraslado} onChange={set("noChequeTraslado")} style={IN0} /></Campo>
      </Grid2>

      <FieldsetTitulo>Derechos de Registro Público</FieldsetTitulo>
      <Grid2>
        <Campo label="Dictamen de impuestos"><input value={form.dictamenImpuestos} onChange={set("dictamenImpuestos")} style={IN0} /></Campo>
        <Campo label="DRPP"><input type="number" value={form.drpp} onChange={set("drpp")} style={IN0} /></Campo>
        <Campo label="Fecha de pago derechos"><input type="date" value={form.fechaPagoDerechos} onChange={set("fechaPagoDerechos")} style={IN0} /></Campo>
        <Campo label="Línea de captura"><input value={form.lineaCaptura} onChange={set("lineaCaptura")} style={IN0} /></Campo>
        <Campo label="Monto pagado RPP"><input type="number" value={form.montoPagadoRPP} onChange={set("montoPagadoRPP")} style={IN0} /></Campo>
        <Campo label="Dictámenes RPP"><input value={form.dictamenesRPP} onChange={set("dictamenesRPP")} style={IN0} /></Campo>
      </Grid2>

      <FieldsetTitulo>ISR e IVA</FieldsetTitulo>
      <Grid2>
        <Campo label="ISR"><input type="number" value={form.isr} onChange={set("isr")} style={IN0} /></Campo>
        <Campo label="Monto pagado ISR"><input type="number" value={form.montoPagadoISR} onChange={set("montoPagadoISR")} style={IN0} /></Campo>
        <Campo label="Fecha de pago ISR"><input type="date" value={form.fechaPagoISR} onChange={set("fechaPagoISR")} style={IN0} /></Campo>
        <Campo label="IVA"><input type="number" value={form.iva} onChange={set("iva")} style={IN0} /></Campo>
        <Campo label="Monto pagado IVA"><input type="number" value={form.montoPagadoIVA} onChange={set("montoPagadoIVA")} style={IN0} /></Campo>
      </Grid2>

      <FieldsetTitulo>Broker</FieldsetTitulo>
      <Grid2>
        <Campo label="Nombre del broker"><input value={form.nombreBroker} onChange={set("nombreBroker")} style={IN0} /></Campo>
        <Campo label="Monto a broker"><input type="number" value={form.montoBroker} onChange={set("montoBroker")} style={IN0} /></Campo>
        <Campo label="Pago broker"><input value={form.pagoBroker} onChange={set("pagoBroker")} style={IN0} /></Campo>
        <Campo label="Fecha pago broker"><input type="date" value={form.fechaPagoBroker} onChange={set("fechaPagoBroker")} style={IN0} /></Campo>
      </Grid2>

      <FieldsetTitulo>Total y facturación</FieldsetTitulo>
      <Grid2>
        <Campo label="Total escritura"><input type="number" value={form.totalEscritura} onChange={set("totalEscritura")} style={IN0} /></Campo>
        <Campo label="Factura expediente"><input value={form.facturaExpediente} onChange={set("facturaExpediente")} style={IN0} /></Campo>
        <Campo label="Método de pago">
          <select value={form.metodoPago} onChange={set("metodoPago")} style={IN0}>
            {METODOS_PAGO_FOLIO.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </Campo>
        <Campo label="Complemento de pago"><input value={form.complementoPago} onChange={set("complementoPago")} style={IN0} /></Campo>
        <Campo label="Forma de pago">
          <select value={form.formaPago} onChange={set("formaPago")} style={IN0}>
            <option value="">Seleccionar...</option>
            {FORMAS_PAGO_FOLIO.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </Campo>
      </Grid2>

      <FieldsetTitulo>Pago y depósito</FieldsetTitulo>
      <Grid2>
        <Campo label="Efectivo"><input type="number" value={form.efectivos} onChange={set("efectivos")} style={IN0} /></Campo>
        <Campo label="Fecha pago efectivo"><input type="date" value={form.fechaPagoEfectivo} onChange={set("fechaPagoEfectivo")} style={IN0} /></Campo>
        <Campo label="Fecha depósito banco"><input type="date" value={form.fechaDepositoBanco} onChange={set("fechaDepositoBanco")} style={IN0} /></Campo>
        <Campo label="Monto depositado"><input type="number" value={form.montoDepositado} onChange={set("montoDepositado")} style={IN0} /></Campo>
        <Campo label="Banco del depósito">
          <select value={form.bancoDeposito} onChange={set("bancoDeposito")} style={IN0}>
            <option value="">-----------</option>
            {BANCOS_MEXICO.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </Campo>
      </Grid2>

      <div style={{ marginTop: 20 }}>
        <label style={{ fontSize: 12, color: "#6b7a9d", fontWeight: 600, display: "block", marginBottom: 4 }}>Observaciones</label>
        <textarea value={form.observaciones} onChange={set("observaciones")} rows={3} style={{ ...IN0, resize: "vertical" }} />
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
        <button onClick={handleSubmit} disabled={!form.expediente || !form.abogado}
          style={{ ...BTNP, width: "auto", marginTop: 0, padding: "11px 28px", fontSize: 14, opacity: (form.expediente && form.abogado) ? 1 : 0.5, cursor: (form.expediente && form.abogado) ? "pointer" : "not-allowed" }}>
          Crear pase a folio
        </button>
        <button onClick={onCancelar} style={{ ...BTNP, width: "auto", marginTop: 0, padding: "11px 28px", fontSize: 14, background: "#fff", color: "#0D1B4B", border: "1.5px solid #dde2ef" }}>
          Cancelar
        </button>
      </div>
      {(!form.expediente || !form.abogado) && (
        <p style={{ fontSize: 12, color: "#c0392b", marginTop: 10 }}>⚠ Expediente y abogado son obligatorios.</p>
      )}
    </div>
  );
}

function DetallePaseFolio({ pase, onVolver }) {
  if (!pase) return (
    <div style={{ background: "#fff", borderRadius: 20, padding: 40, textAlign: "center", color: "#9aa3be" }}>
      Registro no encontrado.
      <div style={{ marginTop: 16 }}><button onClick={onVolver} style={BTNR}>← Volver a la lista</button></div>
    </div>
  );

  const Seccion = ({ titulo, campos }) => (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ fontSize: 13, fontWeight: 700, color: "#6b7a9d", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 12px", borderBottom: "1px solid #f0f2f8", paddingBottom: 6 }}>{titulo}</h4>
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", rowGap: 10, columnGap: 16 }}>
        {campos.map(([label, valor]) => (
          <React.Fragment key={label}>
            <span style={LBL}>{label}:</span>
            <span style={{ color: "#2d3a5e" }}>{valor || <span style={{ color: "#c8d0e4" }}>—</span>}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "32px 36px", boxShadow: "0 4px 24px rgba(13,27,75,0.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0D1B4B", margin: 0, fontFamily: "monospace" }}>{pase.expediente}</h2>
        <button onClick={onVolver} style={BTNR}>← Volver a la lista</button>
      </div>

      <Seccion titulo="Datos generales" campos={[
        ["Fecha pase a folio", pase.fechaPase],
        ["Escritura", pase.escritura],
        ["Abogado", pase.abogado],
        ["Nombre del cliente", pase.nombreCliente],
        ["Operación", pase.operacion],
        ["Banco", pase.banco],
        ["No. crédito Infonavit", pase.noCreditoInfonavit],
        ["Estado o municipio", pase.municipio],
        ["Monto de la operación", pase.montoOperacion && `$${Number(pase.montoOperacion).toLocaleString("es-MX")}`],
      ]} />

      <Seccion titulo="Honorarios" campos={[
        ["Honorarios", pase.honorarios && `$${Number(pase.honorarios).toLocaleString("es-MX")}`],
        ["IVA 16% honorarios", pase.ivaHonorarios && `$${Number(pase.ivaHonorarios).toLocaleString("es-MX")}`],
        ["Total honorarios", pase.totalHonorarios && `$${Number(pase.totalHonorarios).toLocaleString("es-MX")}`],
        ["Gastos totales", pase.gastosTotales && `$${Number(pase.gastosTotales).toLocaleString("es-MX")}`],
      ]} />

      <Seccion titulo="Traslado de dominio" campos={[
        ["Traslado", pase.traslado && `$${Number(pase.traslado).toLocaleString("es-MX")}`],
        ["Fecha de pago traslado", pase.fechaPagoTraslado],
        ["Monto pagado traslado", pase.montoPagadoTraslado && `$${Number(pase.montoPagadoTraslado).toLocaleString("es-MX")}`],
        ["No. de cheque traslado", pase.noChequeTraslado],
      ]} />

      <Seccion titulo="Derechos de Registro Público" campos={[
        ["Dictamen de impuestos", pase.dictamenImpuestos],
        ["DRPP", pase.drpp && `$${Number(pase.drpp).toLocaleString("es-MX")}`],
        ["Fecha de pago derechos", pase.fechaPagoDerechos],
        ["Línea de captura", pase.lineaCaptura],
        ["Monto pagado RPP", pase.montoPagadoRPP && `$${Number(pase.montoPagadoRPP).toLocaleString("es-MX")}`],
        ["Dictámenes RPP", pase.dictamenesRPP],
      ]} />

      <Seccion titulo="ISR e IVA" campos={[
        ["ISR", pase.isr && `$${Number(pase.isr).toLocaleString("es-MX")}`],
        ["Monto pagado ISR", pase.montoPagadoISR && `$${Number(pase.montoPagadoISR).toLocaleString("es-MX")}`],
        ["Fecha de pago ISR", pase.fechaPagoISR],
        ["IVA", pase.iva && `$${Number(pase.iva).toLocaleString("es-MX")}`],
        ["Monto pagado IVA", pase.montoPagadoIVA && `$${Number(pase.montoPagadoIVA).toLocaleString("es-MX")}`],
      ]} />

      <Seccion titulo="Broker" campos={[
        ["Nombre del broker", pase.nombreBroker],
        ["Monto a broker", pase.montoBroker && `$${Number(pase.montoBroker).toLocaleString("es-MX")}`],
        ["Pago broker", pase.pagoBroker],
        ["Fecha pago broker", pase.fechaPagoBroker],
      ]} />

      <Seccion titulo="Total y facturación" campos={[
        ["Total escritura", pase.totalEscritura && `$${Number(pase.totalEscritura).toLocaleString("es-MX")}`],
        ["Factura expediente", pase.facturaExpediente],
        ["Método de pago", pase.metodoPago],
        ["Complemento de pago", pase.complementoPago],
        ["Forma de pago", pase.formaPago],
      ]} />

      <Seccion titulo="Pago y depósito" campos={[
        ["Efectivo", pase.efectivos && `$${Number(pase.efectivos).toLocaleString("es-MX")}`],
        ["Fecha pago efectivo", pase.fechaPagoEfectivo],
        ["Fecha depósito banco", pase.fechaDepositoBanco],
        ["Monto depositado", pase.montoDepositado && `$${Number(pase.montoDepositado).toLocaleString("es-MX")}`],
        ["Banco del depósito", pase.bancoDeposito],
      ]} />

      {pase.observaciones && (
        <div style={{ marginTop: 8 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#6b7a9d", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>Observaciones</h4>
          <p style={{ color: "#2d3a5e", background: "#f8f9fc", padding: "10px 14px", borderRadius: 10, margin: 0 }}>{pase.observaciones}</p>
        </div>
      )}

      <p style={{ fontSize: 12, color: "#9aa3be", marginTop: 20 }}>Registrado por {pase.registradoPor}</p>
    </div>
  );
}

function FieldsetTitulo({ children }) {
  return (
    <h4 style={{
      fontSize: 13, fontWeight: 700, color: "#0D1B4B", textTransform: "uppercase", letterSpacing: 0.5,
      margin: "28px 0 14px", paddingBottom: 8, borderBottom: "2px solid #eaf0fa",
    }}>{children}</h4>
  );
}

function Grid2({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>{children}</div>;
}

function Campo({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 12, color: "#6b7a9d", fontWeight: 600 }}>{label}</span>
      {children}
    </label>
  );
}


// ─── PASE A FOLIO 2 (Área 9) ──────────────────────────────────────────────────
// Aquí se asigna el número de escritura manualmente. Una vez creado el registro,
// queda disponible para que el área 8 (Pase a Folio 1) cargue la escritura en automático.
export function PaseFolio2({ pasesFolio2, setPasesFolio2, expedientes, proyectos, sesion, editable, onBack, onLogout, logoUrl, hs, searchProps }) {
  const [vista, setVista] = useState("lista");
  const [busqueda, setBusqueda] = useState("");
  const [detalleId, setDetalleId] = useState(null);

  const crearRegistro = (datos) => {
    const nuevo = {
      id: (pasesFolio2.reduce((m, p) => Math.max(m, p.id), 0)) + 1,
      ...datos,
      registradoPor: sesion.nombre,
    };
    setPasesFolio2(ps => [...ps, nuevo]);
    setVista("lista");
  };

  const filtrados = pasesFolio2.filter(p => {
    const q = busqueda.toLowerCase();
    return !q || p.expediente.toLowerCase().includes(q) || p.escritura.toLowerCase().includes(q) || p.abogado.toLowerCase().includes(q) || (p.acreditado || "").toLowerCase().includes(q);
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
      {searchProps?.menuProps && <MenuLateral {...searchProps.menuProps} />}
      {searchProps && <BuscadorGlobal {...searchProps} />}

      <div style={hs.content}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <button onClick={onBack} style={BTNR}>← Menú principal</button>
          <span style={{ color: "#9aa3be", fontSize: 14 }}>/</span>
          <span onClick={() => setVista("lista")} style={{ fontSize: 14, fontWeight: 600, color: vista === "lista" ? "#0D1B4B" : "#6b7a9d", cursor: "pointer" }}>
            📑 Pase a Folio 2
          </span>
          {vista === "nuevo" && (<><span style={{ color: "#9aa3be", fontSize: 14 }}>/</span><span style={{ fontSize: 14, fontWeight: 600, color: "#0D1B4B" }}>nuevo</span></>)}
        </div>

        {vista === "lista" && (
          <>
            <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", boxShadow: "0 2px 10px rgba(13,27,75,0.06)", marginBottom: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <input placeholder="🔍 Buscar por expediente, escritura, abogado o acreditado..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ ...IN, flex: 1, minWidth: 200, marginTop: 0 }} />
              {editable && (
                <button onClick={() => setVista("nuevo")} style={{ ...BTNP, width: "auto", marginTop: 0, padding: "10px 22px", fontSize: 14 }}>+ Nuevo registro</button>
              )}
            </div>

            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(13,27,75,0.07)", overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0f2f8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, color: "#0D1B4B", fontSize: 15 }}>Registros de Pase a Folio 2</span>
                <span style={{ fontSize: 13, color: "#9aa3be" }}>{filtrados.length} de {pasesFolio2.length} registros</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "#f8f9fc" }}>
                      {["Folio", "Pase", "Escritura", "Fecha", "Expediente", "Volumen", "Abogado", "Banco", "Municipio", "Documento (Área 4)"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "11px 14px", color: "#6b7a9d", fontWeight: 600, fontSize: 12, borderBottom: "1.5px solid #e8ecf4", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.map(p => {
                      const proy = (proyectos || []).find(pr => pr.expediente === p.expediente);
                      return (
                        <tr key={p.id} style={{ borderBottom: "1px solid #f4f6fb", cursor: "pointer" }}
                          onClick={() => { setDetalleId(p.id); setVista("detalle"); }}
                          onMouseEnter={ev => ev.currentTarget.style.background = "#f8f9fc"}
                          onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                          <td style={{ ...TD, fontFamily: "monospace" }}>{p.folio || "—"}</td>
                          <td style={{ ...TD, fontFamily: "monospace" }}>{p.pase || "—"}</td>
                          <td style={{ ...TD, fontWeight: 700, color: "#0D1B4B", fontFamily: "monospace" }}>{p.escritura}</td>
                          <td style={{ ...TD, fontSize: 13 }}>{p.fecha || "—"}</td>
                          <td style={{ ...TD, fontFamily: "monospace" }}>{p.expediente}</td>
                          <td style={TD}>{p.volumen || "—"}</td>
                          <td style={TD}><span style={{ background: "#eef2fb", color: "#3a4f8a", borderRadius: 6, padding: "2px 10px", fontWeight: 600, fontSize: 12 }}>{p.abogado}</span></td>
                          <td style={TD}>{p.banco || "—"}</td>
                          <td style={TD}>{p.municipio || "—"}</td>
                          <td style={TD} onClick={e => e.stopPropagation()}>
                            {proy?.documentoNombre ? (
                              <a href={proy.documentoData} download={proy.documentoNombre}
                                style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#f0fff4", border: "1px solid #27ae60", borderRadius: 7, padding: "4px 10px", color: "#1a7a3d", fontWeight: 600, fontSize: 12, textDecoration: "none", whiteSpace: "nowrap" }}>
                                📄 {proy.documentoNombre.length > 16 ? proy.documentoNombre.slice(0, 13) + "..." : proy.documentoNombre}
                              </a>
                            ) : proy ? (
                              <span style={{ fontSize: 12, color: "#e67e22" }}>⚠ Sin documento</span>
                            ) : (
                              <span style={{ fontSize: 12, color: "#c8d0e4" }}>Sin proyecto</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {filtrados.length === 0 && (
                      <tr><td colSpan={10} style={{ textAlign: "center", padding: 48, color: "#9aa3be" }}>
                        {pasesFolio2.length === 0 ? "Aún no se ha registrado ningún pase a folio 2." : "No hay registros que coincidan con la búsqueda."}
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {vista === "nuevo" && editable && (
          <FormularioPaseFolio2 expedientes={expedientes} proyectos={proyectos || []} onCrear={crearRegistro} onCancelar={() => setVista("lista")} />
        )}

        {vista === "detalle" && (
          <DetallePaseFolio2
            pase={pasesFolio2.find(p => p.id === detalleId)}
            proyectos={proyectos || []}
            onVolver={() => setVista("lista")}
          />
        )}
      </div>
    </div>
  );
}

export function FormularioPaseFolio2({ expedientes, proyectos, onCrear, onCancelar }) {
  const [form, setForm] = useState({
    folio: "", pase: "", escritura: "", fecha: "", expediente: "", volumen: "",
    abogado: "", banco: "", municipio: "",
  });
  const [expSugerido, setExpSugerido] = useState(null);
  const [proyectoVinculado, setProyectoVinculado] = useState(null);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const buscarExpediente = (valor) => {
    const match = expedientes.find(e => e.expediente === valor.trim());
    const proy  = proyectos.find(p => p.expediente === valor.trim());
    if (match) {
      setExpSugerido(match);
      setForm(f => ({ ...f, expediente: valor, abogado: match.abogado, banco: match.banco }));
    } else {
      setExpSugerido(null);
      setForm(f => ({ ...f, expediente: valor }));
    }
    setProyectoVinculado(proy || null);
  };

  const handleSubmit = () => {
    if (!form.expediente || !form.escritura) return;
    onCrear(form);
  };

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "32px 36px", boxShadow: "0 4px 24px rgba(13,27,75,0.08)" }}>
      <h2 style={{ fontSize: 19, fontWeight: 700, color: "#0D1B4B", margin: "0 0 24px" }}>Nuevo registro — Pase a Folio 2</h2>

      <Grid2>
        <Campo label="Folio"><input value={form.folio} onChange={set("folio")} style={IN0} /></Campo>
        <Campo label="Pase"><input value={form.pase} onChange={set("pase")} style={IN0} /></Campo>
        <Campo label="Escritura">
          <input value={form.escritura} onChange={set("escritura")} placeholder="Número de escritura" style={IN0} />
        </Campo>
        <Campo label="Fecha"><input type="date" value={form.fecha} onChange={set("fecha")} style={IN0} /></Campo>
        <Campo label="Expediente">
          <input value={form.expediente} onChange={e => buscarExpediente(e.target.value)} placeholder="Ej. 12-2026" style={IN0} />
        </Campo>
        <Campo label="Volumen"><input value={form.volumen} onChange={set("volumen")} style={IN0} /></Campo>
        <Campo label="Abogado"><input value={form.abogado} onChange={set("abogado")} style={IN0} /></Campo>
        <Campo label="Banco">
          <select value={form.banco} onChange={set("banco")} style={IN0}>
            <option value="">-----------</option>
            {BANCOS_MEXICO.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </Campo>
        <Campo label="Municipio"><input value={form.municipio} onChange={set("municipio")} style={IN0} /></Campo>
      </Grid2>

      {expSugerido && (
        <div style={{ marginTop: 14, fontSize: 12, color: "#16a085", background: "#e8f8f3", padding: "6px 12px", borderRadius: 8, display: "inline-block" }}>
          ✓ Abogado y banco cargados automáticamente del expediente {expSugerido.expediente}
        </div>
      )}

      {/* AVISO DE PROYECTO VINCULADO — solo informativo al crear */}
      {proyectoVinculado && (
        <div style={{ marginTop: 14, background: "#eaf3fb", border: "1px solid #b8d4ef", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#1a5fa3" }}>
          📐 Existe un proyecto registrado para este expediente (dictamina: <strong>{proyectoVinculado.dictamina}</strong> · protocolista: <strong>{proyectoVinculado.protocolista}</strong>). Una vez guardado este registro podrá ver y descargar el documento desde el detalle.
        </div>
      )}

      {form.expediente && !proyectoVinculado && form.expediente.length > 2 && (
        <div style={{ marginTop: 14, fontSize: 12, color: "#9aa3be", background: "#f8f9fc", padding: "8px 12px", borderRadius: 8 }}>
          ℹ No se encontró un proyecto vinculado a este expediente en el área de Proyectos.
        </div>
      )}

      <div style={{ marginTop: 16, padding: "12px 16px", background: "#eaf3fb", border: "1px solid #b8d4ef", borderRadius: 10, color: "#1a5fa3", fontSize: 13 }}>
        ℹ Al guardar, esta escritura quedará disponible para cargarse automáticamente en Pase a Folio 1 cuando se busque este mismo expediente.
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button onClick={handleSubmit} disabled={!form.expediente || !form.escritura}
          style={{ ...BTNP, width: "auto", marginTop: 0, padding: "11px 28px", fontSize: 14, opacity: (form.expediente && form.escritura) ? 1 : 0.5, cursor: (form.expediente && form.escritura) ? "pointer" : "not-allowed" }}>
          Crear registro
        </button>
        <button onClick={onCancelar} style={{ ...BTNP, width: "auto", marginTop: 0, padding: "11px 28px", fontSize: 14, background: "#fff", color: "#0D1B4B", border: "1.5px solid #dde2ef" }}>
          Cancelar
        </button>
      </div>
      {(!form.expediente || !form.escritura) && (
        <p style={{ fontSize: 12, color: "#c0392b", marginTop: 10 }}>⚠ Expediente y escritura son obligatorios.</p>
      )}
    </div>
  );
}

export function DetallePaseFolio2({ pase, proyectos, onVolver }) {
  if (!pase) return (
    <div style={{ background: "#fff", borderRadius: 20, padding: 40, textAlign: "center", color: "#9aa3be" }}>
      Registro no encontrado.
      <div style={{ marginTop: 16 }}><button onClick={onVolver} style={BTNR}>← Volver a la lista</button></div>
    </div>
  );

  const proy = (proyectos || []).find(pr => pr.expediente === pase.expediente);

  const campos = [
    ["Folio", pase.folio], ["Pase", pase.pase], ["Escritura", pase.escritura], ["Fecha", pase.fecha],
    ["Expediente", pase.expediente], ["Volumen", pase.volumen], ["Abogado", pase.abogado],
    ["Banco", pase.banco], ["Municipio", pase.municipio],
  ];

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "32px 36px", boxShadow: "0 4px 24px rgba(13,27,75,0.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0D1B4B", margin: 0, fontFamily: "monospace" }}>Escritura {pase.escritura}</h2>
        <button onClick={onVolver} style={BTNR}>← Volver a la lista</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", rowGap: 12, columnGap: 16, marginBottom: 24 }}>
        {campos.map(([label, valor]) => (
          <React.Fragment key={label}>
            <span style={LBL}>{label}:</span>
            <span style={{ color: "#2d3a5e" }}>{valor || <span style={{ color: "#c8d0e4" }}>—</span>}</span>
          </React.Fragment>
        ))}
      </div>

      {/* DOCUMENTO DEL PROYECTO VINCULADO */}
      <div style={{ borderTop: "1.5px solid #f0f2f8", paddingTop: 20, marginTop: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#6b7a9d", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
          Documento del Proyecto (Área 4)
        </div>
        {proy ? (
          proy.documentoNombre ? (
            <div style={{ background: "#f0fff4", border: "1.5px solid #a3e6c0", borderRadius: 14, padding: "16px 20px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 20, fontSize: 13, color: "#2d3a5e", marginBottom: 14 }}>
                <span><strong>Dictamina:</strong> {proy.dictamina}</span>
                <span><strong>Protocolista:</strong> {proy.protocolista}</span>
                {proy.revisor1  && <span><strong>Revisor 1°:</strong>  {proy.revisor1}</span>}
                {proy.subsana1  && <span><strong>Subsana 1°:</strong>  {proy.subsana1}</span>}
                {proy.revisor2  && <span><strong>Revisor 2°:</strong>  {proy.revisor2}</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <a href={proy.documentoData} download={proy.documentoNombre}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "2px solid #27ae60", borderRadius: 10, padding: "10px 18px", color: "#1a7a3d", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                  📄 Descargar — {proy.documentoNombre}
                </a>
                <span style={{ fontSize: 12, color: "#9aa3be" }}>
                  Subido el {proy.documentoFecha} a las {proy.documentoHora}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ background: "#fef9ec", border: "1.5px solid #f0d98c", borderRadius: 12, padding: "14px 18px", color: "#8a6d1a", fontSize: 13, display: "flex", alignItems: "center", gap: 10 }}>
              ⚠ El proyecto vinculado a este expediente aún no tiene documento Word subido. Solicítelo al área de Proyectos.
            </div>
          )
        ) : (
          <div style={{ background: "#f8f9fc", border: "1.5px solid #e0e6f0", borderRadius: 12, padding: "14px 18px", color: "#9aa3be", fontSize: 13 }}>
            No se encontró un proyecto registrado para el expediente <strong>{pase.expediente}</strong> en el área de Proyectos.
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, color: "#9aa3be", marginTop: 20 }}>Registrado por {pase.registradoPor}</p>
    </div>
  );
}


export function TrasladoDominio({ traslados, setTraslados, sesion, editable, onBack, onLogout, logoUrl, hs, searchProps }) {
  const [filtroEstatus, setFiltroEstatus] = useState("todos");
  const [filtroBuscar, setFiltroBuscar]   = useState("");
  const [editandoId, setEditandoId]       = useState(null);
  const [modalNuevo, setModalNuevo]       = useState(false);
  const [form, setForm]                   = useState(formVacioT());
  const [vistaDetalle, setVistaDetalle]   = useState(null);

  function formVacioT() {
    return { escritura: "", expediente: "", abogado: "", municipio: "", estatus: "pendiente", observaciones: "", fechaIngreso: "" };
  }

  const filtrados = traslados.filter(t => {
    const matchEst = filtroEstatus === "todos" || t.estatus === filtroEstatus;
    const q = filtroBuscar.toLowerCase();
    const matchBusq = !q || t.escritura.includes(q) || t.expediente.toLowerCase().includes(q) || t.abogado.toLowerCase().includes(q) || t.municipio.toLowerCase().includes(q);
    return matchEst && matchBusq;
  });

  const conteos = ESTATUSES.reduce((acc, e) => {
    acc[e.valor] = traslados.filter(t => t.estatus === e.valor).length;
    return acc;
  }, {});

  const guardarEdicion = () => {
    if (editandoId) {
      setTraslados(ts => ts.map(t => t.id === editandoId ? { ...t, ...form } : t));
    } else {
      const newId = Math.max(...traslados.map(t => t.id)) + 1;
      setTraslados(ts => [...ts, { id: newId, ...form }]);
    }
    setEditandoId(null); setModalNuevo(false); setForm(formVacioT());
  };

  const abrirEditar = (t) => {
    setForm({ escritura: t.escritura, expediente: t.expediente, abogado: t.abogado, municipio: t.municipio, estatus: t.estatus, observaciones: t.observaciones, fechaIngreso: t.fechaIngreso });
    setEditandoId(t.id); setModalNuevo(false); setVistaDetalle(null);
  };

  const cambioRapidoEstatus = (id, nuevoEstatus) => {
    setTraslados(ts => ts.map(t => t.id === id ? { ...t, estatus: nuevoEstatus } : t));
  };

  return (
    <div style={hs.wrap}>
      {/* HEADER */}
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
        {/* BREADCRUMB */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <button onClick={onBack} style={BTNR}>← Menú principal</button>
          <span style={{ color: "#9aa3be", fontSize: 14 }}>/</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#0D1B4B" }}>🏠 Traslado de Dominio</span>
        </div>

        {/* TARJETAS DE RESUMEN */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 24 }}>
          <div style={cardMetrica("#f4f6fb", "#0D1B4B")}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{traslados.length}</div>
            <div style={{ fontSize: 12, color: "#6b7a9d", marginTop: 2 }}>Total</div>
          </div>
          {ESTATUSES.map(e => (
            <div key={e.valor} style={cardMetrica(e.bg, e.color)} onClick={() => setFiltroEstatus(filtroEstatus === e.valor ? "todos" : e.valor)}
              title={`Filtrar por ${e.label}`}>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{conteos[e.valor] || 0}</div>
              <div style={{ fontSize: 11, marginTop: 2, fontWeight: 600 }}>{e.label}</div>
            </div>
          ))}
        </div>

        {/* BARRA DE HERRAMIENTAS */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", boxShadow: "0 2px 10px rgba(13,27,75,0.06)", marginBottom: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input
            placeholder="🔍 Buscar escritura, expediente, abogado o municipio..."
            value={filtroBuscar} onChange={e => setFiltroBuscar(e.target.value)}
            style={{ ...IN, flex: 1, minWidth: 200, marginTop: 0 }}
          />
          <select value={filtroEstatus} onChange={e => setFiltroEstatus(e.target.value)} style={{ ...IN, width: "auto", marginTop: 0 }}>
            <option value="todos">Todos los estatus</option>
            {ESTATUSES.map(e => <option key={e.valor} value={e.valor}>{e.label}</option>)}
          </select>
          {editable && (
            <button onClick={() => { setForm(formVacioT()); setModalNuevo(true); setEditandoId(null); }}
              style={{ ...BTNP, width: "auto", marginTop: 0, padding: "10px 20px", fontSize: 13 }}>
              + Agregar traslado
            </button>
          )}
        </div>

        {/* MODAL EDICIÓN / NUEVO */}
        {(modalNuevo || editandoId) && editable && (
          <div style={{ background: "#fff", border: "1.5px solid #c8d0e4", borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: "0 4px 20px rgba(13,27,75,0.10)" }}>
            <h3 style={{ margin: "0 0 18px", color: "#0D1B4B", fontSize: 16 }}>
              {editandoId ? "✏ Editar traslado" : "➕ Nuevo traslado"}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
              {[["Escritura", "escritura"], ["Expediente", "expediente"], ["Abogado", "abogado"], ["Municipio", "municipio"], ["Fecha de ingreso", "fechaIngreso"]].map(([label, key]) => (
                <label key={key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 12, color: "#6b7a9d", fontWeight: 600 }}>{label}</span>
                  <input type={key === "fechaIngreso" ? "date" : "text"} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ ...IN, marginTop: 0 }} />
                </label>
              ))}
              <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, color: "#6b7a9d", fontWeight: 600 }}>Estatus</span>
                <select value={form.estatus} onChange={e => setForm(f => ({ ...f, estatus: e.target.value }))} style={{ ...IN, marginTop: 0 }}>
                  {ESTATUSES.map(e => <option key={e.valor} value={e.valor}>{e.label}</option>)}
                </select>
              </label>
            </div>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 14 }}>
              <span style={{ fontSize: 12, color: "#6b7a9d", fontWeight: 600 }}>Observaciones</span>
              <textarea value={form.observaciones} onChange={e => setForm(f => ({ ...f, observaciones: e.target.value }))}
                rows={2} style={{ ...IN, marginTop: 0, resize: "vertical" }} />
            </label>
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button onClick={guardarEdicion} style={{ ...BTNP, width: "auto", marginTop: 0, padding: "10px 24px", fontSize: 14 }}>
                {editandoId ? "Guardar cambios" : "Crear traslado"}
              </button>
              <button onClick={() => { setEditandoId(null); setModalNuevo(false); setForm(formVacioT()); }}
                style={{ ...BTNP, width: "auto", marginTop: 0, padding: "10px 24px", fontSize: 14, background: "#fff", color: "#0D1B4B", border: "1.5px solid #dde2ef" }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* TABLA */}
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(13,27,75,0.07)", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0f2f8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 600, color: "#0D1B4B", fontSize: 15 }}>
              Lista de traslados pagados — ingreso a Registro Público
            </span>
            <span style={{ fontSize: 13, color: "#9aa3be" }}>
              {filtrados.length} de {traslados.length} registros
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f8f9fc" }}>
                  {["No.", "Escritura", "Expediente", "Abogado", "Municipio", "Estatus", "Fecha Ingreso", "Observaciones", ...(editable ? ["Acciones"] : [])].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "11px 14px", color: "#6b7a9d", fontWeight: 600, fontSize: 12, borderBottom: "1.5px solid #e8ecf4", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((t, idx) => {
                  const est = estatusInfo(t.estatus);
                  return (
                    <tr key={t.id} style={{ borderBottom: "1px solid #f4f6fb", transition: "background 0.1s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8f9fc"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={TD}>{t.id}</td>
                      <td style={{ ...TD, fontWeight: 700, color: "#0D1B4B" }}>{t.escritura}</td>
                      <td style={{ ...TD, fontFamily: "monospace", fontSize: 13 }}>{t.expediente}</td>
                      <td style={TD}>
                        <span style={{ background: "#eef2fb", color: "#3a4f8a", borderRadius: 6, padding: "2px 10px", fontWeight: 600, fontSize: 12 }}>{t.abogado}</span>
                      </td>
                      <td style={TD}>{t.municipio}</td>
                      <td style={TD}>
                        {editable ? (
                          <select value={t.estatus} onChange={e => cambioRapidoEstatus(t.id, e.target.value)}
                            style={{ border: `1.5px solid ${est.color}`, background: est.bg, color: est.color, borderRadius: 8, padding: "3px 8px", fontSize: 12, fontWeight: 600, cursor: "pointer", outline: "none" }}>
                            {ESTATUSES.map(e => <option key={e.valor} value={e.valor}>{e.label}</option>)}
                          </select>
                        ) : (
                          <span style={{ background: est.bg, color: est.color, borderRadius: 8, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>{est.label}</span>
                        )}
                      </td>
                      <td style={{ ...TD, color: t.fechaIngreso ? "#0D1B4B" : "#c8d0e4", fontSize: 13 }}>
                        {t.fechaIngreso || "—"}
                      </td>
                      <td style={{ ...TD, maxWidth: 180, color: t.observaciones ? "#2d3a5e" : "#c8d0e4", fontSize: 13 }}>
                        <span title={t.observaciones} style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>
                          {t.observaciones || "—"}
                        </span>
                      </td>
                      {editable && (
                        <td style={TD}>
                          <button onClick={() => abrirEditar(t)} style={BTNAC("#1a5fa3")}>Editar</button>
                        </td>
                      )}
                    </tr>
                  );
                })}
                {filtrados.length === 0 && (
                  <tr><td colSpan={9} style={{ textAlign: "center", padding: 40, color: "#9aa3be" }}>No hay traslados que coincidan con el filtro.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RESUMEN POR ABOGADO */}
        <ResumenAbogado traslados={filtrados} />
      </div>
    </div>
  );
}

export function ResumenAbogado({ traslados }) {
  const porAbogado = traslados.reduce((acc, t) => {
    if (!acc[t.abogado]) acc[t.abogado] = { total: 0, completados: 0 };
    acc[t.abogado].total++;
    if (t.estatus === "completado") acc[t.abogado].completados++;
    return acc;
  }, {});

  return (
    <div style={{ marginTop: 20, background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(13,27,75,0.07)" }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "#0D1B4B" }}>Resumen por abogado</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {Object.entries(porAbogado).map(([abogado, d]) => (
          <div key={abogado} style={{ background: "#f4f6fb", borderRadius: 10, padding: "10px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ background: "#0D1B4B", color: "#fff", borderRadius: 8, padding: "4px 12px", fontWeight: 700, fontSize: 13 }}>{abogado}</span>
            <span style={{ fontSize: 14, color: "#2d3a5e" }}><b>{d.total}</b> traslado{d.total !== 1 ? "s" : ""}</span>
            {d.completados > 0 && <span style={{ fontSize: 12, color: "#27ae60" }}>✓ {d.completados} completado{d.completados !== 1 ? "s" : ""}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PANEL DE AGENDA (sidebar para áreas 12, 13, 14, 15, 16) ─────────────────
export function PanelAgenda({ traslados, setTraslados, editable }) {
  const [colapsado, setColapsado] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(null);

  const conteos = ESTATUSES.reduce((acc, e) => {
    acc[e.valor] = traslados.filter(t => t.estatus === e.valor).length;
    return acc;
  }, {});

  const abrirEditar = (t) => {
    setForm({ escritura: t.escritura, expediente: t.expediente, abogado: t.abogado, municipio: t.municipio, estatus: t.estatus, observaciones: t.observaciones, fechaIngreso: t.fechaIngreso });
    setEditandoId(t.id);
  };

  const guardar = () => {
    setTraslados(ts => ts.map(t => t.id === editandoId ? { ...t, ...form } : t));
    setEditandoId(null); setForm(null);
  };

  const cambioRapidoEstatus = (id, nuevoEstatus) => {
    setTraslados(ts => ts.map(t => t.id === id ? { ...t, estatus: nuevoEstatus } : t));
  };

  if (colapsado) {
    return (
      <button onClick={() => setColapsado(false)} style={{ ...BTNR, writingMode: "vertical-rl", textOrientation: "mixed", padding: "16px 10px", height: 200 }}>
        📅 Agenda →
      </button>
    );
  }

  return (
    <div style={{ width: 320, flexShrink: 0, background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(13,27,75,0.08)", overflow: "hidden", alignSelf: "flex-start" }}>
      <div style={{ background: "#0D1B4B", color: "#fff", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>📅 Agenda — Traslado de Dominio</span>
        <button onClick={() => setColapsado(true)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, opacity: 0.8 }} title="Ocultar panel">«</button>
      </div>

      {!editable && (
        <div style={{ padding: "8px 16px", background: "#fef9ec", color: "#8a6d1a", fontSize: 12, borderBottom: "1px solid #f0e8d0" }}>
          👁 Solo lectura — edición exclusiva del área 12
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "12px 16px", borderBottom: "1px solid #f0f2f8" }}>
        {ESTATUSES.map(e => (
          <span key={e.valor} style={{ background: e.bg, color: e.color, borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 600 }}>
            {conteos[e.valor] || 0} {e.label}
          </span>
        ))}
      </div>

      <div style={{ maxHeight: 460, overflowY: "auto" }}>
        {traslados.map(t => {
          const est = estatusInfo(t.estatus);
          const editandoEste = editandoId === t.id;
          return (
            <div key={t.id} style={{ padding: "12px 16px", borderBottom: "1px solid #f4f6fb" }}>
              {editandoEste && editable ? (
                <div>
                  <div style={{ fontWeight: 700, color: "#0D1B4B", fontSize: 13, marginBottom: 6 }}>
                    Escritura {t.escritura} · Exp. {t.expediente}
                  </div>
                  <select value={form.estatus} onChange={e => setForm(f => ({ ...f, estatus: e.target.value }))} style={{ ...IN, marginTop: 0, fontSize: 12, padding: "6px 10px" }}>
                    {ESTATUSES.map(e => <option key={e.valor} value={e.valor}>{e.label}</option>)}
                  </select>
                  <textarea value={form.observaciones} onChange={e => setForm(f => ({ ...f, observaciones: e.target.value }))} placeholder="Observaciones..." rows={2}
                    style={{ ...IN, marginTop: 6, fontSize: 12, padding: "6px 10px", resize: "vertical" }} />
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <button onClick={guardar} style={{ ...BTNAC("#1a5fa3"), background: "#eaf3fb" }}>Guardar</button>
                    <button onClick={() => { setEditandoId(null); setForm(null); }} style={BTNAC("#888")}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div onClick={() => editable && abrirEditar(t)} style={{ cursor: editable ? "pointer" : "default" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: "#0D1B4B", fontSize: 13 }}>Esc. {t.escritura}</span>
                    {editable ? (
                      <select value={t.estatus} onChange={e => { e.stopPropagation(); cambioRapidoEstatus(t.id, e.target.value); }} onClick={e => e.stopPropagation()}
                        style={{ border: `1.5px solid ${est.color}`, background: est.bg, color: est.color, borderRadius: 6, padding: "1px 6px", fontSize: 10, fontWeight: 600, cursor: "pointer", outline: "none" }}>
                        {ESTATUSES.map(e => <option key={e.valor} value={e.valor}>{e.label}</option>)}
                      </select>
                    ) : (
                      <span style={{ background: est.bg, color: est.color, borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>{est.label}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7a9d" }}>Exp. {t.expediente} · {t.municipio}</div>
                  <div style={{ fontSize: 11, color: "#9aa3be", marginTop: 2 }}>
                    <span style={{ background: "#eef2fb", color: "#3a4f8a", borderRadius: 5, padding: "1px 6px", fontWeight: 600 }}>{t.abogado}</span>
                    {t.observaciones && <span style={{ marginLeft: 6 }}>📝 {t.observaciones}</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── HEADER COMPARTIDO ────────────────────────────────────────────────────────
export function AdminPanel({ usuarios, setUsuarios, sesion, onBack, onLogout, logoUrl, hs }) {
  const [tab, setTab]           = useState("usuarios");
  const [editando, setEditando] = useState(null);
  const [nuevo, setNuevo]       = useState(false);
  const [form, setForm]         = useState(fv());
  const [confirmDel, setConfirmDel] = useState(null);

  function fv() { return { usuario: "", password: "", nombre: "", area: "", rol: "usuario", permisos: [], verHistorial: false }; }

  const guardar = () => {
    if (!form.usuario || !form.password || !form.nombre) return;
    if (editando !== null) setUsuarios(us => us.map(u => u.id === editando ? { ...u, ...form } : u));
    else { const nid = Math.max(...usuarios.map(u => u.id)) + 1; setUsuarios(us => [...us, { id: nid, ...form }]); }
    setEditando(null); setNuevo(false); setForm(fv());
  };

  const eliminar = (id) => { if (id === sesion.id) return; setUsuarios(us => us.filter(u => u.id !== id)); setConfirmDel(null); };
  const abrirEditar = (u) => { setForm({ usuario: u.usuario, password: u.password, nombre: u.nombre, area: u.area, rol: u.rol, permisos: [...u.permisos], verHistorial: u.verHistorial || false }); setEditando(u.id); setNuevo(false); };
  const toggleP = (aId) => setForm(f => ({ ...f, permisos: f.permisos.includes(aId) ? f.permisos.filter(p => p !== aId) : [...f.permisos, aId] }));
  const cerrar = () => { setEditando(null); setNuevo(false); setForm(fv()); };

  return (
    <div style={hs.wrap}>
      <header style={hs.header}>
        <img src={logoUrl} alt="Notaría 168" style={hs.logoImg} onError={e => e.target.style.display = "none"} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ ...hs.areaBadge, background: "rgba(255,215,0,0.22)" }}>⚙ Panel de Administración</span>
          <button style={hs.logoutBtn} onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>
      <div style={hs.content}>
        <button onClick={onBack} style={BTNR}>← Regresar al menú</button>
        <div style={{ background: "#fff", borderRadius: 20, padding: "32px", boxShadow: "0 4px 24px rgba(13,27,75,0.08)", marginTop: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0D1B4B", margin: "0 0 24px" }}>Administración de usuarios y permisos</h2>
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            {[["usuarios", "👥 Usuarios"], ["permisos", "🔐 Permisos"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{ padding: "8px 20px", borderRadius: 10, border: "1.5px solid", borderColor: tab === k ? "#0D1B4B" : "#dde2ef", background: tab === k ? "#0D1B4B" : "#fff", color: tab === k ? "#fff" : "#0D1B4B", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>{l}</button>
            ))}
          </div>

          {tab === "usuarios" && (
            <>
              <button onClick={() => { setNuevo(true); setEditando(null); setForm(fv()); }} style={{ ...BTNP, width: "auto", padding: "10px 20px", fontSize: 14, marginTop: 0 }}>+ Nuevo usuario</button>
              {(nuevo || editando !== null) && (
                <div style={{ background: "#f8f9fc", border: "1.5px solid #e0e6f0", borderRadius: 14, padding: 24, marginTop: 20 }}>
                  <h3 style={{ margin: "0 0 16px", color: "#0D1B4B", fontSize: 15 }}>{editando !== null ? "Editar usuario" : "Nuevo usuario"}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {[["Usuario", "usuario", "text"], ["Contraseña", "password", "password"], ["Nombre completo", "nombre", "text"], ["Área asignada", "area", "text"]].map(([label, key, type]) => (
                      <label key={key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ fontSize: 12, color: "#6b7a9d", fontWeight: 600 }}>{label}</span>
                        <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ ...IN, marginTop: 0 }} />
                      </label>
                    ))}
                    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ fontSize: 12, color: "#6b7a9d", fontWeight: 600 }}>Rol</span>
                      <select value={form.rol} onChange={e => { const r = e.target.value; setForm(f => ({ ...f, rol: r, permisos: r === "admin" ? AREAS.map(a => a.id) : f.permisos })); }} style={{ ...IN, marginTop: 0 }}>
                        <option value="usuario">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </label>
                  </div>
                  <p style={{ fontSize: 12, color: "#6b7a9d", fontWeight: 600, margin: "16px 0 10px" }}>Permisos de edición por área:</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                    {AREAS.map(area => (
                      <label key={area.id} style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: `1px solid ${form.permisos.includes(area.id) ? "#0D1B4B" : "#e0e6f0"}`, borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontSize: 13 }}>
                        <input type="checkbox" checked={form.permisos.includes(area.id)} onChange={() => toggleP(area.id)} disabled={form.rol === "admin"} />
                        {area.icono} {area.nombre}
                      </label>
                    ))}
                  </div>

                  {/* PERMISO HISTORIAL */}
                  <div style={{ marginTop: 14, padding: "12px 16px", background: "#fef9ec", border: "1.5px solid #f0d98c", borderRadius: 10 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                      <input type="checkbox"
                        checked={form.rol === "admin" || form.verHistorial}
                        disabled={form.rol === "admin"}
                        onChange={e => setForm(f => ({ ...f, verHistorial: e.target.checked }))}
                        style={{ width: 16, height: 16 }}
                      />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#8a6d1a" }}>
                        🕓 Ver historial de modificaciones en expedientes
                      </span>
                    </label>
                    <p style={{ fontSize: 11, color: "#8a6d1a", margin: "4px 0 0 26px" }}>
                      Permite ver el historial completo de cambios en cada expediente. Los administradores siempre tienen este permiso.
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                    <button onClick={guardar} style={{ ...BTNP, width: "auto", padding: "10px 24px", fontSize: 14, marginTop: 0 }}>{editando !== null ? "Guardar cambios" : "Crear usuario"}</button>
                    <button onClick={cerrar} style={{ ...BTNP, width: "auto", padding: "10px 24px", fontSize: 14, marginTop: 0, background: "#fff", color: "#0D1B4B", border: "1.5px solid #dde2ef" }}>Cancelar</button>
                  </div>
                </div>
              )}
              <div style={{ marginTop: 24, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "#f4f6fb" }}>
                      {["#", "Usuario", "Nombre", "Área", "Rol", "Áreas con edición", "Historial", "Acciones"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#6b7a9d", fontWeight: 600, fontSize: 12, borderBottom: "1.5px solid #e0e6f0" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(u => (
                      <tr key={u.id} style={{ borderBottom: "1px solid #f0f2f8" }}>
                        <td style={TD}>{u.id}</td>
                        <td style={{ ...TD, fontWeight: 600 }}>{u.usuario}</td>
                        <td style={TD}>{u.nombre}</td>
                        <td style={TD}>{u.area}</td>
                        <td style={TD}><span style={{ background: u.rol === "admin" ? "#fef9ec" : "#f0f7ff", color: u.rol === "admin" ? "#8a6d1a" : "#1a5fa3", borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{u.rol === "admin" ? "⚙ Admin" : "👤 Usuario"}</span></td>
                        <td style={TD}><span style={{ fontSize: 12, color: "#6b7a9d" }}>{u.permisos.length === AREAS.length ? "Todas" : `${u.permisos.length} área(s)`}</span></td>
                        <td style={TD}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: (u.rol === "admin" || u.verHistorial) ? "#8a6d1a" : "#c8d0e4" }}>
                            {(u.rol === "admin" || u.verHistorial) ? "🕓 Sí" : "—"}
                          </span>
                        </td>
                        <td style={TD}>
                          <button onClick={() => abrirEditar(u)} style={BTNAC("#1a5fa3")}>Editar</button>
                          {u.id !== sesion.id && (
                            confirmDel === u.id
                              ? <><button onClick={() => eliminar(u.id)} style={BTNAC("#c0392b")}>Confirmar</button><button onClick={() => setConfirmDel(null)} style={BTNAC("#888")}>Cancelar</button></>
                              : <button onClick={() => setConfirmDel(u.id)} style={BTNAC("#c0392b")}>Eliminar</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === "permisos" && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={{ ...TD, minWidth: 160, textAlign: "left", background: "#f4f6fb", borderBottom: "1.5px solid #e0e6f0" }}>Área</th>
                    {usuarios.map(u => <th key={u.id} style={{ ...TD, textAlign: "center", background: "#f4f6fb", borderBottom: "1.5px solid #e0e6f0", minWidth: 80 }}><div style={{ fontWeight: 600 }}>{u.usuario}</div></th>)}
                  </tr>
                </thead>
                <tbody>
                  {AREAS.map(area => (
                    <tr key={area.id} style={{ borderBottom: "1px solid #f0f2f8" }}>
                      <td style={{ ...TD, fontWeight: 500 }}>{area.icono} {area.nombre}</td>
                      {usuarios.map(u => <td key={u.id} style={{ ...TD, textAlign: "center" }}>{u.permisos.includes(area.id) ? <span style={{ color: "#27ae60", fontSize: 18 }}>✓</span> : <span style={{ color: "#dde2ef" }}>–</span>}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TOKENS ───────────────────────────────────────────────────────────────────
export const IN = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #dde2ef", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginTop: 4 };
export const BTNP = { display: "block", width: "100%", padding: "12px", background: "#0D1B4B", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 18 };
export const BTNR = { background: "#fff", border: "1.5px solid #dde2ef", color: "#0D1B4B", borderRadius: 10, padding: "8px 20px", cursor: "pointer", fontSize: 14, fontWeight: 600 };
export const TD = { padding: "10px 14px", color: "#2d3a5e" };
export const LBL = { fontSize: 14, fontWeight: 600, color: "#3a4560" };
export const IN0 = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #dde2ef", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fbfcfe" };
export const BTNAC = (color) => ({ background: "none", border: `1px solid ${color}`, color, borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: 12, marginRight: 6, fontWeight: 500 });
export const cardMetrica = (bg, color) => ({ background: bg, borderRadius: 12, padding: "14px 16px", cursor: "pointer", border: `1.5px solid ${color}22`, textAlign: "center", color });

