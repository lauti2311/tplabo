package com.example.tpLabo.services;

import com.example.tpLabo.entities.Instrumento;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.*;

@Service
public class InstrumentoPDF {
    private static final String URL_CONEXION = "jdbc:mysql://localhost:3306/Instrumentos";
    private static final String USUARIO = "root";
    private static final String CLAVE = "root";

    private static final Font TITULO_FONT = new Font(Font.HELVETICA, 18, Font.BOLD);
    private static final Font SUBTITULO_FONT = new Font(Font.HELVETICA, 14, Font.BOLD);
    private static final Font TEXTO_FONT = new Font(Font.HELVETICA, 12, Font.NORMAL);
    private static final Font TEXTO_BOLD_FONT = new Font(Font.HELVETICA, 12, Font.BOLD);

    public static void addMetaData(Document document) {
        document.addTitle("Instrumento");
        document.addSubject("Instrumento");
        document.addKeywords("Instrumento, PDF, Detalle");
        document.addAuthor("Perez Lautaro");
        document.addCreator("Perez Lautaro");
    }

    public static void addEmptyLine(Paragraph paragraph, int number) {
        for (int i = 0; i < number; i++) {
            paragraph.add(new Paragraph(" "));
        }
    }

    private void addCellToTable(PdfPTable table, String header, String value, Font fontHeader, Font fontValue) {
        PdfPCell celdaIzq = new PdfPCell(new Phrase(header, fontHeader));
        celdaIzq.setBorder(Rectangle.NO_BORDER);

        PdfPCell celdaDer = new PdfPCell(new Phrase(value, fontValue));
        celdaDer.setBorder(Rectangle.NO_BORDER);

        table.addCell(celdaIzq);
        table.addCell(celdaDer);
    }

