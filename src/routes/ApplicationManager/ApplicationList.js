import React, { PureComponent } from 'react';
import { Card, Table } from 'antd';
import { connect } from 'dva';

@connect(state => ({
  ...state.applicationList,
}))
export default class ApplicationList extends PureComponent{
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'applicationList/fetchList',
      payload: {},
    })
  }

  render() {
    const { appList, tableLoading, pagination } = this.props;

    const columns = [{
      title: '空间名称',
      dataIndex: 'space.displayName',
      key: 'space.spaceId',
      sorter: true,
      width: 150,
    }, {
      title: '应用名称',
      dataIndex: 'dummyAppName',
      key: 'dummyAppId',
      sorter: true,
      width: 150,
    }, {
      title: '业务部门',
      dataIndex: 'department.departmentName',
      key: 'department.departmentId',
      sorter: true,
      width: 180,
    }, {
      title: '应用类型',
      dataIndex: 'appType.typeName',
      key: 'appType.typeId',
      sorter: true,
      width: 50,
    }, {
      title: '应用实例',
      dataIndex: 'instanceNum',
      width: 50,
    }, {
      title: '内存',
      dataIndex: 'memory',
      width: 50,
    }];


    return (
      <Card bordered={false}>
        <Table columns={columns} loading={tableLoading} dataSource={appList} pagination={pagination} rowKey="ID" />
      </Card>
    )
  }
}
