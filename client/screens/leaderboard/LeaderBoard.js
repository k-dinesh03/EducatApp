import React from "react";
import { View, Alert, Text, StatusBar } from "react-native";

import Leaderboard from "react-native-leaderboard";

export default function LeaderBoard() {

    const alert = (title, body) => {
        Alert.alert(title, body, [{ text: "OK", onPress: () => { } }], {
            cancelable: false
        });
    };

    const props = {
        labelBy: "name",
        sortBy: "score",
        data: DATA,
        icon: "iconUrl",
        onRowPress: (item, index) => {
            alert(item.name + " clicked", item.score + " points, wow!");
        },
        evenRowColor: "#edfcf9"
    };

    return (
        <View style={{ flex: 1 }}>
            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />
            <Leaderboard {...props} />
        </View>
    );

}

const DATA = [
    {
        name: "We Tu Lo",
        score: null,
        iconUrl:
            "https://st2.depositphotos.com/1006318/5909/v/950/depositphotos_59094043-stock-illustration-profile-icon-male-avatar.jpg"
    },
    {
        name: "Adam Savage",
        score: 12,
        iconUrl:
            "https://www.shareicon.net/data/128x128/2016/09/15/829473_man_512x512.png"
    },
    {
        name: "Derek Black",
        score: 244,
        iconUrl: "http://ttsbilisim.com/wp-content/uploads/2014/09/20120807.png"
    },
    {
        name: "Erika White",
        score: 0,
        iconUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr27ZFBaclzKcxg2FgJh6xi3Z5-9vP_U1DPcB149bYXxlPKqv-"
    },
    {
        name: "Jimmy John",
        score: 20,
        iconUrl: "https://static.witei.com/static/img/profile_pics/avatar4.png"
    },
    {
        name: "Joe Roddy",
        score: 69,
        iconUrl: "https://static.witei.com/static/img/profile_pics/avatar4.png"
    },
    {
        name: "Ericka Johannesburg",
        score: 101,
        iconUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShPis8NLdplTV1AJx40z-KS8zdgaSPaCfNINLtQ-ENdPvrtMWz"
    },
    {
        name: "Tim Thomas",
        score: 41,
        iconUrl: "http://ttsbilisim.com/wp-content/uploads/2014/09/20120807.png"
    },
    {
        name: "John Davis",
        score: 80,
        iconUrl:
            "https://cdn.dribbble.com/users/223408/screenshots/2134810/me-dribbble-size-001-001_1x.png"
    },
    {
        name: "Tina Turner",
        score: 22,
        iconUrl:
            "https://cdn.dribbble.com/users/223408/screenshots/2134810/me-dribbble-size-001-001_1x.png"
    },
    {
        name: "Harry Reynolds",
        score: null,
        iconUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsSlzi6GEickw2Ft62IdJTfXWsDFrOIbwXhzddXXt4FvsbNGhp"
    },
    {
        name: "Betty Davis",
        score: 25,
        iconUrl:
            "https://landofblogging.files.wordpress.com/2014/01/bitstripavatarprofilepic.jpeg?w=300&h=300"
    },
    {
        name: "Lauren Leonard",
        score: 30,
        iconUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr27ZFBaclzKcxg2FgJh6xi3Z5-9vP_U1DPcB149bYXxlPKqv-"
    }
];