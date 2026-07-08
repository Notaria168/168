import React, { useState, useRef, useEffect } from "react";
import React, { useState, useRef, useEffect } from "react";

export const LOGO_URL = "/mnt/user-data/uploads/LOGO_NOTARIA168_OFICAL__trasnparente-Horizontal_.png";

export const AREAS = [
  { id: 1,  nombre: "Registro de Expedientes",    icono: "📁" },
  { id: 2,  nombre: "Previos",                    icono: "🔍" },
  { id: 3,  nombre: "Gestoría",                   icono: "📋" },
  { id: 4,  nombre: "Proyectos",                  icono: "📐" },
  { id: 5,  nombre: "Revisores 1",                icono: "✏️" },
  { id: 6,  nombre: "Revisores 2",                icono: "✅" },
  { id: 7,  nombre: "Cotización Escritura",       icono: "💰" },
  { id: 8,  nombre: "Pase a Folio 1",             icono: "📄" },
  { id: 9,  nombre: "Pase a Folio 2",             icono: "📑" },
  { id: 10, nombre: "Firma de la Escritura",      icono: "🖊️" },
  { id: 11, nombre: "Cierre de Folio",            icono: "🔒" },
  { id: 12, nombre: "Traslado de Dominio",        icono: "🏠" },
  { id: 13, nombre: "Cierre de Apéndice Completo",icono: "📦" },
  { id: 14, nombre: "Expedición",                 icono: "📮" },
  { id: 15, nombre: "Registro Público",           icono: "🏛️" },
  { id: 16, nombre: "Entrega al Cliente",         icono: "🤝" },
  { id: 17, nombre: "Avisos",                     icono: "🔔" },
];

export const TRASLADOS_INICIALES = [
  // ── Traslados de la agenda semanal (datos reales del archivo) ──────────────
  { id: 1,  escritura: "24213", expediente: "606-2025",   abogado: "JOR",  municipio: "Acapulco",       estatus: "pendiente",  observaciones: "", fechaIngreso: "" },
  { id: 2,  escritura: "25473", expediente: "43-2026",    abogado: "FAV",  municipio: "Nezahualcoyotl", estatus: "pendiente",  observaciones: "", fechaIngreso: "" },
  { id: 3,  escritura: "25451", expediente: "2199-2025",  abogado: "CET",  municipio: "Huixquilucan",   estatus: "pendiente",  observaciones: "", fechaIngreso: "" },
  { id: 4,  escritura: "25570", expediente: "2191-2026",  abogado: "ROR",  municipio: "Huixquilucan",   estatus: "pendiente",  observaciones: "", fechaIngreso: "" },
  { id: 5,  escritura: "25437", expediente: "2369-2026",  abogado: "ERH",  municipio: "Huixquilucan",   estatus: "pendiente",  observaciones: "", fechaIngreso: "" },
  { id: 6,  escritura: "25158", expediente: "2198-2026",  abogado: "MALO", municipio: "Coacalco",       estatus: "pendiente",  observaciones: "", fechaIngreso: "" },
  { id: 7,  escritura: "25276", expediente: "2654-2025",  abogado: "MALO", municipio: "Cuautitlán",     estatus: "pendiente",  observaciones: "", fechaIngreso: "" },
  { id: 8,  escritura: "24555", expediente: "2159-2026",  abogado: "EGR",  municipio: "Atizapán",       estatus: "pendiente",  observaciones: "", fechaIngreso: "" },
  { id: 9,  escritura: "24213", expediente: "1606-2025",  abogado: "JOR",  municipio: "Acapulco",       estatus: "pendiente",  observaciones: "", fechaIngreso: "" },
  { id: 10, escritura: "24472", expediente: "2947-2025",  abogado: "CET",  municipio: "Huixquilucan",   estatus: "pendiente",  observaciones: "", fechaIngreso: "" },
  { id: 11, escritura: "24995", expediente: "2571-2025",  abogado: "EGR",  municipio: "Naucalpan",      estatus: "pendiente",  observaciones: "", fechaIngreso: "" },
  { id: 12, escritura: "25096", expediente: "176-2026",   abogado: "EGR",  municipio: "Ecatepec",       estatus: "pendiente",  observaciones: "", fechaIngreso: "" },
  { id: 13, escritura: "14190", expediente: "2634-2025",  abogado: "JOR",  municipio: "Ecatepec",       estatus: "pendiente",  observaciones: "", fechaIngreso: "" },
  { id: 14, escritura: "25366", expediente: "2353-2026",  abogado: "EGR",  municipio: "Cuautitlán",     estatus: "pendiente",  observaciones: "", fechaIngreso: "" },
  { id: 15, escritura: "24358", expediente: "2632-2025",  abogado: "EGR",  municipio: "Atizapán",       estatus: "pendiente",  observaciones: "", fechaIngreso: "" },
  // ── Expedientes de ejemplo (flujo completo 1-2026 al 5-2026) ───────────────
  { id: 16, escritura: "24001", expediente: "1-2026", abogado: "CET",  municipio: "Atizapán de Zaragoza", estatus: "completado", observaciones: "Ingresado y completado sin observaciones.", fechaIngreso: "2026-02-10" },
  { id: 17, escritura: "24002", expediente: "2-2026", abogado: "JOR",  municipio: "Naucalpan",            estatus: "completado", observaciones: "Traslado pagado. Registro exitoso.",         fechaIngreso: "2026-02-18" },
  { id: 18, escritura: "24003", expediente: "3-2026", abogado: "EGR",  municipio: "Tlalnepantla",         estatus: "ingresado",  observaciones: "Ingresado al Registro Público el 03-03-26.", fechaIngreso: "2026-03-03" },
  { id: 19, escritura: "24004", expediente: "4-2026", abogado: "FAV",  municipio: "Cuautitlán Izcalli",   estatus: "en_proceso", observaciones: "En trámite. Esperando acuse de recibo.",     fechaIngreso: "2026-03-12" },
  { id: 20, escritura: "24005", expediente: "5-2026", abogado: "JCRR", municipio: "Huixquilucan",         estatus: "pendiente",  observaciones: "Falta pago Infonavit $240,000.",             fechaIngreso: "" },
];

