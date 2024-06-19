import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import logo from "../img/LogoBillbuddy.png";
// Estilos para el documento PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    borderBottom: 1,
    borderBottomColor: "#ccc",
    borderBottomStyle: "solid",
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
});

const ComprobantePagoPDF = ({ transaction }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Image src={logo} style={styles.logo} />
          <Text style={styles.header}>Comprobante de Pago</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "bold" }}>Pago a:</Text> {transaction.payer}
          </Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "bold" }}>Monto pagado:</Text> ${transaction.paid.toFixed(2)}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>
            Gracias por su pago. Para más detalles, contacte con nuestro servicio al cliente.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ComprobantePagoPDF;
