import React, { Fragment, PureComponent } from 'react';
import { Button, Card, Divider, Skeleton } from 'antd';
import DescriptionList from '../../components/DescriptionList';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';

const { Description } = DescriptionList;

@connect(state => ({
  ...state.userInfoDetail,
}))
export default class UserInfoDetail extends PureComponent {
  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'userInfoDetail/fetchDetail',
      payload: match.params.userId,
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userInfoDetail/clean',
    });
  }

  render() {
    const { userInfo, infoLoading, dispatch, match } = this.props;
    return (
      <PageHeaderLayout
        title="用户详情"
        action={
          <Fragment>
            <Button.Group>
              <Button onClick={() => dispatch(routerRedux.push(`/userInfo/userInfoEdit/${match.params.userId}`))}>编辑</Button>
              <Button type="primary" onClick={() => dispatch(routerRedux.push('/userInfo/userInfoList'))}>返回</Button>
            </Button.Group>
          </Fragment>
        }
      >
        <Card bordered={false}>
          <Skeleton loading={infoLoading}>
            <DescriptionList size="large" title="用户信息" style={{ marginBottom: 32 }}>
              <Description term="姓名">{userInfo.name}</Description>
              <Description term="性别">{userInfo.sex === 1 ? '男' : '女'}</Description>
              <Description term="Email">{userInfo.email}</Description>
              <Description term="出生日期">{userInfo.birthday}</Description>
            </DescriptionList>
            <Divider style={{ marginBottom: 32 }} />
            <DescriptionList size="large" title="数据信息" style={{ marginBottom: 32 }}>
              <Description term="创建时间">{moment(userInfo.createTime).format('YYYY-MM-DD HH:mm:ss')}</Description>
              <Description term="最后更新时间">{moment(userInfo.updateTime).format('YYYY-MM-DD HH:mm:ss')}</Description>
            </DescriptionList>
          </Skeleton>
        </Card>
      </PageHeaderLayout>
    )
  }
}
