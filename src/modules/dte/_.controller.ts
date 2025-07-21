import { DteModel } from "@Modules/dte/_.model";
import Ajv from "ajv";
import ccfV3 from "@Modules/dte/schemas/json/fe-ccf-v3.json";
import type { DteCCF } from "@Types/schemas/dte/ccf";
import fs from "fs";

export class DteController {
    private model = new DteModel();
    private ajv = new Ajv();

    async generateCCF(data: DteCCF) {
        // Convertir documento relacionado
        const relatedDocs = data.documentoRelacionado ? data.documentoRelacionado.map((doc) => ({
            tipoDocumento: doc.type.document,
            tipoGeneracion: doc.type.generation,
            numeroDocumento: doc.number,
            fechaEmision: doc.date
        })) : null;
        // Convertir emisor
        const emisor = {
            nit: data.emisor.nit,
            nrc: data.emisor.nrc,
            nombre: data.emisor.nombre,
            codActividad: data.emisor.actividad.code,
            descActividad: data.emisor.actividad.description,
            nombreComercial: data.emisor.nombreComercial,
            tipoEstablecimiento: data.emisor.establecimiento.tipo,
            codigoMH: data.emisor.establecimiento.codigoMH,
            codigoContribuyente: data.emisor.establecimiento.codigoContribuyente,
            direccion: data.emisor.direccion,
            telefono: data.emisor.telefono,
            correo: data.emisor.correoElectronico,
            codEstableMH: data.emisor.establecimiento.codigoMH,
            codEstable: data.emisor.establecimiento.codigoContribuyente,
            codPuntoVentaMH: data.emisor.puntoVenta.codigoMH,
            codPuntoVenta: data.emisor.puntoVenta.codigoContribuyente,
        };
        // Convertir receptor
        const receptor = {
            nit: data.receptor.nit,
            nrc: data.receptor.nrc,
            nombre: data.receptor.nombre,
            codActividad: data.receptor.actividad.code,
            descActividad: data.receptor.actividad.description,
            nombreComercial: data.receptor.nombreComercial,
            direccion: data.receptor.direccion,
            telefono: data.receptor.telefono,
            correo: data.receptor.correoElectronico,
        };
        // Convertir otros documentos
        const otrosDocumentos = data.otrosDocumentos ? data.otrosDocumentos.map((doc) => ({
            codDocAsociado: doc.code,
            descDocumento: doc.description,
            detalleDocumento: doc.detail,
            medico: doc.medico,
        })) : null;
        // Convertir cuerpo documento
        const cuerpoDocumento = data.cuerpoDocumento.map((item) => ({
            numItem: item.item.number,
            tipoItem: item.item.type,
            numeroDocumento: item.number,
            codigo: item.codigo,
            codTributo: item.tributo,
            descripcion: item.descripcion,
            cantidad: item.cantidad,
            uniMedida: item.uniMedida,
            precioUni: item.precioUni,
            montoDescu: item.montoDescu,
            ventaNoSuj: item.venta.noSujeto,
            ventaExenta: item.venta.exenta,
            ventaGravada: item.venta.gravada,
            tributos: item.tributos,
            psv: item.psv,
            noGravado: item.noGravado
        }));
        // Convertir resumen
        const resumen = {
            totalNoSuj: data.resumen.total.noSujeto,
            totalExenta: data.resumen.total.exento,
            totalGravada: data.resumen.total.gravado,
            subTotalVentas: data.resumen.subTotalVentas,
            descuNoSuj: data.resumen.descuentos.noSujeto,
            descuExenta: data.resumen.descuentos.exento,
            descuGravada: data.resumen.descuentos.gravado,
            porcentajeDescuento: data.resumen.descuentos.porcentaje,
            totalDescu: data.resumen.descuentos.total,
            tributos: data.resumen.tributos.map((tributo) => ({
                codigo: tributo.code,
                descripcion: tributo.description,
                valor: tributo.value
            })),
            subTotal: data.resumen.subTotal,
            ivaPerci1: data.resumen.iva.percibido,
            ivaRete1: data.resumen.iva.retenido,
            reteRenta: data.resumen.reteRenta,
            montoTotalOperacion: data.resumen.montoTotalOperacion,
            totalNoGravado: data.resumen.total.noGravado,
            totalPagar: data.resumen.total.value,
            totalLetras: data.resumen.total.letras,
            saldoFavor: data.resumen.saldoFavor,
            condicionOperacion: data.resumen.condicionOperacion,
            pagos: data.resumen.pagos.map((pago) => ({
                codigo: pago.code,
                montoPago: pago.montoPago,
                referencia: pago.referencia,
                plazo: pago.plazo,
                periodo: pago.periodo
            })),
            numPagoElectronico: data.resumen.numPagoElectronico
        };
        // Convertir extension
        const extension = data.extension ? {
            nombEntrega: data.extension.entrega.name,
            docuEntrega: data.extension.entrega.document,
            nombRecibe: data.extension.recibe.name,
            docuRecibe: data.extension.recibe.document,
            observaciones: data.extension.observaciones,
            placaVehiculo: data.extension.placaVehiculo
        } : null;
        return {
            identificacion: {
                version: 3,
                ambiente: data.identificacion.ambiente,
                tipoDte: data.identificacion.tipoDte,
                numeroControl: data.identificacion.numeroControl,
                codigoGeneracion: data.identificacion.codigoGeneracion,
                tipoModelo: data.identificacion.tipoModelo,
                tipoOperacion: data.identificacion.tipoOperacion,
                tipoContingencia: data.identificacion.tipoContingencia,
                motivoContin: data.identificacion.motivoContingencia,
                fecEmi: data.identificacion.fecEmi,
                horEmi: data.identificacion.horEmi,
                tipoMoneda: data.identificacion.tipoMoneda
            },
            documentoRelacionado: relatedDocs,
            emisor: emisor,
            receptor: receptor,
            otrosDocumentos: otrosDocumentos,
            ventaTercero: data.ventaTercero,
            cuerpoDocumento: cuerpoDocumento,
            resumen: resumen,
            extension: extension,
            apendice: data.apendice
        };
    }

    async sendCCF(data: DteCCF, isTest: boolean = false, endPoint: string) {
        // Contrruir CCF
        const ccf = await this.generateCCF(data);
        // Validar CCF
        const validate = this.ajv.compile(ccfV3);
        const valid = validate(ccf);
        if (!valid) {
            return { success: false, message: this.ajv.errorsText() };
        }
        // Send CCF to MH
        if (isTest) {
            return { success: true, message: 'CCF generated successfully', data: ccf };
        }
        const response = await fetch(endPoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ccf),
        }).then((res) => res.json());
        if (response.status === "OK") {
            // save ccf in file 
            fs.writeFileSync("ccf.json", JSON.stringify(response.body, null, 2));
            // save in db
            await this.model.saveCCF(response.body);
            return { success: true, message: 'CCF generated successfully', data: response };
        } else {
            /* {
                "status": "ERROR",
                "body": {
                "codigo": "809",
                "mensaje": [
                "Formato de NIT no valido - (00000000000000)"
                ]
        }} */
            return { success: false, message: response.body.mensaje[0] };
        }
    }
}