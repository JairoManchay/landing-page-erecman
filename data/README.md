# Catálogo local de ubicaciones

Fuente: listado oficial de ubigeos INEI publicado por el Ministerio de Salud en la Plataforma Nacional de Datos Abiertos.

- Recurso: https://www.datosabiertos.gob.pe/dataset/datos-de-registros-de-nacidos-vivos/resource/573f433b-0d44-46e2-932e-14abb9757860
- Descarga original: https://www.datosabiertos.gob.pe/sites/default/files/Lista_Ubigeos_INEI.csv
- Consulta y descarga: 15 de noviembre de 2026.
- Archivo original conservado: ubigeos-inei.csv, UTF-8, separado por punto y coma.
- Columnas originales: UBIGEO_INEI, DEPARTAMENTO, PROVINCIA, DISTRITO.
- SHA-256 del original: 566c88f4d4412d9831dd3103b2e29d24897b2d163655996c3ce68f100b79502a.

El original tiene 1892 registros. scripts/build-ubigeos.cjs deriva los 25 departamentos, las 196 provincias y los 43 distritos de la provincia de Lima. Lima se filtra por el prefijo provincial oficial 1501; no se incluyen distritos del Callao ni de otras provincias del departamento de Lima.

El formulario carga js/ubigeos-inei.js antes de js/main.js. No depende de peticiones a sitios externos durante la compra. Los códigos oficiales se usan como valores de las opciones y se validan contra el catálogo; para el comprador y WhatsApp se muestran los nombres del catálogo, con capitalización legible.

Para actualizar: descargar una versión oficial, verificar el origen y sus columnas, sustituir el CSV y ejecutar node scripts/build-ubigeos.cjs desde la raíz del proyecto. El script valida la estructura y los totales utilizados y calcula nuevamente el hash del archivo. Si cambia la división territorial, revisar las aserciones y la lógica antes de actualizar esos totales.

La existencia de una provincia en el catálogo NO confirma cobertura ni disponibilidad de una agencia Shalom. La agencia y lugar de recojo se confirman con el asesor.

Ampliación posterior: el generador incorpora también todos los distritos a cada provincia para Lima Provincias y resto del Perú. La fuente y su hash se mantienen; las listas y relaciones se derivan íntegramente del CSV.
