// @flow
import React, { Component } from "react";
import { FlatList, Animated, View as RNView, ActivityIndicator, RefreshControl } from "react-native";
import { Container, Text, Icon, Body, Right, View, Spinner, ListItem } from "native-base";
import { connect } from "react-redux";
import moment from 'moment'
const logo = require("../../../assets/logo.png");
import * as actions from './actions.js'
import styles from "./styles";
import CustomHeader from '../../components/CustomHeader'
import Loader from '../../components/loader'
import preventDoubleTap from '../../components/preventDoubleTap.js'
const primary = require("../../theme/variables/commonColor").brandSecondary;

class Leads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resetTab: false,
      leads: [],
      refreshing: false,
      isLoadingMore: false,
      open: false,
      date: '',
      pageNumber: 1,
      totalPages: 1,
      status_id: '',
      store_id: '',
      first_name: '',
      last_name: '',
      isSearching: false
    }
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
  }

  componentDidMount() {
    this.setState({ refreshing: true, resetTab: true })
    this.getLeadsFromServer(false)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.updateStatusCodeError === 500 && newProps.updateStatusCodeError !== this.props.updateStatusCodeError) {
      this.getLeadsFromServer(false)
    }
  }

  getLeadsFromServer(fromPaginate) {
    const { store_id, first_name, last_name, status_id, pageNumber, date } = this.state;
    const { token, getLeads } = this.props;
    let data = {
      token: token,
      store_id: store_id,
      first_name: first_name,
      last_name: last_name,
      status_id: (status_id != 99999) ? status_id : '',
      page: (!fromPaginate) ? 1 : pageNumber,
      date: date
    }

    getLeads(data)
      .then((response) => {
        this.setState({ refreshing: false, isLoadingMore: false, isSearching: false, resetTab: false })
        if (response.payload.data && response.payload.data.status != 'success') {
          setTimeout(() => {
            alert('Error while loading all leads. Please try again.')
          }, 300)
        } else {
          if (fromPaginate) {
            this.setState({ leads: [...this.state.leads, ...this.props.leads], totalPages: this.props.totalPages })
          } else {
            this.setState({ leads: this.props.leads, totalPages: this.props.totalPages })
          }
        }
      })
  }

  onItemClick = (item) => () => {
    let leadAction = () => { this.props.navigation.navigate('LeadDetails', { leadId: item.id, fromNewTab: false, leadDate: item.created_at }); }
    preventDoubleTap(this, leadAction)
  }

  _renderItem = ({ item }) => {
    return (
      <ListItem avatar
        style={styles.listItem}
        onPress={this.onItemClick(item)}>
        <Body style={styles.body}>
          <View style={{ flex: 1 }}>
            <Text style={styles.text} numberOfLines={1}>{item.name}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={styles.text}>{item.status} - {moment(item.created_at).format('MM/DD')}</Text>
          </View>
        </Body>
        <Right style={{ borderBottomWidth: 0, paddingRight: 0 }}>
          <Icon name='ios-arrow-forward' style={styles.iconStyle} />
        </Right>
      </ListItem>
    );
  };

  renderFooter() {
    if (this.state.isLoadingMore) {
      return <ListItem style={styles.listItem} >
        <Body style={[styles.body, { justifyContent: 'center' }]}>
          <ActivityIndicator animating />
        </Body>
      </ListItem>
    } else return null
  }

  handleLoadMore() {
    if (this.state.totalPages > this.state.pageNumber) {
      this.setState({
        pageNumber: this.state.pageNumber + 1,
        isLoadingMore: true
      }, () => {
        if (this.state.totalPages >= this.state.pageNumber) {
          this.getLeadsFromServer(true)
        } else {
          this.setState({ isLoadingMore: false })
        }
      })
    }
  }

  render() {

    return (
      <Container>
        <RNView style={{ backgroundColor: 'white', flex: 1 }}>
          <Loader loading={this.state.resetTab} />
          <CustomHeader
            renderBackButton={false}
            renderRightButton={true}
            handleRightButtonAction={() => this.setState({ open: true })}
          />

          {
            (this.state.isSearching) ?
              //null
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Spinner />
              </View>
              :
              (this.state.leads && this.state.leads.length > 0) ?
                <FlatList
                  data={this.state.leads}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      tintColor={primary}
                      onRefresh={() => { this.setState({ refreshing: true, resetTab: false }); this.getLeadsFromServer(false) }}
                    />
                  }
                  renderItem={this._renderItem}
                  keyExtractor={(item, index) => index}
                  ListFooterComponent={this.renderFooter()}
                  onEndReached={this.handleLoadMore}
                  onEndReachedThreshold={0}
                />
                : <View style={styles.bottomView}>
                  <Text style={styles.noResultText}>{(this.state.resetTab) ? '' : 'No Results Found'}</Text>
                </View>
          }
        </RNView>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  leads: state.leadsReducer.leads,
  totalPages: state.leadsReducer.totalPages,
  isLoading: state.leadsReducer.isLoading,
  token: state.loginReducer.token,
  updateStatusCodeError: state.leadDetailReducer.updateStatusCodeError
});

const mapDispatchToProps = (dispatch) => ({
  getLeads: (data) => dispatch(actions.getLeads(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Leads);