export const USUARIOS_INICIALES = [
  { id: 1, usuario: "admin",    password: "admin168", nombre: "Administrador",    area: "Administración",          rol: "admin",   permisos: AREAS.map(a => a.id), verHistorial: true  },
  { id: 2, usuario: "recepcion",password: "rec123",   nombre: "Recepción General",area: "Registro de Expedientes", rol: "usuario", permisos: [1],       verHistorial: false },
  { id: 3, usuario: "revisora1",password: "rev123",   nombre: "María López",      area: "Revisores 1",             rol: "usuario", permisos: [5, 6],    verHistorial: false },
  { id: 4, usuario: "traslados",password: "tras168",  nombre: "Gestor Traslados", area: "Traslado de Dominio",     rol: "usuario", permisos: [12],      verHistorial: false },
  { id: 5, usuario: "folio1",   password: "folio168", nombre: "Encargado Folio 1",area: "Pase a Folio 1",          rol: "usuario", permisos: [1, 8],    verHistorial: false },
  { id: 6, usuario: "folio2",   password: "folio268", nombre: "Encargado Folio 2",area: "Pase a Folio 2",          rol: "usuario", permisos: [1, 9],    verHistorial: false },
  { id: 7, usuario: "previos",  password: "prev168",  nombre: "Encargado Previos",  area: "Previos",   rol: "usuario", permisos: [1, 2], verHistorial: false },
  { id: 8, usuario: "proyectos",password: "proy168",  nombre: "Encargado Proyectos",area: "Proyectos", rol: "usuario", permisos: [1, 4], verHistorial: false },
];

export const ESTATUSES = [
  { valor: "pendiente",  label: "Pendiente",   color: "#e67e22", bg: "#fef5ec" },
  { valor: "en_proceso", label: "En proceso",  color: "#2980b9", bg: "#eaf3fb" },
  { valor: "ingresado",  label: "Ingresado",   color: "#8e44ad", bg: "#f5eefb" },
  { valor: "completado", label: "Completado",  color: "#27ae60", bg: "#eafaf1" },
  { valor: "devuelto",   label: "Devuelto",    color: "#c0392b", bg: "#fdf0f0" },
];

export function estatusInfo(val) {
  return ESTATUSES.find(e => e.valor === val) || ESTATUSES[0];
}

// Áreas que muestran el panel de Agenda en el lado izquierdo (vista genérica)
// El área 12 (Traslado de Dominio) no la necesita aquí: su propia página YA es la gestión completa de la agenda.
export const AREAS_CON_AGENDA = [13, 14, 15, 16, 17];
// Área que puede editar la Agenda (las demás solo la ven)
export const AREA_EDITA_AGENDA = 12;

// ─── ABOGADOS (catálogo) ──────────────────────────────────────────────────────
export const ABOGADOS = [
  "CET", "DFC", "EALR", "ECGR", "EGR", "ERH", "FAV", "GADS", "GBC", "GRGO",
  "HRB", "HVR", "IGG", "JCOR", "JCRR", "JDRR", "JLF", "JLTC", "JOR", "JPSS",
  "KRD", "LIO", "LOFR", "LSS", "MALO", "MBGC", "MCC", "MCHA", "MDHP", "MICL",
  "MLO", "MMCC", "MSH", "ORJC", "PZG", "RCP", "ROR", "RSMT", "RUV", "SVG", "VAG",
];

