import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  Row,
  Select,
  Table,
  DatePicker,
  Divider,
  Popconfirm,
  message, Modal,
} from 'antd';
import { Link, routerRedux } from 'dva/router';
import styles from './UserInfo/UserInfoList.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

@connect(state => ({
  ...state.userInfoList,
}))
@Form.create()
export default class UserInfoList extends PureComponent {
  state = {
    formValues: {},
    sortedInfo: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userInfoList/fetchList',
      payload: {},
    });
  }

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const values = {
        ...fieldsValue,
      };

      if (values.birthday && Array.isArray(values.birthday)) {
        values.startBirthday = values.birthday[0].format('YYYY-MM-DD 00:00:00');
        values.endBirthday = values.birthday[1].format('YYYY-MM-DD 00:00:00');
      }

      this.setState({
        formValues: values,
        sortedInfo: {},
      });

      dispatch({
        type: 'userInfoList/fetchList',
        payload: {
          queryData: {
            ...values,
          },
        },
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      sortedInfo: {},
    });
    dispatch({
      type: 'userInfoList/fetchList',
      payload: {},
    });
  };

  render() {
    const { userList, tableLoading, pagination, dispatch, form } = this.props;
    const { getFieldDecorator } = form;
    const { formValues, sortedInfo } = this.state;

    const columns = [{
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'userId' && sortedInfo.order,
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
    }, {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    }, {
      title: '出生日期',
      dataIndex: 'birthday',
      key: 'birthday',
    }, {
      title: '',
      render: (record) => (
        <div>
          <Link href="#" to={`/userInfo/userInfoDetail/${record.userId}`}><Icon type="eye" theme="outlined"/></Link>
          <Divider type="vertical" />
          <Link href="#" to={`/userInfo/userInfoEdit/${record.userId}`}><Icon type="edit" theme="outlined"/></Link>
          <Divider type="vertical" />
          <Popconfirm title="是否要删除本记录?" onConfirm={() => deleteUser(record.userId)} placement="left">
            <a className='deleteAction'><Icon type="delete" theme="outlined" /></a>
          </Popconfirm>
        </div>
      )
    }];

    const deleteUser = (userId) => {
      dispatch({
        type: 'userInfoList/deleteUser',
        payload: {
          userId,
          callback: (response) => callback(response),
        },
      });
    };

    const callback = (response) => {
      if (response && response.success) {
        Modal.success({
          title: '用户已删除',
          centered: true,
          onOk: () => {
            dispatch({
              type: 'userInfoList/fetchList',
              payload: {},
            });
          },
        })
      } else {
        message.error(response.message);
      }
    };

    const onPageChanged = (pagination, filters, sorter) => {
      const payload = {
        queryData: {
          ...formValues,
        },
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      };

      if (sorter.field !== undefined) {
        payload.sort = {
          sortField: sorter.field,
          sortOrder: sorter.order,
        }

        this.setState({
          sortedInfo: sorter,
        })
      }

      dispatch({
        type: 'userInfoList/fetchList',
        payload,
      });
    };

    return (
      <PageHeaderLayout title="用户一览">
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <FormItem label="姓名">
                    {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="性别">
                    {getFieldDecorator('sex')(
                      <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                        <Select.Option value="1">男</Select.Option>
                        <Select.Option value="2">女</Select.Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="出生日期">
                    {getFieldDecorator('birthday')(
                      <RangePicker />
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  &nbsp;
                </Col>
                <Col md={8} sm={24}>
                  <span className={styles.submitButtons}>
                    <Button type="primary" htmlType="submit" loading={tableLoading}>
                      查询
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                      重置
                    </Button>
                  </span>
                </Col>
              </Row>
            </Form>
          </div>
          <div>
            <Button icon='plus' type="primary" size='small' onClick={() => dispatch(routerRedux.push('/userInfo/userInfoEdit/new'))} style={{ marginBottom: '8px'}}>新增用户</Button>
            <Table columns={columns} loading={tableLoading} dataSource={userList} pagination={pagination} onChange={onPageChanged} rowKey="userId"/>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
