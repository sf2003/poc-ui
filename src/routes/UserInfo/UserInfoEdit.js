import React, { PureComponent } from 'react';
import { Button, Card, DatePicker, Form, Input, Select, Skeleton, message, Modal } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import moment from 'moment';

const FormItem = Form.Item;

@connect(state => ({
  ...state.userInfoEdit,
}))
@Form.create()
export default class UserInfoEdit extends PureComponent {
  state = {
    isCreate: false,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;

    if (match.params.userId !== 'new') {
      dispatch({
        type: 'userInfoEdit/fetchDetail',
        payload: match.params.userId,
      });
    } else {
      this.setState({
        isCreate: true,
      })
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userInfoEdit/clean',
    });
  }

  render() {
    const { userInfo, infoLoading, dispatch, submitting } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { isCreate } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const handleSubmit = e => {
      e.preventDefault();

      const { dispatch, form, match } = this.props;

      form.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }

        const values = {
          ...fieldsValue,
          birthday: fieldsValue.birthday.format('YYYY-MM-DD')
        };

        if (this.state.isCreate) {
          dispatch({
            type: 'userInfoEdit/createUser',
            payload: {
              queryData: {
                ...values,
              },
              callback: (response) => submitCallback(response)
            },
          });
        } else {
          dispatch({
            type: 'userInfoEdit/updateUser',
            payload: {
              queryData: {
                ...values,
                userId: match.params.userId,
              },
              callback: (response) => submitCallback(response)
            },
          });
        }
      });
    };

    const submitCallback = (response) => {
      if (response.success) {
        Modal.success({
          title: isCreate ? '用户新建成功' : '用户更新成功',
          centered: true,
          onOk: () => dispatch(routerRedux.push('/userInfo/userInfoList')),
        })
      } else {
        message.error(response.message);
      }
    };

    return (
      <PageHeaderLayout title={ isCreate ? '新增用户' : '编辑用户'}>
        <Card bordered={false}>
          <Skeleton loading={infoLoading}>
            <Form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
              <FormItem {...formItemLayout} label="姓名">
                {getFieldDecorator('name', {
                  initialValue: isCreate ? '' : userInfo.name,
                  rules: [
                    {
                      required: true,
                      message: '请输入姓名',
                    },
                  ],
                })(<Input placeholder="请输入姓名" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="性别">
                {getFieldDecorator('sex', {
                  initialValue: isCreate ? undefined : `${userInfo.sex}`,
                  rules: [
                    {
                      required: true,
                      message: '请选择性别',
                    },
                  ],
                })(<Select placeholder="请选择" style={{ width: '100%' }}>
                  <Select.Option value="1">男</Select.Option>
                  <Select.Option value="2">女</Select.Option>
                </Select>)}
              </FormItem>
              <FormItem {...formItemLayout} label="Email">
                {getFieldDecorator('email', {
                  initialValue: isCreate ? '' : userInfo.email,
                  rules: [
                    {
                      required: true,
                      message: '请输入邮箱',
                    },
                  ],
                })(<Input placeholder="请输入邮箱" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="出生日期">
                {getFieldDecorator('birthday', {
                  initialValue: isCreate ? undefined : moment(userInfo.birthday),
                  rules: [
                    {
                      required: true,
                      message: '请输入出生日期',
                    },
                  ],
                })(<DatePicker />)}
              </FormItem>
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  提交
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => dispatch(routerRedux.push('/userInfo/userInfoList'))}>返回</Button>
              </FormItem>
            </Form>
          </Skeleton>
        </Card>
      </PageHeaderLayout>
    )
  }
}