// ─── BANCOS DE MÉXICO (catálogo) ──────────────────────────────────────────────
export const BANCOS_MEXICO = [
  "BBVA México", "Banorte", "Santander", "Citibanamex", "HSBC México",
  "Scotiabank", "Banco Azteca", "Inbursa", "Banco del Bajío (BanBajío)",
  "Banregio", "Multiva", "Banco Ahorro Famsa", "Afirme", "Banca Mifel",
  "Banco Invex", "Banco Ve por Más (BX+)", "CIBanco", "Banco Ripley",
  "Banco ABC Capital", "Banco ICBC", "Banco ConSubsidio", "Bansí",
  "Banco Ahorro Coppel (BanCoppel)", "Banco Compartamos", "Banco Actinver",
  "Banco Sabadell", "Banco JP Morgan", "Banco Monex", "Banco Autofin",
  "Banco Forjadores", "Banco Finterra", "Banco S3", "Banco Bancrea",
  "Banco Multibank", "Nu México", "Banco Pagatodo",
];

// ─── EXPEDIENTES (Área 1 — Registro de Expedientes) ──────────────────────────
export const EXPEDIENTES_INICIALES = [
  {
    id: 1, consecutivo: 1, anio: 2026, expediente: "1-2026",
    abogado: "CET", nombre: "Vanessa Paolete Rivera Ronquillo",
    operacion: "Compraventa y Apertura de Crédito",
    banco: "Santander", montoUIF: "2850000",
    estatus: "apertura", fechaApertura: "2026-01-05",
    registradoPor: "Recepción General",
    comentarios: [
      { id: 1, texto: "Expediente abierto. Cliente entregó documentación completa.", usuario: "Recepción General", fecha: "05/01/2026", hora: "09:15" },
      { id: 2, texto: "Previos ingresados a catastro y predial.", usuario: "Encargado Previos", fecha: "08/01/2026", hora: "11:30" },
    ],
    historial: [
      { campo: "estatus", valorAnterior: "—", valorNuevo: "apertura", usuario: "Recepción General", fecha: "05/01/2026", hora: "09:15" },
    ],
  },
  {
    id: 2, consecutivo: 2, anio: 2026, expediente: "2-2026",
    abogado: "JOR", nombre: "Federico Moreno Juárez",
    operacion: "Compraventa",
    banco: "BBVA México", montoUIF: "1750000",
    estatus: "apertura", fechaApertura: "2026-01-07",
    registradoPor: "Recepción General",
    comentarios: [
      { id: 1, texto: "Cliente tramitó agua directamente. Confirmar entrega.", usuario: "Encargado Previos", fecha: "10/01/2026", hora: "10:00" },
    ],
    historial: [
      { campo: "estatus", valorAnterior: "—", valorNuevo: "apertura", usuario: "Recepción General", fecha: "07/01/2026", hora: "10:20" },
    ],
  },
  {
    id: 3, consecutivo: 3, anio: 2026, expediente: "3-2026",
    abogado: "EGR", nombre: "Lizbeth Barajas González",
    operacion: "Compraventa y Apertura de Crédito",
    banco: "Infonavit", montoUIF: "920000",
    estatus: "apertura", fechaApertura: "2026-01-12",
    registradoPor: "Recepción General",
    comentarios: [
      { id: 1, texto: "Falta pago Infonavit $150,596. Abogado notificado.", usuario: "Encargado Folio 1", fecha: "14/02/2026", hora: "14:45" },
      { id: 2, texto: "Agua y zonificación pendientes de entrega.", usuario: "Encargado Previos", fecha: "17/01/2026", hora: "09:00" },
    ],
    historial: [
      { campo: "estatus", valorAnterior: "—", valorNuevo: "apertura", usuario: "Recepción General", fecha: "12/01/2026", hora: "08:50" },
    ],
  },
  {
    id: 4, consecutivo: 4, anio: 2026, expediente: "4-2026",
    abogado: "FAV", nombre: "Leticia Huerta Villafuerte",
    operacion: "Compraventa y Apertura de Crédito",
    banco: "Scotiabank", montoUIF: "1320000",
    estatus: "apertura", fechaApertura: "2026-01-20",
    registradoPor: "Recepción General",
    comentarios: [
      { id: 1, texto: "Broker Quiero Casa tramitó todos los previos.", usuario: "Encargado Previos", fecha: "21/01/2026", hora: "12:10" },
    ],
    historial: [
      { campo: "estatus", valorAnterior: "—", valorNuevo: "apertura", usuario: "Recepción General", fecha: "20/01/2026", hora: "09:30" },
    ],
  },
  {
    id: 5, consecutivo: 5, anio: 2026, expediente: "5-2026",
    abogado: "JCRR", nombre: "Ángel Maldonado Salgado",
    operacion: "Compraventa y Apertura de Crédito",
    banco: "Santander", montoUIF: "2100000",
    estatus: "apertura", fechaApertura: "2026-01-25",
    registradoPor: "Recepción General",
    comentarios: [
      { id: 1, texto: "Falta pago Infonavit $240,000. En espera de liquidación.", usuario: "Encargado Folio 1", fecha: "03/03/2026", hora: "16:00" },
    ],
    historial: [
      { campo: "estatus", valorAnterior: "—", valorNuevo: "apertura", usuario: "Recepción General", fecha: "25/01/2026", hora: "10:05" },
    ],
  },
];

