import React, { useState } from "react";
import { View, Image, FlatList, StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

function BannerCarousel() {

    const [activeIndex, setActiveIndex] = useState(0);
    const [banners, setBanners] = useState([
        "https://source.unsplash.com/featured/?book",
        "https://source.unsplash.com/featured/?Reading",
        "https://source.unsplash.com/featured/?librarys",
        "https://source.unsplash.com/featured/?Bookshelf",
        "https://source.unsplash.com/featured/?books",


    ])
    const onViewRef = React.useRef((viewableItems) => {
        if (viewableItems.viewableItems.length > 0) {
            setActiveIndex(viewableItems.viewableItems[0].index || 0);
        }
        //console.log(viewableItems);
    });
    const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 })
    return (
        <FlatList
            data={banners}
            renderItem={(item) => (
                <Image
                    source={{ uri: (item.item) }}

                    style={{ width: width, height: height * 0.24, resizeMode: "stretch", borderRadius: 12, margin: 3, }}
                />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={width}
            snapToAlignment={"center"}
            decelerationRate={"fast"}
            viewabilityConfig={viewConfigRef.current}
            onViewableItemsChanged={onViewRef.current}
            testID="banner-carousel"
        />


    )

}

export default BannerCarousel