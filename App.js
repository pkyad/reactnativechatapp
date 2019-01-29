import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ToastAndroid,
  ScrollView,
  TextInput,
  Alert,
  FlatList,
  Button,
  NetInfo
} from 'react-native';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';

var autobahn = require('react-native-autobahnjs');
//var WEBSOCKET_API_URL = 'ws://wamp.cioc.in:8090/ws';

var FALLBACK_API_URL = 'ws://ws.syrow.com:8080/ws';
var DOMAIN_PREFIX = 'default';
var ImagePicker = require('react-native-image-picker');
//import Icon from 'react-native-vector-icons/MaterialIcons';
import { StatusBar } from 'react-native';

export default class Chat extends Component {



  constructor(props) {
    super(props);

    this.array = [{
      title: 'ONE', type: 'In', date: '12:00:01 am', uri: ''
    },
    {
      title: 'TWO', type: 'out', date: '12:00:03 am', uri: ''
    },
    {
      title: 'THREE', type: 'In', date: '12:00:50 am', uri: ''

    },
    {
      title: 'FOUR', type: 'out', date: '12:02:40 am', uri: ''
    },
    {
      title: 'FIVE', type: 'In', date: '12:07:10 am', uri: ''
    }
    ],

      this.state = {

        arrayHolder: [],
        filePath: {},

        textInput_Holder: '',
        time: '',
        fileUri: '',
        fileType: '',
        fileName: '',
        fileSize: '',
        connection_Status : ""

      }


    /* this.state = {
      data: [
         {id:1, date:"9:50 am", type:'in',  message: "Hii!"},
         {id:2, date:"9:50 am", type:'out', message: "Hello!"} ,
         {id:3, date:"9:50 am", type:'in',  message: "How r u?"}, 
         {id:4, date:"9:50 am", type:'in',  message: "fine"}, 
         {id:5, date:"9:50 am", type:'out', message: "Where r u?"}, 
         {id:6, date:"9:50 am", type:'out', message: "vvvvvvvv"}, 
         {id:7, date:"9:50 am", type:'in',  message: "IIIIIIII"}, 
         {id:8, date:"9:50 am", type:'in',  message: "dvgsdgsdg"},
         {id:9, date:"9:50 am", type:'in',  message: "kkgkghjkjjfjfghjfgdjrjrtjrtjrtjrtjrtjtrjdfgjfgjgjfgjfgjjjjjjjgjfjgfdjjggdj"},
       ]
     }; */


  }

  componentDidMount() {


    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange

  );

  NetInfo.isConnected.fetch().done((isConnected) => {
 
    if(isConnected == true)
    {
      ToastAndroid.show('online', ToastAndroid.SHORT);
      this.setState({connection_Status : "Online"})
    }
    else
    {
      ToastAndroid.show('offline', ToastAndroid.SHORT);
      this.setState({connection_Status : "Offline"})
    }

  });
 
  
    fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(response => response.json())
    .then(json =>  ToastAndroid.show(''+JSON.stringify(json), ToastAndroid.LONG))  
 
    var connection = new autobahn.Connection({
      url:WEBSOCKET_API_URL,
      realm: DOMAIN_PREFIX
    });
    
    connection.onopen = function (session) {
      ToastAndroid.show('open', ToastAndroid.LONG);
    };
    connection.onclose = function (reason,details) {

      
      ToastAndroid.show('close'+reason+""+details.keyExtractor, ToastAndroid.LONG);
      //on close.
    };
    connection.open();