export const ESTATUS_EXPEDIENTE = [
  { valor: "apertura",   label: "Apertura de expediente", color: "#16a085", bg: "#e8f8f3" },
  { valor: "proceso",    label: "En proceso",             color: "#2980b9", bg: "#eaf3fb" },
  { valor: "cerrado",    label: "Cerrado",                color: "#7f8c8d", bg: "#f1f2f2" },
];

// ─── PASE A FOLIO (Áreas 8 y 9) ───────────────────────────────────────────────
export const PASES_FOLIO_INICIALES = [
  {
    id: 1, fechaPase: "2026-01-28", expediente: "1-2026", escritura: "24001",
    abogado: "CET", nombreCliente: "Vanessa Paolete Rivera Ronquillo",
    operacion: "Compraventa y Apertura de Crédito", banco: "Santander",
    noCreditoInfonavit: "", municipio: "Atizapán de Zaragoza",
    montoOperacion: "2850000", honorarios: "120000", ivaHonorarios: "19200", totalHonorarios: "139200",
    gastosTotales: "45000",
    traslado: "85500", fechaPagoTraslado: "2026-01-27", montoPagadoTraslado: "85500", noChequeTraslado: "CH-10021",
    dictamenImpuestos: "DI-2026-001", drpp: "12400", fechaPagoDerechos: "2026-01-27", lineaCaptura: "LC-884521", montoPagadoRPP: "12400", dictamenesRPP: "DR-001",
    isr: "0", montoPagadoISR: "0", fechaPagoISR: "",
    iva: "0", montoPagadoIVA: "0",
    nombreBroker: "", montoBroker: "", pagoBroker: "", fechaPagoBroker: "",
    totalEscritura: "284100", facturaExpediente: "A-4251", metodoPago: "PUE", complementoPago: "", formaPago: "Transferencia",
    efectivos: "0", fechaPagoEfectivo: "", fechaDepositoBanco: "2026-01-28", montoDepositado: "284100", bancoDeposito: "Santander",
    observaciones: "Expediente sin adeudo Infonavit.", registradoPor: "Encargado Folio 1",
  },
  {
    id: 2, fechaPase: "2026-02-05", expediente: "2-2026", escritura: "24002",
    abogado: "JOR", nombreCliente: "Federico Moreno Juárez",
    operacion: "Compraventa", banco: "BBVA México",
    noCreditoInfonavit: "", municipio: "Naucalpan",
    montoOperacion: "1750000", honorarios: "57000", ivaHonorarios: "9120", totalHonorarios: "66120",
    gastosTotales: "22000",
    traslado: "52500", fechaPagoTraslado: "2026-02-04", montoPagadoTraslado: "52500", noChequeTraslado: "CH-10035",
    dictamenImpuestos: "DI-2026-002", drpp: "8900", fechaPagoDerechos: "2026-02-04", lineaCaptura: "LC-889203", montoPagadoRPP: "8900", dictamenesRPP: "DR-002",
    isr: "35000", montoPagadoISR: "35000", fechaPagoISR: "2026-02-03",
    iva: "0", montoPagadoIVA: "0",
    nombreBroker: "Inmobiliaria Del Valle", montoBroker: "17500", pagoBroker: "Transferencia", fechaPagoBroker: "2026-02-01",
    totalEscritura: "204020", facturaExpediente: "A-4267", metodoPago: "PUE", complementoPago: "", formaPago: "Transferencia",
    efectivos: "0", fechaPagoEfectivo: "", fechaDepositoBanco: "2026-02-05", montoDepositado: "204020", bancoDeposito: "BBVA México",
    observaciones: "ISR retenido correctamente. Sin adeudos.", registradoPor: "Encargado Folio 1",
  },
  {
    id: 3, fechaPase: "2026-02-14", expediente: "3-2026", escritura: "24003",
    abogado: "EGR", nombreCliente: "Lizbeth Barajas González",
    operacion: "Compraventa y Apertura de Crédito", banco: "Infonavit",
    noCreditoInfonavit: "1526046876", municipio: "Tlalnepantla",
    montoOperacion: "920000", honorarios: "65000", ivaHonorarios: "10400", totalHonorarios: "75400",
    gastosTotales: "18500",
    traslado: "27600", fechaPagoTraslado: "2026-02-12", montoPagadoTraslado: "27600", noChequeTraslado: "",
    dictamenImpuestos: "DI-2026-003", drpp: "7200", fechaPagoDerechos: "2026-02-12", lineaCaptura: "LC-892441", montoPagadoRPP: "7200", dictamenesRPP: "DR-003",
    isr: "0", montoPagadoISR: "0", fechaPagoISR: "",
    iva: "0", montoPagadoIVA: "0",
    nombreBroker: "", montoBroker: "", pagoBroker: "", fechaPagoBroker: "",
    totalEscritura: "128700", facturaExpediente: "A-4278", metodoPago: "PUE", complementoPago: "", formaPago: "Transferencia",
    efectivos: "0", fechaPagoEfectivo: "", fechaDepositoBanco: "2026-02-14", montoDepositado: "128700", bancoDeposito: "Infonavit",
    observaciones: "Falta pago Infonavit $150,596.00 — pendiente de liquidar.", registradoPor: "Encargado Folio 1",
  },
  {
    id: 4, fechaPase: "2026-02-20", expediente: "4-2026", escritura: "24004",
    abogado: "FAV", nombreCliente: "Leticia Huerta Villafuerte",
    operacion: "Compraventa y Apertura de Crédito", banco: "Scotiabank",
    noCreditoInfonavit: "", municipio: "Cuautitlán Izcalli",
    montoOperacion: "1320000", honorarios: "80000", ivaHonorarios: "12800", totalHonorarios: "92800",
    gastosTotales: "30000",
    traslado: "39600", fechaPagoTraslado: "2026-02-19", montoPagadoTraslado: "39600", noChequeTraslado: "CH-10048",
    dictamenImpuestos: "DI-2026-004", drpp: "9800", fechaPagoDerechos: "2026-02-19", lineaCaptura: "LC-895020", montoPagadoRPP: "9800", dictamenesRPP: "DR-004",
    isr: "0", montoPagadoISR: "0", fechaPagoISR: "",
    iva: "0", montoPagadoIVA: "0",
    nombreBroker: "Quiero Casa", montoBroker: "13200", pagoBroker: "Transferencia", fechaPagoBroker: "2026-02-18",
    totalEscritura: "185400", facturaExpediente: "A-4293", metodoPago: "PUE", complementoPago: "", formaPago: "Transferencia",
    efectivos: "0", fechaPagoEfectivo: "", fechaDepositoBanco: "2026-02-20", montoDepositado: "185400", bancoDeposito: "Scotiabank",
    observaciones: "Broker tramitó los previos directamente.", registradoPor: "Encargado Folio 1",
  },
  {
    id: 5, fechaPase: "2026-03-03", expediente: "5-2026", escritura: "24005",
    abogado: "JCRR", nombreCliente: "Ángel Maldonado Salgado",
    operacion: "Compraventa y Apertura de Crédito", banco: "Santander",
    noCreditoInfonavit: "152604444", municipio: "Huixquilucan",
    montoOperacion: "2100000", honorarios: "130000", ivaHonorarios: "20800", totalHonorarios: "150800",
    gastosTotales: "52000",
    traslado: "63000", fechaPagoTraslado: "2026-03-02", montoPagadoTraslado: "63000", noChequeTraslado: "CH-10059",
    dictamenImpuestos: "DI-2026-005", drpp: "14200", fechaPagoDerechos: "2026-03-02", lineaCaptura: "LC-901337", montoPagadoRPP: "14200", dictamenesRPP: "DR-005",
    isr: "0", montoPagadoISR: "0", fechaPagoISR: "",
    iva: "0", montoPagadoIVA: "0",
    nombreBroker: "", montoBroker: "", pagoBroker: "", fechaPagoBroker: "",
    totalEscritura: "280000", facturaExpediente: "A-4309", metodoPago: "PUE", complementoPago: "", formaPago: "Transferencia",
    efectivos: "0", fechaPagoEfectivo: "", fechaDepositoBanco: "2026-03-03", montoDepositado: "280000", bancoDeposito: "Santander",
    observaciones: "Falta pago Infonavit $240,000.00.", registradoPor: "Encargado Folio 1",
  },
];

