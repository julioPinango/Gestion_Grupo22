import React from "react";
import { Document, Page, Text } from "@react-pdf/renderer";

const DocuPDF = ({ transactions }) => {
  return (
    <Document>
      <Page>
        
        { transactions ? transactions.map((transaction, index) => (
          <>
            <Text style={{ textAlign: "center", marginTop: "22px" }}>
              Gasto creado por: {transaction ? transaction.from_username : null}
            </Text>

            <Text style={{ textAlign: "center", marginTop: "22px" }}>
              por un valor de ${transaction ? transaction.amount : null} que afecta a {transaction ? transaction.to_username : null}
            </Text>
          </>
        )): null}
      </Page>
    </Document>
  );
};

export default DocuPDF;
