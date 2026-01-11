import {
	ScheduleOutlined,
	ClockCircleOutlined,
	SyncOutlined,
	CheckCircleOutlined,
	CalendarOutlined,
} from "@ant-design/icons";
import ReactECharts from "echarts-for-react";
import React, { useEffect, useState } from 'react';
import { getStats, getChartData } from '../../api/home';
import "./index.less";

const Home = () => {
	const [statsData, setStatsData] = useState({
		total: 0,
		pending: 0,
		inProgress: 0,
		completed: 0
	});
	const [chartData, setChartData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const stats = await getStats();
				setStatsData(stats);
				const chart = await getChartData();
				setChartData(chart);
			} catch (error) {
				console.error("Failed to fetch home data", error);
			}
		};
		fetchData();
	}, []);

	const stats = [
		{
			title: "总任务数",
			value: statsData.total,
			icon: <ScheduleOutlined />,
			color: "#4318FF", // Blue
		},
		{
			title: "待处理",
			value: statsData.pending,
			icon: <ClockCircleOutlined />,
			color: "#FFB547", // Orange
		},
		{
			title: "进行中",
			value: statsData.inProgress,
			icon: <SyncOutlined />,
			color: "#39B8FF", // Cyan
		},
		{
			title: "已完成",
			value: statsData.completed,
			icon: <CheckCircleOutlined />,
			color: "#05CD99", // Green
		},
	];

	const getOption = () => {
		return {
			tooltip: {
				trigger: "axis",
				backgroundColor: "#fff",
				borderColor: "transparent",
				padding: [10, 15],
				textStyle: {
					color: "#1B2559",
				},
				extraCssText:
					"box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 10px;",
			},
			grid: {
				left: "0",
				right: "0",
				bottom: "0",
				top: "10",
				containLabel: true,
			},
			xAxis: {
				type: "category",
				data: chartData.map(item => item.name),
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLabel: {
					color: "#A3AED0",
					fontSize: 12,
					margin: 15,
				},
			},
			yAxis: {
				type: "value",
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				splitLine: {
					lineStyle: {
						color: "#E0E5F2",
						type: "dashed",
					},
				},
				axisLabel: {
					color: "#A3AED0",
					fontSize: 12,
					margin: 12,
				},
			},
			series: [
				{
					name: "新增任务",
					type: "line",
					smooth: true,
					showSymbol: false,
					symbolSize: 8,
					data: chartData.map(item => item.new),
					itemStyle: {
						color: "#4318FF",
					},
					lineStyle: {
						width: 4,
					},
				},
				{
					name: "完成任务",
					type: "line",
					smooth: true,
					showSymbol: false,
					symbolSize: 8,
					data: chartData.map(item => item.completed),
					itemStyle: {
						color: "#39B8FF",
					},
					lineStyle: {
						width: 4,
					},
				},
			],
		};
	};

	return (
		<div className="home-page">
			{/* Stats Cards */}
			<div className="stats-cards">
				{stats.map((item, index) => (
					<div key={index} className="stat-card">
						<div className="stat-info">
							<span className="stat-label">{item.title}</span>
							<span className="stat-value">{item.value}</span>
						</div>
						<div
							className="stat-icon"
							style={{ backgroundColor: item.color }}
						>
							{item.icon}
						</div>
					</div>
				))}
			</div>

			{/* Chart Section */}
			<div className="chart-section">
				<div className="chart-header">
					<h3>近7天任务概览</h3>
					<div className="chart-right-actions">
						<div className="chart-legend">
							<div className="legend-item">
								<span
									className="dot"
									style={{ background: "#4318FF" }}
								></span>
								<span>新增任务</span>
							</div>
							<div className="legend-item">
								<span
									className="dot"
									style={{ background: "#39B8FF" }}
								></span>
								<span>完成任务</span>
							</div>
						</div>
						<div className="action-btn">
							<CalendarOutlined />
						</div>
					</div>
				</div>
				<div className="chart-container">
					<ReactECharts
						option={getOption()}
						style={{ height: "100%", width: "100%" }}
					/>
				</div>
			</div>
		</div>
	);
};

export default Home;
