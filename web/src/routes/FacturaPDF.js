import React from "react";
import { Document, Page, View, Image, Text } from "@react-pdf/renderer";
import name from "../img/lightmodenombre.png";
import logo from "../img/LogoBillbuddy.png";


const FacturaPDF = ({ payer, amount, description, date }) => {
    const selectedDate = new Date(date);
    const formattedDate = selectedDate.toLocaleDateString('es-ES');
        
  
    return (

    <Document>
      <Page>

        {}
        <View style={{ position: 'absolute', top: 0, left: 0, marginBottom: 20 }}>
          {}
          <Image src={logo} style={{ width: 100, height: 100 }} />
        </View>
        <View style={{ position: 'absolute', top: 0, left: 110, marginBottom: 20 }}>
          {}
          <Image src={name} style={{ width: 100, height: 100 }} />
        </View>

        {}
          

        <View style={{ marginTop: "150px" }}> {}
          <Text style={{ textAlign: "left", marginLeft: "30px", marginTop: "22px" }}>
            El día {formattedDate}
          </Text>
          
          <Text style={{ textAlign: "left", marginLeft: "30px", marginTop: "22px" }}>
            Se realizó un gasto por un valor de ${amount} pesos,
          </Text>
          <Text style={{ textAlign: "left", marginLeft: "30px", marginTop: "22px" }}>
            En nombre de {payer}
          </Text>
          <Text style={{ textAlign: "left", marginLeft: "30px", marginTop: "22px" }}>
            En concepto de {description}.
          </Text>
        </View>

      </Page>
    </Document>
  
  );
};

export default FacturaPDF;
