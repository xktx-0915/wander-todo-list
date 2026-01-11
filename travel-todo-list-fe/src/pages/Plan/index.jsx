import { useState, useEffect } from "react";
import {
	Table,
	Tag,
	Button,
	Input,
	Select,
	Space,
	DatePicker,
	Modal,
	Form,
	message,
	Popconfirm,
} from "antd";
import {
	PlusOutlined,
	SearchOutlined,
	EditOutlined,
	DeleteOutlined,
	CheckCircleOutlined,
	SyncOutlined,
	ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getTasks, createTask, updateTask, deleteTask } from "../../api/task";
import { getCategories } from "../../api/category";
import "./index.less";

const { Option } = Select;

const priorityMap = {
	High: "高",
	Medium: "中",
	Low: "低",
};
const priorityMapReverse = {
	高: "High",
	中: "Medium",
	低: "Low",
};

const statusMap = {
	Pending: "待处理",
	"In Progress": "进行中",
	Completed: "已完成",
};
const statusMapReverse = {
	待处理: "Pending",
	进行中: "In Progress",
	已完成: "Completed",
};

const Plan = () => {
	const [data, setData] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [filterStatus, setFilterStatus] = useState("全部");
	const [filterPriority, setFilterPriority] = useState("全部");
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingKey, setEditingKey] = useState(null);
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
		total: 0
	});
	const [form] = Form.useForm();

	const fetchCategories = async () => {
		try {
			const res = await getCategories();
			setCategories(res);
		} catch (error) {
			console.error("Fetch categories failed", error);
		}
	};

	const fetchTasks = async (page = 1, size = 10) => {
		setLoading(true);
		try {
			const params = {
				current: page,
				pageSize: size
			};
			if (filterStatus !== "全部") params.status = statusMapReverse[filterStatus];
			if (filterPriority !== "全部") params.priority = priorityMapReverse[filterPriority];

			const res = await getTasks(params);
			// Map backend data to frontend structure
			const mappedData = res.list.map(item => ({
				key: item.id,
				title: item.title,
				priority: priorityMap[item.priority] || item.priority,
				status: statusMap[item.status] || item.status,
				dueDate: item.dueDate,
				categoryId: item.categoryId, // Store ID
				remark: item.remark,
			}));
			setData(mappedData);
			setPagination({
				current: page,
				pageSize: size,
				total: res.total
			});
		} catch (error) {
			console.error("Fetch tasks failed", error);
			message.error("获取任务失败");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	// Refresh when filters change, reset to page 1
	// This will also run on mount (initial load) because filterStatus/filterPriority have initial values
	useEffect(() => {
		fetchTasks(1, pagination.pageSize);
	}, [filterStatus, filterPriority]);

	const handleTableChange = (newPagination) => {
		fetchTasks(newPagination.current, newPagination.pageSize);
	};

	// Helper to get category name by ID
	const getCategoryName = id => {
		const cat = categories.find(c => c.id === id);
		return cat ? cat.name : "未知";
	};

	// Columns configuration
	const columns = [
		{
			title: "任务名称",
			dataIndex: "title",
			key: "title",
			render: text => (
				<span style={{ fontWeight: 600, color: "#1B2559" }}>
					{text}
				</span>
			),
		},
		{
			title: "分类",
			dataIndex: "categoryId",
			key: "category",
			render: categoryId => getCategoryName(categoryId),
		},
		{
			title: "优先级",
			dataIndex: "priority",
			key: "priority",
			render: priority => {
				let color = "green";
				if (priority === "高") color = "red";
				if (priority === "中") color = "orange";
				return (
					<Tag
						color={color}
						style={{ borderRadius: "10px", padding: "0 10px" }}
					>
						{priority}
					</Tag>
				);
			},
		},
		{
			title: "截止日期",
			dataIndex: "dueDate",
			key: "dueDate",
			render: date => (date ? dayjs(date).format("YYYY-MM-DD") : "-"),
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			render: status => {
				let icon = <ClockCircleOutlined />;
				let color = "default";
				if (status === "已完成") {
					icon = <CheckCircleOutlined />;
					color = "success";
				} else if (status === "进行中") {
					icon = <SyncOutlined spin />;
					color = "processing";
				}
				return (
					<Tag icon={icon} color={color}>
						{status}
					</Tag>
				);
			},
		},
		{
			title: "备注",
			dataIndex: "remark",
			key: "remark",
			ellipsis: true,
		},
		{
			title: "操作",
			key: "action",
			width: 150,
			render: (_, record) => (
				<Space size="middle">
					{record.status !== "已完成" && (
						<Popconfirm
							title="确定将此任务标记为已完成？"
							onConfirm={() => handleComplete(record.key)}
							okText="确定"
							cancelText="取消"
						>
							<Button
								type="text"
								icon={<CheckCircleOutlined />}
								style={{ color: "#52c41a" }}
								title="一键完成"
							/>
						</Popconfirm>
					)}
					<Button
						type="text"
						icon={<EditOutlined />}
						style={{ color: "#3246d2" }}
						onClick={() => handleEdit(record)}
					/>
					<Popconfirm
						title="确定删除此任务？"
						onConfirm={() => handleDelete(record.key)}
						okText="确定"
						cancelText="取消"
					>
						<Button type="text" icon={<DeleteOutlined />} danger />
					</Popconfirm>
				</Space>
			),
		},
	];

	// Handlers
	const handleDelete = async key => {
		try {
			await deleteTask(key);
			message.success("任务删除成功");
			fetchTasks(pagination.current, pagination.pageSize);
		} catch (error) {
			message.error("删除失败", error);
		}
	};

	const handleComplete = async (key) => {
		try {
			await updateTask(key, { status: "Completed" });
			message.success("任务已完成");
			fetchTasks(pagination.current, pagination.pageSize);
		} catch (error) {
			console.error(error);
			message.error("操作失败");
		}
	};

	const handleEdit = record => {
		setEditingKey(record.key);
		form.setFieldsValue({
			...record,
			category: record.categoryId, // Map categoryId to form field 'category'
			dueDate: dayjs(record.dueDate),
		});
		setIsModalVisible(true);
	};

	const handleAdd = () => {
		setEditingKey(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleModalOk = () => {
		form.validateFields().then(async values => {
			const apiData = {
				title: values.title,
				priority:
					priorityMapReverse[values.priority] || values.priority,
				status: statusMapReverse[values.status] || values.status,
				dueDate: values.dueDate.format("YYYY-MM-DD"),
				categoryId: values.category,
				remark: values.remark,
			};

			try {
				if (editingKey) {
					await updateTask(editingKey, apiData);
					message.success("任务更新成功");
				} else {
					await createTask(apiData);
					message.success("任务添加成功");
				}
				setIsModalVisible(false);
				fetchTasks(pagination.current, pagination.pageSize);
			} catch (error) {
				console.error(error);
				message.error("操作失败");
			}
		});
	};

	// Filter logic removed because backend handles it now
	// But we keep frontend search for current page for simplicity or remove it
	// Let's remove frontend filtering and rely on backend for status/priority
	// Search text is not yet supported by backend, let's keep it as client side filter for now
	// OR better: Just display data as is, since backend handles status/priority
	const filteredData = data.filter(item => {
		return item.title.toLowerCase().includes(searchText.toLowerCase());
	});

	return (
		<div className="plan-page">
			{/* Query Area */}
			<div className="query-area">
				<div className="left-filters">
					<Input
						placeholder="搜索任务..."
						prefix={<SearchOutlined style={{ color: "#A3AED0" }} />}
						value={searchText}
						onChange={e => setSearchText(e.target.value)}
						style={{ width: 250 }}
					/>
					<Select
						defaultValue="全部"
						style={{ width: 140 }}
						onChange={setFilterStatus}
						options={[
							{ value: "全部", label: "所有状态" },
							{ value: "待处理", label: "待处理" },
							{ value: "进行中", label: "进行中" },
							{ value: "已完成", label: "已完成" },
						]}
					/>
					<Select
						defaultValue="全部"
						style={{ width: 140 }}
						onChange={setFilterPriority}
						options={[
							{ value: "全部", label: "所有优先级" },
							{ value: "高", label: "高" },
							{ value: "中", label: "中" },
							{ value: "低", label: "低" },
						]}
					/>
				</div>
				<div className="right-actions">
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={handleAdd}
					>
						新建任务
					</Button>
				</div>
			</div>

			{/* Table Area */}
			<div className="table-area">
				<Table
					columns={columns}
					dataSource={filteredData}
					pagination={{
						current: pagination.current,
						pageSize: pagination.pageSize,
						total: pagination.total,
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total) => `共 ${total} 条`,
					}}
					onChange={handleTableChange}
					loading={loading}
				/>
			</div>

			{/* Add/Edit Modal */}
			<Modal
				title={editingKey ? "编辑任务" : "新建任务"}
				open={isModalVisible}
				onOk={handleModalOk}
				onCancel={() => setIsModalVisible(false)}
				okText={editingKey ? "更新" : "创建"}
				cancelText="取消"
			>
				<Form form={form} layout="vertical">
					<Form.Item
						name="title"
						label="任务名称"
						rules={[{ required: true, message: "请输入任务名称" }]}
					>
						<Input placeholder="例如：预订机票" />
					</Form.Item>
					<div style={{ display: "flex", gap: "16px" }}>
						<Form.Item
							name="category"
							label="分类"
							style={{ flex: 1 }}
						>
							<Select placeholder="请选择分类">
								{categories.map(cat => (
									<Option key={cat.id} value={cat.id}>
										{cat.name}
									</Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item
							name="priority"
							label="优先级"
							style={{ flex: 1 }}
							initialValue="中"
						>
							<Select placeholder="请选择优先级">
								<Option value="高">高</Option>
								<Option value="中">中</Option>
								<Option value="低">低</Option>
							</Select>
						</Form.Item>
					</div>
					<div style={{ display: "flex", gap: "16px" }}>
						<Form.Item
							name="dueDate"
							label="截止日期"
							style={{ flex: 1 }}
							rules={[{ required: true, message: "请选择日期" }]}
						>
							<DatePicker style={{ width: "100%" }} />
						</Form.Item>
						<Form.Item
							name="status"
							label="状态"
							style={{ flex: 1 }}
							initialValue="待处理"
						>
							<Select placeholder="请选择状态">
								<Option value="待处理">待处理</Option>
								<Option value="进行中">进行中</Option>
								<Option value="已完成">已完成</Option>
							</Select>
						</Form.Item>
					</div>
					<Form.Item name="remark" label="备注">
						<Input.TextArea rows={4} placeholder="请输入备注信息" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default Plan;
