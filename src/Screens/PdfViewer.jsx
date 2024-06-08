import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const PdfViewer = ({ route }) => {
    const { pdfUrl } = route.params;

    const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${pdfUrl}`;

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: googleDocsUrl }}
                style={{ flex: 1 }}
            />
        </View>
    );
}

export default PdfViewer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
