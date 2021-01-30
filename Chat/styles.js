
import { StyleSheet } from 'react-native';
import { Colors, Fonts, Metrics } from '../../../themes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topContainer: {
    width: '100%',
    height: hp(39.53),
  },
  title: {
    fontFamily: Fonts.type.bold,
    fontSize: Metrics.fontSize(26),
    letterSpacing: 0.76,
    color: Colors.white,
    marginTop: hp(1.23)
  },
  header: {
    height: hp(15.39),
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: wp(5.34),
    paddingTop: hp(2.46)
  },
  namContainer: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingHorizontal: 16
  },
  headerText: {
    fontSize: Metrics.fontSize(23),
    fontFamily: Fonts.type.bold,
    color: Colors.gray74,
    letterSpacing: 0.68,
    marginLeft: 28
  },
  homeIcon: {
    height: wp(6.66),
    width: wp(6.66),
    resizeMode: 'contain',
    tintColor: Colors.gray115,
    marginTop: hp(1.23)
  },
  searchContainer: {
    marginHorizontal: wp(5.33),
    backgroundColor: Colors.white240,
    borderRadius: wp(2.13),
    justifyContent: 'center',
    paddingLeft: wp(5.33)
  },
  userImage: {
    height: wp(16),
    width: wp(16),
    borderWidth: 2,
    borderRadius: wp(8),
    borderColor: Colors.dustyLavender,
    resizeMode: 'cover',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowOpacity: 1
  },
  textContainer: {
    paddingLeft: wp(4),
    paddingTop: hp(1.23),
    flex: 1
  },
  userNameView: {
    marginBottom: 7,
  },
  userNameText: {
    fontSize: Metrics.fontSize(15),
    fontFamily: Fonts.type.bold,
    color: Colors.black,
    letterSpacing: 0.44,
    textAlign: 'left',
  },
  titleText: {
    fontSize: Metrics.fontSize(13),
    fontFamily: Fonts.type.medium,
    color: Colors.warmGray,
    letterSpacing: 0.38,
  },
  dateView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  horizontalLineView: {
    width: wp(33),
    height: 1,
    backgroundColor: Colors.gray229,
    alignSelf: 'center'
  },
  dateText: {
    fontSize: Metrics.fontSize(13),
    fontFamily: Fonts.type.medium,
    color: Colors.warmGray,
    letterSpacing: 0.38,
  },
  toolbarContainer: {
    
  },
  inputToolbar: {
    height: hp(13.79),
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    paddingTop: hp(2.46),
    paddingHorizontal: wp(5.34)
  },
  textInputProps: {
    color: Colors.gray115,
    fontFamily: Fonts.type.medium,
    fontSize: Metrics.fontSize(13),
    margin: 0,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  sendIcon: {
    alignSelf: 'center',
    marginLeft: 7,
    resizeMode: 'contain',
    height: 22,
    width: 26
  },
  attachmentIcon: {
    alignSelf: 'center',
    marginLeft: 7,
    resizeMode: 'contain',
    height: 24,
    width: 22
  },
  composerContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingRight: 10,
  },
  sendContainer: {
    // backgroundColor:'red',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 5
  }
});

export default styles;