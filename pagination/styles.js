import React from 'react';
import {Dimensions, Platform} from 'react-native';
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const primary = require("../../theme/variables/commonColor").brandPrimary;

export default {
  newsContent: {
    flexDirection: "column",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#ddd"
  },
  logo: {
    resizeMode: "contain",
    height: deviceHeight / 6,
    width: deviceWidth / 2,
    alignSelf: "center",
    marginTop:20
  },
  newsHeader: {
    color: "#444",
    fontWeight: "bold"
  },
  newsLink: {
    color: Platform.OS === "android" ? "#777" : "#666",
    fontSize: 12,
    alignSelf: "flex-start",
    fontWeight: "bold"
  },
  newsTypeView: {
    borderBottomWidth: 1,
    borderBottomColor: Platform.OS === "android" ? "#777" : "#666",
    alignSelf: "flex-end"
  },
  newsTypeText: {
    color: Platform.OS === "android" ? "#777" : "#666",
    fontSize: 12,
    fontWeight: "bold",
    paddingBottom: 2
  },
  newsPoster: {
    height: 330,
    width: null,
    flex: 1,
    position: "relative"
  },
  newsPosterHeader: {
    fontWeight: "900"
  },
  newsPosterLink: {
    opacity: 0.8,
    fontSize: 12,
    alignSelf: "flex-start",
    fontWeight: "bold"
  },
  newsPosterTypeView: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignSelf: "flex-end"
  },
  newsPosterTypeText: {
    opacity: 0.8,
    fontSize: 12,
    fontWeight: "bold",
    paddingBottom: 2
  },
  timeIcon: {
    fontSize: 20,
    marginLeft: Platform.OS === "android" ? 15 : 0,
    paddingLeft: Platform.OS === "android" ? 0 : 20,
    paddingRight: 5,
    marginTop: Platform.OS === "android" ? -1 : -3,
    color: "#666"
  },
  container: {
    flex: 1,
    width: null,
    height: null
  },
  text: {
    fontSize: 15,
    color: "#000"
  },
  body: {
    borderBottomWidth: 0,
    flexDirection: 'row',
    justifyContent:'space-between',
    paddingRight:20
  },
  listItem: {
		width: '100%',
		marginLeft: 0,
    paddingLeft:10,
		paddingRight:20,
		borderBottomWidth: 1,
		paddingVertical: 10,
	},
	listText: {
		fontSize: 15
	},
	listImage: {
		height: 40,
		width: 40,
		borderRadius: 20,
	},
	iconStyle: {
		fontSize: 15,
		color: 'rgb(79,79,79)',
		marginLeft: 5,
		marginTop: 5
	},
	listRight: {
		borderBottomWidth: 0,
		flexDirection: 'row',
		alignItems: 'center',
		paddingRight: 0
	},
  sectionHeaderView: {
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingLeft: 20
  },
  sectionHeaderText: {
    color: 'rgb(54, 54, 54)',
    fontWeight: 'bold',
    fontSize: 16
  },
  input: {
    color: "#fff"
  },
  bottomView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noResultText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'grey'
  }
};
