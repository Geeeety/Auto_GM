from __future__ import annotations

import argparse
import os
import subprocess
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parent
BACKEND_DIR = ROOT / "backend"
FRONTEND_DIR = ROOT / "frontend"
CONDA_ENV = os.environ.get("AUTOGM_CONDA_ENV", "auto_gm")
BACKEND_HOST = os.environ.get("AUTOGM_BACKEND_HOST", "127.0.0.1")
BACKEND_PORT = os.environ.get("AUTOGM_BACKEND_PORT", "8000")
FRONTEND_HOST = os.environ.get("AUTOGM_FRONTEND_HOST", "127.0.0.1")


def backend_command(reload: bool = True) -> list[str]:
    command = [
        "conda",
        "run",
        "-n",
        CONDA_ENV,
        "uvicorn",
        "autogm_api.main:app",
        "--host",
        BACKEND_HOST,
        "--port",
        BACKEND_PORT,
    ]

    if reload:
        command.append("--reload")

    return command


def frontend_command() -> list[str]:
    return ["npm", "run", "dev", "--", "--host", FRONTEND_HOST]


def run_command(command: list[str], cwd: Path, env: dict[str, str] | None = None) -> int:
    print_command(command, cwd)
    return subprocess.call(command, cwd=cwd, env=env)


def start_process(
    name: str,
    command: list[str],
    cwd: Path,
    env: dict[str, str] | None = None,
) -> subprocess.Popen[bytes]:
    print_command(command, cwd, name=name)
    return subprocess.Popen(command, cwd=cwd, env=env)


def backend_env() -> dict[str, str]:
    env = os.environ.copy()
    env["PYTHONDONTWRITEBYTECODE"] = "1"
    pythonpath = str(BACKEND_DIR / "src")
    existing = env.get("PYTHONPATH")
    env["PYTHONPATH"] = pythonpath if not existing else f"{pythonpath}{os.pathsep}{existing}"
    return env


def print_command(command: list[str], cwd: Path, name: str | None = None) -> None:
    prefix = f"[{name}] " if name else ""
    print(f"{prefix}cwd={cwd}")
    print(f"{prefix}$ {' '.join(command)}", flush=True)


def run_dev() -> int:
    processes = [
        start_process("backend", backend_command(reload=True), BACKEND_DIR, backend_env()),
        start_process("frontend", frontend_command(), FRONTEND_DIR),
    ]

    print("\nAuto_GM development services are starting:")
    print(f"- Backend:  http://{BACKEND_HOST}:{BACKEND_PORT}")
    print(f"- API docs: http://{BACKEND_HOST}:{BACKEND_PORT}/docs")
    print(f"- Frontend: check the Vite Local URL printed above\n")

    try:
        while True:
            for process in processes:
                return_code = process.poll()
                if return_code is not None:
                    stop_processes(processes)
                    return return_code
            time.sleep(0.2)
    except (KeyboardInterrupt, SystemExit):
        stop_processes(processes)
        return 130


def stop_processes(processes: list[subprocess.Popen[bytes]]) -> None:
    for process in processes:
        if process.poll() is None:
            process.terminate()

    for process in processes:
        if process.poll() is None:
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()


def run_test() -> int:
    return run_command(
        ["conda", "run", "-n", CONDA_ENV, "python", "-m", "pytest"],
        BACKEND_DIR,
        backend_env(),
    )


def run_lint() -> int:
    frontend_status = run_command(["npm", "run", "lint"], FRONTEND_DIR)
    if frontend_status != 0:
        return frontend_status

    return run_command(
        ["conda", "run", "-n", CONDA_ENV, "python", "-m", "pytest"],
        BACKEND_DIR,
        backend_env(),
    )


def run_build() -> int:
    return run_command(["npm", "run", "build"], FRONTEND_DIR)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Auto_GM local development launcher.")
    parser.add_argument(
        "command",
        nargs="?",
        default="dev",
        choices=("dev", "backend", "frontend", "test", "lint", "build"),
        help="Command to run. Defaults to dev.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    if args.command == "dev":
        return run_dev()
    if args.command == "backend":
        return run_command(backend_command(reload=True), BACKEND_DIR, backend_env())
    if args.command == "frontend":
        return run_command(frontend_command(), FRONTEND_DIR)
    if args.command == "test":
        return run_test()
    if args.command == "lint":
        return run_lint()
    if args.command == "build":
        return run_build()

    raise ValueError(f"Unsupported command: {args.command}")


if __name__ == "__main__":
    raise SystemExit(main())
