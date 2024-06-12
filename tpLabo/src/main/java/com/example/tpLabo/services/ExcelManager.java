package com.example.tpLabo.services;

import com.example.tpLabo.entities.Instrumento;
import com.example.tpLabo.entities.Pedido;
import com.example.tpLabo.entities.PedidoDetalle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.xssf.streaming.SXSSFCell;
import org.apache.poi.xssf.streaming.SXSSFRow;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExcelManager {
    @Autowired
    private PedidoService pedidoService;

    String urlConexion = "jdbc:mysql://localhost:3306/Instrumentos";
    String usuario = "root";
    String clave = "root";

    public SXSSFWorkbook imprimirExcelPedidos(Date fechaDesde, Date fechaHasta) throws IOException, SQLException {
        // Se crea el libro
        SXSSFWorkbook libro = new SXSSFWorkbook(50);
        // Se crea una hoja dentro del libro
        SXSSFSheet hoja = libro.createSheet();
        //estilo
        XSSFFont font = (XSSFFont) libro.createFont();
        font.setBold(true);
        XSSFCellStyle style = (XSSFCellStyle) libro.createCellStyle();
        style.setFont(font);

        // Estilo para las fechas
        CellStyle dateCellStyle = libro.createCellStyle();
        CreationHelper createHelper = libro.getCreationHelper();
        dateCellStyle.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));


        int nroColumna = 0;
        // Se crea una fila dentro de la hoja
        SXSSFRow row = hoja.createRow(0);
        // Se crea una celda dentro de la fila
        SXSSFCell cell = row.createCell(nroColumna);
        cell.setCellValue("Id");
        cell.setCellStyle(style);
        cell = row.createCell(++nroColumna);
        cell.setCellValue("Fecha Pedido");
        cell.setCellStyle(style);
        cell = row.createCell(++nroColumna);
        cell.setCellValue("Instrumento");
        cell.setCellStyle(style);
        cell = row.createCell(++nroColumna);
        cell.setCellValue("Marca");
        cell.setCellStyle(style);
        cell = row.createCell(++nroColumna);
        cell.setCellValue("Modelo");
        cell.setCellStyle(style);
        cell = row.createCell(++nroColumna);
        cell.setCellValue("Cantidad");
        cell.setCellStyle(style);
        cell = row.createCell(++nroColumna);
        cell.setCellValue("Precio");
        cell.setCellStyle(style);
        cell = row.createCell(++nroColumna);
        cell.setCellValue("Subtotal");
        cell.setCellStyle(style);

        int nroFila = 1;

        List<Pedido> pedidos = getPedidosFromRangeOfDates(fechaDesde, fechaHasta);
        // Punto de depuración 1: inspeccionar la lista de pedidos
        System.out.println("Pedidos obtenidos: " + pedidos.size());
        for (Pedido pedido : pedidos) {
            for (PedidoDetalle detalle : pedido.getPedidoDetalles()) {
                nroColumna = 0;
                row = hoja.createRow(nroFila);
                cell = row.createCell(nroColumna);
                cell.setCellValue(pedido.getId());
                cell = row.createCell(++nroColumna);
                cell.setCellValue(pedido.getFechaPedido());
                cell.setCellStyle(dateCellStyle);
                cell = row.createCell(++nroColumna);
                cell.setCellValue(detalle.getInstrumento().getInstrumento());
                cell = row.createCell(++nroColumna);
                cell.setCellValue(detalle.getInstrumento().getMarca());
                cell = row.createCell(++nroColumna);
                cell.setCellValue(detalle.getInstrumento().getModelo());
                cell = row.createCell(++nroColumna);
                cell.setCellValue(detalle.getCantidad());
                cell = row.createCell(++nroColumna);
                cell.setCellValue(detalle.getInstrumento().getPrecio());
                cell = row.createCell(++nroColumna);
                double precio = Double.parseDouble(detalle.getInstrumento().getPrecio());
                double subtotal = detalle.getCantidad() * precio;
                cell.setCellValue(subtotal);
                ++nroFila;
            }
        }
        return libro;
    }

    public List<Pedido> getPedidosFromRangeOfDates(final Date fechaDesde, final Date fechaHasta) {
        List<Pedido> allPedidos = new ArrayList<>();
        Date fechaHastaIncrementada = null;
        try {
            // Incrementar fechaHasta en un día
            Calendar cal = Calendar.getInstance();
            cal.setTime(fechaHasta);
            cal.add(Calendar.DATE, 1);
            fechaHastaIncrementada = cal.getTime();

            allPedidos = getPedidosFromRangeOfDatesUsingSQL(fechaDesde, fechaHastaIncrementada);
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        Date finalFechaHastaIncrementada = fechaHastaIncrementada;
        return allPedidos.stream()
                .filter(pedido -> (pedido.getFechaPedido().equals(fechaDesde) || pedido.getFechaPedido().after(fechaDesde))
                        && (pedido.getFechaPedido().equals(finalFechaHastaIncrementada) || pedido.getFechaPedido().before(finalFechaHastaIncrementada)))
                .collect(Collectors.toList());
    }

    private List<Pedido> getPedidosFromRangeOfDatesUsingSQL(Date fechaDesde, Date fechaHasta) throws SQLException, ClassNotFoundException {
        ResultSet rs = null;
        List<Pedido> pedidos = new ArrayList<>();
        Connection conexion = null;

        try {
            Class.forName("com.mysql.jdbc.Driver");
            conexion = DriverManager.getConnection(urlConexion, usuario, clave);

            PreparedStatement ps = conexion.prepareStatement("SELECT p.*, i.instrumento, i.marca, i.modelo, i.precio, d.cantidad " +
                    "FROM pedido p " +
                    "JOIN pedido_detalle d ON p.id = d.id_pedido " +
                    "JOIN instrumento i ON d.id_instrumento = i.id " +
                    "WHERE p.fecha_pedido >= ? AND p.fecha_pedido <= ?");
            ps.setDate(1, new java.sql.Date(fechaDesde.getTime()));
            ps.setDate(2, new java.sql.Date(fechaHasta.getTime()));

            rs = ps.executeQuery();

            while (rs.next()) {
                Pedido pedido = new Pedido();
                pedido.setId(Long.parseLong(rs.getString("id")));
                pedido.setFechaPedido(rs.getDate("fecha_pedido"));
                pedido.setTotalPedido(rs.getDouble("total_pedido"));
                PedidoDetalle detalle = new PedidoDetalle();
                detalle.setCantidad(rs.getInt("cantidad"));
                detalle.setInstrumento(new Instrumento(
                        rs.getString("instrumento"),
                        rs.getString("marca"),
                        rs.getString("modelo"),
                        rs.getString("precio")
                ));
                detalle.setPedido(pedido);
                if (pedido.getPedidoDetalles() == null) {
                    // Si es null, inicializarla
                    pedido.setPedidoDetalles(new ArrayList<>());
                }
                pedido.getPedidoDetalles().add(detalle);
                pedidos.add(pedido);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        } finally {
            if (conexion != null)
                conexion.close();
        }

        return pedidos;
    }

}
