import React,{useEffect, useState} from 'react';
import { View, Text, StyleSheet,Font } from '@react-pdf/renderer';
import { PDFViewer, Document, Page } from '@react-pdf/renderer';
// Font.register({
//   family: 'Roboto Bold',
//   src: 'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@700&display=swap',
//   fontWeight: 'bold',
// });
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    padding: 20,
  },
  // container: {
  //   flexDirection: 'column',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  shopContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    textAlign: 'center',
  },
  invoiceTitle:{
    marginBottom:5
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  shopAddress: {
    marginTop: 10,
    lineHeight: 1.5,
    fontSize: 12,
    textAlign: 'center',
  },
  invoiceDetails:{
    display:'flex',
    flexDirection:'row'
  },
  invoiceDate:{
   marginLeft:'450px'
  },
  invoiceNumber:{
    marginLeft:'0px',
    marginBottom:'5px'
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  value: {
    fontSize: 12,
  },

  table: {
    width: '100%',
    borderTop: '1 solid black',
    // borderCollapse: 'collapse',
  },
  tableHeader: {
    flexDirection: 'row',
    fontSize:'13px',
    // backgroundColor: '#f0f0f0',
  },
  tableHeaderCell: {
    borderBottom: '1 solid black',
    padding: 5,
    marginBottom:'8px'
    // textAlign: 'center',
    // width: '14%',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    // border: '1 solid black',
    // padding: 5,
    // textAlign: 'center',
    // width: '14%',
    marginBottom:'5px',
    fontSize:'13px'
  },
  productCode:{
    width:'40px',  
  },
  author:{
    width:'120px',
  },
  productName:{
    width:'200px'
  },
  quantity:{
    width:'25px',
    textAlign:'center'    
  },
  price:{
    width:'55px',
    textAlign:'right'    
  },
  discount:{
    width:'55x',
    textAlign:'center'    
  },
  total:{
    width:'60px',
    textAlign:'right'    

  },
  totalContainer: {
    marginTop: 20,
    textAlign: 'right',
    // fontSize: 12,
    fontWeight: 'bold',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: '60px',
    padding:'20px',
    fontSize:'14px',
    maxWidth:'700px',
    borderTop:'2px solid black',   
    borderBottom:'2px solid black',   
    height:'75px'
    },

  footerItem: {
    width: '48%', // Adjust the width as needed
  },
  boldText:{
    fontFamily:'Times-Bold',
    fontSize:'15px'
  },
  footerTotal:{
    marginRight:'40px'
  },

  totalText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 10,
  },
  amtWordContainer:{
    position: 'absolute',
    bottom: '70px',
    marginLeft:'20px'
  },
  cautionContainer: {
    position: 'absolute',
    bottom: '30px',
    marginTop: '10px',
    width:'100%',
    left:'30%',
  },

  cautionText: {
    fontSize: '12px',
    fontStyle: 'italic',
  },
});

const EstimatePDF = ({ invoice,invoiceFooter }) => {
  return ( 
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.container}>
            <View style={styles.shopContainer}>
              <Text style={styles.invoiceTitle}>ESTIMATE</Text>
              <Text style={styles.shopName}>{invoice.supplierName}</Text>
              <Text style={styles.shopAddress}>
  
                No. 16 B Ground Floor, Lily Pond Shopping Complex 
                 {'\n'}
                (Nr Central Railway Station) Chennai-600 003 {'\n'}
              </Text>
            </View>

            <View style={styles.invoiceDetails}>
        
              <View style={styles.invoiceDate}>
                <Text style={styles.label}>Date: {invoice.invoiceDate}</Text>
              </View>
            </View>
              <View style={styles.detail}>
                <Text style={styles.label}>Name: {invoice.customerName}</Text>
              </View>


            <View style={{ marginTop: 20 }}>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <View style={[styles.tableHeaderCell,styles.productCode]}><Text>SNo.</Text></View>
                  <View style={[styles.tableHeaderCell,styles.author]}><Text>Author</Text></View>
                  <View style={[styles.tableHeaderCell,styles.productName]}><Text>Product Name</Text></View>
                  <View style={[styles.tableHeaderCell,styles.quantity]}><Text>Qty</Text></View>
                  <View style={[styles.tableHeaderCell,styles.price]}><Text>Rate</Text></View>
                  <View style={[styles.tableHeaderCell,styles.discount]}><Text>Disc %</Text></View>
                  <View style={[styles.tableHeaderCell,styles.total]}><Text>Total</Text></View>
                </View>
                {invoice.products.map((product, index) => (
                  
                  <View style={styles.tableRow} key={index}>
                    <View style={[styles.tableCell,styles.productCode]}><Text>{index+1}</Text></View>
                    <View style={[styles.tableCell,styles.author]}><Text>{product.author}</Text></View>
                    <View style={[styles.tableCell,styles.productName]}><Text>{product.productName}</Text></View>
                    <View style={[styles.tableCell,styles.quantity]}><Text>{product.quantity}</Text></View>
                    <View style={[styles.tableCell,styles.price]}><Text>{product.price.toFixed(2)}</Text></View>
                    <View style={[styles.tableCell,styles.discount]}><Text>{product.discount.toFixed(2)}</Text></View>
                    <View style={[styles.tableCell,styles.total]}>
                      <Text>{((product.price * product.quantity) - ((product.discount / 100) * product.price * product.quantity)).toFixed(2)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
            <View style={styles.footerContainer}>
              <View style={styles.footerItem}>
                <Text>Total Items: {invoice.products.length}</Text>
              </View>
              <View style={styles.footerItem}>
                <Text>Discount: {invoiceFooter.discount}</Text>
              </View>
              <View style={styles.footerItem}>
                <Text>Total Qty: {invoiceFooter.quantity}</Text>
              </View>
              <View style={[styles.footerItem,styles.footerTotal]}>
                <Text style={styles.boldText}>Total: {invoiceFooter.total}</Text>
              </View>
              {'\n'}
            </View>
              <View style={styles.amtWordContainer}>
                <Text style={styles.boldText}>Amount in Words: {invoiceFooter.amtWord}</Text>
              </View>
            <View style={styles.cautionContainer}>
              <Text style={styles.cautionText}>HSN - 4901 Printed Books are exempted under GST</Text>
            </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default EstimatePDF;
