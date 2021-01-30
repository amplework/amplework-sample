import { StyleSheet, Platform } from 'react-native';
import { Colors, Fonts, Metrics, } from '../../../themes'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  item: {
    backgroundColor: Colors.white,
    borderRadius: hp(1.23),
  },
  topSection: {
    height: hp(6.77),
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: wp(5.34),
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.gray241,
    borderBottomWidth: 1
  },
  btnBack: {
    // height: 40,
    width: wp(10.66),
    marginRight: wp(2.66),
    justifyContent: 'center',
    alignItems:'center'
  },
  backIcon: {
    width: 13,
    height: 24,
    resizeMode: 'contain'
  },
  btnEdit: {
    marginLeft: wp(5.34),
    justifyContent: 'center',
    alignItems: 'center'
  },
  editIcon: {
    height: 17,
    width: 17,
    resizeMode: 'contain'
  },
  userImage: {
    height: 36,
    width: 36,
    borderRadius: 18,
    resizeMode: 'cover'
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: wp(4),
  },
  username: {
    marginRight: wp(4),
    paddingLeft: wp(2.66),
    fontFamily: Fonts.type.poppinsSemiBold,
    fontSize: Metrics.fontSize(15),
    letterSpacing: 0.68,
    color: Colors.gray74
  },
  dateSection: {
    height: hp(4.9),
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: wp(5.34),
    alignItems: 'center',
  },
  calendarSmaller: {
    height: 16,
    width: 16,
    resizeMode: 'contain'
  },
  postDate: {
    fontFamily: Fonts.type.poppinsRegular,
    fontSize: Metrics.fontSize(11),
    letterSpacing: 0.5,
    color: Colors.gray155,
    marginLeft: wp(1.33)
  },
  contentSection: {
    paddingHorizontal: wp(4.53),
    paddingBottom: 8
  },
  content: {
    fontFamily: Fonts.type.poppinsRegular,
    fontSize: Metrics.fontSize(14),
    letterSpacing: 0.64,
    color: Colors.gray155,
  },
  contentImageSection: {
    paddingVertical: 8,
    // height: hp(21.92),
    width: '100%'
  },
  postImage: {
    // flex:1,
    // width: wp(100),
    // height: hp(24.63),
    resizeMode: 'cover'
  },
  bottomSection: {
    height: hp(7.01),
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: wp(5.34),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    flexDirection: 'row'
  },
  actionContainer2: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: 'center',
    flexDirection: 'row'
  },
  likeIcon: {
    height: 21,
    width: 24,
    resizeMode: 'contain',
    // tintColor: Colors.gray74
  },
  counts: {
    fontFamily: Fonts.type.poppinsRegular,
    fontSize: Metrics.fontSize(13),
    letterSpacing: 0.59,
    color: Colors.gray74,
    marginHorizontal: wp(1.33)
  },
  flatlist: {
    height: '100%',
    backgroundColor: Colors.gray238
  },
  flatlistContent: {
    // paddingBottom: hp(7.38)
  },
  flatlistContainer: {
    flex: 1,
    marginBottom: hp(6)
  },
  mainContainer: {
    backgroundColor: Colors.white
  },
  input: {
    height: hp(6.15),
    width: '80%',
    flex: 1,
    paddingRight: wp(2.66),
    fontFamily: Fonts.type.regular,
    fontSize: Metrics.fontSize(16),
    letterSpacing: 0.5,
    // backgroundColor: 'red'
  },
  bottomContainer: {
    position: 'absolute',
    backgroundColor: Colors.white,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    height: hp(6.15),
    alignItems: 'center',
    borderTopColor: Colors.gray218,
    borderTopWidth: 1,
    paddingHorizontal: wp(5.34),
    zIndex: 11111
  },
  send: {
    fontFamily: Fonts.type.semibold,
    fontSize: Metrics.fontSize(16),
    letterSpacing: 0.5,
    color: Colors.green
  },
  disabledSend: {
    fontFamily: Fonts.type.semibold,
    fontSize: Metrics.fontSize(16),
    letterSpacing: 0.5,
    color: Colors.gray172
  }
});

export default styles;