// Área 9 — Pase a Folio 2: escritura/exp/volumen/abogado/banco/municipio
// Esta escritura, una vez creada aquí, queda disponible para autocompletar el área 8
export const PASES_FOLIO2_INICIALES = [
  { id: 1, folio: "F-001", pase: "P-001", escritura: "24001", fecha: "2026-01-15", expediente: "1-2026", volumen: "V-2026-I",  abogado: "CET",  banco: "Santander",    municipio: "Atizapán de Zaragoza", registradoPor: "Encargado Folio 2" },
  { id: 2, folio: "F-002", pase: "P-002", escritura: "24002", fecha: "2026-01-22", expediente: "2-2026", volumen: "V-2026-I",  abogado: "JOR",  banco: "BBVA México",  municipio: "Naucalpan",            registradoPor: "Encargado Folio 2" },
  { id: 3, folio: "F-003", pase: "P-003", escritura: "24003", fecha: "2026-02-03", expediente: "3-2026", volumen: "V-2026-I",  abogado: "EGR",  banco: "Infonavit",    municipio: "Tlalnepantla",         registradoPor: "Encargado Folio 2" },
  { id: 4, folio: "F-004", pase: "P-004", escritura: "24004", fecha: "2026-02-10", expediente: "4-2026", volumen: "V-2026-II", abogado: "FAV",  banco: "Scotiabank",   municipio: "Cuautitlán Izcalli",   registradoPor: "Encargado Folio 2" },
  { id: 5, folio: "F-005", pase: "P-005", escritura: "24005", fecha: "2026-02-18", expediente: "5-2026", volumen: "V-2026-II", abogado: "JCRR", banco: "Santander",    municipio: "Huixquilucan",         registradoPor: "Encargado Folio 2" },
];

