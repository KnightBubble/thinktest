'use strict';

import DysmsapiClient from '@alicloud/dysmsapi';
import DybaseapiClient from '@alicloud/dybaseapi';
import MNSClient from '@alicloud/mns';

const msgTypeList = ['SmsReport', 'SmsUp'];

const DYSMSAPI_ENDPOINT = 'http://dysmsapi.aliyuncs.com';
const DYBASEAPI_ENDPOINT = 'http://dybaseapi.aliyuncs.com';

const smsConf = think.config('sms');

export default class extends think.service.base {
    /**
     * init
     * @return {}
     */
    init(accessKeyId, secretAccessKey) {
        super.init(accessKeyId, secretAccessKey);

        if (!accessKeyId || !secretAccessKey) {
            accessKeyId = smsConf.accessKeyId;
            secretAccessKey = smsConf.secretAccessKey;
        }

        if (!accessKeyId) {
            throw new TypeError('parameter "accessKeyId" is required');
        }
        if (!secretAccessKey) {
            throw new TypeError('parameter "secretAccessKey" is required');
        }

        this.dysmsapiClient = new DysmsapiClient({
            accessKeyId,
            secretAccessKey,
            endpoint: DYSMSAPI_ENDPOINT
        })
        this.dybaseClient = new DybaseapiClient({
            accessKeyId,
            secretAccessKey,
            endpoint: DYBASEAPI_ENDPOINT
        })
        this.expire = []
        this.mnsClient = []
    }

    /**
     * 发送短信
     * @param {Object} params
     * @param {string} params.PhoneNumbers - 短信接收号码，多个逗号分隔
     * @param {string} [params.SignName] - 短信签名
     * @param {string} [params.TemplateCode] - 短信模板ID
     * @param {string} params.TemplateParam - 短信模板变量JSON字符串
     * @param {string} [params.OutId] - 外部流水扩展字段
     * @return {Promise.<string|Error>} - BizId 发送回执ID,可根据该ID查询具体的发送状态
     */
    sendSMS(params) {
        return this.dysmsapiClient.sendSms(Object.assign({
            SignName: smsConf.SignName,
            TemplateCode: smsConf.TemplateCode,
        }, params)).then(res => {
            if (res.Code === 'OK') {
                return res.BizId;
            } else {
                throw res.Message;
            }
        });
    }

    /**
     * 查询详情
     * @param {object} params 
     * @param {string} params.PhoneNumber - 短信接收号码
     * @param {string} [params.BizId] - 发送流水号,从调用发送接口返回值中获取
     * @param {string} params.SendDate - 短信发送日期格式yyyyMMdd
     * @param {string} params.PageSize - 页大小Max=50
     * @param {string} params.CurrentPage - 当前页码
     * @return {Promise.<Object|Error>}
     * @return {number} TotalCount - 发送总条数
     * @return {number} TotalPage - 总页数
     * @return {Object} smsSendDetailDTOs - 发送明细结构体
     */
    queryDetail(params) {
        return this.dysmsapiClient.querySendDetails(params).then(res => {
            if (res.Code === 'OK') {
                return res;
            } else {
                throw res.Message;
            }
        });
    }

    //失效时间与当前系统时间比较，提前2分钟刷新token
    _refresh(type) {
        return this.expire[type] - new Date().getTime() > 2 * 60 * 1000
    }

    //获取token
    _getToken(type) {
        let msgType = msgTypeList[type]
        return this.dybaseClient.queryTokenForMnsQueue({
            MessageType: msgType
        })
    }

    //根据类型获取mnsclient实例
    async _getMNSClient(type) {
        if (this.mnsClient && (this.mnsClient[type] instanceof MNSClient) && this._refresh(type)) {
            return this.mnsClient[type]
        }

        let {
            MessageTokenDTO: {
                SecurityToken,
                AccessKeyId,
                AccessKeySecret
            }
        } = await this._getToken(type)


        if (!(AccessKeyId && AccessKeySecret && SecurityToken)) {
            throw new TypeError('get token fail')
        }


        let mnsClient = new MNSClient('1943695596114318', {
            securityToken: SecurityToken,
            region: 'cn-hangzhou',
            accessKeyId: AccessKeyId,
            accessKeySecret: AccessKeySecret,
            // optional & default
            secure: false, // use https or http
            internal: false, // use internal endpoint
            vpc: false // use vpc endpoint
        })
        this.mnsClient[type] = mnsClient
        this.expire[type] = (new Date().getTime() + 10 * 60 * 1000)
        return mnsClient
    }

    //typeIndex :0 为回执,1为上行
    async receiveMsg(typeIndex = 0, preQueueName, waitSeconds = 10) {
        let mnsClient = await this._getMNSClient(typeIndex)
        let res = await mnsClient.receiveMessage(preQueueName + msgTypeList[typeIndex], waitSeconds)
        if (res.code === 200) {
            return new Buffer(res.body, 'base64').toString();
        } else {
            throw res;
        }
    }
}