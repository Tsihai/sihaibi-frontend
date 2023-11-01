import {useModel} from '@@/exports';
import {Avatar, Button, Card, Col, List, message, Result, Row} from 'antd';
import ReactECharts from 'echarts-for-react';
import React, {useEffect, useState} from 'react';
import {genChartByAiAsyncUsingPOST, getChartVOByIdUsingGET} from "@/services/sihaibi/ChartController";
import {useParams} from "react-router";
import Meta from "antd/es/card/Meta";
import TextArea from "antd/es/input/TextArea";
import {RedoOutlined} from "@ant-design/icons";


/**
 * 我的图表页面
 * @constructor
 */
const MyChartPageInfo: React.FC = () => {
  const {initialState} = useModel('@@initialState');
  const {currentUser} = initialState ?? {};
  const params = useParams();
  const [chartInfo, setChartInfo] = useState<API.ChartVO>();
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);

    if (!params.id) {
      message.error("图表不存在");
      return;
    }
    try {
      const res = await getChartVOByIdUsingGET({
        id: params.id,
      });
      if (res.data) {
        setChartInfo(res.data ?? []);
        // 隐藏图表的 title
        if (res.data) {
          if (res.data.chartStatus === 'succeed') {
            const chartOption = JSON.parse(res.data.genChart ?? '{}');
            chartOption.title = undefined;
            res.data.genChart = JSON.stringify(chartOption);
          }
        }
      } else {
        message.error('获取我的图表失败');
      }
    } catch (e: any) {
      message.error('获取我的图表失败，' + e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="my-chart-page">
      <div className="margin-16"/>
      <Row gutter={24}>
        <Col span={12}>
          <Card style={{width: '100%'}}>
            <Meta
              avatar={<Avatar src={currentUser && currentUser.userAvatar}/>}
              title={chartInfo?.chartName}
              description={ '表格数据：'}
            />
            <TextArea  autoSize value={chartInfo?.chartData} style={{margin:'5px'}}> </TextArea>
            <div style={{marginBottom: 16}}/>
            <span style={{whiteSpace:"pre-line"}}>{'分析结论：' + chartInfo?.genResult}</span>
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{width: '100%'}}>
            <Meta
              title="图表展示"
              description={chartInfo?.chartType ? '图表类型：' + chartInfo.chartType : undefined}
            />
            <>
              {
                chartInfo?.chartStatus === 'wait' && <>
                  <Result
                    status="warning"
                    title="待生成"
                    subTitle={chartInfo.execMessage ?? '当前图表生成队列繁忙，请耐心等候'}
                  />
                </>
              }
              {
                chartInfo?.chartStatus === 'running' && <>
                  <Result
                    status="info"
                    title="图表生成中"
                    subTitle={chartInfo.execMessage}
                  />
                </>
              }
              {
                chartInfo?.chartStatus === 'succeed' && <>
                  <div style={{marginBottom: 16}}/>
                  <p>{'分析目标：' + chartInfo.goal}</p>
                  <div style={{marginBottom: 16}}/>
                  <ReactECharts option={chartInfo.genChart && JSON.parse(chartInfo.genChart)}/>
                </>
              }
              {
                chartInfo?.chartStatus === 'failed' && <>
                  <Result
                    status="error"
                    title="图表生成失败"
                    subTitle={chartInfo.execMessage}
                  />
                </>
              }
            </>
          </Card>
        </Col>
      </Row>

    </div>
  );
};
export default MyChartPageInfo;
