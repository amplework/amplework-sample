import React, { Component } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, StatusBar, Alert, Platform, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import RNSoftInputMode from 'rn-soft-input-mode';
import { GiftedChat, Bubble, InputToolbar, Send, Composer, MessageText, Time, Actions, Day, MessageImage } from 'react-native-gifted-chat'
import styles from './styles';
import uuid from 'uuid';
import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import { isSameDay } from 'react-native-gifted-chat/lib/utils';
import { Colors, Images, Fonts, Metrics } from '../../../themes';
import * as actions from '../../../store/chat/actions';
import * as userActions from '../../../store/user/actions';
import { sendMessage, socketSendMessageKey, registerSocketEvent, deregisterSocketEvent } from '../../../helpers/socket'
import { AppLoader } from '../../../components';
import { getImageFromImagePicker } from '../../../utils';
const { LAYOUT_PARAMS } = RNSoftInputMode;

class Chating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loading: false
    };
    this.goBack = this.goBack.bind(this);
    this.onSend = this.onSend.bind(this);
    this.getOlderChats = this.getOlderChats.bind(this);
    this.registerListner = this.registerListner.bind(this);
    this.onActionPressed = this.onActionPressed.bind(this);
    this.onSelectAction = this.onSelectAction.bind(this);
    this.uploadMedia = this.uploadMedia.bind(this);
    this.success = this.success.bind(this);
    this.sendImageMessage = this.sendImageMessage.bind(this);
  }

  componentDidMount() {
    this.getOlderChats()  
    this.registerListner()
    RNSoftInputMode.setSoftInputMode(LAYOUT_PARAMS.SOFT_INPUT_ADJUST_RESIZE)
    .then(oldSoftInputMode => {})
    .catch(reason => console.error(reason));
  }

  onActionPressed = () => {
    // Alert.alert('Info', 'Coming soon')
    this.actionSheetRef.show()
  }

  getOlderChats = () => {
    const { userId, route, getChatList } = this.props;
    const { params } = route;
    if(params && params.userDetails && params.userDetails.id) {
      let senderId = params.userDetails.id
      this.setState({ loading: true })
      getChatList(senderId)
      .then(response => {
        if(response.payload && response.payload.data && response.payload.status == 200) {
          let data = (response.payload.data.length > 0) ? response.payload.data : []
          data.reverse()
          data.map(msg => {
            msg._id = msg.id
            msg.text = msg.message
            msg.createdAt = msg.created
            msg.user = {
              _id: msg.userId
            }
            delete msg.id
            delete msg.message
            delete msg.created
          })
          this.setState({ messages: data, loading: false })
        } else {
          this.setState({ messages: [], loading: false })
          Alert.alert('Error while fetching older chats. Please try again.')
        }
      })
    }
  }

  error(image) {
    // console.log("on error called", image)
  }

  cancel(image) {
    // console.log("on cancel called", image)
  }

  success = (image) => {
    console.log('image: ', image);
    this.uploadMedia(image)
  }

  uploadMedia = async(image) => {
    const { uploadImage, userId, route } = this.props;
    const { params } = route;
    let randomId = uuid.v4()// moment().toISOString()
    if(params && params.userDetails && params.userDetails.id) { 
      let message = {
        "_id": randomId,
        "text": '',
        "user": {
          _id: userId
        },
        "senderId": params.userDetails.id,
        "seen": [
          userId 
        ],
        "image": image.path,
        "createdAt": Date(),
        "sending": true
      }
      // sendMessage(socketSendMessageKey, JSON.stringify(data))
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, [message], true),
      }), async () => {
        try {
          let uri = 'file://' + image.path;
          let ext = uri.split('.').pop();
          let fullImageName = `${userId}-${moment().unix()}.${ext}`
          let file = {
            "name": fullImageName,
            "type": image.mime,
            "uri": image.path,
            "size": image.size,
          }
    
          // console.log('file: ', file);
    
          await uploadImage(file)
          .then(response => {
            if(response.payload && response.payload) {
              let imageData = JSON.parse(response.payload)
              // console.log('response image url: ', imageData.files);
              let data = {
                "userId": userId,
                "senderId": params.userDetails.id,
                "seen": [
                  userId 
                ],
                "image": imageData.files
              }
              this.sendImageMessage(data, randomId)
            }
          })
          .catch(err => {
            console.log('uploading error: ', err);
          })
        } catch (err) {
          console.log('uploadMedia error: ', err);
        }
      })
    }
  }

  sendImageMessage = (data, chatId) => {
    sendMessage(socketSendMessageKey, JSON.stringify(data))
    let array = this.state.messages
    let index = array.findIndex(item => {
      return item._id = chatId
    })
    if (index != -1) {
      array[index].sending = false
      this.setState({ messages: array })
    }
  }

  onSelectAction = (index) => {
    
    if(index === 2) return;

    getImageFromImagePicker({
      type: (index == 0) ? 'camera' : 'library',
      onSuccess: this.success,
      onError: this.error, onCancel: this.cancel,
      // width: wp(100),
      // height: wp(48.26)
    })
  }

  registerListner = () => {
    const { userId, route } = this.props;
    const { params } = route;
    let _this = this;
    registerSocketEvent(socketSendMessageKey, function(data){
      let recievedData = JSON.parse(data)
      if(recievedData && recievedData.senderId == userId) {
        if(params && params.userDetails && params.userDetails.id && params.userDetails.id == recievedData.userId) {
          recievedData._id = recievedData.id
          recievedData.text = recievedData.message
          recievedData.createdAt = recievedData.created

          delete recievedData.message
          delete recievedData.created
          _this.setState(previousState => ({
            messages: GiftedChat.prepend(previousState.messages, [recievedData]),
          }))
        }
      }
    })
  }

  componentWillUnmount() {
    deregisterSocketEvent(socketSendMessageKey, function(data){
      console.log('deregistered');
    })
    RNSoftInputMode.setSoftInputMode(LAYOUT_PARAMS.SOFT_INPUT_ADJUST_PAN)
    .then(oldSoftInputMode => {})
    .catch(reason => console.error(reason));
  }

  goBack = () => {
    this.props.navigation.pop()
  }

  onSend = (messages = []) => {
    console.log('messages: ', messages);
    if(messages.length > 0 && messages[0].text.trim().length > 0) {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        const { userId, route } = this.props;
        const { params } = route;
        if(params && params.userDetails && params.userDetails.id) {
          
          let data = {
            "message": messages[0].text.trim(),
            "userId": userId,
            "senderId": params.userDetails.id,
            "seen": [
              userId 
            ]
          }
          sendMessage(socketSendMessageKey, JSON.stringify(data))
        }
      })
    }
  }

  renderInputToolbar(props) {
    return (
      <InputToolbar
        {...props}
        options={[]}
        containerStyle={styles.inputToolbar}
      />
    )
  }

  renderComposer = (props) => {
    let fontStyle = Platform.OS == 'android' ? { fontWeight: 'normal' } : {}
    return (
      <View style={styles.composerContainer}>
        <Composer
          {...props}
          textInputStyle={[styles.textInputProps, fontStyle]}
          textInputProps={{ autoCorrect: false }}
        />
        <Actions
          {...props} 
          containerStyle={{marginTop: 8}}
          onPressActionButton={this.onActionPressed}
          icon={() => <Image
            source={Images.attechment}
            style={styles.attachmentIcon}
          />}
          />
        <Send
          {...props}
          key={'send'}
          alwaysShowSend
          containerStyle={styles.sendContainer}
          children={
            <Image
              source={Images.sendMessageIcon}
              style={styles.sendIcon}
            />
          }
          />
      </View>
    );
  }

  renderMessageText(props) {
    return (
      <MessageText
        {...props}
        textStyle={{
          left: [{ color: Colors.gray74 }],
          right: [{ color: Colors.white }]
        }}
      />
    )
  }

  renderMessageImage(props) {
    return(
      <View>
        <MessageImage
        {...props}
        containerStyle={{
          flex:1
        }}

        imageStyle={{
          backgroundColor: Colors.gray238,
          width: Metrics.screenWidth * 0.7,
          height: Metrics.screenHeight * 0.18,
          borderRadius: 13
        }}
      />
        {props.currentMessage.sending ?
             <ActivityIndicator style={{ alignSelf: 'flex-end', margin: 5 }} size="small" color={Colors.white} />
            : null}
      </View>
    )
  }

  renderBubble(props) {
    return (
      <View style={{ paddingVertical: 0 }}>
        <Bubble
          {...props}
          renderTime={() => { }}
          wrapperStyle={{
            left: [
              {
                backgroundColor: Colors.gray242,
                paddingVertical: (props.currentMessage.image && props.currentMessage.image != '') ? 0 : 10
              }
            ],
            right: [
              {
                backgroundColor: Colors.green,
                paddingVertical: (props.currentMessage.image && props.currentMessage.image != '') ? 0 : 10
              }
            ]
          }}
        />
        <Time
          {...props}
          containerStyle={{
            left: [
              {
                paddingVertical: 5,
                alignItems: 'flex-start'
              }
            ],
            right: [
              {
                paddingVertical: 5,
              }
            ]
          }}
          timeTextStyle={{
            left: [
              {
                color: Colors.gray115,
                fontFamily: Fonts.type.medium,
                fontSize: Metrics.fontSize(13),
                letterSpacing: 0.38
              }
            ],
            right: [
              {
                color: Colors.gray115,
                fontFamily: Fonts.type.medium,
                fontSize: Metrics.fontSize(13),
                letterSpacing: 0.38
              }
            ]
          }}
        />
      </View>
    )
  }

  renderDay = (props) => {
    const { currentMessage, previousMessage } = props;
    if (currentMessage && !isSameDay(currentMessage, previousMessage)) {
      return (
        <View style={styles.dateView}>
          <View style={styles.horizontalLineView} />
          <Day {...props} />
          <View style={styles.horizontalLineView} />
        </View>
      ) 
    }
  }

  renderHeader() {
    const { params } = this.props.route
    let name = ''
    let image = null
    let userType = ''

    if(params && params.userDetails && params.userDetails.id) {
      name = params.userDetails.name
      image = (params.userDetails.image) ? params.userDetails.image : null
      userType = (params.userDetails.userType) ? params.userDetails.userType : ''
    }
    return(
      <View style={styles.header}>
        <TouchableOpacity onPress={this.goBack}>
          <Image source={Images.backIcon} style={styles.homeIcon} />
        </TouchableOpacity>
        <View style={styles.namContainer}>
          <FastImage source={(image) ? {uri: image} : Images.sampleUser} style={styles.userImage} />
          <View style={styles.textContainer}>
            <View style={styles.userNameView}>
              <Text numberOfLines={1} style={styles.userNameText}>{name}</Text>
            </View>
            <Text numberOfLines={1} style={styles.titleText}>{userType}</Text>
          </View>
        </View>
      </View>
    )
  }

  render() {
    const { loading, messages } = this.state;
    const { userId } = this.props;
    return (
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.white }} />
        <StatusBar barStyle={'dark-content'} />
        
        <SafeAreaView style={{ flex: 1 }}>
          {this.renderHeader()}
          <View style={{ flex: 1, }}>
            <GiftedChat
              renderComposer={this.renderComposer}
              messagesContainerStyle={{ backgroundColor: Colors.white }}
              messages={messages}
              onSend={messages => this.onSend(messages)}
              user={{ _id: userId, }}
              renderMessageText={this.renderMessageText}
              renderMessageImage={this.renderMessageImage}
              renderBubble={this.renderBubble}
              alwaysShowSend={false}
              renderSend={() => {}}
              renderDay={this.renderDay}
              renderAvatar={null}
              inverted={true}
              showUserAvatar={false}
              showAvatarForEveryMessage={false}
              isCustomViewBottom={false}
              listViewProps={{ flex: 1, paddingHorizontal: wp(5.33) }}
              placeholder={''}
              // scrollToBottom={true}
              alignTop={true}
              
            />
          </View>
        </SafeAreaView>
        <ActionSheet
          ref={ref => this.actionSheetRef = ref}
          options={['Camera', 'Library', 'Cancel']}
          cancelButtonIndex={2}
          onPress={this.onSelectAction}
        />
        <AppLoader loading={loading} />
      </View>
    );
  }
};

function mapStateToProps(state) {
  return {
    image: state.user.image,
    userId: state.user.id,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getChatList: (senderId) => dispatch(actions.getChatList(senderId)),
    uploadImage: (file) => dispatch(userActions.uploadImage(file)),
  }
}

const ChatContainer = connect(mapStateToProps, mapDispatchToProps)(Chating)

export default ChatContainer;