    public void imprimirInstrumentoPdf(Long idInstrumento, ByteArrayOutputStream outputStream) throws SQLException {
        try {
            Document document = new Document(PageSize.A4, 30, 30, 30, 30);
            PdfWriter.getInstance(document, outputStream);
            document.open();
            addMetaData(document);

            Instrumento instrumento = getInstrumentoById(idInstrumento);

            // Encabezado
            PdfPTable tableCabecera = new PdfPTable(2);
            tableCabecera.setWidthPercentage(100f);
            tableCabecera.setWidths(new float[]{1f, 1f});

            // Encabezado Izquierdo
            Image imgCabeceraLeft = Image.getInstance("https://innovavista.net/imagenes/archivos/proyectos/272_imagen_750x480xrecortarSuperior.jpg?random=1710412238");
            imgCabeceraLeft.scalePercent(10f);
            PdfPCell logoUTNLeft = new PdfPCell(imgCabeceraLeft);
            logoUTNLeft.setBorder(Rectangle.NO_BORDER);
            logoUTNLeft.setHorizontalAlignment(PdfPCell.ALIGN_LEFT);
            tableCabecera.addCell(logoUTNLeft);

            // Encabezado Derecho
            Paragraph headerRight = new Paragraph("Instrumento", TITULO_FONT);
            headerRight.setAlignment(Paragraph.ALIGN_RIGHT);
            PdfPCell headerCellRight = new PdfPCell(headerRight);
            headerCellRight.setBorder(Rectangle.NO_BORDER);
            headerCellRight.setHorizontalAlignment(PdfPCell.ALIGN_RIGHT);
            tableCabecera.addCell(headerCellRight);

            document.add(tableCabecera);

            // Espacio después del encabezado
            addEmptyLine(new Paragraph(), 1);

            // Crear tabla principal con 2 columnas
            PdfPTable mainTable = new PdfPTable(2);
            mainTable.setWidthPercentage(100);
            mainTable.setWidths(new float[]{3f, 2f});

            // Columna izquierda: imagen y descripción
            PdfPCell leftColumnCell = new PdfPCell();
            leftColumnCell.setBorder(Rectangle.NO_BORDER);
            PdfPTable leftColumn = new PdfPTable(1);
            leftColumn.setWidthPercentage(100);

            // Agregar imagen
            Image imgInstrumento = Image.getInstance(instrumento.getImagen());
            imgInstrumento.scaleAbsolute(150f, 150f);
            imgInstrumento.setAlignment(Image.ALIGN_CENTER);

            PdfPCell cellImg = new PdfPCell(imgInstrumento);
            cellImg.setBorder(Rectangle.NO_BORDER);
            cellImg.setHorizontalAlignment(PdfPCell.ALIGN_CENTER);
            leftColumn.addCell(cellImg);

            // Agregar descripción
            PdfPCell descriptionCell = new PdfPCell();
            descriptionCell.setBorder(Rectangle.NO_BORDER);
            descriptionCell.addElement(new Paragraph("Descripción:", SUBTITULO_FONT));
            descriptionCell.addElement(new Paragraph(instrumento.getDescripcion(), TEXTO_FONT));
            leftColumn.addCell(descriptionCell);

            leftColumnCell.addElement(leftColumn);
            mainTable.addCell(leftColumnCell);

            // Columna derecha: datos
            PdfPCell rightColumnCell = new PdfPCell();
            rightColumnCell.setBorder(Rectangle.NO_BORDER);
            PdfPTable rightColumn = new PdfPTable(1);
            rightColumn.setWidthPercentage(100);

            addCellToTable(rightColumn, "", instrumento.getCantidadVendida() + " vendidos", TEXTO_BOLD_FONT, TEXTO_FONT);

            // Agregar el título en la columna derecha
            Paragraph tituloInstrumento = new Paragraph(instrumento.getInstrumento().toUpperCase(), TITULO_FONT);
            tituloInstrumento.setAlignment(Paragraph.ALIGN_LEFT);
            PdfPCell celdaTitulo = new PdfPCell(tituloInstrumento);
            celdaTitulo.setBorder(Rectangle.NO_BORDER);
            celdaTitulo.setHorizontalAlignment(PdfPCell.ALIGN_LEFT);
            rightColumn.addCell(celdaTitulo);

            // Crear una celda que contenga la marca y el modelo
            addCellToTable(rightColumn, "Marca: ", instrumento.getMarca(), TEXTO_BOLD_FONT, TEXTO_FONT);
            addCellToTable(rightColumn, "Modelo: ", instrumento.getModelo(), TEXTO_BOLD_FONT, TEXTO_FONT);

            // Espacio vertical
            PdfPCell emptyCell = new PdfPCell(new Phrase(" "));
            emptyCell.setBorder(Rectangle.NO_BORDER);
            rightColumn.addCell(emptyCell);

            // Agregar costo de envío
            Phrase costoCelda;
            if ("G".equalsIgnoreCase(instrumento.getCostoEnvio())) {
                costoCelda = new Phrase("ENVÍO GRATIS", new Font(Font.HELVETICA, 12, Font.NORMAL, Color.GREEN));
            } else {
                costoCelda = new Phrase("Costo de Envío: $" + instrumento.getCostoEnvio(), new Font(Font.HELVETICA, 12, Font.NORMAL, Color.ORANGE));
            }
            PdfPCell costoCeldaPC = new PdfPCell(costoCelda);
            costoCeldaPC.setBorder(Rectangle.NO_BORDER);
            rightColumn.addCell(costoCeldaPC);

            rightColumnCell.addElement(rightColumn);
            mainTable.addCell(rightColumnCell);

            document.add(mainTable);
            document.close();
        } catch (DocumentException | IOException e) {
            e.printStackTrace();
        }
    }

    public Instrumento getInstrumentoById(long idInstrumento) throws SQLException {
        String query = "SELECT * FROM instrumento WHERE id = ?";
        try (Connection conexion = DriverManager.getConnection(URL_CONEXION, USUARIO, CLAVE);
             PreparedStatement ps = conexion.prepareStatement(query)) {

            ps.setLong(1, idInstrumento);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Instrumento instrumento = new Instrumento();
                    instrumento.setId(rs.getInt("id"));
                    instrumento.setInstrumento(rs.getString("instrumento"));
                    instrumento.setMarca(rs.getString("marca"));
                    instrumento.setModelo(rs.getString("modelo"));
                    instrumento.setImagen(rs.getString("imagen"));
                    instrumento.setPrecio(rs.getString("precio"));
                    instrumento.setCostoEnvio(rs.getString("costo_envio"));
                    instrumento.setCantidadVendida(rs.getInt("cantidad_vendida"));
                    instrumento.setDescripcion(rs.getString("descripcion"));
                    return instrumento;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw e;
        }
        return null;
    }
}
