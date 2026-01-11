import "./index.less";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
	HomeOutlined,
	ScheduleOutlined,
	TagsOutlined,
	RocketFilled,
	BellOutlined,
	// UserOutlined,
	LogoutOutlined,
} from "@ant-design/icons";
import { Dropdown, Popover, Badge, List } from "antd";
import { getTips } from "../api/system";
import { getTasks } from "../api/task";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

const Layout = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [tip, setTip] = useState("");
	const [todayTasks, setTodayTasks] = useState([]);

	useEffect(() => {
		fetchTips();
		fetchTodayTasks();
	}, []);

	// 获取提示语
	const fetchTips = async () => {
		try {
			const response = await getTips();
			setTip(response.content);
		} catch (error) {
			console.error("Failed to fetch tips", error);
		}
	};

	// 获取今日待办
	const fetchTodayTasks = async () => {
		try {
			const today = dayjs().format("YYYY-MM-DD");
			// 后端已支持按日期筛选
			// 修改为：包含截止到今日的所有未完成待办
			const res = await getTasks({
				pageSize: 100,
				maxDueDate: today,
				excludeStatus: "Completed",
			});
			setTodayTasks(res.list);
		} catch (error) {
			console.error("Failed to fetch today tasks", error);
		}
	};

	const taskContent = (
		<div style={{ width: 300, maxHeight: 400, overflow: "auto" }}>
			<List
				dataSource={todayTasks}
				renderItem={item => (
					<List.Item>
						<List.Item.Meta
							title={
								<span
									style={{
										color:
											item.status === "Completed"
												? "#999"
												: "inherit",
										textDecoration:
											item.status === "Completed"
												? "line-through"
												: "none",
									}}
								>
									{item.title}
								</span>
							}
						/>
						<div
							style={{
								color:
									item.status === "Completed"
										? "#999"
										: "#666",
							}}
						>
							{dayjs(item.dueDate).format("MM-DD")}
						</div>
					</List.Item>
				)}
				locale={{ emptyText: "今日无待办事项" }}
			/>
		</div>
	);

	// 菜单项
	const menuItems = [
		{
			key: "/",
			label: "首页",
			icon: <HomeOutlined />,
		},
		{
			key: "/plans",
			label: "待办事项",
			icon: <ScheduleOutlined />,
		},
		{
			key: "/types",
			label: "事项类别",
			icon: <TagsOutlined />,
		},
	];

	const currentMenuItem = menuItems.find(
		item => item.key === location.pathname
	);
	const pageTitle = currentMenuItem ? currentMenuItem.label : "Dashboard";
	const today = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const handleMenuClick = ({ key }) => {
		if (key === "logout") {
			navigate("/login");
		} else if (key === "profile") {
			// Handle profile click
			console.log("Profile clicked");
		}
	};

	const userMenu = {
		items: [
			// {
			// 	key: "profile",
			// 	label: "修改个人信息",
			// 	icon: <UserOutlined />,
			// },
			{
				key: "logout",
				label: "退出系统",
				icon: <LogoutOutlined />,
				danger: true,
			},
		],
		onClick: handleMenuClick,
	};

	return (
		<div className="app-layout">
			<div className="drag-region" />
			<div className="app-layout-sidebar">
				<div className="project-title">
					<span className="title-icon">
						<RocketFilled />
					</span>
					<span className="title-text">Wander List.</span>
				</div>
				<div className="menu-container">
					{menuItems.map(item => (
						<div
							key={item.key}
							className={`menu-item ${
								location.pathname === item.key ? "active" : ""
							}`}
							onClick={() => navigate(item.key)}
						>
							<span className="menu-icon">{item.icon}</span>
							<span className="menu-label">{item.label}</span>
						</div>
					))}
				</div>

				<div className="footer-tips">
					<div className="tip-card">
						<div className="tip-icon">✨</div>
						<div className="tip-content">
							<h4>每日寄语</h4>
							<p>{tip || "保持热爱，奔赴山海。"}</p>
						</div>
					</div>
				</div>
			</div>
			<div className="app-layout-content">
				<div className="content-inner">
					<div className="page-top">
						<div className="page-top-left">
							<div className="page-title">{pageTitle}</div>
							<div className="page-subtitle">{today}</div>
						</div>
						<div className="page-top-right">
							<Popover
								content={taskContent}
								title="今日待办"
								trigger="click"
								placement="bottomRight"
							>
								<div className="icon-box">
									<Badge
										dot={todayTasks.length > 0}
										offset={[-2, 2]}
									>
										<BellOutlined
											style={{
												fontSize: 22,
												cursor: "pointer",
											}}
										/>
									</Badge>
								</div>
							</Popover>

							<div className="icon-box">
								<Dropdown
									menu={userMenu}
									placement="bottomRight"
									arrow
								>
									<img
										src="https://img0.baidu.com/it/u=3440778460,2028501139&fm=253&app=138&f=JPEG?w=500&h=500"
										alt=""
										style={{ cursor: "pointer" }}
									/>
								</Dropdown>
							</div>
						</div>
					</div>
					<div className="page-content">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Layout;
