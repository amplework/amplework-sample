import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Platform,
  BackHandler,
} from 'react-native';
import database from '@react-native-firebase/database';
import {connect} from 'react-redux';
import _ from 'lodash';
import * as actions from '../../store/community/actions';
import styles from './styles';
import {Images, Colors} from '../../themes';
import CommunityItem from './communityItem';
import InterestModal from './interestModal';
import {AppLoader} from '../../components';
import {showSnackBar} from '../../utils';

class Community extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      categories: [],
      modalCategory: false,
      refreshing: false,
      error: '',
    };
    this.fetchPostsFromServer = this.fetchPostsFromServer.bind(this);
    this.fetchInterestsFromServer = this.fetchInterestsFromServer.bind(this);
    this.modalAction = this.modalAction.bind(this);
    this.gotoAddPost = this.gotoAddPost.bind(this);
    this.gotoPostDetail = this.gotoPostDetail.bind(this);
    this.renderCategories = this.renderCategories.bind(this);
    this.renderCategoryItem = this.renderCategoryItem.bind(this);
    this.renderContentList = this.renderContentList.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onSelectInterest = this.onSelectInterest.bind(this);
    this.likePostServer = this.likePostServer.bind(this);
    this.unlikePostServer = this.unlikePostServer.bind(this);
    this.editPost = this.editPost.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {
    const {route} = this.props;
    // if (route.name != 'Home') {
    //   BackHandler.addEventListener('hardwareBackPress', () => {
    //     // this.props.navigation.navigate('Home');
    //     this.props.navigation.pop();
    //     return true;
    //   });
    // }

    this.fetchInterestsFromServer();
    this.fetchPostsFromServer(false);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.posts != this.props.posts ||
      nextState.loading != this.state.loading ||
      nextState.modalCategory != this.state.modalCategory ||
      nextState.categories != this.state.categories ||
      nextState.refreshing != this.state.refreshing ||
      nextProps.postsUpdated != this.props.postsUpdated
    ) {
      return true;
    }
    return false;
  }

  _onRefresh = () => {
    this.fetchPostsFromServer(true);
  };

  editPost = item => {
    this.props.navigation.navigate('addPost', {data: item});
  };

  fetchPostsFromServer = async (isRefreshing = false) => {
    const {getPostsList} = this.props;
    const {categories} = this.state;
    var interestsSelected = categories.map(function(a) {
      return a.id;
    });
    if (!isRefreshing) {
      this.setState({loading: true});
    } else {
      this.setState({refreshing: true});
    }

    await getPostsList(interestsSelected)
      .then(response => {
        // console.log('response postList: ', response);
        this.setState({loading: false, refreshing: false});
        if (
          response.payload &&
          response.payload.data &&
          response.payload.status == 200
        ) {
        } else {
          const newReference = database()
          .ref('/community')
          .push();

          newReference
          .set(JSON.stringify(response.payload))
          alert(response.payload.message);
          //alert('Error while fetching posts. Please try again.');
        }
      })
      .catch(err => {
        console.log(err);
        alert(err.message);
      });
  };

  fetchInterestsFromServer = async () => {
    const {getInterestsList} = this.props;
    await getInterestsList()
      .then(response => {
        console.log('Fetching interest-- ', response.payload.message);

        if (
          response.payload &&
          response.payload.data &&
          response.payload.status == 200
        ) {
        } else {
          alert(response.payload.message);
          // alert('Error while fetching interests. Please try again.');
        }
      })
      .catch(err => {
        alert(err.message);
        console.log('Error in Community ', err);
      });
  };

  likePostServer = async item => {
    const {userId, likePost} = this.props;
    let data = {
      userId: userId,
      postId: item.id,
    };
    await likePost(data).then(response => {
      if (
        response.payload &&
        response.payload.data &&
        response.payload.status == 200
      ) {
      } else {
        showSnackBar({
          message: 'Error while reacting to post. Please try again.',
        });
      }
    });
  };

  unlikePostServer = async item => {
    const {unlikePost} = this.props;

    await unlikePost(item.like.id, item.id).then(response => {
      if (response.payload && response.payload.status == 204) {
      } else {
        showSnackBar({
          message: 'Error while reacting to post. Please try again.',
        });
      }
    });
  };

  modalAction = () => {
    this.setState({
      modalCategory: !this.state.modalCategory,
    });
  };

  gotoAddPost = () => {
    this.props.navigation.navigate('addPost');
  };

  gotoPostDetail = item => {
    this.props.navigation.navigate('postDetails', {item: item});
  };

  gotoUserPosts = item => {
    const {userId} = this.props;
    if ((item.userId = userId)) {
      this.props.navigation.navigate('selfPosts');
    }
  };

  onSelectInterest = items => {
    this.setState(
      {
        categories: items,
      },
      this.fetchPostsFromServer,
    );
  };

  renderHeader() {
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{'Community'}</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={styles.btnFilter}
            activeOpacity={0.4}
            onPress={this.modalAction}>
            <Image source={Images.filterIcon} style={styles.filterIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnFilter}
            activeOpacity={0.4}
            onPress={this.gotoAddPost}>
            <Image source={Images.plusIcon} style={styles.filterIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderCategories = () => {
    const {categories} = this.state;
    if (categories.length > 0) {
      return (
        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            contentContainerStyle={styles.flatlistHorizontalContent}
            horizontal
            renderItem={this.renderCategoryItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      );
    } else return null;
  };

  renderCategoryItem = ({item, index}) => {
    return (
      <TouchableOpacity style={styles.tag} activeOpacity={0.7}>
        <Text style={styles.tagTitle}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  renderContentList = () => {
    const {posts, postsUpdated} = this.props;
    const {refreshing} = this.state;

    return (
      <View style={{flex: 1}}>
        <FlatList
          data={posts}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              colors={Platform.OS == 'ios' ? [Colors.white] : [Colors.green]}
              tintColor={Platform.OS == 'ios' ? Colors.white : Colors.green}
              onRefresh={this._onRefresh}
            />
          }
          contentContainerStyle={styles.flatlistContent}
          renderItem={this.renderItem}
          extraData={postsUpdated}
          keyExtractor={(item, index) => item.id}
        />
      </View>
    );
  };

  renderItem = ({item, index}) => {
    return (
      <CommunityItem
        item={item}
        onPressDetail={this.gotoPostDetail}
        onPressUser={this.gotoUserPosts}
        likePost={this.likePostServer}
        unlikePost={this.unlikePostServer}
        onEdit={this.editPost}
        isLiked={item.isLiked}
        comments={item.comments}
      />
    );
  };

  render() {
    const {modalCategory, loading, categories} = this.state;
    return (
      <View style={styles.container}>
        <SafeAreaView style={{flex: 1}}>
          {this.renderHeader()}
          {this.renderCategories()}
          {this.renderContentList()}
          <InterestModal
            visible={modalCategory}
            selecetdTags={categories}
            onSelectInterest={this.onSelectInterest}
            onPress={this.modalAction}
          />
        </SafeAreaView>
        <AppLoader loading={loading} />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    posts: state.community.posts,
    postsUpdated: state.community.postsUpdated,
    interests: state.community.interests,
    userId: state.user.id,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPostsList: data => dispatch(actions.getPostsList(data)),
    getInterestsList: () => dispatch(actions.getInterestsList()),
    likePost: data => dispatch(actions.likePost(data)),
    unlikePost: (id, postId) => dispatch(actions.unlikePost(id, postId)),
  };
}

const CommunityContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Community);

export default CommunityContainer;