    this.setState({ arrayHolder: [...this.array] })
    this.Clock = setInterval(() => this.GetTime(), 1000);

  }

  _handleConnectivityChange = (isConnected) => {
 
    if(isConnected == true)
      {
        this.setState({connection_Status : "Online"})
      }
      else
      {
        this.setState({connection_Status : "Offline"})
      }
  };
 
  GetTime() {

    // Creating variables to hold time.
    var date, TimeType, hour, minutes, seconds, fullTime;

    // Creating Date() function object.
    date = new Date();

    // Getting current hour from Date object.
    hour = date.getHours();

    // Checking if the Hour is less than equals to 11 then Set the Time format as AM.
    if (hour <= 11) {

      TimeType = 'am';

    }
    else {

      // If the Hour is Not less than equals to 11 then Set the Time format as PM.
      TimeType = 'pm';

    }


    // IF current hour is grater than 12 then minus 12 from current hour to make it in 12 Hours Format.
    if (hour > 12) {
      hour = hour - 12;
    }

    // If hour value is 0 then by default set its value to 12, because 24 means 0 in 24 hours time format. 
    if (hour == 0) {
      hour = 12;
    }


    // Getting the current minutes from date object.
    minutes = date.getMinutes();

    // Checking if the minutes value is less then 10 then add 0 before minutes.
    if (minutes < 10) {
      minutes = '0' + minutes.toString();
    }


    //Getting current seconds from date object.
    seconds = date.getSeconds();

    // If seconds value is less than 10 then add 0 before seconds.
    if (seconds < 10) {
      seconds = '0' + seconds.toString();
    }


    // Adding all the variables in fullTime variable.
    fullTime = hour.toString() + ':' + minutes.toString() + ':' + seconds.toString() + ' ' + TimeType.toString();


    // Setting up fullTime variable in State.
    this.setState({

      time: fullTime

    });
  }
  clearText = () => {
    this._textInput.setNativeProps({ text: '' });
  }

  //  document.getElementById("textfield2").value=""


  joinData = () => {


    this.array.push({ title: this.state.textInput_Holder, date: this.state.time.toString(), type: 'out', uri: '' });

    // this.array.push({ date:new Date().toLocaleString() });

    this.setState({ arrayHolder: [...this.array] });
    this.clearText();
  }
  attach() {

    this.array.push({ title: this.state.fileName, date: this.state.time.toString(), type: 'out', uri: this.state.filePath });

    // this.array.push({ date:new Date().toLocaleString() });

    this.setState({ arrayHolder: [...this.array] });
  }
  attachimage() {
   // this.state.fileUri = JSON.stringify(this.state.filePath)
    this.array.push({ title: this.state.fileName, date: this.state.time.toString(), type: 'out', uri:this.state.filePath  });
   
    // this.array.push({ date:new Date().toLocaleString() });

    this.setState({ arrayHolder: [...this.array] });
  }

  /*FlatListItemSeparator = () => {
    return (
      <Views
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#607D8B",
        }}
      />
    );
  } */

  GetItem(res) {

    Alert.alert(res);

  }

  renderDate = (date) => {
    return (
      <Text style={styles.time}>
        {date}
      </Text>
    );
  }
  handleChange() {
    //Opening Document Picker
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.allFiles()],
        //All type of Files DocumentPickerUtil.allFiles()
        //Only PDF DocumentPickerUtil.pdf()
        //Audio DocumentPickerUtil.audio()
        //Plain Text DocumentPickerUtil.plainText()
      },
      (error, res) => {
        this.setState({ fileUri: res.uri });
        this.setState({ filePath: res.uri });
        this.setState({ fileType: res.type });
        this.setState({ fileName: res.fileName });
        this.setState({ fileSize: res.fileSize });
        this.attach();

        // ToastAndroid.show(''+ fileUri, ToastAndroid.SHORT);
        console.log('res : ' + JSON.stringify(res));
        console.log('URI : ' + res.uri);
        console.log('Type : ' + res.type);
        console.log('File Name : ' + res.fileName);
        console.log('File Size : ' + res.fileSize);
      }
    );
  }
  chooseFile = () => {
    var options = {
      title: 'Select Image',

      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath: source,
          fileUri:source

       
        });
       // ToastAndroid.show(''+filePath, ToastAndroid.LONG);
        this.attachimage();
      }
    });
  };
  render() {

    return (


      <View style={styles.container}>

        <StatusBar backgroundColor="#4B0082" barStyle="light-content" />
        <View style={styles.navBar}>

          <View style={styles.leftnav}>

            <Image source={require('./image/usericon.png')} style={styles.avatar} />
            <Text style={styles.send}>Syrow  </Text></View>

          <View style={styles.rightNav}>
            <TouchableOpacity>
              <Image source={require('./image/call.png')} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('./image/video.png')} style={styles.image} />
            </TouchableOpacity>
          </View>

        </View>

        <FlatList style={styles.list}
          data={this.state.arrayHolder}

          width='100%'

          extraData={this.state.arrayHolder}

          keyExtractor={(index) => index.toString()
          }

          //  ItemSeparatorComponent={this.FlatListItemSeparator}

          renderItem={({ item }) => {

            let inMessage = item.type === 'In';
         
            let uriout = item.uri === '';
            let outmessage = item.type === 'out';
            //  let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
            if (inMessage) {
              let itemStyle = styles.itemIn
              return (<View style={[styles.listItemContainerin, itemStyle]}>

                <Image source={require('./image/usericon.png')} style={styles.avatar} />
                <View style={[styles.balloonin]}>

                  <Text  > {item.title} </Text>
                  <Text style={{ textAlign: "right", fontSize: 10, marginRight: 6 }} >{item.date}</Text>
                </View>
              </View>)

            } else if (outmessage && item.uri === '') {
              let itemStyle = styles.itemOut
              return (<View style={[styles.listItemContainerin, itemStyle]}>
                <Image source={require('./image/usericon.png')} style={styles.avatar} />
                <View style={[styles.balloon]}>
                  <Text  > {item.title} </Text>
                  <Text style={{ textAlign: "right", fontSize: 10, marginRight: 6 }} >{item.date}</Text>
                </View>
              </View>)
            }
            else if (outmessage && item.uri != '') {
           //   var filePath1= item.uri;
            ToastAndroid.show(''+item.uri , ToastAndroid.LONG);
              let itemStyle = styles.itemOut
              return (<View style={[styles.listItemContainerin, itemStyle]}>
                <Image source={require('./image/usericon.png')} style={styles.avatar} />
                <View style={[styles.balloonattach]}>
                  <Image
                    source={{ uri:this.state.filePath}}
                    style={{ width: 100, height: 100 }} />
                    
                  <Text  > {item.title} </Text>
                  <Text style={{ textAlign: "right", fontSize: 10, marginRight: 6 }} >{item.date}</Text>
                </View>
              </View>)
            }

          }


          }
          /*data={this.state.data}
          keyExtractor= {(item) => {
            return item.id;
          }} */
         /* renderItem={(item) => {
          //  console.log(item);
          //  const item = message.item;
         //   let inMessage = item.type === 'in';
           // let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
            return (
              <View style={[styles.listItemContainerin]}>
                 <Image source={require('./image/usericon.png')} style={styles.avatar} />
             
             
             <View style={[styles.balloon]}>
                  <Text onPress={this.GetItem.bind(this, item.title)}>{item.title}</Text>
                  <Text style={{ textAlign: "right", fontSize: 12, marginRight: 6 }} > {this.renderDate(item.date)}</Text>
                </View>
              
              </View>
            ) 
          }} *//>
        <View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
              ref={component => this._textInput = component}
              placeholder="Write a message..."

              underlineColorAndroid='transparent'
              onChangeText={data => this.setState({ textInput_Holder: data })}
            //   {this.state.fileUri ?  + this.state.fileUri : ''}
            //  onChangeText={(name_address) => this.setState({name_address})}
            // value={this.state.fileUri ? 'URI\n' + this.state.fileUri : ''}
            />
            <TouchableOpacity onPress={this.handleChange.bind(this)}>
              <Image source={require('./image/attach.png')} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.chooseFile}>
              <Image source={require('./image/photocamera.png')} style={styles.imagecam} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btnSend} onPress={this.joinData}    >

            <Image source={{ uri: "https://png.icons8.com/small/75/ffffff/filled-sent.png" }} style={styles.iconSend} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {


    flex: 1,

  },
  list: {
    paddingHorizontal: 17,

  },
  footer: {
    flexDirection: 'row',
    height: 60,
    // backgroundColor: '#eeeeee',
    paddingHorizontal: 10,
    padding: 5,
  },
  btnSend: {
    margin: 5,
    backgroundColor: "#4B0082",
    width: 40,
    height: 40,
    borderRadius: 360,

    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    margin: 5,
    marginLeft: 15,
    width: 25,
    height: 25
  },
  imageback: {
    margin: 5,
    marginLeft: 3,
    marginRight: 7,
    width: 25,
    height: 25
  },

  imagecam: {
    margin: 5,
    marginLeft: 8,
    marginRight: 10,
    width: 20,
    height: 20
  },
  iconSend: {
    margin: 5,
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  inputContainer: {
    margin: 5,

    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#4B0082',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  inputs: {
    height: 40,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  balloon: {
    marginVertical: 14,
    marginLeft: 3,
    backgroundColor: "#dafdda",
    maxWidth: 200,
    padding: 12,
    elevation: 1,
    borderRadius: 200,
  },
  balloonattach: {
    marginVertical: 14,
    marginLeft: 3,
    backgroundColor: "#dafdda",
    maxWidth: 200,
    padding: 12,
    elevation: 1,
    borderRadius: 10,
  },
  balloonin: {
    marginVertical: 14,
    backgroundColor: "#ffffff",
    maxWidth: 200,
    padding: 12,
    marginLeft: 3,
    elevation: 1,
    borderRadius: 200,
  },
  itemIn: {
    alignSelf: 'flex-start'
  },
  itemOut: {
    alignSelf: 'flex-end'
  },
  time: {
    alignSelf: 'flex-end',
    margin: 15,
    fontSize: 12,
    color: "#808080",
  },
  item: {
    marginVertical: 10,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "#eeeeee",
    borderRadius: 300,
    padding: 5,
  },
  avatar: {
    width: 40,
    height: 40,

    borderRadius: 30,
    alignSelf: 'center',
  },
  navBar: {
    height: 55,
    backgroundColor: '#4B0082',
    elevation: 3,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rightNav: {
    marginLeft: 20,
    flexDirection: 'row'
  },
  leftnav: {
    flexDirection: 'row',
    alignSelf: 'flex-start'
  },
  navItem: {
    marginLeft: 20
  },
  send: {
    marginLeft: 10,
    alignSelf: 'center',
    color: 'white',
    fontSize: 20

  },
  listItemContainerin: {

    flexDirection: 'row',

  },


});  