export const METODOS_PAGO_FOLIO = ["PUE", "PPD"];
export const FORMAS_PAGO_FOLIO = [
  "Transferencia", "Efectivo", "Depósito efectivo", "Depósito cheque",
  "Cheque", "Tarjeta crédito", "Tarjeta débito",
];

// ─── PREVIOS (Área 2) ──────────────────────────────────────────────────────────
export const PREVIOS_INICIALES = [
  {
    id: 1, expediente: "1-2026", fecha: "2026-01-06",
    abogado: "CET", nombreCliente: "Vanessa Paolete Rivera Ronquillo",
    operacion: "Compraventa y Apertura de Crédito", banco: "Santander",
    noCreditoInfonavit: "", municipio: "Atizapán de Zaragoza",
    catastroIngreso: "2026-01-08", catastroEntrega: "2026-01-14",
    mejorasIngreso: "2026-01-08", mejorasEntrega: "2026-01-14",
    predialIngreso: "2026-01-08", predialEntrega: "2026-01-14",
    aguaBimestre: "6to Bim", aguaIngreso: "2026-01-09", aguaEntrega: "2026-01-15",
    zonificacionBimestre: "1er Bim", zonificacionIngreso: "2026-01-10", zonificacionEntrega: "PENDIENTE",
    observaciones: "Todos los previos ingresados en tiempo. Zonificación pendiente de entrega.",
    fechaCreacion: "2026-01-06", registradoPor: "Encargado Previos",
  },
  {
    id: 2, expediente: "2-2026", fecha: "2026-01-08",
    abogado: "JOR", nombreCliente: "Federico Moreno Juárez",
    operacion: "Compraventa", banco: "BBVA México",
    noCreditoInfonavit: "", municipio: "Naucalpan",
    catastroIngreso: "2026-01-10", catastroEntrega: "2026-01-17",
    mejorasIngreso: "2026-01-10", mejorasEntrega: "2026-01-17",
    predialIngreso: "2026-01-10", predialEntrega: "2026-01-17",
    aguaBimestre: "6to Bim", aguaIngreso: "Tramitó cliente", aguaEntrega: "Tramitó cliente",
    zonificacionBimestre: "N/A", zonificacionIngreso: "N/A", zonificacionEntrega: "N/A",
    observaciones: "Cliente tramitó certificado de agua directamente.",
    fechaCreacion: "2026-01-08", registradoPor: "Encargado Previos",
  },
  {
    id: 3, expediente: "3-2026", fecha: "2026-01-13",
    abogado: "EGR", nombreCliente: "Lizbeth Barajas González",
    operacion: "Compraventa y Apertura de Crédito", banco: "Infonavit",
    noCreditoInfonavit: "1526046876", municipio: "Tlalnepantla",
    catastroIngreso: "2026-01-15", catastroEntrega: "2026-01-22",
    mejorasIngreso: "2026-01-15", mejorasEntrega: "2026-01-22",
    predialIngreso: "2026-01-15", predialEntrega: "2026-01-22",
    aguaBimestre: "6to Bim", aguaIngreso: "2026-01-15", aguaEntrega: "PENDIENTE",
    zonificacionBimestre: "1er Bim", zonificacionIngreso: "2026-01-16", zonificacionEntrega: "PENDIENTE",
    observaciones: "Agua y zonificación pendientes. Abogado informado por correo.",
    fechaCreacion: "2026-01-13", registradoPor: "Encargado Previos",
  },
  {
    id: 4, expediente: "4-2026", fecha: "2026-01-21",
    abogado: "FAV", nombreCliente: "Leticia Huerta Villafuerte",
    operacion: "Compraventa y Apertura de Crédito", banco: "Scotiabank",
    noCreditoInfonavit: "", municipio: "Cuautitlán Izcalli",
    catastroIngreso: "Tramitó cliente", catastroEntrega: "2026-02-05",
    mejorasIngreso: "Tramitó cliente", mejorasEntrega: "2026-02-05",
    predialIngreso: "Tramitó cliente", predialEntrega: "2026-02-05",
    aguaBimestre: "4to Bim", aguaIngreso: "Tramitó cliente", aguaEntrega: "2026-02-05",
    zonificacionBimestre: "No solicitado", zonificacionIngreso: "No hay, ni la solicitaron", zonificacionEntrega: "No hay, ni la solicitaron",
    observaciones: "Broker (Quiero Casa) tramitó todos los previos. Sin zonificación.",
    fechaCreacion: "2026-01-21", registradoPor: "Encargado Previos",
  },
  {
    id: 5, expediente: "5-2026", fecha: "2026-01-26",
    abogado: "JCRR", nombreCliente: "Ángel Maldonado Salgado",
    operacion: "Compraventa y Apertura de Crédito", banco: "Santander",
    noCreditoInfonavit: "152604444", municipio: "Huixquilucan",
    catastroIngreso: "2026-01-28", catastroEntrega: "2026-02-10",
    mejorasIngreso: "2026-01-28", mejorasEntrega: "2026-02-10",
    predialIngreso: "2026-01-28", predialEntrega: "2026-02-10",
    aguaBimestre: "6to Bim", aguaIngreso: "2026-01-29", aguaEntrega: "2026-02-14",
    zonificacionBimestre: "1er Bim", zonificacionIngreso: "2026-01-30", zonificacionEntrega: "PENDIENTE",
    observaciones: "Todos los previos completos salvo zonificación. Se entrega a gestor 10-02-26.",
    fechaCreacion: "2026-01-26", registradoPor: "Encargado Previos",
  },
];

