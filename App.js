import React from "react"
import {
    View,
    Text,
    SafeAreaView,
    Dimensions,
    StyleSheet,
    Image,
    ImageBackground,
    StatusBar,
    TouchableOpacity,
    TextInput,
} from "react-native"

import Icon from "react-native-vector-icons/AntDesign"

const Dev_Height = Dimensions.get("window").height
const Dev_Width = Dimensions.get("window").width
const API_KEY = 'dcb57b50e65664e842c79f8854b4b370'
const date = new Date().toUTCString().slice(0, 11);

//converts first char of string to uppercase
function capitalizeFirstLetter(str) {
    let capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
}

//formats datetime data into day of week
function formatDate(datetime) {
  let dayOfWeek = new Date(datetime.slice(0, 10)).toUTCString().slice(0, 3);
  return dayOfWeek
}

//gets index positions of weather forecast data at 12pm
function getDayIndices(forecast_data) {
  let dayIndices = [];
  dayIndices.push(0);

  let index = 0;
  let temp = forecast_data.list[index].dt_txt.slice(8, 10);

  for (let i = 0; i < 4; i++) {
    while (
      temp === forecast_data.list[index].dt_txt.slice(8, 10) ||
      forecast_data.list[index].dt_txt.slice(11, 13) !== '12'
    ) {
      index++;
    }
    dayIndices.push(index);
    temp = forecast_data.list[index].dt_txt.slice(8, 10);
  }
  return dayIndices;
};

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            country: "",
            city: "Singapore",
            city_display: "",
            temp_curr: "",
            temp_min: "",
            temp_max: "",
            main: "",
            humidity: "",
            pressure: "",
            visibility: "",
            cloud: "",
            icon: "",
            date_1:"",
            date_2:"",
            date_3:"",
            date_4:"",
            date_5:"",
            temp_1: "",
            temp_2: "",
            temp_3: "",
            temp_4: "",
            temp_5: "",
            indices: [],
        }
        this.fetch_weather();
    }

    //calls API for relevant data
    fetch_weather = () => {
        Promise.all([
        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${this.state.city}&appid=${API_KEY}`),
        fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${this.state.city}&appid=${API_KEY}`)
        ]).then(([current, forecast]) => Promise.all([current.json(), forecast.json()]))
            .then(([current, forecast]) => {
                this.setState({ forecast: forecast });
                this.setState({ country: current.sys.country });
                this.setState({ city_display: current.name })
                this.setState({ temp_curr: (current.main.temp - 273.15).toFixed(1) + "°" })
                this.setState({ temp_min: (current.main.temp_min - 273.15).toFixed(1) + "°" })
                this.setState({ temp_max: (current.main.temp_max - 273.15).toFixed(1) + "°" })
                this.setState({ city_display: current.name })
                this.setState({ main: capitalizeFirstLetter(current.weather[0].description) })
                this.setState({ humidity: current.main.humidity + "%" })
                this.setState({ pressure: current.main.pressure + " hPa" })
                this.setState({ visibility: (current.visibility / 1000).toFixed(0) + " Km" })
                this.setState({ cloud: current.clouds.all + "%" })
                this.setState({ icon: current.weather[0].icon })
                this.setState({indices : getDayIndices(forecast)})
                this.setState({temp_1 : (forecast.list[this.state.indices[0]].main.temp - 273.15).toFixed(1) + "°" })
                this.setState({temp_2 : (forecast.list[this.state.indices[1]].main.temp - 273.15).toFixed(1) + "°" })
                this.setState({temp_3 : (forecast.list[this.state.indices[2]].main.temp - 273.15).toFixed(1) + "°" })
                this.setState({temp_4 : (forecast.list[this.state.indices[3]].main.temp - 273.15).toFixed(1) + "°" })
                this.setState({temp_5 : (forecast.list[this.state.indices[4]].main.temp - 273.15).toFixed(1) + "°" })
                this.setState({date_1 : forecast.list[this.state.indices[0]].dt_txt})
                this.setState({date_2 : forecast.list[this.state.indices[1]].dt_txt})
                this.setState({date_3 : forecast.list[this.state.indices[2]].dt_txt})
                this.setState({date_4 : forecast.list[this.state.indices[3]].dt_txt})
                this.setState({date_5 : forecast.list[this.state.indices[4]].dt_txt})
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setState({ loading: false });
            });
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar translucent={true} backgroundColor="#000" />
                <ImageBackground source={require('./assets/Drizzle.jpg')}
                    style={styles.Image_Background_Style}>

                    <View style={styles.Search_View}>
                        <TextInput placeholder="Search" placeholderTextColor="#FFF" style={styles.Search} onChangeText={(text) => this.setState({ city: text })} />
                        <TouchableOpacity style={styles.button_touch} onPress={this.fetch_weather}>
                            <Icon name="search1" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.City_Description}>
                        <Icon name="tag" size={18} color="#FFF" />
                        <Text style={styles.city_text}>{this.state.city_display}</Text>
                    </View>

                    <View style={styles.City_Description}>
                        <Text style={styles.city_text}>{date}</Text>
                    </View>

                    <View style={styles.Main_Temperature}>
                        <Text style={styles.temperature_text}>{this.state.temp_curr}</Text>
                    </View>

                    <View style={styles.Main_Description}>
                        <View style={styles.Icon_View}>
                            <Image tintColor='#FFF' source={{ uri: "http://openweathermap.org/img/wn/" + this.state.icon + "@2x.png", }} style={styles.Weather_Image} />
                        </View>
                    </View>

                    <View style={styles.Main_Description}>
                        <Text style={styles.city_text}>{this.state.main}</Text>
                    </View>

                    <View style={styles.Sub_Temperature}>
                        <Text style={styles.main_desc_text}>Low: {this.state.temp_min}</Text>
                        <Text style={styles.main_desc_text}>High: {this.state.temp_max}</Text>
                    </View>

                    <View style={styles.Main_Details}>
                        <Text style={styles.humidity_text}>Humidity : {this.state.humidity}</Text>
                        <Text style={styles.humidity_text}>Visibility : {this.state.visibility}</Text>
                        <Text style={styles.humidity_text}>Cloudiness : {this.state.cloud}</Text>
                        <Text style={styles.humidity_text}>Pressure : {this.state.pressure}</Text>

                    </View>

                    <View style={styles.Sub_Temperature}>
                        <Text style={styles.forecast_text}>{formatDate(this.state.date_1)}</Text>
                        <Text style={styles.forecast_text}>{formatDate(this.state.date_2)}</Text>
                        <Text style={styles.forecast_text}>{formatDate(this.state.date_3)}</Text>
                        <Text style={styles.forecast_text}>{formatDate(this.state.date_4)}</Text>
                        <Text style={styles.forecast_text}>{formatDate(this.state.date_5)}</Text>
                    </View>

                    <View style={styles.Sub_Temperature}>
                        <Text style={styles.forecast_temperature_1_text}>{this.state.temp_1}</Text>
                        <Text style={styles.forecast_temperature_2_text}>{this.state.temp_2}</Text>
                        <Text style={styles.forecast_temperature_3_text}>{this.state.temp_3}</Text>
                        <Text style={styles.forecast_temperature_4_text}>{this.state.temp_4}</Text>
                        <Text style={styles.forecast_temperature_5_text}>{this.state.temp_5}</Text>
                    </View>
                </ImageBackground>

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: Dev_Height,
        width: Dev_Width
    },

    Image_Background_Style: {
        height: "100%",
        width: "100%"
    },

    Search_View: {
        height: "20%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },

    Icon_View: {
        height: 100,
        width: 100,
        marginTop: "3%",
        marginLeft: "12%",
    },

    Search: {
        height: "30%",
        width: "80%",
        borderColor: "#FFF",
        borderWidth: 1,
        borderRadius: 20,
        color: "#FFF",
        paddingHorizontal: 15
    },

    button_touch: {
        marginLeft: "5%",
        height: "35%",
        width: "8%",
        justifyContent: "center",
        alignItems: "center"
    },

    City_Description: {
        height: "5%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",

    },

    Main_Description: {
        height: "8%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },

    Main_Temperature: {
        height: "15%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },

    Sub_Temperature: {
        height: "6%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },

    Forecast_Temperature: {
        height: "6%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },

    Main_Details: {
        marginLeft: "-4%",
        height: "15%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },

    Weather_Image: {
        height: "80%",
        width: "50%"
    },

    main_text: {
        fontSize: 25,
        color: "#FFF",
        fontWeight: "bold",
        marginLeft: "5%",
        marginRight: "5%",
    },

    main_desc_text: {
        fontSize: 20,
        color: "#FFF",
        fontWeight: "bold",
        marginLeft: "4%",
        marginRight: "4%",
    },

    city_text: {
        fontSize: 18,
        color: "#FFF",
        marginLeft: "2%",
        marginRight: "2%",
    },

    temperature_text: {
        fontSize: 80,
        color: "#FFF",
        marginLeft: "6%"
    },

    humidity_text: {
        fontSize: 16,
        color: "#FFF",
        marginLeft: "8%",
        marginTop: "1%"
    },

    forecast_text: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF",
        marginTop: "3%",
        marginLeft: "4%",
        marginRight: "4%",
    },

    forecast_temperature_1_text: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF",
        marginTop: "2%",
        marginLeft: "1%",
    },

    forecast_temperature_2_text: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF",
        marginTop: "2%",
        marginLeft: "7%",
    },

    forecast_temperature_3_text: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF",
        marginTop: "2%",
        marginLeft: "7%",

    },
    forecast_temperature_4_text: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF",
        marginTop: "2%",
        marginLeft: "6%",
    },

    forecast_temperature_5_text: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF",
        marginTop: "2%",
        marginLeft: "6%",
    },

})
