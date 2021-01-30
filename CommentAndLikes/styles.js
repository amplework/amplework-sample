import { StyleSheet } from 'react-native';
import { Metrics, Colors, Fonts } from '../../themes'
import { 
  widthPercentageToDP as wp,
  heightPercentageToDP as hp 
} from 'react-native-responsive-screen';


export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.green,
  },
  header: {
    height: hp(7.38),
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5.34),
    flexDirection: 'row',
    marginBottom: hp(1.23)
  },
  btnFilter: {
    height: hp(6.15),
    width: hp(6.15),
    justifyContent: 'center',
    alignItems: 'center'
  },
  filterIcon: {
    height: hp(3.07),
    width: hp(3.07),
    resizeMode: 'contain',
    tintColor: Colors.white
  },
  headerTitle: {
    fontFamily: Fonts.type.poppinsBold,
    fontSize: Metrics.fontSize(23),
    // lineHeight: 30,
    letterSpacing: 0.77,
    color: Colors.white
  },
  categoriesContainer: {
    height: hp(7.38),
    width: '100%',
    // justifyContent: 'center',
    flexDirection:'row',
    // flexWrap: 'wrap',
    // alignItems: 'center'
  },
  tag: {
    height: hp(4.9),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(5.34),
    marginRight: wp(2.66),
    backgroundColor: Colors.white,
    borderRadius: hp(4.9) / 2,
  },
  tagTitle: {
    fontFamily: Fonts.type.medium,
    fontSize: Metrics.fontSize(14),
    letterSpacing: 0.41,
    color: Colors.black
  },
  flatlist: {
    height: '87%'
  },
  flatlistHorizontalContent: {
    paddingLeft: wp(5.34),
    paddingRight: wp(2.66),
    // width: wp(100),
    // alignItems: 'flex-start'
  },
  flatlistContent: {
    // height: '100%',
    paddingBottom: hp(2.46)
  },
  item: {
    height: hp(46.79),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(5.34),
    marginBottom: hp(1.23),
    backgroundColor: Colors.red,
    borderRadius: hp(1.23),
  },
})