export const BIMESTRES = [
  "1er Bim", "2do Bim", "3er Bim", "4to Bim", "5to Bim", "6to Bim",
  "N/A", "No solicitado", "Tramitó cliente",
];

// ─── OPERACIONES NOTARIALES (Estado de México) ───────────────────────────────
export const OPERACIONES_NOTARIALES = [
  "Aclaración de Escritura", "Acta de Notoriedad", "Acta Fuera de Protocolo",
  "Aceptación de Herencia", "Adjudicación por Herencia", "Adjudicación por Liquidación de Sociedad Conyugal", "Adjudicación por Remate",
  "Adopción", "Ampliación de Hipoteca",
  "Apertura de Crédito con Garantía Hipotecaria", "Apertura de Crédito Refaccionario", "Apertura de Crédito Simple",
  "Arrendamiento con Opción a Compra", "Aumento de Capital Social",
  "Cancelación de Hipoteca", "Capitulaciones Matrimoniales", "Certificación de Documentos",
  "Cesión de Derechos", "Cesión de Derechos Fideicomisarios", "Cesión de Derechos Hereditarios",
  "Compraventa", "Compraventa con Carta de Crédito Infonavit", "Compraventa con Crédito Bancario",
  "Compraventa con Crédito Cofinavit", "Compraventa con Crédito Fovissste",
  "Compraventa con Reserva de Dominio", "Compraventa y Apertura de Crédito",
  "Constitución de Asociación Civil", "Constitución de Fideicomiso",
  "Constitución de SAPI", "Constitución de Sociedad Anónima",
  "Constitución de Sociedad Civil", "Constitución de Sociedad de Responsabilidad Limitada",
  "Constitución de Usufructo", "Contrato de Arrendamiento",
  "Dación en Pago", "Declaración Unilateral de Voluntad", "Declaratoria de Condominio",
  "Disolución y Liquidación de Sociedad", "Divorcio Voluntario", "Donación", "Donación con Reserva de Usufructo",
  "Escisión de Sociedades", "Extinción de Fideicomiso", "Extinción de Usufructo",
  "Fe de Hechos", "Fideicomiso de Garantía", "Fideicomiso Traslativo de Dominio",
  "Fusión de Sociedades",
  "Inventario y Avalúo",
  "Liquidación de Sociedad Conyugal",
  "Modificación de Estatutos Sociales", "Modificación de Fideicomiso",
  "Mutuo con Interés y Garantía Hipotecaria",
  "Novación de Crédito Hipotecario",
  "Partición de Herencia", "Permuta", "Poderes Notariales",
  "Protocolización de Asamblea", "Protocolización de Documento",
  "Ratificación de Firmas", "Reconocimiento de Hijo",
  "Rectificación de Escritura", "Reducción de Capital Social", "Régimen de Propiedad en Condominio",
  "Repudiación de Herencia",
  "Servidumbre", "Sucesión Intestamentaria",
  "Testamento Público Abierto", "Testamento Público Cerrado",
];


