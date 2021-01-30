//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import styles from './styles';
import { Images, Metrics } from '../../../themes';
import { ImageLoader, MdocImage } from '../../../components';
import AutoHeightImage from 'react-native-auto-height-image';
import FlexImage from 'react-native-flex-image';

class PostItem extends Component {
  constructor(props) {
    super(props);
    this.handleLikePress = this.handleLikePress.bind(this)
  }

  handleLikePress = () => {
    const { item, likePost, unlikePost } = this.props;
    if(item.like && item.like.id) {
      unlikePost(item)
    } else {
      likePost(item)
    }
  }

  render() {
    const { item } = this.props;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.dateSection}>
          <View style={styles.nameContainer}>
            <Image source={Images.calendarSmaller} style={styles.calendarSmaller} />
            <Text numberOfLines={1} style={styles.postDate}>{moment(item.created).format('MMM DD yyyy')}</Text>
          </View>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.content}>{item.text}</Text>
        </View>
        {
          (item.image) ?
          <View style={styles.contentImageSection}>
            {/* <FastImage source={{uri: item.image}} style={[styles.postImage]} /> */}
            {/* <MdocImage
              source={item.image}
              // source={{uri: item.image}}
              style={styles.postImage}
              width={Metrics.screenWidth}
            /> */}
            {/* <AutoHeightImage
                width={Metrics.screenWidth}
                source={{uri: item.image}}
              /> */}
              <FlexImage
                source={{uri: item.image}}
                loadingComponent={<ImageLoader />}
                loadingMethod={'spinner'}
              />
          </View>
          : null
        }
        
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.actionContainer} activeOpacity={0.4} onPress={this.handleLikePress}>
            <Image source={(item.isLiked) ? Images.liked : Images.unlikeIcon} style={styles.likeIcon} />
            <Text numberOfLines={1} style={styles.counts}>{item.likes + ' Likes'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionContainer2} activeOpacity={0.4}>
            <Image source={Images.commentIcon} style={styles.likeIcon} />
            <Text numberOfLines={1} style={styles.counts}>{item.comments.length + ' Comments'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default PostItem;
