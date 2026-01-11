import { useState, useEffect } from "react";
import {
	Table,
	Button,
	Input,
	Space,
	Modal,
	Form,
	message,
	Tag,
	Select,
	Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
	getCategories,
	createCategory,
	updateCategory,
	deleteCategory,
} from "../../api/category";
import "./index.less";

const { Option } = Select;

const Types = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingKey, setEditingKey] = useState(null);
	const [form] = Form.useForm();

	const fetchData = async () => {
		setLoading(true);
		try {
			const res = await getCategories();
			// Backend returns array of categories
			// Add key for Table
			const mappedData = res.map(item => ({ ...item, key: item.id }));
			setData(mappedData);
		} catch (error) {
			console.error(error);
			message.error("获取类别失败");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const columns = [
		{
			title: "类别名称",
			dataIndex: "name",
			key: "name",
			render: (text, record) => (
				<Tag
					color={record.color}
					style={{ fontSize: "14px", padding: "4px 10px" }}
				>
					{text}
				</Tag>
			),
		},
		{
			title: "描述",
			dataIndex: "description",
			key: "description",
			ellipsis: true,
		},
		{
			title: "操作",
			key: "action",
			width: 150,
			render: (_, record) => (
				<Space size="middle">
					<Button
						type="text"
						icon={<EditOutlined />}
						style={{ color: "#3246d2" }}
						onClick={() => handleEdit(record)}
					/>
					<Popconfirm
						title="确定删除此类别？"
						onConfirm={() => handleDelete(record.id)}
						okText="确定"
						cancelText="取消"
					>
						<Button type="text" icon={<DeleteOutlined />} danger />
					</Popconfirm>
				</Space>
			),
		},
	];

	const handleDelete = async id => {
		try {
			await deleteCategory(id);
			message.success("类别删除成功");
			fetchData();
		} catch (error) {
			console.error(error);
			message.error("删除失败");
		}
	};

	const handleEdit = record => {
		setEditingKey(record.id);
		form.setFieldsValue(record);
		setIsModalVisible(true);
	};

	const handleAdd = () => {
		setEditingKey(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleModalOk = () => {
		form.validateFields().then(async values => {
			try {
				if (editingKey) {
					await updateCategory(editingKey, values);
					message.success("类别更新成功");
				} else {
					await createCategory(values);
					message.success("类别添加成功");
				}
				setIsModalVisible(false);
				fetchData();
			} catch (error) {
				console.error(error);
				message.error("操作失败");
			}
		});
	};

	return (
		<div className="types-page">
			{/* Header Actions */}
			<div className="header-actions">
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={handleAdd}
				>
					新建类别
				</Button>
			</div>

			{/* Table Area */}
			<div className="table-area">
				<Table
					columns={columns}
					dataSource={data}
					pagination={{ pageSize: 10 }}
					loading={loading}
				/>
			</div>

			{/* Add/Edit Modal */}
			<Modal
				title={editingKey ? "编辑类别" : "新建类别"}
				open={isModalVisible}
				onOk={handleModalOk}
				onCancel={() => setIsModalVisible(false)}
				okText={editingKey ? "更新" : "创建"}
				cancelText="取消"
			>
				<Form form={form} layout="vertical">
					<Form.Item
						name="name"
						label="类别名称"
						rules={[{ required: true, message: "请输入类别名称" }]}
					>
						<Input placeholder="例如：购物" />
					</Form.Item>
					<Form.Item
						name="color"
						label="标签颜色"
						initialValue="blue"
					>
						<Select>
							<Option value="blue">蓝色</Option>
							<Option value="gold">金色</Option>
							<Option value="cyan">青色</Option>
							<Option value="purple">紫色</Option>
							<Option value="green">绿色</Option>
							<Option value="magenta">洋红</Option>
							<Option value="red">红色</Option>
							<Option value="orange">橙色</Option>
						</Select>
					</Form.Item>
					<Form.Item name="description" label="描述">
						<Input.TextArea rows={4} placeholder="请输入类别描述" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default Types;