export const PROYECTOS_INICIALES = [];
export const DICTAMINADORES_ROTACION = ["LSS", "KRD", "HVR"];
export const PROTOCOLISTAS = ["CSM", "MJBV", "MLGV", "NLO", "KJMR", "MPOC"];
export const REVISORES = [
  "CET", "DFC", "EALR", "ECGR", "EGR", "ERH", "FAV", "GADS", "GBC", "GRGO",
  "HRB", "HVR", "IGG", "JCOR", "JCRR", "JDRR", "JLF", "JLTC", "JOR", "JPSS",
  "KRD", "LIO", "LOFR", "LSS", "MALO", "MBGC", "MCC", "MCHA", "MDHP", "MICL",
  "MLO", "MMCC", "MSH", "ORJC", "PZG", "RCP", "ROR", "RSMT", "RUV", "SVG", "VAG",
];
export const TIPOS_PROYECTO = [
  { id: "apertura",    nombre: "Apertura de Crédito" },
  { id: "bosque_real", nombre: 'CV "Bosque Real" EDO MEX' },
  { id: "cv_cdmx",    nombre: "CV Simple CDMX" },
  { id: "cv_edomex",  nombre: "CV Simple EDO MEX" },
  { id: "ch_info_cv", nombre: "CH Info y CV Simple EDO MEX" },
  { id: "disolucion", nombre: "Disolución, Protocolización de Inv., Adjudicación, CV y AP" },
];
export const DOCUMENTOS_EXPEDIENTE = [
  "Acta de matrimonio de la parte compradora",
  "Acta de matrimonio de la parte vendedora",
  "Antecedentes de crédito — Cancelación de hipoteca",
  "Autorización de venta",
  "Avalúo",
  "Carta de instrucción",
  "Certificado de clave y valor catastral",
  "Certificado de libertad o existencia de gravámenes",
  "Certificado de no adeudo de agua",
  "Certificado de no adeudo de aportación de mejoras",
  "Certificado de no adeudo de impuesto predial",
  "Certificado de no adeudo condominial",
  "Constancia de alineamiento y número oficial",
  "Constancia de terminación de obra",
  "Licencia de construcción",
  "Reglamento de condominio",
  "Régimen de propiedad en condominio",
  "Título de propiedad",
];
export const DOC_PREVIEW = `INSTRUMENTO NÚMERO VEINTICUATRO MIL UNO
VOLUMEN NÚMERO OCHOCIENTOS TREINTA Y UNO

CONTIENE: Extinción de Obligaciones y Cancelación de Hipoteca
que otorga BANCO NACIONAL DE MÉXICO, S.A., Integrante del 
Grupo Financiero Banamex, en favor del Sr. RAYMUNDO MARTÍNEZ CARDONA.

En Huixquilucan, Estado de México, a los nueve días del mes de octubre 
del año dos mil veinticinco, Yo, Lic. JUAN CARLOS ORTEGA REYES, 
Titular de la Notaría Pública Número Ciento Sesenta y Ocho del 
Estado de México, hago constar el acto antes mencionado.

ANTECEDENTES

I.- ANTECEDENTE DE HIPOTECA.- Por escritura número ocho mil 
seiscientos ochenta y tres, de fecha veintiséis de julio del año 
dos mil veintidós, se hizo constar el Contrato de Apertura de Crédito 
Simple con Interés y Garantía Hipotecaria...

CLÁUSULAS

PRIMERA.- OBJETO.- El "BANCO" da por extinguidas las obligaciones 
reales y personales derivadas de dicho contrato y CANCELA LA HIPOTECA.

SEGUNDA.- En consecuencia, "EL BANCO" da su consentimiento para que 
se hagan los asientos de Cancelación de Hipoteca procedentes.

TERCERA.- GASTOS Y DERECHOS.- Los gastos serán por cuenta del 
Sr. RAYMUNDO MARTÍNEZ CARDONA.

YO, EL NOTARIO CERTIFICO Y DOY FE.
`;
