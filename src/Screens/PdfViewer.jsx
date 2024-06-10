import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Pdf from 'react-native-pdf'
const PdfViewer = () => {

    const pdfResource = { uri: "https://firebasestorage.googleapis.com/v0/b/library-8a90b.appspot.com/o/pdfs%2F2024-06-06T18%3A19%3A45.070Z.pdf?alt=media&token=180403c4-4f4e-46ac-8b54-88d72310e588", cache: true };
    return (
        <View style={styles.container}>
            <Pdf
                trustAllCerts={false}
                source={pdfResource}
                style={styles.pdf}
                onLoadComplete={(numberOfPage, filePath) => {
                    console.log(`number of pages:  ${numberOfPage}`);
                }}

            />
        </View>
    )
}

export default PdfViewer

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    }
})