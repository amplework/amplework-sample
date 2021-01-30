import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView,
  FlatList, KeyboardAvoidingView, TextInput, BackHandler, Platform, StatusBar, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../../../store/community/actions';
import styles from './styles';
import { Images, Colors } from '../../../themes';
import CommentItem from '../commentItem';
import PostItem from './postItem';
import { AppLoader } from '../../../components';
import { showSnackBar } from '../../../utils';
import Toast from 'react-native-simple-toast';

class PostDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      postingComment: false,
      comment: ''
    }
    this.backAction = this.backAction.bind(this);
    this.renderList = this.renderList.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.likePostServer = this.likePostServer.bind(this);
    this.unlikePostServer = this.unlikePostServer.bind(this);
    this.send = this.send.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.editPost = this.editPost.bind(this);
  }

  componentDidMount() {
    this.getPostDetailsFromServer()
  }
  
  componentWillUnmount() {
    setTimeout(() => {
      this.props.removePostDetail()
    }, 100);
  }

  backAction = () => {
    this.props.navigation.pop()
  }

  editPost = () => {
    const { postDetail } = this.props;
    this.props.navigation.navigate('addPost', { data: postDetail })
  }

  getPostDetailsFromServer = () => {
    const { getPostDetails } = this.props;
    const { params } = this.props.route;
    const { item } = params;
    this.setState({ loading: true })
    getPostDetails(item.id)
    .then(response => {
      console.log('post detail:', response);
      if (response.payload && response.payload.data && response.payload.status == 200) {
        this.setState({
          loading: false
        })
      } else {
        this.setState({ loading: false })
        if(response.payload && response.payload.response && response.payload.response.status == 404) {
          // showSnackBar({
          //   message: 'Post deleted by owner'
          // })
          Toast.show('Post deleted by owner', Toast.SHORT);
          this.backAction()
        } else {
          Alert.alert('Error while getting post details. Please try again.')
        }
      }
    })
  }

  likePostServer = async (item) => {
    const { userId, likePost } = this.props;
    const { postDetail } = this.props;
    let data = {
      "userId": userId,
      "postId": postDetail.id
    }
    await likePost(data)
      .then(response => {
        if (response.payload && response.payload.data && response.payload.status == 200) {
          
        } else {
          showSnackBar({
            message: 'Error while reacting to post. Please try again.'
          })
        }
      })
  }

  unlikePostServer = async (item) => {
    const { unlikePost } = this.props;

    await unlikePost(item.like.id, item.id)
      .then(response => {
        if (response.payload && response.payload.status == 204) {
          
        } else {
          showSnackBar({
            message: 'Error while reacting to post. Please try again.'
          })
          // alert('Error while fetching interests. Please try again.')
        }
      })
  }

  send = () => {
    const { postComment, userId, postDetail } = this.props;
    const { comment } = this.state;
    let _this = this;
    let data = {
      'userId': userId,
      'postId': postDetail.id,
      'comment': comment.trim()
    }
    this.setState({ postingComment: true })
    postComment(data)
    .then(response => {
      if(response.payload && response.payload.data && response.payload.status == 200) {
        this.setState({
          comment: '',
          postingComment: false
        })
        setTimeout(() => {
          _this.flatList.scrollToEnd()  
        }, 200);
        
      } else {
        console.log('Error while posting comment.');
        this.setState({
          postingComment: false
        })
      }
    })
  }

  renderList = () => {
    const { postDetail } = this.props;
    if (postDetail) {
      let data = ['top']
      let origin = _.concat(data, postDetail.comments)
      
      return (
        <FlatList
          data={origin}
          ref={ref => this.flatList = ref}
          style={styles.flatlist}
          removeClippedSubviews
          contentContainerStyle={styles.flatlistContent}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )
    } else return null;
  }

  renderItem = ({ item, index }) => {
    if (index == 0) {
      const { postDetail } = this.props;
      return (
        <PostItem
          item={postDetail}
          likePost={this.likePostServer}
          unlikePost={this.unlikePostServer}
          isLiked={postDetail.isLiked}
        />
      )
    } else {
      return (
        <CommentItem item={item} />
      )
    }
  }

  renderInput = () => {
    const { comment, postingComment } = this.state;
    const { postDetail } = this.props;
    const disabled = (comment.trim().length == 0) || postingComment
    if(postDetail){
      let item = (
        <View style={styles.bottomContainer}>
          <TextInput
            style={styles.input}
            placeholder={''} //Write your comment...
            placeholderTextColor={Colors.gray74}
            onChangeText={text => this.setState({ comment: text })}
            value={comment}
            underlineColorAndroid='transparent'
          />
          <TouchableOpacity
            onPress={this.send}
            disabled={disabled}>
            <Text style={(disabled) ? styles.disabledSend : styles.send}>Send</Text>
          </TouchableOpacity>
        </View>
      )
      
      if(Platform.OS == 'ios') {
        return(
        <KeyboardAvoidingView behavior={'position'} >
          {item}        
        </KeyboardAvoidingView>
        );
      } else {
        return item;
      }

    } else return null;


  }

  render() {
    const { loading } = this.state;
    const { userId, postDetail } = this.props;
    const { params } = this.props.route;
    const { item } = params;
    return (
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.item}>
            <View style={styles.topSection}>
              <View style={styles.nameContainer}>
                <TouchableOpacity style={styles.btnBack} onPress={this.backAction}>
                  <Image source={Images.backIcon} style={styles.backIcon} />
                </TouchableOpacity>
                {
                  (postDetail && postDetail.user && postDetail.user.image) ?
                    <FastImage source={{ uri: postDetail.user.image }} style={styles.userImage} />
                    :
                    <Image source={Images.sampleUser} style={styles.userImage} />
                }

                <Text numberOfLines={1} style={styles.username}>{(postDetail && postDetail.user) ? postDetail.user.name : '-'}</Text>
              </View>
              {
                (postDetail && postDetail.user && postDetail.user.id === userId) ?
                  <TouchableOpacity style={styles.btnEdit} onPress={this.editPost}>
                    <Image source={Images.editIcon} style={styles.editIcon} />
                  </TouchableOpacity>
                  : null
              }

            </View>
          </View>
          <View style={styles.flatlistContainer}>
            {this.renderList()}
          </View>
          {this.renderInput()}

        </SafeAreaView>
        <AppLoader loading={loading} />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    userId: state.user.id,
    postDetail: state.community.postDetail,
    postDetailUpdated: state.community.postDetailUpdated
  }
}

function mapDispatchToProps(dispatch) {
  return {
    likePost: (data) => dispatch(actions.likePost(data)),
    unlikePost: (id, postId) => dispatch(actions.unlikePost(id, postId)),
    getPostDetails: (id) => dispatch(actions.getPostDetails(id)),
    postComment: (data) => dispatch(actions.postComment(data)),
    removePostDetail: () => dispatch(actions.removePostDetail()),
  }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(PostDetail)

export default Container;