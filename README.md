# Auto_GM

Auto_GM 是一个可视化驱动的个人量化交易系统。当前阶段先完成本地 Dashboard、FastAPI 后端、mock API 和前后端联调，后续再逐步接入真实数据、策略、回测、风控和模拟交易。

## 当前进度

第一周已完成：

- 前端 Dashboard 基础页面
- FastAPI 后端骨架
- 后端 mock API
- 前端调用后端 API
- 根目录 `main.py` 联合启动器

当前页面包括：

- 总览
- 数据中心
- 策略实验室
- 回测中心
- 模拟交易
- 风控中心
- 系统日志

## 项目结构

```text
Auto_GM/
  main.py                # 本地开发统一启动器
  requirements.txt       # Python 依赖
  README.md
  PROJECT_PLAN.md
  第一周规划.md

  frontend/              # React + TypeScript + Vite Dashboard
  backend/               # FastAPI 后端
  quant_core/            # 后续量化核心逻辑
  configs/               # 配置文件
  data/                  # 本地数据、回测结果、日志
  docs/                  # 学习笔记和架构文档
  scripts/               # 辅助脚本
```

## 环境要求

- Conda 环境：`auto_gm`
- Python：建议 3.11+
- Node.js + npm

当前项目默认使用 conda 环境名：

```text
auto_gm
```

如果以后环境名不同，可以通过环境变量覆盖：

```bash
export AUTOGM_CONDA_ENV=your_env_name
```

## 首次安装

激活 Python 环境：

```bash
conda activate auto_gm
```

安装 Python 依赖：

```bash
python -m pip install -r requirements.txt
```

安装前端依赖：

```bash
cd frontend
npm install
cd ..
```

## 启动项目

推荐在项目根目录启动：

```bash
cd /Users/jaffery/Desktop/Auto_GM
conda activate auto_gm
python main.py
```

`python main.py` 默认等同于：

```bash
python main.py dev
```

它会同时启动：

```text
后端 FastAPI: http://127.0.0.1:8000
接口文档:     http://127.0.0.1:8000/docs
前端 Vite:   以终端输出的 Local URL 为准，通常是 http://127.0.0.1:5173
```

停止项目：

```text
在运行窗口按 Ctrl+C
```

## 常用命令

同时启动前端和后端：

```bash
python main.py
```

或显式执行：

```bash
python main.py dev
```

只启动后端：

```bash
python main.py backend
```

只启动前端：

```bash
python main.py frontend
```

运行后端测试：

```bash
python main.py test
```

运行前端 lint 和后端测试：

```bash
python main.py lint
```

构建前端：

```bash
python main.py build
```

查看可用命令：

```bash
python main.py --help
```

## 当前后端 API

```text
GET /health
GET /api/overview
GET /api/market/bars/mock
GET /api/strategies/mock
GET /api/backtests/mock
GET /api/risk/mock
GET /api/logs/mock
```

接口文档启动后可查看：

```text
http://127.0.0.1:8000/docs
```

## 开发说明

前端会优先请求 FastAPI 后端。如果后端未启动，前端会自动使用本地 fallback mock 数据，避免页面白屏。

当前阶段的数据仍是 mock 数据，目的是先跑通：

```text
前端界面 -> 后端 API -> 标准数据结构 -> 前端展示
```

后续步骤会逐步替换为真实数据层、策略层和回测层。
