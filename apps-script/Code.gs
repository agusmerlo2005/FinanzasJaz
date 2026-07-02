/**
 * Backend de "Finanzas de Jazmín" en Google Sheets.
 *
 * Cómo usarlo:
 *  1. Creá una Google Sheet nueva.
 *  2. Extensiones > Apps Script, pegá este código.
 *  3. Implementar > Nueva implementación > Aplicación web.
 *       - Ejecutar como: Yo
 *       - Quién tiene acceso: Cualquiera
 *  4. Copiá la URL (termina en /exec) y pegala en src/config.js (APPS_SCRIPT_URL).
 *
 * Crea automáticamente una pestaña "Movimientos" con encabezados.
 */

var HOJA = 'Movimientos'
var ENCABEZADOS = ['id', 'fecha', 'tipo', 'monto', 'concepto', 'categoria', 'categoriaLabel', 'emoji']

function getHoja() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sh = ss.getSheetByName(HOJA)
  if (!sh) {
    sh = ss.insertSheet(HOJA)
    sh.appendRow(ENCABEZADOS)
  }
  return sh
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'list'
  if (action === 'list') {
    return json(listar())
  }
  return json({ ok: true })
}

function doPost(e) {
  var body = {}
  try {
    body = JSON.parse(e.postData.contents)
  } catch (err) {
    return json({ ok: false, error: 'JSON inválido' })
  }

  if (body.action === 'add') {
    agregar(body.movimiento)
    return json({ ok: true })
  }
  if (body.action === 'delete') {
    borrar(body.id)
    return json({ ok: true })
  }
  return json({ ok: false, error: 'acción desconocida' })
}

function listar() {
  var sh = getHoja()
  var rows = sh.getDataRange().getValues()
  var out = []
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i]
    if (!r[0]) continue
    out.push({
      id: String(r[0]),
      fecha: r[1] instanceof Date ? r[1].toISOString() : String(r[1]),
      tipo: r[2],
      monto: Number(r[3]),
      concepto: r[4],
      categoria: r[5],
      categoriaLabel: r[6],
      emoji: r[7],
    })
  }
  // más nuevos primero
  return out.reverse()
}

function agregar(m) {
  var sh = getHoja()
  sh.appendRow([
    m.id, m.fecha, m.tipo, m.monto,
    m.concepto, m.categoria, m.categoriaLabel, m.emoji,
  ])
}

function borrar(id) {
  var sh = getHoja()
  var rows = sh.getDataRange().getValues()
  for (var i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][0]) === String(id)) {
      sh.deleteRow(i + 1)
      break
    }
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  )
}
