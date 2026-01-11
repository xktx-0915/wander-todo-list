import { useState } from "react";
import { Form, Input, Button, Tabs, message } from "antd";
import {
	LockOutlined,
	MobileOutlined,
	MailOutlined,
	SafetyCertificateOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { login, register } from "../../api/auth";
import "./index.less";

const Login = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [loginType, setLoginType] = useState("email"); // Default to email as backend supports it
	const [isRegister, setIsRegister] = useState(false);

	const onFinish = async values => {
		setLoading(true);
		try {
			if (isRegister) {
				// Register logic
				const res = await register({
					name: values.username || values.email.split('@')[0],
					email: values.email,
					password: values.password,
				});
				message.success("注册成功！");
				// Auto login or switch to login?
				// Backend register returns { user, token } same as login
				const token = res.token;
				localStorage.setItem("token", token);
				localStorage.setItem("user", JSON.stringify(res.user));
				navigate("/");
			} else {
				// Login logic
				if (loginType === 'email') {
					const res = await login({
						email: values.email,
						password: values.password,
					});
					message.success("登录成功！");
					const token = res.token;
					localStorage.setItem("token", token);
					localStorage.setItem("user", JSON.stringify(res.user));
					navigate("/");
				} else {
					message.warning("暂不支持手机号登录，请使用邮箱登录");
				}
			}
		} catch (error) {
			console.error(error);
			message.error(error.response?.data?.message || (isRegister ? "注册失败" : "登录失败"));
		} finally {
			setLoading(false);
		}
	};

	const items = [
		{
			key: "email",
			label: "邮箱登录",
			icon: <MailOutlined />,
		},
		{
			key: "phone",
			label: "手机号登录",
			icon: <MobileOutlined />,
		},
	];

	return (
		<div className="login-container">
			{/* Left Side - Image */}
			<div className="login-left">
				<div className="welcome-text">
					<h1>Wander Todo List</h1>
					<p>
						规划你的每一个计划，记录每一个难忘瞬间。开启你的专属计划管理之旅。
					</p>
				</div>
			</div>

			{/* Right Side - Login Form */}
			<div className="login-right">
				{/* Draggable region for Electron */}
				<div className="drag-region"></div>

				<div className="login-form-container">
					<div className="login-header">
						<h2>{isRegister ? "创建账号" : "欢迎回来"}</h2>
						<p>{isRegister ? "注册以开始使用" : "请登录您的账号以继续使用"}</p>
					</div>

					{!isRegister && (
						<Tabs
							activeKey={loginType}
							onChange={setLoginType}
							items={items}
							centered
						/>
					)}

					<Form
						name="login_form"
						className="login-form"
						initialValues={{ remember: true }}
						onFinish={onFinish}
						size="large"
					>
						{isRegister && (
							<Form.Item
								name="username"
								rules={[
									{
										required: true,
										message: "请输入用户名!",
									},
								]}
							>
								<Input
									prefix={<UserOutlined />}
									placeholder="用户名"
								/>
							</Form.Item>
						)}

						{(loginType === "phone" && !isRegister) ? (
							<>
								<Form.Item
									name="phone"
									rules={[
										{
											required: true,
											message: "请输入手机号!",
										},
									]}
								>
									<Input
										prefix={<MobileOutlined />}
										placeholder="手机号"
									/>
								</Form.Item>
								<Form.Item
									name="code"
									rules={[
										{
											required: true,
											message: "请输入验证码!",
										},
									]}
								>
									<div
										style={{ display: "flex", alignItems: "center", gap: "8px" }}
									>
										<Input
											prefix={
												<SafetyCertificateOutlined />
											}
											placeholder="验证码"
										/>
										<Button>获取验证码</Button>
									</div>
								</Form.Item>
							</>
						) : (
							<>
								<Form.Item
									name="email"
									rules={[
										{
											required: true,
											message: "请输入邮箱!",
										},
										{
											type: "email",
											message: "请输入有效的邮箱地址!",
										},
									]}
								>
									<Input
										prefix={<MailOutlined />}
										placeholder="邮箱地址"
									/>
								</Form.Item>
								<Form.Item
									name="password"
									rules={[
										{
											required: true,
											message: "请输入密码!",
										},
										{
											min: 8,
											message: "密码长度至少8位",
										}
									]}
								>
									<Input.Password
										prefix={<LockOutlined />}
										placeholder="密码"
									/>
								</Form.Item>
							</>
						)}
						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								className="login-btn"
								block
								loading={loading}
							>
								{isRegister ? "注册" : "登录"}
							</Button>
						</Form.Item>

						<div style={{ textAlign: "center", color: "#a3aed0" }}>
							{isRegister ? "已有账号? " : "还没有账号? "}
							<a 
								style={{ color: "#4318ff", cursor: "pointer" }}
								onClick={() => setIsRegister(!isRegister)}
							>
								{isRegister ? "立即登录" : "立即注册"}
							</a>
						</div>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default Login;
